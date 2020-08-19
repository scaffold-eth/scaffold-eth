const fs = require("fs")

const indexFile = "./public/index.html"

let indexBody = fs.readFileSync(indexFile).toString()


let start = indexBody.indexOf(">v")+2
let end = indexBody.indexOf("<",start+1)

let versionString = indexBody.substring(start,end)

let version = parseInt(versionString)

let nextVersion = ""+(version+1)

nextVersion = nextVersion.padStart(4, '0')


indexBody = indexBody.replace(">v"+versionString,">v"+nextVersion)

console.log("📟  Updated version to v"+nextVersion)
fs.writeFileSync(indexFile,indexBody)
