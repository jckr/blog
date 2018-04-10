<?php
// load in mysql server configuration (connection string, user/pw, etc)
include 'mysqlConfig.php';
// connect to the database
@mysql_select_db($dsn) or die( "Unable to select database");

// puts 0s everywhere in the map db

$query="UPDATE `v_map` SET `height`=0";
mysql_query($query);


mysql_close();
?>

