$('#page_time_clock').live('pageshow', function() {
	getOpenWorkerTimeclock();
	getTimeLog();
});


/*
TIMER
*/
var timeclockPageStartTime;
function getOpenWorkerTimeclock() {
    $.ajax({
      url: "http://keystone.niswebsolutions.com/api/timeclock-page",
      type: 'get',
      dataType: 'json',
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert('#page_time_clock');
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
      },
      success: function (data) {	
        $.each(data.nodes,function (node_index,node_value) {//if Open Timeclock Exists -> Start Timer
          console.log(JSON.stringify(node_value));
			 	timeclockPageStartTime = node_value.node.field_start_time;
			 	timeClockNID = node_value.node.nid;
			 	nid = node_value.node.nid_1;
			 	startTimer();          
        });
        if (data.nodes == "") {//if Open Timeclock Does NOT Exists -> Stop Timer
        	stopTimer();
        }
      }
    });
}


function startTimer() { 
	$('#stopClock').show();
	$('#page_time_clock #timeclock .display').countdown('destroy');
	$('#page_time_clock #timeclock .display').countdown({since: new Date(timeclockPageStartTime), 
    		format: 'HMS', description: "Since you began."});//begin the graphical jquery clock *just for show*
};


function stopTimer() {
	$('#stopClock').hide();
	$('#page_time_clock #timeclock .display').countdown('destroy');
}

/*
Hide Stop Clock and Timeclock Display by default
*/
$(document).bind( "mobileinit", function() {
	$('#stopClock').hide();
	$('#page_time_clock #timeclock .display').hide();
});



/*
TimeLog
*/
function getTimeLog() {
    $.ajax({
      url: "http://keystone.niswebsolutions.com/api/timelog-page",
      type: 'get',
      dataType: 'json',
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert('#page_time_clock-Timelog');
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
      },
      success: function (data) {	
      	$('#timelog-list').html("");
        $.each(data.nodes,function (node_index,node_value) {
          console.log(JSON.stringify(node_value));
          var start = new Date(node_value.node.field_start_time);
      	  var stop = new Date(node_value.node.field_stop_time);
      	  var startTime = ("0" + start.getHours()).slice(-2)+ ":" + ("0" + start.getMinutes()).slice(-2);
      	  var stopTime = "end: "+("0" + stop.getHours()).slice(-2)+ ":" + ("0" + stop.getMinutes()).slice(-2);
      	  var hours;
      	  var status;
      	  if (node_value.node.field_time_amount) {
      		hours = node_value.node.field_time_amount;
      		status = "closed";
      	  } else {
      		hours = "Open";
      		status = "open";
      		stopTime = " "
      	  }
          $('#timelog-list').append("<div class='container "+status+" clearfix' id='"+node_value.node.nid+"'><div class='hrs'>"+hours+"</div><h3 class='date'>"+node_value.node.created+"</h3><div class='title'>"+node_value.node.title+"</div><div class='start'>start: "+startTime+"</div><div class='end'>"+stopTime+"</div></div>");      
        });
      }
    });
}


$('#timelog-list .container').live('tap', function() {
	nid = $(this).attr('id');
	$.mobile.changePage($("#page_node"), {allowSamePageTransition:true});
});
