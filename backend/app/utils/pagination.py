"""Pagination utilities."""

from math import ceil


def paginate(total: int, page: int, size: int) -> dict:
    """Return pagination metadata."""
    total_pages = ceil(total / size) if size > 0 else 1
    return {
        "page": page,
        "size": size,
        "total": total,
        "total_pages": total_pages,
    }
