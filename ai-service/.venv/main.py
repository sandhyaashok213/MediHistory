
from fastapi import FastAPI, UploadFile, File
import pytesseract
from PIL import Image
import io


# =====================================
# Create FastAPI Application
# =====================================

app = FastAPI(
    title="MediHistory AI Service",
    description="OCR service for medical documents",
    version="1.0.0"
)


# =====================================
# Tesseract Configuration
# =====================================

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


# =====================================
# Home Route
# =====================================

@app.get("/")
def home():
    return {
        "success": True,
        "message": "MediHistory AI Service is running"
    }


# =====================================
# OCR Route
# =====================================

@app.post("/ocr")
async def perform_ocr(
    file: UploadFile = File(...)
):
    # Read uploaded file
    contents = await file.read()

    # Convert bytes to image
    image = Image.open(io.BytesIO(contents))

    # Perform OCR
    extracted_text = pytesseract.image_to_string(image)

    return {
        "success": True,
        "filename": file.filename,
        "text": extracted_text
    }
