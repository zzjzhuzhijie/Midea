<?php
    $fname=$_GET['callback'];
    $shop=$_GET['shop'];
	$search=file_get_contents("https://suggest.taobao.com/sug?code=utf-8&q=$shop&callback=jsonp549");
	echo $fname.'('.$search.')';
?>