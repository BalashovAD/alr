"use strict";
let file;
//let JsFile;

let debug = require("debug")("app:init");
import {__book} from "./book";
import {__login} from "./login";

localStorage.debug = "app:book";

// GLOBAL VARIABLE
//let __IS_LOGIN__ = false;
//let __NAME__ = "0";

// CONSTS
const time_resize = 1000;
const BUTTON_ARROW_UP = 38;
const BUTTON_ARROW_DOWN = 40;
const BUTTON_ARROW_RIGHT = 39;
const BUTTON_ARROW_LEFT = 37;
const EPSILON = 0.001;

let __loading = function() {
    let cnt = 1;
    let el = $("#loading");

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

let __ajaxSettings = function(book) {
	//noinspection NodeModulesDependencies,ES6ModulesDependencies
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

let __DEBUG__ = {};


let delay_fn = function (cb, cd) {
    let timer;

    return function(e) {
        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(function () {
            cb(e);
        }, cd);
    }
};

let __msg = new function() {
    let num_of_errors = 0;
    let el = $("#msg");

    el.click(function(){
        el.hide();
    });

    this.error = function(mm){
        num_of_errors++;
        console.log("Error #" + num_of_errors + " : " + mm);

        // screen
        el.html(mm);
        el.removeClass("msg");
        el.addClass("error");

        el.show();
    };

    this.msg = function(mm){
        console.log("Message : " + mm);

        // screen
        el.html(mm);
        el.addClass("msg");
        el.removeClass("error");


        el.show();
    };

    return this;
}();


let error = __msg.error;
let msg = __msg.msg;


function __initPlayer(player)
{
	let container = $("#player");
	let btnPlay = $("#btnPlay", container);
	let btnStop = $("#btnStop", container);
	let containerForSlider = $("#containerForSliderDelay", container);
	let prev;

	function init(player, MAX_DELAY, SHIFT_DELAY, DEFAULT_DELAY)
	{
		let buttons = $(document.createDocumentFragment());

		for (let valueOfDelay = -MAX_DELAY; valueOfDelay <= MAX_DELAY; valueOfDelay += SHIFT_DELAY) {
			let el = $("<div>").addClass("value-of-delay").attr("val", valueOfDelay);

			if (Math.abs(valueOfDelay - DEFAULT_DELAY) <= SHIFT_DELAY / 2) {
				el.addClass("select");
			}

			if (Math.abs(Math.ceil(valueOfDelay) - valueOfDelay) < SHIFT_DELAY / 2)
			{
				el.addClass("notch");
			}

			buttons.append(el);
		}

		containerForSlider.append(buttons);

		prev = $(".value-of-delay.select", container);

		$(".value-of-delay").click(function () {
			let val = $(this).attr("val");

			if (val != prev.attr("val"))
			{
				player.setDelay(val);

				prev.removeClass("select");
				$(this).addClass("select");

				prev = $(this);
			}
		});

		btnPlay.click(()=> {
			player.play();
		});

		btnStop.click(()=> {
			player.stop();
		});
	}

	return init;
}

function __initBookmark(book)
{
    let submit = $("#submitBookmark");
    let choose = $("#chooseAnotherPosBookmark");
    let title = $("#titleOfBookmark");
    let text = $("#textOfBookmark");
    let pos = $("#posOnMouseBookmark");
    let reload = $("#reloadBookmark");

    function bookCb(e) {
        let el = $(e.target).closest(".h-l");
        let id = ((el.attr("id") || "0").split("_") || [, 0])[1] || "";

        pos.val(id);

        // TITLE = TEXT.substring(0, 25)

        title.val(el.text().substring(0, 25));

        text.val();

        book.selectEl(id, "user-sel");
    }

    choose.click(function() {
        // SELECT POS
        $("#book").one("click.pos", bookCb);
    });

    submit.click(function() {
        if (pos.val().length != 0)
        {
            book.addBookmark(pos.val(), title.val(), text.val());

	        book.selectEl(-1, "user-sel");

            pos.val(""); title.val(""); text.val("");
        }
	    else
        {
	        error("Choose position");
        }
    });

    reload.click(function() {
        book.reloadBookmark().then(function(){
            msg("Bookmark was reload")
        }, error);
    });

    let deleteBookmark = function (id){
        $(".bookmark[data-id=" + id + "]").remove();
    };


    let reset = function() {
        $(".bookmark .btn-bookmark-goto").click(function () {
            let pos = $(this).closest(".bookmark").data("pos");

            if (!isNaN(pos))
            {
                book.jmp(pos);

	            book.selectEl(pos, "jump");
            }
        });

        $(".bookmark .btn-bookmark-edit").click(function () {
            if ($(this).data("disable") != "true")
            {
                let el = $(this).closest(".bookmark");

                $(el).find("div.contenteditable").attr("contenteditable", "true");
            }
        });

        $(".bookmark .btn-bookmark-save").click(function () {
            let el = $(this).closest(".bookmark");

            $(el).find("div.contenteditable").attr("contenteditable", "false");

            book.editBookmark(el.data("id"), $(el).find(".bookmark-pos").html(),
                $(el).find(".bookmark-title").html(), $(el).find(".bookmark-text").html()
            ).then(function(){
                msg("Bookmark was edited");
            }, error);
        });

        $(".bookmark .btn-bookmark-delete").click(function() {
            let el = $(this).closest(".bookmark");

            let id = $(el).data("id");

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

let clock = new (function (){
    let dataFormat = function(time) {
        return ("0" + time.getHours()).slice(-2)   + ":" +
            ("0" + time.getMinutes()).slice(-2);
    };
    let tm = $("#time");
    let cnt;

    let tmF = function(){
        tm.text(dataFormat(new Date()));

        cnt = setTimeout(tmF, 1000 * 60);
    };


    this.stop = function() {
        clearTimeout(cnt);
    };

    this.play = function() {
        let time = new Date();
        tm.text(dataFormat(new Date()));
        cnt = setTimeout(tmF, 1000 * 60 + 1000 * (60 - ("0" + time.getSeconds()).slice(-2)));
    };

    return this;
})();

function __controllerLeft(book) {
    let now = "files";

    function controllerLeft(id) {

        if (now == id || id == "")
        {
            // do nothing
        }
        else
        {
            now = id;

            if (id[0] == "#")
            {
                id = id.substring(1);

                book.save(true);

                document.location.assign(id);

                return true;
            }

            $(".left").hide();
            let elms = $("#" + id);

            if (elms && elms.length != 0)
            {
                elms.eq(0).show();
            }
            else
            {
                $("#file").show();
            }
        }
    }

    return controllerLeft;
}


$(document).ready(function() {
//
	new __login();

// .css-center-1-line
    function cssCenter1Line() {
        $(".css-center-1-line").each(function () {
            $(this).css("line-height", $(this).css("height"));
        });
    }

    cssCenter1Line();

// TIME
    clock.play();

//

// BOOK

    let book = new __book("book", {
        bookmark: __initBookmark,
        loading: __loading,
        ajaxSettings: __ajaxSettings,
        controllerLeft: __controllerLeft,
	    playerInit: __initPlayer,
	    error: error,
	    msg: msg
    });
// DEBUG
    __DEBUG__.book = book;

    book.ready(function(book) {
// ONLINE/OFFLINE MODE
        $("#onlineMode").on("change", function() {
	        let context = $(this).closest(".switch-wrapper");
	        let now = context.data("text");

	        if (now == "online")
	        {
		        context.addClass("offline-mode");
		        context.data("text", "offline");
	        }
	        else
	        {
		        context.removeClass("offline-mode");
		        context.data("text", "online");
	        }

            book.swapOnlineMode();
        });
// NIGHT/DAY MODE
        $("#nightMode").on("change", function() {
	        let context = $(this).closest(".switch-wrapper");
	        let now = context.data("text");

	        if (now == "day")
	        {
		        context.addClass("night-mode");
		        context.data("text", "night");
	        }
	        else
	        {
		        context.removeClass("night-mode");
		        context.data("text", "day");
	        }

            book.swapNightMode();
        });

// MENU BUTTONS
        $(".item-menu").click(function() {
            let id = $(this).data("id");

            book.__int__controllerLeft(id);
        });
// SLIDER
        $("#slider").click(function (e) {
            if ($(e.target).attr("id") == "slider")
            {
                book.scrollSlider(e.clientY - $("#slider").offset().top);
            }
            else
            {
                return false;
            }
        });

// FILE SYSTEM
        book.getFiles();
// BUTTONS
        $("#btnNavDown").click(function () {
            book.scroll();
        });

        $("#btnNavDown2").click(function () {
            book.scroll(false, 0.5);
        });

        $("#btnNavUp2").click(function () {
            book.scroll(true, 0.5);
        });

        $("#btnNavUp").click(function () {
            book.scroll(true);
        });

        $("#btnNavUndo").click(function () {
            if (book.jmpUndo() == false)
            {
                msg("Can not jump");
            }
        });

        $("#btnNavRedo").click(function () {
            if (book.jmpRedo() == false)
            {
                msg("Can not jump");
            }
        });

        $("#save").click(()=>{
            book.save();
        });

// RESIZE
        $(window).on("resize.book", delay_fn(function () {
            book.recalc();
            book.jmp();
            cssCenter1Line();
        }, time_resize));
// MOUSE WHEEL
        $("#book").on("wheel.book", function(e) {
            let del = e.originalEvent.deltaY;

	        // (del > 0 ? false : true)
            book.scroll((del <= 0), 1, Math.abs(del));

            return false;
        });

        $("#slider").on("wheel.book", function(e) {
            let del = e.originalEvent.deltaY;

	        // (del > 0 ? false : true)
            book.scroll((del <= 0));

            return false;
        });
// KEYBOARD
	    $(document).on("keydown.bookScroll", function(e) {
		    if (e.keyCode == BUTTON_ARROW_UP || e.keyCode == BUTTON_ARROW_DOWN)
		    {
			    // (e.keyCode == BUTTON_ARROW_DOWN ? false : true)
			    book.scroll((e.keyCode != BUTTON_ARROW_DOWN), EPSILON);
		    }
		    if (e.keyCode == BUTTON_ARROW_LEFT || e.keyCode == BUTTON_ARROW_RIGHT)
		    {
			    // (e.keyCode == BUTTON_ARROW_RIGHT ? false : true)
			    book.scroll((e.keyCode != BUTTON_ARROW_RIGHT), 1);
		    }

	    })
    });


});


module.exports.__DEBUG__ = __DEBUG__;