"use strict";

const mailgun = require('mailgun-js')({apiKey: process.env.MG_API_KEY, domain: process.env.MG_DOMAIN});

module.exports = function(info) {

  const createPoll = {
     from: 'Flying Ponies <flying.ponies.desicion.maker@gmail.com>',
     to: info.pollerEmail,
     subject: 'Your Decision Making Poll Has Been Created!',
     html: `Your poll has been made!
      <br>your administrative URL is:
      <br><a href="http://${info.hostName}/polls/admin/${info.privatePollKey}">http://${info.hostName}/polls/admin/${info.privatePollKey}</a>
      <br>
      <br>your voters URL is:
      <br><a href="http://${info.hostName}/polls/${info.publicPollKey}">http://${info.hostName}/polls/${info.publicPollKey}</a>
      <br>
      <br>Thank you for using Flying-Ponies Decision Maker!!`
  };
  const newVote = {
     from: 'Flying Ponies <flying.ponies.desicion.maker@gmail.com>',
     to: info.pollerEmail,
     subject: 'Somebody has taken your Decision Making Poll!',
     html: `Somebody has taken your poll!
      <br>your administrative URL is:
      <br><a href="http://${info.hostName}/polls/admin/${info.privatePollKey}">http://${info.hostName}/polls/admin/${info.privatePollKey}</a>
      <br>
      <br>your voters URL is:
      <br><a href="http://${info.hostName}/polls/${info.publicPollKey}">http://${info.hostName}/polls/${info.publicPollKey}</a>
      <br>
      <br>Thank you for using Flying-Ponies Decision Maker!!`
  };
  const toFriend = {
     from: 'Flying Ponies <flying.ponies.desicion.maker@gmail.com>',
     to: info.friendsEmail,
     subject: 'Your Indecisive Friend Needs Help Decision Making!',
     html: `Your indecisive friend @
      <br><a href="mailto:${info.pollerEmail}">${info.pollerEmail}</a>
      <br> needs help decision making,
      <br>please take his/her poll in the following link:
      <br><a href="http://${info.hostName}/polls/${info.publicPollKey}">http://${info.hostName}/polls/${info.publicPollKey}</a>
      <br>
      <br>Thank you for taking this poll with Flying-Ponies Decision Maker!!`
  };

  return {
    createPoll: () => {
      return new Promise((resolve, reject) => {
        mailgun.messages().send(createPoll, (err, body) => {
          if(err) {
            console.log(err);
          }
          console.log(body);
        })
      });
    },
    newVote: () => {
      return new Promise((resolve, reject) => {
        mailgun.messages().send(newVote, (err, body) => {
          if(err) {
            console.log(err);
          }
          console.log(body);
        })
      });
    },
    toFriend: () => {
      return new Promise((resolve, reject) => {
        mailgun.messages().send(toFriend, (err, body) => {
          if(err) {
            console.log(err);
          }
          console.log(body);
          resolve(body.message);
        })
      });
    }
  };

};
