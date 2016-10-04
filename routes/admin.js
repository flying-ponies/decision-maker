"use strict";

const express = require('express');
const router  = express.Router();
const sendEmail = require('../lib/send_email')

module.exports = (knex) => {

  router.get('/polls/admin/:key', (req, res) => {
    const privatePollKey = req.params.key;
    knex
      .select("private_key")
      .from("polls")
      .where("private_key", privatePollKey)
      .then((results) => {
        if (results.length) {

          Promise.all([
            knex
              .select("pollers.email","polls.question","polls.is_open","polls.public_key", "polls.total_votes")
              .from("polls")
              .innerJoin("pollers","polls.poller_id","pollers.id")
              .where("polls.private_key", privatePollKey),
            knex
              .select("choices.id","choices.title","choices.description", "points")
              .from("polls")
              .innerJoin("choices","polls.id","choices.poll_id")
              .where("polls.private_key", privatePollKey),
          ]).then((results) => {
            const templateVars = {
              'privatePollKey': privatePollKey,
              'publicPollKey': results[0][0].public_key,
              'email': results[0][0].email,
              'question': results[0][0].question,
              'totalVotes': results[0][0].total_votes,
              'isOpen': results[0][0].is_open,
              'choices': results[1]
            };
            res.render('admin', templateVars);
          });

        } else {

          res.status(404);
          res.render("not_found");

        }
    });
  });

  router.post('/polls/admin/:key', (req, res) => {
    // CHECK IF BODY IS BLANK
    if (!req.body.email) {
      res.status(400);
      return res.send("{'error': 'invalid request'}\n");
    }

    // GETS INFO FROM DB AND SENDS EMAIL TO FRIEND
    const privatePollKey = req.params.key;
    const friendsEmail = req.body.email;
    const hostName = req.headers.host;
    let emailInfo;
    knex.select("pollers.email","polls.public_key")
      .from("polls")
      .innerJoin("pollers","polls.poller_id","pollers.id")
      .where("polls.private_key", privatePollKey)
      .then((results) => {
        let pollerEmail = results[0].email;
        let publicPollKey = results[0].public_key;
        emailInfo = {
          'hostName': hostName,
          'privatePollKey': privatePollKey,
          'publicPollKey': publicPollKey,
          'pollerEmail': pollerEmail,
          'friendsEmail': friendsEmail
        };
        return sendEmail(emailInfo).toFriend();
    })
    .then((message) => {
      if(message !== 'Queued. Thank you.') {
        res.status(400);
      }
      res.end("Post Received");
    });

  });

  router.put('/polls/admin/:key', (req, res) => {
    // CHECK IF BODY IS BLANK
    if (!req.body) {
      res.status(400);
      return res.send("{'error': 'invalid request'}\n");
    }
    // OPEN AND CLOSES POLL
    const privatePollKey = req.params.key;
    const isOpen = !!req.body.isOpen;
    knex('polls')
      .update({'is_open': isOpen})
      .where('private_key', privatePollKey)
      .then(() => {
        res.redirect(`/polls/admin/${privatePollKey}`);
    });
  });

  return router;
}
