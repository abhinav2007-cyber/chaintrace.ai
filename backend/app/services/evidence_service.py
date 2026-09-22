"""
Evidence Service — SHA-256 hashing, evidence ID generation, file processing.
All operations are deterministic. No AI involvement here.
"""
import hashlib
import re
from datetime import datetime


def hash_bytes(data: bytes) -> str:
    """Return SHA-256 hex digest of raw bytes."""
    return hashlib.sha256(data).hexdigest()


def generate_evidence_id(case_id: str, count: int) -> str:
    """Return a formatted evidence ID like E-004."""
    return f"E-{count:03d}"


def detect_file_type(filename: str) -> str:
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "unknown"
    mapping = {
        "txt": "text/plain",
        "csv": "text/csv",
        "json": "application/json",
        "pdf": "application/pdf",
        "png": "image/png",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "xlsx": "application/vnd.ms-excel",
    }
    return mapping.get(ext, f"application/{ext}")


def decode_content(data: bytes, filename: str) -> str:
    """Best-effort decode of file bytes to text."""
    if filename.lower().endswith((".png", ".jpg", ".jpeg", ".pdf")):
        return f"[Binary file: {filename}]"
    for enc in ("utf-8", "latin-1", "cp1252"):
        try:
            return data.decode(enc)
        except UnicodeDecodeError:
            continue
    return "[Could not decode file content]"


def process_upload(
    file_data: bytes,
    filename: str,
    case_id: str,
    evidence_count: int,
) -> dict:
    """
    Hash the file, generate evidence metadata.
    Returns a dict suitable for creating an Evidence model.
    """
    sha256 = hash_bytes(file_data)
    evidence_id = generate_evidence_id(case_id, evidence_count)
    content = decode_content(file_data, filename)

    return {
        "evidence_id": evidence_id,
        "case_id": case_id,
        "filename": filename,
        "file_type": detect_file_type(filename),
        "sha256_hash": sha256,
        "upload_timestamp": datetime.utcnow().isoformat(),
        "status": "HASH_VERIFIED",
        "content": content,
        "file_size": len(file_data),
    }
