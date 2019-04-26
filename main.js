const { app, BrowserWindow, Menu, dialog } = require('electron');
const ipc = require('electron').ipcMain;

let mainWindow;
let stageDisplay;
let createCueWindow;
let editCueWindow;

let cueData = { cues: [] };

function createMainWindow() {
    mainWindow = new BrowserWindow({ width: 800, height: 600, icon: "img/icon.png", show: false, backgroundColor: "#323232" });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.on('closed', () => {
        mainWindow = null;
        app.quit();
    });
    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
    });
}

function createCreateCueWindow() {
    createCueWindow = new BrowserWindow({ width: 400, height: 300, autoHideMenuBar: true, icon: "img/icon.png", resizable: false, parent: mainWindow, modal: true, show: false });
    createCueWindow.loadURL(`file://${__dirname}/windows/createCueWindow.html`);
    createCueWindow.on('closed', () => {
        createCueWindow = null;
    });
    createCueWindow.on('ready-to-show', () => {
        createCueWindow.show();
        createCueWindow.focus();
    });
}

function createStageDisplay() {
    stageDisplay = new BrowserWindow({ width: 600, height: 300, icon: "img/icon.png", autoHideMenuBar: true, show: false });
    stageDisplay.loadURL(`file://${__dirname}/windows/stageDisplay.html`);
    stageDisplay.on('closed', () => {
        stageDisplay = null;
    });
    stageDisplay.on('ready-to-show', () => {
        stageDisplay.show();
        stageDisplay.focus();
    });
}
function createEditCueWindow() {
    editCueWindow = new BrowserWindow({ width: 400, height: 300, autoHideMenuBar: true, icon: "img/icon.png", resizable: false, parent: mainWindow, modal: true, show: false });
    editCueWindow.loadURL(`file://${__dirname}/windows/editCueWindow.html`);
    editCueWindow.on('closed', () => {
        editCueWindow = null;
    });
    editCueWindow.on('ready-to-show', () => {
        editCueWindow.show();
        editCueWindow.focus();
    });
}
var menu = Menu.buildFromTemplate([
    {
        label: "File",
        submenu: [
            {
                label: "Create Cue",
                click() {
                    if (!createCueWindow) {
                        createCreateCueWindow();
                    }
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

    let cueId = cueData.cues.length + 1;
    args.id = cueId;

    mainWindow.webContents.send('create-cue', args);
    createCueWindow.close();
    mainWindow.focus();

    cueData.cues.push({ id: cueId, name: args.cueName, audioFile: args.audioFile, color: args.cueColor });

    console.log(cueData);
});

ipc.on('update-stage-display', (event, args) => {
    console.log(args);
    if (stageDisplay) {
        stageDisplay.webContents.send('update-stage-display', args);
    }
});

ipc.on('edit-cue', (event, args) => {
    createEditCueWindow();

    let cueToEdit = {};

    for (i = 0; i < cueData.cues.length; i++) {
        if (cueData.cues[i].id == args.id) {
            console.log(cueData.cues[i]);
            cueToEdit = cueData.cues[i];
            break;
        }
    }
    editCueWindow.webContents.once('dom-ready', () => {
        editCueWindow.webContents.send('edit-cue-data', cueToEdit);
    });
});

ipc.on('delete-cue', (event, args) => {
    for (i = 0; i < cueData.cues.length; i++) {
        if (cueData.cues[i].id == args.id) {
            cueData.cues.splice(i, 1);
            console.log(cueData);
            break;
        }
    }
});

ipc.on('edit-cue-save', (event, args) => {
    editCueWindow.close();
    mainWindow.focus();
    console.log("Edits saved.");
    console.log(args);

    // Update JSON representation
    for (i = 0; i < cueData.cues.length; i++) {
        if (cueData.cues[i].id == args.id) {
            cueData.cues[i].name = args.name;
            break;
        }
    }

    mainWindow.webContents.send('actually-edit-cue', args);

    console.log(cueData);
});