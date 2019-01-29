<?php
    
    error_reporting(E_ALL^E_NOTICE^E_WARNING);
    
    $cur_dir = dirname(__FILE__);
    
    $paths = array();
    
    list_dir($cur_dir, '', $paths);
    
    foreach ($paths as $path)
    {
        var_dump($path[0]);
		var_dump($path[1]);
		
		$key = $path[0];
		$prefix =$path[1];
		
		$src = $cur_dir . "/" . $prefix . "/" . $key;
		$data = $cur_dir . "/" . "../remote/" . $prefix . "/" . $key . ".plist";
		$sheet = $cur_dir . "/" . "../remote/" . $prefix . "/" . $key . ".png";
		
		var_dump($src);
		var_dump($data);
		var_dump($sheet);
		
		$cmd = "";
		
		$cmd .= "TexturePacker" . " ";
		$cmd .= $src . " ";
		$cmd .= "--shape-padding 1 --border-padding 1 --extrude 1" . " ";
		$cmd .= "--sheet " . $sheet . " ";
		$cmd .= "--data " . $data . " ";
		
		system($cmd);
		
		replace_plist($data);
    }
	
	function replace_plist($filename)
	{
		$contents = file_get_contents($filename);
		
		if ($contents == false)
		{
			return;
		}
		
		$pos = strpos($contents, "<key>smartupdate</key>");
		
		if ($pos == false)
		{
			return;
		}
		
		$pos = strpos($contents, "<string>", $pos);
		
		if ($pos == false)
		{
			return;
		}
		
		$pos1 = $pos + strlen("<string>");
		
		$pos2 = strpos($contents, "</string>", $pos1);
		
		if ($pos2 == false)
		{
			return;
		}
		
		$str = substr($contents, $pos1, $pos2 - $pos1);
		
		$contents = str_replace($str, "", $contents);
		
		file_put_contents($filename, $contents);
	}
    
    function list_dir($dir, $prefix, &$output_paths)
    {
        if ($handle = opendir($dir))
        {
            while(($file = readdir($handle)) !== false)
            {
                if ($file == "." || $file == "..")
                {
                    continue;
                }
                
                $full_name = $dir . "/" . $file;
				$path_name;
				if ($prefix == "") {
					$path_name = $file;
				} else {
					$path_name = $prefix . "/" . $file;
					
				}
                
                if (is_dir($full_name))
                {
					if ($prefix != "")
					{	
						array_push($output_paths, array($file, $prefix));
					}
					
                    list_dir($full_name, $path_name , $output_paths);
                }
            }
        }
    }
    
