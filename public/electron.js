const { app, BrowserWindow } = require('electron');
const { ipcMain } = require("electron");

const url = require('url');
const path = require('path');

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'WorkFaster',
        width: 400,
        height: 400,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, "preload.js"), // Path to preload script
            contextIsolation: true,   // Keeps context isolated for security
            nodeIntegration: false,   // Disables Node.js in the renderer (security best practice)
        }
    });

    // We'll use this to check if we're in development
    const isDev = process.env.NODE_ENV === 'development';

    // If in development, load from the React dev server. Otherwise, load from the built file.
    const startUrl = isDev
        ? 'http://localhost:3000' // URL for the dev server
        : url.format({
            pathname: path.join(__dirname, '../build/index.html'), // Production build file
            protocol: 'file:',
            slashes: true,
        });

    // ...

    // ...
        mainWindow.loadURL(startUrl); // load app in electron window

        // Open developer tools automatically
        mainWindow.webContents.openDevTools(); 

// listen for 'close-app' event
// ...

    // listen for 'close-app' event
    ipcMain.on('close-app', () => {
        app.quit();
    })
}

app.whenReady().then(createMainWindow);

// Closes the app completely (except on macOS, where it's common to keep the app running)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Reopens the window if the app is activated and no windows are open (macOS behavior)
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});