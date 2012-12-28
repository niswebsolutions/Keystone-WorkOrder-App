$('#page_node_materials').live('pageshow', function() {
	if (nid == $('#page_node_materials').attr("data-currentnid")) {
		getWorkOrderMaterials();
	} else {
		$.mobile.showPageLoadingMsg();
		$('#materials-feed').html("");
		getWorkOrderMaterials();
	}
});


function getWorkOrderMaterials() {
    $.ajax({
      url: "http://keystone.niswebsolutions.com/api/work-order-materials/"+nid,
      type: 'get',
      dataType: 'json',
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(JSON.stringify(XMLHttpRequest));
        console.log(JSON.stringify(textStatus));
        console.log(JSON.stringify(errorThrown));
        alert('get work order failed')
      },
      success: function (data) {
      	$('#materials-feed').html("");
        $.each(data.nodes,function (node_index,node_value) {
          console.log(JSON.stringify(node_value));
          
          	if (node_value.node.field_receipt_photo) {
          		var receiptPhoto = "<img class='ui-li-thumb receipt-icon' src='images/receipt-icon.png'>";	
          	} else {var receiptPhoto = ''}
			
			if (node_value.node.field_bill_to_resident == "Yes") {
				var billToRes = "<div class='ui-li-desc bill-resident'>Bill to Resident</div>";
			} else {var billToRes = ''}
			
			$('#materials-feed').append("<li id='"+node_value.node.nid+"'><a href='#page_node_edit_materials'>"+receiptPhoto+"<div class='title ui-li-desc'>"+node_value.node.title+"</div>"+billToRes+"<div class='ui-li-aside cost'>"+node_value.node.field_cost+"</div><div class='receipt-thumb'>"+node_value.node.field_receipt_photo+"</div><div class='receipt-fid'>"+node_value.node.field_receipt_photo_1+"</div></a></li>");
			
        });
        $("#materials-feed").listview("destroy").listview();
        $('#page_node_materials').attr("data-currentnid", nid);
        $.mobile.hidePageLoadingMsg();
      }
    });
}


var materialNID;
$('#page_node_materials #materials-feed li').live('tap', function() {
	$.mobile.showPageLoadingMsg();
	materialNID = $(this).attr('id');
	var title = $(this).find('.title').text();
	var cost = ($(this).find('.cost').text()).replace(/\$/g, '');//remove the $ from the price
	var billTo = $(this).find('.bill-resident').text();
	var receiptThumb = $(this).find('.receipt-thumb').text();
	receiptPhotoFID = $(this).find('.receipt-fid').text();
	if (receiptPhotoFID == 'undefined'){receiptPhotoFID = ''};
	if (billTo == 'Bill to Resident'){billTo = 'on'} else {billTo = 'off'};

	$.mobile.changePage($("#page_node_edit_materials"), {allowSamePageTransition:true});
	$('#page_node_edit_materials #item-name').val(title);
	$('#page_node_edit_materials #item-cost').val(cost);
	$('#page_node_edit_materials #bill-to-resident').val(billTo).slider('refresh');
	
	if (receiptThumb != 'undefined') {
		$('#receiptPhotoContainer').html('<img onclick="askToRemoveFromPage()" src="'+receiptThumb+'">');
		$('#add-receipt-photo').hide();
	} else {
		removeReceiptPhotoFromPage();
	}
	
	
	startEditMaterial();
	$.mobile.hidePageLoadingMsg();// hide loading message
	return false;
});
