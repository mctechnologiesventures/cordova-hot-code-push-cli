"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.execute = execute;
var _es6Promise = _interopRequireDefault(require("es6-promise"));
var _path = _interopRequireDefault(require("path"));
var _prompt = _interopRequireDefault(require("prompt"));
var _lodash = _interopRequireDefault(require("lodash"));
var _utils = require("./utils.cjs");
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
_es6Promise.default.polyfill();
const configFile = _path.default.join(process.cwd(), "cordova-hcp.json");
const name = {
  description: "Enter project name (required)",
  pattern: /^[a-zA-Z\-\s0-9]+$/,
  message: "Name must be only letters, numbers, space or dashes",
  required: true,
};
const iosIdentifier = {
  description: "IOS app identifier",
  pattern: /^[a-zA-Z\-0-9\.]+$/,
};
const androidIdentifier = {
  description: "Android app identifier",
  pattern: /^[a-zA-Z\-0-9\.]+$/,
};
const update = {
  description: "Update method (required)",
  pattern: /(start|resume|now)/,
  required: true,
  message: "Needs to be one of start, resume or now",
  default: "resume",
};
const schema = {
  properties: {
    name,
    ios_identifier: iosIdentifier,
    android_identifier: androidIdentifier,
    update,
  },
};
const urlSchema = {
  properties: {
    content_url: {
      description:
        "Enter full URL to directory where cordova-hcp build result will be uploaded",
      message: "Must supply URL",
      required: true,
    },
  },
};
function execute(context) {
  _prompt.default.override = context.argv;
  _prompt.default.message = "Please provide";
  _prompt.default.delimiter = ": ";
  _prompt.default.start();
  let result;
  (0, _utils.getInput)(_prompt.default, schema)
    .then(getUrl)
    .then((url) => _lodash.default.assign(result, url))
    .then((content) => (0, _utils.writeFile)(configFile, content))
    .then(done);
}
function getUrl() {
  return (0, _utils.getInput)(_prompt.default, urlSchema);
}
function done(err) {
  if (err) {
    return console.log(err);
  }
  console.log("Project initialized and cordova-hcp.json file created.");
  console.log(
    "If you wish to exclude files from being published, specify them in .chcpignore"
  );
  console.log(
    'Before you can push updates you need to run "cordova-hcp login" in project directory'
  );
}
