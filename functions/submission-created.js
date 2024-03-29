const querystring = require('querystring');
var https = require('https');

exports.handler = function (event, context, callback) {
	const body = JSON.parse(event.body).payload;
	var post_data = querystring.stringify(
		body.data
	);
  
var genComms = false;
if (body.data.OptIn == "on") {
	genComms = true;
}

var eventComms = false;
if (body.data.subscribeToEvents1 == "on") {
	eventComms = true;
}

var post_data2 = {
  "fields": [
    {
      "name": "email",
      "value": body.data.emailAddress
    },
    {
      "name": "firstname",
      "value": body.data.firstName
    },
    {
      "name": "lastname",
      "value": body.data.lastName
    },
    {
      "name": "company",
      "value": body.data.company
    },
    {
      "name": "eloqua_country",
      "value": body.data.country
    },
    {
      "name": "phone",
      "value": body.data.busPhone
    },
    {
      "name": "message",
      "value": body.data.paragraphText
    {
      "name": "utm_campaign",
      "value": body.data.utm_campaign
    },
    {
      "name": "utm_medium",
      "value": body.data.utm_medium
    },
    {
      "name": "utm_source",
      "value": body.data.utm_source	    
    }
  ],
  "context": {
    "pageUri": body.data.referrer,
    "pageName": body.data.asset,
    "ipAddress": body.data.ip
  },
  "legalConsentOptions": {
    "consent": { 
	"consentToProcess": true,
	"text": "Please complete the form below and we will contact you shortly. We take data privacy very seriously and will not share your details. Read our privacy policy.",	 	
      "communications": [ 
        {
          "value": genComms,
          "subscriptionTypeId": 11618778,
          "text": "Subscribe to Email Communications: Email content round-ups, hints and tips to help you improve marketing effectiveness"
        },
        {
          "value": eventComms,
          "subscriptionTypeId": 11619957,
          "text": "Subscribe to Events and Webinars: Adhoc email notifications about upcoming events and webinars"
        }
      ]
    }
  }
}  

if (body.data.hutk != "") {
	post_data2.context.hutk = body.data.hutk;
}
	
console.log(post_data2);

	// An object of options to indicate where to post to
	var post_options2 = {
		host: 'api.hsforms.com',
		port: '443',
		path: '/submissions/v3/integration/submit/8865266/' + body.data.formGuid,
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		}
	};
		
  // Set up the request
  var post_req2 = https.request(post_options2, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
		callback(null, {
			statusCode: 200,
			body:  "Done" 
		});
		console.log( "200: " + chunk );      
      });
      res.on('error', function (e) {
		callback(null, {
			statusCode: 400,
			body:  "Failed" 
		});
		console.log( "Failed " + e );
      });

  });
	
  // post the data
  post_req2.write(JSON.stringify(post_data2));
  post_req2.end();
  
}
