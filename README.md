# THIS PROJECT IS DEPRECATED

We are not using this repo anymore, and we lack the manpower and the experience needed to maintain it. We are aware of the inconveniece that this may cause you. Feel free to use it as is, or create your own fork. See https://github.com/nordnet/cordova-hot-code-push-cli/issues/79 for more information.

# Cordova Hot Code Push Plugin CLI client

This is a command line utility for [Cordova Hot Code Push Plugin](https://github.com/nordnet/cordova-hot-code-push). It will help you with development and deploy changes to your Cordova application via hot code push, without the need to submit your changes to the Apple App Store or Google Play.

Main features are:

- Automatically generate configuration files, required for Hot Code Push plugin (`chcp.json` and `chcp.manifest`).
- Run local server in order to detect any changes you make in your web project and instantly upload them on the devices.
- Deploy your web project on the external servers with the single command. For now it only supports deployment on the Amazon servers. More deployment targets will be added later.

## Documentation

- [Installation](#installation)
- [How to use](#how-to-use)
- [Commands](#commands)
  - [Init command](#init-command)
  - [Build command](#build-command)
- [Default configuration file](#default-configuration-file)
- [Ignored files list](#ignored-files-list)
- [Normal workflow scheme](#normal-workflow-scheme)
- [Local development workflow scheme](#local-development-workflow-scheme)

### Installation

You can install CLI client using `npm install` (current stable 1.1.1):

```sh
npm install -g cordova-hot-code-push-cli
```

It is also possible to install via repo url directly (**unstable**):

```sh
npm install -g https://github.com/nordnet/cordova-hot-code-push-cli.git
```

### How to use

```sh
cordova-hcp <command>
```

Where `<command>` can be:

- `init` - initialize project parameters, create default `cordova-hcp.json` file.
- `build` - build project files, generate `chcp.json` and `chcp.manifest` files in the `www` folder. Prepare for deployment

All commands should be executed in the root folder of your Cordova project. For example, lets assume you have a Cordova `TestProject` with the following structure:

```
TestProject/
  config.xml
  hooks/
  node_modules/
  platforms/
  plugins/
  www/
```

Then `cordova-hcp` commands should be executed in the `TestProject` folder.

### Commands

#### Init command

```sh
cordova-hcp init
```

Initialization command for CLI client. Generates default application configuration file (`cordova-hcp.json`) in the projects root folder. This file is used later on for `build` and `deploy`.

When executed - you will be asked to fill in some project preferences from the command line:

- `Project name` - your current project name. **Required**.
- `iOS app identifier` - applications id on the App Store. Used to redirect user to the applications page on the store.
- `Android app identifier` - applications package name by which we reference app on the Google Play.
- `Update method` - when to perform the update. Supports three keys:
  - `start` - install updates when application is launched;
  - `resume` - install update when application is resumed (moved from background to foreground state) or launched; **used by default**;
  - `now` - install update as soon as it is loaded from the server.

For example, execute `init` in your project root folder and fill preferences as below:

```
Running init
Please provide: Enter project name (required):  TestProject
Please provide: IOS app identifier:  id123456789
Please provide: Android app identifier:  com.example.chcp.testproject
Please provide: Update method (required):  (resume) start
Project initialized and cordova-hcp.json file created.
If you wish to exclude files from being published, specify them in .chcpignore
Before you can push updates you need to run "cordova-hcp login" in project directory
```

As a result, content of the `cordova-hcp.json` file will be:

```json
{
  "name": "TestProject",
  "ios_identifier": "id123456789",
  "android_identifier": "com.example.chcp.testproject",
  "update": "start",
  "content_url": "https://s3-eu-west-1.amazonaws.com/chcp-test"
}
```

You can skip initialization for local development process when you execute

```sh
cordova-hcp server
```

More details about `server` command can be found below.

#### Build command

```sh
cordova-hcp build [www_directory]
```

where:

- `[www_directory]` - path to the directory with your web project. If not specified - `www` is used.

Command is used to prepare project for deployment and to generate plugin specific configuration files inside `www` folder:

- `chcp.json` - holds release related information.
- `chcp.manifest` - holds information about web project files: their names (relative paths) and hashes.

When executed - you will see in the terminal window:

```
Running build
Build 2015.09.07-11.20.55 created in /Cordova/TestProject/www
```

As a result, `chcp.json` and `chcp.manifest` files are generated in the `www` folder and project is ready for deployment.

More information about those configs can be found on [Cordova Hot Code Push plugin](https://github.com/nordnet/cordova-hot-code-push) documentation page.

### Default configuration file

As mentioned in [Init command](#init-command) section of the readme - after executing `cordova-hcp init` command you will get a default configuration file, called `cordova-hcp.json`. It is created in the root folder of your project. When you run `cordova-hcp build` - data from that file is used to generate `chcp.json` file in `www` folder.

If you want - you can create `cordova-hcp.json` manually and put in there any options you want. It's just a JSON object like so:

```json
{
  "update": "start",
  "content_url": "https://mycoolserver.com/mobile_content/"
}
```

By default, you would probably put in there your `content_url`. But it can also be any other setting.

### Ignored files list

By default, CLI client ignores all hidden files, and files from the following list:

```
chcp.json
chcp.manifest
package.json
node_modules/*
```

But if you want - you can extend this list like so:

1. Create `.chcpignore` file in the root of your Cordova Project (for example, `/Cordova/TestProject/.chcpignore`).
2. Add ignored files. For example:

```
dirty.html
images/*
libs/*
```

As a result, those files will be excluded from the `chcp.manifest`, and ignored by the `server` in local development mode.

If you want - you can add comments by using `#` like this:

```
# Ignore libraries
libs/*

# Ignore images
images/*
```

### Normal workflow scheme

1. Initialize:

```sh
cordova-hcp init
```

2. Build your project:

```sh
cordova-hcp build
```

3. When new version is ready - repeat steps `1.` and `2.`.
