'use strict';
// var mainDocument = $(document);

// init foundation
// $(document).foundation();

// Init all plugin when document is ready 
$(document).on('ready', function () {
	var scrollingAllowed = true;
	// 0. Init console to avoid error
	var method;
	var noop = function () { };
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});
	var contextWindow = $(window);
	var $root = $('html, body');
	while (length--) {
		method = methods[length];
		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}

	// 1. Background image as data attribut 
	var list = $('.bg-img');
	for (var i = 0; i < list.length; i++) {
		var src = list[i].getAttribute('data-image-src');
		list[i].style.backgroundImage = "url('" + src + "')";
		list[i].style.backgroundRepeat = "no-repeat";
		list[i].style.backgroundPosition = "center";
		list[i].style.backgroundSize = "cover";
	}
	// Background color as data attribut
	var list = $('.bg-color');
	for (var i = 0; i < list.length; i++) {
		var src = list[i].getAttribute('data-bgcolor');
		list[i].style.backgroundColor = src;
	}

	// 2. Init Coutdown clock
	try {
		// check if clock is initialised
		$('.clock-countdown').downCount({
			date: $('.site-config').attr('data-date'),
			offset: +10
		});
	}
	catch (error) {
		// Clock error : clock is unavailable
		console.log("clock disabled/unavailable");
	}

	// 3. Show/hide menu when icon is clicked
	var menuItems = $('.all-menu-wrapper .nav-link');
	var menuIcon = $('.menu-icon, #navMenuIcon');
	var menuBlock = $('.all-menu-wrapper');
	var reactToMenu = $('.page-main, .navbar-sidebar, .page-cover')
	var menuLinks = $(".navbar-mainmenu a, .navbar-sidebar a");

	// Menu icon clicked
	menuIcon.on('click', function () {
		menuIcon.toggleClass('menu-visible');
		menuBlock.toggleClass('menu-visible');
		menuItems.toggleClass('menu-visible');
		reactToMenu.toggleClass('menu-visible');
		$('#fp-nav').toggleClass('menu-visible');

		toggleScrolling();
		return false;
	});

	// Hide menu after a menu item clicked
	menuLinks.on('click', function () {
		menuIcon.removeClass('menu-visible');
		menuBlock.removeClass('menu-visible');
		menuItems.removeClass('menu-visible');
		reactToMenu.removeClass('menu-visible');
		$('#fp-nav').removeClass('menu-visible');
		return true;
	});

	var toggleScrolling = function(){
		scrollingAllowed = !scrollingAllowed;

		if($.fn.fullpage.setAllowScrolling != undefined)
		{
			$.fn.fullpage.setAllowScrolling(scrollingAllowed);
		}
	}

	// 4 Carousel Slider
	new Swiper('.carousel-swiper-beta-demo .swiper-container', {
		pagination: '.carousel-swiper-beta-demo .items-pagination',
		paginationClickable: '.carousel-beta-alpha-demo .items-pagination',
		nextButton: '.carousel-swiper-beta-demo .items-button-next',
		prevButton: '.carousel-swiper-beta-demo .items-button-prev',
		loop: true,
		grabCursor: true,
		centeredSlides: true,
		autoplay: 5000,
		autoplayDisableOnInteraction: false,
		slidesPerView: 1,
		spaceBetween: 0,
		breakpoints: {
			1024: {
				slidesPerView: 1,
			},
			800: {
				slidesPerView: 1,
				spaceBetween: 0
			},
			640: {
				slidesPerView: 1,
				spaceBetween: 0
			},
			440: {
				slidesPerView: 1,
				spaceBetween: 0
			}
		}
	});
	// 4.1 Slideshow slider
	var imageList = $('.slide-show .img');
	var imageSlides = [];
	for (var i = 0; i < imageList.length; i++) {
		var src = imageList[i].getAttribute('data-src');
		imageSlides.push({ src: src });
	}
	$('.slide-show').vegas({
		delay: 5000,
		shuffle: true,
		slides: imageSlides,
		animation: ['kenburnsUp', 'kenburnsDown', 'kenburnsLeft', 'kenburnsRight']
	});

	// 5. Init video background
	var videoBg = $('.video-container video, .video-container object');

	// 6. Prepare content for animation
	$('.section .content .anim.anim-wrapped').wrap("<span class='anim-wrapper'></span>");

	// 7. Init fullPage.js plugin
	var pageSectionDivs = $('.page-fullpage .section');
	var headerLogo = $('.header-top .logo');
	var bodySelector = $('body');
	var sectionSelector = $('.section');
	var headerContainer = $('.hh-header');
	var slideElem = $('.slide');
	var arrowElem = $('.p-footer .arrow-d');
	var pageElem = $('.section');
	var pageSections = [];
	var pageAnchors = [];
	var nextSectionDOM;
	var nextSection;
	var fpnavItem;
	var mainPage = $('#mainpage');
	var sendEmailForm = $('.send_email_form');
	var sendMessageForm = $('.send_message_form');
	var scrollOverflow = true;
	var css3 = true;
	
	// disable scroll overflow on small device
	if (contextWindow.width() < 601) {
		scrollOverflow = false;
		css3 = false;
	}
	if (contextWindow.height() < 480) {
		scrollOverflow = false;
		css3 = false;
	}
	// Get sections name
	for (var i = 0; i < pageSectionDivs.length; i++) {
		pageSections.push(pageSectionDivs[i]);
	}
	window.asyncEach(pageSections, function (pageSection, cb) {
		var anchor = pageSection.getAttribute('data-section');
		pageAnchors.push(anchor + "");
		cb();
	}, function (err) {
		// Init plugin
		if (mainPage.width()) {
			// config fullpage.js
			mainPage.fullpage({
				menu: '#qmenu',
				anchors: pageAnchors,
				verticalCentered: false,
				css3: css3,
				navigation: true,
				responsiveWidth: 601,
				responsiveHeight: 480,
				scrollOverflow: scrollOverflow,
				scrollOverflowOptions: {
					click: true,
					submit: true,
				},
				normalScrollElements: '.section .scrollable',
				afterRender: function () {
					// Fix video background
					videoBg.maximage('maxcover');

					// Fix for internet explorer : adjust content height
					// Detect IE 6-11
					var isIE = /*@cc_on!@*/false || !!document.documentMode;
					if (isIE) {
						var contentColumns = $('.section .content .c-columns');
						contentColumns.height(contextWindow.height())
						for (var i = 0; i < contentColumns.length; i++) {
							if (contentColumns[i].height <= contextWindow.height()) {
								contentColumns[i].style.height = "100vh";
							}
						}
					}

					// init contact form
					// Default server url
					var newsletterServerUrl = './ajaxserver/serverfile.php';
					var messageServerUrl = './ajaxserver/serverfile.php';

					// Use form define action attribute
					if (sendEmailForm.attr('action') && (sendEmailForm.attr('action')) != '') {
						newsletterServerUrl = sendEmailForm.attr('action');
					}
					if (sendMessageForm.attr('action') && (sendMessageForm.attr('action') != '')) {
						messageServerUrl = sendMessageForm.attr('action');
					}

					sendEmailForm.initForm({
						serverUrl: newsletterServerUrl,
					});
					sendMessageForm.initForm({
						serverUrl: messageServerUrl,
					});

				},
				afterResize: function () {
					var pluginContainer = $(this);
					$.fn.fullpage.reBuild();
				},
				onLeave: function (index, nextIndex, direction) {
					// Behavior when a full page is leaved
					arrowElem.addClass('gone');
					pageElem.addClass('transition');
					slideElem.removeClass('transition');
					pageElem.removeClass('transition');
				},
				afterLoad: function (anchorLink, index) {
					// Behavior after a full page is loaded
					// hide or show clock
					if ($('.section.active').hasClass('hide-clock')) {
						headerContainer.addClass('gone');
					} else {
						headerContainer.removeClass('gone');
					}
				}
			});

		}
	});
	// Scroll to fullPage.js next/previous section
	$('.scrolldown a, .scroll.down').on('click', function () {
		try {
			// fullpage scroll
			$.fn.fullpage.moveSectionDown();
		} catch (error) {
			// normal scroll
			$root.animate({
				scrollTop: window.innerHeight
			}, 400, function () {
			});
		}

	});

	// 8. Hide some ui on scroll
	var scrollHeight = $(document).height() - contextWindow.height();
	contextWindow.on('scroll', function () {
		var scrollpos = $(this).scrollTop();
		var siteHeaderFooter = $('.page-footer, .page-header');

		// if (scrollpos > 10 && scrollpos < scrollHeight - 100) {
		if (scrollpos > 100) {
			siteHeaderFooter.addClass("scrolled");
		}
		else {
			siteHeaderFooter.removeClass("scrolled");
		}
	});


	// 9. Page Loader : hide loader when all are loaded
	contextWindow.on('load', function () {
		$('#page-loader').addClass('p-hidden');
		$('.section').addClass('anim');
	});


	//10. add event listener to project thumbnails
	var imageAvatarBetaList = $('.img-avatar-beta');

	for (i = 0; i < imageAvatarBetaList.length; i++) {
		var currentContainer = imageAvatarBetaList[i];

		currentContainer.addEventListener('mouseover', function () {
			$('#' + this.id + 'text').css('opacity', 1);
			$('#' + this.id + 'image').css('filter', 'brightness(0.4)');
		}, false);

		currentContainer.addEventListener('mouseout', function () {
			$('#' + this.id + 'text').css('opacity', 0);
			$('#' + this.id + 'image').css('filter', 'brightness(1)');
		}, false);

	}

	//11. Dynamic loading of projects
	window.currentTag = "All";
	var tags = ["All", "R&D", "UXD", "UXR", "VD"];

	window.allProjects = [
		{
			"name": "LuminAI",
			"tags": "All,R&D",
			"hidden": false,
			"htmlString": "<div class='col-12 col-sm-6 col-md-4 center-vh tagged' style='margin-bottom: 10px' data-val='All,R&D'><div class='section-content anim translateUp'><div class='images text-center'><div id='luminai' class='img-avatar-beta'> <div class='img-1'> <a href='luminai.html'> <img id='luminaiimage' class='img container-rel' src='./img/Luminai/l0.png' alt='LuminAI' style='margin-bottom: 10px'><div id='luminaitext' style='opacity: 0;' class='img-text'>AI Research, Creative Systems</div> </a> </div><div class='legend text-center pos-abs font-roboto highlight'> <h5 style='line-height: 1'>LuminAI</h5><p class='small' style='letter-spacing: 0.05rem'>Virtual AI agent that can dance with you.</p></div></div></div></div></div>"
		},
		{
			"name": "Emoi",
			"tags": "All,UXR,R&D",
			"hidden": false,
			"htmlString": '<div class="col-12 col-sm-6 col-md-4 center-vh tagged" style="margin-bottom: 10px" data-val="All,UXR">			<div class="section-content anim translateUp">			  <div class="images text-center">				<div id="emoi" class="img-avatar-beta">				  <div class="img-1 shadow">					<a href="emoi.html">					  <img id="emoiimage" class="img container-rel" src="./img/Emoi/e0.png" alt="Emoi" style="margin-bottom: 10px">					  <div id="emoitext" style="opacity: 0;" class="img-text">HCI, UX research, Affective Computing					  </div>					</a>				  </div>				  <div class="legend text-center pos-abs font-roboto highlight">					<h5 style="line-height: 1" >Emoi</h5> 					<p class="small" style="letter-spacing: 0.05rem">Visualizing user’s emotions in realtime</p> 				  </div>				</div>			  </div>			</div>		</div>'
		},
		{
			"name": "HashtagGuru",
			"tags": "All,UXD",
			"hidden": false,
			"htmlString": '<div class="col-12 col-sm-6 col-md-4 center-vh tagged" style="margin-bottom: 10px" data-val="All,UXD">                 			<div class="section-content anim translateUp"> 			  <div class="images text-center"> 				<div id="hashtag" class="img-avatar-beta"> 				  <div class="img-1 shadow"> 					<a href="hashtag.html"> 					  <img id="hashtagimage" class="img container-rel" src="./img/HashtagGuru/h0.png" 						alt="HashtagGuru" style="margin-bottom: 10px"> 					  <div id="hashtagtext" style="opacity: 0;" class="img-text">HCI, UX Design</div> 					</a> 				  </div> 				  <div class="legend text-center pos-abs font-roboto highlight"> 					<h5 style="line-height: 1" >Hashtag Guru</h5> 					<p class="small" style="letter-spacing: 0.05rem" >Effective content tagging and publishing</p> 				  </div> 				</div> 			  </div> 			</div> 		  </div>'
		},
		{
			"name": "ResearchRepo",
			"tags": "All,UXD",
			"hidden": false,
			"htmlString": '<div class="col-12 col-sm-6 col-md-4 center-vh tagged" style="margin-bottom: 10px" data-val="All,UXD"> 			<div class="section-content anim translateDown"> 			  <div class="images text-center"> 				<div id="researchrepo" class="img-avatar-beta"> 				  <div class="img-1 shadow"> 					<a href="researchRepo.html"> 					  <img id="researchrepoimage" class="img container-rel" src="./img/ResearchRepo/r0.png" 						alt="Research Repository" style="margin-bottom: 10px"> 					  <div id="researchrepotext" style="opacity: 0;" class="img-text">HCI, UX Design </div> 					</a> 				  </div> 				  <div class="legend text-center pos-abs font-roboto highlight"> 					<h5 style="line-height: 1" >Research Repository</h5> 					<p class="small" style="letter-spacing: 0.05rem" >Research management system for Focus Brands Inc.</p> 				  </div> 				</div> 			  </div> 			</div> 		  </div>'
		},
		{
			"name": "DIYDrone",
			"tags": "All,R&D",
			"hidden": false,
			"htmlString": '<div class="col-12 col-sm-6 col-md-4 center-vh tagged" style="margin-bottom: 10px" data-val="All,R&D"> 			<div class="section-content anim"> 			  <div class="images text-center"> 				<div id="drone" class="img-avatar-beta"> 				  <div class="img-1 shadow"> 					<a href="drone.html"> 					  <img id="droneimage" class="img container-rel" src="./img/drone/d0.png" alt="Drone" style="margin-bottom: 10px"> 					  <div id="dronetext" style="opacity: 0;" class="img-text">HCI, IoT, Prototyping</div> 					</a> 				  </div> 				  <div class="legend text-center pos-abs font-roboto highlight"> 					<h5 style="line-height: 1" >DIY drone kit</h5> 					<p class="small" style="letter-spacing: 0.05rem" >Interfacing drones with mobile phones</p>  				  </div> 				</div> 			  </div> 			</div> 		  </div>'
		}
	];

	var placeholderProject = {
		"name": "placeholder",
		"tags": "",
		"hidden": false,
		"htmlString": '<div class="col-12 col-sm-6 col-md-4 center-vh tagged" style="margin-bottom: 30px" data-val="All,R&D"> 			<div class="section-content anim"> 			  <div class="images text-center"> 				<div id="drone" class="img-avatar-beta"> 				  <div class="img-1 shadow"> 					<a href="drone.html"> 					  <img id="droneimage" class="img container-rel" src="./img/drone/d0.png" alt="Drone" style="margin-bottom: 10px; opacity:0;"> 					  <div id="dronetext" style="opacity: 0;" class="img-text">HCI, IoT, Prototyping</div> 					</a> 				  </div> 				  <div class="legend text-center pos-abs font-roboto highlight"> 					<h5 style="line-height: 1; opacity:0;" >DIY drone kit</h5> 					<p class="small" style="letter-spacing: 0.05rem; opacity:0;" >Interfacing drones with mobile phones</p>  				  </div> 				</div> 			  </div> 			</div> 		  </div>'
	}

	var itemRowString = '<div class="item row justify-content-between"></div>'

	var currentProjects = [];

	var projectSection = $($('div[data-section="projects"]')[0]);

	//load all projects in start
	window.onload = function() {
		// LoadProjects('All');
	}

	//reloading on url change
	window.onhashchange = function () {
	}

	var tabbedContent = [
		{
			"input": document.getElementById('tab1'),
			"label": document.getElementById("l1"),
			"content": document.getElementById('content1')
		},
		{
			"input": document.getElementById('tab2'),
			"label": document.getElementById("l2"),
			"content": document.getElementById('content2')
		},
		{
			"input": document.getElementById('tab3'),
			"label": document.getElementById("l3"),
			"content": document.getElementById('content3')
		},
		{
			"input": document.getElementById('tab5'),
			"label": document.getElementById("l5"),
			"content": document.getElementById('content5')
		},
	];

	function toogleContent(idx) {
		console.log('toggling', idx);
		for(let [indx, val] of tabbedContent.entries()) {
			if(indx === idx) {
				val["content"].style.display = "block";
				val["label"].classList.add("selectedtab");
			}
			else{
				val["content"].style.display = "none";
				val["label"].classList.remove("selectedtab");
			}
		}
	}

	for(let [idx, tc] of tabbedContent.entries()) {
		// tc["input"].onclick = function(ev){
		// 	console.log('woohoo');
		// 	toogleContent(idx);
		// }
		tc["label"].onclick = function(ev){
			console.log('woohoolll');
			toogleContent(idx);
		}
	}
	toogleContent(0);
	// await sleep(2000);
	// tabbedContent[0]["input"].click();
});