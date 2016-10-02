$( document ).ready( function (){
  registerRankingElementChange();
  registerSubmitRanking();

  setOptionsContainerHeight();

  $(window).resize(setOptionsContainerHeight);

});

function setOptionsContainerHeight() {
  var container = $('.section-container.options');
  container.css('height', 'auto');
  container.css('height', (container.css('height')));
}

function registerRankingElementChange() {
  $( "#ranked-options" ).sortable({
    update: onRankedElementsChanged
  });
}

function onRankedElementsChanged( event, ui ) {
  var $children = $( this ).children();
  $children.each( function( index ) {
    $( this ).find( "span" ).text( String(index+1) );
  });
}

function registerSubmitRanking() {
  $( "#submit-ranking" ).on('click', function(event) {
    onSubmitRanking(event);
  });
}

function onSubmitRanking(event) {
  event.preventDefault();

  var $rankedOptions = $( "#ranked-options" );
  var $children = $rankedOptions.children();
  var totalCount = 0;
  var rankedChoices = [];
  $children.each( function( index ) {
    totalCount++;
    var curRank = index + 1;
    var curID = Number( $( this ).attr( "id" ));
    rankedChoices.push( { id: curID, rank: curRank } );
  });
  var bordaCount = totalCount;
  for( var i = 0; i < rankedChoices.length; i++ ) {
    rankedChoices[i]["borda"] = bordaCount;
    bordaCount--;
  }

  $.ajax({
    method: "POST",
    url: $(location).attr('href'),
    data: { rankedChoices }
  })
  .done( function( msg ) {
    $('<span class="emphasize" style="margin-bottom: 1em;">Thank you for taking the poll!</span>').replaceAll('#ranked-options').css('text-align', 'center');
    $('#submit-ranking').remove();
    $('.section-container.options header p.lead').remove();
    $('.section-container.options header h3').text('Results Submitted');
    $('<button>')
      .addClass('btn btn-default btn-lg')
      .text('Make a New Poll')
      .appendTo($('<a>').attr('href', '/').appendTo('.section-container.options'));
    $('.section-container.options').css('text-align', 'center');
    setOptionsContainerHeight();
  })
  .fail( function(err) {
  });
}

