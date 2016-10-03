$( document ).ready( function () {

  $('form#sendEmail').on('submit', function(event) {
    event.preventDefault();
    var form = $(this);
    var textElement = form.parent().find('span.send-response');

    if (!checkEmail($('#email').val())) {
      textElement.text("Not a valid email");
      return;
    }

    $.ajax({
      url: '/polls/admin/' + form.find('input[name="private_key"]').val(),
      method: 'POST',
      data: form.serialize(),
      success: function () {
        textElement.text("Email sent");
        form.get(0).reset();
      },
      error: function() {
        textElement.text("Failed to send email");
      }
    });
  });

  $('form#sendSMS').on('submit', function(event) {
    event.preventDefault();
    var form = $(this);
    var phoneNumber = formatPhoneNumber($('#phone-number').val());
    var textElement = form.parent().find('span.send-response');

    if (!checkPhoneNumber(phoneNumber)) {
      textElement.text("Not a valid phone number");
      return;
    }

    $('#phone-number').val(phoneNumber);

    $.ajax({
      url: '/sms/sendpoll',
      method: 'POST',
      data: form.serialize(),
      success: function () {
        textElement.text("SMS sent");
        form.get(0).reset();
      },
      error: function() {
        textElement.text("Failed to send SMS");
      }
    });
  });
});

function formatPhoneNumber(input) {
  var formattedInput = input.toString();
  formattedInput = formattedInput.replace(/\D/g, '');
  if (formattedInput.length === 11 && formattedInput[0] === '1') {
    formattedInput = formattedInput.slice(1);
  }
  return formattedInput;
}

function checkPhoneNumber(phoneNumber) {
  if (phoneNumber.length === 10 && !/\D/g.test(phoneNumber)) {
    return true;
  } else {
    return false;
  }
}

function checkEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(email);
}
