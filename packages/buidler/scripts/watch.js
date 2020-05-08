var watch = require('node-watch');
watch('./contracts', { recursive: true }, function(evt, name) {
  console.log('%s changed.', name);

  var exec = require('child_process').exec;

  exec('npx buidler run scripts/deploy.js',  {stdio:'inherit'},function(error, stdout, stderr) {
    console.log(stdout);
    if(error) console.log(error)
    if(stderr) console.log(stderr)

    exec('npx buidler run scripts/publish.js', {stdio:'inherit'}, function(error, stdout, stderr) {
        console.log(stdout);
        if(error) console.log(error)
        if(stderr) console.log(stderr)
    });

  });

});
