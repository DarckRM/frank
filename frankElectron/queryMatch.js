import {BrowserWindow, ipcMain} from "electron";
import {createProtocol} from "vue-cli-plugin-electron-builder/lib";

const createQueryMatchWindow = async (userHeader) => {
  const queryMatchWindow = new BrowserWindow({
    title: 'FrankQueryMatch',
    show: false,
    frame: false,
    resizable: true,
    width: 1166,
    height: 650,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,
      // devTools:false
    }
  })
  queryMatchWindow.on('ready-to-show', () => {
    queryMatchWindow.show()
  })

  // 通过不同的运行指令,选择对应的加载方式
  if (process.env.npm_lifecycle_event === "electron:serve") {
    await queryMatchWindow.loadURL('http://localhost:8080/#/queryMatch', {userAgent: userHeader})

  } else {
    createProtocol('app')
    await queryMatchWindow.loadURL('app://./index.html/#/queryMatch', {userAgent: userHeader})
  }
  return queryMatchWindow
}

export const queryMatchIpc = async (mainWindow,userHeader) => {
  let queryMatchWindow
  // 展示查询战绩窗口
  ipcMain.on('show-query-match',async () => {
    queryMatchWindow = await createQueryMatchWindow(userHeader)
    mainWindow.hide()

  })
// 移动游戏历史窗口
  ipcMain.on('move-query-match-window', (event, pos) => {
    queryMatchWindow.setBounds({ x: pos.x, y: pos.y, width: 1166, height: 650 })
  })
// 最小化游戏历史窗口
  ipcMain.on('query-match-min', () => {
    queryMatchWindow.minimize()
  })
// 关闭游戏历史窗口
  ipcMain.on('query-match-close', () => {
    for (const currentWindow of BrowserWindow.getAllWindows()) {
      if (currentWindow.title === 'QueryMatch'){
        currentWindow.close()
      }
    }
  })
}
