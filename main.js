const { app, BrowserWindow, Tray, Menu, screen } = require('electron');
const path = require('path');
const minimist = require('minimist');

let tray = null;
let popup = null;

// Parse command-line arguments
const args = minimist(process.argv.slice(1));
const websiteURL = args.site || 'https://default-site.com'; // Default site
const trayIconPath = args.icon || path.join(__dirname, 'icon.png'); // Default icon
const windowWidth = parseInt(args.width, 10) || 400; // Default width: 400
let windowHeight = args.height === 'max' ? null : parseInt(args.height, 10) || 600; // Default height: 600
const appName = args.name || 'My Website App'; // Default name

app.whenReady().then(() => {
    // Create system tray icon
    tray = new Tray(trayIconPath);

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Quit', click: () => app.quit() }
    ]);
    tray.setToolTip(appName);
    tray.setContextMenu(contextMenu);

    // Get screen dimensions excluding taskbar
    const primaryDisplay = screen.getPrimaryDisplay();
    const { height: workAreaHeight } = primaryDisplay.workAreaSize;

    if (args.height === 'max') {
        windowHeight = workAreaHeight;
    }

    // Create the popup window
    popup = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        show: false,
        frame: false,
        alwaysOnTop: true,
        resizable: false,
        movable: false,
        transparent: true,
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: false
        }
    });

    popup.loadURL(websiteURL);

    // Handle tray left-click (toggle visibility)
    tray.on('click', () => {
        if (popup.isVisible()) {
            popup.hide();
        } else {
            const trayBounds = tray.getBounds();
            const x = trayBounds.x + trayBounds.width / 2 - windowWidth / 2;
            popup.setBounds({ x, y: 0, width: windowWidth, height: windowHeight });
            popup.show();
        }
    });

    // Hide popup when it loses focus
    popup.on('blur', () => {
        popup.hide();
    });
});
