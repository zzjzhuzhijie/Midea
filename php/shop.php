<?php
    include 'conn.php';
    $username=$_POST['username'];
    $result=mysql_query("select * from regshop where username='$username'");
    $thislist=mysql_fetch_array($result,MYSQL_ASSOC);
	echo json_encode($thislist);
?>