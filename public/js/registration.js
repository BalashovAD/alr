"use strict";

$(document).ready(function() {
    function confirm() {
        $('#okReg').attr('class', 'hide');
        $('#failReg').attr('class', 'hide');
        let name = $('#login input[name=user]').val().split('/')[0];
        let psw = $('#login input[name=psw]').val().split('/')[0];
        let invite = $('#login input[name=invite]').val().split('/')[0];
        let cnf = $('#login input[name=cnfPsw]').val().split('/')[0];

        let data = {
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

	            if (d.link && d.link != '')
	            {
		            location.assign('/' + d.link);
	            }
            }).fail((d) => {
            	if (d && d.responseJSON && d.responseJSON.errmsg)
            	{
		            $('#failReg').html('Fail <br>' + d.responseJSON.errmsg);
	            }
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