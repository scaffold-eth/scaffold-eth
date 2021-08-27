# 📚 Background Info

This scaffold-eth branch introduces a file upload component. 

🗝️ Currently, there are two ways to get data uploaded to IPFS...

1). Calling the 'addToIPFS' hook in a component in your app:
```bash
const addToIPFS = async fileToUpload => {
        for await (const result of ipfs.add(fileToUpload)) {
            return result
        }
    }
```
or

2). Using the manifest approach which is showcased in the buyer-mints-nft branch:

Here the developer edits the 'artwork.js' file and publishes it via the 'upload.js' script.
This script uses the smae 'addToIPFS' hook that is shown in option one, the difference is this script can do a batch deploy of all your files/artwork. 

✴️ 3). This branch introduces a third method. Here we allow the user to upload an image to S3, IPFS, or both. Using S3 can be a convient database for all your images and their hashes you have uploaded. While still following best practices of NFT creation and using IPFS to generate the metadata hash.

    3a. Sign in to AWS console or create account for free.

    3b. Navigate to the S3 service and create a bucket for you image data. It is important to set the permissions for this bucket to be public. Next update the 'Bucket Policy' to a very simple policy crated with the policy generator.
    
    ```bash
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicRead",
                "Effect": "Allow",
                "Principal": "*",
                "Action": [
                    "s3:GetObject",
                    "s3:GetObjectVersion"
                ],
                "Resource": "arn:aws:s3:::adaptiveclaim/*"
            }
        ]
    }

    ```

    Next update the CORS policy with again a very simple policy which allows the 'PUT', 'HEAD', and 'GET' methods on this bucket.

    ```bash
    [
        {
            "AllowedHeaders": [
                "*"
            ],
            "AllowedMethods": [
                "PUT",
                "HEAD",
                "GET"
            ],
            "AllowedOrigins": [
                "*"
            ],
            "ExposeHeaders": []
        }
    ]
    ```

    Save and create the bucket.

    3c. Navigate to the Lambda aws services and set up the Lambda function that processes requests from the client application. 

    Click 'Create Function', name the function getPresignedImageUrl with node.js runtime enviroment. 

    In the code tab copy and paste the following.

    ```bash
    const AWS = require('aws-sdk')
    AWS.config.update({ region: process.env.AWS_REGION })
    const s3 = new AWS.S3()

    const uploadBucket = "adaptiveclaim"

    // Change this value to adjust the signed URL's expiration
    const URL_EXPIRATION_SECONDS = 300

    // Main Lambda entry point
    exports.handler = async (event) => {
    return await getUploadURL(event)
    }

    const getUploadURL = async function(event) {
    const randomID = parseInt(Math.random() * 10000000)
    const Key = `${randomID}.jpg`

    // Get signed URL from S3
    const s3Params = {
        Bucket: uploadBucket,
        Key,
        Expires: URL_EXPIRATION_SECONDS,
        ContentType: 'image/jpeg',

        // This ACL makes the uploaded object publicly readable. You must also uncomment
        // the extra permission for the Lambda function in the SAM template.

        // ACL: 'public-read'
    }

    console.log('Params: ', s3Params)
    const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params)

    return JSON.stringify({
        uploadURL: uploadURL,
        Key
    })
    }
    ```





Upload image to AWS bucket via API Gateway/ Lambda Function.

(AWS Docs for uploading to s3 from client)[https://aws.amazon.com/blogs/compute/uploading-to-amazon-s3-directly-from-a-web-or-mobile-application/]

Review section titled: 'Overview of serverless uploading to S3'. This is the main authentication flow for making PUT requests to an aws s3 bucket. 


# 🏄‍♂️ Quick Start

Prerequisites: [Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork 🏗 scaffold-eth:

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git image-upload-ipfs
cd image-upload-ipfs
git checkout image-upload-ipfs
```

> install and start your 👷‍ Hardhat chain:

```bash
cd image-upload-ipfs
yarn install
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```bash
cd image-upload-ipfs
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

```bash
cd image-upload-ipfs
yarn deploy
```
