# jstree-project-showcase
a web project showcase base on jstree

[how to use]
we will looking for the json in url query string (ie. "project=sample.json"), or loading the default "project.json" in the same directory.

[json sample]

[{
  "site"          : "项目预览 | Showcase",                        //title of the site, first project only
  "data"          : {                                             //project data
    "title"       : "项目预览",                                   //title
    "author"      : "horan",                                      //author
    "date"        : "15.11",                                      //release date
    "description" : "侧栏显示项目与页面列表，方便预览。",         //description
    "tag"         : [{                                            //tag list
      "term"      : "HTML5"
	},{
      "term"      : "CSS3"
	},{
      "term"      : "JavaScript"
	},{
      "term"      : "jQuery"
	},{
      "term"      : "Bootstrap"
    }],
    "feature"     : [{                                            //feature list
      "point"     : "function base on <a href=\"https:\/\/github.com\/jquery\/jquery\" target=\"_blank\">jQuery<\/a> + <a href=\"https:\/\/github.com\/vakata\/jstree\" target=\"_blank\">jstree<\/a>，using <a href=\"https:\/\/github.com\/twbs\/bootstrap\" target=\"_blank\">Bootstrap<\/a> 3 default style。"
    }]
  },
  "state"         : {                                             //initial select, first project only
    "selected"    : true
  },
  "id"            : "pjsc-project",                               //node id, must be unique
  "parent"        : "#",                                          //parent id, "#" as root
  "text"          : "[1511] jstree project showcase",             //node title
  "type"          : "project",                                    //node type, "project/folder/page"
  "li_attr"       : {},                                           //extra attribute of the node, affect selft and all sub nodes
  "a_attr"        : {                                             //extra attribute of the node, affect self only
    "class"       : "page-primary",                               //node color, "page-project/page-folder/page-primary", not required
    "target"      : "show",                                       //iframe id, required, should not be changed
    "href"        : "intro.html"                                  //page address, "intro.html" for project, "#" for folder
  }
}]
