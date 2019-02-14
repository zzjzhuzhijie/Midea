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
            url:$localurl+'php/reg.php',
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