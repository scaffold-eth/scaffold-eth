const s3FolderUpload = require("s3-folder-upload");
const fs = require("fs");

const directoryName = "build";

const BUCKETNAME = "butterfly.claims"; // <<---- SET YOUR BUCKET NAME AND CREATE aws.json ** see below vvvvvvvvvv


const invalidation = {
  awsDistributionId: "E1QFVQNAATCYLL",
  awsInvalidationPath: "/*"
}


if (!BUCKETNAME) {
  console.log("☢️   Enter a bucket name in packages/react-app/scripts/s3.js ");
  process.exit(1);
}

let credentials = {};
try {
  credentials = JSON.parse(fs.readFileSync("aws.json"));
} catch (e) {
  console.log(e);
  console.log(
    '☢️   Create an aws.json credentials file in packages/react-app/ like { "accessKeyId": "xxx", "secretAccessKey": "xxx", "region": "xxx" } ',
  );
  process.exit(1);
}

credentials.bucket = BUCKETNAME;

// optional options to be passed as parameter to the method
const options = {
  useFoldersForFileTypes: false,
  useIAMRoleCredentials: false,
};

/////////////
///////////// First, let's automatically create the bucket if it doesn't exist...
/////////////

var AWS = require('aws-sdk');
// Load credentials and set Region from JSON file
AWS.config.loadFromPath('./aws.json');

// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Create params JSON for S3.createBucket
var bucketParams = {
  Bucket : BUCKETNAME,
  ACL : 'public-read'
};

// Create params JSON for S3.setBucketWebsite
var staticHostParams = {
  Bucket: BUCKETNAME,
  WebsiteConfiguration: {
  ErrorDocument: {
    Key: 'index.html'
  },
  IndexDocument: {
    Suffix: 'index.html'
  },
  }
};

// Call S3 to create the bucket
s3.createBucket(bucketParams, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Bucket URL is ", data.Location);
    // Set the new policy on the newly created bucket
    s3.putBucketWebsite(staticHostParams, function(err, data) {
      if (err) {
        // Display error message
        console.log("Error", err);
      } else {
        // Update the displayed policy for the selected bucket
        console.log("Success... UPLOADING!", data);

        ///
        /// After the bucket is created, we upload to it:
        ///
        s3FolderUpload(directoryName, credentials, options  , invalidation );
      }
    });
  }
});
