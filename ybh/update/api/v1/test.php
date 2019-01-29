<?php
    error_reporting(E_ALL^E_NOTICE^E_WARNING);
	
	$data = array();
	
	$data["info"] = 1;
	
	echo json_encode($data);