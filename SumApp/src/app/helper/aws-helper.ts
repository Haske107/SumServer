// Load the AWS SDK for Node.js
let AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'us-west-1'});

// Create S3 service object
let s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Create the parameters for calling listObjects
let bucketParams = {
  Bucket : 'source-media-sum',
  Delimiter: '/',
  Prefix: 'renders/'
};

// Call S3 to obtain a list of the objects in the bucket
s3.listObjects(bucketParams, (err, data) => {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data);
  }
});
