$( document ).ready( function (){

  var emailFriendForm = $('form#sendEmail');
  emailFriendForm.on('submit', function(event) {
    event.preventDefault();
    var form = $(this);
    var textElement = emailFriendForm.parent().find('p')
    $('div.well p').text("");
    $.ajax({
      url: '/polls/admin/' + form.find('input[name="private_key"]').val(),
      method: 'POST',
      data: form.serialize(),
      success: function () {
        console.log('Success');
        textElement.text("Email sent");
      },
      error: function() {
        console.log('Failed');
        textElement.text("Failed to send email");
      }
    });
    this.reset();
  });

    var smsForm = $('form#sendSMS');
  smsForm.on('submit', function(event) {
    event.preventDefault();
    var form = $(this);
    var textElement = smsForm.parent().find('p')
    $('div.well p').text("");
    $.ajax({
      url: '/sms/sendpoll',
      method: 'POST',
      data: form.serialize(),
      success: function () {
        console.log('Success');
        textElement.text("SMS sent");
      },
      error: function() {
        console.log('Failed');
        textElement.text("Failed to send SMS");
      }
    });
    this.reset();
  });

});