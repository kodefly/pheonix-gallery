
(function($) {

	$.fn.phoenixgallery = function(o) {

		var gkb_i = 0;

		var defaults = {
			totalWidth:101,
			totalHeight:101,
			thumbWidth : 20,
			thumbHeight : 25,
			thumbSpace : 5,
			navigationDivId:"navCustom",
			hideOnCue:"off",
			buttonsAlign:"right",
			basePath:"",
			transition_type:"fade",
			transition_direction:"horizontal",
			transition_strips_x:15,
			transition_strips_y:15,
			block_animation_time:600,
			nav_position:"down",
			nav_type:"arrows",
			nav_space:10,
			nav_arrow_size:40,
			thumb_width:100,
			thumb_height:75,
			thumb_space:10,
			arrows_normal_alpha:0.7,
			arrows_roll_alpha:0.7,
			settings_shadow:"off",
			settings_autoresize:"off",
			settings_autoheight:'off',
			settings_slideshow:'on',
			settings_pauseonrollover:'on'
		}
		//settings_autoheight - for wordpress posts feed

		o = $.extend(defaults, o);

		this.each( function() {

			var nrChildren = 0;
			var cthis;
			var imageWidth=700;
			var imageHeight=420;
			var totalWidth=700;
			var totalHeight=420;

			var realImageWidth=0;
			var realImageHeight=0;

			var thumbWidth = 20;
			var thumbHeight = 25;
			var thumbSpace = 5;

			var nav_type="custom"
			var navigationDivId="navCustom"

			var widthArray = [];
			var heightArray = [];
			var post_heightArray=[];
			var descriptionArray= [];
			var descriptionOpacityArray = [];

			var initialPosition="";
			var finalPosition="";

			var initialZoom;
			var finalZoom;

			var images;
			var itemsArray=[];

			var currNr=-1;
			var currPage=0;

			var tempNr=0;

			var lastIndex=99;

			var slideshowTime=0;

			var fadeTime=800;

			var easingType="linear"

			var curInter;

			var cacheObject;
			var cacheObject2;

			var intervalID;
			var tempCount=0;
			var hardpaused=false;
			var paused_roll=false;
			var transitionTime = 3000;
			var basePath="";

			var totalItems=0;
			var hideOnCue="off"
			var buttonsAlign="";

			var kb_i=0;
			var thisId=jQuery(this)[0].getAttribute('id');



			var settings_autoresize="off";
			var transition_type="";
			var main_transition_type="";
			var transition_strips_x = 15;
			var transition_strips_y = 10;
			var stripWidth = 0;
			var stripHeight=0;
			var animateStrips="on";

			var block_animation_time=600;
			var block_animation_delay=100;
			var block_animation_easing="swing";

			var nav_position="right";
			var nav_space=10;
			var thumb_width=100;
			var thumb_height=75;
			var thumb_space=10;
			var thumbs_per_page=4;
			var thumb_pos=0;

			var nav_width=0;
			var nav_page_width=0;
			var nav_max_pages=0;
			var nav_excess_thumbs=0;
			var nav_arrow_size=40;

			var thumbs_thumb_var=0;
			var thumbs_thumb_var_sec=0;
			var thumbs_total_var=0;
			var thumbs_total_var_sec=0;
			var thumbs_css_main="top";
			var thumbs_normal_alpha=0.3;
			var thumbs_roll_alpha=1;
			
			var arrows_normal_alpha=0.7;
			var arrows_roll_alpha=1;

			var aux1=0;
			var aux2=0;
			var old_aux1=0;
			var old_aux2=0;
			var auxsw=false;

			var busy=false;
			var shadow_size=0;
			
			var r=0;

			cthis = jQuery(this);
			kb_i = gkb_i;
			gkb_i++;

			if(o.totalWidth==101) {
				totalWidth=cthis.width()
				totalHeight=cthis.height()
			} else {
				totalWidth=o.totalWidth;
				totalHeight=o.totalHeight;
			}

			nav_type=o.nav_type;
			nav_space=o.nav_space;
			navigationDivId=o.navigationDivId;
			hideOnCue=o.hideOnCue;
			buttonsAlign=o.buttonsAlign;
			thumbWidth=o.thumbWidth;
			thumbHeight=o.thumbHeight;
			thumbSpace=o.thumbSpace;

			basePath=o.basePath;
            settings_autoresize = o.settings_autoresize;
			transition_type=o.transition_type;
			main_transition_type=o.transition_type;
			transition_strips_x=o.transition_strips_x;
			transition_strips_y=o.transition_strips_y;
			block_animation_time=o.block_animation_time;
			nav_position = o.nav_position;
			nav_arrow_size=o.nav_arrow_size;
			
			thumb_width=o.thumb_width;
			thumb_height=o.thumb_height;
			thumb_space=o.thumb_space;
			arrows_normal_alpha=o.arrows_normal_alpha;

			nrChildren = cthis.children().length;

			cthis.css({ 'width' : totalWidth, 'height' : totalHeight, 'overflow' : 'inherit' })
			

			cthis.append('<div class="imgMain"><div class="transitionCon"></div><div class="imgCon"></div></div>')
			cthis.append("<div class='descMain'></div>")
			if(o.nav_type.indexOf('arrows')>-1 || o.nav_type.indexOf('numbers')>-1)
			cthis.append("<div class='navMain'></div>")
			cthis.append("<div class='thumbsMain'><div class='thumbs-arrow-left'></div><div class='thumbs-arrow-right'></div><div class='thumbsCon'><ul class='thumbsSlider'></ul></div></div>")

			var imgMain=cthis.find('.imgMain');
			var imgCon=cthis.find('.imgCon');
			var navMain=cthis.find('.navMain');
			var descMain=cthis.find('.descMain');
			var thumbsMain=cthis.find('.thumbsMain');
			var thumbsCon=cthis.find('.thumbsSlider');
			var transitionCon = cthis.find('.transitionCon');

			cthis.find('.imgMain').css({ 'width' : totalWidth, 'height' : totalHeight })
			cthis.find('.transitionCon').css({ 'width' : totalWidth, 'height' : totalHeight })
			
			if(is_ie8()){
				o.settings_shadow="off";	
			for(i=0;i<nrChildren;i++) {
				//if(jQuery(this).children().eq(i)[0].nodeName)
				//console.log(jQuery(this).children().eq(i).children().eq(0))				
				if(jQuery(this).children().eq(i)[0].nodeName=="LI")
				jQuery(this).children().eq(i).children().eq(0).unwrap()		

			}
				}	
			if(o.settings_shadow=="on"){ 
				shadow_size=6;
				cthis.css({"width" : totalWidth + shadow_size});
				cthis.css({"height" : totalHeight + shadow_size});
				imgMain.css({  'border' : shadow_size + 'px solid', 'border-radius': '5px'}); 
				cthis.parent().find('.pg-shadow').css({'top': totalHeight+5, 'width' : totalWidth})
			}
					
			descMain.css('width', totalWidth + shadow_size);
			var auxsize="100%";
			if(o.nav_size){
				auxsize=o.nav_size;
			}
			if(nav_type.indexOf('thumbs')>-1) {
				if(o.nav_size==undefined){
				//cthis.css({"height" : totalHeight + nav_space + thumb_height})
				}
				
				if(o.settings_shadow=="on") thumbsMainY=6;
				
				if(nav_position=="down") {
					cthis.css({"height" : totalHeight + shadow_size + nav_space + thumb_height})
					thumbsMain.css({"top" : totalHeight + nav_space,
						"width" : auxsize,
						"height" : thumb_height
					})
				}
				
				
				if(nav_position=="right") {
					cthis.css({"width" : totalWidth + nav_space + thumb_width})
					thumbsMain.css({
						"top" : shadow_size,
						"left" : totalWidth + nav_space,
						"width" : thumb_width,
						"height" : totalHeight
					})
				}
			}

			if(jQuery.browser.msie==true && jQuery.browser.version==7)	cthis.css('overflow','visible');

			//THUMBS: moving the images in the proper place
			for(i=0;i<nrChildren;i++) {
				
					if(settings_autoresize=='on'){
						jQuery(this).children().eq(0).find('img').css({
							'width' : totalWidth,
							'height' : totalHeight
						})
					}
				imgCon.append(jQuery(this).children().eq(0))
				
			}
			images=imgCon.children();

			if(nav_type.indexOf('thumbs')>-1) {
				if(nav_position=="down") {
					thumbs_thumb_var=thumb_width;
					thumbs_thumb_var_sec=thumb_height;
					thumbs_total_var=totalWidth;
					thumbs_total_var_sec=totalHeight;
					thumbs_css_main='left';

				}
				if(nav_position=="right") {
					thumbs_thumb_var=thumb_height;
					thumbs_thumb_var_sec=thumb_width;
					thumbs_total_var=totalHeight;
					thumbs_total_var_sec=totalWidth;
					thumbs_css_main='top';
				}

				nav_width = nrChildren * thumbs_thumb_var + (nrChildren-1) * thumb_space;
				if(o.nav_size) thumbs_total_var=o.nav_size;
				if(nav_width < thumbs_total_var - nav_arrow_size*2) {
					thumb_pos = thumbs_total_var/ 2 - nav_width / 2;
				} else {
					aux1=(((((thumbs_total_var - nav_arrow_size*2) / (thumbs_thumb_var + thumb_space)) * (thumbs_thumb_var + thumb_space)))) - ((((parseInt((thumbs_total_var - nav_arrow_size*2) / (thumbs_thumb_var + thumb_space))) * (thumbs_thumb_var + thumb_space))));

					nav_page_width = thumbs_total_var - nav_arrow_size*2 - aux1;

					nav_max_pages = nav_width / nav_page_width;
					thumbs_per_page = Math.floor(nav_page_width/(thumbs_thumb_var + thumb_space));
					nav_max_pages = (Math.ceil(nav_max_pages));

					nav_excess_thumbs = (nav_width - (nav_max_pages-1) * nav_page_width)

					if(nav_position=="down")
						cthis.find('.thumbsCon').css({
							'position' : 'absolute',
							'left' : nav_arrow_size + aux1/2,
							'width' : nav_page_width,
							'height' : thumbs_thumb_var_sec
						})
					if(nav_position=="right") {
						cthis.find('.thumbsCon').css({
							'position' : 'absolute',
							'top' : nav_arrow_size + aux1/2,
							'height' : nav_page_width,
							'width' : thumbs_thumb_var_sec
						})
					}

					thumbsCon.css({
						'position' : 'absolute'
					})

					if(nav_position=="down") {
						thumbsMain.find('.thumbs-arrow-left').css({
							'display' : 'inline-block',
							'top' : thumb_height/2 - 10,
							'left' : aux1/2,
							'opacity' : arrows_normal_alpha
						})
						thumbsMain.find('.thumbs-arrow-right').css({
							'display' : 'inline-block',
							'top' : thumb_height/2 - 10,
							'right' : aux1/2,
							'opacity' : arrows_normal_alpha
						})
					}

					if(nav_position=="right") {
						thumbsMain.find('.thumbs-arrow-left').css({
							'display' : 'inline-block',
							'top' : thumbs_thumb_var/2 - 10,
							'left' : thumbs_thumb_var_sec/2-10,
							'opacity' : arrows_normal_alpha
						})
						thumbsMain.find('.thumbs-arrow-right').css({
							'display' : 'inline-block',
							'bottom' :  thumbs_thumb_var/2 - 10,
							'left' : thumbs_thumb_var_sec/2-10,
							'opacity' : arrows_normal_alpha
						})
					}
					
					function handle_arrows_mouseover(){
						jQuery(this).animate({
							opacity:arrows_roll_alpha
						},{duration:300, queue:false});
					}
					function handle_arrows_mouseout(){
						jQuery(this).animate({
							opacity:arrows_normal_alpha
						},{duration:300, queue:false});
					}
					

					thumbsMain.find('.thumbs-arrow-left').bind('mouseover', handle_arrows_mouseover);
					thumbsMain.find('.thumbs-arrow-right').bind('mouseover', handle_arrows_mouseover);
					thumbsMain.find('.thumbs-arrow-left').bind('mouseout', handle_arrows_mouseout);
					thumbsMain.find('.thumbs-arrow-right').bind('mouseout', handle_arrows_mouseout);
					thumbsMain.find('.thumbs-arrow-left').bind('click', gotoPrevPage);
					thumbsMain.find('.thumbs-arrow-right').bind('click', gotoNextPage);
					
					
				}
				if(o.nav_left) thumb_pos=0;
				if(o.nav_left) cthis.find('.thumbsMain').css('left', o.nav_left);
				if(o.nav_top) cthis.find('.thumbsMain').css('top', o.nav_top);
				for(i=0;i<nrChildren;i++) {
					thumbsCon.append('<li></li>');
					if(images.eq(i).attr('data-thumb')!=undefined) {
						thumbsCon.children().eq(i).append('<img src="' + images.eq(i).attr('data-thumb') + '"/>');
					} else {
						if(images.eq(i)[0].nodeName!="IMG")
							thumbsCon.children().eq(i).append(images.eq(i).find('img').eq(0).clone())
						else
							thumbsCon.children().eq(i).append(images.eq(i).clone());
					}
					if(nav_position=="down")
						thumbsCon.children().eq(i).css({'left' : thumb_pos});
					if(nav_position=="right")
						thumbsCon.children().eq(i).css({'top' : thumb_pos});

					thumb_pos+=thumbs_thumb_var + thumb_space;

					thumbsCon.children().eq(i).children().eq(0).css({
						'opacity' : 1,
						'width' : thumb_width,
						'height' : thumb_height
					})
					thumbsCon.children().eq(i).css({
						'opacity' : thumbs_normal_alpha
					})

					thumbsCon.children().eq(i).unbind();
					thumbsCon.children().eq(i).bind("mouseover", handle_thumb_mouseover)
					thumbsCon.children().eq(i).bind("mouseout", handle_thumb_mouseout)
					thumbsCon.children().eq(i).bind("click", handle_thumb_click)
				}
			}
			function handle_thumb_mouseover(){
				jQuery(this).animate({
					opacity:thumbs_roll_alpha
				},{duration:300, queue:false});
			}
			function handle_thumb_mouseout(){
				var index=(jQuery(this).parent().children().index(jQuery(this)));
				if(index!=currNr){
				jQuery(this).animate({
					opacity:thumbs_normal_alpha
				},{duration:300, queue:false});
				}
			}
			function handle_thumb_click() {
				gotoImage(thumbsCon.children().index(jQuery(this)));
			}

			var descriptionBgDiv="";
			var descriptionTextDiv="";
			

			for (i = 0; i < nrChildren; i++) {
				descriptionBgDiv="<div class='descriptionBg' id='descriptionBg-" + i + "'></div>";
				descriptionTextDiv="<div class='descriptionText' id='descriptionText-" + i + "'>";
				descMain.append("<div class='descriptionMain'></div>")

				descriptionArray[i] = descMain.children().eq(i)
				descriptionArray[i].css('visibility', 'hidden')

				if(images.eq(i).attr("title")!=undefined && images.eq(i).attr("title")!='') {

					descriptionTextDiv+=images.eq(i).attr("title") + "</div>";

					descriptionArray[i].append(descriptionBgDiv)
					descriptionArray[i].append(descriptionTextDiv)

					if(jQuery.browser.msie) {
						descriptionArray[i].find('.descriptionBg').css('margin-top', (descriptionArray[i].find('.descriptionBg').css('top')));
						descriptionArray[i].find('.descriptionBg').css('margin-left', (descriptionArray[i].find('.descriptionBg').css('left')));
					} else
						descriptionArray[i].find('.descriptionBg').css('position', 'absolute');

					descriptionOpacityArray[i]=descriptionArray[i].find('.descriptionBg').css('opacity');

				}

			}

			//*************NAVIGATION SETUP********************

			if(nav_type.indexOf("arrows")>-1 || nav_type=="custom") {
				if(nav_type.indexOf("arrows")>-1) {
					navMain.append("<div class='arrow-left' style='cursor:pointer; position:absolute; top: " + (totalHeight-35) + "px; left: " + (totalWidth-105)+ "px;'></div>")
					navMain.append("<div class='arrow-right' style='cursor:pointer; position:absolute; top: " + (totalHeight-35) + "px; left: " + (totalWidth-35)+ "px;'></div>")
					navMain.append("<div class='pause' style='cursor:pointer; position:absolute; top: " + (totalHeight-35) + "px; left: " + (totalWidth-70)+ "px;'></div>")
					navMain.append("<div class='play' style='cursor:pointer; position:absolute; top: " + (totalHeight-35) + "px; left: " + (totalWidth-70)+ "px;'></div>")

				} else {
					navMain.append(jQuery(("#" + navigationDivId)))
				}

				$(this).find('.play').css('visibility' , 'hidden')

				$(this).find('.arrow-left').click( function() {
					if(currNr==0)
						gotoImage(nrChildren-1)
					else
						gotoImage(currNr-1)
				});
				$(this).find('.pause').click( function() {
					if(hardpaused==true)
					slideshow_play();
					else
					slideshow_pause();

					navMain.find('.pause').css('visibility' , 'hidden')
					navMain.find('.play').css('visibility' , 'visible')
				});
				$(this).find('.play').click( function() {

					hardpaused=false;
					gotoNext();

					navMain.find('.pause').css('visibility' , 'visible')
					navMain.find('.kenburns-play').css('visibility' , 'hidden')

				});
				$(this).find('.arrow-right').click( function() {
					gotoNext();
				});
				if(!jQuery.browser.msie) {
					$(this).mouseover( function() {
						navMain.stop();
						navMain.animate({
							opacity:1
						},1000)
					});
					$(this).mouseout( function() {
						navMain.stop();
						navMain.animate({
							opacity:0
						},1000)
					});
				}

			}
			var buttonPos=0;
			if(buttonsAlign=="right")
				buttonPos=totalWidth - nav_space - (10 + o.thumb_space) * (nrChildren) - 5;

			if(buttonsAlign=="center")
				buttonPos=totalWidth/2 - ((thumbSpace + thumbWidth) * (nrChildren))*0.5;

			if(nav_type.indexOf("numbers")>-1) {
				for(i=0;i<nrChildren;i++) {
					navMain.append("<div class='navigation-numbers' style='left:" + buttonPos + "px; top:" + (totalHeight - nav_space - 20) + "px;'>" + (i+1) + "</div>")
					if(i!=0)
						navMain.children().eq(i).css('opacity', '0.7')
					buttonPos+= 10 + o.thumb_space;
					
					navMain.children().eq(i).click( function() {
						gotoImage(navMain.children().index(jQuery(this)))
					})
					navMain.children().eq(i).mouseout( function() {
						if(navMain.children().index(jQuery(this))!=currNr)
							jQuery(this).css('opacity', '0.7')
					})
					navMain.children().eq(i).mouseover( function() {
						if(navMain.children().index(jQuery(this))!=currNr)
							jQuery(this).css('opacity', '0.9')
					})
				}
			}

			if(hideOnCue=="on")
				for(i=0;i<imgCon.children().length;i++)
					imgCon.children().eq(i).css('opacity', '0')

			navMain.css({'position' : 'absolute', 'top' : '0px', 'z-index' : '90'})
			images.css({'position' : 'absolute', 'max-width' : '10000px'})
			
			//jQuery.each(images).find('img').css({'position' : 'absolute', 'max-width' : '10000px'});

			var nrLoaded = 0;
			totalImages=images.length;
			var started=false;
			for (i = 0; i < nrChildren; i++) {
				images.eq(i).load( function() {
				})
				if(images.eq(i)[0].nodeName!='IMG')
					totalImages--;

			}

			function checkLoaded() {
				nrLoaded++;
				if(nrLoaded>=totalImages) {
					startScript();
				}
			}

			setTimeout(failSafe,500)
			function failSafe() {
				//function to ensure that the slideshow has started
				if(started==false)
					startScript();
			}

			function startScript() {
				//this is where the script starts
				started=true;
				jQuery('.preloader').fadeOut("slow");

					cthis.animate({'opacity': 1},500)
					if(o.settings_shadow=="on")
					cthis.parent().find('.pg-shadow').animate({'opacity': 1},1000);
					//cthis.css('opacity',1)

				if(transition_type=='fade')
					cthis.find('.transitionCon').remove();

				for (i = 0; i < nrChildren; i++) {
					widthArray[i] = images.eq(i).width();
					//if(images.eq(i)[0]!=null && images.eq(i)[0].nodeName=='LI')
					//console.log(images.eq(i).find('img').eq(0).width());
					//console.log(widthArray);
					heightArray[i] = images.eq(i).height();
					if(o.settings_autoheight=='on'){
					post_heightArray[i]=images.eq(i).height();
					}
				}
					//console.log(post_heightArray);

				gotoImage(0,'on');
				intervalID = setInterval(checkTimer, 1000)
				cthis.find('.thumbsSlider').children().eq(0).css('opacity', 1);
			}

			function constructBlocks(arg) {
				cthis.find('.transitionCon').css('visibility', 'visible');
				
				transition_strips_x = o.transition_strips_x;
				transition_strips_y = o.transition_strips_y;
				
				if(transition_type.indexOf('horizontal')>-1)
			transition_strips_y=1;
			if(transition_type.indexOf('vertical')>-1)
			transition_strips_x=1;
			
			
				if(transition_type=='wipe'){
					transition_strips_x=1;
					transition_strips_y=1;
				}
			
			
			stripWidth=totalWidth / transition_strips_x;
			if(stripWidth!=parseInt(stripWidth))
			stripWidth=parseInt(stripWidth)+1;
			stripHeight=totalHeight / transition_strips_y;
			if(stripHeight!=parseInt(stripHeight))
			stripHeight=parseInt(stripHeight)+1;
					
				for(i=0;i<transition_strips_x * transition_strips_y;i++) {
					
					cthis.find('.transitionCon').append('<div class="transition-block-con"><div class="transition-block"></div></div>');
					cthis.find('.transition-block').eq(i).append(images.eq(arg).clone());
					cthis.find('.transition-block-con').eq(i).css({'width' : stripWidth,'height' : stripHeight
					})
					
					if(transition_type.indexOf('horizontal')>-1){
						cthis.find('.transition-block-con').eq(i).css({
						'left' : stripWidth * i,
						'top' : 0
						})
						cthis.find('.transition-block').eq(i).css({
						'left' : stripWidth * -i,
						'top' : 0
					})
					}
					
					if(transition_type.indexOf('vertical')>-1){
						cthis.find('.transition-block-con').eq(i).css({
							'left' : 0,
							'top' : stripHeight * i
						})
						cthis.find('.transition-block').eq(i).css({
							'left' : 0,
							'top' : stripHeight * -i
						})
					}
					
					
					/*
					cthis.find('.transition-block-con').eq(i).css({
						'left' : stripWidth * i,
						'top' : stripHeight * i
						})
					cthis.find('.transition-block').eq(i).css({
						'left' : stripWidth * -i,
						'top' : stripHeight * -i
					})
					*/
					cthis.find('.transition-block').eq(i).children().eq(0).css({
						'visibility' : 'visible',
						'opacity' : 1
					})

					if(animateStrips=="on")
						itemsArray.push(cthis.find('.transition-block').eq(i).children().eq(0));

				}
				animateBlocks();
			}

			function animateBlocks() {
				if(transition_type=='strips_horizontal_simple'){
				for(i=0;i<cthis.find('.transition-block-con').length;i++) {
					cthis.find('.transition-block-con').eq(i).css({
						'top' : -stripHeight
					})
					cthis.find('.transition-block-con').eq(i).animate({
						'top' : 0
					}, {duration: block_animation_time + block_animation_delay * i, queue:false})
				}
				}
				if(transition_type=='strips_horizontal_fade_simple' || transition_type=='strips_vertical_fade_simple'){
				for(i=0;i<cthis.find('.transition-block-con').length;i++) {
					cthis.find('.transition-block-con').eq(i).css({
						'opacity' : 0
					})
					cthis.find('.transition-block-con').eq(i).animate({
						'opacity' : 1
					}, {duration: block_animation_time + block_animation_delay * i, queue:false})
					
					
					if(jQuery.browser.msie==true && jQuery.browser.version<9){
					cthis.find('.transition-block-con').eq(i).children().eq(0).children().eq(0).css({
						'opacity' : 0
					})
						
					cthis.find('.transition-block-con').eq(i).children().eq(0).children().eq(0).animate({
						'opacity' : 1
					}, {duration: block_animation_time + block_animation_delay * i, queue:false})
					
					}
				}
				}
				//console.log("*********************************************")
				if(transition_type=='strips_horizontal_fade_random' || transition_type=='strips_vertical_fade_random'){
				for(i=0;i<cthis.find('.transition-block-con').length;i++) {
					var targetnr = return_random_nr(cthis.find('.transition-block-con').length);
					cthis.find('.transition-block-con').eq(targetnr).css({
						'opacity' : 0
					})
					cthis.find('.transition-block-con').eq(targetnr).animate({
						'opacity' : 1
					}, {duration: block_animation_time + block_animation_delay * i, queue:false})
					
					
					
					
					if(jQuery.browser.msie==true && jQuery.browser.version<9){
					cthis.find('.transition-block-con').eq(targetnr).children().eq(0).children().eq(0).css({
						'opacity' : 0
					})
						
					cthis.find('.transition-block-con').eq(targetnr).children().eq(0).children().eq(0).animate({
						'opacity' : 1
					}, {duration: block_animation_time + block_animation_delay * i, queue:false})
					
					}
					
					
				}
					while(random_selected_array.length>0)	random_selected_array.pop();
				}
				
				//VERTICAL TRANSITIONS
				
				if(transition_type=='strips_vertical_simple'){
				for(i=0;i<cthis.find('.transition-block-con').length;i++) {
					cthis.find('.transition-block-con').eq(i).css({
						'left' : -stripWidth
					})
					cthis.find('.transition-block-con').eq(i).animate({
						'left' : 0
					}, {duration: block_animation_time + block_animation_delay * i, queue:false})
				}
				}
				
				//WIPE
				
				if(transition_type=='wipe'){
				for(i=0;i<cthis.find('.transition-block-con').length;i++) {
					
					cthis.find('.transition-block-con').eq(i).css({
						'width':0,
						'left' : stripWidth
					})
					
					cthis.find('.transition-block-con').eq(i).animate({
						'width':stripWidth,
						'left' : 0
					}, {duration: block_animation_time + block_animation_delay * i, easing:block_animation_easing, queue:false})
					
					
					cthis.find('.transition-block').eq(i).css({
						'left' : -stripWidth/5*4
					})
					cthis.find('.transition-block').eq(i).animate({
						'left' : 0
					}, {duration: block_animation_time + block_animation_delay * i, easing:block_animation_easing, queue:false})
					
					
					cthis.find('.transition-block').eq(i).children().eq(0).css({
						//'margin-left' : stripWidth/5
					})
					cthis.find('.transition-block').eq(i).children().eq(0).animate({
						//'left' : 0
					}, {duration: block_animation_time + block_animation_delay * i, queue:false})
				}
				}
				
				setTimeout(removeBlocks, (block_animation_time + block_animation_delay * i + 100));
			}

			function removeBlocks() {
				//return;
				cthis.find('.transitionCon').css('visibility', 'hidden');
				cthis.find('.transition-block-con').remove();
				images.eq(currNr).css({ 'display' : 'block'});
				//images.eq(currNr).css('visibility','visible')

				fade_after_transition();

			}

			function hidePrev() {
				images.eq(tempNr).stop();
			}

			function gotoNextPage() {
				if(currPage>nav_max_pages-2)
									return;

				currPage++;
				gotoPage(currPage);

			}

			function gotoPrevPage() {
				if(currPage==0)
					return;

				currPage--;

				gotoPage(currPage);

			}
			function gotoPage(arg){
				if(arg>=nav_max_pages)
				return;
				
				
				if(arg==nav_max_pages-1){
					
					if(nav_position=="right")
						thumbsCon.animate({
							'top' : (nav_page_width * -(nav_max_pages-2)) - nav_excess_thumbs
						},{duration:400, queue:false});

				if(nav_position=="down")
					thumbsCon.animate({
						'left' : (nav_page_width * -(nav_max_pages-2)) - nav_excess_thumbs
					},{duration:400, queue:false});
					
				}else{
					
				if(nav_position=="right")
					thumbsCon.animate({
						'top' : nav_page_width * -arg
					},{duration:400, queue:false});

				if(nav_position=="down")
					thumbsCon.animate({
						'left' : nav_page_width * -arg
					},{duration:400, queue:false});
					
				}
				
				currPage=arg;
			}
			/*
			gotoImage function
			______________________________*/
			function gotoImage(arg,pfirstTime) {
				if(arg==currNr || started==false || busy==true)
					return;

				busy=true;
				
				
				
				while(itemsArray.length>0)
					itemsArray.pop();

				cacheObject=images.eq(arg);

				//center fix
				var margin_left = (totalWidth - images.eq(arg).width()) / 2;
				//var margin_top = (totalHeight - images.eq(arg).height()) / 2;
				imgCon.children().eq(arg).css('margin-left', margin_left);
				//imgCon.children().eq(arg).css('margin-top', margin_top);
				
					
				if(currNr>=0) {
					tempNr=currNr;
					setTimeout(hidePrev,fadeTime)
					images.eq(currNr).css('z-index',lastIndex)
				}
				cthis.find('.transition-block-con').remove();

				for(i=0;i<nrChildren;i++)
					if((i==currNr || i==arg)) {
						images.eq(i).css('display','block')
						//images.eq(i).css('visibility','visible')

					} else {
						images.eq(i).css('display','none')
					}


				
				if(main_transition_type=='random'){
				transition_type=randomise_transition();
				}
				if(transition_type!='fade' && transition_type!='swipe' && transition_type!='slide') {
					constructBlocks(arg);
					transitionCon.css('display', 'inline-block');
				}else{
					transitionCon.css('display', 'none');
				}
				cacheObject.css('z-index', lastIndex + 1)
				lastIndex++;

				if(cacheObject.attr("data-slideshowTime")===0 || cacheObject.attr("data-slideshowTime")==undefined)
					slideshowTime=5;
				else
					slideshowTime=parseFloat(cacheObject.attr("data-slideshowTime"));

				if(cacheObject.attr("data-transitionTime")=='' || cacheObject.attr("data-transitionTime")==undefined)
					transitionTime=5000;
				else
					transitionTime=parseFloat(cacheObject.attr("data-transitionTime"))*1000;

				initialPosition=cacheObject.attr("data-initialPosition");
				finalPosition=cacheObject.attr("data-finalPosition");

				realImageWidth=widthArray[arg];
				realImageHeight=heightArray[arg];

				initialZoom = images.eq(arg).attr("data-initialZoom");
				finalZoom = images.eq(arg).attr("data-finalZoom");

				if(initialZoom==undefined)
					initialZoom=1;

				if(finalZoom==undefined)
					finalZoom=1;

				if(realImageWidth===0) {
					realImageWidth=totalWidth;
					realImageHeight=totalHeight;
				}

				if(cacheObject.attr("data-href")!=undefined && cacheObject.attr("data-href")!='') {

					cacheObject2 = (descMain.children().eq(arg));
					cacheObject2.css('cursor','pointer')

					if(cacheObject2.attr("data-target")=="_self") {
						cacheObject2.click( function() {
							location.href=cacheObject.attr("data-href");
						})
					} else {
						cacheObject2.click( function() {
							window.open(cacheObject.attr("data-href"));
						})
					}

				}

				var auxcenter = -(realImageWidth * initialZoom - totalWidth) * 0.5;
				var auxright = auxcenter*2;

				var auxcenter2 = -(realImageHeight * finalZoom - totalHeight) * 0.5;
				var auxright2 = auxcenter2*2;

				aux1=aux2=0;
				switch(initialPosition) {
					case "topCenter":
						aux1=auxcenter;
						break;
					case "topRight":
						aux1=auxright;
						break;
					case "middleLeft":
						aux2=auxcenter2;
						break;
					case "middleCenter":
						aux1=auxcenter;
						aux2=auxcenter2;
						break;
					case "middleRight":
						aux1=auxright;
						aux2=auxcenter2;
						break;
					case "bottomLeft":
						aux2=auxright2;
						break;
					case "bottomCenter":
						aux1=auxcenter;
						aux2=auxright2;
						break;
					case "bottomRight":
						aux1=auxright;
						aux2=auxright2;
						break;

				}
				old_aux1=aux1;
				old_aux2=aux2;
				itemsArray.push(cacheObject);

				var auxtarget;
				for(i=0;i<itemsArray.length;i++) {
					
					auxtarget = itemsArray[i];
					
					if(itemsArray[i][0]!=null && itemsArray[i][0].nodeName=="LI")
					auxtarget=itemsArray[i].find('img').eq(0);
					
					
					
				}

				auxcenter = -(realImageWidth * finalZoom - totalWidth) * 0.5;
				auxright = auxcenter*2;

				auxcenter2 = -(realImageHeight * finalZoom - totalHeight) * 0.5;
				auxright2 = auxcenter2*2;

				aux1=aux2=0;

				switch(finalPosition) {
					case "topCenter":
						aux1=auxcenter;
						break;
					case "topRight":
						aux1=auxright;
						break;
					case "middleLeft":
						aux2=auxcenter2;
						break;
					case "middleCenter":
						aux1=auxcenter;
						aux2=auxcenter2;
						break;
					case "middleRight":
						aux1=auxright;
						aux2=auxcenter2;
						break;
					case "bottomLeft":
						aux2=auxright2;
						break;
					case "bottomCenter":
						aux1=auxcenter;
						aux2=auxright2;
						break;
					case "bottomRight":
						aux1=auxright;
						aux2=auxright2;
						break;

				}
				//console.log(aux1,old_aux1, aux2, old_aux2, initialZoom, finalZoom)
				
				if((aux1!=old_aux1) || (aux2!=old_aux2) || (initialZoom!=finalZoom)){
				for(i=0;i<itemsArray.length;i++) {
					
					
					
					auxtarget = itemsArray[i];
					
					if(itemsArray[i][0]!=null && itemsArray[i][0].nodeName=="LI")
					auxtarget=itemsArray[i].find('img').eq(0);
					
					auxtarget.css({
						left:old_aux1,
						top:old_aux2,
						width: initialZoom*realImageWidth,
						'position' : 'absolute',
						'max-width' : 10000
					})
					
					
					auxtarget.animate({
						left:aux1,
						top:aux2,
						width: finalZoom*realImageWidth
					},{	duration: transitionTime,	queue: false},easingType)

					//console.log(itemsArray[i].find('img'));
					/*
				if(itemsArray[i][0].nodeName!="IMG"){
					console.log(itemsArray[i].find('img'));
					itemsArray[i].find('img').animate({
						'width': finalZoom*realImageWidth
					},{	duration: transitionTime,	queue: false},easingType)
				}
				*/
				
				}
				}
				
				//end transition handle




				if(pfirstTime!='on')
					cacheObject.css({
						'opacity':0,
						'left' : 0,
						'top' : 0
						})

				if(transition_type!='fade' && transition_type!='swipe' && transition_type!='slide') {
					cacheObject.css('display','none')
					cacheObject.css('opacity',1)
					//cacheObject.css('visibility', 'hidden');
				} else {
					setTimeout(fade_after_transition, fadeTime)
					if(transition_type=='fade'){
					cacheObject.animate({
						opacity:1
					},{queue:false, duration:fadeTime})
					}
					if(transition_type=='swipe'){
						cacheObject.css({
							'opacity' : 1,
							'left' : totalWidth + shadow_size
						})
					cacheObject.animate({
						left:0
					},{queue:false, duration:fadeTime})
					}
					if(transition_type=='slide'){
						images.eq(currNr).animate({
							'left' : -totalWidth
						},{queue:false, duration:fadeTime})
						
						cacheObject.css({
							'opacity' : 1,
							'left' : totalWidth + shadow_size
						})
					cacheObject.animate({
						left:0
					},{queue:false, duration:fadeTime})
					}
				}

				for(i=0;i<images.length;i++) {
					if(i==currNr||i==arg) {
						if(descriptionArray[i].children().length>0)
							descriptionArray[i].css('visibility', 'visible')
					} else
						descriptionArray[i].css('visibility', 'hidden')
				}

				descriptionArray[arg].css({
					top:-15,
					opacity:0
				})

				if (jQuery.browser.mozilla && (parseFloat(jQuery.browser.version) < 3)) {
					descriptionArray[arg].css({
						top:-15,
						opacity:1
					})
				}
				descriptionArray[arg].animate({
					top:0,
					opacity:1
				},{queue:false, duration:fadeTime})

				if(currNr>=0) {

					descriptionArray[currNr].animate({
						opacity:0
					},{queue:false, duration:fadeTime,complete:hideIt})

					if(jQuery.browser.msie)
						hideItArg(descriptionArray[currNr]);

					/*if(jQuery.browser.msie==2){
 					descriptionArray[currNr].children().eq(0).animate({opacity: 0},{queue:false, duration:fadeTime});
 					descriptionArray[currNr].children().eq(1).animate({opacity: 0},{queue:false, duration:fadeTime});
 					}*/

					if(nav_type.indexOf("numbers")>-1) {
						navMain.children().eq(currNr).css('opacity','0.7')
						navMain.children().eq(arg).css('opacity','1')

					}
					if(nav_type.indexOf("thumbs")>-1) {
						cthis.find('.thumbsSlider').children().eq(currNr).css('opacity',thumbs_normal_alpha)
						cthis.find('.thumbsSlider').children().eq(arg).css('opacity',thumbs_roll_alpha)

					}

				}
				
				
				if(o.settings_autoheight=='on'){
				var aux=totalHeight;
				if(post_heightArray[arg]>totalHeight)
					aux=post_heightArray[arg] +10 ;
					
					
				if(nav_type.indexOf('thumbs')>-1 && o.nav_size==undefined) {
				aux+= nav_space + thumb_height;
				}
				
					
				cthis.animate({'height' : aux},{queue:false, duration:fadeTime}).css('overflow', 'visible');
				
				cthis.find('.imgMain').animate({'height' : aux - o.nav_space - thumb_height},{queue:false, duration:fadeTime}); 
				if(nav_type.indexOf('thumbs')>-1 && o.nav_position=="down")
				thumbsMain.animate({'top' : aux - thumb_height},{queue:false, duration:fadeTime})
				
				}
				jQuery('.phoenixgallery-caption').eq(currNr).fadeOut('slow');
				jQuery('.phoenixgallery-caption').eq(arg).fadeIn('slow');
				currNr=arg;
				tempCount=0;
				setTimeout(setIndex,2000)

			}
			function randomise_transition(){
				var randomNr = Math.floor(Math.random()*8)
				var output="";
				switch(randomNr){
					case 1:
					output="strips_horizontal_simple";
					break;
					case 2:
					output="strips_horizontal_fade_simple";
					break;
					case 3:
					output="strips_horizontal_fade_random";
					break;
					case 4:
					output="strips_vertical_simple";
					break;
					case 5:
					output="strips_vertical_fade_simple";
					break;
					case 6:
					output="strips_vertical_fade_random";
					break;
					case 7:
					output="wipe";
					break;
					default:
					output="fade";
					break;
				}
				return output;
			}
			function fade_after_transition() {
				if(images.eq(tempNr).attr('title')=='' || images.eq(tempNr).attr('title')==undefined)
					descMain.css('visibility', 'hidden')

				if(tempNr!=currNr)
				images.eq(tempNr).css('display', 'none');
				busy=false;
			}

			function hideIt() {
				jQuery(this).css('visibility', 'hidden');
			}

			function hideItArg(arg) {
				if(arg!='undefined') {
					jQuery(arg).css('visibility', 'hidden');
					return;
				}
			}

			function setIndex() {
				//alert('ceva')
				//images.eq(currNr + 1).css('z-index', lastIndex + 1)
				//lastIndex++;
			}

			function checkTimer() {
				if(hardpaused==false && o.settings_slideshow=='on'){
					tempCount++;

				if(tempCount>=slideshowTime && paused_roll==false) {
					gotoNext();

				}
				}
			}
			function slideshow_play(){
				hardpaused=false;
			}
			function slideshow_pause(){
				hardpaused=true;
			}
			function gotoNext() {

				if(currNr==nrChildren-1)
					gotoImage(0)
				else
					gotoImage(currNr+1)
					
				if(Math.floor((currNr)/thumbs_per_page)!=currPage){
					gotoPage(Math.floor((currNr)/thumbs_per_page))
				}
			}

			function gotoPrev() {
				if(currNr==0)
					gotoImage(nrChildren-1)
				else
					gotoImage(currNr-1)
			}

			
			if(o.settings_pauseonrollover=='on'){
				cthis.mouseenter(function(){
					paused_roll=true;
				})
				cthis.mouseleave(function(){
					paused_roll=false;
				})
			}



			$.fn.phoenixgallery.gotoImage = function(arg) {
				gotoImage(arg);
			}
			
			
			$.fn.phoenixgallery.gotoNext = function() {
				gotoNext();
			}
			$.fn.phoenixgallery.gotoPrev = function() {
				gotoPrev();
			}
			$.fn.phoenixgallery.slideshow_pause = function() {
				slideshow_pause();
			}
			
			$.fn.phoenixgallery.slideshow_play = function() {
				slideshow_play();
			}
			
			
			
			return this;

		}); // end each
	}
})(jQuery);
//*PREVIEW STUFF*//
var random_selected_array=[];
var sw=0;
var retnr=0;
function return_random_nr(arg){
	retnr= parseInt(Math.random() * arg);
	sw=0;
	for(r=0;r<random_selected_array.length;r++)
	if(random_selected_array[r]==retnr){
	sw=1;
	return_random_nr(arg);
	}
	if(sw==0){
	random_selected_array.push(retnr);
	return retnr;
	}
	
}
function zs2_add_configurator(){
	var form_string="<form><h4>WIDTH & HEIGHT</h4><input type='text' name='o11' value='830'></input><input type='text' name='o12' value='400'></input>\
	<h4>THUMBS WIDTH & HEIGHT</h4><input type='text' value='100' name='o21'></input><input type='text' value='75'  name='o22'></input>\
	<h4>MENU POSITION</h4><select name='sel1'><option>right</option><option>down</option></select>\
	<h4>TRANSITION</h4><select name='sel2'><option>random</option><option>strips_horizontal_simple</option><option>wipe</option><option>fade</option><option>strips_horizontal_fade_simple</option><option>strips_horizontal_fade_random</option><option>strips_vertical_simple</option><option>strips_vertical_fade_simple</option><option>strips_vertical_fade_random</option></select>\
	<h4>NAVIGATION</h4><select name='sel3'><option>thumbs</option><option>numbers</option><option>arrows</option></select>\
	<h4>STRIPS NR X&Y</h4><input type='text' value='15' name='o31' maxlength='2'></input><input type='text' value='15'  name='o32' maxlength='2'></input>\
    <h4>IMAGES AUTORESIZE</h4><select name='sel4'><option>off</option><option>on</option></select>\
    <h4>SHADOW</h4><select name='sel5'><option>on</option><option>off</option></select>\
    <br><br><button type='submit'>Apply</button></form>"
	
	//if((window.location.href).indexOf('example-1')>-1 || (window.location.href).indexOf('localhost')>-1)
	jQuery('body').append('<div class="gallery-configurator"><div class="activator"></div>' + form_string + '</div>')
	jQuery('body').css('overflow-x', 'hidden');
	jQuery('.gallery-configurator .activator').click(zs2_configurator_click);
	jQuery('.gallery-configurator').animate({
		'opacity' : 0.9
	},{duration:700}).animate({
		'right' : -300
	},{duration:1200})
	
}
function zs2_configurator_click(){
	if (jQuery('.gallery-configurator').css('right') == '-25px') 
		jQuery('.gallery-configurator').animate({
			'right': -300
		}, {
			duration: 300,
			queue: false,
			complete:zs2_configurator_end
		})
	else {
		jQuery('.gallery-configurator').animate({
			'right': -25
		}, {
			duration: 300,
			queue: false
		})
	}
}
function zs2_configurator_end(){
	//jQuery('.gallery-configurator-con').css('z-index', '0')
}
function is_ie8(){
	if(jQuery.browser.msie==undefined){
		return false;
	}else{
		if(jQuery.browser.version>8)
		return false;
		else
		return true;
	}
}
