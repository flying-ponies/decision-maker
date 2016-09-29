$(function () {
  let optionNum = 3;

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
  });
});
