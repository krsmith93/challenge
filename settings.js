const { promisify } = require("util");
const fs = require("fs");
const stat = promisify(fs.stat);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const SETTINGS_PATH = "settings.json";

const DEFAULT_SETTINGS = {
  width: 800,
  height: 600
};

const ensureSettingsExist = () =>
  stat(SETTINGS_PATH).catch(() =>
    writeFile(SETTINGS_PATH, JSON.stringify(DEFAULT_SETTINGS))
  );

const readSettings = () =>
  ensureSettingsExist()
    .then(() => readFile(SETTINGS_PATH))
    .then(settings => settings.toString())
    .then(JSON.parse);

module.exports.readSettings = readSettings;

const writeSettings = newSettings =>
  ensureSettingsExist().then(() =>
    writeFile(SETTINGS_PATH, JSON.stringify(newSettings))
  );

module.exports.writeSettings = writeSettings;
