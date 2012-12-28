var addVsEdit;
function startAddNewMaterial() {
	addVsEdit = 'add'; 
	 $('#page_node_edit_materials input').val("");
 	 $('#page_node_edit_materials #bill-to-resident').val("");
 	 $('#page_node_edit_materials #bill-to-resident').val("");
 	 billToResident == 'on';
 	 receiptPhotoFID = '';
	 removeReceiptPhotoFromPage();
	 $('#deleteMaterial').button('disable').button('refresh');
}

function startEditMaterial() {
	addVsEdit = 'edit';
}

var cost;
var itemName;
var workOrderRef;
var billToResident;
function materialsVariables() {	//Gather the Variables and decide to Add or Edit Materials
	itemName = $('#page_node_edit_materials #item-name').val();
  	if (!itemName) { alert('No Item Name.'); return false; }
	cost = $('#page_node_edit_materials #item-cost').val();
  	if (!cost) { alert('No Cost Value.'); return false; } 
  	workOrderRef = '[nid:'+nid+']';
  	billToResident = $('#page_node_edit_materials #bill-to-resident').val();
  	if (billToResident == 'on') {billToResident = "Yes"} else {billToResident = "No"};
  	$.mobile.showPageLoadingMsg();// hide loading message

  	
  	if (addVsEdit == 'add') {
  		submitMaterials()
  	}
  	if (addVsEdit == 'edit'){
  		updateMaterials()
  	}
}  	


function updateMaterials() { //Take the Variables and Update them
    $.ajax({
      url: "http://keystone.niswebsolutions.com/api/node/"+ materialNID,
      type: 'put',
      data: 'node[type]=work_order_materials&node[field_cost][und][0][value]=' + cost + '&node[title]='+ itemName+'&node[field_bill_to_resident][und]='+billToResident+'&node[field_receipt_photo][und][0][fid]='+receiptPhotoFID,
      dataType: 'json',
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert('We could not submit your comment. Please try again later.');
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
        $.mobile.hidePageLoadingMsg();// hide loading message
      },
      success: function (data) {
 		$.mobile.changePage($("#page_node_materials"), {allowSamePageTransition:true});
 		$.mobile.hidePageLoadingMsg();// hide loading message
 		$('#page_node_edit_materials input').val("");
 		$('#page_node_edit_materials #bill-to-resident').val("");
 		receiptPhotoFID = '';
		removeReceiptPhotoFromPage();
      }
  });	
}

function submitMaterials() {//Take the Variables and Create new material
    $.ajax({
      url: "http://keystone.niswebsolutions.com/api/node",
      type: 'post',
      data: 'node[type]=work_order_materials&node[field_cost][und][0][value]=' + cost + '&node[field_work_order_reference][und][0][nid]=' + workOrderRef +'&node[title]='+ itemName+'&node[field_bill_to_resident][und]='+billToResident+'&node[field_receipt_photo][und][0][fid]='+receiptPhotoFID,
      dataType: 'json',
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert('We could not submit your comment. Please try again later.');
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
        $.mobile.hidePageLoadingMsg();// hide loading message
      },
      success: function (data) {
 		$.mobile.changePage($("#page_node_materials"), {allowSamePageTransition:true});
 		$.mobile.hidePageLoadingMsg();// hide loading message
 		$('#page_node_add_materials input').val("");
 		$('#page_node_add_materials #bill-to-resident').val("");
 		removeReceiptPhotoFromPage();
      }
  });	
}


function deleteMaterial() {
 if (confirm("Are you sure you want to DELETE this item?")) {
 	$.mobile.showPageLoadingMsg();// hide loading message
    $.ajax({
      url: "http://keystone.niswebsolutions.com/api/node/"+ materialNID,
      type: 'delete',
      dataType: 'json',
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert('We could not submit your comment. Please try again later.');
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
        $.mobile.hidePageLoadingMsg();// hide loading message
      },
      success: function (data) {
 		$.mobile.changePage($("#page_node_materials"), {allowSamePageTransition:true});
 		$.mobile.hidePageLoadingMsg();// hide loading message
 		$('#page_node_edit_materials input').val("");
 		$('#page_node_edit_materials #bill-to-resident').val("");
 		receiptPhotoFID = '';
		removeReceiptPhotoFromPage();
      }
  });
 } 
}



//Add Photo
// PHOTOS Upload

// PHOTOS Upload
var receiptPhotoFID;
var receiptImgSrc;
function takeRecieptPhoto() {
	$.mobile.showPageLoadingMsg();// show loading message
	navigator.camera.getPicture(onReceiptSuccess, onFail, { quality: 30, destinationType: Camera.DestinationType.DATA_URL, correctOrientation:true }); 
}


function onReceiptSuccess(imageData) {
    var image = document.getElementById('photo-deposit');
    imagesrc = imageData;
    receiptImgSrc = "data:image/jpeg;base64," + imageData;
    uploadtheReceiptPhoto();
}


function uploadtheReceiptPhoto() {
	newImageSrc = imagesrc;
	$.mobile.showPageLoadingMsg();// show loading message
	$.ajax({// upload the picture
      url: 'http://keystone.niswebsolutions.com/api/file.json',
      type: 'POST',
      data: '{"uid":"1","filesize":"99999","filename":"receipts.jpg","file":"'+newImageSrc+'"}',
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
		receiptPhotoFID = data.fid;  
		$.mobile.hidePageLoadingMsg();// show loading message	
		addReceiptPhotoToPage();
      }
    });
}


function addReceiptPhotoToPage() {
	$('#receiptPhotoContainer').html('<img onclick="askToRemoveFromPage()" src="'+receiptImgSrc+'" width="100px" height="100px">');
	$('#add-receipt-photo').hide();
}


function askToRemoveFromPage() {
	  if (confirm("Are you sure you want to DELETE this receipt?")) {
		receiptPhotoFID = '';
		removeReceiptPhotoFromPage();
	  }	
}

function removeReceiptPhotoFromPage() {
	$('#receiptPhotoContainer').html('');
	$('#add-receipt-photo').show();
}


