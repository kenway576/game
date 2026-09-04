import os
import sys
import gdown

FOLDER_URL = "https://drive.google.com/drive/folders/1EcB0EHAtN6hgokK3T4sD9_VyrBp8m8ew"
TARGET_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".incoming-gdrive"))

def main():
    os.makedirs(TARGET_DIR, exist_ok=True)
    existing_files = set(os.listdir(TARGET_DIR))
    print(f"Checking Google Drive folder... Currently {len(existing_files)} files in .incoming-gdrive.")

    try:
        remote_files = gdown.download_folder(url=FOLDER_URL, skip_download=True)
    except Exception as e:
        print(f"Error retrieving directory listing: {e}")
        return

    print(f"Found {len(remote_files)} total files on Google Drive.")
    new_files = []
    for f in remote_files:
        fname = os.path.basename(f.path)
        if fname not in existing_files:
            new_files.append((f.id, fname))

    print(f"New files to download: {len(new_files)}")
    downloaded = []
    for fid, fname in new_files:
        out_path = os.path.join(TARGET_DIR, fname)
        print(f"Downloading {fname} (ID: {fid}) ...")
        try:
            gdown.download(id=fid, output=out_path, quiet=False)
            if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
                downloaded.append(fname)
            else:
                print(f"Warning: {fname} downloaded but size is invalid.")
        except Exception as err:
            print(f"Error downloading {fname}: {err}")

    print(f"\nDownload summary: Successfully fetched {len(downloaded)} new files.")
    for f in downloaded:
        print(f" - {f}")

if __name__ == "__main__":
    main()
