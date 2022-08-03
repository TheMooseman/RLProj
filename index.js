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
            pathLoc = result.filePaths[0];
            win.webContents.send('retPath', result.filePaths[0]);
        }).catch(err => {
            console.log(err)
          })
    });

    ipcMain.handle('listReplays', (event, args) => {
        let replays = [];
        fs.readdir(args, function (err, files) {
            if(err){
                return console.log('failed to read files');
            }
            files.forEach(function (file){
                if(path.extname(file).toLowerCase() === '.replay'){
                    let locArgs = '/' + file;
                    var joinPath = pathLoc.concat(locArgs);
                    let retDate;
                    let info = fs.statSync(joinPath);
                    let date_ob = info.mtime;
                    let date = ("0" + date_ob.getDate()).slice(-2);
                    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                    let year = date_ob.getFullYear();
                    let hours = date_ob.getHours();
                    let minutes = date_ob.getMinutes();
                    let seconds = date_ob.getSeconds();

                    if(minutes < 10){
                        minutes = "0" + minutes;
                    }
                    if(hours > 12){
                        hours = hours - 12;
                        minutes = minutes + "pm";
                    }else{
                        minutes = minutes + "am";
                    }
                    retDate = (hours + ":" + minutes + " " + monthFromNum(month-1) + " " + date + " " + year);

                    let replayObj = [retDate, file];
                    win.webContents.send('addReplay', replayObj);
                }
            })
        })
        return replays;
    });

    ipcMain.on('getReplayInfo', (event, args) => {

    });
});

function getDateOnReplay(replay){

}

function monthFromNum(month){
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month];
}