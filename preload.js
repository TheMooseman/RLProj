const {
    contextBridge,
    ipcRenderer
} = require("electron");

const API = {
    
    // TO INDEX
    openDialog: () => {
        ipcRenderer.send('openMyDialog')
    },

    listReplays: (dirPath) => ipcRenderer.invoke('listReplays', dirPath),

    replayInfo: (replay) => {
        ipcRenderer.send('getReplayInfo', replay);
    },


    // TO RENDERER
    onRetPath: (callback) => {
        ipcRenderer.on("retPath", (event, args) => {
            callback(args);
        })
    },

    retReplayInfo: (callback) => {
        ipcRenderer.on('retReplayInfo', (event, args) => {
            callback(args);
        })
    },

    addReplay: (callback) => {
        ipcRenderer.on("addReplay", (event, args) => {
            callback(args);
        })
    },

}

contextBridge.exposeInMainWorld('api', API);