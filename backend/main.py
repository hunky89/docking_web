import os
import tempfile
import uuid
from pathlib import Path

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI(title="Docling Converter API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPPORTED_EXTENSIONS = {
    ".pdf", ".docx", ".xlsx", ".xls", ".pptx", ".html", ".htm",
    ".png", ".jpg", ".jpeg", ".tiff", ".bmp", ".csv",
}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/convert")
async def convert_file(file: UploadFile = File(...)):
    suffix = Path(file.filename).suffix.lower()
    if suffix not in SUPPORTED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {suffix}. Supported: {', '.join(sorted(SUPPORTED_EXTENSIONS))}",
        )

    with tempfile.TemporaryDirectory() as tmp_dir:
        input_path = Path(tmp_dir) / f"{uuid.uuid4()}{suffix}"
        input_path.write_bytes(await file.read())

        try:
            from docling.document_converter import DocumentConverter
            converter = DocumentConverter()
            result = converter.convert(str(input_path))
            markdown = result.document.export_to_markdown()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")

    return JSONResponse({
        "filename": file.filename,
        "markdown": markdown,
    })
