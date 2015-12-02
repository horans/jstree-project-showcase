# jsTree Showcase
a web project showcase base on [jsTree](https://github.com/vakata/jstree)

#### how to use
we will looking for the json in url query string (ie. `project=sample.json`), or loading the default `project.json` in the same directory.

#### feature
* functions base on [jQuery](https://github.com/jquery/jquery) + [jsTree](https://github.com/vakata/jstree), styled with [Bootstrap](https://github.com/twbs/bootstrap) 3 default setting.
* use json to store data, nodes(project/folder/page) can be leveled and searched.
* preview page in iframe and display project information.
* sidebar can be shrinked or expanded to view responsive page. (self screen breakpoint is 1024px.)
* use [jquery.qrcode](https://github.com/jeromeetienne/jquery-qrcode) to display links qrcode.
* use [url()](https://github.com/websanova/js-url) to get url query strings and update them with the HTML5 API [History.pushState()](https://developer.mozilla.org/docs/Web/API/History/pushState).

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
	  "type"          : "project",                 //node type, "project/folder/page"
	  "li_attr"       : {},                        //extra attribute of the node, affect selft and all sub nodes
	  "a_attr"        : {                          //extra attribute of the node, affect self only
	    "class"       : "page-primary",            //node color, "page-project/page-folder/page-primary", not required
	    "target"      : "show",                    //iframe id, required, should not be changed
	    "href"        : "intro.html"               //page address, "intro.html" for project, "#" for folder
	  }
	}]