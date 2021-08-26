import React, { useState, useEffect } from "react";
import { Button, Input, Col, Row } from 'antd'


export default function BucketToIPFS() {

    const [ signedURL, setSignedURL ] = useState({});
    const [ selectedFile, setSelectedFile ] = useState({});
	const [ isSelected, setIsSelected ] = useState(false);
    const [ url, setURL ] = useState("");


    // When file is selected, get a uploadURL from aws. Use "getPresignedImageUrl" Lambda endpoint URL generated in aws.
    const changeHandler = async (event) => {

        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

		setSelectedFile(event.target.files[0]);
		setIsSelected(true);

        await fetch("https://py1mx7j0eh.execute-api.us-east-1.amazonaws.com/default/getPresignedImageUrl", requestOptions)
        .then(response => response.json())
        .then(result => setSignedURL(result))
        .catch(error => console.log('error', error));
	};

    const handleSubmission = () => {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "image/jpeg");

        let requestOptions2 = {
            method: 'PUT',
            headers: myHeaders,
            body: selectedFile,
            redirect: 'follow'
        };

        fetch(signedURL.uploadURL, requestOptions2)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
	};
	
    console.log("Selected File Properties: ", selectedFile)
    console.log("Signed url: ", signedURL)
    console.log("AWS PIC URL: ", url)

    return (
        <div style={{margin:'32px'}}>
            <Row justify="center">
                <Col span={10}>
                    <Input 
                    type="file"
                    accept="image/*"
                    onChange={changeHandler}
                    />
                    <Button
                    type="primary"
                    onClick={handleSubmission}
                    >
                    Upload to AWS
                    </Button>
                    {isSelected ? (
                        <div>
                            <p>Filename: {selectedFile.name}</p>
                            <p>Filetype: {selectedFile.type}</p>
                            <p>Size in bytes: {selectedFile.size}</p>
                            <p>
                                lastModifiedDate:{' '}
                                {selectedFile.lastModifiedDate.toLocaleDateString()}
                            </p>
                            <p>SignedUrl: {signedURL.uploadURL.slice(0,50)+"..."}</p>
                            <p>Key: {signedURL.Key}</p>
                        </div>
                    ) : (
                        <p>Select a file to show details</p>
                    )}
                </Col>
            </Row>

            <Row justify="center">
                <Col >
                    <Button 
                    onClick={()=>{
                        setURL("https://adaptiveclaim.s3.amazonaws.com/"+signedURL.Key)
                    }}
                    >Preview Uploaded Image
                    </Button>
                </Col>
            </Row>
            <Row justify="center">
                <Col >
                    <img src={url} style={{width:"200px"}}/>
                </Col>
            </Row>
        </div>
    );

}