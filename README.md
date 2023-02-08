# xyf-resourceindexer README

This is an great extension for creating assets' index into a javascript file. Just like how does android develop environment create a R.java resource link for all assets.

## How to use

For example, in your project, we recommend you to put your assets in the path such as `"./src/assets/"`. Including but not limit to `"png","jpg","jpeg"`. This extension will create an index file named `assets.js`, containing all of the assets path and resources exportation filtered by the `allowSurfix`.

> Firstly, press `Ctrl+Shift+P` to open the command line in vscode. And next, input `Build Assets` and press `Enter`.

- Put a `logo.png` into the assets path:

```
/src/assets/logo.png
```

- Enter the `Build Assets` command and see how we do:

```
/src/assets/assets.js
---------------------
// This file is created by xyf-resourceindexer
import logoPng from "./logo.png";

export {
  logoPng
}

```

## Preferences & Settings

| Config Name                        | Default value        |
| ---------------------------------- | -------------------- |
| resourcesindexer.assetsPath        | "./src/assets/"      |
| resourcesindexer.assetsCfgFileName | "assets.js"          |
| resourcesindexer.allowSurfix       | ["png","jpg","jpeg"] |

## Release Notes

### 0.0.1

Initial release of basic command "Build Assets".

### 0.0.2

Fix the console output and put some message on it.

---

## For more information

- [Source code in GitHub](https://github.com/sheeyphone/xyf-resourceindexer)
