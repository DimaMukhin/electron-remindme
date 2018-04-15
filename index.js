const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/main.html`);
    mainWindow.on('closed', () => app.quit());

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 500,
        height: 300,
        title: 'Add a new reminder'
    });

    addWindow.loadURL(`file://${__dirname}/add-reminder.html`);
    addWindow.on('closed', () => addWindow = null);
}

ipcMain.on('reminder:add', (event, reminder) => {
    mainWindow.webContents.send('reminder:add', reminder);
    addWindow.close();
});

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            { 
                label: 'New Reminder',
                click() { createAddWindow(); }
            },
            { 
                label: 'Exit', 
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

if (process.platform === 'darwin') {
    menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'Debug',
        submenu: [
            { role: 'reload' },
            {
                label: 'Toggle dev tools',
                accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }    
        ]
    });
}
