const DOMAIN = "SUBDOMAIN.buidlguidl.com"

const HOSTEDZONE = "Z29UNW0TCLHYTM" //buidlguidl.com

var AWS = require('aws-sdk');
// Load credentials and set Region from JSON file
AWS.config.loadFromPath('./aws.json');

var route53 = new AWS.Route53();


var params = {
   "HostedZoneId": HOSTEDZONE, // our Id from the first call
   "ChangeBatch": {
     "Changes": [
       {
         "Action": "UPSERT",
         "ResourceRecordSet": {
           "Name": DOMAIN,
           "Type": "A",
           "AliasTarget": {
              "DNSName": "s3-website-us-east-1.amazonaws.com",
              "EvaluateTargetHealth": false,
              "HostedZoneId": "Z3AQBSTGFYJSTF" //look your region up here: https://docs.aws.amazon.com/general/latest/gr/s3.html#s3_website_region_endpoints
           }
         }
       }
     ]
   }
 };

 route53.changeResourceRecordSets(params, function(err,data) {
   console.log(err,data);
 });
