"use strict";
import { app, BrowserWindow, Menu, screen, Tray } from "electron";
import * as path from "path";
let mainWindow: BrowserWindow;
let tray: Tray;
let createdWindows: BrowserWindow[] = [];

function createWindows(type: string) {
  closeAllWindows();
  const displays = screen.getAllDisplays();
  displays.forEach((display) => {
    const { x, y, width, height } = display.bounds;
    const newWindow = new BrowserWindow({
      x,
      y,
      width,
      height,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        nodeIntegration: true,
        contextIsolation: false,
      },
      kiosk: true,
    });
    newWindow.loadFile(path.join(__dirname, `../screens/${type}.html`));
    newWindow.on("close", () => {
      const index = createdWindows.indexOf(newWindow);
      createdWindows.splice(index, 1);
    });

    newWindow.menuBarVisible = false;
    createdWindows.push(newWindow);
  });
}

function closeAllWindows() {
  createdWindows.forEach((window) => {
    if (window && window.close) {
      window.close();
    }
  });
  createdWindows = [];
}

function createTray() {
  tray = new Tray("./icon.png");
  tray.setToolTip("Screen block");

  const screenTypes = ["Breakfast", "Lunch", "Dinner", "Meeting", "Support"];

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Close",
        click: function () {
          closeAllWindows();
          mainWindow.close();
          app.quit();
        },
      },
      ...screenTypes.map((type) => {
        return {
          label: type,
          click: () => createWindows(type.toLowerCase()),
        };
      }),
    ])
  );
}

app.whenReady().then(() => {
  createTray();
  app.on("activate", () => BrowserWindow.getAllWindows().length === 0);
  createMainWindow();
});

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.hide();
};
