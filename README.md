![Playbox logo](https://github.com/cjdenio/playbox/blob/master/img/logo_dark_small.png)
# Playbox

![GitHub All Releases](https://img.shields.io/github/downloads/cjdenio/playbox/total.svg)
![GitHub issues](https://img.shields.io/github/issues/cjdenio/playbox.svg)

Playbox is a system for playing back audio during live productions.

## Get Playbox

You can download installers over at the [Releases](https://github.com/cjdenio/playbox/releases/latest) page. 

## Build it

Playbox was built in Javascript with Electron. Here's how to build it yourself.
1. Install Node.js and Git (Git is optional)
2. Run `node -v` and `npm -v` in your terminal to ensure that you have both Node.js and NPM installed.
    * A little note, NPM is installed with Node.js. Don't worry about installing it.
3. If you have Git installed, run `git clone https://github.com/cjdenio/playbox.git`.
Otherwise, just download the repository.
4. In your terminal, `cd` to the Playbox directory (`Playbox-master` if you downloaded it from GitHub)
5. Run `npm install` to install Electron and other required goodies
6. Finally, run `npm start` to run Playbox.

## Package it

1. To create an installer, first install `electron-builder` with `npm install electron-builder -g`. The `-g` is necessary.
2. `cd` into the Playbox directory.
3. Run the `build` command in your terminal with either `-w` `-m` or `-l` to build for Windows, MacOS, or Linux. Example: `build -w` to build for Windows.
4. Your installer has now been created in the `dist/` directory.
