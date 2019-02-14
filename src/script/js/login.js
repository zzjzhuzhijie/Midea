!function($){
    var $localurl='http://10.31.161.252/Midea/';
    $('.reg_btn').on('click',function(){
        $.ajax({
            url:$localurl+'php/login.php',
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
                $(location).attr('href',$localurl+'src/index.html');
            }
        });
    });
    
}(jQuery);