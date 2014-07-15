<?php
	error_reporting(0);
	
	if ($handle = opendir('music')) { // read music dir
		$local = '';
		while (false !== ($file = readdir($handle))) {
			if( $file != '..' && $file != '.' ){
				$local .= "$file" . '\n';
			}
		}
		closedir($handle);
	}
	
	$local = explode('\n' , $local); 
	array_pop($local);
	
	array_walk( $local, create_function('&$val', 'return $val = urlencode($val);') );
	echo json_encode($local);
?>