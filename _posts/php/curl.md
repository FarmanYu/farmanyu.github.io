#PHP模拟登录并获取数据
cURL 是一个功能强大的PHP库，使用PHP的cURL库可以简单和有效地抓取网页并采集内容，设置cookie完成模拟登录网页，curl提供了丰富的函数，开发者可以从PHP手册中获取更多关于cURL信息。本文以模拟登录开源中国(oschina)为例，和大家分享cURL的使用。   
PHP的curl()在抓取网页的效率方面是比较高的，而且支持多线程，而file_get_contents()效率就要稍低些，当然，使用curl时需要开启下curl扩展。  

*代码实战*    
先来看登录部分的代码：

		//模拟登录 
		function login_post($url, $cookie, $post) { 
		    $curl = curl_init();//初始化curl模块 
		    curl_setopt($curl, CURLOPT_URL, $url);//登录提交的地址 
		    curl_setopt($curl, CURLOPT_HEADER, 0);//是否显示头信息 
		    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 0);//是否自动显示返回的信息 
		    curl_setopt($curl, CURLOPT_COOKIEJAR, $cookie); //设置Cookie信息保存在指定的文件中 
		    curl_setopt($curl, CURLOPT_POST, 1);//post方式提交 
		    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($post));//要提交的信息 
		    curl_exec($curl);//执行cURL 
		    curl_close($curl);//关闭cURL资源，并且释放系统资源 
		} 

函数login_post()首先初始化curl_init()，然后使用curl_setopt()设置相关选项信息，包括要提交的url地址，保存的cookie文件，post的数据（用户名和密码等信息），是否返回信息等等，然后curl_exec执行curl，最后curl_close()释放资源。注意PHP自带的http_build_query()可以将数组转换成相连接的字符串。
接下来如果登录成功后，我们要获取登录成功后的页面信息。

		//登录成功后获取数据 
		function get_content($url, $cookie) { 
		    $ch = curl_init(); 
		    curl_setopt($ch, CURLOPT_URL, $url); 
		    curl_setopt($ch, CURLOPT_HEADER, 0); 
		    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
		    curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie); //读取cookie 
		    $rs = curl_exec($ch); //执行cURL抓取页面内容 
		    curl_close($ch); 
		    return $rs; 
		} 

函数get_content()中也是先初始化curl，然后设置相关选项，执行curl，释放资源。其中我们设置CURLOPT_RETURNTRANSFER为1即自动返回信息，而CURLOPT_COOKIEFILE可以读取到登录时保存的cookie信息，最后将页面内容返回。  
我们的最终目的是要获取到模拟登录后的信息，也就是只有正常登录成功后才能获取的有用信息。接下来我们以登录开源中国的移动版为例，看看如何抓取到登录成功后的信息。

		//设置post的数据 
		$post = array ( 
		    'email' => 'oschina账户', 
		    'pwd' => 'oschina密码', 
		    'goto_page' => '/my', 
		    'error_page' => '/login', 
		    'save_login' => '1', 
		    'submit' => '现在登录' 
		); 
		 
		//登录地址 
		$url = "http://m.oschina.net/action/user/login"; 
		//设置cookie保存路径 
		$cookie = dirname(__FILE__) . '/cookie_oschina.txt'; 
		//登录后要获取信息的地址 
		$url2 = "http://m.oschina.net/my"; 
		//模拟登录 
		login_post($url, $cookie, $post); 
		//获取登录页的信息 
		$content = get_content($url2, $cookie); 
		//删除cookie文件 
		@ unlink($cookie); 
		//匹配页面信息 
		$preg = "/<td class='portrait'>(.*)<\/td>/i"; 
		preg_match_all($preg, $content, $arr); 
		$str = $arr[1][0]; 
		//输出内容 
		echo $str; 

运行上述代码后，我们会看到最终获取到登录用户的头像图片。  
  
*使用总结*  
1、初始化curl；   
2、使用curl_setopt设置目标url，和其他选项；  
3、curl_exec，执行curl；  
4、执行后，关闭curl；  
5、输出数据。  
  
*参考文献*  
《curl简介及php中的curl》，作者不详，<http://www.2cto.com/kf/201208/147091.html>  
《使用PHP CURL的POST数据》，作者：Veda，<http://www.nowamagic.net/librarys/veda/detail/124>  
《php 使用curl模拟登录discuz以及模拟发帖》，作者：tianxin，<http://www.cnblogs.com/tianxin2001x/archive/2009/10/28/1591311.html>

转载自<http://www.helloweba.com/view-blog-253.html>