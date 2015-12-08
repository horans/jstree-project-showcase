# jsTree Showcase
a web project showcase base on [jsTree](https://github.com/vakata/jstree)

#### how to use
1. we will looking for the json in url query string (ie. `project=sample.json`), or loading the default `project.json` in the same directory.
2. we will looking for the language config in url query string (ie. `lang=zh-CN`), or present the page in default english (`en-US`).
3. you can also change settings in `config.js`, but url query string will override them.

#### feature
* functions base on [jQuery](https://github.com/jquery/jquery) + [jsTree](https://github.com/vakata/jstree), styled with [Bootstrap](https://github.com/twbs/bootstrap) 3 default setting.
* use json to store data, nodes(project/folder/page) can be leveled and searched.
* preview page in iframe and display project information.
* sidebar can be shrinked or expanded to view responsive page. (self screen breakpoint is 1024px.)
* use [jquery.qrcode](https://github.com/jeromeetienne/jquery-qrcode) to display links qrcode.
* use [url()](https://github.com/websanova/js-url) to get url query strings and update them with the HTML5 API [History.pushState()](https://developer.mozilla.org/docs/Web/API/History/pushState).
* language switch supported. (english/defualt, chinese)

#### json sample

	[{
	  "site"          : "Project Showcase",        //title of the site, first project only
	  "data"          : {                          //project data
	    "title"       : "sample",	               //title
	    "author"      : "horan",                   //author
	    "date"        : "15.11",                   //release date
	    "description" : "blah blah blah blah",     //description
	    "tag"         : [{                         //tag list
	      "term"      : "HTML5"
		},{
	      "term"      : "CSS3"
		},{
	      "term"      : "JavaScript"
	    }],
	    "feature"     : [{                         //feature list, escaping html tags is advised
	      "point"     : "function base on <a href=\"https:\/\/github.com\/vakata\/jstree\" target=\"_blank\">jstree<\/a>."
	    }]
	  },
	  "state"         : {                          //initial select, first project only
	    "selected"    : true
	  },
	  "id"            : "jtsc-project",            //node id, must be unique
	  "parent"        : "#",                       //parent id, "#" as root
	  "text"          : "[1511] jstree showcase",  //node title
	  "type"          : "project",                 //node type, "project/folder/page/link"
	  "li_attr"       : {},                        //extra attribute of the node, affect selft and all sub nodes
	  "a_attr"        : {                          //extra attribute of the node, affect self only
	    "class"       : "page-primary",            //node color, "page-project/page-folder/page-link/page-page/page-primary"
	    "target"      : "iframe",                  //preview page/link in iframe or new window, "iframe/new"
	    "href"        : "#"                        //page address, "#" for project/folder
	  }
	}]