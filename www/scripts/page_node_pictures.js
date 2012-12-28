$('#page_node_pictures').live('pageshow', function() {
	if (nid == $('#page_node_pictures').attr("data-currentnid")) {
		getPictures();
	} else {
		$('#page_node_pictures #Gallery').html("");
		$.mobile.showPageLoadingMsg();
		getPictures();
	}
});

function getPictures() {
    $.ajax({
      url: "http://keystone.niswebsolutions.com/api/work-order-pictures/"+nid,
      type: 'get',
      dataType: 'json',
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert('assigned users failed')
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
        $.mobile.hidePageLoadingMsg();
      },
      success: function (data) {
        $('#page_node_pictures #Gallery').html("");
        $.each(data.nodes,function (node_index,node_value) {
          console.log(JSON.stringify(node_value));
			$('#page_node_pictures #Gallery').append('<li><a href="'+node_value.node.field_image_picture_1+'"><img class="thumbnail" src="'+node_value.node.field_image_picture+'"></a></li>');
        });
        $('#page_node_pictures').attr("data-currentnid", nid);
        $.mobile.hidePageLoadingMsg();
        loadPhotoSwipe();
      }
    });	
}

//jQuery version
function loadPhotoSwipe() {
	var myPhotoSwipe = $("#Gallery a").photoSwipe({ enableMouseWheel: false , enableKeyboard: false });
};



//Add Photo
// PHOTOS Upload

// PHOTOS Upload
var imagesrc;
function takePhoto() {
	navigator.camera.getPicture(onSuccess, onFail, { quality: 30, destinationType: Camera.DestinationType.DATA_URL, correctOrientation:true }); 
}


function onSuccess(imageData) {
    var image = document.getElementById('photo-deposit');
    imagesrc = imageData;
    uploadthePhoto();
}


function onFail(message) {
    alert('Failed because: ' + message);
   	$.mobile.hidePageLoadingMsg();// show loading message	
}


function uploadthePhoto() {
	newImageSrc = imagesrc;
	$.mobile.showPageLoadingMsg();// show loading message
	$.ajax({// upload the picture
      url: 'http://keystone.niswebsolutions.com/api/file.json',
      type: 'POST',
      data: '{"uid":"1","filesize":"99999","filename":"work-order-photo.jpg","file":"'+newImageSrc+'"}',
      dataType: 'json',
      contentType: 'application/json',
      error: function (XMLHttpRequest, textStatus, errorThrown) {
      	$.mobile.hidePageLoadingMsg();// show loading message   
        alert('Failed');
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
      },
      success: function (data) {   
		console.log(JSON.stringify(data));
		var fid = data.fid;  
		  $.ajax({// get node info
      		url: 'http://keystone.niswebsolutions.com/api/node.json',
      		type: 'POST',
      		data: '{"title":"Work Order Picture","type":"work_order_picture","field_image_picture":{"und":[{"fid":'+fid+'}]},"field_work_order_reference":{"und":[{"nid":"[nid:'+nid+']"}]},"uid":"1","language":"und"}',
      		dataType: 'json',
      		contentType: 'application/json',
      		error: function (XMLHttpRequest, textStatus, errorThrown) {
      			$.mobile.hidePageLoadingMsg();// show loading message   
        		alert('Failed');
        		console.log(JSON.stringify(XMLHttpRequest));
        		console.log(JSON.stringify(textStatus));
        		console.log(JSON.stringify(errorThrown));
      		},
      		success: function (data) { 
      			$.mobile.changePage($("#page_node_pictures"), {allowSamePageTransition:true});
      			$.mobile.hidePageLoadingMsg();// show loading message  
      		}
    	});		
      }
    });
}
