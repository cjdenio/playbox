const { app, BrowserWindow, Menu, dialog } = require('electron');
const ipc = require('electron').ipcMain;

let mainWindow;
let stageDisplay;
let createCueWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({ width: 800, height: 600, icon: "img/icon.png" });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.on('closed', () => {
        mainWindow = null;
        app.quit();
    });
}

function createCreateCueWindow() {
    createCueWindow = new BrowserWindow({ width: 400, height: 300, autoHideMenuBar: true, icon: "img/icon.png", resizable: false, parent: mainWindow, modal: true });
    createCueWindow.loadURL(`file://${__dirname}/windows/createCueWindow.html`);
    createCueWindow.on('closed', () => {
        createCueWindow = null;
    });
}

function createStageDisplay() {
    stageDisplay = new BrowserWindow({ width: 600, height: 300, icon: "img/icon.png", autoHideMenuBar: true });
    stageDisplay.loadURL(`file://${__dirname}/windows/stageDisplay.html`);
    stageDisplay.on('closed', () => {
        stageDisplay = null;
    });
}
var menu = Menu.buildFromTemplate([
    {
        label: "File",
        submenu: [
            {
                label: "Create Cue",
                click() {
                    createCreateCueWindow();
                },
                accelerator: "CmdOrCtrl+N"
            },
            {
                role: "quit",
                accelerator: "CmdOrCtrl+Q"
            }
        ]
    },
    {
        label: "View",
        submenu: [
            {
                role: "toggledevtools"
            },
            {
                label: "Toggle Full Screen",
                accelerator: "CmdOrCtrl+F",
                click() {
                    let currentWindow = BrowserWindow.getFocusedWindow();
                    if (currentWindow.isFullScreen()) {
                        currentWindow.setFullScreen(false);
                    }
                    else {
                        currentWindow.setFullScreen(true);
                    }
                }
            },
            { type: "separator" },
            {
                label: "Stage Display",
                click() {
                    if (!stageDisplay) {
                        createStageDisplay();
                    }
                    else {
                        stageDisplay.focus();
                    }
                }
            }
        ]
    }
]);

Menu.setApplicationMenu(menu);

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
    app.quit();
});

ipc.on('show-stage-display', (event, args) => {
    if (!stageDisplay) {
        createStageDisplay();
    }
    else {
        stageDisplay.focus();
    }
})
ipc.on('create-cue', (event, args) => {
    console.log(args.cueName);
    console.log(args.audioFile);
    console.log(args.cueColor);
    mainWindow.webContents.send('create-cue', args);
    createCueWindow.hide();
});

ipc.on('update-stage-display', (event, args) => {
    console.log(args);
    if (stageDisplay) {
        stageDisplay.webContents.send('update-stage-display', args);
    }
});