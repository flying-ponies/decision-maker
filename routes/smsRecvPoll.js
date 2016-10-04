const express = require('express');
const router  = express.Router();
const smsDialler = require('./util/smsDialler');
const request = require( 'request' );

module.exports = (knex) => {

  function sanitizeData( dirtyArray, res ){
    var cleanArray = [];
    var objNumCounts = {};

    for( var i=0; i<dirtyArray.length; i++ ){
      var numberFromString = Number( dirtyArray[i] );
      if( isNaN( numberFromString ) ){
        continue; //silently ignore non-numeric garbage
      }
      cleanArray.push( numberFromString );

      if( objNumCounts.hasOwnProperty( dirtyArray[i] ) ){
        objNumCounts[dirtyArray]++;

        var templateVars = { success: false, errorMessage: "You have duplicates of " +dirtyArray[i] };
        res.render('twiml/rankPollResponse', templateVars);

        return null;
      }
      else {
        objNumCounts[dirtyArray[i]] = 1;
      }
    }
    return cleanArray;
  }

  function makeBordaCounts( ranking, pollID, res, cb ){
    var totalNumberOfPoints = ranking.length;
    var rankedChoices = [];
    var templateVars = {};

    knex
      .select( "id" )
      .from( "choices" )
      .where( "poll_id", "=", pollID )
      .orderBy( "choices.id" )
      .then((results) => {
        if( results.length !== ranking.length ){

          templateVars = { success: false, errorMessage: "Poll expected " + results.length + " received " + ranking.length + " ranked choices" };
          res.render('twiml/rankPollResponse', templateVars);

          return null;
        }
        for(var i=0; i < results.length; i++){
          if( ranking[i] - 1 <  results.length &&
              ranking[i] - 1 >= 0 ){
            var curID = results[ ranking[i] - 1 ].id;

            rankedChoices.push( { "id": curID, borda: totalNumberOfPoints } );
            totalNumberOfPoints--;
          }
          else {
            templateVars = { success: false, errorMessage: "Poll expected choice to be from 1 to " + results.length + " received " + ranking[i] };
            res.render('twiml/rankPollResponse', templateVars);

            return null;
          }
        }

        cb( { rankedChoices } );
      });//then
  }

  router.post( '/sms/recvpoll', (req, res) => {
    const smsBody = req.body.Body;
    var phoneNumber = req.body.From;
    phoneNumber = phoneNumber.slice( 2 ); //remove the +1

    var domain = (String(req.rawHeaders).split(","))[1];

    var path = req.url;

    var processedBody = smsBody.replace(/[^A-Za-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
    var bodyArray = processedBody.split(' ');
    var pubkeyFragment = bodyArray[0];

    var rankings = sanitizeData( bodyArray.slice(1), res );
    if( rankings === null ){
      //Fatal error, abort!
      return router;
    }

    knex
      .select( "polls.id", "public_key" )
      .from( "phone_numbers" )
      .join( "polls_to_phone_numbers", "phone_number_id", "=", "phone_numbers.id" )
      .join( "polls", "polls.id", "=", "poll_id" )
      .where( "phone_number", Number( phoneNumber ) )
      .where( "public_key", "like", pubkeyFragment+"%" )
      .then((results) => {
        if( results.length === 1 ){

          makeBordaCounts( rankings, results[0]["id"], res, function( rankedChoices ) {
            if( rankedChoices !== null ){
              var templateVars = { success: true, errorMessage: "" };
              res.render('twiml/rankPollResponse', templateVars);

              request.post( "http://" + domain + "/polls/" + results[0].public_key).form( rankedChoices );
            }
            else {
              return router;
            }

          });
        }
        else
        {
          var templateVars = { success: false, errorMessage: "Server Error. Did you type in the poll key correctly?" };
          res.render('twiml/rankPollResponse', templateVars);

          console.log( "Database issue, results of sql query not exactly 1" );
          res.status(404)
          res.send("404 - Page not found")
        }
      }) //then(pollIDs)
}) //router post
  return router;
}


