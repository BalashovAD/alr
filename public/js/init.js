"use strict";
var file;
var JsFile;

let debug = require('debug')('app:init');
import {__book} from './book';
import {__login} from './login';

localStorage.debug = 'app:book';

// GLOBAL VARIABLE
var __IS_LOGIN__ = false;
var __NAME__ = '0';

// CONSTS
const time_resize = 1000;
const BUTTON_ARROW_UP = 38;
const BUTTON_ARROW_DOWN = 40;
const BUTTON_ARROW_RIGHT = 39;
const BUTTON_ARROW_LEFT = 37;
const EPSILON = 0.001;

var __loading = function() {
    var cnt = 1;
    var el = $('#loading');

    this.play = function() {
        ++ cnt;

        if (cnt > 0)
        {
            el.show();
        }
    };

    this.stop = function() {
        -- cnt;

        if (cnt <= 0)
        {
            cnt = 0;

            el.hide();
        }
    };

    return this;
};

var __ajaxSettings = function(book) {
    $.ajax({
        statusCode: {},
        beforeSend: function () {
            book.__int__loading.play();
        },
        complete: function () {
            book.__int__loading.stop();
        }
    });
};

var __DEBUG__book = {};


var delay_fn = function (cb, cd) {
    var timer;

    return function(e) {
        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(function () {
            cb(e);
        }, cd);
    }
};

var __msg = new function() {
    var num_of_errors = 0;
    var el = $('#msg');

    el.click(function(){
        el.hide();
    });

    this.error = function(mm){
        num_of_errors++;
        console.log('Error #' + num_of_errors + ' : ' + mm);

        // screen
        el.html(mm);
        el.removeClass('msg');
        el.addClass('error');

        el.show();
    };

    this.msg = function(mm){
        console.log('Message : ' + mm);

        // screen
        el.html(mm);
        el.addClass('msg');
        el.removeClass('error');


        el.show();
    };

    return this;
}();


var error = __msg.error;
var msg = __msg.msg;


function __initBookmark(book)
{
    var submit = $('#submitBookmark');
    var choose = $('#chooseAnotherPosBookmark');
    var title = $('#titleOfBookmark');
    var text = $('#textOfBookmark');
    var pos = $('#posOnMouseBookmark');
    var reload = $('#reloadBookmark');

    function bookCb(e) {
        var el = $(e.target).closest('.h-l');
        var id = ((el.attr('id') || '0').split('_') || [, 0])[1] || '';

        pos.val(id);

        // TITLE = TEXT.substring(0, 25)

        title.val(el.text().substring(0, 25));

        text.val();

        console.log(el.text());
    }

    choose.click(function() {
        // SELECT POS
        $('#book').one('click.pos', bookCb);
    });

    submit.click(function() {
        if (pos.val().length != 0)
        {
            book.addBookmark(pos.val(), title.val(), text.val());

            pos.val(''); title.val(''); text.val('');
        }
	    else
        {
	        error('Choose position');
        }
    });

    reload.click(function() {
        book.reloadBookmark().then(function(){
            msg('Bookmark was reload')
        }, error);
    });

    var deleteBookmark = function (id){
        $('.bookmark[data-id=' + id + ']').remove();
    };


    var reset = function() {
        $('.bookmark .btn-bookmark-goto').click(function () {
            var pos = $(this).closest('.bookmark').data('pos');

            if (!isNaN(pos))
            {
                book.jmp(pos);
            }
        });

        $('.bookmark .btn-bookmark-edit').click(function () {
            if ($(this).data('disable') != 'true')
            {
                var el = $(this).closest('.bookmark');

                $(el).find('div.contenteditable').attr('contenteditable', 'true');
            }
        });

        $('.bookmark .btn-bookmark-save').click(function () {
            var el = $(this).closest('.bookmark');

            $(el).find('div.contenteditable').attr('contenteditable', 'false');

            book.editBookmark(el.data('id'), $(el).find('.bookmark-pos').html(),
                $(el).find('.bookmark-title').html(), $(el).find('.bookmark-text').html()
            ).then(function(){
                msg('Bookmark was edited');
            }, error);
        });

        $('.bookmark .btn-bookmark-delete').click(function() {
            var el = $(this).closest('.bookmark');

            var id = $(el).data('id');

            book.deleteBookmark(id).then(function(t) {
                deleteBookmark(t);
            }, error);
        });

    };

    return {
        "reset": reset,
        "deleteBookmark": deleteBookmark
    };
}

var clock = new (function (){
    var dataFormat = function(time) {
        return ("0" + time.getHours()).slice(-2)   + ":" +
            ("0" + time.getMinutes()).slice(-2);
    };
    var tm = $('#time');
    var cnt;

    var tmF = function(){
        tm.text(dataFormat(new Date()));

        cnt = setTimeout(tmF, 1000 * 60);
    };


    this.stop = function() {
        clearTimeout(cnt);
    };

    this.play = function() {
        var time = new Date();
        tm.text(dataFormat(new Date()));
        cnt = setTimeout(tmF, 1000 * 60 + 1000 * (60 - ("0" + time.getSeconds()).slice(-2)));
    };

    return this;
})();

function __controllerLeft(book) {
    let now = 'files';

    function controllerLeft(id) {

        if (now == id || id == '')
        {
            // do nothing
        }
        else
        {
            now = id;

            if (id[0] == '#')
            {
                id = id.substring(1);

                book.save(true);

                document.location.assign(id);

                return true;
            }

            $('.left').hide();
            var elms = $('#' + id);

            if (elms && elms.length != 0)
            {
                elms.eq(0).show();
            }
            else
            {
                $('#file').show();
            }
        }
    }

    return controllerLeft;
}


$(document).ready(function() {
//
	let login = new __login();

// .css-center-1-line
    function cssCenter1Line() {
        $('.css-center-1-line').each(function () {
            $(this).css('line-height', $(this).css('height'));
        });
    }

    cssCenter1Line();

// TIME
    clock.play();

//

// BOOK

    var book = new __book('book', {
        bookmark: __initBookmark,
        loading: __loading,
        ajaxSettings: __ajaxSettings,
        controllerLeft: __controllerLeft,
	    error: error,
	    msg: msg
    });
// DEBUG
    __DEBUG__book = book;

    book.ready(function(book) {
// ONLINE/OFFLINE MODE
        $('#onlineMode').on('change', function() {
            book.swapOnlineMode();
        });
// NIGHT/DAY MODE
        $('#nightMode').on('change', function() {
            book.swapNightMode();
        });

// MENU BUTTONS
        $('.item-menu').click(function(e) {
            var id = $(this).data('id');

            book.__int__controllerLeft(id);
        });
// SLIDER
        $('#slider').click(function (e) {
            if ($(e.target).attr('id') == 'slider')
            {
                book.scrollSlider(e.clientY - $('#slider').offset().top);
            }
            else
            {
                return false;
            }
        });

// FILE SYSTEM
        book.getFiles();
// BUTTONS
        $('#btnNavDown').click(function () {
            book.scroll();
        });

        $('#btnNavDown2').click(function () {
            book.scroll(false, 0.5);
        });

        $('#btnNavUp2').click(function () {
            book.scroll(true, 0.5);
        });

        $('#btnNavUp').click(function () {
            book.scroll(true);
        });

        $('#btnNavUndo').click(function () {
            if (book.jmpUndo() == false)
            {
                msg('Can not jump');
            }
        });

        $('#btnNavRedo').click(function () {
            if (book.jmpRedo() == false)
            {
                msg('Can not jump');
            }
        });

        $('#save').click(()=>{
            book.save();
        });
// RESIZE
        $(window).on('resize.book', delay_fn(function () {
            book.recalc();
            book.jmp();
            cssCenter1Line();
        }, time_resize));
// MOUSE WHEEL
        $('#book').on('wheel.book', function(e) {
            var del = e.originalEvent.deltaY;

            book.scroll((del > 0 ? false : true), 1, Math.abs(del));

            return false;
        });

        $('#slider').on('wheel.book', function(e) {
            var del = e.originalEvent.deltaY;

            book.scroll((del > 0 ? false : true));

            return false;
        });
// KEYBOARD
	    $(document).on('keydown.bookScroll', function(e) {
		    if (e.keyCode == BUTTON_ARROW_UP || e.keyCode == BUTTON_ARROW_DOWN)
		    {
			    book.scroll((e.keyCode == BUTTON_ARROW_DOWN ? false : true), EPSILON);
		    }
		    if (e.keyCode == BUTTON_ARROW_LEFT || e.keyCode == BUTTON_ARROW_RIGHT)
		    {
			    book.scroll((e.keyCode == BUTTON_ARROW_RIGHT ? false : true), 1);
		    }

	    })
    });


});


module.exports = __DEBUG__book;