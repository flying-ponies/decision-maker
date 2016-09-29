$( document ).ready( function (){
  registerDraggableElements();
  registerRankingElementChange();
});

function registerDraggableElements() {
  $( "ul.droptrue" ).sortable({
    connectWith: "ul"
  });
}

function registerRankingElementChange() {
  $( "#ranked-options" ).sortable({
    update: onRankedElementsChanged
  })
}

function onRankedElementsChanged( event, ui ) {
  var $children = $( this ).children();
  $children.each( function( index ) {
    $( this ).children( "span" ).text( "Rank: " + String(index+1) );
  });

}
