//Global vars
//Talk to app.js
const {ipcRenderer} = require('electron');
//Persistent data storage
const Store = require('electron-store');
const store = new Store();

//tell the app to quit itself
function quitApp() {
    ipcRenderer.send('quitApp');
}

//quit when a key is pressed or mouse is moved
document.addEventListener('keydown', (e) => {
    quitApp();
});
document.addEventListener('mousedown', quitApp);
setTimeout(function () {
    const threshold = 5;
    document.addEventListener('mousemove', function (e) {
        if (threshold * threshold < e.movementX * e.movementX
            + e.movementY * e.movementY) {
            quitApp();
        }
    });
}, 1500);

//draw text
if(store.get('showText'))
document.getElementById('text').innerText = store.get('text');