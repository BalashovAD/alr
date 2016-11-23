function getCookie(name)
{
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));

    return matches ? decodeURIComponent(matches[1]) : undefined;
}

getCookie.part1 = function(n){
    let val = getCookie(n) || '0';
    let tmp = val.split('_');

    return tmp[0];
};


let __NAME__, __IS_LOGIN__;

let __login = function()
{
    let login = $('#login');
    let sh_login = $('#login .login');
    let sh_exit = $('#login .exit');
    let err = $('#login .error');
    let thus = this;

    this.resolve = function() {
        __NAME__ = getCookie.part1('user');
        __IS_LOGIN__ = !(__NAME__ == '0');

        if (__IS_LOGIN__)
        {
            sh_exit.show();
            sh_login.hide();
        }
        else
        {
            sh_login.show();
            sh_exit.hide();
        }
    };

    this.deleteCookie = function(c_name) {
        document.cookie = encodeURIComponent(c_name) + "=; expires=" + new Date(0).toUTCString();
    };

    thus.resolve();

    $('#btnLogin').click(function(){
        let name = $('#login input[name=user]').val().split('/')[0];
        let psw = $('#login input[name=psw]').val().split('/')[0];

        $.get('/login/_' + name + '/_' + psw).always(function(){
            login.hide();
        }).fail(function(){
            thus.login('Login and/or psw are wrong');
        }).done(function(data){
            //msg('You were login.');

            location.assign('/' + (data.link || ''));
        });
    });

    $('#btnExit').click(function(){
        thus.exit();
    });

    this.login = function(error) {
        login.show();

        if (error)
        {
            err.html(error);
            err.show();
        }
        else
        {
            err.html('');
            err.hide();
        }

    };


    this.exit = function(){
        $.get('/login/exit/_' + getCookie.part1('user')).done(function() {
            thus.deleteCookie('user');
            thus.deleteCookie('connect.sid');

            location.reload();
        }).fail(function(e) {
            error(e);
        });
    };

    return this;
};

export {__login};