# TrayWrapper
Electron-based systemtray application that shows a webpage, configurable via startup parameters.

Usage instructions:
TrayWrapper.exe --site=https://example.com --icon=C:\path\to\icon.ico --width=500 --height=max --name="My Custom App"

Build instructions:
Put icon and main.js into folder and run: electron-packager . TrayWrapper --platform=win32 --arch=x64 --out=dist --overwrite
