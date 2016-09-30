"use strict";

const express = require('express');
const router  = express.Router();
const sendEmail = require('../lib/send_email')

module.exports = (knex) => {

  router.get('/polls/:key', (req, res) => {
    const publicPollKey = req.params.key;
    knex
      .select("public_key")
      .from("polls")
      .where("public_key", publicPollKey)
      .then((results) => {
        if (results.length) {
          Promise.all([
            knex
              .select("pollers.email","polls.question","polls.is_open")
              .from("polls")
              .innerJoin("pollers","polls.poller_id","pollers.id")
              .where("polls.public_key", publicPollKey),
            knex
              .select("choices.id","choices.title","choices.description", "points")
              .from("polls")
              .innerJoin("choices","polls.id","choices.poll_id")
              .where("polls.public_key", publicPollKey),
          ]).then((results) => {
            const isOpen = results[0][0].is_open;
            if(isOpen) {
              const templateVars = {
                'email': results[0][0].email,
                'question': results[0][0].question,
                'is_open': isOpen,
                'choices': results[1]
              };
              console.log(templateVars);
              //RENDER PAGE USING EJS WITH OBJECT
              res.render('rankpoll', templateVars);
            } else {
              //RENDER POLL CLOSED PAGE/POLL RESULTS
              res.end('POLL IS CLOSED');
            }

          });

        } else {
          res.status(404);
          //ADD PAGE
          res.end("PAGE NOT FOUND");
        }
    });
  });

  router.post('/polls/:key', (req, res) => {
    // TO DO CAN'T VOTE IF POLL IS CLOSED
    const rankedChoices = req.body.rankedChoices;
    const publicPollKey = req.params.key;
    const hostName = req.headers.host;

    let updateChoices = [];
    rankedChoices.forEach((element) => {
      let id = Number(element.id);
      let rank = element.rank;
      let voterPoints = Number(element.borda);
      knex.select('points').from('choices').where('id', id).then((results) => {
        let currentPoints = Number(results[0].points);
        let resultPoints = currentPoints + voterPoints;
        updateChoices.push(
          knex('choices').update({'points': resultPoints}).where('id', id).then()
        );
      });
    });
    Promise.all(updateChoices).then(() => {
      knex
        .select("pollers.email","polls.private_key")
        .from('polls')
        .innerJoin("pollers","polls.poller_id","pollers.id")
        .where('polls.public_key', publicPollKey)
        .then((results) => {
          let email = results[0].email;
          let privatePollKey = results[0].private_key;

          let emailInfo = {
            'hostName': hostName,
            'pollerEmail': email,
            'privatePollKey': privatePollKey,
            'publicPollKey': publicPollKey
          };

          sendEmail(emailInfo).newVote();

          res.end("Rankings Received" );
        });
    });
    // AJAX WILL HANDLE PAGE UPDATE
  });

  return router;
}
