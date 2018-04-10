<html>
<head>
<title>this is a twitter API test</title>
</head>
<body>
<?php 
updateTwitter("just rocking out.");
?>
</body>
</html>


<?php 
function updateTwitter($status){ 
	// Twitter login information 
	$username = "vozome"; 
	$password = "s0ngdog";
	// The url of the update function 
	$url = 'http://twitter.com/statuses/update.xml'; 
	// Arguments we are posting to Twitter 
	$postargs = 'status='.urlencode($status); 
	// Will store the response we get from Twitter 
	$responseInfo=array(); 
	// Initialize CURL 
	$ch = curl_init($url);
	// Tell CURL we are doing a POST 
	curl_setopt ($ch, CURLOPT_POST, true); 
	// Give CURL the arguments in the POST 
	curl_setopt ($ch, CURLOPT_POSTFIELDS, $postargs);
	// Set the username and password in the CURL call 
	curl_setopt($ch, CURLOPT_USERPWD, $username.':'.$password); 
	// Set some cur flags (not too important) 
	curl_setopt($ch, CURLOPT_VERBOSE, 1); 
	curl_setopt($ch, CURLOPT_NOBODY, 0); 
	curl_setopt($ch, CURLOPT_HEADER, 0); 
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION,1); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
	// execute the CURL call 
	$response = curl_exec($ch); 
	// Get information about the response 
	$responseInfo=curl_getinfo($ch); 
	// Close the CURL connection curl_close($ch);
	// Make sure we received a response from Twitter 
	if(intval($responseInfo['http_code'])==200){ 
		// Display the response from Twitter 
		echo $response; 
	}else{ 
		// Something went wrong 
		echo "Error: " . $responseInfo['http_code']; 
	} 
} 
?>