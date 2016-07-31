"use strict";

$(document).ready(function() {
    function confirm() {
        $('#okReg').attr('class', 'hide');
        $('#failReg').attr('class', 'hide');
        var name = $('#login input[name=user]').val().split('/')[0];
        var psw = $('#login input[name=psw]').val().split('/')[0];
        var invite = $('#login input[name=invite]').val().split('/')[0];
        var cnf = $('#login input[name=cnfPsw]').val().split('/')[0];

        var data = {
            name: name,
            psw: psw,
            invite: invite
        };

        if (psw === cnf)
        {
            $.ajax({
                method: 'POST',
                url: '/login/add/',
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8"
            }).done((d) => {
                $('#okReg').html(JSON.stringify(d));
                $('#okReg').attr('class', '');
                $('#failReg').attr('class', 'hide');
            }).fail((d) => {
                $('#failReg').html('Fail <br>' + d.responseJSON.errmsg);
                $('#failReg').attr('class', '');
                $('#okReg').attr('class', 'hide');
            });
        }
        else
        {
            $('#failReg').html('psw != confirm psw');
            $('#failReg').attr('class', '');
            $('#okReg').attr('class', 'hide');
        }

    }

    $('#btnSignUp').click(confirm);
});