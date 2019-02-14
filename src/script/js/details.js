!function ($) {
    var $localurl='http://10.31.161.252/Midea/';
    $('#head').load($localurl+'src/header.html',function(){
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
              $('#header .shopper a').attr('href',$localurl+'src/login.html');
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
    $('#foot').load($localurl+'src/footer.html')
    /* 取sid */
    var $id = location.search.substring(1).split('=')[1];
    //$('.add_cart a:nth-of-type(1)').attr('href', `cart.html?sid=${$id}`);
    //console.log($id);
    /* 取数据 */
    $.ajax({
        url: '../php/data.php',
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

                $phtml = `<a href="${$localurl+'src/index.html'}">首页 </a>>${value.model}`;
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
        $('.add_cart a:first-child').attr('href',$localurl+'src/login.html');
    }else{/* 登陆 */
        cookie();/* 获取cookie的值 */
        $('.add_cart .add_btn').on('click',function(){
            var $id = location.search.substring(1).split('=')[1];
            $.ajax({/* 获取用户名下面的商品数量 */
                url:$localurl+'php/shop.php',
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
                            url:$localurl+'php/addregshop.php',
                            type:'POST',
                            dataType:'json',
                            data:{
                                id:$shopid.join(),
                                num:$shopnum.join(),
                                username:$.cookie('username'),
                            }
                        }).done(function(data){
                            $(location).attr('href',$localurl+'src/cart.html');
                        })
                    }else{/* 数据库存在这个商品 */
                        var num=Number($arrnum[$.inArray($id,$arrid)])+Number($('.add_reduce input').val());
                        $arrnum[$.inArray($id,$arrid)]=num;
                        $.cookie('shopnum',$arrnum.toString(),{expires:10})/* 存入cookie */
                        $.ajax({
                            url:$localurl+'php/addregshop.php',
                            type:'POST',
                            dataType:'json',
                            data:{
                                num:$arrnum.join(),
                                username:$.cookie('username'),
                            }
                        }).done(function(data){
                            $(location).attr('href',$localurl+'src/cart.html');
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
                        url:$localurl+'php/addregshop.php',
                        type:'POST',
                        dataType:'json',
                        data:{
                            id:$shopid.join(),
                            num:$shopnum.join(),
                            username:$.cookie('username'),
                        }
                    }).done(function(data){
                        $(location).attr('href',$localurl+'src/cart.html');
                    })
                }
                
                
            })
        })
    }
    
}(jQuery);