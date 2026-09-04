const { contextBridge, ipcRenderer } = require('electron')

// Desktop bridge: metadata plus GitHub/electron-updater update actions.
contextBridge.exposeInMainWorld('mathsachs', {
  isDesktop: true,
  platform: process.platform,
  getVersion: () => ipcRenderer.invoke('updates:version'),
  checkForUpdates: () => ipcRenderer.invoke('updates:check'),
  downloadUpdate: () => ipcRenderer.invoke('updates:download'),
  installUpdate: () => ipcRenderer.invoke('updates:install'),
  openExternal: (url) => ipcRenderer.invoke('updates:openExternal', url),
  getLanStatus: () => ipcRenderer.invoke('lan:status'),
  onUpdateEvent: (callback) => {
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on('updates:event', listener)
    return () => ipcRenderer.removeListener('updates:event', listener)
  },
})
