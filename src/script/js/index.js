!function ($) {
    var $localurl = 'http://10.31.161.252/Midea/';
    $('#pubhead').load($localurl + 'src/header.html', function () {
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
            $('#header .shopper a').attr('href', $localurl + 'src/login.html');
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

    $('#foot').load($localurl + 'src/footer.html', function () { });
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
        url: $localurl + 'php/picurl.php',
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
        url: $localurl + 'php/data.php',
        dataType: 'json',

    }).done(function (data) {
        //console.log(data);
        var $html = '';
        $html += "<ul>";
        $.each(data, function (index, value) {
            $html += `<li><a href="${$localurl}src/details.html?sid=${value.sid}">
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