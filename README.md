# OCR App - DocScanner

A personal project that implements an Optical Character Recognition (OCR) application with image processing techniques for document scanning. The application uses React for the frontend and a custom model called **DocScanner** for backend processing. It supports features like page recognition, grayscale conversion, background normalization, and Otsu thresholding for better text extraction.

## 🚀 Features

- **Image Upload**: Users can upload images for text extraction.
- **Page Recognition**: Automatically detects the document's page using the **DocScanner** model.
- **Preprocessing**: Includes grayscale conversion, background normalization, and Otsu thresholding for improved OCR accuracy.
- **Text Extraction**: Extracts text from images using Tesseract OCR.
- **Intuitive UI**: Simple and easy-to-use interface built with React.

## 🛠️ Tech Stack

- **Frontend**: ReactJS
- **Backend**: Python (Flask) with DocScanner model
- **OCR Engine**: Tesseract OCR
- **Image Processing**: OpenCV, Pillow
- **Page Recognition Model**: DocScanner

## To run the backend
- cd backend
- Install all the required Python dependencies from the requirements.txt
- Run the app.py
## To run the frontend
- cd main
- run the React app: npm start

