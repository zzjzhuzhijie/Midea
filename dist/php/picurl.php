<?php
    include 'conn.php';
    $result=mysql_query("select * from imagesql");
    $alllist=array();
    for($i=0;$i<mysql_num_rows($result);$i++){
        $alllist[$i]=mysql_fetch_array($result,MYSQL_ASSOC);
    }
    echo json_encode($alllist);
?>