const express = require('express');
const router  = express.Router();
const smsDialler = require('./util/smsDialler');
const request = require( 'request' );

module.exports = (knex) => {

  function makeBordaCounts( choices, pollID, cb ){
    var totalNumberOfPoints = choices.length;
    var rankedChoices = [];
    knex
      .select( "points" )
      .from( "choices" )
      .where( "poll_id", "=", pollID )
      .orderBy( "choices.id" )
      .then((results) => {
        for(var i=0; i < choices.length; i++){
          var curID = results[ Number(choices[i]) ];
          rankedChoices.push( { "id": curID, borda: totalNumberOfPoints } );
          totalNumberOfPoints--;
        }
        console.log( "rankedChoices", rankedChoices );
        cb( { rankedChoices } );
      });//then
  }

  router.post( '/sms/recvpoll', (req, res) => {
    const smsBody = req.body.Body;
    var phoneNumber = req.body.From;
    phoneNumber = phoneNumber.slice( 2 ); //remove the +1

    var domain = (String(req.rawHeaders).split(","))[1];

    var path = req.url;
    console.log( "****************************** Req *************************\n", req );
/*
    const rankedChoices = req.body.rankedChoices;
    const publicPollKey = req.params.key;
    //const hostName = req.headers.host;
*/
    var processedBody = smsBody.replace(/\,/g, ' ').replace(/\s+/g, ' ');
    var bodyArray = processedBody.split(' ');
    console.log( "***Body Array***:", bodyArray );
    knex
      .select( "polls.id", "public_key" )
      .from( "phone_numbers" )
      .join( "polls_to_phone_numbers", "phone_number_id", "=", "phone_numbers.id" )
      .join( "polls", "polls.id", "=", "poll_id" )
      .where( "phone_number", Number( phoneNumber ) )
      .where( "public_key", "like", bodyArray[0]+"%" )
      .then((results) => {
        if( results.length === 1 ){

          makeBordaCounts( bodyArray.slice(1), results[0]["id"], function( rankedChoices) {
            console.log( "domain: ", domain );

            request.post( "http://" + domain + "/polls/" + results[0].public_key).form( rankedChoices );
          });


          /*express.({
            method: "POST",
            url:  process.env.DB_HOST + ":" + process.env.DB_PORT + "/polls/" +
              results[0].public_key,
            data: { rankedChoices }
          })
          .done( function( msg ) {
            res.end("sms success");
          })
          .fail( function(err) {
            console.log( "POST from POST failed; ", err );
          });*/
        }
        else
        {
          console.log( "Results:", results );
          console.log( "Database issue, results of sql query not exactly 1" );
          res.status(404)
          res.send("404 - Page not found")
        }
      }) //then(pollIDs)
}) //router post
  return router;
}


