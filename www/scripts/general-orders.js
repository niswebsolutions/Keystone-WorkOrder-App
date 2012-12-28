
function refreshGeneralOrders() {
	$.mobile.showPageLoadingMsg();
	getGeneralOrdersList()
}

$('#page_orders_general').live('pageshow',function(){
	getGeneralOrdersList()
});

function getGeneralOrdersList() {
    $.ajax({
      url: "http://keystone.niswebsolutions.com/api/general-orders",
      type: 'get',
      dataType: 'json',
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert('#page_home_page');
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
      },
      success: function (data) {
        $("#active-general-work-orders").html("");
        $.each(data.nodes,function (node_index,node_value) {
          console.log(JSON.stringify(node_value));
          
          if (node_value.node.field_work_order_status == 'Complete') {
          	var icon = "<img class='ui-li-icon completed' src='images/checkmark.png'>";
          } else if (node_value.node.field_work_order_status == 'Paused') {
          	var icon = "<img class='ui-li-icon paused' src='images/paused.png'>";
          } else {
          	var icon = "<div class='ui-li-icon'></div>";
          }

          if (!node_value.node.field_scheduled_date) {node_value.node.field_scheduled_date = ''}
          if (!node_value.node.field_location) {node_value.node.field_location = ''}
          if (!node_value.node.field_job_description) {node_value.node.field_job_description = ''}
          
          $("#active-general-work-orders").append("<li><a href='#page_node' id='"+node_value.node.nid+"'>"+icon+"<h3 class='ui-heading address'>"+node_value.node.field_location+"</h3><div class='ui-heading order-number'>#"+node_value.node.field_invoice_number+"</div><div class='ui-li-desc description-issue'>"+node_value.node.field_job_description+"</div><div class='ui-li-desc scheduled-date'>"+node_value.node.field_scheduled_date+"</div><div class='ui-li-count clocked-out'></div><div class='ui-li-count priority'></div></a></li>");
        });
        
        $("#active-general-work-orders").listview("destroy").listview();
        getClockedInLocations();
        getPriorityListing();
        $.mobile.hidePageLoadingMsg();
      }
    });
}
