const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('node:path')
const {
  RELEASES_PAGE,
  checkGithubUpdate,
  isNewerVersion,
} = require('./githubUpdate.cjs')
const { startLanServer } = require('./lanServer.cjs')

/** Vite dev server URL used during `npm run electron:dev`. */
const DEV_SERVER_URL = 'http://localhost:5173'

let autoUpdater = null
try {
  ;({ autoUpdater } = require('electron-updater'))
} catch {
  autoUpdater = null
}

/** @type {{ running: boolean, port: number | null, urls: string[], lanUrls: string[], error: string | null }} */
let lanStatus = {
  running: false,
  port: null,
  urls: [],
  lanUrls: [],
  error: null,
}
let stopLanServer = null

async function startDesktopLanServer() {
  const rootDir = path.join(__dirname, '..', 'dist')
  const proxyOrigin = app.isPackaged ? null : DEV_SERVER_URL
  try {
    const started = await startLanServer({ rootDir, proxyOrigin })
    stopLanServer = started.stop
    lanStatus = {
      running: true,
      port: started.port,
      urls: started.urls,
      lanUrls: started.lanUrls,
      error: null,
    }
  } catch (err) {
    lanStatus = {
      running: false,
      port: null,
      urls: [],
      lanUrls: [],
      error: err && err.message ? err.message : String(err),
    }
  }
}

function isMailtoUrl(url) {
  return /^mailto:/i.test(url)
}

function isHttpUrl(url) {
  return /^https?:/i.test(url)
}

function sendUpdateEvent(payload) {
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send('updates:event', payload)
  }
}

function setupAutoUpdater() {
  if (!autoUpdater) return
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true
  autoUpdater.allowPrerelease = false
  autoUpdater.on('download-progress', (progress) => {
    sendUpdateEvent({
      type: 'progress',
      percent: progress && typeof progress.percent === 'number' ? progress.percent : 0,
    })
  })
  autoUpdater.on('update-downloaded', (info) => {
    sendUpdateEvent({
      type: 'downloaded',
      version: info && info.version,
    })
  })
  autoUpdater.on('error', (err) => {
    sendUpdateEvent({
      type: 'error',
      message: err && err.message ? err.message : String(err),
    })
  })
}

function createWindow() {
  const win = new BrowserWindow({
    width: 560,
    height: 860,
    minWidth: 420,
    minHeight: 720,
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

  // Open http(s) (new window) and mailto: in the OS, not inside the app window.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (isHttpUrl(url) || isMailtoUrl(url)) void shell.openExternal(url)
    return { action: 'deny' }
  })
  win.webContents.on('will-navigate', (event, url) => {
    if (!isMailtoUrl(url)) return
    event.preventDefault()
    void shell.openExternal(url)
  })

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  } else {
    win.loadURL(DEV_SERVER_URL)
  }
}

function registerUpdateIpc() {
  ipcMain.handle('updates:version', () => app.getVersion())

  ipcMain.handle('updates:check', async () => {
    const current = app.getVersion()
    let canAutoInstall = false
    let updaterInfo = null
    if (autoUpdater && app.isPackaged) {
      try {
        const result = await autoUpdater.checkForUpdates()
        updaterInfo = result && result.updateInfo
        canAutoInstall = Boolean(
          updaterInfo && isNewerVersion(updaterInfo.version, current),
        )
      } catch {
        canAutoInstall = false
      }
    }

    try {
      const fromGithub = await checkGithubUpdate(
        current,
        process.platform,
        canAutoInstall,
      )
      if (fromGithub) return fromGithub
    } catch {
      // Fall through to electron-updater metadata when GitHub API is blocked.
    }

    if (
      updaterInfo &&
      isNewerVersion(updaterInfo.version, current)
    ) {
      const notes =
        typeof updaterInfo.releaseNotes === 'string'
          ? updaterInfo.releaseNotes
          : ''
      return {
        available: true,
        version: updaterInfo.version,
        title: updaterInfo.releaseName || `Version ${updaterInfo.version}`,
        notes,
        htmlUrl: RELEASES_PAGE,
        downloadUrl: RELEASES_PAGE,
        downloadLabel: null,
        canAutoInstall,
      }
    }

    return { available: false, current }
  })

  ipcMain.handle('updates:download', async () => {
    if (autoUpdater && app.isPackaged) {
      try {
        await autoUpdater.downloadUpdate()
        return { ok: true, mode: 'auto' }
      } catch (err) {
        return {
          ok: false,
          mode: 'external',
          error: err && err.message ? err.message : String(err),
        }
      }
    }
    return { ok: false, mode: 'external' }
  })

  ipcMain.handle('updates:install', () => {
    if (autoUpdater && app.isPackaged) {
      autoUpdater.quitAndInstall()
    }
  })

  ipcMain.handle('updates:openExternal', async (_event, url) => {
    if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) return
    await shell.openExternal(url)
  })

  ipcMain.handle('lan:status', () => lanStatus)
}

app.whenReady().then(async () => {
  setupAutoUpdater()
  registerUpdateIpc()
  await startDesktopLanServer()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('before-quit', () => {
  if (stopLanServer) void stopLanServer()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
