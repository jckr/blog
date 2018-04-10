<?php
	$username = "jcukier"; 
	$password = "v4nd4lh34rt";
	$url = 'http://twitter.com/friends/ids.xml?user_id='; 
	$handle=fopen("tef.txt","r");
	$output=fopen("results.txt","w");
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_USERPWD, $username.':'.$password); 
	curl_setopt($ch, CURLOPT_FILE, $output);
	$follower=0;
	if ($handle) {
 		while (!feof($handle)&&$follower++<150) {
        		echo "$follower. $id<BR>";
        		$id = fgets($handle);
        		curl_setopt($ch, CURLOPT_URL, "http://twitter.com/friends/ids.xml?user_id=$id");
        		$response = curl_exec($ch);
//	        	fwrite ($output,$response);
		}
	}
	fclose($handle);
	fclose($output);
?>
