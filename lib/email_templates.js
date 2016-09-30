module.exports = function(email, privatePollKey, publicPollKey,hostName) {
   return {
      create: {
         from: 'Flying Ponies <flying.ponies.desicion.maker@gmail.com>',
         to: email,
         subject: 'Your Decision Making Poll Has Been Created!',
         html: `Your poll has been made!
          <br>your administrative URL is:
          <br><a href="http://${hostName}/polls/admin/${privatePollKey}">http://${hostName}/polls/admin/${privatePollKey}</a>
          <br>
          <br>your voters URL is:
          <br><a href="http://${hostName}/polls/${publicPollKey}">http://${hostName}/polls/${publicPollKey}</a>
          <br>
          <br>Thank you for using Flying-Ponies Decision Maker!!`
      },
      newVote: {
         from: 'Flying Ponies <flying.ponies.desicion.maker@gmail.com>',
         to: email,
         subject: 'Somebody has taken your Decision Making Poll!',
         html: `Somebay has taken your poll!
          <br>your administrative URL is:
          <br><a href="http://${hostName}/polls/admin/${privatePollKey}">http://${hostName}/polls/admin/${privatePollKey}</a>
          <br>
          <br>your voters URL is:
          <br><a href="http://${hostName}/polls/${publicPollKey}">http://${hostName}/polls/${publicPollKey}</a>
          <br>
          <br>Thank you for using Flying-Ponies Decision Maker!!`
      }
   };
};
