module.exports = function(email, privatePollKey, publicPollKey,hostName) {
   return {
      create: {
         from: 'Flying Ponies <flying.ponies.desicion.maker@gmail.com>',
         to: email,
         subject: 'Your Decision Making Poll Has Been Created!',
         html: `<!DOCTYPE html>
          <html lang="en"><body>
          Your poll has been made!
          <br>your administrative URL is:
          <br><a href="${hostName}/polls/admin${privatePollKey}">${hostName}/polls/admin${privatePollKey}</a>
          <br>
          <br>your voters URL is:
          <br><a href="${hostName}/polls/${publicPollKey}">${hostName}/polls/${publicPollKey}</a>
          <br>
          <br>Thank you for using Flying-Ponies Decision Maker!!
          </body>
          </html>`
      },
      newVote: {
         from: 'Flying Ponies <flying.ponies.desicion.maker@gmail.com>',
         to: email,
         subject: 'Somebody has taken your Decision Making Poll!',
         html: `<!DOCTYPE html>
          <html lang="en"><body>
          Somebay has taken your poll!
          <br>your administrative URL is:
          <br><a href="${hostName}/polls/admin${privatePollKey}">${hostName}/polls/admin${privatePollKey}</a>
          <br>
          <br>your voters URL is:
          <br><a href="${hostName}/polls/${publicPollKey}">${hostName}/polls/${publicPollKey}</a>
          <br>
          <br>Thank you for using Flying-Ponies Decision Maker!!
          </body>
          </html>`
      }
   };
};
