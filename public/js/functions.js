var ww,wh;

jQuery(document).ready(function ($) {
	format();
});

$(window).resize(function(){ 
	format();
});

$(window).load(function(){ 
	$("section").removeClass("hidden");
	init();
});

function init(){
	isTouchDevice = 'ontouchstart' in document.documentElement;
	//console.log(isTouchDevice)

	bindEvents();
	initObjects();
}

function initObjects(){
	
}

function bindEvents(){
	$("html").on('click', '.remove-row', function(event) {
		event.preventDefault();
	
		$(this).parents("fieldset").remove();
	});

	$("html").on('click', '.create .add-row', function(event) {
		event.preventDefault();

		$("body").addClass('loading');

		$.ajax({
		  method: "GET",
		  url: "/api/add-row"
		})
			.done(function( html ) {
				$(".repeater").append(html);
				$("body").removeClass('loading');

				setTimeout(function(){
					$("fieldset").last().find("input").focus();
				},400);
				
		  	})
	});

	$("html").on('click', '.update .add-row-update', function(event) {
		event.preventDefault();

		$("body").addClass('loading');

		$.ajax({
		  method: "GET",
		  url: "/api/add-row-update"
		})
			.done(function( html ) {
				$(".repeater").append(html);
				$("body").removeClass('loading');

				setTimeout(function(){
					$("fieldset").last().find("input").focus();
				},400);
				
		  	})
	});

	$("html").on('submit', '.create', function(event) {
		event.preventDefault();

		$("body").addClass('loading');
		/* Act on the event */
		var u = $(this).attr("action");
		var d = $(this).serialize();
		$.ajax({
			method: "POST",
			url: u, 
			data: d,
			success: function(result){
	        	console.log(result);
	        	if(result.status == "success"){
	        		window.location.href = "/r/"+result.user;
	        	}
	    	}
		});
	});

	$("html").on('submit', '.update', function(event) {
		event.preventDefault();

		$("body").addClass('loading');
		/* Act on the event */
		var u = $(this).attr("action");
		var d = $(this).serialize();
		$.ajax({
			method: "POST",
			url: u, 
			data: d,
			success: function(result){
	        	console.log(result);
	        	if(result.status == "success"){
	        		$("body").removeClass('loading');
	        		window.location.href = "/r/"+result.user;
	        	}
	    	}
		});
	});

	$("html").on('click', '.validate-row', function(event) {
		event.preventDefault();
		/* Act on the event */
		$("body").addClass('loading');

		$fieldset = $(this).parents("fieldset");
		$fieldsetId = $fieldset.attr("id");
		$fieldStatus = $fieldset.find("input[name='tricks["+$fieldsetId+"][status][]']").val();
		var status;
		$fieldStatus == "true" ? status = false : status = true;
console.log($fieldsetId,$fieldStatus,status)

		var u = "/api/validate-row";
		var d = {
			id: $fieldset.attr("id"),
			status: status
		};

		$.ajax({
			method: "POST",
			url: u, 
			data: d,
			success: function(result){
	        	//console.log(status,result);
	        	$("body").removeClass('loading');

	        	$fieldset.find("input[name='tricks["+$fieldsetId+"][status][]']").val(status)

	        	if(result.status == "success"){
	        		//window.location.href = "/r/"+result.user;
	        		
        			if (status == true)	
	        			$fieldset.addClass("success");
	        		else
	        			$fieldset.removeClass("success");

        			$("body").removeClass('loading');
	        		
	        	}
	    	}
		});
	});
}

function format(){
	ww = $(window).width();
	wh = $(window).height();

	
}