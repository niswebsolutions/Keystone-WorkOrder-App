$('#submit-work-done-edit').die('tap');
$('#submit-work-done-edit').live('tap',function(){

  var textarea = $('#page_node_work_done_edit textarea').val();

  // BEGIN: drupal services node create login (warning: don't use https if you don't have ssl setup)
  $.ajax({
      url: "http://keystone.niswebsolutions.com/api/node/"+nid,
      type: 'put',
      data: '&node[type]=work_order&node[field_description_of_work_done][und][0][value]='+textarea,
      dataType: 'json',
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert('#submit-work-done-edit - failed to login');
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
      },
      success: function (data) {
       	console.log(JSON.stringify(data));
        $.mobile.changePage($("#page_node"), {allowSamePageTransition:true});
      }
  });
  // END: drupal services node create

  return false;

});
