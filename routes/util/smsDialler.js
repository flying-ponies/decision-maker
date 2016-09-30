// Twilio Credentials
var accountSid = process.env.TWILIO_SID;
var authToken = process.env.TWILIO_AUTH;

//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);
module.exports = function( toPhoneNumber, bodyMsg ) {
  client.messages.create({
      to: toPhoneNumber,
      from: "+17782002994",
      body: bodyMsg
  }, function(err, message) {
      //console.log(err, "\n", message);
  });
};
