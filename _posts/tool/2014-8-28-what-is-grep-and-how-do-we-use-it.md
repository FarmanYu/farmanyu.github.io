---
layout: post
title: Linux&#x8FDB;&#x9636;&#x5FC5;&#x5B66;&#x77E5;&#x8BC6;&#xFF1A;grep&#x662F;&#x4EC0;&#x4E48;&#xFF1F;&#x600E;&#x4E48;&#x7528;&#xFF1F; | &#x7A0B;&#x5E8F;&#x5E08;
description: 年前，作为面试官，我负责招聘unix系统管理员。那次来竞聘该岗位的共有8个人，其中两人是技术一流的自由职业者。我认为系统管理员没必要把所有的配置方法熟记于心，需要某个软件的时候，只要你想把它玩转并且玩得更酷，多读些文章，你便会自然而然地熟悉它的各种用法与配置。于是，我让这些应聘者解决下面两个问题：
keywords: 
author: FHY
---
经常读一些介绍unix命令的文章，但是文章所举的例子普遍价值不大，这就导致了看完了文章后我们并不知道如何有效地运用这些unix命令。  

##写在前面
三年前，作为面试官，我负责招聘unix系统管理员。那次来竞聘该岗位的共有8个人，其中两人是技术一流的自由职业者。我认为系统管理员没必要把所有的配置方法熟记于心，需要某个软件的时候，只要你想把它玩转并且玩得更酷，多读些文章，你便会自然而然地熟悉它的各种用法与配置。于是，我让这些应聘者解决下面两个问题：  

[object Object]1. 
[object Object]1. 
让我吃惊的是，8位应聘者中没有一个人能解决上述问题，其中两人竟对grep命令一无所知。  

介于此，我们就好好说说grep。  

首先，以下所有的操作都是基于grep 2.5.1-FreeBSD：  



	# grep --version | grep grep
	grep (GNU grep) 2.5.1-FreeBSD
有必要先交待下grep版本，因为某些用法只限定于特定的版本：  



	# man grep | grep -iB 2 freebsd
	       -P, --perl-regexp
	              Interpret PATTERN as a Perl regular expression.  This option  is
	              not supported in FreeBSD.
好了，言归正传，我们经常会这样grep文件：  



	root@nm3:/ # cat /var/run/dmesg.boot | grep CPU:
	CPU: Intel Core(TM)2 Quad CPU    Q9550  @ 2.83GHz (2833.07-MHz K8-class CPU)
还可以这样做：  



	root@nm3:/ # grep CPU: /var/run/dmesg.boot
	CPU: Intel Core(TM)2 Quad CPU    Q9550  @ 2.83GHz (2833.07-MHz K8-class CPU)
这样也是可以的（虽然我很讨厌这种操作方式）：  



	root@nm3:/ # </var/run/dmesg.boot grep CPU:
	CPU: Intel Core(TM)2 Quad CPU    Q9550  @ 2.83GHz (2833.07-MHz K8-class CPU)
你肯定会遇到这样的场景：统计文件中带有某些关键字的行出现的次数。grep+wc可以帮到你：  



	root@nm3:/ # grep WARNING /var/run/dmesg.boot | wc -l
	       3
条条大路通罗马，下面是另一条路：  



	root@nm3:/ # grep WARNING /var/run/dmesg.boot -c
	3
下面我们新建一个测试用的文档：  



	root@nm3:/ # grep ".*" test.txt
	one two three
	seven eight one eight three
	thirteen fourteen fifteen
	 sixteen seventeen eighteen seven
	sixteen seventeen eighteen
	        twenty seven
	one 504 one
	one 503 one
	one     504     one
	one     504 one
	#comment UP
	twentyseven
	        #comment down
	twenty1
	twenty3
	twenty5
	twenty7
继续grep的搜索之旅。  

-w选项指定要搜索的单词：  



	root@nm3:/ # grep -w 'seven' test.txt
	seven eight one eight three
	 sixteen seventeen eighteen seven
	        twenty seven
如果想搜以特定字符开头（结尾）的单词，可以这样：  



	root@nm3:/ # grep '<seven' test.txt
	seven eight one eight three
	 sixteen seventeen eighteen seven
	sixteen seventeen eighteen
	        twenty seven
	root@nm3:/ # grep 'seven>' test.txt
	seven eight one eight three
	 sixteen seventeen eighteen seven
	        twenty seven
	twentyseven
如果想搜以特定字符开头（结尾）的行，可以这样：  



	root@nm3:/ # grep '^seven' test.txt
	seven eight one eight three
	root@nm3:/ # grep 'seven$' test.txt
	 sixteen seventeen eighteen seven
	        twenty seven
	twentyseven
	root@nm3:/ #
想要显示目标行的上下文吗？  



	root@nm3:/ # grep -C 1 twentyseven test.txt
	#comment UP
	twentyseven
	        #comment down
到底是显示上文还是下文？  



	root@nm3:/ # grep -A 1 twentyseven test.txt
	twentyseven
	        #comment down
	root@nm3:/ # grep -B 1 twentyseven test.txt
	#comment UP
	twentyseven
我们还可以这样玩grep：  



	root@nm3:/ # grep "twenty[1-4]" test.txt
	twenty1
	twenty3
或者取非：  



	root@nm3:/ # grep "twenty[^1-4]" test.txt
	        twenty seven
	twentyseven
	twenty5
	twenty7
grep是个强大的指令，除上述列举的之外，它还支持许多限定符、通配符以及正则表达式。下面是一些例子：  



	root@nm3:/ # cat /etc/resolv.conf
	#options edns0
	#nameserver 127.0.0.1
	nameserver 8.8.8.8
	nameserver 77.88.8.8
	nameserver 8.8.4.4
只获取IP地址相关的行：  



	root@nm3:/ # grep -E "[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}" /etc/resolv.conf
	#nameserver 127.0.0.1
	nameserver 8.8.8.8
	nameserver 77.88.8.8
	nameserver 8.8.4.4
上面的方法可行，但下面这种方法更好：  



	root@nm3:/ # grep -E 'b[0-9]{1,3}(.[0-9]{1,3}){3}b' /etc/resolv.conf
	#nameserver 127.0.0.1
	nameserver 8.8.8.8
	nameserver 77.88.8.8
	nameserver 8.8.4.4
希望去掉注释行？  



	root@nm3:/ # grep -E 'b[0-9]{1,3}(.[0-9]{1,3}){3}b' /etc/resolv.conf | grep -v '#'
	nameserver 8.8.8.8
	nameserver 77.88.8.8
	nameserver 8.8.4.4
只要IP：  



	root@nm3:/ # grep -oE 'b[0-9]{1,3}(.[0-9]{1,3}){3}b' /etc/resolv.conf | grep -v '#'
	127.0.0.1
	8.8.8.8
	77.88.8.8
	8.8.4.4
哎呀，被注释掉的127.0.0.1又回来了，这是指令执行顺序不当导致的，怎么破？  



	root@nm3:/ # grep -v '#' /etc/resolv.conf | grep -oE 'b[0-9]{1,3}(.[0-9]{1,3}){3}b'
	8.8.8.8
	77.88.8.8
	8.8.4.4
下面看下-v（反向查找）选项的使用。  

假设要执行指令“ps –afx | grep ttyv ”：  



	root@nm3:/ # ps -afx | grep ttyv
	 1269 v1  Is+       0:00.00 /usr/libexec/getty Pc ttyv1
	 1270 v2  Is+       0:00.00 /usr/libexec/getty Pc ttyv2
	 1271 v3  Is+       0:00.00 /usr/libexec/getty Pc ttyv3
	 1272 v4  Is+       0:00.00 /usr/libexec/getty Pc ttyv4
	 1273 v5  Is+       0:00.00 /usr/libexec/getty Pc ttyv5
	 1274 v6  Is+       0:00.00 /usr/libexec/getty Pc ttyv6
	 1275 v7  Is+       0:00.00 /usr/libexec/getty Pc ttyv7
	48798  2  S+        0:00.00 grep ttyv
OK，但是我们不需要“48798 2 S+ 0:00.00 grep ttyv”一行，使用-v：  



	root@nm3:/ # ps -afx | grep ttyv | grep -v grep
	 1269 v1  Is+       0:00.00 /usr/libexec/getty Pc ttyv1
	 1270 v2  Is+       0:00.00 /usr/libexec/getty Pc ttyv2
	 1271 v3  Is+       0:00.00 /usr/libexec/getty Pc ttyv3
	 1272 v4  Is+       0:00.00 /usr/libexec/getty Pc ttyv4
	 1273 v5  Is+       0:00.00 /usr/libexec/getty Pc ttyv5
	 1274 v6  Is+       0:00.00 /usr/libexec/getty Pc ttyv6
	 1275 v7  Is+       0:00.00 /usr/libexec/getty Pc ttyv7
看着不爽？现在呢？  



	root@nm3:/ # ps -afx | grep "[t]tyv"
	 1269 v1  Is+       0:00.00 /usr/libexec/getty Pc ttyv1
	 1270 v2  Is+       0:00.00 /usr/libexec/getty Pc ttyv2
	 1271 v3  Is+       0:00.00 /usr/libexec/getty Pc ttyv3
	 1272 v4  Is+       0:00.00 /usr/libexec/getty Pc ttyv4
	 1273 v5  Is+       0:00.00 /usr/libexec/getty Pc ttyv5
	 1274 v6  Is+       0:00.00 /usr/libexec/getty Pc ttyv6
	 1275 v7  Is+       0:00.00 /usr/libexec/getty Pc ttyv7
别忘了| （或）符号：  



	root@nm3:/ # vmstat -z | grep -E "(sock|ITEM)"
	ITEM                   SIZE  LIMIT     USED     FREE      REQ FAIL SLEEP
	socket:                 696, 130295,      30,      65,   43764,   0,   0
殊途同归：  



	root@nm3:/ # vmstat -z | grep "sock|ITEM"
	ITEM                   SIZE  LIMIT     USED     FREE      REQ FAIL SLEEP
	socket:                 696, 130295,      30,      65,   43825,   0,   0
许多人都会在grep中用正则表达式，但你仍会忘了用POSIX字符集，即便它们也非常有用。  

POSIX：  



	[:alpha:] Any alphabetical character, regardless of case
	[:digit:] Any numerical character
	[:alnum:] Any alphabetical or numerical character
	[:blank:] Space or tab characters
	[:xdigit:] Hexadecimal characters; any number or A–F or a–f
	[:punct:] Any punctuation symbol
	[:print:] Any printable character (not control characters)
	[:space:] Any whitespace character
	[:graph:] Exclude whitespace characters
	[:upper:] Any uppercase letter
	[:lower:] Any lowercase letter
	[:cntrl:] Control characters
找有大写字母的行：  



	root@nm3:/ # grep "[[:upper:]]" test.txt
	#comment UP
搜索结构不够醒目？高亮显示：  

  

更多的grep小窍门。第一个稍显专业，我已经15年没用过了。  

选择包含six，seven或者eight的行，很简单：  



	root@nm3:/ # grep -E "(six|seven|eight)" test.txt
	seven eight one eight three
	 sixteen seventeen eighteen seven
	sixteen seventeen eighteen
	        twenty seven
	twentyseven
那么现在只选择包含six，seven或者eight若干次的行。这种用法叫回溯引用：  



	root@nm3:/ # grep -E "(six|seven|eight).*1" test.txt
	seven eight one eight three
	 sixteen seventeen eighteen seven
第二个窍门，这个更有用一些。打印504前后有tab的行（如果PCRE能够支持这个特性就好了）。  

POSIX字符集在此失效了：  



	root@nm3:/ # grep "[[:blank:]]504[[:blank:]]" test.txt
	one 504 one
	one     504     one
	one     504 one
[CTRL+V][TAB]生效：  



	root@nm3:/ # grep "     504     " test.txt
	one     504     one
我漏讲什么了吗？grep具备递归搜索文件/目录功能。如果我们想在源码目录中搜索允许Intel使用外部SFPs的代码，但是又没清楚完整地记着函数名allow_unsupported_stp和unsupported_allow_sfp。肿么办？这正是grep的菜：  



	root@nm3:/ # grep -rni allow /usr/src/sys/dev/ | grep unsupp
	/usr/src/sys/dev/ixgbe/README:75:of unsupported modules by setting the static variable 'allow_unsupported_sfp'
	/usr/src/sys/dev/ixgbe/ixgbe.c:322:static int allow_unsupported_sfp = TRUE;
	/usr/src/sys/dev/ixgbe/ixgbe.c:323:TUNABLE_INT("hw.ixgbe.unsupported_sfp", &allow_unsupported_sfp);
	/usr/src/sys/dev/ixgbe/ixgbe.c:542:     hw->allow_unsupported_sfp = allow_unsupported_sfp;
	/usr/src/sys/dev/ixgbe/ixgbe_type.h:3249:       bool allow_unsupported_sfp;
	/usr/src/sys/dev/ixgbe/ixgbe_phy.c:1228:                                if (hw->allow_unsupported_sfp == TRUE) {
希望你还没晕，因为这些grep用法只是grep的冰山一角呢！  


