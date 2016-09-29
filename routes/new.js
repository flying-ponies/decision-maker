"use strict";

const express = require('express');
const router  = express.Router();
const uuid = require('node-uuid');
const mailgun  = require('mailgun-js')({apiKey: process.env.MG_API_KEY, domain: process.env.MG_DOMAIN});

module.exports = (knex) => {

  router.get('/', (req, res) => {
    res.render('index')
  });

  router.post('/polls', (req, res) => {
    //TO DO: NEEDS TO FILTER OUT EMPTY REQ.BODY
    const privatePollKey = uuid.v4();
    const publicPollKey = uuid.v4();
    const question = req.body.question;
    const email = req.body.email;
    const optionTitle = req.body['option-title'];
    const optionDescription = req.body['option-description'];
    const hostName = req.headers.host;

    var emailData = {
      from: 'Flying Ponies <flying.ponies.desicion.maker@gmail.com>',
      to: email,
      subject: 'Your Decision Making Poll Has Been Created',
      text: `Your poll has been made your administrative URL is
      ${hostName}$/polls/admin{privatePollKey}

      your voters URL is
      ${hostName}$/polls/{public_key}

      Thank you for using Flying-Ponies Decision Maker!!`
    };

    mailgun.messages().send(emailData, (err, body) => {
      if(err) {
        console.log(err);
      }
      console.log(body);
    });

    knex('pollers').insert({'email': email}).returning('id').then((resultA) => {
      const pollerId = resultA[0];
      return knex('polls').insert({
        'question': question,
        'poller_id': pollerId,
        'public_key': publicPollKey,
        'private_key': privatePollKey
      }).returning('id')
    }).then((resultB) =>{
      const pollId = resultB[0];
      let titleDescriptionKnexPromises = [];
      optionTitle.forEach((title, index) => {
        let description = optionDescription[index];
        titleDescriptionKnexPromises.push(
          knex('choices').insert({ 'poll_id': pollId, 'title': title, 'description': description, 'points': 0 })
        );
      });
      return Promise.all(titleDescriptionKnexPromises).then(() => { res.redirect("polls/admin/" + privatePollKey); });
    });

  });

  return router;
}
