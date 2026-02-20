import sys
import os
import logging

# Robust Git Detection for restricted environments
def setup_git_env():
    import shutil
    git_path = shutil.which("git")
    
    # Common paths for Git if not in PATH (especially Mac/Linux)
    search_paths = ["/usr/bin/git", "/usr/local/bin/git", "/opt/homebrew/bin/git"]
    if not git_path:
        for p in search_paths:
            if os.path.exists(p):
                git_path = p
                break
    
    if git_path:
        os.environ["GIT_PYTHON_GIT_EXECUTABLE"] = git_path
        logging.info(f"Git detected at: {git_path}")
    else:
        logging.warning("Git binary not found in PATH or standard locations.")

    # Suppress GitPython warning spam
    os.environ["GIT_PYTHON_REFRESH"] = "quiet"

setup_git_env()

# Ensure root is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Basic logging early on
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("api-entry")

try:
    logger.info("Initializing api-entry...")
    from api.main import app
    logger.info("FastAPI app imported successfully.")
except Exception as e:
    logger.error(f"Failed to import app from api.main: {e}")
    import traceback
    logger.error(traceback.format_exc())
    # Re-raise so Vercel can see the failure in logs
    raise

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
