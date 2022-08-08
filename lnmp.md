# Ubuntu 下php7 mysql5.7 LNMP 环境搭建

在部署自己 LNMP 环境的时候，遇到了一些小挫折，现在把经验分享出来，让大家少走弯路。包括Php7.1安装与下载，SSL证书申请与配置，Mysql升级到5.7，Nginx服务器的简单配置。Let's start.

## 安装 Php 7.1

### 1. 准备

安装 Php7.1 之前，要先安装language-pack-en-base这个包，运行：

sudo apt-get update  
sudo apt-get install -y language-pack-en-base  
这个包是为了解决系统不同语言之间可能发生的冲突，安装之后可以减少许多因语言编码带来的问题。其中-y参数表明直接安装，无需确认。

安装完成之后，运行：

locale-gen en_US.UTF-8  
设定语言编码为UTF-8。

接下来安装Git , Vim运行：

sudo apt-get install git vim  
Git 是必备的，你可以很方便的使用Git来拉取远程仓库的代码，vim是一款强大的编辑器，可以帮助你修改一些配置文件，如.env文件，如果的你的服务器已经安装了vim编辑器，可以忽略。

进入正题，安装Php7.1，本教程采用ppa方式安装php7.1，运行：

sudo apt-get install software-properties-common  
software-properties-common是add-apt-repository所依赖的包，安装成功后，运行：

sudo LC_ALL=en_US.UTF-8 add-apt-repository ppa:ondrej/php  
来添加php7的ppa，注意LC_ALL=en_US.UTF-8参数告诉我们系统语言为UTF-8，如果没有，可能会出现错误，如阿里云的服务器。

安装完成之后，运行sudo apt-get update更新安装包，把刚才添加的包拉取下来。 运行apt-cache search php7.1搜索php7.1开头的包检验是否安装成功，输出如下：

root@demo:~# apt-cache search php7.1  
php-yaml - YAML-1.1 parser and emitter for PHP  
php-apcu - APC User Cache for PHP  
php-ssh2 - Bindings for the libssh2 library  
php-igbinary - igbinary PHP serializer  
php-mailparse - Email message manipulation for PHP  
php-libsodium - PHP wrapper for the Sodium cryptographic library  
php-propro - propro module for PHP

...
...
...
### 2. 安装：

安装php7.1:

sudo apt-get -y install php7.1  
安装成功后运行php -v查看是否安装成功，成功的话会输出类似如下信息：

PHP 7.1.0beta2 (cli) ( NTS )  
Copyright (c) 1997-2016 The PHP Group  
Zend Engine v3.1.0-dev, Copyright (c) 1998-2016 Zend Technologies  
    with Zend OPcache v7.1.0beta2, Copyright (c) 1999-2016, by Zend Technologies
安装php7.1-mysql，这是 Php7.1 与 mysql 的通信模块：

sudo apt-get -y install php7.1-mysql  
安装 fpm，这是Nginx 用来解析php文件的：

sudo apt-get install php7.1-fpm  
安装其他必备模块：

apt-get install php7.1-curl php7.1-xml php7.1-mcrypt php7.1-json php7.1-gd php7.1-mbstring  
至此与php相关的模块安装安装完成。

## 安装Mysql
直接安装Mysql5.7吧，5.7 可以说是里程碑式的版本，提高了性能，并增加了很多新的特性。特别是新增加的json字段，用过之后你会爱上她的！！

MySQL 开发团队于 9.12 日宣布 MySQL 8.0.0 开发里程碑版本（DMR）发布！但是目前 8.0.0 还是开发版本，如果你希望体验和测试最新特性，可以从 <http://dev.mysql.com/downloads/mysql/> 下载各个平台的安装包。不过，MySQL 软件包是越来越大了，Linux 平台上的二进制打包后就将近有 1 GB。如果在产品环境中使用，在 8.0 没有进入稳定版本之前，请继续使用 5.7 系列，当前最新的版本是 5.7.15 GA 版本——这只有 600 M 多。

1. 下载.deb包到你的服务器：

wget <http://dev.mysql.com/get/mysql-apt-config_0.5.3-1_all.deb>  
2. 然后使用dpkg命令添加Mysql的源：

sudo dpkg -i mysql-apt-config_0.5.3-1_all.deb  
注意在添加源的时候，会叫你选择安装 MySQL 哪个应用，这里选择 Server 即可，再选择 MySQL 5.7 后又会回到选择应用的那个界面，此时选择 Apply 即可。

3. 安装

sudo apt-get update  
sudo apt-get install mysql-server  
安装完成之后运行mysql -V查看版本：

root@demo:~# mysql -V  
mysql  Ver 14.14 Distrib 5.7.15, for Linux (x86_64) using  EditLine wrapper  
4. 注意

如果你已经通过 ppa 的方式安装了 MySQL 5.6，首先得去掉这个源

sudo apt-add-repository --remove ppa:ondrej/mysql-5.6  

# 如果没有 apt-add-repository 先安装上

# sudo apt-get install software-properties-common

然后其它和上面一样，但最后要运行sudo mysql_upgrade -u root -p升级数据库，运行sudo service mysql restart重启数据库，这样你的数据会完好无缺（不出意外的话）。

安装Nginx
简单，运行：

sudo apt-get -y install nginx  
即可，然后运行curl localhost查看是否运行成功。你也可以直接访问你的IP地址

## 配置

1. 配置php：

sudo vim /etc/php/7.1/fpm/php.ini  
输入/fix_pathinfo搜索，将cgi.fix_pathinfo=1改为cgi.fix_pathinfo=0：

NGINX配置

2. 编辑fpm的配置文件： 运行：

sudo vim /etc/php/7.1/fpm/pool.d/www.conf  
找到listen = /run/php/php7.1-fpm.sock修改为listen = 127.0.0.1:9000。使用9000端口。

service php7.1-fpm stop

service php7.1-fpm start

NGINX配置

3. 配置Nginx：

运行：

sudo vim /etc/nginx/sites-available/default  
主要是配置server这一部分，最终配置如下:

server {  
        #listen 80 default_server;
        listen 80;
        #listen [::]:80 default_server ipv6only=on;

        root /var/www/your-project-name/public;
        index index.php index.html index.htm;

        # Make site accessible from http://localhost/
        server_name lufficc.com www.lufficc.com;

        location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                try_files $uri $uri/ /index.php?$query_string;
                # Uncomment to enable naxsi on this location
                # include /etc/nginx/naxsi.rules
        }

        location ~ \.php$ {
                include snippets/fastcgi-php.conf;
        #
        #       # With php7.0-cgi alone:
                fastcgi_pass 127.0.0.1:9000;
        #       # With php7.0-fpm:
        #       fastcgi_pass unix:/run/php/php7.0-fpm.sock;
        }
}
解释：

root：是你的项目的public目录，也就是网站的入口
index：添加了，index.php，告诉Nginx先解析index.php文件
server_name：你的域名，没有的话填写localhost
location / try_files修改为了try_files $uri $uri/ /index.php?$query_string;
location ~ \.php$部分告诉Nginx怎么解析Php，原封不动复制即可，但注意：fastcgi_pass unix:/var/run/php/php7.1-fpm.sock;的目录要和fpm的配置文件中的listen一致。
4. 创建网站目录，Laravel项目：

如果你还没有/var/www目录，运行mkdir /var/www，然后将Nginx的用户名和用户组www-data分配给它：

sudo chown -R www-data:www-data  
然后进入到/var/www/目录，cd /var/www/。这个www目录就是放置你的网站文件的目录（可以多个）。

下面以laravel-blog为例，先clone我的laravel-blog,在/var/www/目录下运行：

git clone <https://github.com/lufficc/laravel-blog.git>  
这会生成在/var/www/目录下生成laravel-blog目录，注意此时上面的Nginx配置的root要和这个一致，当前配置应该是root /var/www/laravel-blog/public;，而不再是root /var/www/your-project-name/public;。

然后composer update，配置.env，数据库连接，没有安装Redis的话安装Redis:apt-get install redis-server。

最后！！重启nginx，fpm，访问你的ip地址，不出意外，安装成功，部署完成！

sudo service nginx restart  
sudo service php7.1-fpm restart  
查看nginx日志

more /var/log/nginx/error.log  
修改nginx启动用户

vi nginx.conf

修改user
小结

啰嗦了那么长，其实实际配置起来很简单，把下面的命令复制，依次运行即可完成大部分的配置，然后再简单修改一下配置文件即可：

# 安装php7.1

sudo apt-get update  
sudo apt-get install -y language-pack-en-base  
locale-gen en_US.UTF-8

sudo apt-get install software-properties-common  
sudo LC_ALL=en_US.UTF-8 add-apt-repository ppa:ondrej/php  
sudo apt-get update

sudo apt-get -y install php7.1  
sudo apt-get -y install php7.1-mysql  
sudo apt-get install php7.1-fpm

apt-get install php7.1-curl php7.1-xml php7.1-mcrypt php7.1-json php7.1-gd php7.1-mbstring

# 安装mysql5.7

wget <http://dev.mysql.com/get/mysql-apt-config_0.5.3-1_all.deb>  
sudo dpkg -i mysql-apt-config_0.5.3-1_all.deb  
sudo apt-get update  
sudo apt-get install mysql-server

# 安装nginx

sudo apt-get -y install nginx  
