$( document ).ready( function (){
  // registerDraggableElements();
  registerRankingElementChange();
  // registerUnrankedElementChange();
  registerSubmitRanking();

  setOptionsContainerHeight();

  $(window).resize(setOptionsContainerHeight);

});

function setOptionsContainerHeight() {
  var container = $('.section-container.options');
  container.css('height', 'auto');
  container.css('height', (container.css('height')));
}

function registerDraggableElements() {
  $( "ul.droptrue" ).sortable({
    connectWith: "ul"
  });
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

function registerUnrankedElementChange() {
  $( "#unranked-options" ).sortable({
    update: onUnrankedElementsChanged
  });
}

function onUnrankedElementsChanged( event, ui ) {
  var $children = $( this ).children();

  if( $children.length === 0 ) {
    $( "#submit-ranking" ).show();
  }
  else {
    $children.each( function( index ) {
      $( this ).find( "span" ).text( "" );
    });
    $( "#submit-ranking" ).hide();
  }
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
    var curRank = index + 1;//Number( $( this ).find( "span" ).text().slice(5) );
    var curID = Number( $( this ).attr( "id" ));
    rankedChoices.push( { id: curID, rank: curRank } );
    console.log( $( this ).text(), "Rank: ", curRank, "ID:", curID );
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
    $('<h1>Thank you for taking the poll!</h1>').replaceAll('div.container div.row');
  })
  .fail( function(err) {
  });
}

