var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var dateFormat = require('dateformat');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getRenders', function(req, res, next) {
    // Set the region
    AWS.config.update({region: 'us-west-1'});

// Create S3 service object
    var s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Create the parameters for calling listObjects
    var bucketParams = {
        Bucket: 'source-media-sum',
        Delimiter: '/',
        Prefix: 'renders/'
    };

// Call S3 to obtain a list of the objects in the bucket
    s3.listObjects(bucketParams, function (err, data) {
        if (err) {
            res.status('Error').send(err);
        } else {
            // Create Render Array
            var RenderList = [];
            var Count = data.Contents.length;
            // Iterate through Contents to retrieve each render
            data.Contents.forEach(function (object) {
                if (object.Key !== 'renders/') {
                    var objectParams = {
                        Bucket: 'source-media-sum',
                        Key: object.Key
                    };
                    s3.headObject(objectParams, function (err1, data1) {
                        if (err) {
                            res.send('Error', err1);
                        } else {
                            var RenderObject = {
                                Key: object.Key,
                                Sentiment: data1.Metadata.sentiment,
                                Chronology: data1.Metadata.chronology,
                                Date: dateFormat(object.LastModified, "dddd, mmmm dS, yyyy, h:MM:ss TT"),
                                Count: data1.Metadata.count
                            };
                            RenderList.push(RenderObject);

                            if (RenderList.length === Count-1)    {
                                res.send(RenderList) ;
                            }
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
