// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

export function GetRenderArray() {

// Set the region
  AWS.config.update({region: 'us-west-1'});

// Create S3 service object
  const s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Create the parameters for calling listObjects
  const bucketParams = {
    Bucket: 'source-media-sum',
    Delimiter: '/',
    Prefix: 'renders/'
  };

// Call S3 to obtain a list of the objects in the bucket
  s3.listObjects(bucketParams, (err, data) => {
    // Create Render Array
    const RenderList = [];
    if (err) {
      console.log('Error', err);
    } else {
      // Iterate through Contents to retrieve each render
      data.Contents.forEach((object) => {
        if (object.Key !== 'renders/') {
          const objectParams = {
            Bucket: 'source-media-sum',
            Key: object.Key
          };
          s3.headObject(objectParams, (err1, data1) => {
            if (err) {
              console.log('Error', err1);
            } else {
              const RenderObject = {
                Key: data1.Key,
                Sentiment: data1.Metadata.sentiment,
                Chronology: data1.Metadata.chronology
              };
              RenderList.push(RenderObject);
            }
          });
        }
      });
    }
    return RenderList;
  });
}
