module.exports = function(email, privatePollKey, publicPollKey,hostName) {
   return {
      create: {
         from: 'Flying Ponies <flying.ponies.desicion.maker@gmail.com>',
         to: email,
         subject: 'Your Decision Making Poll Has Been Created',
         text: `Your poll has been made
your administrative URL is:
<a href="${hostName}/polls/admin${privatePollKey}">${hostName}/polls/admin${privatePollKey}</a>

your voters URL is:
a href="${hostName}$/polls/${publicPollKey}">${hostName}$/polls/${publicPollKey}</a>

Thank you for using Flying-Ponies Decision Maker!!`
      }
   };
};
