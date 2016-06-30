// JavaScript Document
$(function() {
	'use strict';

	/********** config **********/
	//set language
	switch($.url('?lang')){
		case 'zh-CN':
		case 'en-US':
			lang = $.url('?lang');
			break;
	}

	//set project
	if(/.json$/.test($.url('?project'))){
		pData = $.url('?project');
	}

	/********** sidebar **********/
	//get browser info
	var bWidth = document.documentElement.clientWidth;
	var bHeight = document.documentElement.clientHeight;
	var isMobile = false;
	var isTablet = false;
	var isDesktop = true;
	if(bWidth < 1024){			//tablet break point
		isDesktop = false;
		if(bWidth < 1024){		//mobile break point
			isMobile = true;
		} else {
			isTablet = true;
		}
	}

	//set height and width
	$('iframe').add('.handle').add('.cover').height(bHeight);
	$('.page-tree').height(bHeight - 210);
	
	//shrink/expand sidebar
	if(isMobile){
		$('.container').addClass('mobile');
		urlChng('mode', 'mobile');
	} else {
		if($.url('?mode') === 'shrink'){
			$('.container').addClass('shrink');
		} else if($.url('?mode') === 'expand'){
			$('.container').addClass('expand');
		} 
	}
	
	//click handle
	$('.handle').click(function(){
		if(isMobile){
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

	/********** vue **********/
	var vm = new Vue({
		el : 'html',
		data : {
			lang : {},
			tips : {},
			node : {},
			count : {
				project : 0,
				folder : 0,
				link : 0,
				page : 0
			}
		},
		methods : {
			showHelp: function(){
				var ts = this.lang.help;
				this.tips = ts[Math.floor(Math.random() * ts.length)].tips;
			}
		},
		watch : {
			'lang' : function(){
				//show help
				$('.page-desc').removeClass('transparent');
				this.showHelp();
			},
			'node' : function(){
				//count nodes
				for(var i = 0; i < this.node.length; i++){
					vm.count[vm.node[i].type] ++
				}
				$('.page-title').add('.page-update').removeClass('transparent');
			}
		},
		ready : function(){
			//load language
			$.getJSON('language/' + lang + '.json', function(data){
				vm.$data.lang = data;
			});

			//load nodes
			$.getJSON(pData, function(data){
				vm.$data.node = data;
			});
		}
	});


	/********** tree **********/
	var aHover;
	vm.$watch('node', function () {
		//build tree
		$('.page-tree').jstree({
			'core' : {
				'data' : vm.node
			},
			//config
			'types' : {
				'project' : {
				  'icon' : 'glyphicon glyphicon-pushpin',
				  'valid_children' : ['project', 'folder', 'page', 'link']
				},
				'folder' : {
				  'icon' : 'glyphicon glyphicon-folder-open',
				  'valid_children' : ['project', 'folder', 'page', 'link']
				},
				'link' : {
				  'icon' : 'glyphicon glyphicon-link',
				  'valid_children' : ['link', 'page']
				},
				'page' : {
				  'icon' : 'glyphicon glyphicon-file',
				  'valid_children' : ['link', 'page']
				}
			  },		
			'plugins': [ 'search', 'state', 'wholerow', 'types' ]
		});
		var pTree = $('.page-tree').jstree(true);

		//open selected node
		var un = $.url('?node');
		$('.page-tree').on('loaded.jstree', function(){
			var cn = pTree.get_selected()[0];
			pTree.deselect_all();
			if(un && un !== cn){
				pTree.select_node(un);
			} else {
				pTree.select_node(cn);
			}
		})
		//override state plugin with url query
		.on('state_ready.jstree', function(){
			var cn = pTree.get_selected()[0];
			if(un && un !== cn){
				pTree.deselect_all();
				pTree.select_node(un);
			}
		})
		//select node
		.on('select_node.jstree', function (e, data) {
			var iLink = data.node.a_attr.href;
			//set page
			var setPage = function(type){
				var ic = $('#show').contents();
				ic.find('.tag').html('');
				ic.find('.feature').html('');
				//type: blank, link, intro
				if(type === 'intro'){
					ic.find('.label.label-info').removeClass('hidden').text(vm.lang.intro.desc);
					ic.find('.label.label-success').removeClass('hidden').text(vm.lang.intro.feat);
					ic.find('.title').html(data.node.data.title);
					ic.find('.date').html(data.node.data.date);
					ic.find('.author').html(data.node.data.author);
					var ts = data.node.data.tag;
					for(var i = 0; i < ts.length; i++){
						ic.find('.tag').append('<span class="badge">' + ts[i].term + '</span>');
					}
				} else {
					ic.find('.label.label-info').addClass('hidden').text('');
					ic.find('.label.label-success').addClass('hidden').text('');
					ic.find('.title').html(data.node.text);
					ic.find('.date').html('');
					ic.find('.author').html('');
				}
				if(type === 'intro'){
					ic.find('.description').html(data.node.data.description);
					var fs = data.node.data.feature;
					for(var j = 0; j < fs.length; j++){
						ic.find('.feature').append('<li>' + fs[j].point + '</li>');
					}
				} else if(type === 'link'){
					ic.find('.description').html(vm.lang.intro.link);
					ic.find('.feature').html('<li><a href="' + iLink + '" target="_blank">' + iLink + '</a></li>');
				} else {
					ic.find('.description').html(data.node.text);
				}
				ic.find('body').removeClass('transparent');
			};

			//change iframe
			switch (data.node.type) {
				case 'page':
				case 'link':
					//change iframe
					if(iLink !== '#'){
						if(iLink === $('#show').attr('src')){
							//$('#show')[0].contentDocument.location.reload(true);
							$('#show').attr('src', function(i, val) { return val; });
						}	
						$('.cover').removeClass('show');
						if(data.node.a_attr.target === 'iframe'){
							$('#show').attr('src', iLink).on('load', function(){
								if(iLink === 'intro.html'){
									setPage('blank');
								}
							});
							if(isMobile){
								$('.container').toggleClass('open');
							}
						} else {
							$('#show').attr('src', 'intro.html').on('load', function(){
								setPage('link');
							});
						}
					}
					break;
				case 'folder':
					//toggle folder
					$('.page-tree').jstree(true).toggle_node(data.node);
					$('.cover').addClass('show');
					$('#show').attr('src', 'intro.html').on('load', function(){
						setPage('blank');
					});
					break;
				case 'project':
					//show info
					$('#show').attr('src', 'intro.html').on('load', function(){
						$('.cover').removeClass('show');
						setPage('intro');
					});
					break;
			}
			//change url query
			urlChng('node', data.node.id);
		})
		//show qrcode
		.on('hover_node.jstree', function (e, data){
			if(!isMobile && (data.node.type === 'page' || data.node.type === 'link')){
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
				}, 2000);
			}
		})
		//hide qrcode
		.on('dehover_node.jstree', function (){
			clearTimeout(aHover);
			$('.page-qrcode').empty().fadeOut();
		})
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