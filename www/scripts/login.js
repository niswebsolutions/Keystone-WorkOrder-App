var uid;
var nid;
var username;

$('#page_login').live('pageshow',function(){
  try {
    $.ajax({
      url: "http://keystone.niswebsolutions.com/api/system/connect.json",
      type: 'post',
      dataType: 'json',
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert('page_dashboard - failed to system connect');
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
      },
      success: function (data) {
        var drupal_user = data.user;
        if (drupal_user.uid == 0) { // user is not logged in, show the login button, hide the logout button
          $('#button_login').show();
        }
        else { // user is logged in, hide the login button, show the logout button
		  $.mobile.changePage("#page_true_home_page", "slideup");
		  	uid = data.user.uid;
		  	username = data.user.name;
        }
      }
    });    
  }
  catch (error) { alert("page_dashboard - " + error); }
});


$('#page_login_submit').live('tap',function(){
  username = $('#page_login_name').val();
  if (!username) { alert('Please enter your user name.'); return false; }
  var pass = $('#page_login_pass').val();
  if (!pass) { alert('Please enter your password.'); return false; }
  
  // BEGIN: drupal services user login (warning: don't use https if you don't have ssl setup)
  $.ajax({
      url: "http://keystone.niswebsolutions.com/api/user/login.json",
      type: 'post',
      data: 'username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(pass),
      dataType: 'json',
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert('page_login_submit - failed to login');
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
      },
      success: function (data) {
      	console.log(JSON.stringify(data));
       	$.mobile.changePage("#page_true_home_page", "slideright");
       	 uid = data.user.uid;
       	 username = data.user.name;
      }
  });
  // END: drupal services user login
  return false;
});
