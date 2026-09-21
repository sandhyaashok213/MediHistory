from fastapi import FastAPI, UploadFile, File
import pytesseract
from PIL import Image, ImageEnhance, ImageFilter
import io


# =====================================
# Create FastAPI Application
# =====================================

app = FastAPI(
    title="MediHistory AI Service",
    description="OCR and AI summary service for medical documents",
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
    image = Image.open(
        io.BytesIO(contents)
    )

    # =====================================
    # IMAGE PREPROCESSING
    # =====================================

    # Convert image to RGB
    image = image.convert("RGB")

    # Make image larger
    width, height = image.size

    image = image.resize(
        (width * 2, height * 2)
    )

    # Convert to grayscale
    image = image.convert("L")

    # Improve contrast
    image = ImageEnhance.Contrast(
        image
    ).enhance(2.0)

    # Sharpen image
    image = image.filter(
        ImageFilter.SHARPEN
    )

    # =====================================
    # PERFORM OCR
    # =====================================

    extracted_text = pytesseract.image_to_string(
        image,
        config="--psm 6"
    )

    # =====================================
    # RETURN OCR RESULT
    # =====================================

    return {
        "success": True,
        "filename": file.filename,
        "text": extracted_text
    }


# =====================================
# AI Medical Summary Route
# =====================================

@app.post("/summarize")
async def summarize_medical_text(
    data: dict
):

    # Get OCR text
    ocr_text = data.get(
        "text",
        ""
    )

    # Check whether text exists
    if not ocr_text.strip():

        return {
            "success": False,
            "message": "No medical text provided"
        }

    # =====================================
    # CREATE MEDICAL SUMMARY
    # =====================================

    summary = f"""
Medical Document Summary

Extracted Information:

{ocr_text}

Important Note:

This summary is generated from the extracted document text.

The information should be reviewed and verified by a qualified doctor.
""".strip()

    # =====================================
    # RETURN SUMMARY
    # =====================================

    return {
        "success": True,
        "summary": summary
    }
