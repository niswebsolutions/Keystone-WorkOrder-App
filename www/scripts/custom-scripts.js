var nid; // global node id variable
var nidRef;// current loaded workorder
var tid; // global taxonomy id variable
var locationTid;
var productTid;
var selectedFilter;
var username;
var latitude;
var longitude;

$(document).bind( "mobileinit", function() {
  $.mobile.minScrollBack = 1000000;
  $.mobile.defaultPageTransition = 'none';
});
