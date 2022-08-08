/**
 * Created by Administrator on 2017/8/29.
 */
/**
 * Created by Administrator on 2017/8/29.x
 * 图片加载器
 *
 */
(function ($) {
    $.fn.extend({
        imgLoading:function () {
            this.each(function (k,v) {
                var _this = $(this);
                var img = new Image();
                img.src = _this.attr('data');
                img.onload = function (){ //异步加载回调
                    _this.attr('src',_this.attr('data'));
                }
            })
        }
    })


})(jQuery)

$('img').imgLoading();