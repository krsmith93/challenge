const electron = require("electron");
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const url = require("url");

const { readSettings, writeSettings } = require("./settings");

let mainWindow;

function createWindow() {
  readSettings().then(({ height, width, x, y }) => {
    mainWindow = new BrowserWindow({ width, height, x, y });

    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true
      })
    );

    mainWindow.on("closed", function() {
      mainWindow = null;
    });

    mainWindow.on("resize", function(e) {
      const [width, height] = e.sender.getSize();
      readSettings().then(settings =>
        writeSettings({ ...settings, width, height })
      );
    });

    mainWindow.on("move", function(e) {
      const [x, y] = e.sender.getPosition();
      readSettings().then(settings => writeSettings({ ...settings, x, y }));
    });
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});
