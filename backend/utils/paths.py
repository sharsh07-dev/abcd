import os

# Base directory for the application
APP_DIR = os.getcwd()

# Check if running in a serverless/read-only environment (like Vercel)
IS_VERCEL = os.environ.get("VERCEL") == "1"

if IS_VERCEL:
    # Use /tmp for writable operations in serverless environments
    BASE_WRITABLE_DIR = "/tmp/codereborn"
else:
    # Use the current project directory for local execution
    BASE_WRITABLE_DIR = os.path.join(APP_DIR, "backend")

# Specific directories
RESULTS_DIR = os.path.join(BASE_WRITABLE_DIR, "results")
WORKSPACE_DIR = os.path.join(BASE_WRITABLE_DIR, "workspace")

# Ensure directories exist
try:
    os.makedirs(RESULTS_DIR, exist_ok=True)
    os.makedirs(WORKSPACE_DIR, exist_ok=True)
except Exception as e:
    # We don't crash here; we just log it. The API will handle missing dirs later.
    print(f"Warning: Could not create directories: {e}")
