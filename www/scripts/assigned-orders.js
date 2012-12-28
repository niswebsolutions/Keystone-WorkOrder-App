$('#page_home_page').live('pageshow',function(){
	getAssignedOrders();
});

function refreshAssignedOrders() {
	$.mobile.showPageLoadingMsg();
	getAssignedOrders()
}

$('ul.order-list a').live('tap', function() {
	nid = $(this).attr('id'); // set the global nid to the node that was just clicked
});


//get Assigned Orders List
function getAssignedOrders() {
	$.ajax({
      url: "http://keystone.niswebsolutions.com/api/assigned-orders",
      type: 'get',
      dataType: 'json',
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert('#page_home_page');
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
      },
      success: function (data) {
        $("#assigned-work-orders").html("");
        $.each(data.nodes,function (node_index,node_value) {
          console.log(JSON.stringify(node_value));
          
          if (node_value.node.field_work_order_status == 'Complete') {
          	var icon = "<img class='ui-li-icon completed' src='images/checkmark.png'>";
          } else if (node_value.node.field_work_order_status == 'Paused') {
          	var icon = "<img class='ui-li-icon paused' src='images/paused.png'>";
          } else {
          	var icon = "";
          };
          
          if (!node_value.node.field_scheduled_date) {node_value.node.field_scheduled_date = ''}
          if (!node_value.node.field_location) {node_value.node.field_location = ''}
          if (!node_value.node.field_job_description) {node_value.node.field_job_description = ''}
          
          $("#assigned-work-orders").append("<li><a href='#page_node' id='"+node_value.node.nid+"'>"+icon+"<h3 class='ui-heading address'>"+node_value.node.field_location+"</h3><div class='ui-heading order-number'>#"+node_value.node.field_invoice_number+"</div><div class='ui-li-desc description-issue'>"+node_value.node.field_job_description+"</div><div class='ui-li-desc scheduled-date'>"+node_value.node.field_scheduled_date+"</div><div class='ui-li-count clocked-out'></div><div class='ui-li-count priority'></div></a></li>");
        });
        $("#assigned-work-orders").listview("destroy").listview();
        getClockedInLocations();
        getPriorityListing();
        $.mobile.hidePageLoadingMsg();
      }
    });
}


//get Clocked in Locations
function getClockedInLocations() {
    $.ajax({
      url: "http://keystone.niswebsolutions.com/api/clocked-in-locations",
      type: 'get',
      dataType: 'json',
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert('#page_home_page');
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
      },
      success: function (data) {
      	$('#assigned-work-orders').find('.clocked-in').addClass('clocked-out');
        $.each(data.nodes,function (node_index,node_value) {
          console.log(JSON.stringify(node_value));
          var locationNID = "#"+node_value.node.nid;
          $('#assigned-work-orders').find(locationNID).find('.clocked-out').addClass('clocked-in');
        });
      }
    });
  };
  
//get Priorty Listing
function getPriorityListing() {
    $.ajax({
      url: "http://keystone.niswebsolutions.com/api/get-priority-locations",
      type: 'get',
      dataType: 'json',
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert('#page_home_page');
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
      },
      success: function (data) {
        $.each(data.nodes,function (node_index,node_value) {
          console.log(JSON.stringify(node_value));
          var locationNID = "#"+node_value.node.nid;
          $('#assigned-work-orders').find(locationNID).find('.priority').text('Priority');
        });
      }
    });	
}