from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS 
import os
from werkzeug.utils import secure_filename
from PIL import Image
from Preprocessing.DocScanner.rectifier import Rectifier
from io import BytesIO
import base64
import shutil
import pytesseract
import io
# Set path to Tesseract executable (change if installed elsewhere)
pytesseract.pytesseract.tesseract_cmd = r"C:/Program Files/Tesseract-OCR/tesseract.exe"

rectifier = Rectifier()

app = Flask(__name__)

CORS(app, origins=["http://localhost:3000"])

# Local folders for image processing
PROCESSED_FOLDER = './processed'
UPLOAD_FOLDER = './uploads'
RESULTS_FOLDER = './results'

# Helper to clean up a folder (delete all files/subfolders)
def clear_directory(directory: str):
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        if os.path.isdir(file_path):
            shutil.rmtree(file_path)
        else:
            os.remove(file_path)

# Create necessary folders if they don't exist
if not os.path.exists(PROCESSED_FOLDER):
    os.makedirs(PROCESSED_FOLDER)
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
if not os.path.exists(RESULTS_FOLDER):
    os.makedirs(RESULTS_FOLDER)

@app.route('/api/preprocess', methods=['POST'])
def preprocess_images():
    # Clear out previous uploads and results
    clear_directory(PROCESSED_FOLDER)
    clear_directory(UPLOAD_FOLDER)
    clear_directory(RESULTS_FOLDER)

    files = request.files.getlist('images')

    # Sort files based on index prefix (sent from frontend like "0_filename.jpg")
    files.sort(key=lambda f: int(f.filename.split('_')[0]))

    processed_images = []

    for file in files:
        filename = secure_filename(file.filename)
        file_path = os.path.join('./uploads', filename)
        file.save(file_path)

        # Apply my document rectification process
        processed_image = rectifier.rectify(file_path)

        # Save processed image
        processed_filename = f"processed_{filename}"
        processed_filepath = os.path.join('./processed', processed_filename)
        processed_image.save(processed_filepath)

        # Convert processed image to base64 for frontend preview
        buffered = BytesIO()
        processed_image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')

        processed_images.append(img_str)

    return jsonify({"processedImages": processed_images}), 200

@app.route('/api/ocr', methods=['GET'])
def run_ocr():
    # Grab all processed images (PNG/JPG/JPEG)
    processed_images = [f for f in os.listdir(PROCESSED_FOLDER) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

    results = []

    for image_file in processed_images:
        image_path = os.path.join(PROCESSED_FOLDER, image_file)
        
        if os.path.isfile(image_path):
            img = Image.open(image_path)

            # Run OCR (English only for now)
            text = pytesseract.image_to_string(img, lang='eng')
            # Convert image to base64 for preview
            buffered = io.BytesIO()
            img.save(buffered, format="JPEG")
            img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

            results.append({
                "imageBase64": img_base64,
                "ocrText": text.strip()
            })

    # Save full OCR result to a text file 
    if results:
        full_text = "\n\n".join(item['ocrText'] for item in results)
        result_filename = "ocr_results.txt"
        result_filepath = os.path.join(RESULTS_FOLDER, result_filename)
        with open(result_filepath, 'w', encoding='utf-8') as result_file:
            result_file.write(full_text)

    return jsonify(results), 200

OCR_RESULTS_FILENAME = 'ocr_results.txt'

@app.route('/api/download', methods=['GET'])
def download_results():
    try:
        file_path = os.path.join(RESULTS_FOLDER, OCR_RESULTS_FILENAME)

        if not os.path.exists(file_path):
            return jsonify({'error': 'File not found'}), 404

        # Return the final text file for download
        return send_from_directory(directory=RESULTS_FOLDER, path=OCR_RESULTS_FILENAME, as_attachment=True)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
