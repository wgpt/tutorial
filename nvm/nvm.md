#nvm安装教程
##windows

+ https://github.com/coreybutler/nvm-windows/releases</br>
下载`nvm-noinstall.zip`
+ 创建文件夹`nvm`
+ zip解压至`nvm/nvm`
+ 创建`settings.txt `
 
  - root: D:\nvm\nvm   
  - path: D:\nvm\nodejs  
  - arch: 32  
  - proxy:   
  - node_mirror: http://npm.taobao.org/mirrors/node/
  - npm_mirror: https://npm.taobao.org/mirrors/npm/
  
  
+ 配置环境变量 可以通过 window+r  : sysdm.cpl

  + `NVM_HOME = 当前 nvm.exe 所在目录`(`D:\nvm\nvm`)
  + `NVM_SYMLINK = node 快捷方式所在的目录`(`D:\nvm\nodejs`)
  + `PATH += %NVM_HOME%;%NVM_SYMLINK%;`
  + 打开CMD通过`set [name]`命令查看环境变量是否配置成功


****

##lunix
+ sudo apt-get git
+ cd `~/` from anywhere then git clone `https://github.com/creationix/nvm.git` .nvm
+ vi `~/.bashrc`
  #nvm  
  export NVM_DIR="$HOME/.nvm"  
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm  
  export NVM_NODEJS_ORG_MIRROR=http://npm.taobao.org/mirrors/node/  
  export NVM_NPM_ORG_MIRROR=http://npm.taobao.org/mirrors/npm/  

+ 重启Xshell
  


##npm 设置
+  npm config ls
+  npm config set cache D:\\nvm\\nvm\\npm-cache （包缓存）
+  npm config set prefix D:\\nvm\\nvm\\npm （包位置）
+  配置环境变量 NPM_HOME D:\\nvm\\nvm\\npm
+  PATH += %NPM_HOME%;
+  npm cache clean (缓存清除)

##安装nrm(境像选择,防墙)
+ npm install nrm -g
+ nrm ls
+ nrm test
+ nrm use