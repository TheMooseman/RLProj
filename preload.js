const {
    contextBridge,
    ipcRenderer
} = require("electron");

const API = {
    onRetPath: (callback) => {
        ipcRenderer.on("retPath", (event, args) => {
            callback(args);
        })
    },
    openDialog: () => {
        ipcRenderer.send('openMyDialog')
    },

    addReplay: (callback) => {
        ipcRenderer.on("addReplay", (event, args) => {
            callback(args);
        })
    },

    listReplays: (dirPath) => ipcRenderer.send('listReplays', dirPath),

    apiParse: (replay) => {
        ipcRenderer.send('parseReplay', replay)
    },

}

contextBridge.exposeInMainWorld('api', API);