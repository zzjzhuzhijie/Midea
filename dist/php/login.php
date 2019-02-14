<?php
    include 'conn.php';
    $username=$_POST['username'];
    $password=md5($_POST['password']);
    $result=mysql_query("select * from reg where username='$username'and password='$password'");
    if(mysql_fetch_array($result)){//登陆成功
		echo $username;
	}else{//失败
		echo false;
	}
?>