const { exec } = require('child_process')
const fs = require("fs")
const awsCreds = JSON.parse(fs.readFileSync("aws.json").toString().trim())
//const s3 = require('s3');
const AWS = require('aws-sdk')





///
///
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

/*

let site = "nifty.ink"
let cloudfrontDistro = "E3VS4W1AUZT7E5"
const localDir = "build"

//Setup
var client = s3.createClient({
  s3Options: awsCreds,
});
uploadParams = buildS3Params(site)

//Upload
fs.readdir( localDir+"/" , function( err, files ) {
  if( err ) {
    console.error( "Could not list the directory.", err );
    process.exit( 1 );
  }

  var uploader = client.uploadDir(uploadParams);
  uploader.on('error', function(err) {
    console.error("unable to sync:", err.stack);
  });
  uploader.on('progress', function() {
    console.log("progress", uploader.progressAmount, uploader.progressTotal);
  });
  uploader.on('end', function() {
    console.log("done uploading "+site);
    var cloudfront = new AWS.CloudFront(new AWS.Config(awsCreds));
    var cfparams = {
      DistributionId: cloudfrontDistro,
      InvalidationBatch: {
        CallerReference: ''+(new Date()),
        Paths: {
          Quantity: 1,
          Items: ["/*"]
        }
      }
    };
    cloudfront.createInvalidation(cfparams, function(err, data) {
      if (err) reject(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
  });
})


function buildS3Params(site) {
  site = site.toLowerCase()

  var uploadParams = {
    localDir: localDir,
    s3Params: {
      Bucket: site,
      Prefix: "",
      ACL: "public-read"
    }
  }

  return uploadParams
}
*/



const uploadFile = (fileName) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: site,
        Key: fileName, // File name you want to save as in S3
        Body: fileContent,
        ACL: "public-read"
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};
