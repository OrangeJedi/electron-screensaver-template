//Global variables and modules
//grabs the needed modules from electron
const {app, BrowserWindow, ipcMain, screen} = require('electron');
//'electron-store' is used for storing persistent data
const Store = require('electron-store');
const store = new Store();
//an array to hold the screen saver windows for later use
let screens = [];
// a flag to let the app know if it can quit itself
let nq = false;

//creates the config window
function createConfigWindow(argv) {
    //window settings
    //creates a small bordered window
    let win = new BrowserWindow({
        width: 1000,
        height: 750,
        webPreferences: {
            nodeIntegration: true
        }
    });
    //loads the config HTML file
    win.loadFile('web/config.html');
    //delete the window when closed
    win.on('closed', function () {
        win = null;
    });
    //if a /dt 'dev tools' argument was passed in open the dev tools
    if (argv.includes("/dt")) {
        win.webContents.openDevTools();
    }
}

//launches the screen saver
function createSSWindow() {
    //create a fullscreen window on each display
    let displays = screen.getAllDisplays();
    for (let i = 0; i < screen.getAllDisplays().length; i++) {
        let win = new BrowserWindow({
            width: displays[i].size.width,
            height: displays[i].size.height,
            webPreferences: {
                nodeIntegration: true
            },
            x: displays[i].bounds.x,
            y: displays[i].bounds.y,
            fullscreen: true,
            transparent: true,
            frame: false
        });
        win.setMenu(null);
        //load the screensaver HTML file
        win.loadFile('web/screensaver.html');
        //delete the window when closed
        win.on('closed', function () {
            win = null;
        });
        //hide the cursor
        win.webContents.on('dom-ready', (event) => {
            let css = '* { cursor: none !important; }';
            win.webContents.insertCSS(css);
        });
        //add the window to the global array 'screens' for later access
        screens.push(win);
    }
}

function createTestWindow(argv) {
    //creates a smaller boarder window
    let win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: true
        },
        /*transparent: true,
        frame: false*/
    });
    //loads the screensaver HTML
    win.loadFile('web/screensaver.html');
    //delete the window when closed
    win.on('closed', function () {
        win = null;
    });
    //if a /dt 'dev tools' argument was passed in open the dev tools
    if (argv.includes("/dt")) {
        win.webContents.openDevTools();
    }
}

//when the app is ready run our startup function
app.whenReady().then(startUp);

function startUp() {
    //process.argv contains an array of any cml flags that were sent on startup

    //if the settings hasn't been configured (first time the app is run), or a /rc 'reconfigure' flag is passed in
    //set everything to the default value
    if (!store.get("configured") || process.argv.includes("/rc")) {
        store.set('showText', true);
        store.set('text', "Hello World");
        //put all your stored settings here
        store.set("configured", true);
    }
    //if a /nq 'no-quit' flag is passed in, prevent the app from quiting itself via the nq flag
    if (process.argv.includes("/nq")) {
        nq = true;
    }
    //Handles window opening via flags
    //Windows will pass in 3 different flags to screen savers
    //the /c flag means that app is to open in a 'configuration' mode and is sent when the setting button is clicked.
    //the /p flag should create an instance of the screen saver in the preview pane of the screen saver picker
    //the /s flag tells the app to run the full screen saver, it is sent when the screen saver is activated
    if (process.argv.includes("/c")) {
        //create our config menu - the place where we let our user change any settings
        //Passes in the startup arguments for dev tool support
        createConfigWindow(process.argv);
    } else if (process.argv.includes("/p")) {
        //For technical reasons (see the readme) /p is not implemented. The app will quit instead
        app.quit();
    } else if (process.argv.includes("/s")) {
        //Launch the app into full screen saver mode
        createSSWindow();
    } else if (process.argv.includes("/t")) {
        //a bonus feature, launches the app in screen saver mode in a smaller window
        //Passes in the startup arguments for dev tool support
        createTestWindow(process.argv);
    } else {
        //if no flag were passed quit the app
        app.quit();
    }
}

//listens for messages from the windows
//Quits the app when the 'quitApp' msg is sent, if the ng flag is set to false
ipcMain.on('quitApp', (event, arg) => {
    if (!nq) {
        app.quit();
    }
});