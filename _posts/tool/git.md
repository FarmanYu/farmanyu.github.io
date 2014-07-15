#git学习记录
git是日常开发越来越重要的工具，很多人也拿来维护代码，越来越离不开git，这里简单介绍一下我学习git的经验。

##安装
在 <http://git-scm.com/downloads> 下载适合自己系统的版本安装。

##命令文档
git工具的命令文档如果全部写出来，那就实在太长了，不过也有别人写过经典的文档，因为是我自己学习的，所以在这里贴出来，学到每个新命令都自己在本地试试，练习练习，理解它的原理。有版本管理的经验的同学，应该很好理解这个东西吧。[文档点这里](http://www.bootcss.com/p/git-guide/)
##本地配置帐号密码
在linux下，打开~/.gitconfig, 在windows下，在 c:/users/{user}/.gitconfig 中 添加 
		[credential]
        helper = store
然后在git push origin master, 会让你输入用户名密码，但是在本地会生成一个文档，把你的用户名和密码明文(话说这个有点操蛋)存在本地。下次就会自动push，不用再输入用户名密码了。

##项目文件过滤
如果只是针对项目，在项目根目录新增.gitignore, 每一行对应一组（或个）的文件或者文件夹，echo "node_modules" > .gitignore 。仅供示例排除 node_modules文件夹的提交和状态更改。
如果要在全局设置，把.gitignore拷贝到 .gitconfig目录，运行git config --global core.excludesfile ~/.gitignore 将该文件配置规则添加到全局来过滤文件。