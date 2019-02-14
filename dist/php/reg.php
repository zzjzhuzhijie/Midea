<?php
    include 'conn.php';
    $url='http://10.31.161.252/Midea/';
    if(isset($_POST['username'])){
        $user1=$_POST['username'];
    }
    $result=mysql_query("select * from reg where username='$user1'");
    if(mysql_fetch_array($result)){//存在
        echo false;
    }else{
        echo true;
    }
    if(isset($_POST['submit'])){
		$email=$_POST['email'];
        $user=$_POST['username'];
        $pass=md5($_POST['password']);
		mysql_query("insert into reg values(default,'$email','$user','$pass')");
		mysql_query("insert into regshop values(default,'$user','','')");
        //注册成功，跳到登陆页面
        header("location:".$url."src/login.html");
	}
?>