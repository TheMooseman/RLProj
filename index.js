const {app, BrowserWindow, ipcMain} = require('electron');
const fs = require('fs');
const path = require('path');
console.log('Initiation process working');
const { BADHINTS } = require("dns");
const { ipcRenderer } = require("electron");
const electron = require("electron");
const url = require("url");
const {dialog} = require('electron');
const { fstat } = require('fs');
const parser = require('./parser');
const {startParser} = require('./parser');
var pathLoc;
let win;
function createWindow() {
win = new BrowserWindow({
 width: 700,
height: 500,
webPreferences: {
nodeIntegration: true,
enableRemoteModule: true,
contextIsolation: true,
preload: path.join(app.getAppPath(), 'preload.js')
}});
win.loadURL(url.format({
// and load the index.html of the app.
pathname: path.join(__dirname, 'index.html'),
protocol: 'file',
slashes: true
}));
// Open the DevTools.
//win.webContents.openDevTools();
win.on('closed', () => {
win = null;
})
}
app.on('ready', createWindow);
app.on('window-all-closed', () => {
if (process.platform !== 'darwin') {
app.quit()
}
});
app.on('activate', () => {
// On OS X it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
if (BrowserWindow.getAllWindows().length === 0) {
createWindow();
}
});
app.on('activate', () => {
if (win === null) {
createWindow()
}
});

app.whenReady().then(() => {
    

    ipcMain.on('openMyDialog', () => {
        dialog.showOpenDialog({properties: ['openDirectory',]})
        .then(result =>{
            //console.log(result.filePaths);
            pathLoc = result.filePaths[0];
            win.webContents.send('retPath', result.filePaths[0]);
        }).catch(err => {
            console.log(err)
          })
    });

    ipcMain.on('listReplays', (event, args) => {
        fs.readdir(args, function (err, files) {
            if(err){
                return console.log('failed to read files');
            }
            files.forEach(function (file){
                if(path.extname(file).toLowerCase() === '.replay'){
                    win.webContents.send('addReplay', file);
                }
            })
        })
    });

    ipcMain.on('parseReplay', (event, args) => {
        args = '/' + args;
        var joinPath = pathLoc.concat(args);
        startParser(args);
        //var convText = fs.readFileSync(joinPath, 'utf16le');
        //console.log(convText);
    });
});