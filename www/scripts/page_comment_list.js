$('#page_comment_list').live('pageshow', function() {
	getWorkOrderCommentsInbox();
});

function refreshPageCommentList() {
	$.mobile.showPageLoadingMsg();
	getWorkOrderCommentsInbox();
}

var unreadComments;
function getWorkOrderCommentsInbox() {
    $.ajax({
      url: "http://keystone.niswebsolutions.com/api/comments-inbox",
      type: 'get',
      dataType: 'json',
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
        alert('get work order failed')
      },
      success: function (data) {
      	  $('#comment-feed-inbox').html("");
      	  unreadComments = 0;
          $.each(data.nodes,function (node_index,node_value) {
          console.log(JSON.stringify(node_value));
          	//Format the Date
          	var cDate = node_value.node.created;
          	var cHour = node_value.node.created_1;
          	var d=new Date();
          	var dForm = (d.getMonth()+1) +"/"+ d.getDate();
          	var created;
          	
          	if (cDate == dForm) {//If comment was posted today then show the time instead of date
          		created = cHour;	
          	} else {
          		created = cDate;
          	};
          	
          	//Calculate unread Comments
          	var NID = node_value.node.nid;
          	var CID = node_value.node.cid;
          	var unread = '';
          	var storedCID = window.localStorage.getItem(NID);
          	if (storedCID < CID) {
          		unreadComments = unreadComments + 1;//set the amount of unreadcomments
          		unread = "unread";
          	}

			$('#comment-feed-inbox').append("<li><a href='#page_node_comments' id='"+node_value.node.nid+"'><div class='button "+unread+" ui-li-icon ui-li-thumb'></div><h3 class='ui-li-heading name'>"+node_value.node.name+"</h3><p class='ui-li-desc body'>"+node_value.node.comment_body+"</p><p class='ui-li-aside created'><p class='created-date ui-li-aside ui-li-desc'>"+created+"</p></a></li>");
        });
        if (unreadComments > 0) {
        	$("#page_true_home_page #unreadmessages").html("<div class='number'>"+unreadComments+"</div>");
        } else {
        	$("#page_true_home_page #unreadmessages").html('');
        }	
        $("#comment-feed-inbox").listview("destroy").listview();
        $.mobile.hidePageLoadingMsg();
      }
    });
} 


$('#comment-feed-inbox a').live('tap', function() {
	nid = $(this).attr('id'); // set the global nid to the node that was just clicked
});