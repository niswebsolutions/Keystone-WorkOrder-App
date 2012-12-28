$('a#logout').live('tap',function(){
if (confirm("Are you Sure you want to logout?")) {
try {
 $.ajax({
     url: "http://keystone.niswebsolutions.com/api/user/logout.json",
     type: 'post',
     dataType: 'json',
     error: function (XMLHttpRequest, textStatus, errorThrown) {
       alert('button_logout - failed to logout');
       console.log(JSON.stringify(XMLHttpRequest));
       console.log(JSON.stringify(textStatus));
       console.log(JSON.stringify(errorThrown));
     },
     success: function (data) {
       $.mobile.changePage("index.html",{reverse:true}, {reloadPage:true});
     }
 });
}
catch (error) { alert("button_logout - " + error); }
return false;
}
});
