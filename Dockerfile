# ── Stage: runtime ────────────────────────────────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

# System deps needed for C-extension packages in the dependency chain.
# gcc + pkg-config are used at pip-install time; libmysqlclient is included
# for forward-compatibility if mysqlclient is ever swapped in.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        default-libmysqlclient-dev \
        pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies first so this layer is cached on code-only changes.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Application code
COPY main.py .

EXPOSE 8000

# Bind to 0.0.0.0 so the container's port is reachable from the host.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
