"use strict";

const express = require('express');
const router  = express.Router();
const sendEmail = require('../lib/send_email')

module.exports = (knex) => {

  function displayPublicPollPage(req, res) {
    const publicPollKey = req.params.key;
    const pollTaken = req.cookies.pollTaken;
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
    ])
    .then((results) => {
      const isOpen = results[0][0].is_open;
      const templateVars = {
        'email': results[0][0].email,
        'question': results[0][0].question,
        'is_open': isOpen,
        'choices': results[1]
      };
      if(isOpen && !pollTaken) {
        res.render('rankpoll', templateVars);
      } else if(isOpen && pollTaken) {
        // POLL HAS BEEN TAKEN
        res.render('poll_taken', templateVars);
      } else {
        // RENDER POLL CLOSED PAGE/POLL RESULTS
        res.render('poll_closed_public', templateVars);
      }
    });
  }

  router.get('/polls/:key', (req, res) => {
    const publicPollKey = req.params.key;

    knex
      .select("public_key")
      .from("polls")
      .where("public_key", publicPollKey)
      .then((results) => {
        if (results.length) {
          displayPublicPollPage(req, res);
        } else {
          res.status(404);
          res.render("not_found");
        }
    });
  });

  router.post('/polls/:key', (req, res) => {
    // CHECK IF BODY IS BLANK
    if (!req.body.rankedChoices) {
      res.status(400);
      return res.send("{'error': 'invalid request'}\n");
    }

    const rankedChoices = req.body.rankedChoices;
    const publicPollKey = req.params.key;
    const hostName = req.headers.host;
    knex.select('is_open')
      .from('polls')
      .where('public_key', publicPollKey)
      .then((resultsA) => {
        let isOpen = resultsA[0].is_open;
        // CAN'T VOTE IF POLL IS CLOSED
        if (!isOpen) {
          return res.send("{'error': 'poll is closed'}\n");
        } else {
          let updateChoices = [];
          rankedChoices.forEach((element) => {
            let id = Number(element.id);
            let voterPoints = Number(element.borda);
            knex.select('points')
              .from('choices')
              .where('id', id)
              .then((resultsB) => {
                let currentPoints = Number(resultsB[0].points);
                let resultPoints = currentPoints + voterPoints;
                updateChoices.push(
                  knex('choices')
                    .update({'points': resultPoints})
                    .where('id', id)
                    .then()
                );
            });
          });
          Promise.all(updateChoices)
          .then(() => {
            return knex
              .select('total_votes')
              .from('polls')
              .where('public_key', publicPollKey);
          })
          .then((resultC) => {
            let currentVotes = resultC[0].total_votes;
            return knex('polls')
              .update({'total_votes': currentVotes + 1})
              .where('public_key', publicPollKey);
          })
          .then(() => {
            return knex
              .select("pollers.email","polls.private_key")
              .from('polls')
              .innerJoin("pollers","polls.poller_id","pollers.id")
              .where('polls.public_key', publicPollKey)
          })
          .then((results) =>{
            let emailInfo = {
              'hostName': hostName,
              'pollerEmail': results[0].email,
              'privatePollKey': results[0].private_key,
              'publicPollKey': publicPollKey
            };
            sendEmail(emailInfo).newVote();
            res.cookie('pollTaken', true ,{path:`/polls/${publicPollKey}`});
            res.end("Rankings Received" );
          });
        }
    });
  });

  return router;
}
