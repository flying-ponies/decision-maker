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
              .select("pollers.email","polls.question","polls.is_open","polls.public_key")
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
              'is_open': results[0][0].is_open,
              'choices': results[1]
            };
            //RENDER PAGE USING EJS WITH OBJECT
            res.render('admin', templateVars);
          });

        } else {
          res.status(404);
          //ADD PAGE
          res.end("PAGE NOT FOUND");
        }
    });
  });

  router.post('/polls/admin/:key', (req, res) => {
    //CHECK IF BLANK BODY
    const privatePollKey = req.params.key;
    const friendsEmail = req.body.email
    const hostName = req.headers.host;
    knex.select("pollers.email","polls.public_key")
      .from("polls")
      .innerJoin("pollers","polls.poller_id","pollers.id")
      .where("polls.private_key", privatePollKey).then((results) => {
        let pollerEmail = results[0].email;
        let publicPollKey = results[0].public_key;
        let emailInfo = {
          'hostName': hostName,
          'privatePollKey': privatePollKey,
          'publicPollKey': publicPollKey,
          'pollerEmail': pollerEmail,
          'friendsEmail': friendsEmail
        };
        sendEmail(emailInfo).toFriend();

        res.end("Updates Received");
      });

    //OPEN AND CLOSES POLL
    res.end("Post Received");
  });

  router.put('/polls/admin/:key', (req, res) => {
    console.log(req.body);

    //OPEN AND CLOSES POLL
  });

  return router;
}
