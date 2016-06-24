/*!
 * DBTMQEditor v1.0.0 (http://www.finaltmq.site)
 * author : tmq
 * time : 2016-06-23
 * email : 2069284231@qq.com
 */

/*
参数配置列表分为两部分
1.用于显示，开启响应
2.对响应做出相关反应
 */


(function($) {
	var BPTMQeditor = function(par, showlist) {
		var self = this;
		self.par = par;
		self.topEditor = $("<div class='editor'>"); //文本编辑容器
		self.editorTools = $("<div class='editor-toolbar'>"); //工具栏容器
		self.editorMenu = $("<ul class='editor-menu'>"); //工具栏
		self.editorWnd = $("<div class='tmq-wnd'>"); //编辑容器
		self.editor = $("<div class='textarea tmq-wnd-form form-control' contentEditable='true'>"); //编辑幕布
		self.tab = 6; //TAB键进格多少个
		//代表是否处于全屏状态
		self.editorFixed = !1;
		//保存旧的Range对象
		self.oldRange = null;
		//是否读取旧的Range对象
		self.isLoadOldRange = !1;
		//表示工具栏默认显示那些工具项目
		self.editorMenuDefaultShowList = [
			"bold", //粗体
			"italic", //斜体
			"divider", //分隔符
			"big", //放大字体
			"small", //缩小字体
			"divider",
			"sub", //下标字
			"sup", //上标字
			"divider",
			"del", //删除线
			"ins", //下划线
			"hr", //分隔线
			"divider",
			"a", //链接
			"blockquote", //引用
			"code", //代码
			"kbd", //键盘码
			"pre", //预格式文本
			"divider",
			"color", //字体颜色
			"background-color", //背景颜色
			"divider",
			"danger", //危险突出
			"default", //清淡突出
			"success", //成功突出
			"info", //信息突出
			"warning", //警告突出
			"primary", //主要突出
			"divider",
			"badge", //徽章
			"divider",
			"font-family", //字体
			"font-size", //字号
			"divider",
			"fullscreen" //全屏
		];
		//如果外界设置了工具栏显示目录，进行替换
		self.editorMenuDefaultShowList = !!showlist ? showlist : self.editorMenuDefaultShowList;


		//工具栏中各种类型的工具的类型
		//1.表示用图标显示的工具
		//1.1表示用字母表示的工具
		//1.2代表响应函数需要有弹框的工具
		//1.3代表需要响应重构的工具
		//2.表示多项工具，需要下拉菜单
		//3.表示表格工具，主要是color,background-color，这些颜色设定
		self.editorMenuList = {
			"bold": 1, //代表
			"italic": 1,
			"big": 1.1,
			"small": 1.1,
			"sub": 1,
			"sup": 1,
			"del": 1,
			"ins": 1,
			"hr": 1.1,
			"a": 1.2,
			"blockquote": 1,
			"code": 1,
			"kbd": 1.1,
			"pre": 1.1,
			"divider": 1,
			"color": 3,
			"background-color": 3,
			"danger": 1.1,
			"default": 1.1,
			"success": 1.1,
			"info": 1.1,
			"warning": 1.1,
			"primary": 1.1,
			"badge": 1.1,
			"font-family": 2,
			"font-size": 2,
			"fullscreen": 1.3
		};

		//用户界面中工具栏目录图标要显示的内容，针对不同类型的工具栏进行不同的显示
		//1.以图标显示的分为两类
		//<1>以editortoolbar.png为基础的设置为("")空字符串(用图标当做工具栏的显示时，代表的是不同的图，默认为eidtortoolbar.png图片)
		//<2>以icons.png为基础的设置为("editor-icons")
		//2.以文字显示
		//不通过图标，而是用文字显示的，设置为("你要显示的文字")
		//3.多菜单列表显示
		//针对多菜单工具，使用[]数组包括显示的内容
		self.editorMenuShowContent = {
			"bold": "", //使用editortoolbar.png图片为基础设置图标
			"italic": "",
			"big": "大", //以文字为基础设置图标
			"small": "小",
			"sub": "editor-icons", //以icons.png图片为基础设置图标
			"sup": "editor-icons",
			"del": "editor-icons",
			"ins": "editor-icons",
			"hr": "Hr",
			"a": "",
			"blockquote": "",
			"code": "",
			"kbd": "KD",
			"pre": "Pr",
			"divider": "",
			"color": "A",
			"background-color": "ab",
			"danger": "Da",
			"default": "De",
			"success": "Su",
			"info": "In",
			"warning": "Wa",
			"primary": "Py",
			"badge": "Ge",
			"font-family": ["微软雅黑", "微软雅黑 Light", "黑体", "楷体", "宋体", "Courier New", "Consolas", "sans-serif"], //列表显示
			"font-size": ["12px", "14px", "16px", "18px", "24px", "48px"],
			"fullscreen": ""
		};


		//表示提示栏显示的信息
		self.editorMenuTips = {
			"bold": "粗体",
			"italic": "斜体",
			"big": "放大字体",
			"small": "缩小字体",
			"sub": "下标字",
			"sup": "上标字",
			"del": "删除字",
			"ins": "下划线",
			"hr": "分割线",
			"a": "链接",
			"blockquote": "引用",
			"code": "代码",
			"kbd": "键盘输入码",
			"pre": "预格式文本",
			"color": "字体色",
			"background-color": "背景色",
			"danger": "危险突出",
			"default": "清淡突出",
			"success": "成功突出",
			"info": "信息突出",
			"warning": "警告突出",
			"primary": "主要突出",
			"badge": "徽章",
			"font-family": "字体",
			"font-size": "字号",
			"fullscreen": "全屏"
		};

		//某些属性的当前状态值
		self.curKeepSet = {
			"font-family": 0,
			"font-size": 2,
		};

		self.editor[0].innerHTML = '<p>&#8203</p>'; //编辑器内部初始化
		/******************************以下为文本编辑器布局初始化**************************************************/
		//创建所有的标签
		self.createAllLabel();

		self.modalPopInit();
		//将文本编辑容器增加在父标签中
		self.par.append(self.topEditor);
		//将工具栏容器增加在文本编辑容器中
		self.topEditor.append(self.editorTools);
		//将工具栏增加在工具栏容器中
		self.editorTools.append(self.editorMenu);
		//将编辑容器增加在文本编辑容器中
		self.topEditor.append(self.editorWnd);
		//将编辑器增加在编辑容器中
		self.editorWnd.append(self.editor);

		//产生初始Range对象，解决getRangeAt(0)不存在BUG
		self.editor.focus();

		//增加反应速度
		self.fontFamilyLabel = $('[editortype=font-family] .dropdown > ul > li:not(.divider)');
		self.fontSizeLabel = $('[editortype=font-size] .dropdown > ul > li:not(.divider)');
		/*******************************以下为文本编辑器响应初始化*************************************************/
		//初始化响应库
		self.InitLib();
		//初始化所有javascript动画
		self.InitActive();
	};

	BPTMQeditor.prototype = {
		//创建1类标签：针对editorMenuList中类型进行创建
		createOneLabel: function(a) {
			var self = this;
			var b = self.editorMenuTips[a],
				lli = $("<li editortype='" + a + "'  data-type='tooltip' data-placement='bottom' title='" + b + "'>"),
				la = $("<a class='editor-menu-item editor-menu-" + a + "' href='#'>");
			la.addClass(self.editorMenuShowContent[a]);
			lli.append(la);
			self.editorMenu.append(lli);
		},

		//创建1.1类标签:针对editorMenuList中类型进行创建
		createOnePotOneLabel: function(a) {
			var self = this;
			var b = self.editorMenuTips[a],
				lli = $("<li editortype='" + a + "'  data-type='tooltip' data-placement='bottom' title='" + b + "'>"),
				la = $("<a class='editor-menu-item editor-menu-" + a + "' style='background-position: 100px 100px;' href='#'>");
			la.append(self.editorMenuShowContent[a]);
			lli.append(la);
			self.editorMenu.append(lli);
		},
		//创建1.2类标签:针对editorMenuList中类型进行创建
		createOnePotTwoLabel: function(a) {
			var self = this,
				b = self.editorMenuTips[a],
				lli = $("<li  needmodal='true' editortype='" + a + "'  data-type='tooltip' data-placement='bottom' title='" + b + "' dealwidth='true'>"),
				la = $("<a class='editor-menu-item editor-menu-" + a + "' ' href='#'>");
			la.append(self.editorMenuShowContent[a]);
			lli.append(la);
			self.editorMenu.append(lli);
		},
		//创建1.3类标签:针对editorMenuList中类型进行创建
		createRestructLabel: function(a) {
			var self = this,
				b = self.editorMenuTips[a],
				lli = $("<li editortype='" + a + "'  data-type='tooltip' data-placement='bottom' title='" + b + "' dealwidth='true'>"),
				la = $("<a class='editor-menu-item editor-menu-" + a + "' ' href='#'>");
			la.append(self.editorMenuShowContent[a]);
			lli.append(la);
			self.editorMenu.append(lli);
		},
		//创建2类标签:针对editorMenuList中类型进行创建
		createTwoLabel: function(a) {
			var self = this;
			var b = self.editorMenuTips[a],
				lli = $("<li class='editor-menu-" + a + "' dealwidth='true' editortype='" + a + "' >"),
				ldiv = $("<div class='dropdown' unselectable='on' onmousedown='return false'>"),
				lul = $('<ul class="dropdown-menu" aria-labelledby="dropdownMenu1"  unselectable="on" onmousedown="return false">'),
				indexid = 0,
				f = self.editorMenuShowContent[a],
				h = self.curKeepSet[a];
			ldiv[0].innerHTML = '<button class="btn btn-default dropdown-toggle btn-sm" type="button" id="dropdownMenu1" data-toggle="dropdown" data-type="tooltip" data-placement="bottom" title="' + b + '"aria-haspopup="true" aria-expanded="true" style="font-family:\'微软雅黑\'">' + b + '<span class="caret"></span></button>';
			for (var c in f) {
				var d = f[c],
					llli = $('<li indexid="' + indexid + '" class=' + a + '><a href="#"style="' + a + ':' + d + '">' + (h == indexid ? '<span class="badge">&radic;</span>' : '') + d + '</a></li>');
				lul.append(llli);
				indexid++;
			}
			lli.append(ldiv);
			ldiv.append(lul);
			self.editorMenu.append(lli);
		},

		//创建3类标签：针对editorMenuList中类型进行创建
		createThreeLabel: function(a) {
			var self = this,
				b = self.editorMenuShowContent[a],
				c = self.editorMenuTips[a],
				Dom = '<li unselectable="on" onmousedown="return false" class="dropdown" editortype="' + a + '" dealwidth="true" data-type="tooltip" data-placement="bottom" title="' + c + '"><button class="btn btn-default dropdown-toggle btn-sm editor-menu-item editor-menu-color editor-icons" style="background-position: 100px 100px;" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">' + b + '<span class="caret"></span></button>  <ul class="dropdown-menu" aria-labelledby="dLabel">  <table unselectable="on" onmousedown="return false"><tbody><tr><td colspan="10">主题颜色</td></tr><tr class="editor-color-table-td-first"><td><a unselectable="on" onmousedown="return false" title="ffffff" class="editor-color-table-td" data-color="#ffffff" style="background-color:#ffffff;border:solid #ccc;border-width:1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="000000" class="editor-color-table-td" data-color="#000000" style="background-color:#000000;border:solid #ccc;border-width:1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="eeece1" class="editor-color-table-td" data-color="#eeece1" style="background-color:#eeece1;border:solid #ccc;border-width:1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="1f497d" class="editor-color-table-td" data-color="#1f497d" style="background-color:#1f497d;border:solid #ccc;border-width:1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="4f81bd" class="editor-color-table-td" data-color="#4f81bd" style="background-color:#4f81bd;border:solid #ccc;border-width:1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="c0504d" class="editor-color-table-td" data-color="#c0504d" style="background-color:#c0504d;border:solid #ccc;border-width:1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="9bbb59" class="editor-color-table-td" data-color="#9bbb59" style="background-color:#9bbb59;border:solid #ccc;border-width:1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="8064a2" class="editor-color-table-td" data-color="#8064a2" style="background-color:#8064a2;border:solid #ccc;border-width:1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="4bacc6" class="editor-color-table-td" data-color="#4bacc6" style="background-color:#4bacc6;border:solid #ccc;border-width:1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="f79646" class="editor-color-table-td" data-color="#f79646" style="background-color:#f79646;border:solid #ccc;border-width:1px;"></a></td></tr><tr><td><a unselectable="on" onmousedown="return false" title="f2f2f2" class="editor-color-table-td" data-color="#f2f2f2" style="background-color:#f2f2f2;border:solid #ccc;border-width:1px 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="7f7f7f" class="editor-color-table-td" data-color="#7f7f7f" style="background-color:#7f7f7f;border:solid #ccc;border-width:1px 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="ddd9c3" class="editor-color-table-td" data-color="#ddd9c3" style="background-color:#ddd9c3;border:solid #ccc;border-width:1px 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="c6d9f0" class="editor-color-table-td" data-color="#c6d9f0" style="background-color:#c6d9f0;border:solid #ccc;border-width:1px 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="dbe5f1" class="editor-color-table-td" data-color="#dbe5f1" style="background-color:#dbe5f1;border:solid #ccc;border-width:1px 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="f2dcdb" class="editor-color-table-td" data-color="#f2dcdb" style="background-color:#f2dcdb;border:solid #ccc;border-width:1px 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="ebf1dd" class="editor-color-table-td" data-color="#ebf1dd" style="background-color:#ebf1dd;border:solid #ccc;border-width:1px 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="e5e0ec" class="editor-color-table-td" data-color="#e5e0ec" style="background-color:#e5e0ec;border:solid #ccc;border-width:1px 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="dbeef3" class="editor-color-table-td" data-color="#dbeef3" style="background-color:#dbeef3;border:solid #ccc;border-width:1px 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="fdeada" class="editor-color-table-td" data-color="#fdeada" style="background-color:#fdeada;border:solid #ccc;border-width:1px 1px 0 1px;"></a></td></tr><tr><td><a unselectable="on" onmousedown="return false" title="d8d8d8" class="editor-color-table-td" data-color="#d8d8d8" style="background-color:#d8d8d8;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="595959" class="editor-color-table-td" data-color="#595959" style="background-color:#595959;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="c4bd97" class="editor-color-table-td" data-color="#c4bd97" style="background-color:#c4bd97;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="8db3e2" class="editor-color-table-td" data-color="#8db3e2" style="background-color:#8db3e2;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="b8cce4" class="editor-color-table-td" data-color="#b8cce4" style="background-color:#b8cce4;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="e5b9b7" class="editor-color-table-td" data-color="#e5b9b7" style="background-color:#e5b9b7;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="d7e3bc" class="editor-color-table-td" data-color="#d7e3bc" style="background-color:#d7e3bc;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="ccc1d9" class="editor-color-table-td" data-color="#ccc1d9" style="background-color:#ccc1d9;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="b7dde8" class="editor-color-table-td" data-color="#b7dde8" style="background-color:#b7dde8;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="fbd5b5" class="editor-color-table-td" data-color="#fbd5b5" style="background-color:#fbd5b5;border:solid #ccc;border-width:0 1px 0 1px;"></a></td></tr><tr><td><a unselectable="on" onmousedown="return false" title="bfbfbf" class="editor-color-table-td" data-color="#bfbfbf" style="background-color:#bfbfbf;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="3f3f3f" class="editor-color-table-td" data-color="#3f3f3f" style="background-color:#3f3f3f;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="938953" class="editor-color-table-td" data-color="#938953" style="background-color:#938953;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="548dd4" class="editor-color-table-td" data-color="#548dd4" style="background-color:#548dd4;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="95b3d7" class="editor-color-table-td" data-color="#95b3d7" style="background-color:#95b3d7;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="d99694" class="editor-color-table-td" data-color="#d99694" style="background-color:#d99694;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="c3d69b" class="editor-color-table-td" data-color="#c3d69b" style="background-color:#c3d69b;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="b2a2c7" class="editor-color-table-td" data-color="#b2a2c7" style="background-color:#b2a2c7;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="92cddc" class="editor-color-table-td" data-color="#92cddc" style="background-color:#92cddc;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="fac08f" class="editor-color-table-td" data-color="#fac08f" style="background-color:#fac08f;border:solid #ccc;border-width:0 1px 0 1px;"></a></td></tr><tr><td><a unselectable="on" onmousedown="return false" title="a5a5a5" class="editor-color-table-td" data-color="#a5a5a5" style="background-color:#a5a5a5;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="262626" class="editor-color-table-td" data-color="#262626" style="background-color:#262626;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="494429" class="editor-color-table-td" data-color="#494429" style="background-color:#494429;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="17365d" class="editor-color-table-td" data-color="#17365d" style="background-color:#17365d;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="366092" class="editor-color-table-td" data-color="#366092" style="background-color:#366092;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="953734" class="editor-color-table-td" data-color="#953734" style="background-color:#953734;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="76923c" class="editor-color-table-td" data-color="#76923c" style="background-color:#76923c;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="5f497a" class="editor-color-table-td" data-color="#5f497a" style="background-color:#5f497a;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="31859b" class="editor-color-table-td" data-color="#31859b" style="background-color:#31859b;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="e36c09" class="editor-color-table-td" data-color="#e36c09" style="background-color:#e36c09;border:solid #ccc;border-width:0 1px 0 1px;"></a></td></tr><tr><td><a unselectable="on" onmousedown="return false" title="7f7f7f" class="editor-color-table-td" data-color="#7f7f7f" style="background-color:#7f7f7f;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="0c0c0c" class="editor-color-table-td" data-color="#0c0c0c" style="background-color:#0c0c0c;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="1d1b10" class="editor-color-table-td" data-color="#1d1b10" style="background-color:#1d1b10;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="0f243e" class="editor-color-table-td" data-color="#0f243e" style="background-color:#0f243e;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="244061" class="editor-color-table-td" data-color="#244061" style="background-color:#244061;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="632423" class="editor-color-table-td" data-color="#632423" style="background-color:#632423;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="4f6128" class="editor-color-table-td" data-color="#4f6128" style="background-color:#4f6128;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="3f3151" class="editor-color-table-td" data-color="#3f3151" style="background-color:#3f3151;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="205867" class="editor-color-table-td" data-color="#205867" style="background-color:#205867;border:solid #ccc;border-width:0 1px 0 1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="974806" class="editor-color-table-td" data-color="#974806" style="background-color:#974806;border:solid #ccc;border-width:0 1px 0 1px;"></a></td></tr><tr><td colspan="10">标准颜色</td></tr><tr class="edui-colorpicker-firstrow"><td><a unselectable="on" onmousedown="return false" title="c00000" class="editor-color-table-td" data-color="#c00000" style="background-color:#c00000;border:solid #ccc;border-width:1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="ff0000" class="editor-color-table-td" data-color="#ff0000" style="background-color:#ff0000;border:solid #ccc;border-width:1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="ffc000" class="editor-color-table-td" data-color="#ffc000" style="background-color:#ffc000;border:solid #ccc;border-width:1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="ffff00" class="editor-color-table-td" data-color="#ffff00" style="background-color:#ffff00;border:solid #ccc;border-width:1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="92d050" class="editor-color-table-td" data-color="#92d050" style="background-color:#92d050;border:solid #ccc;border-width:1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="00b050" class="editor-color-table-td" data-color="#00b050" style="background-color:#00b050;border:solid #ccc;border-width:1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="00b0f0" class="editor-color-table-td" data-color="#00b0f0" style="background-color:#00b0f0;border:solid #ccc;border-width:1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="0070c0" class="editor-color-table-td" data-color="#0070c0" style="background-color:#0070c0;border:solid #ccc;border-width:1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="002060" class="editor-color-table-td" data-color="#002060" style="background-color:#002060;border:solid #ccc;border-width:1px;"></a></td><td><a unselectable="on" onmousedown="return false" title="7030a0" class="editor-color-table-td" data-color="#7030a0" style="background-color:#7030a0;border:solid #ccc;border-width:1px;"></a></td></tr></tbody></table>  </ul></li>';
			self.editorMenu.append(Dom);
		},
		//创建所有工具栏中的标签显示
		createAllLabel: function(a) {
			var self = this;
			for (var a in self.editorMenuDefaultShowList) {
				var b = self.editorMenuDefaultShowList[a];
				if (b == 'divider') {
					var Dom = '<li class="editor-menu-divider"></li>';
					self.editorMenu.append(Dom);
				} else {
					var c = self.editorMenuList[b];
					switch (c) {
						case 1:
							self.createOneLabel(b);
							break;
						case 1.1:
							self.createOnePotOneLabel(b);
							break;
						case 1.2:
							self.createOnePotTwoLabel(b);
							break;
						case 1.3:
							self.createRestructLabel(b);
							break;
						case 2:
							self.createTwoLabel(b);
							break;
						case 3:
							self.createThreeLabel(b);
							break;
					}
				}
			}
		},

		//初始化所有javascript动画
		InitActive: function() {
			var sf = this;

			/*提示语启动*/
			$('[data-type="tooltip"]').tooltip();
			/*
			响应式editor的高度启动
			 */
			$(window).on('resize', function() {
				sf.planHeight(!1);
			}).on('load', function() {
				sf.planHeight(!1);
			});

			//进行p标签按键以及TAB键响应处理
			this.editor.keydown(function(e) {
				//console.log(e.keyCode);
				var a = e.keyCode;
				switch (a) {
					case 13: //对回车进行反应
						document.execCommand("formatBlock", !1, "<p>"); //将div标签格式化为p标签
						break;
					case 9: //对于TAB键进行反应
						var tabl = "";
						for (var i = 0; i < sf.tab; i++) tabl += "&nbsp;";
						sf.rangeInsertNode($('<span>' + tabl + '</span>')[0], null);
						return false; //防止离开Editor聚焦区域
						break;
					case 8: //退格键处理为完善
						//var rg = sf.getRange(sf.getSelections());
						//var curnode = rg.selectAllChildren();
						//console.log(curnode);
						/*var rg = sf.getRange(sf.getSelections()),
							curnode = rg.endContainer,
							posfontfamily = curnode.parentNode.style.fontFamily,
							posfontSize = curnode.parentNode.style.fontSize;
							$('[editortype=font-family] .dropdown > ul > li:not(.divider)').eq()siblings().find('a').find('.badge').remove();
							$('[editortype=font-family] .dropdown > ul > li:not(.divider)').find('a').html("<span class='badge'>&radic;</span>" + hf.find('a').html());
					*/
						break;
					default:
						break;
				}
				sf.setCursorFontFamilyAndSize();
			});

			this.editor.mouseup(function(event) {
				/* Act on the event */
				sf.setCursorFontFamilyAndSize();
			});

			//对textarea编辑区清空BUG的修正
			sf.editor.on('focus', function() {
				var fg = document.createElement("p");
				fg.innerHTML = "&#8203";
				if (sf.editor[0].childNodes.length < 1) {
					sf.editor.append(fg),
						sf.setEnd(fg);
				}
			}).on('keydown', function() {
				var fg = document.createElement("p");
				fg.innerHTML = "&#8203";
				if (sf.editor[0].childNodes.length < 1) {
					sf.editor.append(fg),
						sf.setEnd(fg);
				}
			});

			//响应工具栏的1类型
			$(".editor-mode > li:not([dealwidth=true]),.editor-menu > li:not([dealwidth=true])").click(function() {
				var hf = $(this),
					editortype = hf.attr("editortype"), //获取需要响应的对象
					nodeType = sf.domTypeJson[editortype], //获取创建标签的方式
					nodeLabelOrAttrValue = sf.LabelOrAttrValueDomJson[editortype], //获取创建标签的需要处理的值
					nodeAttrName = sf.attrNameDomJson[editortype], //获取创建的标签需要增加的属性名
					nodeAttrLabel = sf.attrLabelDomJson[editortype]; //获取创建的标签需要增加的属性值
				sf.editor.focus(); //聚焦处理为了获取正确的Range对象
				sf.cursorInsertNode(nodeType, nodeLabelOrAttrValue, nodeAttrName, nodeAttrLabel, [0]);
			});

			//响应工具栏的2类型
			$("[editortype|=font] .dropdown > ul > li:not(.divider)").click(function() {
				var hf = $(this),
					editortype = hf.parents("li").attr("editortype"),
					nodeType = sf.domTypeJson[editortype],
					nodeLabelOrAttrValue = sf.LabelOrAttrValueDomJson[editortype],
					nodeAttrName = sf.attrNameDomJson[editortype],
					nodeAttrLabel = sf.attrLabelDomJson[editortype],
					indexli = hf.attr("indexid"); //对于多项工具，列表处理获取对应的id号
				sf.curKeepSet[hf.find('a')[0].className] = indexli,
					hf.siblings().find('a').find('.badge').remove(),
					hf.find('a').html("<span class='badge'>&radic;</span>" + hf.find('a').html()),
					sf.editor.focus(),
					sf.cursorInsertNode(nodeType, nodeLabelOrAttrValue, nodeAttrName, nodeAttrLabel, [indexli]);
			});

			//响应工具栏的3类型
			$("li[editortype$=color] td > a").click(function() {
				var hf = $(this),
					editortype = hf.parents("li").attr("editortype"),
					nodeType = sf.domTypeJson[editortype],
					nodecolor = hf.attr("data-color"),
					nodeAttrName = sf.attrNameDomJson[editortype],
					nodeAttrLabel = sf.attrLabelDomJson[editortype];
				sf.editor.focus();
				sf.cursorInsertNode(nodeType, [
					[editortype + ":" + nodecolor]
				], nodeAttrName, nodeAttrLabel, [0]);
			});

			//响应工具栏的1.2类型
			$('li[needmodal=true]').click(function() {
				sf.oldRange = sf.getRange(sf.getSelections()); //获取旧的Range对象
				if (!sf.oldRange.toString()) return false; //如果Range对象的大小为空不允许发生处理事件
				sf.isLoadOldRange = //是否需要读取旧的Range对象
					$(this).attr("havemodal", "true").siblings().removeAttr('havemodal'), //为弹框工具进行处理
					sf.modal.modal('show'), !0; //显示弹框
			});
			//针对1.2类型工具的弹框处理
			$(".modal").on('show.bs.modal', function() {
				var domtype = $('[havemodal=true]').attr('editortype'); //获取弹框处理的工具类型
				sf.modalHeader.find('.modal-title').text(sf.editorMenuTips[domtype]), //获取弹框的标题显示
					sf.modalBody.empty(), //清空弹框体中的节点数据(解除与之前弹框的联系)
					sf.modalBody.append(sf.modalLabelContent[domtype]); //将需要显示的信息增加近弹框体中
			});

			//针对1.2类型工具的确定处理
			$('button[addData=true]').click(function() {
				var editortype = $('[havemodal=true]').attr('editortype'), //获取弹框处理的工具类型
					domcontent = "";
				switch (editortype) {
					case 'a':
						domcontent = sf.getALinkContent(); //获取链接URL信息
						sf.editor.focus(); //聚焦处理
						//将标签插入编辑区对应位置
						sf.cursorInsertNode(sf.domTypeJson[editortype], [
							[domcontent],
							["tooltip"],
							[domcontent],
							["bottom"]
						], sf.attrNameDomJson[editortype], sf.attrLabelDomJson[editortype], [0]);
						$('[data-type="tooltip"]').tooltip(); //再次重载提示动画
						break;
				}
				$('[havemodal=true]').removeAttr('havemodal'); //解除弹框和工具的联系
				sf.modal.modal('hide'); //隐藏弹框
			});
			$('li[editortype=fullscreen]').click(function() {
				var bph = !0; //判断当前需要全屏还是缩屏状态
				if ($(this).find('a').hasClass('editor-menu-fullscreen')) { //需要缩屏
					bph = !0;
					sf.topEditor.css({
						'position': 'fixed',
						'top': '0',
						'left': '0'
					});
					$(this).find('a').removeClass('editor-menu-fullscreen').addClass('editor-menu-minscreen');
					$(this).attr('data-original-title', '缩屏');
				} else { //需要全屏
					bph = !1;
					sf.topEditor.css({
						'position': 'relative',
						'top': 'auto',
						'left': 'auto',
						'width': '100%'
					});
					$(this).find('a').removeClass('editor-menu-minscreen').addClass('editor-menu-fullscreen');
					$(this).attr('data-original-title', '全屏');
				}
				sf.editorFixed = bph;
				sf.planHeight(); //对高度和宽度进行设定
			});
		},

		//针对响应式处理函数，自动适应高度和宽度
		planHeight: function() {
			var sf = this,
				marginTop = sf.editorTools.height(),
				parHeight = sf.topEditor.height(),
				winHeight = $(window).height(),
				winWidth = $(window).width();
			if (sf.editorFixed) {
				sf.editor.css({
					'height': winHeight,
					'width': winWidth - 2
				});
				marginTop = sf.editorTools.height();
				sf.editor.css({
					'marginTop': marginTop,
					'height': winHeight - marginTop
				});
			} else {
				sf.editor.css({
					'marginTop': marginTop,
					'height': parHeight - marginTop,
					'width': '100%'
				});
			}
			sf.editor.focus();
		},

		//设置光标变化的产生的字体和字号影响
		setCursorFontFamilyAndSize: function() {
			var sf = this,
				st = sf.getSelections(),
				rg = sf.getRange(st),
				fg = rg.startContainer,
				fontFamily = $(fg.parentNode).css('fontFamily'), //getComputedStyle(fg.parentNode,null).fontFamily,
				fontSize = $(fg.parentNode).css('fontSize'), //getComputedStyle(fg.parentNode,null).fontSize,
				indexfa = sf.editorMenuShowContent['font-family'].indexOf(fontFamily) == -1 ? sf.editorMenuShowContent['font-family'].indexOf(fontFamily.substring(1, fontFamily.length - 1)) : sf.editorMenuShowContent['font-family'].indexOf(fontFamily),
				indexsi = sf.editorMenuShowContent['font-size'].indexOf(fontSize),
				familySimpleChild = sf.fontFamilyLabel.eq(indexfa), //得到对应的字体标签
				sizeSimpleChild = sf.fontSizeLabel.eq(indexsi); //得到对应的字号标签
			sf.curKeepSet['font-family'] = indexfa, //设置当前字体状态
				sf.curKeepSet['font-size'] = indexsi; //设置当前字号状态
			//对字体进行处理
			familySimpleChild.siblings().find('a').find('.badge').remove(),
				familySimpleChild.find('a').html("<span class='badge'>&radic;</span>" + familySimpleChild.find('a').html());
			//对字号进行处理
			sizeSimpleChild.siblings().find('a').find('.badge').remove(),
				sizeSimpleChild.find('a').html("<span class='badge'>&radic;</span>" + sizeSimpleChild.find('a').html());
		},


		//这类函数，每增加一个类似的工具，都需要写一个响应的获取函数，来获取信息
		//获取a标签的值
		getALinkContent: function() {
			var sf = this;
			return sf.modalBody.find('input[type=text]').val();
		},
		//初始化响应库
		//1代表自主双标签
		//1.1代表自主单标签
		//2代表扩充标签(需要外界提供标签类型,同时需要提供相关属性[className, herf, value, innerHTML...])
		//3代表列表标签(需要提供列表数据，与显示列表数据一致)
		InitLib: function() {
			var sf = this;
			sf.domTypeJson = { //增加的DOM类型
				"bold": 1, //代表自主标签<b>
				"italic": 1,
				"danger": 2, //扩充标签<span class='danger'>
				"default": 2,
				"info": 2,
				"primary": 2,
				"warning": 2,
				"success": 2,
				"badge": 2,
				"code": 1,
				"kbd": 1,
				"pre": 1,
				"big": 1,
				"small": 1,
				"sub": 1,
				"sup": 1,
				"del": 1,
				"ins": 1,
				"hr": 1.1,
				"blockquote": 1,
				"a": 2,
				"font-family": 3,
				"font-size": 3,
				"color": 3,
				"background-color": 3
			};
			//当需要创建扩充标签(2)或者列表标签(3)时调用
			sf.attrNameDomJson = { //增加的属性
				"danger": ["className"],
				"default": ["className"],
				"info": ["className"],
				"primary": ["className"],
				"warning": ["className"],
				"success": ["className"],
				"badge": ["className"],
				"font-family": ["style"],
				"font-size": ["style"],
				"color": ["style"],
				"background-color": ["style"],
				"a": ["href", "data-type", "title", "data-placement"]
			};

			//此对象暂时禁用
			sf.attrCreateType = {
					"danger": !0,
					"default": !0,
					"info": !0,
					"primary": !0,
					"warning": !0,
					"success": !0,
					"badge": !0,
					"font-family": !0,
					"font-size": !0,
					"color": !0,
					"background-color": !0
				}
				//当需要创建扩充标签(2)或者列表标签(3)时调用
				//表示以什么标签做为属性的承载对象
			sf.attrLabelDomJson = { //当时属性增加时调用
				"danger": "span",
				"default": "span",
				"info": "span",
				"primary": "span",
				"warning": "span",
				"success": "span",
				"badge": "span",
				"font-family": "span",
				"font-size": "span",
				"color": "font",
				"background-color": "font",
				"a": "a"
			}

			//针对1响应方式，直接读取对应的标签名
			//针对2响应方式，直接读取对应的属性值
			//针对3响应方式，直接读取对应的列表属性值
			sf.LabelOrAttrValueDomJson = { //对应增加值
					"bold": "b",
					"italic": "i",
					"danger": [
						["label label-danger"]
					],
					"default": [
						["label label-default"]
					],
					"info": [
						["label label-info"]
					],
					"primary": [
						["label label-primary"]
					],
					"warning": [
						["label label-warning"]
					],
					"success": [
						["label label-success"]
					],
					"badge": [
						["badge"]
					],
					"code": "code",
					"kbd": "kbd",
					"pre": "pre",
					"big": "big",
					"small": "small",
					"sub": "sub",
					"sup": "sup",
					"del": "del",
					"ins": "ins",
					"hr": "hr",
					"blockquote": "blockquote",
					"a": "a",
					"font-size": [
						["font-size:12px", "font-size:14px", "font-size:16px", "font-size:18px", "font-size:24px", "font-size:48px"]
					],
					"font-family": [
						["font-family:Microsoft Yahei", "font-family:微软雅黑 Light", "font-family:黑体", "font-family:楷体", "font-family:宋体", "font-family:Courier New", "font-family:Consolas", "font-family:sans-serif"]
					]
				},
				//弹框区代码
				//针对需要使用弹框的工具
				sf.modalLabelContent = {
					"a": "<div class='form-group'>    <label for='example'>" + sf.editorMenuTips["a"] + "</label>    <input type='text' class='form-control' id='example' value='http://'></div>"
				};
		},

		//得到Selection对象
		getSelections: function() {
			if (window.getSelection) {
				return window.getSelection();
			} else {
				return document.selection.createRange();
			}
		},
		//得到Range对象
		getRange: function(selection) {
			if (selection.getRangeAt) {
				return selection.getRangeAt(0);
			} else {
				var range = document.createRange();
				range.setStart(selection.anchorNode, selection.anchorOffset);
				range.setEnd(selection.focusNode, selection.focusOffset);
				return range;
			}
		},
		//向Range对象中插入一个节点(覆盖Range对象中已有的节点)
		rangeInsertNode: function(node, redirect) {
			var st = this.getSelections(), //得到Selection对象
				rg = this.getRange(st), //得到Range对象
				fg = node,
				sf = this;
			if (sf.isLoadOldRange) rg = sf.oldRange; //读取旧的Range对象
			if (!!rg.toString() && !!fg) fg.innerHTML = sf.unhtml(rg.toString()); //如果Range对象中存在数据将数据转义加载至节点中
			if (!!fg) {
				rg.deleteContents(); //删除所有子节点
				rg.insertNode(fg); //增加一个子节点
				sf.setEnd(fg); //将光标移动到节点最后
			}
			sf.isLoadOldRange = false; //不需要从旧Range中读取数据
		},

		//设置光标到文本的最后
		setEnd: function(fg) {
			var st = this.getSelections(),
				rg = this.getRange(st);
			this.editor.focus();
			st.selectAllChildren(fg); //准确识别子节点的位置
			st.collapseToEnd(); //崩坏边界，重置光标
		},

		//设置标签属性(针对多个标签属性进行增加)
		setAttributes: function(node, attrName, attrValue, effectiveAttr) {
			for (var c in attrName) {
				var a = attrName[c];
				//if(node.isPrototypeOf(a) || node.hasOwnProperty(a)){
				var d = attrValue[c];
				switch (a) {
					case "className":
						for (var b in effectiveAttr) {
							node.className = node.className + " " + d[effectiveAttr[b]];
						}
						break;
					case "style":
						for (var b in effectiveAttr) {
							node.style.cssText = node.style.cssText + ";" + d[effectiveAttr[b]];
						}
						break;
					case "innerHTML":
						for (var b in effectiveAttr) {
							node.innerHTML = d[effectiveAttr[b]];
						}
						break;
					case "value":
						for (var b in effectiveAttr) {
							node.value = d[effectiveAttr[b]];
						}
						break;
					default:
						for (var b in effectiveAttr) {
							$(node).attr(a, d[effectiveAttr[b]]);
						}
						break;
				}
				//}
			}
		},

		//创建响应标签(工具栏运转时调用)
		createLabel: function(nodeLabel, attrName, attrValue, effectiveAttr) {
			var newNode = document.createElement(nodeLabel);
			this.setAttributes(newNode, attrName, attrValue, effectiveAttr); //设定相关属性
			return newNode;
		},

		//初始化弹框节点
		modalPopInit: function() {
			var sf = this,
				modal = $("<div class='modal fade'>"),
				modalDialog = $("<div class='modal-dialog modal-sm'>"),
				modalContent = $("<div class='modal-content'>"),
				modalHeader = $("<div class='modal-header'>"),
				modalBody = $("<div class='modal-body'>"),
				modalFooter = $("<div class='modal-footer'>"),
				domhead = '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>        <h4 class="modal-title"></h4>',
				domfooter = '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>        <button type="button" class="btn btn-primary" addData="true">确定</button>';
			modalHeader.append(domhead);
			modalFooter.append(domfooter);
			modal.append(modalDialog);
			modalDialog.append(modalContent);
			modalContent.append(modalHeader, modalBody, modalFooter);
			sf.par.append(modal);
			sf.modalBody = modalBody;
			sf.modalHeader = modalHeader;
			sf.modal = modal;
		},
		//在光标处插入一个标签(&#8203属于隐藏字符为了滞后光标而设定)
		cursorInsertNode: function(nodeType, nodeLabelOrAttrValue, nodeAttrName, nodeAttrLabel, effectiveAttr) {
			var sf = this;
			var rangeNode = null;
			var redirect = !1;
			switch (nodeType) { //对应响应创建标签
				case 1:
					rangeNode = this.createLabel(nodeLabelOrAttrValue, null, null, null);
					rangeNode.innerHTML = '&#8203'; //隐藏编码
					break;
				case 1.1:
					rangeNode = sf.createLabel(nodeLabelOrAttrValue, null, null, null);
					if (nodeLabelOrAttrValue == "hr") { //对于hr标签必须用<p>标签包裹并且将<br>放在节点后面
						var pNode = sf.createLabel("p", null, null, null);
						pNode.appendChild(rangeNode);
						pNode.appendChild(sf.createLabel("br", null, null, null));
						rangeNode = pNode;
					}
					break;
				case 2:
					rangeNode = sf.createLabel(nodeAttrLabel, nodeAttrName, nodeLabelOrAttrValue, effectiveAttr);
					rangeNode.innerHTML = '&#8203';
					break;
				case 2.1:
					rangeNode = sf.createLabel(nodeAttrLabel, nodeAttrName, nodeLabelOrAttrValue, effectiveAttr);
					break;
				case 3:
					rangeNode = sf.createLabel(nodeAttrLabel, nodeAttrName, nodeLabelOrAttrValue, effectiveAttr);
					rangeNode.innerHTML = '&#8203';
					//redirect = !0;
					break;
				case 4:

					break;
			}
			sf.rangeInsertNode(rangeNode, redirect); //通过Range插入标签
		},

		//得到编辑区的文档
		getHTMLContent: function() {
			var sf = this,
				con = sf.editor[0].innerHTML;
			return con;
		},

		//将html代码进行转义
		unhtml: function(a, b) {
			return a ? a.replace(b || /[&<">'](?:(amp|lt|quot|gt|#39|nbsp);)?/g, function(a, b) {
				return b ? a : {
					"<": "&lt;",
					"&": "&amp;",
					'"': "&quot;",
					">": "&gt;",
					"'": "&#39;"
				}[a]
			}) : ""
		},
		//将普通文本转义为HTML代码
		html: function(a) {
			return a ?
				a.replace(/&((g|l|quo)t|amp|#39);/g, function(a) {
					return {
						"&lt;": "<",
						"&amp;": "&",
						"&quot;": '"',
						"&gt;": ">",
						"&#39;": "'"
					}[a]
				}) : ""
		}
	};
	window['BPTMQeditor'] = BPTMQeditor;
})(jQuery);