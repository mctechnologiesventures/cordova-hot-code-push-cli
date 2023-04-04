#! /usr/bin/env node
const path = require("path");
const { argv } = require("yargs");
const chcpContext = require(path.resolve(
  __dirname,
  "..",
  "dist",
  "context.cjs"
));

const cmd = argv._[0];
switch (cmd) {
  case "build":
  case "init":
    console.log("Running " + cmd);
    const command = require(path.resolve(
        __dirname,
        "..",
        "dist",
        cmd + ".cjs"
      )),
      context = chcpContext.context(argv);
    command.execute(context);
    break;
  default:
    console.log("TODO: Should print usage instructions.");
    process.exit(0);
}
