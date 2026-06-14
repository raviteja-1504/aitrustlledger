"""
data_pipeline.py

A configurable data processing pipeline that fetches records from a
remote API, validates them, transforms them, caches results, and
writes a summary report. Designed to be highly modular and testable.
"""

from __future__ import annotations

import json
import logging
import time
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Any, Callable, Iterable, Optional, Protocol

# ──────────────────────────────────────────────────────────────────────────
# Constants
# ──────────────────────────────────────────────────────────────────────────

DEFAULT_TIMEOUT_SECONDS: int = 30
DEFAULT_RETRY_ATTEMPTS: int = 3
DEFAULT_RETRY_BACKOFF_SECONDS: float = 1.5
DEFAULT_CACHE_TTL_SECONDS: int = 600
DEFAULT_PAGE_SIZE: int = 100
MAX_RECORDS_PER_BATCH: int = 500

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

# ──────────────────────────────────────────────────────────────────────────
# Enums and data models
# ──────────────────────────────────────────────────────────────────────────

class RecordStatus(Enum):
    """Represents the lifecycle status of a single record."""

    PENDING = "pending"
    VALID = "valid"
    INVALID = "invalid"
    PROCESSED = "processed"
    FAILED = "failed"

@dataclass
class Record:
    """A single unit of data flowing through the pipeline."""

    record_id: str
    payload: dict[str, Any]
    status: RecordStatus = RecordStatus.PENDING
    error_message: Optional[str] = None
    processed_at: Optional[float] = None

    def mark_valid(self) -> None:
        """Mark this record as having passed validation."""
        self.status = RecordStatus.VALID
        self.error_message = None

    def mark_invalid(self, reason: str) -> None:
        """Mark this record as invalid with a human-readable reason."""
        self.status = RecordStatus.INVALID
        self.error_message = reason

    def mark_processed(self, timestamp: float) -> None:
        """Mark this record as successfully processed."""
        self.status = RecordStatus.PROCESSED
        self.processed_at = timestamp

    def mark_failed(self, reason: str) -> None:
        """Mark this record as failed during processing."""
        self.status = RecordStatus.FAILED
        self.error_message = reason

@dataclass
class PipelineConfig:
    """Configuration options for the data pipeline."""

    source_name: str
    timeout_seconds: int = DEFAULT_TIMEOUT_SECONDS
    retry_attempts: int = DEFAULT_RETRY_ATTEMPTS
    retry_backoff_seconds: float = DEFAULT_RETRY_BACKOFF_SECONDS
    cache_ttl_seconds: int = DEFAULT_CACHE_TTL_SECONDS
    page_size: int = DEFAULT_PAGE_SIZE
    required_fields: list[str] = field(default_factory=lambda: ["id", "name", "value"])

@dataclass
class PipelineSummary:
    """Aggregate statistics produced after a pipeline run."""

    total_records: int = 0
    valid_records: int = 0
    invalid_records: int = 0
    processed_records: int = 0
    failed_records: int = 0
    duration_seconds: float = 0.0

    def to_dict(self) -> dict[str, Any]:
        """Return a JSON-serialisable representation of this summary."""
        return {
            "total_records": self.total_records,
            "valid_records": self.valid_records,
            "invalid_records": self.invalid_records,
            "processed_records": self.processed_records,
            "failed_records": self.failed_records,
            "duration_seconds": round(self.duration_seconds, 4),
        }

# ──────────────────────────────────────────────────────────────────────────
# Caching
# ──────────────────────────────────────────────────────────────────────────

class TTLCache:
    """A simple in-memory cache with per-entry time-to-live expiry."""

    def __init__(self, ttl_seconds: int = DEFAULT_CACHE_TTL_SECONDS) -> None:
        self._ttl_seconds = ttl_seconds
        self._store: dict[str, tuple[Any, float]] = {}

    def get(self, key: str) -> Optional[Any]:
        """Return the cached value for `key`, or None if missing/expired."""
        entry = self._store.get(key)
        if entry is None:
            return None
        value, expires_at = entry
        if time.monotonic() > expires_at:
            del self._store[key]
            return None
        return value

    def set(self, key: str, value: Any) -> None:
        """Store `value` under `key` with the configured TTL."""
        expires_at = time.monotonic() + self._ttl_seconds
        self._store[key] = (value, expires_at)

    def clear(self) -> None:
        """Remove all entries from the cache."""
        self._store.clear()

    def __len__(self) -> int:
        return len(self._store)

# ──────────────────────────────────────────────────────────────────────────
# Retry decorator
# ──────────────────────────────────────────────────────────────────────────

def with_retries(
    attempts: int = DEFAULT_RETRY_ATTEMPTS,
    backoff_seconds: float = DEFAULT_RETRY_BACKOFF_SECONDS,
) -> Callable[[Callable[..., Any]], Callable[..., Any]]:
    """Return a decorator that retries the wrapped function on exception."""

    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            last_error: Optional[Exception] = None
            for attempt in range(1, attempts + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as exc:  # noqa: BLE001
                    last_error = exc
                    logger.warning(
                        "Attempt %d/%d for %s failed: %s",
                        attempt, attempts, func.__name__, exc,
                    )
                    if attempt < attempts:
                        time.sleep(backoff_seconds * attempt)
            assert last_error is not None
            raise last_error

        return wrapper

    return decorator

# ──────────────────────────────────────────────────────────────────────────
# Data source protocol + implementations
# ──────────────────────────────────────────────────────────────────────────

class DataSource(Protocol):
    """Protocol describing anything that can yield raw records."""

    def fetch_page(self, offset: int, limit: int) -> list[dict[str, Any]]:
        """Fetch a single page of raw records starting at `offset`."""
        ...

    def total_count(self) -> int:
        """Return the total number of records available."""
        ...

class InMemoryDataSource:
    """A `DataSource` backed by a static in-memory list, useful for tests."""

    def __init__(self, records: list[dict[str, Any]]) -> None:
        self._records = records

    def fetch_page(self, offset: int, limit: int) -> list[dict[str, Any]]:
        """Return a slice of the in-memory records."""
        return self._records[offset:offset + limit]

    def total_count(self) -> int:
        """Return the total number of in-memory records."""
        return len(self._records)

class JSONFileDataSource:
    """A `DataSource` backed by a JSON file containing a list of records."""

    def __init__(self, file_path: Path) -> None:
        self._file_path = file_path
        self._records: Optional[list[dict[str, Any]]] = None

    def _load(self) -> list[dict[str, Any]]:
        if self._records is None:
            with self._file_path.open("r", encoding="utf-8") as handle:
                data = json.load(handle)
            if not isinstance(data, list):
                raise ValueError(f"Expected a JSON array in {self._file_path}")
            self._records = data
        return self._records

    def fetch_page(self, offset: int, limit: int) -> list[dict[str, Any]]:
        """Return a slice of the records loaded from the JSON file."""
        records = self._load()
        return records[offset:offset + limit]

    def total_count(self) -> int:
        """Return the total number of records in the JSON file."""
        return len(self._load())

# ──────────────────────────────────────────────────────────────────────────
# Validation
# ──────────────────────────────────────────────────────────────────────────

class ValidationError(Exception):
    """Raised when a record fails validation."""

def validate_record(record: Record, required_fields: Iterable[str]) -> None:
    """
    Validate that `record.payload` contains all `required_fields` and that
    the `value` field, if present, is numeric.

    Raises:
        ValidationError: if any required field is missing or malformed.
    """
    missing = [field_name for field_name in required_fields if field_name not in record.payload]
    if missing:
        raise ValidationError(f"Missing required fields: {', '.join(missing)}")

    value = record.payload.get("value")
    if value is not None and not isinstance(value, (int, float)):
        raise ValidationError(f"Field 'value' must be numeric, got {type(value).__name__}")

# ──────────────────────────────────────────────────────────────────────────
# Transformation
# ──────────────────────────────────────────────────────────────────────────

def normalize_record(record: Record) -> dict[str, Any]:
    """
    Produce a normalised copy of `record.payload`:
      - strips whitespace from string fields
      - lowercases the 'name' field
      - rounds the 'value' field to two decimal places
    """
    normalized: dict[str, Any] = {}
    for key, value in record.payload.items():
        if isinstance(value, str):
            normalized[key] = value.strip()
        else:
            normalized[key] = value

    if "name" in normalized and isinstance(normalized["name"], str):
        normalized["name"] = normalized["name"].lower()

    if "value" in normalized and isinstance(normalized["value"], (int, float)):
        normalized["value"] = round(float(normalized["value"]), 2)

    return normalized
