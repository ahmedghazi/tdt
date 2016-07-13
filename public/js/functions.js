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

	$("html").on('click', '.add-row', function(event) {
		event.preventDefault();

		$("body").addClass('loading');

		$.ajax({
		  method: "GET",
		  url: "/api/add-row"
		})
			.done(function( html ) {
				$(".repeater").append(html);
				$("body").removeClass('loading');
		  	})
			
	
	});

	$("html").on('submit', '.create', function(event) {
		event.preventDefault();
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

	$("html").on('click', 'fieldset:not(.success) .validate-row', function(event) {
		event.preventDefault();
		/* Act on the event */
		$fieldset = $(this).parents("fieldset")
		
		var u = "/api/validate-row";
		var d = {id: $fieldset.attr("id")};
		$.ajax({
			method: "POST",
			url: u, 
			data: d,
			success: function(result){
	        	console.log(result);
	        	if(result.status == "success"){
	        		//window.location.href = "/r/"+result.user;
	        		if(result.trick.status == true){
	        			$fieldset.addClass("success");
	        		}
	        	}
	    	}
		});
	});
}

function format(){
	ww = $(window).width();
	wh = $(window).height();

	
}