//view: API List Work Order Status
getOrderStatusOptions();

function getOrderStatusOptions() {
    $.ajax({
      url: "http://keystone.niswebsolutions.com/api/list-work-order-status",
      type: 'get',
      dataType: 'json',
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert('#page_home_page');
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
      },
      success: function (data) {	
        $('#page_node_status_edit #list-work-order-status').html("");
        $.each(data.nodes,function (node_index,node_value) {
          console.log(JSON.stringify(node_value));
             $('#list-work-order-status').append('<option value="'+node_value.node.title+'">'+node_value.node.title+'</option>');
        });
        $('#list-work-order-status').selectmenu('refresh', true);
      }
    });
}


function submitStatusChange() {
	var selectedStatus = $('#list-work-order-status').val();
	var NID = nid;
	
    if (confirm('Do you want to change the work order status to "'+selectedStatus+'"?')) {
     $.ajax({
      url: "http://keystone.niswebsolutions.com/api/node/"+NID+".json",
      type: 'put',
      data: '{"type":"work_order","field_work_order_status":{"und":"'+selectedStatus+'"}}',
      dataType: 'json',
      contentType: 'application/json',
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert('#list-work-order-status - failed to login');
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
      },
      success: function (data) {
       	console.log(JSON.stringify(data));
       	$.mobile.changePage($("#page_node"), {allowSamePageTransition:true});
      }
  	 });
    }	
}