
// electron/main.js
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const url = require('url');

// If in development, load environment variables from .env file
if (!app.isPackaged) {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // It's recommended to turn off nodeIntegration and enable contextIsolation for security
      nodeIntegration: false,
      contextIsolation: true,
      // You can create a preload script to expose specific Node.js APIs to your renderer process securely
      // preload: path.join(__dirname, 'preload.js') 
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
    title: 'Picture Animator AI',
  });

  // Determine the path to load. In production, it's a file path. In development, it could be a URL.
  const startUrl = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, '../build/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    : 'http://localhost:3000'; // Assuming your dev server runs on port 3000

  mainWindow.loadURL(startUrl);

  // Open external links in the default browser instead of a new Electron window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Open the DevTools automatically if not in production
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
