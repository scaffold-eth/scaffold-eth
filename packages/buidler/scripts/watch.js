var watch = require('node-watch');

const run = ()=>{
  var exec = require('child_process').exec;
  console.log("🛠  Compiling & Deploying...")
  exec('cd ../../ && yarn run deploy',function(error, stdout, stderr) {
    console.log(stdout);
    if(error) console.log(error)
    if(stderr) console.log(stderr)
  });
}

console.log("🔬 Watching Contracts...")
watch('./contracts', { recursive: true }, function(evt, name) {
  console.log('%s changed.', name);
  run()
});
run()
