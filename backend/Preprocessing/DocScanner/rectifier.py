from .model import DocScanner
from .seg import U2NETP

import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import cv2
from PIL import Image
import warnings
warnings.filterwarnings('ignore')

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.msk = U2NETP(3, 1)
        self.bm = DocScanner()

    def forward(self, x):
        msk, *_ = self.msk(x)
        msk = (msk > 0.5).float()
        x = msk * x

        bm = self.bm(x, iters=12, test_mode=True)
        bm = (2 * (bm / 286.8) - 1) * 0.99

        return bm

def reload_seg_model(model, path):
    model_dict = model.state_dict()
    pretrained_dict = torch.load(path, map_location=device)
    pretrained_dict = {k[6:]: v for k, v in pretrained_dict.items() if k[6:] in model_dict}
    model_dict.update(pretrained_dict)
    model.load_state_dict(model_dict)
    return model

def reload_rec_model(model, path):
    model_dict = model.state_dict()
    pretrained_dict = torch.load(path, map_location=device)
    pretrained_dict = {k: v for k, v in pretrained_dict.items() if k in model_dict}
    model_dict.update(pretrained_dict)
    model.load_state_dict(model_dict)
    return model

class Rectifier:
    def __init__(self):
        seg_model_path = 'backend/Preprocessing/DocScanner/model_pretrained/seg.pth'
        rec_model_path = 'backend/Preprocessing/DocScanner/model_pretrained/DocScanner-L.pth'
        self.net = Net().to(device)
        self.net.eval()
        reload_seg_model(self.net.msk, seg_model_path)
        reload_rec_model(self.net.bm, rec_model_path)

    def rectify(self, image_path):
        """
        image_path: str (path to input image)
        return: PIL.Image object (rectified image)
        """
        input_image = np.array(Image.open(image_path).convert('RGB'))
        input_image = input_image / 255.0
        h, w, _ = input_image.shape

        im = cv2.resize(input_image, (288, 288))
        im = im.transpose(2, 0, 1)
        im = torch.from_numpy(im).float().unsqueeze(0).to(device)

        with torch.no_grad():
            bm = self.net(im).cpu()

        bm0 = cv2.resize(bm[0, 0].numpy(), (w, h))
        bm1 = cv2.resize(bm[0, 1].numpy(), (w, h))
        bm0 = cv2.blur(bm0, (3, 3))
        bm1 = cv2.blur(bm1, (3, 3))
        lbl = torch.from_numpy(np.stack([bm0, bm1], axis=2)).unsqueeze(0).float()

        input_tensor = torch.from_numpy((input_image * 255).astype(np.uint8)).permute(2, 0, 1).unsqueeze(0).float()

        out = F.grid_sample(input_tensor, lbl, align_corners=True)
        output_array = (out[0].permute(1, 2, 0).numpy()).clip(0, 255).astype(np.uint8)

        # Thêm code để chuyển đổi ảnh đầu ra về định dạng nhị phân
        gray = cv2.cvtColor(output_array, cv2.COLOR_BGR2GRAY)
        bg = cv2.GaussianBlur(gray, (0, 0), sigmaX=50, sigmaY=50)
        flat = cv2.divide(gray, bg, scale=255)
        _, binary = cv2.threshold(
            flat, 0, 255,
            cv2.THRESH_BINARY + cv2.THRESH_OTSU
        )

        # binary = output_array.copy()
        output_image = Image.fromarray(binary)

        return output_image
