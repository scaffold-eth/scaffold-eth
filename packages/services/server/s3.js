import aws from 'aws-sdk'
import dotenv from 'dotenv'

dotenv.config()

const region = 'us-east-2'
const bucketName = 'scaffold-pics'
const accessKeyId = process.env.AWS_ACCESSKEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new aws.s3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
})

export async function generateUploadURL() {
    const imageName = "Image name here"

    const params = ({
        Bucket: bucketName,
        Key: imageName,
        Expires: 60
    })

    const uploadURL = await s3.getSignedUrlPromise('putObject', params)
    return uploadURL
}