!function ($) {
    var $localurl = 'http://10.31.161.252/Midea/'
    $('#head').load($localurl + 'dist/header.html', function () {
        $('.search_wrap').hover(function () {
            $('.search_wrap').find('input').css({ 'padding': '0 10px 0 35px' }).stop().animate({
                width: 205,
            });
            $('.search_wrap').find('.search_wrap_box').css({ 'padding': '0 10px 0 35px' }).css({ 'position': 'absolute', }).stop().animate({
                width: 205,
                right: 0,
            });
            $('.search_wrap_box_icon').stop().animate({ opacity: 1 });
        }, function () {
            $('.search_wrap').find('input').css({ 'padding': '0 10px 0 35px' }).stop().animate({
                width: 0,
                padding: 0,
            }).val('');
            $('.search_wrap').find('.search_wrap_box').css({ 'padding': '0 10px 0 35px' }).css({ 'position': 'absolute', }).stop().animate({
                width: 0,
                right: 0,
            });
            $('.search_wrap_box_icon').stop().animate({ opacity: 0 });
        });
        if ($.cookie('username')) {
            $('#header .login_reg').find('span').html('欢迎，' + $.cookie('username'));
            $('#header .login_reg').find('a').attr('href', '#');
            $('#header .login_reg').css({ width: 150 });
            $('#header .login_reg').hover(function () {
                $('.out_reg').show();
            }, function () {
                $('.out_reg').hide();
            });
            $('#header .out_reg').on('click', function () {
                $.cookie('username', null, { expires: -1 });
                $(location).attr('href', $localurl + 'dist/index.html');
            })

        } else {
            $('#header .shopper a').attr('href', $localurl + 'dist/login.html');
        }
    })
    $('#foot').load($localurl + 'dist/footer.html');
    /* 加减 */
    $('.add_reduce .add').on('click', function () {
        var $num = $(this).parent().find('input').val();
        //var $num = $('.add_reduce input').val();
        $num--;
        if ($num <= 1) {
            $num = 1;
        }
        $(this).parent().find('input').val($num);
        $(this).parents('.cart_shopbus').find('.shopbus_add span').html(addprice($(this)));
        priceall();
        getcartsql($(this));
    })
    $('.add_reduce .reduce').on('click', function () {
        var $num = $(this).parent().find('input').val();
        $num++;
        if ($num >= 99) {
            $num = 99;
        }
        $(this).parent().find('input').val($num);
        $(this).parents('.cart_shopbus').find('.shopbus_add span').html(addprice($(this)));
        priceall();
        getcartsql($(this));
    })
    $('.add_reduce input').on('input', function () {
        var $value = parseInt($(this).val());
        if ($(this).parent().find('input').val() >= 99) {
            $(this).parent().find('input').val(99);
            $(this).parents('.cart_shopbus').find('.shopbus_add span').html(addprice($(this)));
            priceall();
            getcartsql($(this));
        }
        if ($(this).parent().find('input').val() <= 1) {
            $(this).parent().find('input').val(1);
            $(this).parents('.cart_shopbus').find('.shopbus_add span').html(addprice($(this)));
            priceall();
            getcartsql($(this));
        }
        if (isNaN($(this).parent().find('input').val())) {
            $(this).parent().find('input').val($value);
            priceall();
            getcartsql($(this));
        } else {
            $(this).parents('.cart_shopbus').find('.shopbus_add span').html(addprice($(this)));
            priceall();
            getcartsql($(this));
        }
    })
    /* 购物车 */
    $.ajax({
        url: $localurl + 'dist/php/shop.php',
        type: 'POST',
        dataType: 'json',
        data: {
            username: $.cookie('username'),
        }
    }).done(function (data) {
        if (!data.id) {/* 没商品 */
            $('.cart_main').hide();
            $('.cart_top .wrap span').hide();
            $('.white-box').show();
        } else {/* 商品存在 */
            var $shopid = (data.id).split(',');
            var $shopnum = (data.num).split(',');
            //console.log($shopid,$shopnum);
            $.each($shopid, function (index, value) {
                $.ajax({
                    url: $localurl + 'dist/php/data.php',
                    dataType: 'json',
                }).done(function (data1) {
                    //console.log(data1)
                    //console.log($shopid[value])
                    $.each(data1, function (dataindex, datavalue) {

                        if (value == datavalue.sid) {
                            //alert(1);
                            //console.log($('.wrap_main_center').find('.cart_shopbus'))
                            //console.log($('.cart_shopbus:hidden'))
                            var $cloneshop = $('.wrap_main_center').find('.cart_shopbus:hidden').clone(true, true);
                            //console.log($cloneshop)
                            $cloneshop.find('.shopbus_img').find('img').attr('src', datavalue.outurl);
                            $cloneshop.find('.shopbus_img').find('img').attr('sid', datavalue.sid);
                            $cloneshop.find('.shopbus_title_box a').html(datavalue.outtitle + datavalue.model);
                            $cloneshop.find('.shopbus_title_box a').attr('href',$localurl+'dist/details.html?sid='+datavalue.sid);
                            $cloneshop.find('.shopbus_style span').html(datavalue.color);
                            $cloneshop.find('.shopbus_price span').html(datavalue.price);
                            $cloneshop.find('.add_reduce input').val($shopnum[index]);
                            $cloneshop.find('.shopbus_add span').html(($shopnum[index] * datavalue.price).toFixed(2));
                            $cloneshop.css('display', 'block');
                            $('.wrap_main_center').append($cloneshop);
                            priceall();
                            getcartsql($(this));
                        }
                    })
                })
            })
            //$.each($shopid,function(index,value){
            //console.log(value)

            //})
        }
    })
    function priceall() {
        var $sum = 0;
        var $priceall = 0;
        $('.cart_shopbus:visible').each(function (index, element) {
            if ($(element).find('.check_tf input').prop('checked')) {
                $sum += Number($(element).find('.add_reduce_input input').val());
                $priceall += Number($(element).find('.shopbus_add span').html());
            }
        });
        $('.cart_numall span').html($sum);
        $('.cart_price .cart_price_all span').html($priceall.toFixed(2));
    }
    /* 单品价格 */
    function addprice(obj) {
        var $sum = $(obj).parents('.cart_shopbus').find('.add_reduce_input input').val();
        var $sumprice = parseFloat($(obj).parents('.cart_shopbus').find('.shopbus_price span').html());
        return ($sum * $sumprice).toFixed(2);
    }
    /* 单选按钮 */
    $('.allcheck').on('change', function () {
        $('.cart_shopbus:visible').find(':checkbox').prop('checked', $(this).prop('checked'));
        $('.allcheck').prop('checked', $(this).prop('checked'));
        priceall();
        getcartsql($(this));
    })
    var $inputs = $('.cart_shopbus:visible').find(':checkbox');
    $('.wrap_main_center').on('change', $inputs, function () {
        if ($('.cart_shopbus:visible').find(':checkbox').length == $('.cart_shopbus:visible').find('input:checked').size()) {
            $('.allcheck').prop('checked', true);
        } else {
            $('.allcheck').prop('checked', false);
        }
        priceall();
        getcartsql($(this));
    });
    /* 数据库交互函数 */
    var $dataid = [];
    var $datanum = [];
    function getcartsql(obj) {
        $.ajax({
            url: $localurl + 'dist/php/shop.php',
            type: 'POST',
            dataType: 'json',
            data: {
                username: $.cookie('username'),
            }
        }).done(function (data) {
            //console.log(data)//--ok
            if (data.id.length == 1) {
                $dataid = data.id.split('');
                $datanum = data.num.split('');
                console.log($dataid, $datanum)
            }
            else {
                $dataid = data.id.split(',');
                $datanum = data.num.split(',');
            }

            var $id = obj.parents('.cart_shopbus').find('img').attr('sid');
            $datanum[$.inArray($id, $dataid)] = obj.parents('.cart_shopbus').find('.add_reduce_input input').val();
            $.ajax({
                url: $localurl + 'dist/php/addregshop.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    num: $datanum.join(),
                    username: $.cookie('username')
                }
            })
        })
    }
    /* 删除 */
    function deleteshop(sid, $dataid, fn) {
        var $index = -1;
        $.each($dataid, function (index, value) {
            if (sid == value) {
                $index = index;
            }
        });
        $dataid.splice($index, 1);
        $datanum.splice($index, 1);
        $.ajax({
            url: $localurl + 'dist/php/addregshop.php',
            type: 'POST',
            dataType: 'json',
            data: {
                username: $.cookie('username'),
                num: $datanum.join(),
                id: $dataid.join()
            }
        }).done(fn);
    }
    /* 删除单个商品 */
    $('.shopbus_remove').on('click', function () {
        var $id = $(this).parents('.cart_shopbus').find('img').attr('sid');
        var $this = $(this);
        $.ajax({
            url: $localurl + 'dist/php/shop.php',
            type: 'POST',
            dataType: 'json',
            data: {
                username: $.cookie('username'),
            }
        }).done(function (data) {
            console.log(data)//--ok
            if (data.id.length == 1) {
                $dataid = data.id.split('');
                $datanum = data.num.split('');
                console.log($dataid, $datanum)
            }
            else {
                $dataid = data.id.split(',');
                $datanum = data.num.split(',');
            }
            //console.log($dataid,$datanum);
            //console.log($id);
            if (confirm('你确定要删除吗？')) {
                $this.parents('.cart_shopbus').remove();//通过当前点击的元素找到整个一行列表，删除
            }
            deleteshop($id, $dataid, function () {
                 $.ajax({
                    url: $localurl + 'dist/php/shop.php',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        username: $.cookie('username'),
                    }
                }).done(function (data) {
                    if (!data.id) {//没商品 
                        $('.cart_main').hide();
                        $('.cart_top .wrap span').hide();
                        $('.white-box').show();
                    }
                })
            });
            priceall();
        })
    })
    /* 删除选中的商品 */
    $('.cart_remove_all').on('click',function(){
        
        $.ajax({
            url: $localurl + 'dist/php/shop.php',
            type: 'POST',
            dataType: 'json',
            data: {
                username: $.cookie('username'),
            }
        }).done(function (data) {
            //console.log(data)//--ok
            if (data.id.length == 1) {
                $dataid = data.id.split('');
                $datanum = data.num.split('');
                console.log($dataid, $datanum)
            }
            else {
                $dataid = data.id.split(',');
                $datanum = data.num.split(',');
            }
            if (confirm('你确定要删除选中的删除吗？')){
                //$('.cart_shopbus:visible').find('input:checked').parents('.cart_shopbus').remove()
                $('.cart_shopbus:visible').each(function(){
                    if($(this).find('input:checkbox').is(':checked')){
                        $(this).remove();
                        deleteshop($(this).find('img').attr('sid'), $dataid);
                        priceall();
                    }
                })
            }
        })
        /* $.ajax({
            url: $localurl + 'php/addregshop.php',
            type: 'POST',
            dataType: 'json',
            data: {
                username: $.cookie('username'),
                num: '',
                id: '',
            }
        }).done(function(){
            $.ajax({
                url: $localurl + 'php/shop.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    username: $.cookie('username'),
                }
            }).done(function (data) {
                if (!data.id) {//没商品 
                    $('.cart_main').hide();
                    $('.cart_top .wrap span').hide();
                    $('.white-box').show();
                }
            })
        }) */
        
        priceall();
    })


}(jQuery)
!function ($) {
    var $localurl='http://10.31.161.252/Midea/';
    $('#head').load($localurl+'dist/header.html',function(){
        $('.search_wrap').hover(function(){
            $('.search_wrap').find('input').css({'padding': '0 10px 0 35px'}).stop().animate({
                width:205,
            });
            $('.search_wrap').find('.search_wrap_box').css({'padding': '0 10px 0 35px'}).css({'position':'absolute',}).stop().animate({
                width:205,
                right:0, 
            });
            $('.search_wrap_box_icon').stop().animate({opacity:1});
        },function(){
            $('.search_wrap').find('input').css({'padding': '0 10px 0 35px'}).stop().animate({
                width:0,
                padding:0,
            }).val('');
            $('.search_wrap').find('.search_wrap_box').css({'padding': '0 10px 0 35px'}).css({'position':'absolute',}).stop().animate({
                width:0,
                right:0, 
            });
            $('.search_wrap_box_icon').stop().animate({opacity:0});
            $('.search_ul').stop().animate({
                width:0,
            }).hide();
        });
        if($.cookie('username')){
            $('#header .login_reg').find('span').html('欢迎，'+$.cookie('username'));
            $('#header .login_reg').find('a').attr('href','#');
            $('#header .login_reg').css({width:150});
            $('#header .login_reg').hover(function(){
                $('.out_reg').show();
            },function(){
                $('.out_reg').hide();
            });
            $('#header .out_reg').on('click',function(){
                $.cookie('username',null,{expires:-1});
                window.location.reload();
            })
    
          }else{
              $('#header .shopper a').attr('href',$localurl+'dist/login.html');
          }

                  /* 搜索接口 */
         $('.search_wrap_box input').on('input',function(){
            $.ajax({
                url:`https://suggest.taobao.com/sug?code=utf-8&q=${$(this).val()}&callback=jsonp975`,
                dataType:'jsonp',
                type:'GET',
                //jsonpCallback:'search',
            }).done(function(data){
                //console.log(data.result)
                //console.log(data.result[0])
                var $html='';
                if(data.result.length<4){
                    $.each(data.result,function(index,value){
                        $html+='<li><a href="javascript:;">'+value[0]+'</a></li>';
                    })
                }else{
                    for(var i=0;i<4;i++){
                        $html+='<li><a href="javascript:;">'+data.result[i][0]+'</a></li>';
                    }
                }
                $('.search_ul ul').html($html);
            });
            if($(this).val()==''){
                $('.search_ul').stop().animate({
                    width:0,
                }).hide();
            }else{
                $('.search_ul').stop().animate({
                    width:230,
                }).show();
            }
        });
    });
    $('#foot').load($localurl+'dist/footer.html')
    /* 取sid */
    var $id = location.search.substring(1).split('=')[1];
    //$('.add_cart a:nth-of-type(1)').attr('href', `cart.html?sid=${$id}`);
    //console.log($id);
    /* 取数据 */
    $.ajax({
        url: $localurl+'dist/php/data.php',
        dataType: 'json',

    }).done(function (data) {
        //console.log(data)
        /* 左上标题 */
        var $phtml = '';
        /* url */
        var $html = '';
        /* 大标题 */
        var $h1title = '';
        /*  价格 */
        var $price = '';
        /* 颜色 */
        var $color = '';
        /* 颜色图片 */
        var $colorimg = '';
        /* 规格 */
        var $spec = '';
        /* 放大镜大图 */
        $.each(data, function (index, value) {
            if (value.sid == $id) {
                if (value.allurl) {
                    var $surl = value.allurl.split(',');
                }

                $phtml = `<a href="${$localurl+'dist/index.html'}">首页 </a>>${value.model}`;
                $h1title = `${value.outtitle}&nbsp;${value.model}`
                $price = value.price;
                $color = value.color;
                $colorimg = $surl[0];
                $spec = value.style;
                if(value.allbigurl){
                    var $burl = value.allbigurl.split(',');
                    $('.bf img').attr('src',$burl[0])
                }
                //console.log($surl);
                //$html+=`<li class="active"><a href="javascript:;"><img src="${$surl[0]}" burl="${$bigrul0}"  alt=""></a></li>`;
                $.each($surl, function (index, value) {
                    if ($burl) {
                        if(index==0){
                            if ($burl[index] || '') {
                                $html += `<li class="active"><a href="javascript:;"><img src="${value}" burl="${$burl[0]}" alt=""></a></li>`;
                            }
                            else{
                                $html += `<li class="active"><a href="javascript:;"><img src="${value}" alt=""></a></li>`;
                            }
                        }else{
                            if ($burl[index] || '') {
                                $html += `<li><a href="javascript:;"><img src="${value}" burl="${$burl[index]}" alt=""></a></li>`;
                            }
                        } 
                    }
                    else {
                        if(index==0){
                            $html += `<li class="active"><a href="javascript:;"><img src="${value}"  alt=""></a></li>`;
                        }else{
                            $html += `<li><a href="javascript:;"><img src="${value}"  alt=""></a></li>`;
                        }
                        
                    }
                })
                //$html+=`<li class="active"><a href="javascript:;"><img src="${$surl[0]}" burl="${$bigrul0}"  alt=""></a></li>`;
                /* if($surl[1]){
                    $html+=`<li><a href="javascript:;"><img src="${$surl[1]}" burl="${$bigrul1}" alt=""></a></li>`;
                }
                if($surl[2]){
                    $html+=`<li><a href="javascript:;"><img src="${$surl[2]}" burl="${$bigrul2}"  alt=""></a></li>`;
                }
                if($surl[3]){
                    $html+=`<li><a href="javascript:;"><img src="${$surl[3]}"  burl="${$bigrul3}" alt=""></a></li>`;
                }
                if($surl[4]){
                    $html+=`<li><a href="javascript:;"><img src="${$surl[4]}"  burl="${$bigrul4}" alt=""></a></li>`;
                } */
            }
        })
        //console.log($html)
        $('#details .wrap_left_ul1').html($html);
        $('#crumb .wrap p').html($phtml);
        $('.wrap_right h1').html($h1title);
        $('.floor_price span').html($price);
        $('.style_color_select img').attr('src', $colorimg);
        $('.style_color_select_c').html($color);
        $('.spec_box_select span').html($spec);
        $('.pic img').attr('src', $colorimg);
    });

    //console.log($('.wrap_left_ul1').find('li'));
    $('#details .wrap .wrap_left_ul1').on('mouseover', 'li', function () {
        //console.log($(this));
        $('#details .wrap .wrap_left_ul1').find('li').removeClass('active');
        $(this).addClass('active');
        $(this).find('img').css({ 'border': '1px solid rgba(0,0,0,0)' })
        $('.pic img').attr('src', $(this).find('img').attr('src'));
        //console.log($(this).find('img').attr('burl'))
        $('.bf img').attr('src', $(this).find('img').attr('burl'));
    })
    $('#details .wrap .wrap_left_ul1').on('mouseout', 'li', function () {
        $(this).find('img').css({ 'border': '1px solid #ccc' })

    })
    /* 放大镜 */
    //console.log($('.pic img').width());
    //console.log($('.bf img').width());
    $('.pic').on('mouseover', 'img', function (ev) {
        var $bili = $('.pic img').width() / $('.bf img').width();
        $('.xf').width($('.bf').width() * $bili);
        $('.xf').height($('.bf').height() * $bili);
        $('.bf').css({ 'visibility': 'visible' });
        $('.xf').css({ 'visibility': 'visible' });
        //console.log($('.pic img').width());
        /* var $sx=0;
        var $sy=0;
        $sx=ev.offset().left;
        $sy=ev.offset().top;
        console.log($sx,$sy) */
        $('.pic').on('mousemove', function (ev) {
            var $l = ev.pageX - $('.pic').offset().left - $('.xf').width() / 2;
            var $t = ev.pageY - $('.pic').offset().top - $('.xf').height() / 2;
            if ($l <= 0) {
                $l = 0;
            } else if ($l >= $('.pic').width() - $('.xf').width()) {
                $l = $('.pic').width() - $('.xf').width();
            }
            if ($t <= 0) {
                $t = 0;
            } else if ($t >= $('.pic').height() - $('.xf').height()) {
                $t = $('.pic').height() - $('.xf').height();
            }
            $('.xf').css({
                left: $l,
                top: $t
            })
            $('.bf img').css({
                left: -$l / $bili,
                top: -$t / $bili,
            })
        })
        $('.pic').on('mouseleave', function () {
            $('.bf').css({ 'visibility': 'hidden' });
            $('.xf').css({ 'visibility': 'hidden' });
        })

    })
    /* 详情页数量加减 */
    $('.add_reduce .add').on('click', function () {
        var $num = $('.add_reduce input').val();
        $num--;
        if ($num <= 1) {
            $num = 1;
        }
        $('.add_reduce input').val($num)
    })
    $('.add_reduce .reduce').on('click', function () {
        var $num = $('.add_reduce input').val();
        $num++;
        if ($num >= 99) {
            $num = 99;
        }
        $('.add_reduce input').val($num)
    })
    $('.add_reduce input').on('input', function () {
        if ($('.add_reduce input').val() >= 99) {
            $('.add_reduce input').val(99);
        }
        if ($('.add_reduce input').val() <= 1) {
            $('.add_reduce input').val(1);
        }
        if (isNaN($('.add_reduce input').val())) {
            $('.add_reduce input').val(1);
        }
    })  

    /* 添加购物车 */
    var $shopid=[];
    var $shopnum=[];
    function cookie(){
        if($.cookie('shopid')){
            $shopid=$.cookie('shopid').split(',');
        }
        if($.cookie('shopnum')){
            $shopnum=$.cookie('shopnum').split(',');
        }
    }
    /* 验证是否登陆---添加购物车 */
    if(!$.cookie('username')){
        $('.add_cart a:first-child').attr('href',$localurl+'dist/login.html');
    }else{/* 登陆 */
        cookie();/* 获取cookie的值 */
        $('.add_cart .add_btn').on('click',function(){
            var $id = location.search.substring(1).split('=')[1];
            $.ajax({/* 获取用户名下面的商品数量 */
                url:$localurl+'dist/php/shop.php',
                type:'POST',
                dataType:'json',
                data:{
                    username:$.cookie('username'),
                }
            }).done(function(data){
                if(data.id){/* 数据库有id值 */
                    var $arrid=(data.id).split(',');/* 数据库id存入数组 */
                    var $arrnum=(data.num).split(',');/* 数据库num存入数组 */
                    //console.log($arrid)
                    $.cookie('shopid',$arrid.toString(),{expires:10})/* 存入cookie */
                    $.cookie('shopnum',$arrnum.toString(),{expires:10})/* 存入cookie */
                    cookie();//获取cookie
                    if($.inArray($id,$arrid)==-1){/* 数据库不存在id这个商品 */
                        $shopid.push($id);
                        $shopnum.push($('.add_reduce input').val());
                        $.cookie('shopid',$shopid.toString(),{expires:10})/* 存入cookie */
                        $.cookie('shopnum',$shopnum.toString(),{expires:10})/* 存入cookie */
                        $.ajax({
                            url:$localurl+'dist/php/addregshop.php',
                            type:'POST',
                            dataType:'json',
                            data:{
                                id:$shopid.join(),
                                num:$shopnum.join(),
                                username:$.cookie('username'),
                            }
                        }).done(function(data){
                            $(location).attr('href',$localurl+'dist/cart.html');
                        })
                    }else{/* 数据库存在这个商品 */
                        var num=Number($arrnum[$.inArray($id,$arrid)])+Number($('.add_reduce input').val());
                        $arrnum[$.inArray($id,$arrid)]=num;
                        $.cookie('shopnum',$arrnum.toString(),{expires:10})/* 存入cookie */
                        $.ajax({
                            url:$localurl+'dist/php/addregshop.php',
                            type:'POST',
                            dataType:'json',
                            data:{
                                num:$arrnum.join(),
                                username:$.cookie('username'),
                            }
                        }).done(function(data){
                            $(location).attr('href',$localurl+'dist/cart.html');
                        })
                    }
                }else{/* 数据库没有id值 */
                    $shopid=[];
                    $shopnum=[];
                    $shopid.push($id);
                    $shopnum.push($('.add_reduce input').val());
                    $.cookie('shopid',$shopid.toString(),{expires:10})/* 存入cookie */
                    $.cookie('shopnum',$shopnum.toString(),{expires:10})/* 存入cookie */
                    $.ajax({
                        url:$localurl+'dist/php/addregshop.php',
                        type:'POST',
                        dataType:'json',
                        data:{
                            id:$shopid.join(),
                            num:$shopnum.join(),
                            username:$.cookie('username'),
                        }
                    }).done(function(data){
                        $(location).attr('href',$localurl+'dist/cart.html');
                    })
                }
                
                
            })
        })
    }
    
}(jQuery);
!function ($) {
    var $localurl = 'http://10.31.161.252/Midea/';
    $('#pubhead').load($localurl + 'dist/header.html', function () {
        $('.search_wrap').hover(function () {
            $('.search_wrap').find('input').css({ 'padding': '0 10px 0 35px' }).stop().animate({
                width: 205,
            });
            $('.search_wrap').find('.search_wrap_box').css({ 'padding': '0 10px 0 35px' }).css({ 'position': 'absolute', }).stop().animate({
                width: 205,
                right: 0,
            });
            $('.search_wrap_box_icon').stop().animate({ opacity: 1 });
        }, function () {
            $('.search_wrap').find('input').css({ 'padding': '0 10px 0 35px' }).stop().animate({
                width: 0,
                padding: 0,
            }).val('');
            $('.search_wrap').find('.search_wrap_box').css({ 'padding': '0 10px 0 35px' }).css({ 'position': 'absolute', }).stop().animate({
                width: 0,
                right: 0,
            });
            $('.search_wrap_box_icon').stop().animate({ opacity: 0 });
            $('.search_ul').stop().animate({
                width:0,
            }).hide();
        });

        /* 查找cookie*/
        if ($.cookie('username')) {
            $('#header .login_reg').find('span').html('欢迎，' + $.cookie('username'));
            $('#header .login_reg').find('a').attr('href', '#');
            $('#header .login_reg').css({ width: 150 });
            $('#header .login_reg').hover(function () {
                $('.out_reg').show();
            }, function () {
                $('.out_reg').hide();
            });
            $('#header .out_reg').on('click', function () {
                $.cookie('username', null, { expires: -1 });
                window.location.reload();
            })

        } else {
            $('#header .shopper a').attr('href', $localurl + 'dist/login.html');
        }

        /* 搜索接口 */
         $('.search_wrap_box input').on('input',function(){
            $.ajax({
                url:`https://suggest.taobao.com/sug?code=utf-8&q=${$(this).val()}&callback=jsonp975`,
                dataType:'jsonp',
                type:'GET',
                //jsonpCallback:'search',
            }).done(function(data){
                //console.log(data.result)
                //console.log(data.result[0])
                var $html='';
                if(data.result.length<4){
                    $.each(data.result,function(index,value){
                        $html+='<li><a href="javascript:;">'+value[0]+'</a></li>';
                    })
                }else{
                    for(var i=0;i<4;i++){
                        $html+='<li><a href="javascript:;">'+data.result[i][0]+'</a></li>';
                    }
                }
                $('.search_ul ul').html($html);
            });
            if($(this).val()==''){
                $('.search_ul').stop().animate({
                    width:0,
                }).hide();
            }else{
                $('.search_ul').stop().animate({
                    width:230,
                }).show();
            }
        });
        
    });

    $('#foot').load($localurl + 'dist/footer.html', function () { });
    $('#menu dl').on('mouseover', function () {
        $(this).css({
            'background': 'rgba(0,0,0,0.6)',
        })
        $(this).find('dd').css({ 'display': 'block' });
    })
    $('#menu dl').on('mouseout', function () {
        $(this).css({
            'background': '',
        })
        $(this).find('dd').css({ 'display': 'none' });
    })
    $('#banner').hover(function () {
        $('.banner_left').show();
        $('.banner_right').show();
        clearInterval(timer);
    }, function () {
        $('.banner_left').hide();
        $('.banner_right').hide();
        timer = setInterval(function () {
            !function () {
                $btn_i++;
                btn_fni();
                if ($btn_i == $('#banner ol li').length) {
                    $('#banner ol li:first-child').addClass('active');
                } else {
                    $('#banner ol li').eq($btn_i).addClass('active');
                }
            }();
        }, 2000)
    })
    /* 自动轮播 */
    var timer = setInterval(function () {
        !function () {
            $btn_i++;
            btn_fni();
            if ($btn_i == $('#banner ol li').length) {
                $('#banner ol li:first-child').addClass('active');
            } else {
                $('#banner ol li').eq($btn_i).addClass('active');
            }
        }();
    }, 2000)
    /* 轮播图 */
    var $bstop = true;
    var $firstli = $('.banner_ul li:first-child').clone(true);
    var $lastli = $('.banner_ul li:last-child').clone(true);
    $($lastli).insertBefore('.banner_ul li:first-child');
    $('.banner_ul').append($firstli);
    $('.banner_ul').css({
        width: $('.banner_ul').children().length * $('.banner_ul').children(0).width(),
    })

    var $btn_i = 0;
    $('.banner_right').on('click', function () {
        if ($bstop) {
            $bstop = false;
            $btn_i++;
            btn_fni();
            if ($btn_i == $('#banner ol li').length) {
                $('#banner ol li:first-child').addClass('active');
            } else {
                $('#banner ol li').eq($btn_i).addClass('active');
            }
        }
    })
    $('.banner_left').on('click', function () {
        if ($bstop) {
            $bstop = false;
            $btn_i--;
            btn_fni();
            if ($btn_i == -1) {
                $('#banner ol li:last-child').addClass('active');
            } else {
                $('#banner ol li').eq($btn_i).addClass('active');
            }
        }
    })
    $('#banner ol li').hover(function () {
        $btn_i = $(this).index();
        btn_fni();
        $(this).addClass('active');
    })
    function btn_fni() {
        //$('.banner_ul li').css({'display':'none'});
        $('#banner ol li').removeClass('active');
        $('.banner_ul').stop().animate({
            left: -($btn_i + 1) * $('.banner_ul').children(0).width(),
        }, function () {
            if ($btn_i == $('#banner ol li').length) {
                $('.banner_ul').css({
                    'left': -$('.banner_ul').children(0).width(),
                });
                $btn_i = 0;

            }
            if ($btn_i == -1) {
                $('.banner_ul').css({
                    'left': -$('.banner_ul').children(0).width() * $('#banner ol li').length,
                });
                $btn_i = $('#banner ol li').length - 1;
            }
            $bstop = true;
        });
    }

    /* 划过上浮 */
    $('.floor_topleft').hover(function () {
        $('.floor_topleft img').stop().animate({ 'margin-top': '25px' })
    }, function () {
        $('.floor_topleft img').stop().animate({ 'margin-top': '35px' })
    })
    $('.floor_botright').hover(function () {
        $('.floor_botright img').stop().animate({ 'margin-top': '25px' })
    }, function () {
        $('.floor_botright img').stop().animate({ 'margin-top': '35px' })
    })
    /* 右上 */
    $('.floor_topright li').hover(function () {
        $(this).find('img').stop().animate({ 'margin-top': '25px' })
    }, function () {
        $(this).find('img').stop().animate({ 'margin-top': '35px' })
    })
    /* 左下上 */
    $('.floor_botleft_top').hover(function () {
        $(this).find('img').stop().animate({ 'margin-top': '20px' })
    }, function () {
        $(this).find('img').stop().animate({ 'margin-top': '28px' })
    })
    /* 左下下 */
    $('.floor_botleft_bot li').hover(function () {
        $(this).find('img').stop().animate({ 'margin-top': '25px' })
    }, function () {
        $(this).find('img').stop().animate({ 'margin-top': '35px' })
    })
    /* 推荐 */
    $('.recommend_shop').on('mouseover', 'li', function () {
        $(this).find('img').stop().animate({ 'margin-top': '25px' })
    })
    $('.recommend_shop').on('mouseout', 'li', function () {
        $(this).find('img').stop().animate({ 'margin-top': '35px' })
    })
    /* 会员 */
    $('.vip_wrap_ul1').on('mouseover', 'li', function () {
        $(this).find('img').stop().animate({ 'margin-top': '20px' })
    })
    $('.vip_wrap_ul1').on('mouseout', 'li', function () {
        $(this).find('img').stop().animate({ 'margin-top': '30px' })
    })

    /* 获取图片数据 */
    var btn_lou1=false;/* 判断是否拼接 */
    var btn_lou2=false;/* 判断是否拼接 */
    $.ajax({
        url: $localurl + 'dist/php/picurl.php',
        dataType: 'json',

    }).done(function (data) {
        //console.log(data);
        var $html = '';
        $.each(data, function (index, value) {
            if (index < 4) {
                if (index == 0) {
                    $html += '<li class="groom_1"><a href="' + value.hrefurl + '"><img data-original="' + value.picurl + '" class="lazy"></a></li>';
                } else {
                    $html += '<li><a href="' + value.hrefurl + '"><img data-original="' + value.picurl + '" class="lazy"></a></li>';
                }
            }
        })
        $('.groom_ul1').html($html);
        $("img.lazy").lazyload({
            effect: "fadeIn",
        });
        btn_lou1=true;/* 判断是否拼接 */
    }).done(function (data) {
        var $html1 = '';
        $.each(data, function (index, value) {
            if (index >= 4) {
                if (index == 4) {
                    $html1 += '<li class="vip_wrap_li1"><a href="' + value.hrefurl + '"><img data-original="' + value.picurl + '" class="lazy"></a><a href="' + value.hrefurl + '" class="vip_btn">立即查看</a></li>';
                } else {
                    $html1 += '<li><a href="' + value.hrefurl + '"><img data-original="' + value.picurl + '" class="lazy"></a><a href="' + value.hrefurl + '" class="vip_btn">立即查看</a></li>';
                }
            }
        })
        $('.vip_wrap_ul1').html($html1);
        $("img.lazy").lazyload({
            effect: "fadeIn",
        });
        btn_lou2=true;/* 判断是否拼接 */
    });

    /* 推荐专区 */
    var btn_lou3=false;/* 判断是否拼接 */
    $.ajax({
        url: $localurl + 'dist/php/data.php',
        dataType: 'json',

    }).done(function (data) {
        //console.log(data);
        var $html = '';
        $html += "<ul>";
        $.each(data, function (index, value) {
            $html += `<li><a href="${$localurl}dist/details.html?sid=${value.sid}">
                    <img data-original="${value.outurl}" class="lazy"
                        alt="">
                    <h5>
                        ${value.outtitle}
                    </h5>
                    <p>
                            <span>￥</span>
                            ${value.price}
                        </p>
                </a>
            </li>`
        });
        $html += "</ul>";
        //console.log($html)
        $('#recommend .recommend_shop').html($html);
        $("img.lazy").lazyload({
            effect: "fadeIn",
        });
        btn_lou3=true;/* 判断是否拼接 */
    })
    /* 隐藏楼梯 */
        $(window).on('scroll', function () {
            //console.log($(window).scrollTop());
            if(btn_lou1&&btn_lou2&&btn_lou3){
            var $top = $(window).scrollTop()
            if ($top >= 500) {
                $('#fixed_box').show();
                $('.hide').show();
                $('#fixed_box').stop().animate({
                    opacity: 1,
                })
            } else {
                $('#fixed_box').stop().animate({
                    opacity: 0,
                })
                $('#fixed_box').hide();
                $('.hide').hide();
            }
            
                $('.louti').each(function (index, element) {
                    var $loutitop=$('.louti').eq(index).offset().top;
                    if($loutitop>($top-500)){
                        $('#fixed_box li').not('.last').eq(index).addClass('active_lou').siblings('li').removeClass('active_lou');
                        return false;
                    }
                })
            } 
            
        })
        $('#fixed_box li').not('.last').on('click',function(){
            $(this).addClass('active_lou').siblings('li').removeClass('active_lou');
            $('html,body').animate({
                scrollTop:$('.louti').eq($(this).index()).offset().top,
            })
            $('.last').on('click',function(){
                $('html,body').animate({
                    scrollTop:0
                });
            })
        })
        /* $('.fixed_top').on('click', function () {
            //$(window).scrollTop(0);
            $('html,body').stop().animate({ scrollTop: 0 });
        })
        $('.fixed_star').on('click', function () {
            //$(window).scrollTop(800);
            $('html,body').stop().animate({ scrollTop: 800 });
    
        })
        $('.fixed_recommend').on('click', function () {
            //$(window).scrollTop(2345);
            $('html,body').stop().animate({ scrollTop: 2345 })
    
        })
        $('.fixed_vip').on('click', function () {
            //$(window).scrollTop(3564);
            $('html,body').stop().animate({ scrollTop: 3564 })
    
        }) */
        $('.hide').on('click', function () {
            if ($(this).hasClass('visible')) {
                $('#fixed_box').stop().animate({
                    right: -122,
                })
                $('.hide').html('<').removeClass('visible');
            } else {
                $('#fixed_box').stop().animate({
                    right: 40,
                })
                $('.hide').html('>').addClass('visible')
            }
    
        })
    $("img").lazyload({
        effect: "fadeIn",
    });
}(jQuery)
!function($){
    var $localurl='http://10.31.161.252/Midea/';
    $('.reg_btn').on('click',function(){
        $.ajax({
            url:$localurl+'dist/php/login.php',
            type:'POST',
            data:{
                username:$('.username').val(),
                password:$('.password').val()
            }
        }).done(function(data){
            //console.log(data);
            if(!data){
                $('.reg_tip').html('账号密码不匹配');
            }else{
                $('.reg_tip').html('');
                $.cookie('username',data);
                $(location).attr('href',$localurl+'dist/index.html');
            }
        });
    });
    
}(jQuery);
!function($){
    var $localurl='http://10.31.161.252/Midea/';
    var $reguserbtn=true;
    var $regpassbtn=true;
    $('#form').validate({
        rules:{
            email:{
                required:true,
                email:true,
            },
            username:{
                required:true,
                minlength:5,
                maxlength:10,
            },
            password:{
                required:true,
                minlength:8,
                
            },
            password_another:{
                required:true,
                minlength:8,
                equalTo:"#password",
            }
        },
        messages:{
            email:{
                required:'请输入邮箱',
                email:'请输入正确的邮箱'
            },
            username:{
                required:'请输入用户名',
                minlength:'用户名最少为5位',
                maxlength:'用户名最多为10位'
            },
            password:{
                required:'请输入密码',
                minlength:'密码最少为8位',
                pass_reg:'请输入正确格式的密码'
            },
            password_another:{
                required:'重复密码不能位空',
                equalTo:'两次密码不一样',
                minlength:'重复密码最少为8位',
            }
        },
        errorElement: "label", //可以用其他标签，记住把样式也对应修改
        success: function(label) {
            //label指向上面那个错误提示信息标签em
            label.text("输入正确") //清空错误提示消息
                .css('color', 'green'); //加上自定义的success类
        }

    })
   /*  $.validator.setDefaults({
        //添加校验成功后的执行函数--修改提示内容，并为正确提示信息添加新的样式(默认是valid)
        success: function(label){
            label.text('√').css('color','green').addClass('valid');
        }
    }); */
    $('.username').on('input',function(){
        $.ajax({
            url:$localurl+'dist/php/reg.php',
            type:'POST' ,
            data:{
                username:$('.username').val(),
            }
        }).done(function(data){
            if(!data){
                $('#username-error_1').show().html('账号重复').css({'color':'red'});
                $reguserbtn=false;
            }else{
                $('#username-error_1').show().html('账号不重复').css({'color':'green'});
                $reguserbtn=true;
            }
        })
    })
    function fnreg(str){
        var $regnum=0;
        var $regsma=0;
        var $regbig=0;
        var $regano=0;
        if(/[a-z]+/g.test(str)){
            $regsma=1;
        }
        if(/[A-Z]+/g.test(str)){
            $regbig=1;
        }if(/[0-9]+/g.test(str)){
            $regnum=1;
        }
        if(/[\!\@\#\$\%\^\&\*\(\)\{\}\]\[\|\,\.\~\`]+/g.test(str)){
            $regano=1;
        }
        if($regnum+$regsma+$regbig+$regano>=3){
            return true;
        }
    }
    $('#password').on('input',function(){
        if(!fnreg($('#password').val())){
            $('#password-error_1').html('密码格式不对').css({'color':'red'})
            $regpassbtn=false;
        }else{
            $('#password-error_1').html('密码格式正确').css({'color':'green'})
            $regpassbtn=true;
        }    
    })
   $('.reg_btn input').on('click',function(){
        if($('.reg_botbook').find('input:checked').length==0){
            $('.check_btn_error').html('未同意协议!');
        }else{
            $('.check_btn_error').html('');
        }
    }) 
    $('#form').submit(function(){
        
            if(!$regpassbtn||!$reguserbtn||$('.reg_botbook').find('input:checked').length==0){
                return false;
            }
            
    })
 
}(jQuery)