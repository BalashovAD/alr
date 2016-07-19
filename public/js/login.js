
function getCookie(name)
{
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));

    return matches ? decodeURIComponent(matches[1]) : undefined;
}

getCookie.part1 = function(n){
    var val = getCookie(n) || '0';
    var tmp = val.split('_');

    return tmp[0];
};




var __login = new function()
{
    var login = $('#login');
    var sh_login = $('#login .login');
    var sh_exit = $('#login .exit');
    var err = $('#login .error');
    var thus = this;

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
        var name = $('#login input[name=user]').val().split('/')[0];
        var psw = $('#login input[name=psw]').val().split('/')[0];

        $.get('/login/_' + name + '/_' + psw).always(function(){
            login.hide();
        }).fail(function(){
            thus.login('Login and/or psw are wrong');
        }).done(function(){
            //msg('You were login.');

            location.assign('/');
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

            location.reload();
        }).fail(function(e) {
            error(e);
        });
    };

    return this;
}();

var login = __login.login;
var exit = __login.exit;

