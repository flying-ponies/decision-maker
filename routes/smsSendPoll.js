"use strict";

const express = require('express');
const router  = express.Router();
const smsDialler = require('./util/smsDialler');


module.exports = (knex) => {
  router.post( '/sms/sendpoll', (req, res) => {
    const phoneNumber = req.body["phone-number"];
    const privateKey = req.body.private_key;
    console.log( privateKey );
    var smsPoll = "";
    var pollID;

    knex
      .select( "question", "title", "public_key", "polls.id" )
      .from( "polls" )
      .join( "choices", "polls.id", "choices.poll_id" )
      .where( "private_key", privateKey )
      .then((results) => {
        if (results.length) {
          smsPoll += results[0].question;
          smsPoll += "\nInclude " + results[0].public_key.slice(0, 4) + " at the start of your sms";
          for( var i = 0; i < results.length; i++ ) {
            smsPoll += "\n" + (Number(i)+1) + " " + results[i].title;
          }
          if( smsPoll.length > 1600 ) {
            smsPoll = smsPoll.slice( 0, 1600 );
          }
        }

        smsDialler( phoneNumber, smsPoll );

        pollID = results[0]["id"];

        console.log( "pollID: ", pollID );
        console.log( "results[0]:", results[0] );

        knex
          .select("id")
          .from("phone_numbers")
          .where("phone_number", phoneNumber)
          .then((rowsA) => {
            console.log( "***Top Rows***", rowsA );
            if( rowsA.length ) { //for obeying the uniqueness of phone_numbers
              return [rowsA[0]["id"]];
            }
            else {
              var temp = knex( "phone_numbers" )
                .insert( {phone_number: phoneNumber} )
                .returning( "id" );
              console.log( "phone number", temp );
              return temp;
            }
          }).then((rowsB) => {
            console.log( "returned phone id rows: ", rowsB );
            if( rowsB ){

              console.log( "rowsB, pollID", rowsB, pollID );

              knex( "polls_to_phone_numbers" )
                .insert(
                  {phone_number_id: rowsB[0], poll_id: pollID}
                 ).then((results) =>{ res.end('ADMIN PAGE');})
            }
            res.end( 'ADMIN PAGE');

        });

      });

  });
  return router;
};
