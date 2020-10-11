const s3FolderUpload = require('s3-folder-upload')
const fs = require('fs')
const directoryName = 'build'

const BUCKETNAME = "stage.nifty.ink"   // <<---- SET YOUR BUCKET NAME AND CREATE aws.json ** see below vvvvvvvvvv

// optional cloudfront invalidation rule
const invalidation = {
  awsDistributionId: "E1X8E1VRT8NJ1L",
  awsInvalidationPath: "/*"
}


/// this is my AWS cloudfront deploy script
///
/// in aws console, register route53 name, create s3 bucket in virginia with domain's name, set it up as a static site in props and point to index.html
/// (this script uploads to that bucket)
///
/// then use certificate manager in virginia to get SSL for domain, then create a cloundfront distro pointing to :
///     yourbucket.name.s3-website-us-east-1.amazonaws.com
/// with the cert and default object index.html, forward to ssl, compress automatically
/// then put that distro id down below.
///
/// then point Route 53 a record to something like d1ch0i0hy0eywq.cloudfront.net.   <---period at the end


if(!BUCKETNAME){
  console.log('☢️   Enter a bucket name in packages/react-app/s3.js ')
  process.exit(1)
}

let credentials = {}
try{
  credentials = JSON.parse(fs.readFileSync("aws.json"))
}catch(e){
  console.log(e)
  console.log('☢️   Create an aws.json credentials file in packages/react-app/ like { "accessKeyId": "xxx", "secretAccessKey": "xxx", "region": "xxx" } ')
  process.exit(1)
}
//console.log("credentials",credentials)

credentials.bucket = BUCKETNAME

// optional options to be passed as parameter to the method
const options = {
  useFoldersForFileTypes: false,
  useIAMRoleCredentials: false
}


s3FolderUpload(directoryName, credentials, options, invalidation)
