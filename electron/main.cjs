const { app, BrowserWindow, shell } = require('electron')
const path = require('node:path')

/** Vite dev server URL used during `npm run electron:dev`. */
const DEV_SERVER_URL = 'http://localhost:5173'

function createWindow() {
  const win = new BrowserWindow({
    width: 560,
    height: 760,
    minWidth: 420,
    minHeight: 640,
    backgroundColor: '#0b1120',
    title: 'Mathsachs',
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  win.setMenuBarVisibility(false)

  // Open external links in the user's real browser, not inside the app window.
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  } else {
    win.loadURL(DEV_SERVER_URL)
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
