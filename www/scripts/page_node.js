
$('#page_node').live('pageshow', function() {
	if (nid == $('#page_node').attr("data-currentnid")) {
		getWorkOrder();
		getAssignedUsers();
		getTimeclockStatus();
	} else {
		$.mobile.showPageLoadingMsg();
		getWorkOrder();
		getAssignedUsers();
		getTimeclockStatus();
	}
});

function refreshPageNode() {
	$.mobile.showPageLoadingMsg();
	getWorkOrder();
	getAssignedUsers();
	getTimeclockStatus();
}

function getAssignedUsers() {
    $.ajax({
      url: "http://keystone.niswebsolutions.com/api/assigned-users/"+nid,
      type: 'get',
      dataType: 'json',
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert('assigned users failed')
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
      },
      success: function (data) {
        $('#page_node .assigned-users').html("");
        $('#page_node .assigned-users').prepend('<div class="label">Assigned Employees:</div>');
        $.each(data.nodes,function (node_index,node_value) {
          console.log(JSON.stringify(node_value));
          	if (nid == node_value.node.field_work_order_reference) {
          		$('#page_node .assigned-users').append('<span class="'+node_value.node.field_status+'">'+node_value.node.name+' </span>');
          	} else {
        		$('#page_node .assigned-users').append('<span>'+node_value.node.name+' </span>');
          	}
        });
      }
    });	
}


function getWorkOrder() {
    $.ajax({
      url: "http://keystone.niswebsolutions.com/api/work-orders/"+nid,
      type: 'get',
      dataType: 'json',
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
        alert('get work order failed')
        $.mobile.hidePageLoadingMsg();
      },
      success: function (data) {
          $.each(data.nodes,function (node_index,node_value) {
          console.log(JSON.stringify(node_value));
          	$('#page_node .node-data').attr('id', node_value.node.nid);
			$('#page_node h3.title').text('#'+node_value.node.field_invoice_number);
			$('#page_node .status').text('Status: '+node_value.node.field_work_order_status);
			$('#page_node .date').text('Date: '+node_value.node.field_scheduled_date);
			$('#page_node .name').html('<div class="label">Name: </div>'+node_value.node.field_contact_name);
			$('#page_node .location').html("<div class='label'>Location:</div><div class='name'>"+node_value.node.field_location)+"</div>";
			$('#page_node .contact-number').html("<div class='label'>Contact Number:</div>"+node_value.node.field_telephone_number);
			$('#page_node .email').html("<div class='label'>Contact Email: </div>"+node_value.node.field_email_address);
			$('#page_node .description').html("<div class='label'>Job Description: </div>"+node_value.node.field_job_description);
			$('#page_node .job-type').html("<div class='label'>Job Type: </div>"+node_value.node.field_work_type);
			$('#page_node .decsription-work-done-text').html(node_value.node.field_description_of_work_done);
			$('#page_node_work_done_edit textarea').val(node_value.node.field_description_of_work_done);
			$('#page_node .order-status').html(node_value.node.field_work_order_status);
        });
        $.mobile.hidePageLoadingMsg();
        $('#page_node').attr("data-currentnid", nid);
      }
    });
}


var timeClockNID;

function getTimeclockStatus() {
    $.ajax({
      url: "http://keystone.niswebsolutions.com/api/get-timeclock-status",
      type: 'get',
      dataType: 'json',
      error: function (XMLHttpRequest, textStatus, errorThrown) {
      	alert('get timeclock status a no go')
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
      },
      success: function (data) {
      	  $('#page_node #clock-container').html('<a id="node-start-clock" onClick="startTimeclockBegin()" data-role="button" data-inline="true" data-theme="a" data-mini="true" onClick="">Clock-In</a>').trigger('create');//create clockin button
          $.each(data.nodes,function (node_index,node_value) {
          console.log(JSON.stringify(node_value));
			 if (node_value.node.nid == nid) {
			 	timeClockNID = node_value.node.nid_1;
			 	$('#page_node #clock-container').html('<a id="node-stop-clock" onClick="clockOutBegin()" data-role="button" data-inline="true" data-theme="d" data-mini="true" onClick="">Clock-Out</a>').trigger('create');//replace with clockout button
			 } else {
			 	$('#page_node #clock-container').html("");//replace with nothing
			 }
          });
      }
    });	
}

//Start the Clock Functionality
function startTimeclockBegin() {
 if (confirm("Are you sure you want to Clock-In?")) {
 	$.mobile.showPageLoadingMsg();// show loading message
 	var workOrderID = '[nid:'+$('.node-data').attr('id')+']';
	var userUID = '[uid:'+uid+']';
	var startTime = new Date();
	$.ajax({//create timeclock and submit start date
      url: "http://keystone.niswebsolutions.com/api/node.json",
      type: 'post',
      data: '&node[type]=work_order_timeclock&node[field_work_order_reference][und][0][nid]='+workOrderID+'&node[field_start_time][und][0][value]='+startTime+'&node[field_user_reference][und][0][uid]='+userUID,
      dataType: 'json',
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert('page_node_create_submit - failed to login');
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
        $.mobile.hidePageLoadingMsg();// hide loading message
      },
      success: function (data) {
		console.log(JSON.stringify(data));
		alert('Successfully Clocked In');
		$.mobile.changePage($("#page_node"), {allowSamePageTransition:true});
		$.mobile.hidePageLoadingMsg();// hide loading message
      }
  });	
 }	
}

function swapInStopClock() {
	$('#clock-container').html("").append('<a id="node-stop-clock" onClick="swapInStartClock()" data-role="button" data-inline="true" data-theme="d" data-mini="true">Clock-Out</a>').trigger('create').trigger('refresh');	
}







//Stop the Clock Functionality
var startTime;
function clockOutBegin() {
 if (confirm("Are you sure you want to Clock-Out?")) {
   $.mobile.showPageLoadingMsg();// show loading message
   $.ajax({//get the start time from the timeclock
      url: "http://keystone.niswebsolutions.com/api/get-open-timeclock/"+timeClockNID,
      type: 'get',
      dataType: 'json',
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert('page_node_create_submit - failed to login');
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
        $.mobile.hidePageLoadingMsg();// hide loading message
      },
      success: function (data) {
          $.each(data.nodes,function (node_index,node_value) {
          console.log(JSON.stringify(node_value));
          	startTime = new Date(node_value.node.field_start_time);
          	submitEndDateAndHours();
          });
      }
   });
  } 
}

function submitEndDateAndHours() {
   //calculate Time
   var endTime = new Date();
   var milliseconds = endTime - startTime;
   var seconds = milliseconds / 1000;
   var hours = ((seconds % 31536000) % 86400) / 3600;
   var timeAmountFormatted = hours.toFixed(2);//total hours calculation
   $.ajax({//submit stop time and total hours to timeclock
      url: "http://keystone.niswebsolutions.com/api/node/"+timeClockNID+".json",
      type: 'put',
      data: 'node[type]=work_order_timeclock&node[field_stop_time][und][0][value]='+endTime+'&node[field_time_amount][und][0][value]='+timeAmountFormatted,
      dataType: 'json',
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert('page_node_create_submit - failed to login');
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
        $.mobile.hidePageLoadingMsg();// hide loading message
      },
      success: function (data) {
		alert('You submitted a Timeclock for '+timeAmountFormatted+' hours.');
		$.mobile.changePage($("#page_time_clock"), {allowSamePageTransition:true});
		$.mobile.hidePageLoadingMsg();// hide loading message
      }
  });   
}

function swapInStartClock() {
	$('#clock-container').html("").append('<a id="node-stop-clock" onClick="swapInStopClock()" data-role="button" data-inline="true" data-theme="a" data-mini="true">Clock-In</a>').trigger('create').trigger('refresh');
}

