"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
function GetRenderArray() {
    // Set the region
    AWS.config.update({ region: 'us-west-1' });
    // Create S3 service object
    var s3 = new AWS.S3({ apiVersion: '2006-03-01' });
    // Create the parameters for calling listObjects
    var bucketParams = {
        Bucket: 'source-media-sum',
        Delimiter: '/',
        Prefix: 'renders/'
    };
    // Call S3 to obtain a list of the objects in the bucket
    s3.listObjects(bucketParams, function (err, data) {
        // Create Render Array
        var RenderList = [];
        if (err) {
            console.log('Error', err);
        }
        else {
            // Iterate through Contents to retrieve each render
            data.Contents.forEach(function (object) {
                if (object.Key !== 'renders/') {
                    var objectParams = {
                        Bucket: 'source-media-sum',
                        Key: object.Key
                    };
                    s3.headObject(objectParams, function (err1, data1) {
                        if (err) {
                            console.log('Error', err1);
                        }
                        else {
                            var RenderObject = {
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
exports.GetRenderArray = GetRenderArray;
