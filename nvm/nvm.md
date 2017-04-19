#nvm安装教程
##windows

1. https://github.com/coreybutler/nvm-windows/releases</br>
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
1. sudo apt-get git
2. cd `~/` from anywhere then git clone `https://github.com/creationix/nvm.git` .nvm
3. vi `~/.bashrc`
  #nvm  
  export NVM_DIR="$HOME/.nvm"  
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm  
  export NVM_NODEJS_ORG_MIRROR=http://npm.taobao.org/mirrors/node/  
  export NVM_NPM_ORG_MIRROR=http://npm.taobao.org/mirrors/npm/  
  source ~/git/nvm/nvm.sh
4. 重启Xshell
  



#npm淘宝镜像

`npm install -g cnpm --registry=https://registry.npm.taobao.org`