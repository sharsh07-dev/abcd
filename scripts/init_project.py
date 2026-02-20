import os
import shutil

def init_project():
    # 1. Ensure directories exist
    dirs = [
        "backend/results",
        "backend/workspace",
        "backend/logs"
    ]
    for d in dirs:
        os.makedirs(d, exist_ok=True)
        # Add .gitkeep to ensure they stay in git if user removes ignore later
        with open(os.path.join(d, ".gitkeep"), "w") as f:
            f.write("")
    
    print("✅ Project directories initialized.")
    
    # 2. Check for .env
    if not os.path.exists(".env"):
        if os.path.exists(".env.example"):
            shutil.copy(".env.example", ".env")
            print("📝 Created .env from .env.example. Please update your API keys!")
        else:
            print("⚠️ .env file missing and no .env.example found.")
    else:
        print("✅ .env file found.")

if __name__ == "__main__":
    init_project()
