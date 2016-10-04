"use strict";

const express = require('express');
const router  = express.Router();
const smsDialler = require('./util/smsDialler');


module.exports = (knex) => {
  router.post( '/sms/sendpoll', (req, res) => {
    const phoneNumber = req.body["phone-number"];
    const privateKey = req.body.private_key;

    var smsPoll = "";
    var pollID;

    knex
      .select( "question", "title", "public_key", "polls.id" )
      .from( "polls" )
      .join( "choices", "polls.id", "choices.poll_id" )
      .where( "private_key", privateKey )
      .orderBy( "choices.id" )
      .then((results) => {
        if (results.length) {
          smsPoll += results[0].question;
          smsPoll += "\nInclude " + results[0].public_key.slice(0, 4) + " at the start of your sms, and rank ALL choices by listing them by number";
          for( var i = 0; i < results.length; i++ ) {
            smsPoll += "\n" + (Number(i)+1) + " " + results[i].title;
          }
          if( smsPoll.length > 1600 ) {
            smsPoll = smsPoll.slice( 0, 1600 );
          }
        }

        smsDialler( phoneNumber, smsPoll );

        pollID = results[0]["id"];

        knex
          .select("id")
          .from("phone_numbers")
          .where("phone_number", phoneNumber)
          .then((rowsA) => {

            if( rowsA.length ) { //for obeying the uniqueness of phone_numbers
              return [rowsA[0]["id"]];
            }
            else {
              var temp = knex( "phone_numbers" )
                .insert( {phone_number: phoneNumber} )
                .returning( "id" );

              return temp;
            }
          }).then((rowsB) => {
            if( rowsB ){

              knex
                .select( "phone_number_id", "poll_id" )
                .from( "polls_to_phone_numbers" )
                .where( "phone_number_id", rowsB[0] )
                .where( "poll_id", pollID )
                .then( (bridge_results) =>{
                  if( bridge_results.length === 0 ){
                    knex( "polls_to_phone_numbers" )
                      .insert(
                        {phone_number_id: rowsB[0], poll_id: pollID}
                       ).then((results) =>{ res.end('ADMIN PAGE');})
                  }
                });

            }
            res.end( 'ADMIN PAGE');

        });

      });

  });
  return router;
};
