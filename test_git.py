import git
import os
import shutil
from pathlib import Path

# setup fresh repo
if os.path.exists("test_repo"): shutil.rmtree("test_repo")
os.makedirs("test_repo/src")
Path("test_repo/src/main.py").write_text("print('hello')\n")
repo = git.Repo.init("test_repo")
repo.git.add(A=True)
repo.index.commit("init")

# modify
Path("test_repo/src/main.py").write_text("print('hello world')\n")

try:
    abs_path = os.path.abspath("test_repo/src/main.py")
    repo.index.add([abs_path])
    print("SUCCESS")
except Exception as e:
    print("FAILED:", e)
