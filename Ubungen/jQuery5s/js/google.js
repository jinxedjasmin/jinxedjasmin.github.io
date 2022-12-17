$(document).ready(function() {
  $('#karte').jmap('init', {
    mapCenter:[52.539502, 13.423127],
    mapShowjMapIcon: false,
    mapZoom: 14,
    mapEnableScaleControl: true,
    mapControlSize: 'large'
  });

  $('#karte').jmap("AddMarker", {pointLatLng:[52.539502, 13.423127]});
  
  $('#holBeschreibung').submit(function(){
    $('#anfahrt').empty();
    
    $('#karte').jmap('SearchDirections', {
      'toAddress': 'Danziger Str. 65, 10435 Berlin',
      'fromAddress': $('#von').val(),
      'panel': '#anfahrt'
    },
    function(directions) {
    	alert(directions.getStatus().code);
    }
   );	
   return false;
   });

}); // Ende ready()