<?php
    include 'conn.php';
    $username=$_POST['username'];
    if(isset($_POST['id'])){
        $id=$_POST['id'];
        mysql_query("update regshop set id='$id' where username='$username'");
    }
    if(isset($_POST['num'])){
        $num=$_POST['num'];
        mysql_query("update regshop set num='$num' where username='$username'");
    } 
    echo true;
?>