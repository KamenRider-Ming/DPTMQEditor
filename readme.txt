请在<head>中增加如下代码:
<link rel="stylesheet" type="text/css" href="style/bootstrap.min.css"><!--基本样式-->
<link rel="stylesheet" type="text/css" href="style/dbtmqeditor.css"><!--基本样式-->
<script type="text/javascript" src="js/jquery-2.1.1.min.js"></script><!--基本相应支持-->
<script type="text/javascript" src="js/bootstrap.min.js"></script><!--基本相应支持-->
<script type="text/javascript" src="js/editorcj.js"></script><!--基本相应支持-->


调用插件:
var bptmqeditor = new BPTMQeditor($('.editor-wrap'),null);
//null含义为默认显示所有工具
//$('.editor-wrap')为父类