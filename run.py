import os
import sys
import subprocess
import time
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"

def main():
    print("==================================================")
    print("       SKILLATLAS AI STUDIO — LAUNCHING           ")
    print("         Learn. Experiment. Build.                ")
    print("==================================================")

    # 1. Start Backend FastAPI on port 8000
    python_bin = str(BACKEND_DIR / "venv" / "Scripts" / "python.exe")
    env = os.environ.copy()
    env["PYTHONPATH"] = str(BACKEND_DIR)

    print("-> Starting FastAPI Backend on http://localhost:8000 ...")
    backend_proc = subprocess.Popen(
        [python_bin, "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"],
        cwd=str(BACKEND_DIR),
        env=env
    )

    # 2. Start Frontend Next.js on port 3000
    print("-> Starting Next.js Studio on http://localhost:3000 ...")
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=str(FRONTEND_DIR),
        shell=True
    )

    print("\n[READY] SkillAtlas AI Studio is running!")
    print("Frontend UI: http://localhost:3000")
    print("Backend API: http://localhost:8000/docs\n")
    print("Press Ctrl+C to stop both servers.")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping SkillAtlas AI Studio servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("Shutdown complete.")

if __name__ == "__main__":
    main()
