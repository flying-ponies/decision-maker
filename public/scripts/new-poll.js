$(function () {
  $('#new-poll-form').submit(function (e) {
    var $form = $(this);
    var $question = $('#question');
    var $optionTitles = $form.find('input[id|="option-title"]');
    var $email = $('#email');
    var err = false;

    $form.find('span.help-block').remove();
    $form.find('span.glyphicon.glyphicon-warning-sign.form-control-feedback').remove();
    $form.find('.has-error.has-feedback').removeClass('has-error has-feedback');

    // Validate question input (check if there is any input at all)
    if ($question.val() === '' || $question.val() === undefined || $question.val() === null) {
      err = true;
      $question.parent().addClass('has-error has-feedback');
      $('<span>')
        .addClass('glyphicon glyphicon-warning-sign form-control-feedback')
        .attr('aria-hidden', 'true')
        .appendTo($question.parent());
      $('<span>')
        .addClass('help-block')
        .text('Enter a question')
        .insertAfter($question);
    }

    // Validate option titles input (each option should have something written in the title)
    $optionTitles.each(function(index) {
      if ($(this).val() === '' || $(this).val() === undefined || $(this).val() === null) {
        err = true;
        $(this).parent().addClass('has-error has-feedback');
        $(this).parent().append($('<span>')
          .addClass('glyphicon glyphicon-warning-sign form-control-feedback')
          .attr('aria-hidden', 'true'));
        $('<span>')
          .addClass('help-block')
          .text('Enter an option')
          .insertAfter($(this));
      }
    });

    // Check for a valid email
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test($email.val())) {
      err = true;
      $email.parent().addClass('has-error has-feedback');
      $('<span>')
        .addClass('glyphicon glyphicon-warning-sign form-control-feedback')
        .attr('aria-hidden', 'true')
        .appendTo($email.parent());
      $('<span>')
        .addClass('help-block')
        .text('Enter a valid email')
        .insertAfter($email);
    }

    if (err) {
      e.preventDefault();
    }
  });

  let optionNum = 3;

  // Focus on the question input initially
  $('#question').focus();

  // Add new option
  $('#new-option-btn').click(function () {
    $newOption = $('<div>').addClass('col-sm-4');
    $newOption
      .append($('<div>')
        .addClass('well')
        .append($('<div>')
          .addClass('form-group')
          .append($('<label>')
            .attr('for', 'option-title-' + optionNum)
            .text('Title')
          )
          .append($('<input>')
            .addClass('form-control')
            .attr('type', 'text')
            .attr('id', 'option-title-' + optionNum)
            .attr('name', 'option-title')
            .attr('placeholder', 'Option ' + optionNum)
          )
        )
        .append($('<div>')
          .addClass('form-group')
          .append($('<label>')
            .attr('for', 'option-description-' + optionNum)
            .text('Description (optional)')
          )
          .append($('<textarea>')
            .addClass('form-control')
            .attr('rows', '3')
            .attr('type', 'text')
            .attr('id', 'option-description-' + optionNum)
            .attr('name', 'option-description')
            .attr('placeholder', 'Description...')
          )
        )
      );

    // Only 3 options in a row, so add a new row if necessary
    if (optionNum % 3 === 1) {
      $('<div>').addClass('row').insertAfter($('#new-poll-options .row:last-child'));
    }

    $newOption.appendTo($('#new-poll-options .row:last-child'));

    // Focus on the title input of the new element
    $('#option-title-' + optionNum).focus();

    optionNum++;
  });

  // Remove the last option
  $('#remove-option-btn').click(function () {
    // There should always be at least two options
    // TODO: Add a message saying there needs to be at least two options
    if (optionNum <= 3) {
      return;
    }

    optionNum--;

    $('#option-title-' + optionNum.toString()).parentsUntil('.row').remove();
    if (optionNum % 3 === 1) {
      $('#new-poll-options .row:last-child').remove();
    }
  });
});
