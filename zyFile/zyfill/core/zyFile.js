/*
 * zyFile.js 基于HTML5 文件上传的核心脚本 http://www.czlqibu.com
 * by zhangyan 2014-06-21   QQ : 623585268
 */

var ZYFILE = {
    fileInput : null,             // 选择文件按钮dom对象
    uploadInput : null,           // 上传文件按钮dom对象
    dragDrop: null,				  // 拖拽敏感区域
    url : "",  					  // 上传action路径
    deleteUrl: '',				  //删除路径
    uploadFile : [],  			  // 需要上传的文件数组
    uploadBase64:[],              //
    lastUploadFile : [],          // 上一次选择的文件数组，方便继续上传使用
    perUploadFile : [],           // 存放永久的文件数组，方便删除使用
    successNum: 0,				  //已上传成功数
    maxFile: 0 ,					  //文件限制
	/* 提供给外部的接口 */
    filterFile : function(files){ // 提供给外部的过滤文件格式等的接口，外部需要把过滤后的文件返回
        return files;
    },
    onSelect : function(selectFile, files){      // 提供给外部获取选中的文件，供外部实现预览等功能  selectFile:当前选中的文件  allFiles:还没上传的全部文件

    },
    onDelete : function(file, files){            // 提供给外部获取删除的单个文件，供外部实现删除效果  file:当前删除的文件  files:删除之后的文件

    },
    onProgress : function(file, loaded, total){  // 提供给外部获取单个文件的上传进度，供外部实现上传进度效果

    },
    onSuccess : function(file, responseInfo){    // 提供给外部获取单个文件上传成功，供外部实现成功效果

    },
    onFailure : function(file, responseInfo){    // 提供给外部获取单个文件上传失败，供外部实现失败效果

    },
    onComplete : function(responseInfo){         // 提供给外部获取全部文件上传完成，供外部实现完成效果

    },

	/* 内部实现功能方法 */
    // 获得选中的文件
    //文件拖放
    funDragHover: function(e) {
        e.stopPropagation();
        e.preventDefault();
        this[e.type === "dragover"? "onDragOver": "onDragLeave"].call(e.target);
        return this;
    },
    // 获取文件
    funGetFiles : function(e){
        var self = this;
        // 取消鼠标经过样式
        this.funDragHover(e);
        // 从事件中获取选中的所有文件
        var files = e.target.files || e.dataTransfer.files;

        self.lastUploadFile = this.uploadFile;
        this.uploadFile = this.filterFile(files);


        // 调用对文件处理的方法
        this.funDealtFiles();

        return true;
    },
    // 处理过滤后的文件，给每个文件设置下标
    funDealtFiles : function(){
        var self = this;
        // 目前是遍历所有的文件，给每个文件增加唯一索引值
        $.each(this.uploadFile, function(k, v){
            // 因为涉及到继续添加，所以下一次添加需要在总个数的基础上添加
            v.index = self.fileNum;

        });
        // 先把当前选中的文件保存备份
        var selectFile = this.uploadFile;
        // 要把全部的文件都保存下来，因为删除所使用的下标是全局的变量
        this.perUploadFile = this.perUploadFile.concat(this.uploadFile);
        // 合并下上传的文件
        this.uploadFile = this.lastUploadFile.concat(this.uploadFile);
        // 执行选择回调
        this.onSelect(selectFile, this.uploadFile);
        return this;
    },
    // 处理需要删除的文件  isCb代表是否回调onDelete方法
    // 因为上传完成并不希望在页面上删除div，但是单独点击删除的时候需要删除div   所以用isCb做判断
    funDeleteFile : function(k){

        var self = this;  // 在each中this指向没个v  所以先将this保留 0未上传 1已上传
        if(self.uploadBase64[k].status == 0 || !self.deleteUrl){
            self.uploadBase64.splice(k,1);
            self.onDelete(k);
            self.onComplete(self.uploadBase64,"全部数据更新完成");
            return
        }

        $.ajax({
            type: 'post',
            url: self.deleteUrl,
            data : {
                flag: self.uploadBase64[k].flag
            },
            success:function (d) {
                d = JSON.parse(d);
                if(d.status == 200){
                    // 回调到外部
                    self.uploadBase64.splice(k,1);
                    self.onDelete(k,d);

                    // 回调全部完成方法
                    self.onComplete(self.uploadBase64,"全部数据更新完成");

                }else{
                    self.onFailure(k, d,'删除失败');
                }

            },
            error: function (status) {
                self.onFailure(k, status,'删除失败');
            }
        })
    },
    // 上传多个文件
    funUploadFiles : function(){
        var self = this;  // 在each中this指向没个v  所以先将this保留
        // 遍历所有文件  ，在调用单个文件上传的方法

        if(self.maxFile && (self.maxFile < self.uploadBase64.length)){
            alert('文件大于'+self.maxFile +'件,请删除多余文件');
            return
        }
        for(var k in self.uploadBase64){

            self.funUploadFile(k,self.uploadBase64[k]);

        }
    },
    // 上传单个个文件
    funUploadFile : function(k,v){
        var self = this;  // 在each中this指向没个v  所以先将this保留

        if(self.uploadBase64[k]['status']){ // 已上传 跳过
            if(k = self.uploadBase64.length - 1){
                self.onComplete(self.uploadBase64,"全部数据更新完成");
            }
            return;
        }


        var formdata = new FormData();
        // formdata.append("file", file);

        for(var i in v){
            formdata.append(i,v[i]);
        }


        var xhr = new XMLHttpRequest();
        // 绑定上传事件
        // 进度
        xhr.upload.addEventListener("progress",	 function(e){
            // 回调到外部
            self.onProgress(k, e.loaded, e.total);
        }, false);
        // 完成
        xhr.addEventListener("load", function(e){

            if(xhr.status != 200){
                self.uploadBase64[k]['status'] = 0;
                self.onFailure(k, xhr.responseText);
            }else{
                var d = JSON.parse(xhr.responseText);

                if(d.status == 200){
                    // 回调到外部
                    self.uploadBase64[k].flag = d.flag;
                    self.uploadBase64[k].src = d.flag;
                    self.uploadBase64[k]['status'] = 1;
                    self.onSuccess(k, d);

                }else{
                    self.uploadBase64[k].status = 0;
                    self.onFailure(k, d.message);
                }

                if(k = self.uploadBase64.length - 1){
                    self.onComplete(self.uploadBase64,"全部数据更新完成");
                }


            }

        }, false);
        // 错误
        xhr.addEventListener("error", function(){
            // 回调到外部
            self.uploadBase64[k].status = 0;
            self.onFailure(k, '网络错误');
            if(k = self.uploadBase64.length - 1){
                self.onComplete(self.uploadBase64,"全部数据更新完成");
            }

        }, false);



        xhr.open("POST",self.url, true);
        xhr.send(formdata);
    },
    // 返回需要上传的文件
    funReturnNeedFiles : function(){
        return this.uploadFile;
    },

    // 初始化
    init : function(){  // 初始化方法，在此给选择、上传按钮绑定事件
        var self = this;  // 克隆一个自身

        if (this.dragDrop) {
            this.dragDrop.addEventListener("dragover", function(e) { self.funDragHover(e); }, false);
            this.dragDrop.addEventListener("dragleave", function(e) { self.funDragHover(e); }, false);
            this.dragDrop.addEventListener("drop", function(e) { self.funGetFiles(e); }, false);
        }

        // 如果选择按钮存在
        if(self.fileInput){
            // 绑定change事件
            this.fileInput.addEventListener("change", function(e) {
                self.funGetFiles(e);
            }, false);
        }

        // 如果上传按钮存在
        if(self.uploadInput){
            // 绑定click事件
            this.uploadInput.addEventListener("click", function(e) {
                self.funUploadFiles(e);
            }, false);
        }




    }
};