!function ($) {
    var $localurl = 'http://10.31.161.252/Midea/'
    $('#head').load($localurl + 'src/header.html', function () {
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
                $(location).attr('href', $localurl + 'src/index.html');
            })

        } else {
            $('#header .shopper a').attr('href', $localurl + 'src/login.html');
        }
    })
    $('#foot').load($localurl + 'src/footer.html');
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
        url: $localurl + 'php/shop.php',
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
                    url: $localurl + 'php/data.php',
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
                            $cloneshop.find('.shopbus_title_box a').attr('href',$localurl+'src/details.html?sid='+datavalue.sid);
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
            url: $localurl + 'php/shop.php',
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
                url: $localurl + 'php/addregshop.php',
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
            url: $localurl + 'php/addregshop.php',
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
            url: $localurl + 'php/shop.php',
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
            });
            priceall();
        })
    })
    /* 删除选中的商品 */
    $('.cart_remove_all').on('click',function(){
        
        $.ajax({
            url: $localurl + 'php/shop.php',
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