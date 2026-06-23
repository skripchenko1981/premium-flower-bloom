"""Slug generation utilities."""

import re
import unicodedata
from typing import Optional


def slugify(value: str, max_length: Optional[int] = 120) -> str:
    """Convert a string to a URL-friendly slug."""
    # Normalize unicode characters
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    # Lowercase and strip
    value = value.lower().strip()
    # Replace spaces and non-alphanumeric characters
    value = re.sub(r"[^\w\s-]", "", value)
    value = re.sub(r"[-\s]+", "-", value)
    value = re.sub(r"^-+|-+$", "", value)
    if max_length:
        value = value[:max_length].rstrip("-")
    return value or "untitled"
