// JavaScript Document
$(function() {
	'use strict';

	//set language
	var lang = 'zh-CN';		//zh-CN, en-US
	switch(lang){
		case 'zh-CN': break;
		case 'en-US': break;
		default: lang = 'en-US';
	}

	//set project
	var pData = 'project.json';
	if($.url('?project')){
		pData = $.url('?project');
	}

	var aHover;
	/********** sidebar **********/
	//set height and width
	var bWidth = document.documentElement.clientWidth;
	var bHeight = document.documentElement.clientHeight;
	$('iframe').add('.handle').add('.cover').height(bHeight);
	$('.page-tree').height(bHeight - 210);
	
	//shrink/expand sidebar
	if(bWidth < 1024){
		$('.container').addClass('mobile');
		urlChng('mode', 'mobile');
	} else {
		if($.url('?mode') === 'shrink'){
			$('.container').addClass('shrink');
		} else if($.url('?mode') === 'expand'){
			$('.container').addClass('expand');
		} 
	}
	
	$('.handle').click(function(){
		if(bWidth < 1024){
			$('.container').toggleClass('open');
		} else {
			if($('.container').hasClass('expand')){
				$('.container').toggleClass('expand');
				$('.container').toggleClass('shrink');
				urlChng('mode', 'shrink');
			} else if($('.container').hasClass('shrink')){
				$('.container').toggleClass('shrink');
				urlChng('mode', '');
			} else {
				$('.container').toggleClass('expand');
				urlChng('mode', 'expand');
			}

			//reload iframe
			if($( 'iframe' ).attr( 'src') !== 'intro.html'){
				$('.cover').addClass('show');
				setTimeout(function(){
					$('.cover').removeClass('show');
					$( 'iframe' ).attr( 'src', function ( i, val ) { return val; });
				}, 600);
			}
		}
	});

	//translation
	var help;
	var hasLang = false;
	$.getJSON('language/' + lang + '.json', function(data){
		if(lang !== 'en-US'){
			document.title = data.title;
			$('.page-input',  '.page-tool').attr('placeholder', data.tool.srch);
			$('.page-filter', '.page-tool').attr('title', data.tool.filt);
			$('.page-zoom',   '.page-tool').attr('title', data.tool.zoom);
			$('.page-help',   '.page-tool').attr('title', data.tool.help);
			$('.page-project + span', '.page-update').text(data.update.proj);
			$('.page-folder + span',  '.page-update').text(data.update.fold);
			$('.page-new + span',    '.page-update').text(data.update.page);
		}

		help = data.help;
		hasLang = true;
	});
	
	var tryLang = setInterval(function(){
		if(hasLang){
			clearInterval(tryLang);
			showHelp();
		}
	}, 300);

	var hOld = 0;
	var showHelp = function(){
		var hIndex = Math.floor(Math.random() * help.length);
		while (hOld === hIndex){
			hIndex = Math.floor(Math.random() * help.length);
		}
		hOld = hIndex;
		$('.page-desc').hide().html(help[hIndex].tips).fadeIn();
	};
	$('.page-help').click(function(){
		if(hasLang){
			showHelp();
		}
	});

	//show info
	setTimeout(function(){
		$.getJSON(pData, function(data){
			//count page
			var nProj = 0;
			var nFold = 0;
			var nPage = 0;
			for(var i = 0; i < data.length; i++){
				if(data[i].type === 'project'){
					nProj++;
				} else if(data[i].type === 'folder'){
					nFold++;
				} else if(data[i].type === 'page'){
					nPage++;
				}
			}
			$('.page-title').text(data[0].site).removeClass('transparent');
			$('.page-project + span + span').text(nProj).removeClass('transparent');
			$('.page-folder + span + span').text(nFold).removeClass('transparent');
			$('.page-new + span + span').text(nPage).removeClass('transparent');
		});
	}, 400);

	/********** tree **********/
	//build tree
	$('.page-tree')
	//change iframe
	.on('select_node.jstree', function (e, data) {
		var iLink = data.node.a_attr.href;
		var iTarget = data.node.a_attr.target;
		if(iLink !== '#'){
			if(iTarget === 'show'){
				$('#show').attr('src', iLink);
				if(bWidth < 1024){
					$('.container').toggleClass('open');
				}
			} else if(iTarget === 'blank'){
				window.open(iLink);
			}
		}
		//toggle folder
		if(data.node.type === 'folder'){
			$('.page-tree').jstree(true).toggle_node(data.node);
		}
		//show project info
		if(data.node.type === 'project'){
			var chkPage = setInterval(function(){
				if($('#show').contents().find('.title').length > 0){
					setPage();
				}
			}, 300);
			var setPage = function(){
				$('#show').contents().find('.title').html(data.node.data.title);
				$('#show').contents().find('.date').html(data.node.data.date);
				$('#show').contents().find('.author').html(data.node.data.author);
				$('#show').contents().find('.description').html(data.node.data.description);
				for(var i = 0; i < data.node.data.tag.length; i++){
					$('#show').contents().find('.tag').append('<span class="badge">' + data.node.data.tag[i].term + '</span>');
				}
				for(var j = 0; j < data.node.data.feature.length; j++){
					$('#show').contents().find('.feature').append('<li>' + data.node.data.feature[j].point + '</li>');
				}
				$('#show').contents().find('.transition').removeClass('transparent');
				clearInterval(chkPage);
			};
		}
	})
	//show qrcode
	.on('hover_node.jstree', function (e, data){
		if(bWidth > 1023 && data.node.type === 'page'){
			aHover = setTimeout(function(){
				if(data.node.a_attr.href !== '#'){
					var aElement = $('#' + data.node.id + '_anchor');
					$('.page-qrcode').fadeIn()
					.css('top', aElement.offset().top - 220)
					.css('left', aElement.offset().left)
					.qrcode({
						width: 200,
						height: 200,
						text: aElement.prop('href')
					});
					//tweak for top page
					if(aElement.offset().top <= 220){
						$('.page-qrcode').css('top', aElement.offset().top + 24);
					}
				}
			}, 1500);
		}
	})
	//hide qrcode
	.on('dehover_node.jstree', function (){
		clearTimeout(aHover);
		$('.page-qrcode').empty().fadeOut();
	})
	//load from json
	.jstree({
		'core' : {
			'data' : {
				'url' : pData,
				'data' : function (node) {
					return { 'id' : node.id };
				}
			}
		},
		//config
		'types' : {
			'project' : {
			  'icon' : 'glyphicon glyphicon-pushpin',
			  'valid_children' : ['folder', 'page']
			},
			'folder' : {
			  'icon' : 'glyphicon glyphicon-folder-open',
			  'valid_children' : ['folder', 'page']
			},
			'page' : {
			  'icon' : 'glyphicon glyphicon-file',
			  'valid_children' : []
			}
		  },		
		'plugins': [ 'search', 'state', 'wholerow', 'types' ]
	});
	
	//search tree
	var to = false;
	$('.page-input').keyup(function () {
		if(to) { clearTimeout(to); }
		to = setTimeout(function () {
			var v = $('.page-input').val();
			$('.page-tree').jstree(true).search(v);
		}, 250);
	});
	
	//clear search
	$('.page-input').click(function(){
		$('.page-input').val('');
		$('.page-tree').jstree(true).clear_search();
	});
	
	//filter search
	$('.page-filter').click(function(){
		var v = $('.page-input').val();
		if(v !== ''){
			$('.page-tree').jstree(true).search(v, true, true);
		}
	});
	
	//zoom tree
	$('.page-zoom').click(function(){
		if($(this).find('i').hasClass('glyphicon-zoom-in')){
			$('.page-tree').jstree(true).open_all('#', 500);
		} else {
			$('.page-tree').jstree(true).close_all('#', 500);
		}
		$(this).find('i').toggleClass('glyphicon-zoom-in glyphicon-zoom-out');
	});

	//new window
	$('.page-tree').delegate('.glyphicon-file', 'click', function(){
		var nLink = $(this).parent().attr('href');
		if(nLink !== '#'){
			window.open(nLink);
		}
	});
});

//change url
function urlChng(param, value, push){
	'use strict';
	var query = $.url('?');
	if(value === ''){
		if(query !== undefined){
			delete query[param];
		}
	} else {
		if(query === undefined){
			query = new Object();
		}
		query[param] = value;
	}
	var url = window.location.pathname + ($.isEmptyObject(query) ? '' : ('?' + $.param(query)));
	if(push){
		window.history.pushState(null, null, url);
	} else {
		window.history.replaceState(null, null, url);
	}
}