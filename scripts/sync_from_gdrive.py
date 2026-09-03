"""
Google Drive 文件夹自动同步工具
文件夹: https://drive.google.com/drive/folders/1EcB0EHAtN6hgokK3T4sD9_VyrBp8m8ew
"""
import os
import sys
import subprocess

FOLDER_ID = "1EcB0EHAtN6hgokK3T4sD9_VyrBp8m8ew"
TARGET_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".incoming-gdrive"))

def sync():
    os.makedirs(TARGET_DIR, exist_ok=True)
    url = f"https://drive.google.com/drive/folders/{FOLDER_ID}"
    print(f"[GDrive Sync] Downloading updates from {url} to {TARGET_DIR} ...")
    cmd = [sys.executable, "-m", "gdown", "--folder", url, "-O", TARGET_DIR]
    res = subprocess.run(cmd)
    if res.returncode == 0:
        files = [f for f in os.listdir(TARGET_DIR) if not f.startswith(".")]
        print(f"[GDrive Sync] Success! Found {len(files)} files in staging.")
    else:
        print("[GDrive Sync] Error occurred during sync.")

if __name__ == "__main__":
    sync()
