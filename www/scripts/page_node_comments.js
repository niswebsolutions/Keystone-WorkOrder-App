$('#page_node_comments').live('pageshow', function() {
	if (nid == $('#page_node_comments').attr("data-currentnid")) {
		getWorkOrderComments();
	} else {
		$.mobile.showPageLoadingMsg();
		$('#comment-feed').html("");
		getWorkOrderComments();
	}
});


function getWorkOrderComments() {
    $.ajax({
      url: "http://keystone.niswebsolutions.com/api/work-order-comments/"+nid,
      type: 'get',
      dataType: 'json',
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
        alert('get work order failed')
      },
      success: function (data) {
      	  $('#comment-feed').html("");
          $.each(data.nodes,function (node_index,node_value) {
          console.log(JSON.stringify(node_value));
			$('#comment-feed').append("<li id='"+node_value.node.cid+"'><div class='comment'>"+node_value.node.comment_body+"</div><div class='ui-li-desc'>"+node_value.node.created+"</div><div class='ui-li-aside created'>"+node_value.node.name+"</div></li>");
        });
        updateCommentsViewed();
        $("#comment-feed").listview("destroy").listview();
        $('#page_node_comments').attr("data-currentnid", nid);
        $.mobile.hidePageLoadingMsg();
      }
    });
}    



function submitComment() {
	commentText = $('#new-comment-area').val();
  	if (!commentText) { alert('No Comment text.'); return false; }
	var commentNID = nid;
    $.ajax({
      url: "http://keystone.niswebsolutions.com/api/comment",
      type: 'post',
      data: 'comment[comment_body][und][0][value]=' + commentText + '&comment[nid]=' + commentNID,
      dataType: 'json',
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert('We could not submit your comment. Please try again later.');
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
      },
      success: function (data) {
 		$.mobile.changePage($("#page_node_comments"), {allowSamePageTransition:true});
 		$('#new-comment-area').val("");
      }
  });	
}

function updateCommentsViewed() {
	var CID = $('#comment-feed li').first().attr('id');//get the most recent message and set its id
	window.localStorage.setItem(nid, CID);//set it into local storage
	getWorkOrderCommentsInbox();
}