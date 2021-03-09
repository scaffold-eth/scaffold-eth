const watch = require("node-watch");
const { exec } = require("child_process");

const run = () => {
  console.log("Compiling & Generating...");
  exec("npx gulp less", function (error, stdout, stderr) {
    console.log(stdout);
    if (error) console.log(error);
    if (stderr) console.log(stderr);
  });
};

console.log("🔬 Watching Themes...");
watch("./src/themes", { recursive: true }, function (evt, name) {
  console.log("%s changed.", name);
  run();
});
run();
