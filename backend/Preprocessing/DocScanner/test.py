# Import Rectifier
from rectifier import Rectifier

# Khởi tạo 1 lần
rectifier = Rectifier()

# Rectify ảnh
output_img = rectifier.rectify('../images/image (1).jpg')

# output_img bây giờ là PIL.Image

# Ví dụ lưu ra file
print('saving rectified image...')
output_img.save('./rectified_image (1).png')
