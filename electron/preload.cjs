const { contextBridge } = require('electron')

// Mathsachs runs fully in the renderer; expose only harmless metadata so the
// UI can detect that it is running inside the desktop shell if needed.
contextBridge.exposeInMainWorld('mathsachs', {
  isDesktop: true,
  platform: process.platform,
})
