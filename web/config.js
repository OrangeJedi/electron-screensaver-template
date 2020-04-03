//Global constants
//Set up persistent read/write for storing all of our settings
const Store = require('electron-store');
const store = new Store();

//Updates all the <input> tags with their proper values. Called on page load
function displaySettings() {
    let checked = ["showText"];
    for (let i = 0; i < checked.length; i++) {
        document.getElementById(checked[i]).checked = store.get(checked[i]);
    }
    let numTxt = ["text"];
    for (let i = 0; i < numTxt.length; i++) {
        document.getElementById(numTxt[i]).value = store.get(numTxt[i]);
    }
}
displaySettings();

//Updates settings
function updateSetting(setting, type) {
    switch (type) {
        case "check":
            store.set(setting, document.getElementById(setting).checked);
            break;
        case "number":
        case "text":
            store.set(setting, document.getElementById(setting).value);
            break;
    }
}