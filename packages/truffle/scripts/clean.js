const fse = require("fs-extra");

const main = async (callback) => {
  await fse.emptyDir(config.build_directory);
  console.log("All artifacts removed from build directory.",
    "\n",
    "Compile and/or migrate to generate new artifacts");
}

module.exports = main;
