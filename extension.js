// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const _ = require("lodash");
const path = require("path");
const fs = require("fs");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "xyf-resourceindexer" is now active!'
  );

  // Watch the configuration changed
  vscode.workspace.onDidChangeConfiguration((event) => {
    let configuration = vscode.workspace.getConfiguration();
    let configItems = getConfigItems(configuration);
  });

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "xyf-resourceindexer.buildRes",
    function () {
      // The code you place here will be executed every time your command is executed

      let configuration = vscode.workspace.getConfiguration();
      let configItems = getConfigItems(configuration);
      assetsPath = configItems.assetsPath;
      assetsCfgFileName = configItems.assetsCfgFileName;
      allowSurfix = configItems.allowSurfix;

      let folders = vscode.workspace.workspaceFolders;
      folders.forEach((item) => {
        basePath = item.uri.fsPath;
        initRes();
      });

      // Display a message box to the user
      vscode.window.showInformationMessage(
        `Finished! Check the ${assetsCfgFileName} in ${assetsPath}.`
      );
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

function getConfigItems(configuration) {
  return {
    assetsPath: configuration.get("resourcesindexer.assetsPath"),
    assetsCfgFileName: configuration.get("resourcesindexer.assetsCfgFileName"),
    allowSurfix: configuration.get("resourcesindexer.allowSurfix"),
  };
}

let basePath = "";
let assetsPath = [];
let assetsCfgFileName = "";
let allowSurfix = [];

function initRes() {
  // check the dependencies
  checkDependencies();
  // path list to save file records
  const pathList = [];
  for (let key in assetsPath) {
    const pathJoin = path.join(basePath, assetsPath[key]);
    const pathJsCfgFile = path.join(pathJoin, assetsCfgFileName);
    if (fs.existsSync(pathJsCfgFile)) {
      let err = fs.unlinkSync(pathJsCfgFile);
      // @ts-ignore
      if (err) throw err;
    }
    // fill the pathList, and start with pathJoin we specify.
    let fd = fs.openSync(pathJsCfgFile, "w+");
    getAllFiles(pathList, pathJoin);
    // write the assets.js content into assetsCfgFileName we sepecify.
    fs.writeSync(fd, `// This file is created by xyf-resourceindexer`);
    fs.writeSync(fd, "\r\n");
    pathList.forEach((data) => {
      fs.writeSync(fd, `import ${data.name} from "${data.path}";`);
      fs.writeSync(fd, "\r\n");
    });
    fs.writeSync(fd, "\r\n");
    fs.writeSync(fd, `export {`);
    fs.writeSync(fd, "\r\n");
    pathList.forEach((data) => {
      fs.writeSync(fd, `  ${data.name}`);
      fs.writeSync(fd, "\r\n");
    });
    fs.writeSync(fd, `}`);
    fs.closeSync(fd);
  }
}

/**
 * Dependencies checker for 'lodash'
 */
function checkDependencies() {
  if (!_) throw "Please add 'lodash' package.";
}

/**
 * Recurrence function, filling the pathList with path and name.
 * @param {*} pathList the pathList to fill
 * @param {*} pathJoin joining for next path in recurrence
 * @param {*} dirName dictionary path in this recurrence
 */
function getAllFiles(pathList, pathJoin, dirName = ".") {
  let files = fs.readdirSync(pathJoin);
  files.forEach((file) => {
    let appendPath = path.join(pathJoin, file);
    let stats = fs.statSync(appendPath);
    if (stats.isDirectory()) {
      // Running into recurrence if stats is a directory
      getAllFiles(pathList, appendPath, `${dirName}/${file}`);
    }
    if (stats.isFile()) {
      // Split the file name with '.', and get the last item in splited.
      // Addictionly, get the surfix of file that we could comparing it with the item in allowSurfix specified.
      let splited = file.split(".");
      let surfix = splited[splited.length - 1];
      if (allowSurfix.indexOf(surfix) !== -1) {
        pathList.push({
          path: `${dirName}/${file}`,
          name: getSuitFileName(file, dirName),
        });
      }
    }
  });
}

/**
 * Get the name consist in camel mode
 * @param {*} name
 * @param {*} dirName
 * @returns name in camel mode
 */
function getSuitFileName(name, dirName) {
  let val = _.camelCase(dirName + "_" + name);
  return val;
}

module.exports = {
  activate,
  deactivate,
};
