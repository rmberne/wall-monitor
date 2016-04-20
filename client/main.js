'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// YAML parsers
const YAML = require('yamljs');
// Config path
const configPath = "config.yml";

function init() {
  let screens = YAML.load(configPath) || [];

  for(var index = 0; index < screens.length; index++) {
    let screen = screens[index];
    screen.id = index;
    let windows = createWindowsFor(screen);
    rotate(windows, screen.rotation);
  }
}

function createWindowsFor(screen) {
  let windows = [];
  let display = getDisplay(screen.id);
  for(var i = 0; i < screen.urls.length; i++) {
    let window = createWindow(display, screen.urls[i]);
    windows.push(window);
  }
  return windows;
}

function createWindow(display, url) {
  let options = {
    x: display.bounds.x,
    y: display.bounds.y,
    frame: false
  };
  let window = new BrowserWindow(options);
  window.loadURL(url);
  window.maximize();
  window.setFullScreen(true);
  return window;
}

function rotate(windows, every) {
  // Only change focus if any of the windows already has focus
  // otherwise the user might be doing something else and we steal
  // focus
  if(BrowserWindow.getFocusedWindow()) {
    windows[0].focus();
    // Rotate the array
    windows.push(windows.shift());
  }
  setTimeout(function () { rotate(windows, every); }, every);
}

function getDisplay(index) {
  let screen = require('screen');
  let displays = screen.getAllDisplays();
  if (index < displays.length) {
    return displays[index];
  }
  throw "Not enough displays available!";
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', init);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit();
});