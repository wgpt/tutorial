/*
 *
 *
 */

(function ($) {
    $.fn.zyUpload = function (options, param) {

        var otherArgs = Array.prototype.slice.call(arguments, 1);
        if (typeof options == 'string') {
            var fn = this[0][options];
            if ($.isFunction(fn)) {
                return fn.apply(this, otherArgs);
            } else {
                throw ("zyUpload - No such method: " + options);
            }
        }
        options.maxFileSize = options.maxFileSize ? options.maxFileSize * 1024 * 1024 : 51200000;
        return this.each(function () {
            var para = {};    // 保留参数
            var self = this;  // 保存组件对象

            var defaults = {
                width: "700px",  					      // 宽度
                height: "400px",  					      // 宽度
                itemWidth: "140px",                           // 文件项的宽度
                itemHeight: "120px",                           // 文件项的高度
                url: "",  	      					  // 上传文件的路径 status = 200
                deleteUrl: '', 								  //删除文件的路径, 成功判断条件,status = 200
                imgUrl: '', 								  //图片host
                aspectRatio: 0,								  //裁剪比例
                maxSize: [0, 0],            					//裁剪最大限制
                minSize: [0, 0],			  					//裁剪最小限制
                maxFile: 0,								  //文件数限制
                maxFileSize: 0,　　　　　　　　　				  //文件大小限制　0 = 51200000
                quality: 1,                               // 图片质量 0~1，开启都是jpeg
                data: {},								  //原始填充数据
                multiple: true,  						      // 是否可以多个文件上传
                dragDrop: true,  						      // 是否可以拖动上传文件
                del: true,  						      // 是否开启删除文件
                edit: true,  						      // 是否开启裁剪文件
                change: true,  						  // 是否开启重新上传文件
                tailor: true,  						      // 是否可以截取图片
                finishDel: false,  						      // 是否在上传文件完成后删除预览
                singlePut: false,                            //是否选择立即上传

                /* 提供给外部的接口方法 */
                onSelect: function (selectFiles, allFiles) {
                }, // 选择文件的回调方法  selectFile:当前选中的文件  allFiles:还没上传的全部文件
                onProgress: function (file, loaded, total) {
                },   // 正在上传的进度的回调方法
                onDelete: function (file, files) {
                },           // 删除一个文件的回调方法 file:当前删除的文件  files:删除之后的文件
                onSuccess: function (file, response) {
                },        // 文件上传成功的回调方法
                onFailure: function (file, response) {
                },        // 文件上传失败的回调方法
                onComplete: function (response) {
                }               // 上传完成的回调方法
            };

            para = $.extend(defaults, options);

            this.init = function () {
                ZYFILE.uploadBase64 = [];
                this.createHtml();  // 创建组件html
                this.createCorePlug();  // 调用核心js

                if (para.data.length > 0) {
                    this.initHtml(para.data);
                }
            };

            /**
             * 功能：创建上传所使用的html
             * 参数: 无
             * 返回: 无
             */
            this.createHtml = function () {
                var multiple = para.multiple ? 'multiple': '';  // 设置多选的参数
                var html = '';

                if (para.dragDrop) {
                    // 创建带有拖动的html
                    html += '<div id="uploadForm" action="' + para.url + '">';
                    html += '	<div class="upload_box">';
                    html += '		<div class="upload_main">';
                    html += '			<div class="upload_choose">';
                    html += '				<div class="convent_choice">';
                    html += '					<div class="andArea">';
                    html += '						<div class="filePicker">点击选择文件</div>';
                    html += '						<input id="fileImage" type="file" size="30" name="" ' + multiple + ' />';
                    html += '					<input id="changeImage" type="file" size="30" name="" />';
                    html += '					</div>';
                    html += '				</div>';
                    html += '				<span id="fileDragArea" class="upload_drag_area">或者将文件拖到此处</span>';
                    html += '			</div>';
                    html += '			<div class="status_bar">';
                    // html += '				<div id="status_info" class="info">选中0张文件，共0B。</div>';
                    html += '				<div class="btns">';
                    html += '					<div class="webuploader_pick">继续选择</div>';
                    html += '					<div class="upload_btn" style="display: '+(para.singlePut?'none':'block')  +'">开始上传</div>';
                    html += '				</div>';
                    html += '			</div>';
                    html += '			<div id="preview" class="upload_preview"></div>';
                    html += '		</div>';
                    html += '		<div class="upload_submit">';
                    html += '			<button type="button" id="fileSubmit" class="upload_submit_btn">确认上传文件</button>';
                    html += '		</div>';
                    html += '		<div id="uploadInf" class="upload_inf"></div>';
                    html += '	</div>';
                    html += '</div>';
                } else {
                    var imgWidth = parseInt(para.itemWidth.replace("px", "")) - 15;

                    // 创建不带有拖动的html
                    html += '<div id="uploadForm" action="' + para.url + '">';
                    html += '	<div class="upload_box">';
                    html += '		<div class="upload_main single_main">';
                    html += '			<div class="status_bar">';
                    // html += '				<div id="status_info" class="info">选中0张文件，共0B。</div>';
                    html += '				<div class="btns">';
                    html += '						<input id="fileImage" type="file" size="30" name="" ' + multiple + ' />';
                    html += '					<input id="changeImage" type="file" size="30" name="" />';
                    html += '					<div class="webuploader_pick">选择文件</div>';
                    html += '					<div class="upload_btn" style="display: '+(para.singlePut?'none':'block')  +'">开始上传</div>';
                    html += '				</div>';
                    html += '			</div>';
                    html += '			<div id="preview" class="upload_preview">';
                    html += '				<div class="add_upload">';
                    html += '					<a style="height:' + para.itemHeight + ';width:' + para.itemWidth + ';" title="点击添加文件" id="rapidAddImg" class="add_imgBox" href="javascript:void(0)">';
                    html += '						<div class="uploadImg" style="width:' + imgWidth + 'px">';
                    html += '							<img class="upload_image" src="' + para.public + 'control/images/add_img.png"/>';
                    html += '						</div>';
                    html += '					</a>';
                    html += '				</div>';
                    html += '			</div>';
                    html += '		</div>';
                    html += '		<div class="upload_submit">';
                    html += '			<button type="button" id="fileSubmit" class="upload_submit_btn">确认上传文件</button>';
                    html += '		</div>';
                    html += '		<div id="uploadInf" class="upload_inf"></div>';
                    html += '	</div>';
                    html += '</div>';
                }

                $(self).append(html).css({"width": para.width, "height": para.height});

                // 初始化html之后绑定按钮的点击事件
                this.addEvent();
            };

            /**
             * 功能：显示统计信息和绑定继续上传和上传按钮的点击事件
             * 参数: 无
             * 返回: 无
             */
            this.funSetStatusInfo = function (files) {
                var size = 0;
                var num = files.length;
                $.each(files, function (k, v) {
                    // 计算得到文件总大小
                    size += v.size;
                });

                // 转化为kb和MB格式。文件的名字、大小、类型都是可以现实出来。
                if (size > 1024 * 1024) {
                    size = (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
                } else {
                    size = (Math.round(size * 100 / 1024) / 100).toString() + 'KB';
                }

                // 设置内容
                $("#status_info").html("选中" + num + "张文件，共" + size + "。");
            };

            /**
             * 功能：过滤上传的文件格式等
             * 参数: files 本次选择的文件
             * 返回: 通过的文件
             */
            this.funFilterEligibleFile = function (files) {
                var arrFiles = [];  // 替换的文件数组

                for (var i = 0, file; file = files[i]; i++) {

                    //上传文件数限制
                    if(para.maxFile && ZYFILE.uploadBase64.length + arrFiles.length + 1 > para.maxFile){
                        alert('已经超过' + para.maxFile + '个限制！');
                        break;
                    }


                    if (file.size >= para.maxFileSize) {
                        alert('您这个"' + file.name + '"文件大小超过' + parseFloat(para.maxFileSize / 1024 / 1024).toFixed(1) + 'M');
                        continue;
                    } else if (file.type != "image/jpeg" && file.type != "image/png") {
                        alert('您这个"' + file.name + '"格式必须是jpg或png格式文件');
                        continue;
                    } else {

                        arrFiles.push(file);

                    }
                }

                return arrFiles;
            };

            /**
             * 功能： 原始加载 预览html
             * 参数: data 本次传入的数据
             * 返回: 预览的html
             */
            this.initHtml = function (data) {

                var html = "";
                var imgWidth = parseInt(para.itemWidth.replace("px", "")) - 15;
                var imgHeight = parseInt(para.itemHeight.replace("px", "")) - 10;

                // 处理配置参数编辑和删除按钮
                var editHtml = "";
                var delHtml = "";
                var changeHtml = "";

                for (var i in data) {
                    if (para.edit) {  // 显示编辑按钮
                        editHtml = '<span class="file_edit" data-index="' + i + '" title="编辑"></span>';
                    }
                    if (para.del) {  // 显示删除按钮
                        delHtml = '<span class="file_del" data-index="' + i + '" title="删除"></span>';
                    }
                    if (para.change) {  // 显示重新上传按钮
                        changeHtml = '<span class="file_change" data-index="' + i + '" title="重新选择"></span>';
                    }

                    // 图片上传的是图片还是其他类型文件
                    html += '<div id="uploadList_' + i + '" class="upload_append_list init">';
                    html += '	<div class="file_bar">';
                    html += '		<div style="padding:5px;">';
                    html += '			<p class="file_name" title="' + data[i].name + '">' + data[i].name + '</p>';
                    html += changeHtml;  // 编辑按钮的html
                    html += editHtml;  // 编辑按钮的html
                    html += delHtml;   // 删除按钮的html
                    html += '		</div>';
                    html += '	</div>';
                    html += '	<a style="height:' + para.itemHeight + ';width:' + para.itemWidth + ';" href="#" class="imgBox">';
                    html += '		<div class="uploadImg" style="width:' + imgWidth + 'px;max-width:' + imgWidth + 'px;max-height:' + imgHeight + 'px;">';
                    html += '			<img id="uploadImage_' + i + '" class="upload_image" src="' + para.imgUrl + data[i].flag + '" style="width:expression(this.width > ' + imgWidth + ' ? ' + imgWidth + 'px : this.width);" />';
                    html += '		</div>';
                    html += '	</a>';
                    html += '	<p id="uploadProgress_' + i + '" class="file_progress"></p>';
                    html += '	<p id="uploadFailure_' + i + '" class="file_failure">上传失败，请重试</p>';
                    html += '	<p id="uploadTailor_' + i + '" class="file_tailor" tailor="false">裁剪完成</p>';
                    html += '	<p id="uploadSuccess_' + i + '" class="file_success"></p>';
                    html += '</div>';
                    ZYFILE.uploadBase64[i] = data[i];
                    ZYFILE.uploadBase64[i].status = 1;
                    if (para.dragDrop) {
                        $("#preview").append(html);
                    } else {
                        $(".add_upload").before(html);
                    }
                    $("#uploadSuccess_" + i).show();



                }
                // 绑定删除按钮事件
                var funBindDelEvent = function () {
                    // 删除方法
                    $("#zyfile .init .file_del").click(function (e) {
                        e.preventDefault();
                        ZYFILE.funDeleteFile($(this).attr("data-index"), true);
                        return false;
                    });

                    if ($("head").html().indexOf("zyPopup") < 0) {  // 代表没有加载过js和css文件
                        // 动态引入裁剪的js和css文件
                        $("<link />").attr({
                            rel: "stylesheet",
                            type: "text/css",
                            href: para.public + "zyPopup/css/zyPopup.css"
                        }).appendTo("head");
                        $.getScript(para.public + "zyPopup/js/zyPopup.js", function () {
                            // 编辑方法
                            $("#zyfile .init .file_edit").click(function () {
                                // 获取选择的文件索引
                                var imgSrc = $("#uploadImage_" + $(this).attr("data-index")).attr("src");
                                // 打开弹出层
                                self.createPopupPlug(imgSrc, $(this).attr("data-index"));
                                return false;
                            });
                        });
                    } else {  // 加载过js和css文件
                        // 编辑方法
                        $("#zyfile .init .file_edit").click(function () {
                            // 获取选择的文件索引
                            var imgSrc = $("#uploadImage_" + $(this).attr("data-index")).attr("src");
                            // 打开弹出层
                            self.createPopupPlug(imgSrc, $(this).attr("data-index"));
                            return false;
                        });
                    }
                };

                // 绑定显示操作栏事件
                var funBindHoverEvent = function () {
                    $("#zyfile .init").hover(
                        function (e) {
                            $(this).find(".file_bar").addClass("file_hover");
                        }, function (e) {
                            $(this).find(".file_bar").removeClass("file_hover");
                        }
                    );
                };


                // 绑定删除按钮
                funBindDelEvent();
                funBindHoverEvent();
                para.onComplete(data, "全部数据更新完成"); //原始数据更新
                return html;
            }


            /**
             * 功能： 处理参数和格式上的预览html
             * 参数: files 本次选择的文件
             * 返回: 预览的html
             */
            this.funDisposePreviewHtml = function (file,e) {
                var html = "";
                var imgWidth = parseInt(para.itemWidth.replace("px", "")) - 15;
                var imgHeight = parseInt(para.itemHeight.replace("px", "")) - 10;

                // 处理配置参数编辑和删除按钮
                var editHtml = "";
                var delHtml = "";
                var changeHtml = "";

                ZYFILE.uploadBase64.push({'status': 0, 'src': e.target.result, 'flag': ''});
                var index = ZYFILE.uploadBase64.length - 1;

                if (para.edit) {  // 显示编辑按钮
                    editHtml = '<span class="file_edit" data-index="' + index + '" title="编辑"></span>';
                }
                if (para.del) {  // 显示删除按钮
                    delHtml = '<span class="file_del" data-index="' + index + '" title="删除"></span>';
                }
                if (para.change) {  // 显示重新上传按钮
                    changeHtml = '<span class="file_change" data-index="' + index + '" title="重新选择"></span>';
                }


                // 处理不同类型文件代表的图标
                var fileImgSrc = "control/images/fileType/";
                if (file.type.indexOf("rar") > 0) {
                    fileImgSrc = fileImgSrc + "rar.png";
                } else if (file.type.indexOf("zip") > 0) {
                    fileImgSrc = fileImgSrc + "zip.png";
                } else if (file.type.indexOf("text") > 0) {
                    fileImgSrc = fileImgSrc + "txt.png";
                } else {
                    fileImgSrc = fileImgSrc + "txt.png";
                }


                // 图片上传的是图片还是其他类型文件
                if (file.type.indexOf("image") == 0) {
                    html += '<div id="uploadList_' + index + '" class="upload_append_list addInit">';
                    html += '	<div class="file_bar">';
                    html += '		<div style="padding:5px;">';
                    html += '			<p class="file_name" title="' + file.name + '">' + file.name + '</p>';
                    html += changeHtml; //重新上传按钮html
                    html += editHtml;  // 编辑按钮的html
                    html += delHtml;   // 删除按钮的html
                    html += '		</div>';
                    html += '	</div>';
                    html += '	<a style="height:' + para.itemHeight + ';width:' + para.itemWidth + ';" href="#" class="imgBox">';
                    html += '		<div class="uploadImg" style="width:' + imgWidth + 'px;max-width:' + imgWidth + 'px;max-height:' + imgHeight + 'px;">';
                    html += '			<img id="uploadImage_' + index + '" class="upload_image" src="' + para.imgUrl + e.target.result + '" />';
                    html += '		</div>';
                    html += '	</a>';
                    html += '	<p id="uploadProgress_' + index + '" class="file_progress"></p>';
                    html += '	<p id="uploadFailure_' + index + '" class="file_failure">上传失败，请重试</p>';
                    html += '	<p id="uploadTailor_' + index + '" class="file_tailor" tailor="false">裁剪完成</p>';
                    html += '	<p id="uploadSuccess_' + index + '" class="file_success"></p>';
                    html += '</div>';

                } else {
                    html += '<div id="uploadList_' + index + '" class="upload_append_list">';
                    html += '	<div class="file_bar">';
                    html += '		<div style="padding:5px;">';
                    html += '			<p class="file_name">' + file.name + '</p>';
                    html += delHtml;   // 删除按钮的html
                    html += '		</div>';
                    html += '	</div>';
                    html += '	<a style="height:' + para.itemHeight + ';width:' + para.itemWidth + ';" href="#" class="imgBox">';
                    html += '		<div class="uploadImg" style="width:' + imgWidth + 'px">';
                    html += '			<img id="uploadImage_' + index + '" class="upload_image" src="' + fileImgSrc + '" />';
                    html += '		</div>';
                    html += '	</a>';
                    html += '	<p id="uploadProgress_' + index + '" class="file_progress"></p>';
                    html += '	<p id="uploadFailure_' + index + '" class="file_failure">上传失败，请重试</p>';
                    html += '	<p id="uploadSuccess_' + index + '" class="file_success"></p>';
                    html += '</div>';
                }


                return html;
            };

            /**
             * 功能: 创建弹出层插件，会在其中进行裁剪操作
             * 参数: imgSrc 当前裁剪图片的路径
             * 返回: 无
             */
            this.createPopupPlug = function (imgSrc, index) {
                // 初始化裁剪插件
                $("body").zyPopup({
                    src: imgSrc,            // 图片的src路径
                    aspectRatio: para.aspectRatio,  //裁剪比例
                    maxSize: para.maxSize,            //裁剪最大限制
                    minSize: para.minSize,			  //裁剪最小限制
                    onTailor: function (val) {     // 回调返回裁剪的坐标和宽高的值
                        $("#uploadTailor_" + index).show();
                        $.getScript(para.public + "jquery.json-2.4.js", function () {
                            $("#uploadTailor_" + index).attr("tailor", $.toJSON(val));
                            var image = new Image();
                            image.src = $("#uploadImage_" + index).attr('src');

                            var canvas = $('<canvas width="' + val.width + '" height="' + val.height + '"></canvas>')[0],
                                ctx = canvas.getContext('2d');
                            ctx.drawImage(image, val.leftX, val.leftY, val.width, val.height, 0, 0, val.width, val.height);//重绘

                            var base64 = '';

                            if (para.quality > 0 && para.quality < 1) {
                                base64 = canvas.toDataURL('image/jpeg', para.quality);
                            } else {
                                base64 = canvas.toDataURL();
                            }


                            ZYFILE.uploadBase64[index]['src'] = base64;
                            ZYFILE.uploadBase64[index]['status'] = 0;
                            $("#uploadImage_" + index).attr("src", base64);
                            $('#uploadSuccess_' + index).hide();

                            if(para.singlePut){
                                $('#zyfile .upload_btn').click();
                            }


                        });
                    },
                    public: para.public
                });
            };

            /**
             * 功能：调用核心插件
             * 参数: 无
             * 返回: 无
             */
            this.createCorePlug = function () {
                var params = {
                    fileInput: $("#fileImage").get(0),
                    uploadInput: $("#fileSubmit").get(0),
                    dragDrop: $("#fileDragArea").get(0),
                    url: $("#uploadForm").attr("action"),
                    deleteUrl: para.deleteUrl,
                    filterFile: function (files) {
                        // 过滤合格的文件
                        return self.funFilterEligibleFile(files);
                    },
                    onSelect: function (selectFiles, allFiles) {
                        para.onSelect(selectFiles, allFiles);  // 回调方法
                        // self.funSetStatusInfo(ZYFILE.funReturnNeedFiles());  // 显示统计信息


                        var html = '',i=0;
                        // 组织预览html
                        var funDealtPreviewHtml = function () {

                            var file = selectFiles[i];
                            if (file) {
                                var reader = new FileReader();
                                reader.readAsDataURL(file);

                                reader.onload = function (e) {
                                    // 处理下配置参数和格式的html
                                    html += self.funDisposePreviewHtml(file, e);

                                    i++;
                                    // 再接着调用此方法递归组成可以预览的html
                                    funDealtPreviewHtml();
                                }

                            } else {
                                // 走到这里说明文件html已经组织完毕，要把html添加到预览区
                                funAppendPreviewHtml(html);

                            }
                        };


                        // 添加预览html
                        var funAppendPreviewHtml = function (html) {
                            // 添加到添加按钮前
                            if (para.dragDrop) {
                                $("#preview").append(html);
                            } else {
                                $(".add_upload").before(html);
                            }
                            // 绑定删除按钮
                            funBindDelEvent();
                            funBindHoverEvent();
                            if(para.singlePut){
                                $('#zyfile .upload_btn').click();
                            }
                        };

                        // 绑定删除按钮事件
                        var funBindDelEvent = function () {
                            if ($("#zyfile .addInit .file_del").length > 0) {
                                // 删除方法
                                $("#zyfile .addInit .file_del").click(function (e) {
                                    e.preventDefault();
                                    ZYFILE.funDeleteFile(parseInt($(this).attr("data-index")), true);
                                    return false;
                                });
                            }

                            if ($("#zyfile .addInit .file_edit").length > 0) {
                                if ($("head").html().indexOf("zyPopup") < 0) {  // 代表没有加载过js和css文件
                                    // 动态引入裁剪的js和css文件
                                    $("<link />").attr({
                                        rel: "stylesheet",
                                        type: "text/css",
                                        href: para.public + "zyPopup/css/zyPopup.css"
                                    }).appendTo("head");
                                    $.getScript(para.public + "zyPopup/js/zyPopup.js", function () {
                                        // 编辑方法
                                        $("#zyfile .addInit .file_edit").click(function () {
                                            // 获取选择的文件索引
                                            var imgSrc = $("#uploadImage_" + $(this).attr("data-index")).attr("src");
                                            // 打开弹出层
                                            self.createPopupPlug(imgSrc, $(this).attr("data-index"));
                                            return false;
                                        });
                                    });
                                } else {  // 加载过js和css文件
                                    // 编辑方法
                                    $("#zyfile .addInit .file_edit").click(function () {
                                        // 获取选择的文件索引
                                        var imgSrc = $("#uploadImage_" + $(this).attr("data-index")).attr("src");
                                        // 打开弹出层
                                        self.createPopupPlug(imgSrc, $(this).attr("data-index"));
                                        return false;
                                    });
                                }
                            }
                        };

                        // 绑定显示操作栏事件
                        var funBindHoverEvent = function () {
                            $("#zyfile .addInit ").hover(
                                function (e) {
                                    $(this).find(".file_bar").addClass("file_hover");
                                }, function (e) {
                                    $(this).find(".file_bar").removeClass("file_hover");
                                }
                            );
                        };


                        funDealtPreviewHtml();


                    },
                    onDelete: function (k, d) {
                        para.onDelete(k, d);  // 回调方法
                        // 移除效果
                        $("#uploadList_" + k).remove();
                        var num;
                        for(var i in ZYFILE.uploadBase64){
                            num = parseInt(i) + 1;
                            if(i >= k){
                                $('#uploadList_' + num + ' .file_change').attr('data-index', i);
                                $('#uploadList_' + num + ' .file_del').attr('data-index', i);
                                $('#uploadList_' + num + ' .file_edit').attr('data-index', i);
                                $('#uploadList_' + num).attr('id', 'uploadList_' + i);
                                $('#uploadProgress_' + num).attr('id', 'uploadProgress_' + i);
                                $('#uploadFailure_' + num).attr('id', 'uploadFailure_' + i);
                                $('#uploadTailor_' + num).attr('id', 'uploadTailor_' + i);
                                $('#uploadSuccess_' + num).attr('id', 'uploadSuccess_' + i);
                                $('#uploadImage_' + num).attr('id', 'uploadImage_' + i);
                            }
                        }


                        // 重新设置统计栏信息
                        /*self.funSetStatusInfo(files);
                         console.info("剩下的文件");
                         console.info(files);*/
                    },
                    onProgress: function (file, loaded, total) {
                        para.onProgress(file, loaded, total);  // 回调方法
                        var eleProgress = $("#uploadProgress_" + file),
                            percent = (loaded / total * 100).toFixed(2) + '%';
                        if (eleProgress.is(":hidden")) {
                            eleProgress.show();
                        }
                        eleProgress.css("width", percent);
                    },
                    onSuccess: function (file, response) {
                        para.onSuccess(file, response);  // 回调方法
                        $("#uploadProgress_" + file).hide();
                        $("#uploadSuccess_" + file).show();
                        $("#uploadList_" + file).attr('src', para.imgUrl + response.flag);
                        // $("#uploadInf").append("<p>上传成功，文件地址是：" + response + "</p>");
                        // 根据配置参数确定隐不隐藏上传成功的文件
                        if (para.finishDel) {
                            // 移除效果
                            $("#uploadList_" + file).fadeOut();
                            // 重新设置统计栏信息
                            self.funSetStatusInfo(ZYFILE.funReturnNeedFiles());
                        }
                        if ($("#uploadTailor_" + file).length > 0) {
                            $("#uploadTailor_" + file).hide();
                        }
                    },
                    onFailure: function (file, response, message) {
                        message = message || '上传失败';
                        para.onFailure(file, response);  // 回调方法
                        $("#uploadProgress_" + file).hide();
                        $("#uploadSuccess_" + file).hide();
                        $("#uploadFailure_" + file).show().html(message);
                        if ($("#uploadTailor_" + file).length > 0) {
                            $("#uploadTailor_" + file).hide();
                        }
                        // $("#uploadInf").append("<p>文件" + file.name + "上传失败！</p>");
                        //$("#uploadImage_" + file.index).css("opacity", 0.2);
                    },
                    onComplete: function (response) {
                        para.onComplete(response);  // 回调方法
                    },
                    onDragOver: function () {
                        $(this).addClass("upload_drag_hover");
                    },
                    onDragLeave: function () {
                        $(this).removeClass("upload_drag_hover");
                    }

                };

                ZYFILE = $.extend(ZYFILE, params);
                ZYFILE.successNum = para.data.length;
                ZYFILE.maxFile = para.maxFile;
                ZYFILE.init();
            };

            /**
             * 功能：绑定事件
             * 参数: 无
             * 返回: 无
             */
            this.addEvent = function () {
                // 如果快捷添加文件按钮存在
                if ($("#zyfile .filePicker").length > 0) {
                    // 绑定选择事件
                    $("#zyfile .filePicker").bind("click", function (e) {
                        $("#zyfile #fileImage").click();
                    });
                }

                // 绑定继续添加点击事件
                $("#zyfile .webuploader_pick").bind("click", function (e) {
                    $("#zyfile #fileImage").click();
                });

                // 绑定上传点击事件
                $("#zyfile .upload_btn").bind("click", function (e) {
                    // 判断当前是否有文件需要上传
                    if (ZYFILE.uploadBase64.length > 0) {
                        ZYFILE.funUploadFiles();
                    } else {
                        alert("请先选中文件再点击上传");
                    }
                });

                // 如果快捷添加文件按钮存在
                if ($("#zyfile #rapidAddImg").length > 0) {
                    // 绑定添加点击事件
                    $("#zyfile #rapidAddImg").bind("click", function (e) {
                        $("#zyfile #fileImage").click();
                    });
                }

                //重新选择事件
                $("#zyfile").delegate('.file_change', 'click', function () {
                    $("#zyfile #changeImage").attr('data-index', $(this).attr('data-index')).click();
                });

                $("#zyfile #changeImage").change(function (e) {


                    var file = e.target.files[0];
                    var index = $(this).attr('data-index');
                    if (file) {
                        if (file.size >= para.maxFileSize) {
                            alert('您这个"' + file.name + '"文件大小超过' + parseFloat(para.maxFileSize / 1024 / 1024).toFixed(0) + 'M');
                            return
                        } else if (file.type != "image/jpeg" && file.type != "image/png") {
                            alert('您这个"' + file.name + '"格式必须是jpg或png格式文件');
                            return
                        }

                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function (evn) {

                            $("#uploadProgress_" + index).hide();
                            $("#uploadSuccess_" + index).hide();
                            $("#uploadFailure_" + index).hide();

                            $('#uploadImage_' + index).attr('src', evn.target.result);

                            ZYFILE.uploadBase64[index]['src'] = evn.target.result;
                            ZYFILE.uploadBase64[index]['status'] = 0;


                            if(para.singlePut){
                                $('#zyfile .upload_btn').click();
                            }
                            // console.log(evn.target.result);

                        }
                    }


                });

            };


            // 初始化上传控制层插件
            this.init();
        });
    };
})(jQuery);

