"""Dump a folder tree + file contents to the console.

Usage:
    python tree_dump.py                 # dumps the current folder
    python tree_dump.py C:\\path\\to\\project
    python tree_dump.py /home/pluto/Project_webstorm/Wet-Sponge

    python tree_dump.py . > dump.txt    # save it to a file instead

Skipped on purpose (never printed):
    - .env, .env.local, and any .env.* file (secrets stay out)
    - .git, node_modules, dist, build, __pycache__, .venv, venv
    - binary files (images, .pyc, etc.) and files over 200 KB
"""

import sys
from pathlib import Path

SKIP_DIRS = {
    ".git", "node_modules", "dist", "build",
    "__pycache__", ".venv", "venv", ".idea", ".vscode",
}

# extensions that are almost always binary - skip them
BINARY_EXTS = {
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".ico",
    ".mp3", ".mp4", ".wav", ".pdf", ".zip", ".exe", ".dll",
    ".pyc", ".woff", ".woff2", ".ttf", ".otf",
}

MAX_BYTES = 200 * 1024  # 200 KB


def is_env_file(path: Path) -> bool:
    name = path.name.lower()
    return name == ".env" or name.startswith(".env.")


def should_skip(path: Path) -> bool:
    if any(part in SKIP_DIRS for part in path.parts):
        return True
    if is_env_file(path):
        return True
    if path.suffix.lower() in BINARY_EXTS:
        return True
    return False


def main() -> None:
    root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    if not root.is_dir():
        print(f"Not a folder: {root}")
        return

    files = []
    skipped_env = []
    for path in sorted(root.rglob("*")):
        if path.is_dir():
            continue
        if is_env_file(path):
            skipped_env.append(path.relative_to(root))
            continue
        if should_skip(path):
            continue
        files.append(path)

    print(f"Folder: {root}\n")
    print("=== TREE ===")
    for path in files:
        print(path.relative_to(root))
    print()

    print("=== FILES ===\n")
    for path in files:
        rel = path.relative_to(root)
        print(f"===== {rel} =====")
        if path.stat().st_size > MAX_BYTES:
            print(f"[skipped: too large, {path.stat().st_size} bytes]\n")
            continue
        try:
            print(path.read_text(encoding="utf-8"))
        except UnicodeDecodeError:
            print("[skipped: binary file]\n")
            continue
        print()

    if skipped_env:
        print("=== SKIPPED (never printed) ===")
        for rel in skipped_env:
            print(f"  {rel}  <- env file, kept out on purpose")


if __name__ == "__main__":
    main()
