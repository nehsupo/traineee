function fallbackCopyTextToClipboard(text) {
	var textArea = document.createElement("textarea");
	textArea.value = text;
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';
		console.log('Fallback: Copying text command was ' + msg);
	} catch (err) {
		console.error('Fallback: Oops, unable to copy', err);
	}

	document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
	if (!navigator.clipboard) {
		fallbackCopyTextToClipboard(text);
		return;
	}
	navigator.clipboard.writeText(text).then(function() {
		console.log('Async: Copying to clipboard was successful!');
	}, function(err) {
		console.error('Async: Could not copy text: ', err);
	});
}
input = document.querySelector('input');

$(window).on("load", function(){
	// $('#serial-form1').hide()
	$('input').focus();

})



$("#pills-allCategories-tab").click(function(){
	$("#pills-videos").removeClass('show');
	$("#pills-videos").removeClass('active');
	$("#pills-videos-tab").removeClass('show');
	$("#pills-videos-tab").removeClass('active');
	$("#pills-allCategories").addClass('active');
	$('#serial-form1').hide();
	$('#serial-form').show();
	$('.tab-content').hide();
	$('input').focus();

})
$("#pills-videos-tab").click(function(){
	$("#pills-allCategories").removeClass('show');
	$("#pills-allCategories").removeClass('active');
	$("#pills-allCategories-tab").removeClass('show');
	$("#pills-allCategories-tab").removeClass('active');
	$("#pills-videos").addClass('active');
	$('#serial-form').hide();
	$('#serial-form1').show();
	$('.tab-content').hide();
	$('input').focus();

})



$('#serial-form1').on('submit', function(event){
	event.preventDefault();
	let serial = $('.videos').val().trim();
	if (serial.length < 4 || (!($("#pills-videos").hasClass('active')) && !($("#pills-allCategories").hasClass('active'))))
	{
		$('small').addClass('error');
		$('small').removeClass('text-muted');
	}
	else if($("#pills-videos").hasClass('active')){
	
	$("#pills-videos").addClass('show');
	$('.tab-content').show()
	
	$('small').removeClass('error');
	console.log(serial);
	
	$('#recam-table').empty();
	
    $("#recam-table").append(`<thead>
                                <tr><th scope="col">Recam Videos:</th></tr>
                                <tr><th scope="col" class="info"><div class="alert alert-info" role="alert">Please wait...</div></th></tr>
                                </thead>`)
    
	$('#recam-table').waitMe();
	
	$.ajax({
		url: 'api.php',
		method: 'POST',
		data: {
			serial: serial,
			action: 'getVideos'
		},
		success: function (resp) {
			$('#recam-table').waitMe('hide');
			$('#recam-table').empty();
			let response = JSON.parse(resp);
			let siteurl;
			if ((window.location.href).toLowerCase().endsWith('html'))
			{
				let temp = window.location.href.split('/');
				temp.pop();
				siteurl = temp.join('/')+'/';

			}
			else
			{
				siteurl = window.location.href;
			}
			$('#recam-table').append('<thead><tr><th scope="row" colspan="2">Recam Videos:</th></tr></thead><tbody>');
		if(response.videos.length>0)
		{


			$.each(response.videos, function(index, value){
				if (value.toLowerCase().endsWith('mp4'))
				{
					$('#recam-table').append(`<tr><td><button type="button" class="btn btn-link" data-toggle="modal" data-target="#videoModal" data-url="${encodeURI(siteurl+value).replace('#', '%23')}">${value.split('/').pop()}</button></td>
					        <td class="text-right">
							<button class="btn btn-sm btn-outline-primary copy-button" data-fname="${value.split('/').pop()}" data-toggle="tooltip" data-placement="top" title="Copy filename to clipboard">
								<i class="material-icons align-middle">assignment</i>
							</button>
							</td></tr>`);
				}
				else
				{
					$('#recam-table').append(`<tr><td><div class="btn btn-link"><a href="${encodeURI(siteurl+value).replace('#', '%23')}">${value.split('/').pop()}</a></div></td>
					        <td class="text-right">
							<button class="btn btn-sm btn-outline-primary copy-button" data-fname="${value.split('/').pop()}" data-toggle="tooltip" data-placement="top" title="Copy filename to clipboard">
								<i class="material-icons align-middle">assignment</i>
							</button>
							</td></tr>`);

				}
			});
			$('#recam-table').append('</tbody>');
			//console.log(response.videos);
		}

		else {
				$("#recam-table").append('<thead><tr><th scope="col" class="danger"><div class="alert alert-danger" role="alert">No videos found!</div></th></tr></thead><tbody>')
			}
		},
		error: function(err){
			console.log(err);
			$('#recam-table').waitMe('hide');
		}
	});
	$.ajax({
		url: 'api.php',
		method: 'POST',
		data: {
			serial: serial,
			action: 'getArc'
		},
		success: function (resp) {
			$('#arc-table').waitMe('hide');
			$('#arc-table').empty();
			let response = JSON.parse(resp);
			let siteurl;
			if ((window.location.href).toLowerCase().endsWith('html'))
			{
				let temp = window.location.href.split('/');
				temp.pop();
				siteurl = temp.join('/')+'/';

			}
			else
			{
				siteurl = window.location.href;
			}
			$('#arc-table').append('<thead><tr><th scope="row" colspan="2">Arc Tools Photos:</th></tr></thead><tbody>');
			if(response.arc.length>0)
			{


                $.each(response.arc, function(index, value){
                    //$('#arc-table').append(`<tr><td><div class="btn btn-link" onclick="openInNewTab('${siteurl+value}');">${value.split('/').pop()}</div></td></tr>`);
                    $('#arc-table').append(`<tr><td><button type="button" class="btn btn-link" data-toggle="modal" data-target="#arcModal" data-url="${siteurl+value}">${value.split('/').pop()}</button></td>
							<td class="text-right">
							<button class="btn btn-sm btn-outline-primary copy-button" data-fname="${value.split('/').pop()}" data-toggle="tooltip" data-placement="top" title="Copy filename to clipboard">
								<i class="material-icons align-middle">assignment</i>
							</button>
							</td></tr>`);
                });
                $('#arc-table').append('</tbody>');

			}

			else {
				$("#arc-table").append('<thead><tr><th scope="col" class="danger"><div class="alert alert-danger" role="alert">No arc presentation found!</div></th></tr></thead><tbody>')
			}
		},
		error: function(err){
			console.log(err);
			$('.recam-table').waitMe('hide');
		}
	});

 	}
});

$('#serial-form').on('submit', function(event){
	event.preventDefault();
	let serial = $('input').val().trim();
	if (serial.length < 4 || (!($("#pills-videos").hasClass('active')) && !($("#pills-allCategories").hasClass('active'))))
	{
		$('small').addClass('error');
		$('small').removeClass('text-muted');
	}
	else if($("#pills-allCategories").hasClass('active')){

	$('.tab-content').show()
	$("#pills-allCategories").addClass('show');

	$('small').removeClass('error');
	console.log(serial);
	$('#customers-table').empty();
    $('#photos-table').empty();
	$('#arc-table').empty();
    
    
    $("#photos-table").append(`<thead>
                                <tr><th scope="row" colspan="2">CID Photos:</th></tr>
                                <tr><th scope="col" class="info"><div class="alert alert-info" role="alert">Please wait...</div></th></tr>
                                </thead>`)
	$("#customers-table").append(`<thead>
                                <tr><th scope="row" colspan="2">Customers Photos:</th></tr>
                                <tr><th scope="col" class="info"><div class="alert alert-info" role="alert">Please wait...</div></th></tr>
                                </thead>`)
    $("#arc-table").append(`<thead>
                            <tr><th scope="col">Arc Tools Photos:</th></tr>
                            <tr><th scope="col" class="info"><div class="alert alert-info" role="alert">Please wait...</div></th></tr>
                            </thead>`)
    
    $('#customers-table').waitMe();
	$('#photos-table').waitMe();
	$('#arc-table').waitMe();


	
		$.ajax({
		url: 'api.php',
		method: 'POST',
		data: {
			serial: serial,
			action: 'getCustomers'
		},
		success: function (resp) {
			$('#customers-table').waitMe('hide');
			$('#customers-table').empty();
			let response = JSON.parse(resp);
			let siteurl;
			if ((window.location.href).toLowerCase().endsWith('html'))
			{
				let temp = window.location.href.split('/');
				temp.pop();
				siteurl = temp.join('/')+'/';

			}
			else
			{
				siteurl = window.location.href;
			}
			$('#customers-table').append('<thead><tr><th scope="row" colspan="2">Customers Photos:</th></tr></thead><tbody>');
			if (response.customers.length>0)
			{

				$.each(response.customers, function(index, value){
					if (value.toLowerCase().endsWith('docx'))
					{
						$('#customers-table').append(`<tr><td><div class="btn btn-link btn-sm"><a href="${siteurl+value}">${value.split('/').pop()}</a></div></td></tr>`);
					}
					else
					{
						//$('#photos-table').append(`<tr><td><button type="button" class="btn btn-link" data-toggle="modal" data-target="#photoModal" data-url="${siteurl+value}">${value.split('/').pop()}</button></td></tr>`);  <a href="images/image-2.jpg" data-lightbox="roadtrip">Image #2</a>
						$('#customers-table').append(`<tr>
							<td>
							<a href="${siteurl+value}" data-lightbox="slideshow">${value.split('/').pop()}</a> 
							</td>
							<td class="text-right">
							<button class="btn btn-sm btn-outline-primary copy-button" data-fname="${value.split('/').pop()}" data-toggle="tooltip" data-placement="top" title="Copy filename to clipboard">
								<i class="material-icons align-middle">assignment</i>
							</button>
							</td>
						</tr>`);

					}
				});
				
				$('#customers-table').append('</tbody>');
				//console.log(response.customers);
			} else {
				$("#customers-table").append('<thead><tr><th scope="col" class="danger"><div class="alert alert-danger" role="alert">No records found!</div></th></tr></thead><tbody>')
			}
		},
		error: function(err){
			console.log(err);
			$('.container').waitMe('hide');
		}
	});
	$.ajax({
		url: 'api.php',
		method: 'POST',
		data: {
			serial: serial,
			action: 'getPhotos'
		},
		success: function (resp) {
			$('#photos-table').waitMe('hide');
			$('#photos-table').empty();
			let response = JSON.parse(resp);
			let siteurl;
			if ((window.location.href).toLowerCase().endsWith('html'))
			{
				let temp = window.location.href.split('/');
				temp.pop();
				siteurl = temp.join('/')+'/';

			}
			else
			{
				siteurl = window.location.href;
			}
			$('#photos-table').append('<thead><tr><th scope="row" colspan="2">CID Photos:</th></tr></thead><tbody>');
			if (response.photos.length>0)
			{

				$.each(response.photos, function(index, value){
					if (value.toLowerCase().endsWith('docx'))
					{
						$('#photos-table').append(`<tr><td><div class="btn btn-link btn-sm"><a href="${siteurl+value}">${value.split('/').pop()}</a></div></td></tr>`);
					}
					else
					{
						//$('#photos-table').append(`<tr><td><button type="button" class="btn btn-link" data-toggle="modal" data-target="#photoModal" data-url="${siteurl+value}">${value.split('/').pop()}</button></td></tr>`);  <a href="images/image-2.jpg" data-lightbox="roadtrip">Image #2</a>
						$('#photos-table').append(`<tr>
							<td>
							<a href="${siteurl+value}" data-lightbox="slideshow">${value.split('/').pop()}</a> 
							</td>
							<td class="text-right">
							<button class="btn btn-sm btn-outline-primary copy-button" data-fname="${value.split('/').pop()}" data-toggle="tooltip" data-placement="top" title="Copy filename to clipboard">
								<i class="material-icons align-middle">assignment</i>
							</button>
							</td>
						</tr>`);

					}
				});
				
				$('#photos-table').append('</tbody>');
				//console.log(response.photos);
			} else {
				$("#photos-table").append('<thead><tr><th scope="col" class="danger"><div class="alert alert-danger" role="alert">No records found!</div></th></tr></thead><tbody>')
			}
		},
		error: function(err){
			console.log(err);
			$('.container').waitMe('hide');
		}
	});
	$.ajax({
		url: 'api.php',
		method: 'POST',
		data: {
			serial: serial,
			action: 'getArc'
		},
		success: function (resp) {
			$('#arc-table').waitMe('hide');
			$('#arc-table').empty();
			let response = JSON.parse(resp);
			let siteurl;
			if ((window.location.href).toLowerCase().endsWith('html'))
			{
				let temp = window.location.href.split('/');
				temp.pop();
				siteurl = temp.join('/')+'/';

			}
			else
			{
				siteurl = window.location.href;
			}
			$('#arc-table').append('<thead><tr><th scope="row" colspan="2">Arc Tools Photos:</th></tr></thead><tbody>');
			if(response.arc.length>0)
			{


                $.each(response.arc, function(index, value){
                    //$('#arc-table').append(`<tr><td><div class="btn btn-link" onclick="openInNewTab('${siteurl+value}');">${value.split('/').pop()}</div></td></tr>`);
                    $('#arc-table').append(`<tr><td><button type="button" class="btn btn-link" data-toggle="modal" data-target="#arcModal" data-url="${siteurl+value}">${value.split('/').pop()}</button></td>
							<td class="text-right">
							<button class="btn btn-sm btn-outline-primary copy-button" data-fname="${value.split('/').pop()}" data-toggle="tooltip" data-placement="top" title="Copy filename to clipboard">
								<i class="material-icons align-middle">assignment</i>
							</button>
							</td></tr>`);
                });
                $('#arc-table').append('</tbody>');

			}

			else {
				$("#arc-table").append('<thead><tr><th scope="col" class="danger"><div class="alert alert-danger" role="alert">No arc presentation found!</div></th></tr></thead><tbody>')
			}
		},
		error: function(err){
			console.log(err);
			$('.recam-table').waitMe('hide');
		}
	});

}
});

$('#photoModal').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget);
	var file = button.data('url');
	var modal = $(this);
	modal.find('.modal-title').text(file.split('/').pop());
	modal.find('.modal-body img').attr('src', `${file}`);
});

$('#videoModal').on('show.bs.modal', function (event) {
	var button = $(event.relatedTarget);
	var file = button.data('url');
	var modal = $(this);
	modal.find('.modal-title').text(file.split('/').pop());
	modal.find('.modal-body video source').attr('src', `${file}`);
});

$('#arcModal').on('show.bs.modal', function (event) {
	let siteurl;
	if ((window.location.href).toLowerCase().endsWith('html'))
	{
		let temp = window.location.href.split('/');
		temp.pop();
		siteurl = temp.join('/')+'/';

	}
	else
	{
		siteurl = window.location.href;
	}
	var button = $(event.relatedTarget);
	var file = button.data('url');
	var modal = $(this);
	modal.find('.modal-title').text(file.split('/').pop());
	let presentation = file.replace('.html','/');

	inject_orbitvu('orbit', siteurl+'ACS/orbitvu12/orbitvuer12.swf', siteurl+'ACS/orbitvu12/expressInstall.swf', { ovus_folder: presentation, content2: 'yes', width: '600', height: '600'} );

});

function openInNewTab(url) {
	var win = window.open(url, '_blank');
	win.focus();
  }
  $('input-allCategories').on('change', function(){
	$('small').removeClass('error');
  });

	$('input-videos').on('change', function(){
	$('small').removeClass('error');
  });

$('#photos-table').on('click','#pdf-download-button', function(event) {
	event.preventDefault();
	let photos = Array();
	console.log('download pdf');
	$('[data-lightbox="slideshow"]').each(function () {
		photos.push(this.href.replace(this.baseURI,''));
	});
	//console.log(photos);
	$('#photos-array').val(photos);
	$('#photos-form').submit();


});
$("#photos-table").on('click', ".copy-button", function(event) {
    //console.log(this.dataset['fname']);
    copyTextToClipboard(this.dataset['fname']);
});
$("#recam-table").on('click', ".copy-button", function(event) {
    //console.log(this.dataset['fname']);
    copyTextToClipboard(this.dataset['fname']);
});
$("#arc-table").on('click', ".copy-button", function(event) {
    //console.log(this.dataset['fname']);
    copyTextToClipboard(this.dataset['fname']);
});

$(function(){
	console.log(window.location.search)
	if (window.location.search.includes('?sn=')){
		const sn = window.location.search.split('sn=')[1].split('&')[0].trim().toUpperCase();
		$('input').val(sn);
		$('#serial-form').submit();
	}
})




