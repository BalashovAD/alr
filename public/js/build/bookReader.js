var __ =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {"use strict";
	
	var _book = __webpack_require__(3);
	
	var _login = __webpack_require__(8);
	
	var file = void 0;
	//let JsFile;
	
	var debug = __webpack_require__(9)('app:init');
	
	
	localStorage.debug = 'app:book';
	
	// GLOBAL VARIABLE
	//let __IS_LOGIN__ = false;
	//let __NAME__ = '0';
	
	// CONSTS
	var time_resize = 1000;
	var BUTTON_ARROW_UP = 38;
	var BUTTON_ARROW_DOWN = 40;
	var BUTTON_ARROW_RIGHT = 39;
	var BUTTON_ARROW_LEFT = 37;
	var EPSILON = 0.001;
	
	var __loading = function __loading() {
	    var cnt = 1;
	    var el = $('#loading');
	
	    this.play = function () {
	        ++cnt;
	
	        if (cnt > 0) {
	            el.show();
	        }
	    };
	
	    this.stop = function () {
	        --cnt;
	
	        if (cnt <= 0) {
	            cnt = 0;
	
	            el.hide();
	        }
	    };
	
	    return this;
	};
	
	var __ajaxSettings = function __ajaxSettings(book) {
	    //noinspection NodeModulesDependencies,ES6ModulesDependencies
	    $.ajax({
	        statusCode: {},
	        beforeSend: function beforeSend() {
	            book.__int__loading.play();
	        },
	        complete: function complete() {
	            book.__int__loading.stop();
	        }
	    });
	};
	
	var __DEBUG__ = {};
	
	var delay_fn = function delay_fn(cb, cd) {
	    var timer = void 0;
	
	    return function (e) {
	        if (timer) {
	            clearTimeout(timer);
	        }
	
	        timer = setTimeout(function () {
	            cb(e);
	        }, cd);
	    };
	};
	
	var __msg = new function () {
	    var num_of_errors = 0;
	    var el = $('#msg');
	
	    el.click(function () {
	        el.hide();
	    });
	
	    this.error = function (mm) {
	        num_of_errors++;
	        console.log('Error #' + num_of_errors + ' : ' + mm);
	
	        // screen
	        el.html(mm);
	        el.removeClass('msg');
	        el.addClass('error');
	
	        el.show();
	    };
	
	    this.msg = function (mm) {
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
	
	function __initPlayer(player) {
	    var container = $('#player');
	    var btnPlay = $('#btnPlay', container);
	    var btnStop = $('#btnStop', container);
	    var containerForSlider = $('#containerForSliderDelay', container);
	    var prev = void 0;
	
	    function init(player, MAX_DELAY, SHIFT_DELAY, DEFAULT_DELAY) {
	        var buttons = $(document.createDocumentFragment());
	
	        for (var valueOfDelay = -MAX_DELAY; valueOfDelay <= MAX_DELAY; valueOfDelay += SHIFT_DELAY) {
	            var el = $('<div>').addClass('value-of-delay').attr('val', valueOfDelay);
	
	            if (Math.abs(valueOfDelay - DEFAULT_DELAY) <= SHIFT_DELAY / 2) {
	                el.addClass('select');
	            }
	
	            if (Math.abs(Math.ceil(valueOfDelay) - valueOfDelay) < SHIFT_DELAY / 2) {
	                el.addClass('notch');
	            }
	
	            buttons.append(el);
	        }
	
	        containerForSlider.append(buttons);
	
	        prev = $('.value-of-delay.select', container);
	
	        $('.value-of-delay').click(function () {
	            var val = $(this).attr('val');
	
	            if (val != prev.attr('val')) {
	                player.setDelay(val);
	
	                prev.removeClass('select');
	                $(this).addClass('select');
	
	                prev = $(this);
	            }
	        });
	
	        btnPlay.click(function () {
	            player.play();
	        });
	
	        btnStop.click(function () {
	            player.stop();
	        });
	    }
	
	    return init;
	}
	
	function __initBookmark(book) {
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
	
	        book.selectEl(id, 'user-sel');
	    }
	
	    choose.click(function () {
	        // SELECT POS
	        $('#book').one('click.pos', bookCb);
	    });
	
	    submit.click(function () {
	        if (pos.val().length != 0) {
	            book.addBookmark(pos.val(), title.val(), text.val());
	
	            book.selectEl(-1, 'user-sel');
	
	            pos.val('');title.val('');text.val('');
	        } else {
	            error('Choose position');
	        }
	    });
	
	    reload.click(function () {
	        book.reloadBookmark().then(function () {
	            msg('Bookmark was reload');
	        }, error);
	    });
	
	    var deleteBookmark = function deleteBookmark(id) {
	        $('.bookmark[data-id=' + id + ']').remove();
	    };
	
	    var reset = function reset() {
	        $('.bookmark .btn-bookmark-goto').click(function () {
	            var pos = $(this).closest('.bookmark').data('pos');
	
	            if (!isNaN(pos)) {
	                book.jmp(pos);
	
	                book.selectEl(pos, 'jump');
	            }
	        });
	
	        $('.bookmark .btn-bookmark-edit').click(function () {
	            if ($(this).data('disable') != 'true') {
	                var el = $(this).closest('.bookmark');
	
	                $(el).find('div.contenteditable').attr('contenteditable', 'true');
	            }
	        });
	
	        $('.bookmark .btn-bookmark-save').click(function () {
	            var el = $(this).closest('.bookmark');
	
	            $(el).find('div.contenteditable').attr('contenteditable', 'false');
	
	            book.editBookmark(el.data('id'), $(el).find('.bookmark-pos').html(), $(el).find('.bookmark-title').html(), $(el).find('.bookmark-text').html()).then(function () {
	                msg('Bookmark was edited');
	            }, error);
	        });
	
	        $('.bookmark .btn-bookmark-delete').click(function () {
	            var el = $(this).closest('.bookmark');
	
	            var id = $(el).data('id');
	
	            book.deleteBookmark(id).then(function (t) {
	                deleteBookmark(t);
	            }, error);
	        });
	    };
	
	    return {
	        "reset": reset,
	        "deleteBookmark": deleteBookmark
	    };
	}
	
	var clock = new function () {
	    var dataFormat = function dataFormat(time) {
	        return ("0" + time.getHours()).slice(-2) + ":" + ("0" + time.getMinutes()).slice(-2);
	    };
	    var tm = $('#time');
	    var cnt = void 0;
	
	    var tmF = function tmF() {
	        tm.text(dataFormat(new Date()));
	
	        cnt = setTimeout(tmF, 1000 * 60);
	    };
	
	    this.stop = function () {
	        clearTimeout(cnt);
	    };
	
	    this.play = function () {
	        var time = new Date();
	        tm.text(dataFormat(new Date()));
	        cnt = setTimeout(tmF, 1000 * 60 + 1000 * (60 - ("0" + time.getSeconds()).slice(-2)));
	    };
	
	    return this;
	}();
	
	function __controllerLeft(book) {
	    var now = 'files';
	
	    function controllerLeft(id) {
	
	        if (now == id || id == '') {
	            // do nothing
	        } else {
	            now = id;
	
	            if (id[0] == '#') {
	                id = id.substring(1);
	
	                book.save(true);
	
	                document.location.assign(id);
	
	                return true;
	            }
	
	            $('.left').hide();
	            var elms = $('#' + id);
	
	            if (elms && elms.length != 0) {
	                elms.eq(0).show();
	            } else {
	                $('#file').show();
	            }
	        }
	    }
	
	    return controllerLeft;
	}
	
	$(document).ready(function () {
	    //
	    new _login.__login();
	
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
	
	    var book = new _book.__book('book', {
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
	
	    book.ready(function (book) {
	        // ONLINE/OFFLINE MODE
	        $('#onlineMode').on('change', function () {
	            var context = $(this).closest('.switch-wrapper');
	            var now = context.data('text');
	
	            if (now == 'online') {
	                context.addClass('offline-mode');
	                context.data('text', 'offline');
	            } else {
	                context.removeClass('offline-mode');
	                context.data('text', 'online');
	            }
	
	            book.swapOnlineMode();
	        });
	        // NIGHT/DAY MODE
	        $('#nightMode').on('change', function () {
	            var context = $(this).closest('.switch-wrapper');
	            var now = context.data('text');
	
	            if (now == 'day') {
	                context.addClass('night-mode');
	                context.data('text', 'night');
	            } else {
	                context.removeClass('night-mode');
	                context.data('text', 'day');
	            }
	
	            book.swapNightMode();
	        });
	
	        // MENU BUTTONS
	        $('.item-menu').click(function () {
	            var id = $(this).data('id');
	
	            book.__int__controllerLeft(id);
	        });
	        // SLIDER
	        $('#slider').click(function (e) {
	            if ($(e.target).attr('id') == 'slider') {
	                book.scrollSlider(e.clientY - $('#slider').offset().top);
	            } else {
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
	            if (book.jmpUndo() == false) {
	                msg('Can not jump');
	            }
	        });
	
	        $('#btnNavRedo').click(function () {
	            if (book.jmpRedo() == false) {
	                msg('Can not jump');
	            }
	        });
	
	        $('#save').click(function () {
	            book.save();
	        });
	
	        // RESIZE
	        $(window).on('resize.book', delay_fn(function () {
	            book.recalc();
	            book.jmp();
	            cssCenter1Line();
	        }, time_resize));
	        // MOUSE WHEEL
	        $('#book').on('wheel.book', function (e) {
	            var del = e.originalEvent.deltaY;
	
	            // (del > 0 ? false : true)
	            book.scroll(del <= 0, 1, Math.abs(del));
	
	            return false;
	        });
	
	        $('#slider').on('wheel.book', function (e) {
	            var del = e.originalEvent.deltaY;
	
	            // (del > 0 ? false : true)
	            book.scroll(del <= 0);
	
	            return false;
	        });
	        // KEYBOARD
	        $(document).on('keydown.bookScroll', function (e) {
	            if (e.keyCode == BUTTON_ARROW_UP || e.keyCode == BUTTON_ARROW_DOWN) {
	                // (e.keyCode == BUTTON_ARROW_DOWN ? false : true)
	                book.scroll(e.keyCode != BUTTON_ARROW_DOWN, EPSILON);
	            }
	            if (e.keyCode == BUTTON_ARROW_LEFT || e.keyCode == BUTTON_ARROW_RIGHT) {
	                // (e.keyCode == BUTTON_ARROW_RIGHT ? false : true)
	                book.scroll(e.keyCode != BUTTON_ARROW_RIGHT, 1);
	            }
	        });
	    });
	});
	
	module.exports.__DEBUG__ = __DEBUG__;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! jQuery v3.1.1 | (c) jQuery Foundation | jquery.org/license */
	!function(a,b){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){"use strict";var c=[],d=a.document,e=Object.getPrototypeOf,f=c.slice,g=c.concat,h=c.push,i=c.indexOf,j={},k=j.toString,l=j.hasOwnProperty,m=l.toString,n=m.call(Object),o={};function p(a,b){b=b||d;var c=b.createElement("script");c.text=a,b.head.appendChild(c).parentNode.removeChild(c)}var q="3.1.1",r=function(a,b){return new r.fn.init(a,b)},s=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,t=/^-ms-/,u=/-([a-z])/g,v=function(a,b){return b.toUpperCase()};r.fn=r.prototype={jquery:q,constructor:r,length:0,toArray:function(){return f.call(this)},get:function(a){return null==a?f.call(this):a<0?this[a+this.length]:this[a]},pushStack:function(a){var b=r.merge(this.constructor(),a);return b.prevObject=this,b},each:function(a){return r.each(this,a)},map:function(a){return this.pushStack(r.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(f.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(a<0?b:0);return this.pushStack(c>=0&&c<b?[this[c]]:[])},end:function(){return this.prevObject||this.constructor()},push:h,sort:c.sort,splice:c.splice},r.extend=r.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||r.isFunction(g)||(g={}),h===i&&(g=this,h--);h<i;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(r.isPlainObject(d)||(e=r.isArray(d)))?(e?(e=!1,f=c&&r.isArray(c)?c:[]):f=c&&r.isPlainObject(c)?c:{},g[b]=r.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},r.extend({expando:"jQuery"+(q+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===r.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){var b=r.type(a);return("number"===b||"string"===b)&&!isNaN(a-parseFloat(a))},isPlainObject:function(a){var b,c;return!(!a||"[object Object]"!==k.call(a))&&(!(b=e(a))||(c=l.call(b,"constructor")&&b.constructor,"function"==typeof c&&m.call(c)===n))},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?j[k.call(a)]||"object":typeof a},globalEval:function(a){p(a)},camelCase:function(a){return a.replace(t,"ms-").replace(u,v)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b){var c,d=0;if(w(a)){for(c=a.length;d<c;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(s,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(w(Object(a))?r.merge(c,"string"==typeof a?[a]:a):h.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:i.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;d<c;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;f<g;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,e,f=0,h=[];if(w(a))for(d=a.length;f<d;f++)e=b(a[f],f,c),null!=e&&h.push(e);else for(f in a)e=b(a[f],f,c),null!=e&&h.push(e);return g.apply([],h)},guid:1,proxy:function(a,b){var c,d,e;if("string"==typeof b&&(c=a[b],b=a,a=c),r.isFunction(a))return d=f.call(arguments,2),e=function(){return a.apply(b||this,d.concat(f.call(arguments)))},e.guid=a.guid=a.guid||r.guid++,e},now:Date.now,support:o}),"function"==typeof Symbol&&(r.fn[Symbol.iterator]=c[Symbol.iterator]),r.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(a,b){j["[object "+b+"]"]=b.toLowerCase()});function w(a){var b=!!a&&"length"in a&&a.length,c=r.type(a);return"function"!==c&&!r.isWindow(a)&&("array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a)}var x=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ha(),z=ha(),A=ha(),B=function(a,b){return a===b&&(l=!0),0},C={}.hasOwnProperty,D=[],E=D.pop,F=D.push,G=D.push,H=D.slice,I=function(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return c;return-1},J="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",K="[\\x20\\t\\r\\n\\f]",L="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",M="\\["+K+"*("+L+")(?:"+K+"*([*^$|!~]?=)"+K+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+L+"))|)"+K+"*\\]",N=":("+L+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+M+")*)|.*)\\)|)",O=new RegExp(K+"+","g"),P=new RegExp("^"+K+"+|((?:^|[^\\\\])(?:\\\\.)*)"+K+"+$","g"),Q=new RegExp("^"+K+"*,"+K+"*"),R=new RegExp("^"+K+"*([>+~]|"+K+")"+K+"*"),S=new RegExp("="+K+"*([^\\]'\"]*?)"+K+"*\\]","g"),T=new RegExp(N),U=new RegExp("^"+L+"$"),V={ID:new RegExp("^#("+L+")"),CLASS:new RegExp("^\\.("+L+")"),TAG:new RegExp("^("+L+"|[*])"),ATTR:new RegExp("^"+M),PSEUDO:new RegExp("^"+N),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+K+"*(even|odd|(([+-]|)(\\d*)n|)"+K+"*(?:([+-]|)"+K+"*(\\d+)|))"+K+"*\\)|)","i"),bool:new RegExp("^(?:"+J+")$","i"),needsContext:new RegExp("^"+K+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+K+"*((?:-\\d)?\\d*)"+K+"*\\)|)(?=[^-]|$)","i")},W=/^(?:input|select|textarea|button)$/i,X=/^h\d$/i,Y=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,$=/[+~]/,_=new RegExp("\\\\([\\da-f]{1,6}"+K+"?|("+K+")|.)","ig"),aa=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:d<0?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},ba=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ca=function(a,b){return b?"\0"===a?"\ufffd":a.slice(0,-1)+"\\"+a.charCodeAt(a.length-1).toString(16)+" ":"\\"+a},da=function(){m()},ea=ta(function(a){return a.disabled===!0&&("form"in a||"label"in a)},{dir:"parentNode",next:"legend"});try{G.apply(D=H.call(v.childNodes),v.childNodes),D[v.childNodes.length].nodeType}catch(fa){G={apply:D.length?function(a,b){F.apply(a,H.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function ga(a,b,d,e){var f,h,j,k,l,o,r,s=b&&b.ownerDocument,w=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==w&&9!==w&&11!==w)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==w&&(l=Z.exec(a)))if(f=l[1]){if(9===w){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(s&&(j=s.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(l[2])return G.apply(d,b.getElementsByTagName(a)),d;if((f=l[3])&&c.getElementsByClassName&&b.getElementsByClassName)return G.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==w)s=b,r=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(ba,ca):b.setAttribute("id",k=u),o=g(a),h=o.length;while(h--)o[h]="#"+k+" "+sa(o[h]);r=o.join(","),s=$.test(a)&&qa(b.parentNode)||b}if(r)try{return G.apply(d,s.querySelectorAll(r)),d}catch(x){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(P,"$1"),b,d,e)}function ha(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ia(a){return a[u]=!0,a}function ja(a){var b=n.createElement("fieldset");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ka(a,b){var c=a.split("|"),e=c.length;while(e--)d.attrHandle[c[e]]=b}function la(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&a.sourceIndex-b.sourceIndex;if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function na(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function oa(a){return function(b){return"form"in b?b.parentNode&&b.disabled===!1?"label"in b?"label"in b.parentNode?b.parentNode.disabled===a:b.disabled===a:b.isDisabled===a||b.isDisabled!==!a&&ea(b)===a:b.disabled===a:"label"in b&&b.disabled===a}}function pa(a){return ia(function(b){return b=+b,ia(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function qa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=ga.support={},f=ga.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return!!b&&"HTML"!==b.nodeName},m=ga.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),v!==n&&(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ja(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ja(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Y.test(n.getElementsByClassName),c.getById=ja(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){return a.getAttribute("id")===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}}):(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c,d,e,f=b.getElementById(a);if(f){if(c=f.getAttributeNode("id"),c&&c.value===a)return[f];e=b.getElementsByName(a),d=0;while(f=e[d++])if(c=f.getAttributeNode("id"),c&&c.value===a)return[f]}return[]}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){if("undefined"!=typeof b.getElementsByClassName&&p)return b.getElementsByClassName(a)},r=[],q=[],(c.qsa=Y.test(n.querySelectorAll))&&(ja(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+K+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+K+"*(?:value|"+J+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ja(function(a){a.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+K+"*[*^$|!~]?="),2!==a.querySelectorAll(":enabled").length&&q.push(":enabled",":disabled"),o.appendChild(a).disabled=!0,2!==a.querySelectorAll(":disabled").length&&q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Y.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ja(function(a){c.disconnectedMatch=s.call(a,"*"),s.call(a,"[s!='']:x"),r.push("!=",N)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Y.test(o.compareDocumentPosition),t=b||Y.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?I(k,a)-I(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?I(k,a)-I(k,b):0;if(e===f)return la(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?la(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},ga.matches=function(a,b){return ga(a,null,null,b)},ga.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(S,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return ga(b,n,null,[a]).length>0},ga.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},ga.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&C.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},ga.escape=function(a){return(a+"").replace(ba,ca)},ga.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},ga.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=ga.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=ga.selectors={cacheLength:50,createPseudo:ia,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(_,aa),a[3]=(a[3]||a[4]||a[5]||"").replace(_,aa),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||ga.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&ga.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return V.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&T.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(_,aa).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+K+")"+a+"("+K+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=ga.attr(d,a);return null==e?"!="===b:!b||(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(O," ")+" ").indexOf(c)>-1:"|="===b&&(e===c||e.slice(0,c.length+1)===c+"-"))}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||ga.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ia(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=I(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ia(function(a){var b=[],c=[],d=h(a.replace(P,"$1"));return d[u]?ia(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ia(function(a){return function(b){return ga(a,b).length>0}}),contains:ia(function(a){return a=a.replace(_,aa),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ia(function(a){return U.test(a||"")||ga.error("unsupported lang: "+a),a=a.replace(_,aa).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:oa(!1),disabled:oa(!0),checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return X.test(a.nodeName)},input:function(a){return W.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:pa(function(){return[0]}),last:pa(function(a,b){return[b-1]}),eq:pa(function(a,b,c){return[c<0?c+b:c]}),even:pa(function(a,b){for(var c=0;c<b;c+=2)a.push(c);return a}),odd:pa(function(a,b){for(var c=1;c<b;c+=2)a.push(c);return a}),lt:pa(function(a,b,c){for(var d=c<0?c+b:c;--d>=0;)a.push(d);return a}),gt:pa(function(a,b,c){for(var d=c<0?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=ma(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=na(b);function ra(){}ra.prototype=d.filters=d.pseudos,d.setFilters=new ra,g=ga.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){c&&!(e=Q.exec(h))||(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=R.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(P," ")}),h=h.slice(c.length));for(g in d.filter)!(e=V[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?ga.error(a):z(a,i).slice(0)};function sa(a){for(var b=0,c=a.length,d="";b<c;b++)d+=a[b].value;return d}function ta(a,b,c){var d=b.dir,e=b.next,f=e||d,g=c&&"parentNode"===f,h=x++;return b.first?function(b,c,e){while(b=b[d])if(1===b.nodeType||g)return a(b,c,e);return!1}:function(b,c,i){var j,k,l,m=[w,h];if(i){while(b=b[d])if((1===b.nodeType||g)&&a(b,c,i))return!0}else while(b=b[d])if(1===b.nodeType||g)if(l=b[u]||(b[u]={}),k=l[b.uniqueID]||(l[b.uniqueID]={}),e&&e===b.nodeName.toLowerCase())b=b[d]||b;else{if((j=k[f])&&j[0]===w&&j[1]===h)return m[2]=j[2];if(k[f]=m,m[2]=a(b,c,i))return!0}return!1}}function ua(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function va(a,b,c){for(var d=0,e=b.length;d<e;d++)ga(a,b[d],c);return c}function wa(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;h<i;h++)(f=a[h])&&(c&&!c(f,d,e)||(g.push(f),j&&b.push(h)));return g}function xa(a,b,c,d,e,f){return d&&!d[u]&&(d=xa(d)),e&&!e[u]&&(e=xa(e,f)),ia(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||va(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:wa(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=wa(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?I(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=wa(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):G.apply(g,r)})}function ya(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ta(function(a){return a===b},h,!0),l=ta(function(a){return I(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];i<f;i++)if(c=d.relative[a[i].type])m=[ta(ua(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;e<f;e++)if(d.relative[a[e].type])break;return xa(i>1&&ua(m),i>1&&sa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(P,"$1"),c,i<e&&ya(a.slice(i,e)),e<f&&ya(a=a.slice(e)),e<f&&sa(a))}m.push(c)}return ua(m)}function za(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=E.call(i));u=wa(u)}G.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&ga.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ia(f):f}return h=ga.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=ya(b[c]),f[u]?d.push(f):e.push(f);f=A(a,za(e,d)),f.selector=a}return f},i=ga.select=function(a,b,c,e){var f,i,j,k,l,m="function"==typeof a&&a,n=!e&&g(a=m.selector||a);if(c=c||[],1===n.length){if(i=n[0]=n[0].slice(0),i.length>2&&"ID"===(j=i[0]).type&&9===b.nodeType&&p&&d.relative[i[1].type]){if(b=(d.find.ID(j.matches[0].replace(_,aa),b)||[])[0],!b)return c;m&&(b=b.parentNode),a=a.slice(i.shift().value.length)}f=V.needsContext.test(a)?0:i.length;while(f--){if(j=i[f],d.relative[k=j.type])break;if((l=d.find[k])&&(e=l(j.matches[0].replace(_,aa),$.test(i[0].type)&&qa(b.parentNode)||b))){if(i.splice(f,1),a=e.length&&sa(i),!a)return G.apply(c,e),c;break}}}return(m||h(a,n))(e,b,!p,c,!b||$.test(a)&&qa(b.parentNode)||b),c},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ja(function(a){return 1&a.compareDocumentPosition(n.createElement("fieldset"))}),ja(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ka("type|href|height|width",function(a,b,c){if(!c)return a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ja(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ka("value",function(a,b,c){if(!c&&"input"===a.nodeName.toLowerCase())return a.defaultValue}),ja(function(a){return null==a.getAttribute("disabled")})||ka(J,function(a,b,c){var d;if(!c)return a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),ga}(a);r.find=x,r.expr=x.selectors,r.expr[":"]=r.expr.pseudos,r.uniqueSort=r.unique=x.uniqueSort,r.text=x.getText,r.isXMLDoc=x.isXML,r.contains=x.contains,r.escapeSelector=x.escape;var y=function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&r(a).is(c))break;d.push(a)}return d},z=function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c},A=r.expr.match.needsContext,B=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,C=/^.[^:#\[\.,]*$/;function D(a,b,c){return r.isFunction(b)?r.grep(a,function(a,d){return!!b.call(a,d,a)!==c}):b.nodeType?r.grep(a,function(a){return a===b!==c}):"string"!=typeof b?r.grep(a,function(a){return i.call(b,a)>-1!==c}):C.test(b)?r.filter(b,a,c):(b=r.filter(b,a),r.grep(a,function(a){return i.call(b,a)>-1!==c&&1===a.nodeType}))}r.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?r.find.matchesSelector(d,a)?[d]:[]:r.find.matches(a,r.grep(b,function(a){return 1===a.nodeType}))},r.fn.extend({find:function(a){var b,c,d=this.length,e=this;if("string"!=typeof a)return this.pushStack(r(a).filter(function(){for(b=0;b<d;b++)if(r.contains(e[b],this))return!0}));for(c=this.pushStack([]),b=0;b<d;b++)r.find(a,e[b],c);return d>1?r.uniqueSort(c):c},filter:function(a){return this.pushStack(D(this,a||[],!1))},not:function(a){return this.pushStack(D(this,a||[],!0))},is:function(a){return!!D(this,"string"==typeof a&&A.test(a)?r(a):a||[],!1).length}});var E,F=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,G=r.fn.init=function(a,b,c){var e,f;if(!a)return this;if(c=c||E,"string"==typeof a){if(e="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:F.exec(a),!e||!e[1]&&b)return!b||b.jquery?(b||c).find(a):this.constructor(b).find(a);if(e[1]){if(b=b instanceof r?b[0]:b,r.merge(this,r.parseHTML(e[1],b&&b.nodeType?b.ownerDocument||b:d,!0)),B.test(e[1])&&r.isPlainObject(b))for(e in b)r.isFunction(this[e])?this[e](b[e]):this.attr(e,b[e]);return this}return f=d.getElementById(e[2]),f&&(this[0]=f,this.length=1),this}return a.nodeType?(this[0]=a,this.length=1,this):r.isFunction(a)?void 0!==c.ready?c.ready(a):a(r):r.makeArray(a,this)};G.prototype=r.fn,E=r(d);var H=/^(?:parents|prev(?:Until|All))/,I={children:!0,contents:!0,next:!0,prev:!0};r.fn.extend({has:function(a){var b=r(a,this),c=b.length;return this.filter(function(){for(var a=0;a<c;a++)if(r.contains(this,b[a]))return!0})},closest:function(a,b){var c,d=0,e=this.length,f=[],g="string"!=typeof a&&r(a);if(!A.test(a))for(;d<e;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&r.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?r.uniqueSort(f):f)},index:function(a){return a?"string"==typeof a?i.call(r(a),this[0]):i.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(r.uniqueSort(r.merge(this.get(),r(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function J(a,b){while((a=a[b])&&1!==a.nodeType);return a}r.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return y(a,"parentNode")},parentsUntil:function(a,b,c){return y(a,"parentNode",c)},next:function(a){return J(a,"nextSibling")},prev:function(a){return J(a,"previousSibling")},nextAll:function(a){return y(a,"nextSibling")},prevAll:function(a){return y(a,"previousSibling")},nextUntil:function(a,b,c){return y(a,"nextSibling",c)},prevUntil:function(a,b,c){return y(a,"previousSibling",c)},siblings:function(a){return z((a.parentNode||{}).firstChild,a)},children:function(a){return z(a.firstChild)},contents:function(a){return a.contentDocument||r.merge([],a.childNodes)}},function(a,b){r.fn[a]=function(c,d){var e=r.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=r.filter(d,e)),this.length>1&&(I[a]||r.uniqueSort(e),H.test(a)&&e.reverse()),this.pushStack(e)}});var K=/[^\x20\t\r\n\f]+/g;function L(a){var b={};return r.each(a.match(K)||[],function(a,c){b[c]=!0}),b}r.Callbacks=function(a){a="string"==typeof a?L(a):r.extend({},a);var b,c,d,e,f=[],g=[],h=-1,i=function(){for(e=a.once,d=b=!0;g.length;h=-1){c=g.shift();while(++h<f.length)f[h].apply(c[0],c[1])===!1&&a.stopOnFalse&&(h=f.length,c=!1)}a.memory||(c=!1),b=!1,e&&(f=c?[]:"")},j={add:function(){return f&&(c&&!b&&(h=f.length-1,g.push(c)),function d(b){r.each(b,function(b,c){r.isFunction(c)?a.unique&&j.has(c)||f.push(c):c&&c.length&&"string"!==r.type(c)&&d(c)})}(arguments),c&&!b&&i()),this},remove:function(){return r.each(arguments,function(a,b){var c;while((c=r.inArray(b,f,c))>-1)f.splice(c,1),c<=h&&h--}),this},has:function(a){return a?r.inArray(a,f)>-1:f.length>0},empty:function(){return f&&(f=[]),this},disable:function(){return e=g=[],f=c="",this},disabled:function(){return!f},lock:function(){return e=g=[],c||b||(f=c=""),this},locked:function(){return!!e},fireWith:function(a,c){return e||(c=c||[],c=[a,c.slice?c.slice():c],g.push(c),b||i()),this},fire:function(){return j.fireWith(this,arguments),this},fired:function(){return!!d}};return j};function M(a){return a}function N(a){throw a}function O(a,b,c){var d;try{a&&r.isFunction(d=a.promise)?d.call(a).done(b).fail(c):a&&r.isFunction(d=a.then)?d.call(a,b,c):b.call(void 0,a)}catch(a){c.call(void 0,a)}}r.extend({Deferred:function(b){var c=[["notify","progress",r.Callbacks("memory"),r.Callbacks("memory"),2],["resolve","done",r.Callbacks("once memory"),r.Callbacks("once memory"),0,"resolved"],["reject","fail",r.Callbacks("once memory"),r.Callbacks("once memory"),1,"rejected"]],d="pending",e={state:function(){return d},always:function(){return f.done(arguments).fail(arguments),this},"catch":function(a){return e.then(null,a)},pipe:function(){var a=arguments;return r.Deferred(function(b){r.each(c,function(c,d){var e=r.isFunction(a[d[4]])&&a[d[4]];f[d[1]](function(){var a=e&&e.apply(this,arguments);a&&r.isFunction(a.promise)?a.promise().progress(b.notify).done(b.resolve).fail(b.reject):b[d[0]+"With"](this,e?[a]:arguments)})}),a=null}).promise()},then:function(b,d,e){var f=0;function g(b,c,d,e){return function(){var h=this,i=arguments,j=function(){var a,j;if(!(b<f)){if(a=d.apply(h,i),a===c.promise())throw new TypeError("Thenable self-resolution");j=a&&("object"==typeof a||"function"==typeof a)&&a.then,r.isFunction(j)?e?j.call(a,g(f,c,M,e),g(f,c,N,e)):(f++,j.call(a,g(f,c,M,e),g(f,c,N,e),g(f,c,M,c.notifyWith))):(d!==M&&(h=void 0,i=[a]),(e||c.resolveWith)(h,i))}},k=e?j:function(){try{j()}catch(a){r.Deferred.exceptionHook&&r.Deferred.exceptionHook(a,k.stackTrace),b+1>=f&&(d!==N&&(h=void 0,i=[a]),c.rejectWith(h,i))}};b?k():(r.Deferred.getStackHook&&(k.stackTrace=r.Deferred.getStackHook()),a.setTimeout(k))}}return r.Deferred(function(a){c[0][3].add(g(0,a,r.isFunction(e)?e:M,a.notifyWith)),c[1][3].add(g(0,a,r.isFunction(b)?b:M)),c[2][3].add(g(0,a,r.isFunction(d)?d:N))}).promise()},promise:function(a){return null!=a?r.extend(a,e):e}},f={};return r.each(c,function(a,b){var g=b[2],h=b[5];e[b[1]]=g.add,h&&g.add(function(){d=h},c[3-a][2].disable,c[0][2].lock),g.add(b[3].fire),f[b[0]]=function(){return f[b[0]+"With"](this===f?void 0:this,arguments),this},f[b[0]+"With"]=g.fireWith}),e.promise(f),b&&b.call(f,f),f},when:function(a){var b=arguments.length,c=b,d=Array(c),e=f.call(arguments),g=r.Deferred(),h=function(a){return function(c){d[a]=this,e[a]=arguments.length>1?f.call(arguments):c,--b||g.resolveWith(d,e)}};if(b<=1&&(O(a,g.done(h(c)).resolve,g.reject),"pending"===g.state()||r.isFunction(e[c]&&e[c].then)))return g.then();while(c--)O(e[c],h(c),g.reject);return g.promise()}});var P=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;r.Deferred.exceptionHook=function(b,c){a.console&&a.console.warn&&b&&P.test(b.name)&&a.console.warn("jQuery.Deferred exception: "+b.message,b.stack,c)},r.readyException=function(b){a.setTimeout(function(){throw b})};var Q=r.Deferred();r.fn.ready=function(a){return Q.then(a)["catch"](function(a){r.readyException(a)}),this},r.extend({isReady:!1,readyWait:1,holdReady:function(a){a?r.readyWait++:r.ready(!0)},ready:function(a){(a===!0?--r.readyWait:r.isReady)||(r.isReady=!0,a!==!0&&--r.readyWait>0||Q.resolveWith(d,[r]))}}),r.ready.then=Q.then;function R(){d.removeEventListener("DOMContentLoaded",R),
	a.removeEventListener("load",R),r.ready()}"complete"===d.readyState||"loading"!==d.readyState&&!d.documentElement.doScroll?a.setTimeout(r.ready):(d.addEventListener("DOMContentLoaded",R),a.addEventListener("load",R));var S=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===r.type(c)){e=!0;for(h in c)S(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,r.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(r(a),c)})),b))for(;h<i;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},T=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function U(){this.expando=r.expando+U.uid++}U.uid=1,U.prototype={cache:function(a){var b=a[this.expando];return b||(b={},T(a)&&(a.nodeType?a[this.expando]=b:Object.defineProperty(a,this.expando,{value:b,configurable:!0}))),b},set:function(a,b,c){var d,e=this.cache(a);if("string"==typeof b)e[r.camelCase(b)]=c;else for(d in b)e[r.camelCase(d)]=b[d];return e},get:function(a,b){return void 0===b?this.cache(a):a[this.expando]&&a[this.expando][r.camelCase(b)]},access:function(a,b,c){return void 0===b||b&&"string"==typeof b&&void 0===c?this.get(a,b):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d=a[this.expando];if(void 0!==d){if(void 0!==b){r.isArray(b)?b=b.map(r.camelCase):(b=r.camelCase(b),b=b in d?[b]:b.match(K)||[]),c=b.length;while(c--)delete d[b[c]]}(void 0===b||r.isEmptyObject(d))&&(a.nodeType?a[this.expando]=void 0:delete a[this.expando])}},hasData:function(a){var b=a[this.expando];return void 0!==b&&!r.isEmptyObject(b)}};var V=new U,W=new U,X=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,Y=/[A-Z]/g;function Z(a){return"true"===a||"false"!==a&&("null"===a?null:a===+a+""?+a:X.test(a)?JSON.parse(a):a)}function $(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(Y,"-$&").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c=Z(c)}catch(e){}W.set(a,b,c)}else c=void 0;return c}r.extend({hasData:function(a){return W.hasData(a)||V.hasData(a)},data:function(a,b,c){return W.access(a,b,c)},removeData:function(a,b){W.remove(a,b)},_data:function(a,b,c){return V.access(a,b,c)},_removeData:function(a,b){V.remove(a,b)}}),r.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=W.get(f),1===f.nodeType&&!V.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=r.camelCase(d.slice(5)),$(f,d,e[d])));V.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){W.set(this,a)}):S(this,function(b){var c;if(f&&void 0===b){if(c=W.get(f,a),void 0!==c)return c;if(c=$(f,a),void 0!==c)return c}else this.each(function(){W.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){W.remove(this,a)})}}),r.extend({queue:function(a,b,c){var d;if(a)return b=(b||"fx")+"queue",d=V.get(a,b),c&&(!d||r.isArray(c)?d=V.access(a,b,r.makeArray(c)):d.push(c)),d||[]},dequeue:function(a,b){b=b||"fx";var c=r.queue(a,b),d=c.length,e=c.shift(),f=r._queueHooks(a,b),g=function(){r.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return V.get(a,c)||V.access(a,c,{empty:r.Callbacks("once memory").add(function(){V.remove(a,[b+"queue",c])})})}}),r.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?r.queue(this[0],a):void 0===b?this:this.each(function(){var c=r.queue(this,a,b);r._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&r.dequeue(this,a)})},dequeue:function(a){return this.each(function(){r.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=r.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=V.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var _=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,aa=new RegExp("^(?:([+-])=|)("+_+")([a-z%]*)$","i"),ba=["Top","Right","Bottom","Left"],ca=function(a,b){return a=b||a,"none"===a.style.display||""===a.style.display&&r.contains(a.ownerDocument,a)&&"none"===r.css(a,"display")},da=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};function ea(a,b,c,d){var e,f=1,g=20,h=d?function(){return d.cur()}:function(){return r.css(a,b,"")},i=h(),j=c&&c[3]||(r.cssNumber[b]?"":"px"),k=(r.cssNumber[b]||"px"!==j&&+i)&&aa.exec(r.css(a,b));if(k&&k[3]!==j){j=j||k[3],c=c||[],k=+i||1;do f=f||".5",k/=f,r.style(a,b,k+j);while(f!==(f=h()/i)&&1!==f&&--g)}return c&&(k=+k||+i||0,e=c[1]?k+(c[1]+1)*c[2]:+c[2],d&&(d.unit=j,d.start=k,d.end=e)),e}var fa={};function ga(a){var b,c=a.ownerDocument,d=a.nodeName,e=fa[d];return e?e:(b=c.body.appendChild(c.createElement(d)),e=r.css(b,"display"),b.parentNode.removeChild(b),"none"===e&&(e="block"),fa[d]=e,e)}function ha(a,b){for(var c,d,e=[],f=0,g=a.length;f<g;f++)d=a[f],d.style&&(c=d.style.display,b?("none"===c&&(e[f]=V.get(d,"display")||null,e[f]||(d.style.display="")),""===d.style.display&&ca(d)&&(e[f]=ga(d))):"none"!==c&&(e[f]="none",V.set(d,"display",c)));for(f=0;f<g;f++)null!=e[f]&&(a[f].style.display=e[f]);return a}r.fn.extend({show:function(){return ha(this,!0)},hide:function(){return ha(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){ca(this)?r(this).show():r(this).hide()})}});var ia=/^(?:checkbox|radio)$/i,ja=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,ka=/^$|\/(?:java|ecma)script/i,la={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};la.optgroup=la.option,la.tbody=la.tfoot=la.colgroup=la.caption=la.thead,la.th=la.td;function ma(a,b){var c;return c="undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName(b||"*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll(b||"*"):[],void 0===b||b&&r.nodeName(a,b)?r.merge([a],c):c}function na(a,b){for(var c=0,d=a.length;c<d;c++)V.set(a[c],"globalEval",!b||V.get(b[c],"globalEval"))}var oa=/<|&#?\w+;/;function pa(a,b,c,d,e){for(var f,g,h,i,j,k,l=b.createDocumentFragment(),m=[],n=0,o=a.length;n<o;n++)if(f=a[n],f||0===f)if("object"===r.type(f))r.merge(m,f.nodeType?[f]:f);else if(oa.test(f)){g=g||l.appendChild(b.createElement("div")),h=(ja.exec(f)||["",""])[1].toLowerCase(),i=la[h]||la._default,g.innerHTML=i[1]+r.htmlPrefilter(f)+i[2],k=i[0];while(k--)g=g.lastChild;r.merge(m,g.childNodes),g=l.firstChild,g.textContent=""}else m.push(b.createTextNode(f));l.textContent="",n=0;while(f=m[n++])if(d&&r.inArray(f,d)>-1)e&&e.push(f);else if(j=r.contains(f.ownerDocument,f),g=ma(l.appendChild(f),"script"),j&&na(g),c){k=0;while(f=g[k++])ka.test(f.type||"")&&c.push(f)}return l}!function(){var a=d.createDocumentFragment(),b=a.appendChild(d.createElement("div")),c=d.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),o.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",o.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var qa=d.documentElement,ra=/^key/,sa=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,ta=/^([^.]*)(?:\.(.+)|)/;function ua(){return!0}function va(){return!1}function wa(){try{return d.activeElement}catch(a){}}function xa(a,b,c,d,e,f){var g,h;if("object"==typeof b){"string"!=typeof c&&(d=d||c,c=void 0);for(h in b)xa(a,h,c,d,b[h],f);return a}if(null==d&&null==e?(e=c,d=c=void 0):null==e&&("string"==typeof c?(e=d,d=void 0):(e=d,d=c,c=void 0)),e===!1)e=va;else if(!e)return a;return 1===f&&(g=e,e=function(a){return r().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=r.guid++)),a.each(function(){r.event.add(this,b,e,d,c)})}r.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=V.get(a);if(q){c.handler&&(f=c,c=f.handler,e=f.selector),e&&r.find.matchesSelector(qa,e),c.guid||(c.guid=r.guid++),(i=q.events)||(i=q.events={}),(g=q.handle)||(g=q.handle=function(b){return"undefined"!=typeof r&&r.event.triggered!==b.type?r.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(K)||[""],j=b.length;while(j--)h=ta.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n&&(l=r.event.special[n]||{},n=(e?l.delegateType:l.bindType)||n,l=r.event.special[n]||{},k=r.extend({type:n,origType:p,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&r.expr.match.needsContext.test(e),namespace:o.join(".")},f),(m=i[n])||(m=i[n]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,o,g)!==!1||a.addEventListener&&a.addEventListener(n,g)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),r.event.global[n]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=V.hasData(a)&&V.get(a);if(q&&(i=q.events)){b=(b||"").match(K)||[""],j=b.length;while(j--)if(h=ta.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n){l=r.event.special[n]||{},n=(d?l.delegateType:l.bindType)||n,m=i[n]||[],h=h[2]&&new RegExp("(^|\\.)"+o.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&p!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,o,q.handle)!==!1||r.removeEvent(a,n,q.handle),delete i[n])}else for(n in i)r.event.remove(a,n+b[j],c,d,!0);r.isEmptyObject(i)&&V.remove(a,"handle events")}},dispatch:function(a){var b=r.event.fix(a),c,d,e,f,g,h,i=new Array(arguments.length),j=(V.get(this,"events")||{})[b.type]||[],k=r.event.special[b.type]||{};for(i[0]=b,c=1;c<arguments.length;c++)i[c]=arguments[c];if(b.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,b)!==!1){h=r.event.handlers.call(this,b,j),c=0;while((f=h[c++])&&!b.isPropagationStopped()){b.currentTarget=f.elem,d=0;while((g=f.handlers[d++])&&!b.isImmediatePropagationStopped())b.rnamespace&&!b.rnamespace.test(g.namespace)||(b.handleObj=g,b.data=g.data,e=((r.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(b.result=e)===!1&&(b.preventDefault(),b.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,b),b.result}},handlers:function(a,b){var c,d,e,f,g,h=[],i=b.delegateCount,j=a.target;if(i&&j.nodeType&&!("click"===a.type&&a.button>=1))for(;j!==this;j=j.parentNode||this)if(1===j.nodeType&&("click"!==a.type||j.disabled!==!0)){for(f=[],g={},c=0;c<i;c++)d=b[c],e=d.selector+" ",void 0===g[e]&&(g[e]=d.needsContext?r(e,this).index(j)>-1:r.find(e,this,null,[j]).length),g[e]&&f.push(d);f.length&&h.push({elem:j,handlers:f})}return j=this,i<b.length&&h.push({elem:j,handlers:b.slice(i)}),h},addProp:function(a,b){Object.defineProperty(r.Event.prototype,a,{enumerable:!0,configurable:!0,get:r.isFunction(b)?function(){if(this.originalEvent)return b(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[a]},set:function(b){Object.defineProperty(this,a,{enumerable:!0,configurable:!0,writable:!0,value:b})}})},fix:function(a){return a[r.expando]?a:new r.Event(a)},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==wa()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===wa()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&r.nodeName(this,"input"))return this.click(),!1},_default:function(a){return r.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}}},r.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c)},r.Event=function(a,b){return this instanceof r.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?ua:va,this.target=a.target&&3===a.target.nodeType?a.target.parentNode:a.target,this.currentTarget=a.currentTarget,this.relatedTarget=a.relatedTarget):this.type=a,b&&r.extend(this,b),this.timeStamp=a&&a.timeStamp||r.now(),void(this[r.expando]=!0)):new r.Event(a,b)},r.Event.prototype={constructor:r.Event,isDefaultPrevented:va,isPropagationStopped:va,isImmediatePropagationStopped:va,isSimulated:!1,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=ua,a&&!this.isSimulated&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=ua,a&&!this.isSimulated&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=ua,a&&!this.isSimulated&&a.stopImmediatePropagation(),this.stopPropagation()}},r.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(a){var b=a.button;return null==a.which&&ra.test(a.type)?null!=a.charCode?a.charCode:a.keyCode:!a.which&&void 0!==b&&sa.test(a.type)?1&b?1:2&b?3:4&b?2:0:a.which}},r.event.addProp),r.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){r.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return e&&(e===d||r.contains(d,e))||(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),r.fn.extend({on:function(a,b,c,d){return xa(this,a,b,c,d)},one:function(a,b,c,d){return xa(this,a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,r(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return b!==!1&&"function"!=typeof b||(c=b,b=void 0),c===!1&&(c=va),this.each(function(){r.event.remove(this,a,c,b)})}});var ya=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,za=/<script|<style|<link/i,Aa=/checked\s*(?:[^=]|=\s*.checked.)/i,Ba=/^true\/(.*)/,Ca=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Da(a,b){return r.nodeName(a,"table")&&r.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a:a}function Ea(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function Fa(a){var b=Ba.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function Ga(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(V.hasData(a)&&(f=V.access(a),g=V.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;c<d;c++)r.event.add(b,e,j[e][c])}W.hasData(a)&&(h=W.access(a),i=r.extend({},h),W.set(b,i))}}function Ha(a,b){var c=b.nodeName.toLowerCase();"input"===c&&ia.test(a.type)?b.checked=a.checked:"input"!==c&&"textarea"!==c||(b.defaultValue=a.defaultValue)}function Ia(a,b,c,d){b=g.apply([],b);var e,f,h,i,j,k,l=0,m=a.length,n=m-1,q=b[0],s=r.isFunction(q);if(s||m>1&&"string"==typeof q&&!o.checkClone&&Aa.test(q))return a.each(function(e){var f=a.eq(e);s&&(b[0]=q.call(this,e,f.html())),Ia(f,b,c,d)});if(m&&(e=pa(b,a[0].ownerDocument,!1,a,d),f=e.firstChild,1===e.childNodes.length&&(e=f),f||d)){for(h=r.map(ma(e,"script"),Ea),i=h.length;l<m;l++)j=e,l!==n&&(j=r.clone(j,!0,!0),i&&r.merge(h,ma(j,"script"))),c.call(a[l],j,l);if(i)for(k=h[h.length-1].ownerDocument,r.map(h,Fa),l=0;l<i;l++)j=h[l],ka.test(j.type||"")&&!V.access(j,"globalEval")&&r.contains(k,j)&&(j.src?r._evalUrl&&r._evalUrl(j.src):p(j.textContent.replace(Ca,""),k))}return a}function Ja(a,b,c){for(var d,e=b?r.filter(b,a):a,f=0;null!=(d=e[f]);f++)c||1!==d.nodeType||r.cleanData(ma(d)),d.parentNode&&(c&&r.contains(d.ownerDocument,d)&&na(ma(d,"script")),d.parentNode.removeChild(d));return a}r.extend({htmlPrefilter:function(a){return a.replace(ya,"<$1></$2>")},clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=r.contains(a.ownerDocument,a);if(!(o.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||r.isXMLDoc(a)))for(g=ma(h),f=ma(a),d=0,e=f.length;d<e;d++)Ha(f[d],g[d]);if(b)if(c)for(f=f||ma(a),g=g||ma(h),d=0,e=f.length;d<e;d++)Ga(f[d],g[d]);else Ga(a,h);return g=ma(h,"script"),g.length>0&&na(g,!i&&ma(a,"script")),h},cleanData:function(a){for(var b,c,d,e=r.event.special,f=0;void 0!==(c=a[f]);f++)if(T(c)){if(b=c[V.expando]){if(b.events)for(d in b.events)e[d]?r.event.remove(c,d):r.removeEvent(c,d,b.handle);c[V.expando]=void 0}c[W.expando]&&(c[W.expando]=void 0)}}}),r.fn.extend({detach:function(a){return Ja(this,a,!0)},remove:function(a){return Ja(this,a)},text:function(a){return S(this,function(a){return void 0===a?r.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=a)})},null,a,arguments.length)},append:function(){return Ia(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Da(this,a);b.appendChild(a)}})},prepend:function(){return Ia(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Da(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return Ia(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return Ia(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(r.cleanData(ma(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null!=a&&a,b=null==b?a:b,this.map(function(){return r.clone(this,a,b)})},html:function(a){return S(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!za.test(a)&&!la[(ja.exec(a)||["",""])[1].toLowerCase()]){a=r.htmlPrefilter(a);try{for(;c<d;c++)b=this[c]||{},1===b.nodeType&&(r.cleanData(ma(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=[];return Ia(this,arguments,function(b){var c=this.parentNode;r.inArray(this,a)<0&&(r.cleanData(ma(this)),c&&c.replaceChild(b,this))},a)}}),r.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){r.fn[a]=function(a){for(var c,d=[],e=r(a),f=e.length-1,g=0;g<=f;g++)c=g===f?this:this.clone(!0),r(e[g])[b](c),h.apply(d,c.get());return this.pushStack(d)}});var Ka=/^margin/,La=new RegExp("^("+_+")(?!px)[a-z%]+$","i"),Ma=function(b){var c=b.ownerDocument.defaultView;return c&&c.opener||(c=a),c.getComputedStyle(b)};!function(){function b(){if(i){i.style.cssText="box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",i.innerHTML="",qa.appendChild(h);var b=a.getComputedStyle(i);c="1%"!==b.top,g="2px"===b.marginLeft,e="4px"===b.width,i.style.marginRight="50%",f="4px"===b.marginRight,qa.removeChild(h),i=null}}var c,e,f,g,h=d.createElement("div"),i=d.createElement("div");i.style&&(i.style.backgroundClip="content-box",i.cloneNode(!0).style.backgroundClip="",o.clearCloneStyle="content-box"===i.style.backgroundClip,h.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",h.appendChild(i),r.extend(o,{pixelPosition:function(){return b(),c},boxSizingReliable:function(){return b(),e},pixelMarginRight:function(){return b(),f},reliableMarginLeft:function(){return b(),g}}))}();function Na(a,b,c){var d,e,f,g,h=a.style;return c=c||Ma(a),c&&(g=c.getPropertyValue(b)||c[b],""!==g||r.contains(a.ownerDocument,a)||(g=r.style(a,b)),!o.pixelMarginRight()&&La.test(g)&&Ka.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function Oa(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}var Pa=/^(none|table(?!-c[ea]).+)/,Qa={position:"absolute",visibility:"hidden",display:"block"},Ra={letterSpacing:"0",fontWeight:"400"},Sa=["Webkit","Moz","ms"],Ta=d.createElement("div").style;function Ua(a){if(a in Ta)return a;var b=a[0].toUpperCase()+a.slice(1),c=Sa.length;while(c--)if(a=Sa[c]+b,a in Ta)return a}function Va(a,b,c){var d=aa.exec(b);return d?Math.max(0,d[2]-(c||0))+(d[3]||"px"):b}function Wa(a,b,c,d,e){var f,g=0;for(f=c===(d?"border":"content")?4:"width"===b?1:0;f<4;f+=2)"margin"===c&&(g+=r.css(a,c+ba[f],!0,e)),d?("content"===c&&(g-=r.css(a,"padding"+ba[f],!0,e)),"margin"!==c&&(g-=r.css(a,"border"+ba[f]+"Width",!0,e))):(g+=r.css(a,"padding"+ba[f],!0,e),"padding"!==c&&(g+=r.css(a,"border"+ba[f]+"Width",!0,e)));return g}function Xa(a,b,c){var d,e=!0,f=Ma(a),g="border-box"===r.css(a,"boxSizing",!1,f);if(a.getClientRects().length&&(d=a.getBoundingClientRect()[b]),d<=0||null==d){if(d=Na(a,b,f),(d<0||null==d)&&(d=a.style[b]),La.test(d))return d;e=g&&(o.boxSizingReliable()||d===a.style[b]),d=parseFloat(d)||0}return d+Wa(a,b,c||(g?"border":"content"),e,f)+"px"}r.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Na(a,"opacity");return""===c?"1":c}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=r.camelCase(b),i=a.style;return b=r.cssProps[h]||(r.cssProps[h]=Ua(h)||h),g=r.cssHooks[b]||r.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=aa.exec(c))&&e[1]&&(c=ea(a,b,e),f="number"),null!=c&&c===c&&("number"===f&&(c+=e&&e[3]||(r.cssNumber[h]?"":"px")),o.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=r.camelCase(b);return b=r.cssProps[h]||(r.cssProps[h]=Ua(h)||h),g=r.cssHooks[b]||r.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=Na(a,b,d)),"normal"===e&&b in Ra&&(e=Ra[b]),""===c||c?(f=parseFloat(e),c===!0||isFinite(f)?f||0:e):e}}),r.each(["height","width"],function(a,b){r.cssHooks[b]={get:function(a,c,d){if(c)return!Pa.test(r.css(a,"display"))||a.getClientRects().length&&a.getBoundingClientRect().width?Xa(a,b,d):da(a,Qa,function(){return Xa(a,b,d)})},set:function(a,c,d){var e,f=d&&Ma(a),g=d&&Wa(a,b,d,"border-box"===r.css(a,"boxSizing",!1,f),f);return g&&(e=aa.exec(c))&&"px"!==(e[3]||"px")&&(a.style[b]=c,c=r.css(a,b)),Va(a,c,g)}}}),r.cssHooks.marginLeft=Oa(o.reliableMarginLeft,function(a,b){if(b)return(parseFloat(Na(a,"marginLeft"))||a.getBoundingClientRect().left-da(a,{marginLeft:0},function(){return a.getBoundingClientRect().left}))+"px"}),r.each({margin:"",padding:"",border:"Width"},function(a,b){r.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];d<4;d++)e[a+ba[d]+b]=f[d]||f[d-2]||f[0];return e}},Ka.test(a)||(r.cssHooks[a+b].set=Va)}),r.fn.extend({css:function(a,b){return S(this,function(a,b,c){var d,e,f={},g=0;if(r.isArray(b)){for(d=Ma(a),e=b.length;g<e;g++)f[b[g]]=r.css(a,b[g],!1,d);return f}return void 0!==c?r.style(a,b,c):r.css(a,b)},a,b,arguments.length>1)}});function Ya(a,b,c,d,e){return new Ya.prototype.init(a,b,c,d,e)}r.Tween=Ya,Ya.prototype={constructor:Ya,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||r.easing._default,this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(r.cssNumber[c]?"":"px")},cur:function(){var a=Ya.propHooks[this.prop];return a&&a.get?a.get(this):Ya.propHooks._default.get(this)},run:function(a){var b,c=Ya.propHooks[this.prop];return this.options.duration?this.pos=b=r.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Ya.propHooks._default.set(this),this}},Ya.prototype.init.prototype=Ya.prototype,Ya.propHooks={_default:{get:function(a){var b;return 1!==a.elem.nodeType||null!=a.elem[a.prop]&&null==a.elem.style[a.prop]?a.elem[a.prop]:(b=r.css(a.elem,a.prop,""),b&&"auto"!==b?b:0)},set:function(a){r.fx.step[a.prop]?r.fx.step[a.prop](a):1!==a.elem.nodeType||null==a.elem.style[r.cssProps[a.prop]]&&!r.cssHooks[a.prop]?a.elem[a.prop]=a.now:r.style(a.elem,a.prop,a.now+a.unit)}}},Ya.propHooks.scrollTop=Ya.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},r.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2},_default:"swing"},r.fx=Ya.prototype.init,r.fx.step={};var Za,$a,_a=/^(?:toggle|show|hide)$/,ab=/queueHooks$/;function bb(){$a&&(a.requestAnimationFrame(bb),r.fx.tick())}function cb(){return a.setTimeout(function(){Za=void 0}),Za=r.now()}function db(a,b){var c,d=0,e={height:a};for(b=b?1:0;d<4;d+=2-b)c=ba[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function eb(a,b,c){for(var d,e=(hb.tweeners[b]||[]).concat(hb.tweeners["*"]),f=0,g=e.length;f<g;f++)if(d=e[f].call(c,b,a))return d}function fb(a,b,c){var d,e,f,g,h,i,j,k,l="width"in b||"height"in b,m=this,n={},o=a.style,p=a.nodeType&&ca(a),q=V.get(a,"fxshow");c.queue||(g=r._queueHooks(a,"fx"),null==g.unqueued&&(g.unqueued=0,h=g.empty.fire,g.empty.fire=function(){g.unqueued||h()}),g.unqueued++,m.always(function(){m.always(function(){g.unqueued--,r.queue(a,"fx").length||g.empty.fire()})}));for(d in b)if(e=b[d],_a.test(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}n[d]=q&&q[d]||r.style(a,d)}if(i=!r.isEmptyObject(b),i||!r.isEmptyObject(n)){l&&1===a.nodeType&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=q&&q.display,null==j&&(j=V.get(a,"display")),k=r.css(a,"display"),"none"===k&&(j?k=j:(ha([a],!0),j=a.style.display||j,k=r.css(a,"display"),ha([a]))),("inline"===k||"inline-block"===k&&null!=j)&&"none"===r.css(a,"float")&&(i||(m.done(function(){o.display=j}),null==j&&(k=o.display,j="none"===k?"":k)),o.display="inline-block")),c.overflow&&(o.overflow="hidden",m.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]})),i=!1;for(d in n)i||(q?"hidden"in q&&(p=q.hidden):q=V.access(a,"fxshow",{display:j}),f&&(q.hidden=!p),p&&ha([a],!0),m.done(function(){p||ha([a]),V.remove(a,"fxshow");for(d in n)r.style(a,d,n[d])})),i=eb(p?q[d]:0,d,m),d in q||(q[d]=i.start,p&&(i.end=i.start,i.start=0))}}function gb(a,b){var c,d,e,f,g;for(c in a)if(d=r.camelCase(c),e=b[d],f=a[c],r.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=r.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function hb(a,b,c){var d,e,f=0,g=hb.prefilters.length,h=r.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=Za||cb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;g<i;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),f<1&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:r.extend({},b),opts:r.extend(!0,{specialEasing:{},easing:r.easing._default},c),originalProperties:b,originalOptions:c,startTime:Za||cb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=r.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;c<d;c++)j.tweens[c].run(1);return b?(h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j,b])):h.rejectWith(a,[j,b]),this}}),k=j.props;for(gb(k,j.opts.specialEasing);f<g;f++)if(d=hb.prefilters[f].call(j,a,k,j.opts))return r.isFunction(d.stop)&&(r._queueHooks(j.elem,j.opts.queue).stop=r.proxy(d.stop,d)),d;return r.map(k,eb,j),r.isFunction(j.opts.start)&&j.opts.start.call(a,j),r.fx.timer(r.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}r.Animation=r.extend(hb,{tweeners:{"*":[function(a,b){var c=this.createTween(a,b);return ea(c.elem,a,aa.exec(b),c),c}]},tweener:function(a,b){r.isFunction(a)?(b=a,a=["*"]):a=a.match(K);for(var c,d=0,e=a.length;d<e;d++)c=a[d],hb.tweeners[c]=hb.tweeners[c]||[],hb.tweeners[c].unshift(b)},prefilters:[fb],prefilter:function(a,b){b?hb.prefilters.unshift(a):hb.prefilters.push(a)}}),r.speed=function(a,b,c){var e=a&&"object"==typeof a?r.extend({},a):{complete:c||!c&&b||r.isFunction(a)&&a,duration:a,easing:c&&b||b&&!r.isFunction(b)&&b};return r.fx.off||d.hidden?e.duration=0:"number"!=typeof e.duration&&(e.duration in r.fx.speeds?e.duration=r.fx.speeds[e.duration]:e.duration=r.fx.speeds._default),null!=e.queue&&e.queue!==!0||(e.queue="fx"),e.old=e.complete,e.complete=function(){r.isFunction(e.old)&&e.old.call(this),e.queue&&r.dequeue(this,e.queue)},e},r.fn.extend({fadeTo:function(a,b,c,d){return this.filter(ca).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=r.isEmptyObject(a),f=r.speed(b,c,d),g=function(){var b=hb(this,r.extend({},a),f);(e||V.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=r.timers,g=V.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&ab.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));!b&&c||r.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=V.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=r.timers,g=d?d.length:0;for(c.finish=!0,r.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;b<g;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),r.each(["toggle","show","hide"],function(a,b){var c=r.fn[b];r.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(db(b,!0),a,d,e)}}),r.each({slideDown:db("show"),slideUp:db("hide"),slideToggle:db("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){r.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),r.timers=[],r.fx.tick=function(){var a,b=0,c=r.timers;for(Za=r.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||r.fx.stop(),Za=void 0},r.fx.timer=function(a){r.timers.push(a),a()?r.fx.start():r.timers.pop()},r.fx.interval=13,r.fx.start=function(){$a||($a=a.requestAnimationFrame?a.requestAnimationFrame(bb):a.setInterval(r.fx.tick,r.fx.interval))},r.fx.stop=function(){a.cancelAnimationFrame?a.cancelAnimationFrame($a):a.clearInterval($a),$a=null},r.fx.speeds={slow:600,fast:200,_default:400},r.fn.delay=function(b,c){return b=r.fx?r.fx.speeds[b]||b:b,c=c||"fx",this.queue(c,function(c,d){var e=a.setTimeout(c,b);d.stop=function(){a.clearTimeout(e)}})},function(){var a=d.createElement("input"),b=d.createElement("select"),c=b.appendChild(d.createElement("option"));a.type="checkbox",o.checkOn=""!==a.value,o.optSelected=c.selected,a=d.createElement("input"),a.value="t",a.type="radio",o.radioValue="t"===a.value}();var ib,jb=r.expr.attrHandle;r.fn.extend({attr:function(a,b){return S(this,r.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){r.removeAttr(this,a)})}}),r.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return"undefined"==typeof a.getAttribute?r.prop(a,b,c):(1===f&&r.isXMLDoc(a)||(e=r.attrHooks[b.toLowerCase()]||(r.expr.match.bool.test(b)?ib:void 0)),
	void 0!==c?null===c?void r.removeAttr(a,b):e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:(a.setAttribute(b,c+""),c):e&&"get"in e&&null!==(d=e.get(a,b))?d:(d=r.find.attr(a,b),null==d?void 0:d))},attrHooks:{type:{set:function(a,b){if(!o.radioValue&&"radio"===b&&r.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},removeAttr:function(a,b){var c,d=0,e=b&&b.match(K);if(e&&1===a.nodeType)while(c=e[d++])a.removeAttribute(c)}}),ib={set:function(a,b,c){return b===!1?r.removeAttr(a,c):a.setAttribute(c,c),c}},r.each(r.expr.match.bool.source.match(/\w+/g),function(a,b){var c=jb[b]||r.find.attr;jb[b]=function(a,b,d){var e,f,g=b.toLowerCase();return d||(f=jb[g],jb[g]=e,e=null!=c(a,b,d)?g:null,jb[g]=f),e}});var kb=/^(?:input|select|textarea|button)$/i,lb=/^(?:a|area)$/i;r.fn.extend({prop:function(a,b){return S(this,r.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[r.propFix[a]||a]})}}),r.extend({prop:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return 1===f&&r.isXMLDoc(a)||(b=r.propFix[b]||b,e=r.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=r.find.attr(a,"tabindex");return b?parseInt(b,10):kb.test(a.nodeName)||lb.test(a.nodeName)&&a.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),o.optSelected||(r.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null},set:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex)}}),r.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){r.propFix[this.toLowerCase()]=this});function mb(a){var b=a.match(K)||[];return b.join(" ")}function nb(a){return a.getAttribute&&a.getAttribute("class")||""}r.fn.extend({addClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).addClass(a.call(this,b,nb(this)))});if("string"==typeof a&&a){b=a.match(K)||[];while(c=this[i++])if(e=nb(c),d=1===c.nodeType&&" "+mb(e)+" "){g=0;while(f=b[g++])d.indexOf(" "+f+" ")<0&&(d+=f+" ");h=mb(d),e!==h&&c.setAttribute("class",h)}}return this},removeClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).removeClass(a.call(this,b,nb(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof a&&a){b=a.match(K)||[];while(c=this[i++])if(e=nb(c),d=1===c.nodeType&&" "+mb(e)+" "){g=0;while(f=b[g++])while(d.indexOf(" "+f+" ")>-1)d=d.replace(" "+f+" "," ");h=mb(d),e!==h&&c.setAttribute("class",h)}}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):r.isFunction(a)?this.each(function(c){r(this).toggleClass(a.call(this,c,nb(this),b),b)}):this.each(function(){var b,d,e,f;if("string"===c){d=0,e=r(this),f=a.match(K)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else void 0!==a&&"boolean"!==c||(b=nb(this),b&&V.set(this,"__className__",b),this.setAttribute&&this.setAttribute("class",b||a===!1?"":V.get(this,"__className__")||""))})},hasClass:function(a){var b,c,d=0;b=" "+a+" ";while(c=this[d++])if(1===c.nodeType&&(" "+mb(nb(c))+" ").indexOf(b)>-1)return!0;return!1}});var ob=/\r/g;r.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=r.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,r(this).val()):a,null==e?e="":"number"==typeof e?e+="":r.isArray(e)&&(e=r.map(e,function(a){return null==a?"":a+""})),b=r.valHooks[this.type]||r.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=r.valHooks[e.type]||r.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(ob,""):null==c?"":c)}}}),r.extend({valHooks:{option:{get:function(a){var b=r.find.attr(a,"value");return null!=b?b:mb(r.text(a))}},select:{get:function(a){var b,c,d,e=a.options,f=a.selectedIndex,g="select-one"===a.type,h=g?null:[],i=g?f+1:e.length;for(d=f<0?i:g?f:0;d<i;d++)if(c=e[d],(c.selected||d===f)&&!c.disabled&&(!c.parentNode.disabled||!r.nodeName(c.parentNode,"optgroup"))){if(b=r(c).val(),g)return b;h.push(b)}return h},set:function(a,b){var c,d,e=a.options,f=r.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=r.inArray(r.valHooks.option.get(d),f)>-1)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),r.each(["radio","checkbox"],function(){r.valHooks[this]={set:function(a,b){if(r.isArray(b))return a.checked=r.inArray(r(a).val(),b)>-1}},o.checkOn||(r.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var pb=/^(?:focusinfocus|focusoutblur)$/;r.extend(r.event,{trigger:function(b,c,e,f){var g,h,i,j,k,m,n,o=[e||d],p=l.call(b,"type")?b.type:b,q=l.call(b,"namespace")?b.namespace.split("."):[];if(h=i=e=e||d,3!==e.nodeType&&8!==e.nodeType&&!pb.test(p+r.event.triggered)&&(p.indexOf(".")>-1&&(q=p.split("."),p=q.shift(),q.sort()),k=p.indexOf(":")<0&&"on"+p,b=b[r.expando]?b:new r.Event(p,"object"==typeof b&&b),b.isTrigger=f?2:3,b.namespace=q.join("."),b.rnamespace=b.namespace?new RegExp("(^|\\.)"+q.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=e),c=null==c?[b]:r.makeArray(c,[b]),n=r.event.special[p]||{},f||!n.trigger||n.trigger.apply(e,c)!==!1)){if(!f&&!n.noBubble&&!r.isWindow(e)){for(j=n.delegateType||p,pb.test(j+p)||(h=h.parentNode);h;h=h.parentNode)o.push(h),i=h;i===(e.ownerDocument||d)&&o.push(i.defaultView||i.parentWindow||a)}g=0;while((h=o[g++])&&!b.isPropagationStopped())b.type=g>1?j:n.bindType||p,m=(V.get(h,"events")||{})[b.type]&&V.get(h,"handle"),m&&m.apply(h,c),m=k&&h[k],m&&m.apply&&T(h)&&(b.result=m.apply(h,c),b.result===!1&&b.preventDefault());return b.type=p,f||b.isDefaultPrevented()||n._default&&n._default.apply(o.pop(),c)!==!1||!T(e)||k&&r.isFunction(e[p])&&!r.isWindow(e)&&(i=e[k],i&&(e[k]=null),r.event.triggered=p,e[p](),r.event.triggered=void 0,i&&(e[k]=i)),b.result}},simulate:function(a,b,c){var d=r.extend(new r.Event,c,{type:a,isSimulated:!0});r.event.trigger(d,null,b)}}),r.fn.extend({trigger:function(a,b){return this.each(function(){r.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];if(c)return r.event.trigger(a,b,c,!0)}}),r.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(a,b){r.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),r.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),o.focusin="onfocusin"in a,o.focusin||r.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){r.event.simulate(b,a.target,r.event.fix(a))};r.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=V.access(d,b);e||d.addEventListener(a,c,!0),V.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=V.access(d,b)-1;e?V.access(d,b,e):(d.removeEventListener(a,c,!0),V.remove(d,b))}}});var qb=a.location,rb=r.now(),sb=/\?/;r.parseXML=function(b){var c;if(!b||"string"!=typeof b)return null;try{c=(new a.DOMParser).parseFromString(b,"text/xml")}catch(d){c=void 0}return c&&!c.getElementsByTagName("parsererror").length||r.error("Invalid XML: "+b),c};var tb=/\[\]$/,ub=/\r?\n/g,vb=/^(?:submit|button|image|reset|file)$/i,wb=/^(?:input|select|textarea|keygen)/i;function xb(a,b,c,d){var e;if(r.isArray(b))r.each(b,function(b,e){c||tb.test(a)?d(a,e):xb(a+"["+("object"==typeof e&&null!=e?b:"")+"]",e,c,d)});else if(c||"object"!==r.type(b))d(a,b);else for(e in b)xb(a+"["+e+"]",b[e],c,d)}r.param=function(a,b){var c,d=[],e=function(a,b){var c=r.isFunction(b)?b():b;d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(null==c?"":c)};if(r.isArray(a)||a.jquery&&!r.isPlainObject(a))r.each(a,function(){e(this.name,this.value)});else for(c in a)xb(c,a[c],b,e);return d.join("&")},r.fn.extend({serialize:function(){return r.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=r.prop(this,"elements");return a?r.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!r(this).is(":disabled")&&wb.test(this.nodeName)&&!vb.test(a)&&(this.checked||!ia.test(a))}).map(function(a,b){var c=r(this).val();return null==c?null:r.isArray(c)?r.map(c,function(a){return{name:b.name,value:a.replace(ub,"\r\n")}}):{name:b.name,value:c.replace(ub,"\r\n")}}).get()}});var yb=/%20/g,zb=/#.*$/,Ab=/([?&])_=[^&]*/,Bb=/^(.*?):[ \t]*([^\r\n]*)$/gm,Cb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Db=/^(?:GET|HEAD)$/,Eb=/^\/\//,Fb={},Gb={},Hb="*/".concat("*"),Ib=d.createElement("a");Ib.href=qb.href;function Jb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(K)||[];if(r.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Kb(a,b,c,d){var e={},f=a===Gb;function g(h){var i;return e[h]=!0,r.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Lb(a,b){var c,d,e=r.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&r.extend(!0,a,d),a}function Mb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}if(f)return f!==i[0]&&i.unshift(f),c[f]}function Nb(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}r.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:qb.href,type:"GET",isLocal:Cb.test(qb.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Hb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":r.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Lb(Lb(a,r.ajaxSettings),b):Lb(r.ajaxSettings,a)},ajaxPrefilter:Jb(Fb),ajaxTransport:Jb(Gb),ajax:function(b,c){"object"==typeof b&&(c=b,b=void 0),c=c||{};var e,f,g,h,i,j,k,l,m,n,o=r.ajaxSetup({},c),p=o.context||o,q=o.context&&(p.nodeType||p.jquery)?r(p):r.event,s=r.Deferred(),t=r.Callbacks("once memory"),u=o.statusCode||{},v={},w={},x="canceled",y={readyState:0,getResponseHeader:function(a){var b;if(k){if(!h){h={};while(b=Bb.exec(g))h[b[1].toLowerCase()]=b[2]}b=h[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return k?g:null},setRequestHeader:function(a,b){return null==k&&(a=w[a.toLowerCase()]=w[a.toLowerCase()]||a,v[a]=b),this},overrideMimeType:function(a){return null==k&&(o.mimeType=a),this},statusCode:function(a){var b;if(a)if(k)y.always(a[y.status]);else for(b in a)u[b]=[u[b],a[b]];return this},abort:function(a){var b=a||x;return e&&e.abort(b),A(0,b),this}};if(s.promise(y),o.url=((b||o.url||qb.href)+"").replace(Eb,qb.protocol+"//"),o.type=c.method||c.type||o.method||o.type,o.dataTypes=(o.dataType||"*").toLowerCase().match(K)||[""],null==o.crossDomain){j=d.createElement("a");try{j.href=o.url,j.href=j.href,o.crossDomain=Ib.protocol+"//"+Ib.host!=j.protocol+"//"+j.host}catch(z){o.crossDomain=!0}}if(o.data&&o.processData&&"string"!=typeof o.data&&(o.data=r.param(o.data,o.traditional)),Kb(Fb,o,c,y),k)return y;l=r.event&&o.global,l&&0===r.active++&&r.event.trigger("ajaxStart"),o.type=o.type.toUpperCase(),o.hasContent=!Db.test(o.type),f=o.url.replace(zb,""),o.hasContent?o.data&&o.processData&&0===(o.contentType||"").indexOf("application/x-www-form-urlencoded")&&(o.data=o.data.replace(yb,"+")):(n=o.url.slice(f.length),o.data&&(f+=(sb.test(f)?"&":"?")+o.data,delete o.data),o.cache===!1&&(f=f.replace(Ab,"$1"),n=(sb.test(f)?"&":"?")+"_="+rb++ +n),o.url=f+n),o.ifModified&&(r.lastModified[f]&&y.setRequestHeader("If-Modified-Since",r.lastModified[f]),r.etag[f]&&y.setRequestHeader("If-None-Match",r.etag[f])),(o.data&&o.hasContent&&o.contentType!==!1||c.contentType)&&y.setRequestHeader("Content-Type",o.contentType),y.setRequestHeader("Accept",o.dataTypes[0]&&o.accepts[o.dataTypes[0]]?o.accepts[o.dataTypes[0]]+("*"!==o.dataTypes[0]?", "+Hb+"; q=0.01":""):o.accepts["*"]);for(m in o.headers)y.setRequestHeader(m,o.headers[m]);if(o.beforeSend&&(o.beforeSend.call(p,y,o)===!1||k))return y.abort();if(x="abort",t.add(o.complete),y.done(o.success),y.fail(o.error),e=Kb(Gb,o,c,y)){if(y.readyState=1,l&&q.trigger("ajaxSend",[y,o]),k)return y;o.async&&o.timeout>0&&(i=a.setTimeout(function(){y.abort("timeout")},o.timeout));try{k=!1,e.send(v,A)}catch(z){if(k)throw z;A(-1,z)}}else A(-1,"No Transport");function A(b,c,d,h){var j,m,n,v,w,x=c;k||(k=!0,i&&a.clearTimeout(i),e=void 0,g=h||"",y.readyState=b>0?4:0,j=b>=200&&b<300||304===b,d&&(v=Mb(o,y,d)),v=Nb(o,v,y,j),j?(o.ifModified&&(w=y.getResponseHeader("Last-Modified"),w&&(r.lastModified[f]=w),w=y.getResponseHeader("etag"),w&&(r.etag[f]=w)),204===b||"HEAD"===o.type?x="nocontent":304===b?x="notmodified":(x=v.state,m=v.data,n=v.error,j=!n)):(n=x,!b&&x||(x="error",b<0&&(b=0))),y.status=b,y.statusText=(c||x)+"",j?s.resolveWith(p,[m,x,y]):s.rejectWith(p,[y,x,n]),y.statusCode(u),u=void 0,l&&q.trigger(j?"ajaxSuccess":"ajaxError",[y,o,j?m:n]),t.fireWith(p,[y,x]),l&&(q.trigger("ajaxComplete",[y,o]),--r.active||r.event.trigger("ajaxStop")))}return y},getJSON:function(a,b,c){return r.get(a,b,c,"json")},getScript:function(a,b){return r.get(a,void 0,b,"script")}}),r.each(["get","post"],function(a,b){r[b]=function(a,c,d,e){return r.isFunction(c)&&(e=e||d,d=c,c=void 0),r.ajax(r.extend({url:a,type:b,dataType:e,data:c,success:d},r.isPlainObject(a)&&a))}}),r._evalUrl=function(a){return r.ajax({url:a,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},r.fn.extend({wrapAll:function(a){var b;return this[0]&&(r.isFunction(a)&&(a=a.call(this[0])),b=r(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this},wrapInner:function(a){return r.isFunction(a)?this.each(function(b){r(this).wrapInner(a.call(this,b))}):this.each(function(){var b=r(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=r.isFunction(a);return this.each(function(c){r(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(a){return this.parent(a).not("body").each(function(){r(this).replaceWith(this.childNodes)}),this}}),r.expr.pseudos.hidden=function(a){return!r.expr.pseudos.visible(a)},r.expr.pseudos.visible=function(a){return!!(a.offsetWidth||a.offsetHeight||a.getClientRects().length)},r.ajaxSettings.xhr=function(){try{return new a.XMLHttpRequest}catch(b){}};var Ob={0:200,1223:204},Pb=r.ajaxSettings.xhr();o.cors=!!Pb&&"withCredentials"in Pb,o.ajax=Pb=!!Pb,r.ajaxTransport(function(b){var c,d;if(o.cors||Pb&&!b.crossDomain)return{send:function(e,f){var g,h=b.xhr();if(h.open(b.type,b.url,b.async,b.username,b.password),b.xhrFields)for(g in b.xhrFields)h[g]=b.xhrFields[g];b.mimeType&&h.overrideMimeType&&h.overrideMimeType(b.mimeType),b.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest");for(g in e)h.setRequestHeader(g,e[g]);c=function(a){return function(){c&&(c=d=h.onload=h.onerror=h.onabort=h.onreadystatechange=null,"abort"===a?h.abort():"error"===a?"number"!=typeof h.status?f(0,"error"):f(h.status,h.statusText):f(Ob[h.status]||h.status,h.statusText,"text"!==(h.responseType||"text")||"string"!=typeof h.responseText?{binary:h.response}:{text:h.responseText},h.getAllResponseHeaders()))}},h.onload=c(),d=h.onerror=c("error"),void 0!==h.onabort?h.onabort=d:h.onreadystatechange=function(){4===h.readyState&&a.setTimeout(function(){c&&d()})},c=c("abort");try{h.send(b.hasContent&&b.data||null)}catch(i){if(c)throw i}},abort:function(){c&&c()}}}),r.ajaxPrefilter(function(a){a.crossDomain&&(a.contents.script=!1)}),r.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(a){return r.globalEval(a),a}}}),r.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),r.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(e,f){b=r("<script>").prop({charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&f("error"===a.type?404:200,a.type)}),d.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Qb=[],Rb=/(=)\?(?=&|$)|\?\?/;r.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Qb.pop()||r.expando+"_"+rb++;return this[a]=!0,a}}),r.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Rb.test(b.url)?"url":"string"==typeof b.data&&0===(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Rb.test(b.data)&&"data");if(h||"jsonp"===b.dataTypes[0])return e=b.jsonpCallback=r.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Rb,"$1"+e):b.jsonp!==!1&&(b.url+=(sb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||r.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){void 0===f?r(a).removeProp(e):a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Qb.push(e)),g&&r.isFunction(f)&&f(g[0]),g=f=void 0}),"script"}),o.createHTMLDocument=function(){var a=d.implementation.createHTMLDocument("").body;return a.innerHTML="<form></form><form></form>",2===a.childNodes.length}(),r.parseHTML=function(a,b,c){if("string"!=typeof a)return[];"boolean"==typeof b&&(c=b,b=!1);var e,f,g;return b||(o.createHTMLDocument?(b=d.implementation.createHTMLDocument(""),e=b.createElement("base"),e.href=d.location.href,b.head.appendChild(e)):b=d),f=B.exec(a),g=!c&&[],f?[b.createElement(f[1])]:(f=pa([a],b,g),g&&g.length&&r(g).remove(),r.merge([],f.childNodes))},r.fn.load=function(a,b,c){var d,e,f,g=this,h=a.indexOf(" ");return h>-1&&(d=mb(a.slice(h)),a=a.slice(0,h)),r.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&r.ajax({url:a,type:e||"GET",dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?r("<div>").append(r.parseHTML(a)).find(d):a)}).always(c&&function(a,b){g.each(function(){c.apply(this,f||[a.responseText,b,a])})}),this},r.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){r.fn[b]=function(a){return this.on(b,a)}}),r.expr.pseudos.animated=function(a){return r.grep(r.timers,function(b){return a===b.elem}).length};function Sb(a){return r.isWindow(a)?a:9===a.nodeType&&a.defaultView}r.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=r.css(a,"position"),l=r(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=r.css(a,"top"),i=r.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),r.isFunction(b)&&(b=b.call(a,c,r.extend({},h))),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},r.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){r.offset.setOffset(this,a,b)});var b,c,d,e,f=this[0];if(f)return f.getClientRects().length?(d=f.getBoundingClientRect(),d.width||d.height?(e=f.ownerDocument,c=Sb(e),b=e.documentElement,{top:d.top+c.pageYOffset-b.clientTop,left:d.left+c.pageXOffset-b.clientLeft}):d):{top:0,left:0}},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===r.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),r.nodeName(a[0],"html")||(d=a.offset()),d={top:d.top+r.css(a[0],"borderTopWidth",!0),left:d.left+r.css(a[0],"borderLeftWidth",!0)}),{top:b.top-d.top-r.css(c,"marginTop",!0),left:b.left-d.left-r.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent;while(a&&"static"===r.css(a,"position"))a=a.offsetParent;return a||qa})}}),r.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c="pageYOffset"===b;r.fn[a]=function(d){return S(this,function(a,d,e){var f=Sb(a);return void 0===e?f?f[b]:a[d]:void(f?f.scrollTo(c?f.pageXOffset:e,c?e:f.pageYOffset):a[d]=e)},a,d,arguments.length)}}),r.each(["top","left"],function(a,b){r.cssHooks[b]=Oa(o.pixelPosition,function(a,c){if(c)return c=Na(a,b),La.test(c)?r(a).position()[b]+"px":c})}),r.each({Height:"height",Width:"width"},function(a,b){r.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){r.fn[d]=function(e,f){var g=arguments.length&&(c||"boolean"!=typeof e),h=c||(e===!0||f===!0?"margin":"border");return S(this,function(b,c,e){var f;return r.isWindow(b)?0===d.indexOf("outer")?b["inner"+a]:b.document.documentElement["client"+a]:9===b.nodeType?(f=b.documentElement,Math.max(b.body["scroll"+a],f["scroll"+a],b.body["offset"+a],f["offset"+a],f["client"+a])):void 0===e?r.css(b,c,h):r.style(b,c,e,h)},b,g?e:void 0,g)}})}),r.fn.extend({bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}}),r.parseJSON=JSON.parse,"function"=="function"&&__webpack_require__(2)&&!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){return r}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));var Tb=a.jQuery,Ub=a.$;return r.noConflict=function(b){return a.$===r&&(a.$=Ub),b&&a.jQuery===r&&(a.jQuery=Tb),r},b||(a.jQuery=a.$=r),r});


/***/ },
/* 2 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;
	
	/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($, jQuery) {"use strict";
	
	//let debug = require('debug')('book');
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.__book = undefined;
	
	var _filejs = __webpack_require__(4);
	
	var _filejs2 = _interopRequireDefault(_filejs);
	
	var _filejsFb = __webpack_require__(6);
	
	var _filejsFb2 = _interopRequireDefault(_filejsFb);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var debug = console.log.bind(console);
	
	var Player = __webpack_require__(7).Player;
	
	_filejs2.default.defineEngine(_filejsFb2.default);
	
	jQuery.fn.cssInt = function (n) {
	    return parseInt($(this[0]).css(n), 10);
	};
	
	var doNothing = function doNothing() {};
	
	var getUId = function getUId() {
	    var id = 0;
	
	    return function () {
	        return id++;
	    };
	};
	
	var __book = function __book(idElem, interfaceFunc) {
	    var info = {};
	    var user = undefined;
	
	    var error = interfaceFunc['error'];
	    var msg = interfaceFunc['msg'];
	
	    var bookDoc = void 0;
	    var bookEl = $('#' + idElem);
	    var slider = $('#slider_btn');
	    var footnote = $('#footnote');
	    var sliderHeight = $('#slider').height() - slider.height();
	    var hiddenEl = $('#hidden_' + idElem);
	    var lineSize = void 0;
	    var lineCnt = void 0;
	    var json = void 0;
	    var fs = $('#listOfBooks ol');
	    var thus = this;
	    var offsetBook = 0;
	    var height = 0;
	    var __ = [];
	    var maxPos = 0;
	    var bookId = 0;
	    var sliderMarks = $('#slider > #marks');
	    var sliderBookMarks = $('#slider > #userMarks');
	
	    var screen = {
	        pos: 0,
	        now: 0
	    };
	
	    var saved = {
	        pos: 0,
	        bookmarkCount: 0
	    };
	
	    var load = {
	        book: false,
	        bookmark: false,
	        save: false,
	        user: false,
	        del: false
	    };
	    var timeout = {
	        saveload: 1000
	    };
	    var mode = {
	        online: true,
	        night: false
	    };
	
	    var jump = {
	        list: [],
	        it: 0,
	        timer: 0
	    };
	
	    var ECHO_TIMEOUT = 1000 * 60;
	
	    var __bookmarks = [];
	
	    // init interface function, no DOM
	    this.player = new Player(scrollOneString);
	    // no ajax
	    this['__int__bookmark'] = interfaceFunc['bookmark'](thus);
	    this['__int__loading'] = interfaceFunc['loading'](thus);
	    this['__int__controllerLeft'] = interfaceFunc['controllerLeft'](thus);
	    var __int__playerInit = interfaceFunc['playerInit'](this.player);
	    // set settings
	    this['__int__ajaxSettings'] = interfaceFunc['ajaxSettings'](thus);
	
	    this.player.init(__int__playerInit);
	    // ajax part
	
	
	    // end init
	
	    /**
	     * add border
	     */
	    this.selectEl = function () {
	        var nowSelect = {
	            'user-sel': undefined,
	            'jump': undefined,
	            'another-state': undefined
	        };
	
	        return function (id, state) {
	            state = state || 'another-state';
	
	            if (!nowSelect.hasOwnProperty(state)) {
	                state = 'another-state';
	            }
	
	            if (typeof id == 'undefined' || id == -1) {
	                if (typeof nowSelect[state] != 'undefined') {
	                    __[nowSelect[state]].removeClass('select');
	                    __[nowSelect[state]].attr('select-state', '');
	
	                    nowSelect[state] = undefined;
	                }
	            } else {
	                if (typeof nowSelect[state] != 'undefined') {
	                    __[nowSelect[state]].removeClass('select');
	
	                    __[nowSelect[state]].attr('select-state', '');
	                }
	
	                nowSelect[state] = +id;
	                __[nowSelect[state]].addClass('select');
	                __[nowSelect[state]].attr('select-state', state);
	            }
	        };
	    }();
	
	    //  id := screen.pos
	    //  @set up slider
	    //  ---------------------
	    //  @return css.top
	    function sliderTop(id) {
	        if (arguments.length) {
	            // set top
	            slider.css('top', id / maxPos * sliderHeight);
	        } else {
	            // get top
	            return Math.floor(slider.cssInt('top') / sliderHeight * maxPos);
	        }
	    }
	
	    //  Y := (coor.Y - offset)
	    //  @return book.pos
	    function sliderPos(Y) {
	        return Math.floor(Y / sliderHeight * maxPos);
	    }
	
	    function setLoadValueFalse(name) {
	        setTimeout(function () {
	            load[name] = false;
	        }, timeout[name + 'load'] || 1000);
	    }
	
	    this.addBookmark = function (pos, title, text) {
	        __bookmarks.push({
	            pos: pos || 0,
	            title: title,
	            text: text
	        });
	
	        if (mode['online']) {
	            thus.save();
	        } else {
	            saved.bookmarkCount++;
	        }
	    };
	
	    this.editBookmark = function (id, pos, title, text) {
	        var prom = new Promise(function (resolve, reject) {
	
	            var dd = {
	                mark: {
	                    id: id,
	                    pos: pos,
	                    title: title,
	                    text: text
	                }
	            };
	
	            if (mode['online']) {
	                if (!load.bookmark) {
	                    load.bookmark = true;
	
	                    $.ajax({
	                        method: 'POST',
	                        url: '/book/bookmark/edit/_' + bookId,
	                        data: JSON.stringify(dd),
	                        contentType: "application/json; charset=utf-8"
	                    }).done(function () {
	                        msg('Bookmark was deleted');
	
	                        resolve(id);
	                    }).fail(function () {
	                        reject('System error');
	                    }).always(function () {
	                        setLoadValueFalse('bookmark');
	                    });
	                } else {
	                    reject('Queue');
	                }
	            } else {
	                reject('Ur in offline mode');
	            }
	        });
	
	        return prom.then(doNothing, error);
	    };
	
	    this.deleteBookmark = function (id) {
	        var prom = new Promise(function (resolve, reject) {
	            var dd = {
	                markId: id
	            };
	
	            if (mode['online']) {
	                if (!load.bookmark) {
	                    load.bookmark = true;
	
	                    $.ajax({
	                        method: 'POST',
	                        url: '/book/bookmark/delete/_' + bookId,
	                        data: JSON.stringify(dd),
	                        contentType: "application/json; charset=utf-8"
	                    }).done(function () {
	                        msg('Bookmark was deleted');
	
	                        resolve(id);
	                    }).fail(function () {
	                        reject('System error');
	                    }).always(function () {
	                        setLoadValueFalse('bookmark');
	                    });
	                } else {
	                    reject('Queue');
	                }
	            } else {
	                reject('Ur in offline mode');
	            }
	        });
	
	        return prom.then(function (id) {
	            thus.__int__bookmark.deleteBookmark(id);
	        }, error);
	    };
	
	    this.reloadBookmark = function () {
	        var prom = new Promise(function (resolve, reject) {
	            if (mode['online']) {
	                if (bookId) {
	                    if (!load.reloadBookmark) {
	                        load.reloadBookmark = true;
	
	                        $.ajax({
	                            method: 'GET',
	                            url: '/book/bookmark/get/_' + bookId
	                        }).done(function (d) {
	                            loadBookmarks(d);
	
	                            resolve();
	                        }).fail(function () {
	                            reject('System error');
	                        }).always(function () {
	                            setLoadValueFalse('reloadBookmark');
	                        });
	                    } else {
	                        reject('Ur already reload');
	                    }
	                } else {
	                    reject('Ur must open the book');
	                }
	            } else {
	                reject('Ur in offline mode');
	            }
	        });
	
	        return prom.then(doNothing, error);
	    };
	
	    /**
	     *
	     * @param anyway - save if load.save is true
	     * @returns {Promise}
	     */
	    this.save = function (anyway) {
	        var prom = new Promise(function (resolve, reject) {
	            if (!thus.isSaved()) {
	                if (mode['online']) {
	                    if (bookId) {
	                        if (!load.save || anyway) {
	                            (function () {
	                                load.save = true;
	
	                                // disable edit/delete bookmarks
	                                $('.bookmarks > .btn-bookmark-edit').data('disable', 'true');
	
	                                var tmpSave = screen.pos;
	
	                                var dd = {
	                                    pos: tmpSave,
	                                    bookmarks: []
	                                };
	
	                                for (var i = 0; i < __bookmarks.length; ++i) {
	                                    dd.bookmarks.push(__bookmarks[i]);
	                                }
	
	                                // JSON
	                                $.ajax({
	                                    method: 'POST',
	                                    url: './book/save/_' + bookId,
	                                    data: JSON.stringify(dd),
	                                    contentType: "application/json; charset=utf-8"
	                                }).done(function () {
	
	                                    saved.pos = tmpSave;
	                                    __bookmarks = [];
	                                    saved.bookmarkCount = 0;
	
	                                    if (dd.bookmarks.length > 0) {
	                                        $.ajax({
	                                            method: 'GET',
	                                            url: '/book/bookmark/get/_' + bookId
	                                        }).done(function (d) {
	                                            loadBookmarks(d);
	
	                                            try {
	                                                resolve();
	                                            } catch (err) {}
	                                        });
	                                    } else {
	                                        try {
	                                            resolve();
	                                        } catch (err) {}
	                                    }
	                                }).fail(function () {
	                                    error('System error');
	
	                                    reject();
	                                }).always(function () {
	                                    setLoadValueFalse('save');
	                                });
	                            })();
	                        } else {
	                            msg('Ur already save');
	
	                            reject();
	                        }
	                    } else {
	                        //error('U must open book');
	
	                        try {
	                            resolve();
	                        } catch (err) {}
	                    }
	                } else {
	                    msg('Ur in offline mode');
	
	                    reject();
	                }
	            } else {
	                resolve();
	            }
	        });
	
	        return prom.then(doNothing, error);
	    };
	
	    this.isSaved = function () {
	        return saved.pos == screen.pos && __bookmarks.length == 0;
	    };
	
	    /**
	     * Switch online <-> offline
	     * Add class offline for all el.online
	     * Emmit when checkConnect false
	     */
	    this.swapOnlineMode = function () {
	        mode['online'] = !mode['online'];
	        if (mode['online']) {
	            $('.online').removeClass('offline');
	            debug('Online mode');
	
	            setTimeout(checkConnect, 1000 * 60);
	            thus.save();
	        } else {
	            $('.online').addClass('offline');
	
	            debug('Offline mode');
	        }
	    };
	
	    /**
	     * Switch day <-> night
	     * Add or remove class night on #book
	     */
	    this.swapNightMode = function () {
	        mode['night'] = !mode['night'];
	        if (mode['night']) {
	            bookEl.addClass('night');
	        } else {
	            bookEl.removeClass('night');
	        }
	    };
	
	    /**
	     * Write array of bookmarks in let lb = #listOfBookmarks
	     * Add bookmarks in slider
	     * sync
	     * @param bm - array of bookmarks
	     */
	    function loadBookmarks(bm) {
	        var lb = $('#listOfBookmarks');
	
	        //debug(bm);
	
	        // bm and slider clear
	        lb.empty();
	        sliderBookMarks.empty();
	
	        bm.sort(function (a, b) {
	            if (+a.pos > +b.pos) return 1;
	            if (+a.pos < +b.pos) return -1;
	
	            return 0;
	        });
	
	        for (var k in bm) {
	            if (bm.hasOwnProperty(k)) {
	                var tmp = $('<div data-id="' + bm[k]._id + '">\n                    <div class="bookmark-pos hide">' + bm[k].pos + '</div>\n                    <div class="bookmark-title contenteditable">' + bm[k].title + '</div>\n                    <div class="bookmark-text contenteditable">' + bm[k].text + '</div>\n                    <a class="icon btn-bookmark-goto">' + bm[k].pos + '</a>\n                    <a class="icon btn-bookmark-edit online">E</a>\n                    <a class="icon btn-bookmark-save online">S</a>\n                    <a class="icon btn-bookmark-delete online">D</a>\n                </div>').addClass('bookmark').data('pos', bm[k].pos);
	
	                lb.append(tmp);
	
	                var el = $('<div></div>').addClass('mark-user').css('top', bm[k].pos / maxPos * sliderHeight).data('pos', bm[k].pos).click(function () {
	                    thus.jmp($(this).data('pos'));
	                    thus.selectEl($(this).data('pos'), 'jump');
	                });
	
	                sliderBookMarks.append(el);
	            }
	        }
	
	        thus.__int__bookmark.reset();
	    }
	
	    /**
	     * Write book{bookId} in #book
	     * async: get info about book{/book/info/_:id}
	     * get fb2 file{/store/book/get/_:info.id}
	     * parse book
	     * add id, mark, slider, footnote
	     * @param id - bookId
	     * @returns {Promise}
	     */
	    this.getBook = function (id) {
	        var prom = new Promise(function (resolve, reject) {
	
	            if (mode['online']) {
	                if (id && id != 0) {
	                    if (!load.book) {
	                        load.book = true;
	
	                        thus.save(true);
	
	                        $.get({
	                            url: './book/info/_' + id
	                        }).done(function (d) {
	                            info = d;
	
	                            $.get({
	                                url: './store/book/get/_' + info._id,
	                                xhrFields: {
	                                    responseType: 'arraybuffer'
	                                }
	                            }).done(function (fl) {
	                                thus.__int__loading.play();
	
	                                var blobWithBook = new Blob([fl], {
	                                    type: 'application/x-fictionbook+xml'
	                                });
	
	                                window.blobb = blobWithBook;
	
	                                var fb2 = new _filejs2.default(blobWithBook, {
	                                    type: 'application/x-fictionbook+xml',
	                                    workerPath: '/js/workers/'
	                                });
	
	                                fb2.read().then(function (doc) {
	                                    bookDoc = doc;
	
	                                    bookEl.empty();
	                                    bookEl.append(doc.html());
	
	                                    json = doc.json();
	                                    thus.json = json;
	
	                                    maxPos = 0;
	
	                                    // book
	                                    $('.jf-page > *').each(function (i) {
	                                        var tt = $(this);
	
	                                        tt.attr('id', 'p_' + i);
	                                        tt.addClass('h-l');
	                                        tt.data('id', i);
	
	                                        __[i] = tt;
	                                        ++maxPos;
	                                    });
	
	                                    // mark
	                                    sliderMarks.empty();
	
	                                    var el0 = $('<div></div>').addClass('mark-div').click(function () {
	                                        thus.jmp(0);
	                                        thus.selectEl(0, 'jump');
	                                    });
	
	                                    sliderMarks.append(el0);
	
	                                    $('.jf-page > div.h-l').each(function () {
	                                        var id = $(this).data('id');
	
	                                        if ($(this).next().children() && $(this).next().children()[0] && $(this).next().children()[0].tagName === 'A' && $(this).next().children()[0].name) {
	                                            // number of footnote
	
	                                        } else {
	                                            if ($(this).attr('class').indexOf('title') >= 0) {
	                                                if (id > 10) {
	                                                    var el = $('<div></div>').addClass('mark-div').css('top', id / maxPos * sliderHeight).click(function () {
	                                                        thus.jmp(id);
	                                                        thus.selectEl(id, 'jump');
	                                                    });
	
	                                                    sliderMarks.append(el);
	                                                }
	                                            }
	                                        }
	                                    });
	
	                                    // footnote
	                                    $('.jf-page a').click(function () {
	                                        var id = $(this).attr('href').substr(1);
	                                        var num = $(this).html();
	                                        var text = '';
	
	                                        $('#book a[name=' + id + ']').each(function () {
	                                            text += $(this).closest('p.h-l').html();
	                                            text += '<br>';
	                                        });
	
	                                        thus.__int__controllerLeft('navigate');
	
	                                        footnote.empty();
	                                        var el = $('<div class="footnote">\n\t                                                    <p style="text-align: center">' + (num || '') + '</p>\n\t                                                    <p>' + (text || '') + '</p>\n\t                                                </div>\n                                        ');
	                                        footnote.append(el);
	
	                                        return false;
	                                    });
	
	                                    $('.jf-page a').dblclick(function () {
	                                        var id = $(this).attr('href').substr(1);
	                                        var pos = $('a[name=' + id + ']').closest('p.h-l').data('id');
	
	                                        thus.jmp(pos);
	                                    });
	
	                                    jump.list.length = 0;
	                                    jump.list.push(info.pos);
	                                    jump.it = 1;
	
	                                    screen.pos = info.pos;
	                                    screen.now = 0;
	
	                                    scrollEl(info.pos);
	
	                                    loadBookmarks(info.bookmarks);
	
	                                    bookId = id;
	
	                                    thus.__int__loading.stop();
	                                    msg(info.title + ' was load.');
	
	                                    try {
	                                        resolve();
	                                    } catch (err) {}
	                                }, function (e) {
	                                    thus.__int__loading.stop();
	                                    error('Can not read this file. ' + e);
	                                    reject();
	                                });
	                            }).fail(function () {
	                                error('This book did not load.');
	                                reject();
	                            }).always(function () {
	                                setLoadValueFalse('book');
	                            });
	                        }).fail(function () {
	                            setLoadValueFalse('book');
	
	                            //bookEl.empty();
	                            //bookEl.append($('<span>Can not load file.</span>'));
	
	                            error('Info did not get.');
	                            reject();
	                        });
	                    } else {
	                        msg('Ur loading book now');
	                        reject();
	                    }
	                }
	            }
	        });
	
	        return prom.then(doNothing, error);
	    };
	
	    this.deleteBook = function (id, title) {
	        if (mode['online']) {
	            if (confirm('rU sure u want delete this book{title: ' + title + '} ')) {
	                if (!load.del) {
	                    load.del = true;
	
	                    $.ajax({
	                        url: './store/book/delete/_' + id,
	                        method: 'POST'
	                    }).done(function () {
	                        msg('Book has been deleted.');
	
	                        //thus.save(true);
	
	                        location.reload();
	                    }).fail(function () {
	                        error('You can not delete this book.');
	                    }).always(function () {
	                        setLoadValueFalse('del');
	                    });
	                } else {
	                    msg('Ur already delete book');
	                }
	            }
	        }
	    };
	    /*
	        this.scrollEl = function(id) {
	            let top = $('#p_' + id).offset().top - offset_book;
	            $(document).scrollTop(top);
	        };
	    
	        this.scroll = function(flag, px) {
	            if (!flag)
	            {
	                shift = $(document).scrollTop();
	                shift += (line_cnt - 4) * line_size;
	                $(document).scrollTop(shift);
	            }
	            else
	            {
	                shift = $(document).scrollTop();
	                shift -= (line_cnt - 4) * line_size;
	                $(document).scrollTop(shift);
	            }
	        };
	    */
	
	    /***
	     * scroll 1 string
	     * only for cb in player
	     */
	    function scrollOneString() {
	        thus.scroll(false, 0.001);
	    }
	
	    /**
	     * scrollEl(id) + save jmp pos
	     * @param id - scroll pos
	     */
	    this.jmp = function (id) {
	        if (arguments.length == 0) {
	            id = screen.pos;
	        }
	
	        if (Math.abs(jump.list[jump.it - 1] - screen.pos) > 3) {
	            jump.list.push(screen.pos);
	            ++jump.it;
	        }
	
	        scrollEl(id);
	    };
	
	    /**
	     * go to undo position
	     * @return how long to finish jumping
	     */
	    this.jmpUndo = function () {
	        if (jump.it == jump.list.length) {
	            if (jump.list[jump.it - 1] && jump.list[jump.it - 1] != screen.pos) {
	                jump.list.push(screen.pos);
	            }
	        }
	
	        if (jump.it > 0) {
	            --jump.it;
	            if (jump.list[jump.it] == screen.pos) {
	                return this.jmpUndo();
	            }
	            scrollEl(jump.list[jump.it]);
	
	            if (jump.timer) {
	                clearTimeout(jump.timer);
	            }
	
	            jump.timer = setTimeout(function () {
	                jump.list.length = jump.it;
	            }, 60 * 1000);
	        }
	
	        return jump.it;
	    };
	
	    /**
	     * go to redo position
	     * @return how long to finish jumping
	     */
	    this.jmpRedo = function () {
	        if (jump.it < jump.list.length) {
	            if (jump.list[jump.it] == screen.pos) {
	                ++jump.it;
	                return this.jmpRedo();
	            }
	            scrollEl(jump.list[jump.it]);
	
	            ++jump.it;
	
	            if (jump.timer) {
	                clearTimeout(jump.timer);
	            }
	
	            jump.timer = setTimeout(function () {
	                jump.list.length = jump.it;
	            }, 60 * 1000);
	        }
	
	        return jump.it - jump.list.length;
	    };
	
	    /** System function
	     *  @param id - first element
	     *  @param scroll - body{scrollTop} before movement
	     *  @set book.pos = id, over view = coef
	    */
	    function scrollEl(id, scroll) {
	        $(document).scrollTop(0);
	
	        if (typeof scroll == 'undefined') {
	            scroll = 0;
	        }
	
	        if (typeof id == 'undefined') {
	            id = screen.pos;
	        }
	
	        if (id < 0) {
	            scrollEl(0);
	
	            return;
	        }
	        if (id >= maxPos) {
	            scrollEl(maxPos - 1);
	
	            return;
	        }
	
	        var hV = 0;
	        var shV = 0;
	        var shH = screen.now;
	
	        if (isNaN(id) || id < 0 || id >= maxPos) {
	            scrollEl(0); //debug(id);
	
	            return;
	        }
	
	        // how much i must show
	        do {
	            hV += __[id + shV].innerHeight();
	            ++shV;
	
	            //debug(shV, hV, height);
	        } while (hV < height + scroll && id + shV < maxPos);
	
	        // pos + now -> hide
	        for (var k = 0; k < shH; ++k) {
	            __[screen.pos + k].hide();
	        }
	
	        // id + sh -> show
	        for (var _k = 0; _k < shV; ++_k) {
	            __[id + _k].show();
	
	            //debug(id + k);
	        }
	
	        screen = {
	            pos: id,
	            now: shV
	        };
	
	        sliderTop(screen.pos);
	
	        //debug('New pos = %d, now show %d elems', screen.pos, screen.now);
	    }
	    /**
	     *
	     * @param isUp - direction for movement, isUp == true if Up, isUp == false if Down
	     * @param coef < 1
	     * @param deltaY - for coef, coef = 3 * book{lineSize} / book{height} * deltaY / 100
	     * @set book.pos
	     */
	    this.scroll = function (isUp, coef, deltaY) {
	        coef = coef || 1;
	        if (deltaY) {
	            coef = 3 * lineSize / height * deltaY / 100;
	        } else if (coef < 1 / 8) {
	            coef = getPerOfLineSize();
	        }
	
	        var _coef = coef;
	        var scroll = $(document).scrollTop();
	        $(document).scrollTop(0);
	
	        if (!isUp) {
	            // down
	            {
	                // all cases
	                var id = screen.pos;
	                var hV = 0;
	                var shV = 0;
	
	                //debug(' POS = ' + id); debug('!!!!' + (maxPos == __.length));
	
	                // how much i must show
	
	                do {
	                    //debug('curr = ' + (id + shV)); debug('H = ' + hV);
	                    hV += __[id + shV].innerHeight();
	                    ++shV;
	                } while (hV < height * _coef + scroll && id + shV < maxPos);
	                --shV;
	
	                if (id + shV == maxPos) {
	                    scrollEl(maxPos - 1);
	                } else {
	                    if (shV > 0) {
	                        var elapsed = height * _coef + scroll - hV + __[id + shV].innerHeight();
	                        if (elapsed >= 0) {
	                            scrollEl(id + shV, elapsed);
	
	                            $(document).scrollTop(elapsed);
	                        } else {
	                            alert(elapsed);
	                        }
	                    } else {
	                        var _elapsed = height * _coef + scroll;
	                        if (_elapsed >= 0) {
	                            scrollEl(id, _elapsed);
	
	                            $(document).scrollTop(_elapsed);
	                        } else {
	                            alert(_elapsed);
	                        }
	                    }
	                }
	            }
	        } else {
	            // up
	            if (screen.pos == 0) {
	                return 1;
	            } else {
	                // all cases
	                var _id = screen.pos;
	                var _hV = 0;
	                var _shV = 0;
	
	                while (_hV < height * _coef - scroll && _id - _shV > 0) {
	                    ++_shV;
	                    _hV += __[_id - _shV].innerHeight();
	                }
	
	                if (_id - _shV == 0) {
	                    scrollEl(0);
	                } else {
	                    if (_shV > 0) {
	                        var _elapsed2 = _hV - height * _coef + scroll;debug('-------NEW elapsed. scroll = ' + _elapsed2);
	
	                        if (_elapsed2 >= 0) {
	                            scrollEl(_id - _shV, _elapsed2);
	
	                            $(document).scrollTop(_elapsed2);
	                        } else {
	                            alert(_elapsed2);
	                        }
	                    } else {
	                        var _elapsed3 = scroll - height * _coef;debug(_elapsed3);
	                        if (_elapsed3 >= 0) {
	                            scrollEl(_id, _elapsed3);
	
	                            $(document).scrollTop(_elapsed3);
	                        } else {
	                            alert(_elapsed3);
	                        }
	                    }
	                }
	            }
	        }
	    };
	
	    //  Y := (coor.Y - offset)
	    //  @set up  book <- cursor(Y)
	    //  -----------------------
	    //  @set up  book <- slider(ccs.top)
	    this.scrollSlider = function (Y) {
	        if (arguments.length) {
	            // slider <- id
	            thus.jmp(sliderPos(Y));
	
	            //scrollTop(screen.pos);
	        } else {
	            // id <- slider
	            thus.jmp(sliderPos(slider.cssInt('top')));
	            sliderTop(screen.pos);
	        }
	    };
	
	    function checkConnect() {
	        if (mode['online']) {
	            $.get('./echo/_').done(function () {
	                setTimeout(checkConnect, ECHO_TIMEOUT);
	            }).fail(function () {
	                if (mode['online']) {
	                    $('#onlineMode').trigger('click');
	                }
	            });
	        }
	    }
	
	    setTimeout(checkConnect, 1000 * 60);
	
	    this.getUserInfo = function () {
	        var prom = new Promise(function (resolve, reject) {
	            if (mode['online']) {
	                if (!load.user) {
	                    load.user = true;
	
	                    $.get('/login/info').done(function (t) {
	                        user = t;
	
	                        try {
	                            resolve();
	                        } catch (err) {}
	                    }).fail(function () {
	                        reject();
	                    }).always(function () {
	                        load.user = false;
	                    });
	                } else {
	                    setTimeout(function () {
	                        thus.ready(resolve);
	                    }, 500);
	                }
	            }
	        });
	
	        return prom.then(doNothing, error);
	    };
	
	    this.ready = function (cb) {
	        if (user && !load.user) {
	            //thus.__int__loading.play();
	            try {
	                cb(thus);
	            } catch (err) {}
	            thus.__int__loading.stop();
	        } else {
	
	            thus.getUserInfo().then(function () {
	                cb(thus);
	            }, error);
	        }
	    };
	
	    this.update = function (cb) {
	        user = undefined;
	
	        thus.getUserInfo().then(cb, error);
	    };
	
	    this.getFiles = function () {
	        thus.ready(function () {
	            fs.empty();
	            fs.append($('<ol>'));
	
	            for (var t in user.books) {
	                //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop,JSUnfilteredForInLoop
	                var appEl = $('<div>').html(user.books[t].author + ' : ' + user.books[t].title).data('id', user.books[t].id).addClass('fs').addClass('online');
	
	                //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
	                var iconDel = $('<span>').html('X').addClass('fs-del').addClass('online').data('id', user.books[t].id).data('title', user.books[t].title);
	
	                var li = $('<li>').append(appEl);
	                var divControl = $('<div>').addClass('fs-control').append(iconDel);
	
	                li.append(divControl);
	                fs.append(li);
	            }
	
	            $('.fs').click(function () {
	                var id = $(this).data('id');
	                thus.getBook(id);
	            });
	
	            $('.fs-del').click(function (e) {
	                e.stopPropagation();
	
	                var id = $(this).data('id');
	                var title = $(this).data('title');
	                thus.deleteBook(id, title);
	            });
	        });
	    };
	
	    this.recalc = function () {
	        lineSize = +bookEl.css('line-height').slice(0, -2);
	        height = hiddenEl.height();
	        lineCnt = Math.floor(hiddenEl.height() / lineSize);
	        offsetBook = bookEl.offset().top;
	    };
	
	    function getPerOfLineSize() {
	        return lineSize / height;
	    }
	
	    this.recalc();
	    this.getUserInfo().then(function () {
	        if (user.lastBook != '0') {
	            thus.getBook(user.lastBook);
	        }
	    }, error);
	
	    window.onbeforeunload = function (e) {
	        if (mode['online']) {
	            if (!thus.isSaved()) {
	
	                thus.save(true);
	            }
	        } else {
	            e.returnValue = 'U don\'t save pos (' + Math.abs(screen.pos - saved.pos) + ') and u have ' + saved.bookmarkCount + ' bookmarks';
	
	            return 'U don\'t save pos (' + Math.abs(screen.pos - saved.pos) + ') and u have ' + saved.bookmarkCount + ' bookmarks';
	        }
	    };
	    // GETTER
	
	    this.getMaxPos = function () {
	        return maxPos;
	    };
	
	    this.getPos = function () {
	        return screen.pos;
	    };
	
	    this.debug = function () {
	        return __[screen.pos];
	    };
	
	    return this;
	};
	
	exports.__book = __book;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(1)))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {'use strict';var _typeof2=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};(function webpackUniversalModuleDefinition(root,factory){if(( false?'undefined':_typeof2(exports))==='object'&&( false?'undefined':_typeof2(module))==='object')module.exports=factory();else if(true)!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if((typeof exports==='undefined'?'undefined':_typeof2(exports))==='object')exports["JsFile"]=factory();else root["JsFile"]=factory();})(undefined,function(){return(/******/function(modules){// webpackBootstrap
	/******/// The module cache
	/******/var installedModules={};/******/// The require function
	/******/function __webpack_require__(moduleId){/******/// Check if module is in cache
	/******/if(installedModules[moduleId])/******/return installedModules[moduleId].exports;/******/// Create a new module (and put it into the cache)
	/******/var module=installedModules[moduleId]={/******/exports:{},/******/id:moduleId,/******/loaded:false/******/};/******/// Execute the module function
	/******/modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);/******/// Flag the module as loaded
	/******/module.loaded=true;/******/// Return the exports of the module
	/******/return module.exports;/******/}/******/// expose the modules object (__webpack_modules__)
	/******/__webpack_require__.m=modules;/******/// expose the module cache
	/******/__webpack_require__.c=installedModules;/******/// __webpack_public_path__
	/******/__webpack_require__.p="";/******/// Load entry module and return exports
	/******/return __webpack_require__(0);/******/}(/************************************************************************//******/[/* 0 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _object=__webpack_require__(1);var _object2=_interopRequireDefault(_object);var _string=__webpack_require__(2);var _string2=_interopRequireDefault(_string);var _read=__webpack_require__(3);var _read2=_interopRequireDefault(_read);var _index=__webpack_require__(6);var _index2=_interopRequireDefault(_index);var _index3=__webpack_require__(16);var _index4=_interopRequireDefault(_index3);var _isSupported=__webpack_require__(5);var _isSupported2=_interopRequireDefault(_isSupported);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var documentEngines=[];var mimeTypes=[];var version=true?"0.1.16":'';(0,_object2.default)();(0,_string2.default)();var JsFile=function(){function JsFile(file,config){_classCallCheck(this,JsFile);this.file=file;this.read=_read2.default;this.config={workerPath:'js/workers/'};for(var k in config){if(config.hasOwnProperty(k)){this.config[k]=config[k];}}}_createClass(JsFile,[{key:'findEngine',value:function findEngine(){var file=this.file;var result=null;documentEngines.some(function(Engine){if(Engine.test(file)){result=Engine;return true;}});return result;}}],[{key:'removeEngine',value:function removeEngine(Engine){if(!Engine){documentEngines.length=0;}else{var index=documentEngines.indexOf(Engine);if(index>=0){documentEngines.splice(index,1);}}return this;}}]);return JsFile;}();Object.defineProperties(JsFile,{mimeTypes:{enumerable:false,get:function get(){return mimeTypes.slice(0);}},isSupported:{/**
	                     * @description Check required technologies
	                     * @returns {boolean}
	                     */get:_isSupported2.default},version:{value:version},Engine:{value:_index4.default},Document:{value:_index2.default},defineEngine:{/**
	                     *
	                     * @param name
	                     * @param mime
	                     * @returns {Engine}
	                     */value:defineEngine}});function defineEngine(){var Engine=arguments.length<=0||arguments[0]===undefined?{}:arguments[0];var engineMimeTypes=Engine.mimeTypes;if(typeof Engine.test==='function'&&Array.isArray(engineMimeTypes)){mimeTypes.push.apply(mimeTypes,engineMimeTypes);return documentEngines.push(Engine);}return null;}exports.default=JsFile;/***/},/* 1 *//***/function(module,exports){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=function(){/**
	                 * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/merge
	                 */if(!Object.merge){Object.defineProperty(Object,'merge',{enumerable:false,configurable:true,writable:true,value:function value(target){if(target===undefined||target===null){throw new TypeError('Cannot convert first argument to object');}var to=Object(target);for(var i=1;i<arguments.length;i++){var nextSource=arguments[i];if(nextSource===undefined||nextSource===null){continue;}nextSource=Object(nextSource);var keysArray=Object.keys(Object(nextSource));for(var nextIndex=0,len=keysArray.length;nextIndex<len;nextIndex++){var nextKey=keysArray[nextIndex];var desc=Object.getOwnPropertyDescriptor(nextSource,nextKey);if(desc!==undefined&&desc.enumerable){to[nextKey]=nextSource[nextKey];}}}return to;}});}};/***/},/* 2 *//***/function(module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.default=function(){String.prototype.includes=String.prototype.includes||function(){return this.indexOf.apply(this,arguments)!==-1;};};/***/},/* 3 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=read;var _errors=__webpack_require__(4);var _isSupported=__webpack_require__(5);var _isSupported2=_interopRequireDefault(_isSupported);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}/**
	             * @description Read the file
	             * @returns {Promise}
	             */function read(){if(!(0,_isSupported2.default)()){return Promise.reject(new Error(_errors.requiredTechnologies));}var file=this.file;if(!file||!(file instanceof File||file instanceof Blob)){return Promise.reject(new Error(_errors.invalidFileType));}var Engine=this.findEngine(file);if(!Engine){return Promise.reject(new Error(_errors.invalidFileType));}var engine=new Engine(file,this.config);var parser=engine[engine.parser]||engine.parser;if(typeof parser==='function'){return parser.call(engine);}return Promise.reject(new Error(_errors.invalidParser));}/***/},/* 4 *//***/function(module,exports){'use strict';Object.defineProperty(exports,"__esModule",{value:true});/**
	             * @description error objects
	             */var invalidFileType=exports.invalidFileType='Invalid file type. It must be an instance of File or Blob';var invalidLoadFile=exports.invalidLoadFile='Can\'t load the file';var invalidReadFile=exports.invalidReadFile='Can\'t read the file';var requiredTechnologies=exports.requiredTechnologies='Doesn\'t have required technologies';var invalidParser=exports.invalidParser='Doesn\'t have a parser';var invalidReadArchive=exports.invalidReadArchive='Can\'t read the archive';var notFoundMethodCreateDocument=exports.notFoundMethodCreateDocument='Method `createDocument` not found';/***/},/* 5 *//***/function(module,exports){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=function(){return Boolean(typeof File!=='undefined'&&typeof Blob!=='undefined'&&typeof FileReader!=='undefined'&&typeof ArrayBuffer!=='undefined'&&typeof Uint8Array!=='undefined'&&typeof DataView!=='undefined'&&Blob.prototype.slice);};/***/},/* 6 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _index=__webpack_require__(7);var _index2=_interopRequireDefault(_index);var _merge=__webpack_require__(15);var _merge2=_interopRequireDefault(_merge);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}/**
	             * @param attrs
	             */var Document=function(){function Document(){var attrs=arguments.length<=0||arguments[0]===undefined?{}:arguments[0];_classCallCheck(this,Document);this._data={meta:(0,_merge2.default)({name:'',language:''},attrs.meta),content:[],styles:[]};if(Array.isArray(attrs.content)){this._data.content=attrs.content;}if(Array.isArray(attrs.styles)){this._data.styles=attrs.styles;}var zoom=Number(this._data.meta.zoom);var wordsCount=Number(this._data.meta.wordsCount);if(isNaN(zoom)||zoom<0||zoom>100){zoom=100;}else{zoom=Math.round(zoom*100)/100;}if(isNaN(wordsCount)||wordsCount<0){wordsCount=0;}this._data.meta.zoom=zoom;this._data.meta.wordsCount=wordsCount;}_createClass(Document,[{key:'html',value:function html(options){var html=new _index2.default(options);return html.buildDocument(this._data);}},{key:'json',value:function json(){return(0,_merge2.default)(this._data);}},{key:'page',value:function page(index){return(0,_merge2.default)(this._data.content[index]);}}]);return Document;}();Object.defineProperties(Document,{elementPrototype:{get:function get(){return{children:[],style:{position:'relative',boxSizing:'border-box'},properties:{tagName:'DIV',textContent:'',class:''}};}}});/**
	             *
	             */Object.defineProperties(Document.prototype,{/**
	                 *
	                 */language:{get:function get(){return this._data.meta.language;}},/**
	                 *
	                 */name:{get:function get(){return this._data.meta.name;}},/**
	                 *
	                 */wordsCount:{get:function get(){return this._data.meta.wordsCount;}},/**
	                 *
	                 */length:{get:function get(){return this._data.content.length;}},/**
	                 *
	                 */zoom:{get:function get(){return this._data.meta.zoom;}},/**
	                 *
	                 */isEmpty:{get:function get(){return!(this._data.content&&this._data.content[0]);}}});exports.default=Document;/***/},/* 7 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _buildElement=__webpack_require__(8);var _buildElement2=_interopRequireDefault(_buildElement);var _buildPageNumber=__webpack_require__(9);var _buildPageNumber2=_interopRequireDefault(_buildPageNumber);var _buildStyle=__webpack_require__(10);var _buildStyle2=_interopRequireDefault(_buildStyle);var _setStyles=__webpack_require__(13);var _setStyles2=_interopRequireDefault(_setStyles);var _setProperties=__webpack_require__(14);var _setProperties2=_interopRequireDefault(_setProperties);var _merge=__webpack_require__(15);var _merge2=_interopRequireDefault(_merge);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var Html=function(){function Html(options){_classCallCheck(this,Html);this.options=(0,_merge2.default)({pageClassName:'jf-page'},options);this.setStyles=_setStyles2.default;this.setProperties=_setProperties2.default;this.buildElement=_buildElement2.default;}_createClass(Html,[{key:'buildDocument',value:function buildDocument(){var params=arguments.length<=0||arguments[0]===undefined?{}:arguments[0];var content=params.content;var styles=params.styles;var doc=document.createDocumentFragment();if(!Array.isArray(content)||!Array.isArray(styles)){return doc;}var pageClassName=this.options.pageClassName;content.forEach(function(page){var el=this.buildElement(page);el.classList.add(pageClassName);if(page.properties&&page.properties.pageNumber!=null){(0,_buildPageNumber2.default)(el,page);}doc.appendChild(el);},this);doc.appendChild((0,_buildStyle2.default)(styles,{pageClassName:pageClassName}));return doc;}}]);return Html;}();exports.default=Html;/***/},/* 8 *//***/function(module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.default=function(){var _this=this;var data=arguments.length<=0||arguments[0]===undefined?{}:arguments[0];var properties=data.properties||{};var tagName=properties.tagName;var el=document.createElement(tagName);this.setStyles(el,data);this.setProperties(el,data);(data.children||[]).forEach(function(child){el.appendChild(_this.buildElement(child));});return el;};/***/},/* 9 *//***/function(module,exports){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=function(el){var data=arguments.length<=1||arguments[1]===undefined?{}:arguments[1];var numberBlock=document.createElement('div');var _data$properties=data.properties;var header=_data$properties.header;var pageNumber=_data$properties.pageNumber;if(!header||pageNumber==null){return el;}el.style.position='relative';numberBlock.style.position='absolute';numberBlock.style.top=0;var rule=header.style.height;if(rule){numberBlock.style.top=rule.value+rule.unit;}rule=el.style.paddingRight;if(rule){numberBlock.style.right=rule.value+rule.unit;}numberBlock.appendChild(document.createTextNode(pageNumber.value));el.appendChild(numberBlock);return el;};/***/},/* 10 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=function(styles){var options=arguments.length<=1||arguments[1]===undefined?{}:arguments[1];var el=document.createElement('style');var pageClassName=options.pageClassName?'.'+options.pageClassName:'';var src='';styles.forEach(function(_ref){var properties=_ref.properties;var selector=_ref.selector;var declaration='';properties=(0,_prepareStyleProperties2.default)(properties);for(var prop in properties){if(properties.hasOwnProperty(prop)){declaration+=(0,_toHyphenCase2.default)(prop)+': '+properties[prop]+';\n';}}if(declaration){src+=pageClassName+' '+selector.split(',').join(', '+pageClassName+' ')+' {\n                '+declaration+'\n            }\n';}});if(src){el.appendChild(document.createTextNode(src));}return el;};var _toHyphenCase=__webpack_require__(11);var _toHyphenCase2=_interopRequireDefault(_toHyphenCase);var _prepareStyleProperties=__webpack_require__(12);var _prepareStyleProperties2=_interopRequireDefault(_prepareStyleProperties);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}/***/},/* 11 *//***/function(module,exports){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=function(str){return str.replace(/([a-z])([A-Z])/g,'$1-$2').toLowerCase();};/***/},/* 12 *//***/function(module,exports){'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _typeof=typeof Symbol==="function"&&_typeof2(Symbol.iterator)==="symbol"?function(obj){return typeof obj==='undefined'?'undefined':_typeof2(obj);}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj==='undefined'?'undefined':_typeof2(obj);};exports.default=function(properties){var result={};for(var prop in properties){if(properties.hasOwnProperty(prop)){var value=properties[prop];if((typeof value==='undefined'?'undefined':_typeof(value))==='object'){if(value.unit){result[prop]=value.value+value.unit;}}else{result[prop]=value;}}}return result;};/***/},/* 13 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=function(node){var data=arguments.length<=1||arguments[1]===undefined?{}:arguments[1];var props=(0,_prepareStyleProperties2.default)(data.style);for(var prop in props){if(props.hasOwnProperty(prop)){node.style[prop]=props[prop];}}};var _prepareStyleProperties=__webpack_require__(12);var _prepareStyleProperties2=_interopRequireDefault(_prepareStyleProperties);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}/***/},/* 14 *//***/function(module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.default=function(node,data){for(var prop in data.properties){if(data.properties.hasOwnProperty(prop)&&!nonDomProperties[prop]){node[prop]=data.properties[prop];}}};var nonDomProperties={after:true,tagName:true,pageNumber:true};/**
	             *
	             * @param node
	             * @param data
	             * @private
	             *//***/},/* 15 *//***/function(module,exports){'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _typeof=typeof Symbol==="function"&&_typeof2(Symbol.iterator)==="symbol"?function(obj){return typeof obj==='undefined'?'undefined':_typeof2(obj);}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj==='undefined'?'undefined':_typeof2(obj);};var isSpecificValue=function isSpecificValue(val){return val instanceof Date||val instanceof RegExp;};function cloneSpecificValue(val){if(val instanceof Date){return new Date(val.getTime());}if(val instanceof RegExp){return new RegExp(val);}return val;}function deepCloneArray(){var arr=arguments.length<=0||arguments[0]===undefined?[]:arguments[0];var clone=[];arr.forEach(function(item,index){if((typeof item==='undefined'?'undefined':_typeof(item))==='object'&&item!==null){if(Array.isArray(item)){clone[index]=deepCloneArray(item);}else if(isSpecificValue(item)){clone[index]=cloneSpecificValue(item);}else{clone[index]=merge({},item);}}else{clone[index]=item;}});return clone;}/**
	             * @description deep merge
	             * @param target
	             * @param sources
	             * @returns {*}
	             */function merge(){var target=arguments.length<=0||arguments[0]===undefined?{}:arguments[0];if((typeof target==='undefined'?'undefined':_typeof(target))==='object'){for(var _len=arguments.length,sources=Array(_len>1?_len-1:0),_key=1;_key<_len;_key++){sources[_key-1]=arguments[_key];}sources.forEach(function(src){for(var key in src){if(src.hasOwnProperty(key)){var srcValue=src[key];var targetValue=target[key];// recursion prevention
	if(srcValue===target){continue;}if((typeof srcValue==='undefined'?'undefined':_typeof(srcValue))!=='object'||srcValue===null){target[key]=srcValue;continue;}if(Array.isArray(srcValue)){target[key]=deepCloneArray(srcValue);continue;}if(isSpecificValue(srcValue)){target[key]=cloneSpecificValue(srcValue);continue;}if((typeof targetValue==='undefined'?'undefined':_typeof(targetValue))!=='object'||targetValue===null||Array.isArray(targetValue)){target[key]=merge({},srcValue);continue;}target[key]=merge(targetValue,srcValue);}}});}return target;}exports.default=merge;/***/},/* 16 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _normalizeDataUri=__webpack_require__(17);var _normalizeDataUri2=_interopRequireDefault(_normalizeDataUri);var _validateFile=__webpack_require__(18);var _validateFile2=_interopRequireDefault(_validateFile);var _cropUnit=__webpack_require__(19);var _cropUnit2=_interopRequireDefault(_cropUnit);var _readFileEntry=__webpack_require__(20);var _readFileEntry2=_interopRequireDefault(_readFileEntry);var _readSingleFile=__webpack_require__(22);var _readSingleFile2=_interopRequireDefault(_readSingleFile);var _normalizeColorValue=__webpack_require__(23);var _normalizeColorValue2=_interopRequireDefault(_normalizeColorValue);var _attributeToBoolean=__webpack_require__(25);var _attributeToBoolean2=_interopRequireDefault(_attributeToBoolean);var _formatPropertyName=__webpack_require__(26);var _formatPropertyName2=_interopRequireDefault(_formatPropertyName);var _readArchive=__webpack_require__(27);var _readArchive2=_interopRequireDefault(_readArchive);var _colorsList=__webpack_require__(24);var _colorsList2=_interopRequireDefault(_colorsList);var _validateUrl=__webpack_require__(31);var _validateUrl2=_interopRequireDefault(_validateUrl);var _errors=__webpack_require__(4);var errors=_interopRequireWildcard(_errors);var _clone=__webpack_require__(32);var _clone2=_interopRequireDefault(_clone);var _merge=__webpack_require__(15);var _merge2=_interopRequireDefault(_merge);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}newObj.default=obj;return newObj;}}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var halfTabAsSpaces='  ';var Engine=function(){function Engine(file,config){_classCallCheck(this,Engine);this.file=file;this.fileName=this.file&&this.file.name||'';this.config={};for(var k in config){if(config.hasOwnProperty(k)){this.config[k]=config[k];}}}_createClass(Engine,[{key:'isValid',value:function isValid(){return this.constructor.test(this.file);}}],[{key:'getCharFromHex',value:function getCharFromHex(hex){var code=parseInt(hex,16);return!isNaN(code)?String.fromCharCode(code):'';}},{key:'replaceSpaces',value:function replaceSpaces(str){return String(str||'').replace(/\s{2,}/g,halfTabAsSpaces);}/**
	                     *
	                     * @returns {Boolean}
	                     */},{key:'test',value:function test(){return false;}}]);return Engine;}();Object.defineProperties(Engine.prototype,{parser:{writable:true,value:'readSingleFile'},readFileEntry:{writable:true,value:_readFileEntry2.default},readSingleFile:{writable:true,value:_readSingleFile2.default},readArchive:{writable:true,value:_readArchive2.default}});Object.defineProperties(Engine,{normalizeDataUri:{value:_normalizeDataUri2.default},formatPropertyName:{value:_formatPropertyName2.default},cropUnit:{value:_cropUnit2.default},normalizeColorValue:{value:_normalizeColorValue2.default},attributeToBoolean:{value:_attributeToBoolean2.default},validateUrl:{value:_validateUrl2.default},merge:{value:_merge2.default},clone:{value:_clone2.default},validateFile:{value:_validateFile2.default},errors:{value:(0,_clone2.default)(errors)},colorsList:{value:(0,_clone2.default)(_colorsList2.default)},emDash:{value:'—'},enDash:{value:'–'},halfTabAsSpaces:{value:halfTabAsSpaces},tabAsSpaces:{value:'    '},space:{value:' '},nbsp:{value:' '},nbHyphen:{value:'Ò'}});exports.default=Engine;/***/},/* 17 *//***/function(module,exports){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=function(dataUri){var filename=arguments.length<=1||arguments[1]===undefined?'':arguments[1];var extensionData=/[A-Za-z]+$/.exec(filename);var mime=extensionData&&mimeTypesByExtension[extensionData[0].toLowerCase()];return!mime?dataUri:dataUri.replace(/data:[^;]*;/,'data:'+mime+';');};var mimeTypesByExtension={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',pjpeg:'image/pjpeg',ico:'image/x-icon',gif:'image/gif',svg:'image/svg+xml',woff:'application/font-woff',tif:'image/tiff',tiff:'image/tiff',wbmp:'image/vnd.wap.wbmp'};/**
	             *
	             * @param dataUri
	             * @param filename
	             * @return {String}
	             * @private
	             *//***/},/* 18 *//***/function(module,exports){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=function(file,files){var found=false;if(!file||!files||!(file instanceof File||file instanceof Blob)){return found;}var fileType=file.type;var fileNameData=String(file.name).split('.');var len=fileNameData.length;var fileExtension=len>1?fileNameData[len-1]:'';var mime=files.mime;var extension=files.extension;if(!Array.isArray(mime)){mime=[mime];}found=mime.some(function(type){return fileType.includes(type);});// if not found by mime type find by file extension
	if(!found){if(!Array.isArray(extension)){extension=[extension];}found=extension.some(function(ext){return fileExtension.includes(ext);});}return found;};/***/},/* 19 *//***/function(module,exports){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=function(value){value=Number(String(value).replace(/,/g,'.').replace(/[^0-9.]+/g,''));return!isNaN(value)?value:0;};/***/},/* 20 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=function(){var params=arguments.length<=0||arguments[0]===undefined?{}:arguments[0];if(!params.file){return Promise.reject(new Error(_errors.invalidReadFile));}var _ref=this||{};var _ref$config=_ref.config;var config=_ref$config===undefined?{}:_ref$config;return new Promise(function(resolve,reject){_jstask2.default.run(config.workerPath+'readFile.js',params,function(response){if(!response||response.error){return reject(response&&response.error||new Error(_errors.invalidReadFile));}resolve(response.result);},function(error){reject(error||new Error(_errors.invalidReadFile));});});};var _errors=__webpack_require__(4);var _jstask=__webpack_require__(21);var _jstask2=_interopRequireDefault(_jstask);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}/***/},/* 21 *//***/function(module,exports){'use strict';var maxWorkersCount=typeof navigator!=='undefined'&&navigator.hardwareConcurrency||4;var invalidWorker="Can't run the worker";var queue=[];var createdWorkersCount=0;function done(worker){worker.terminate();createdWorkersCount--;processQueue();}function processQueue(){if(createdWorkersCount<maxWorkersCount){var taskOptions=queue.shift();if(!taskOptions){return;}createdWorkersCount++;var worker=new Worker(taskOptions.url);worker.onmessage=function(e){if(typeof taskOptions.resolve==='function'){taskOptions.resolve(e.data||{});}taskOptions=null;done(this);};worker.onerror=function(){if(typeof taskOptions.reject==='function'){taskOptions.reject(new Error(invalidWorker));}taskOptions=null;done(this);};worker.postMessage(taskOptions.data);}}/**
	             * @constructor
	             * @param url {String}
	             * @param data {Object}
	             * @param resolve {Function}
	             * @param reject {Function}
	             */module.exports={run:function run(url,data,resolve,reject){queue.push({token:Date.now(),url:url,data:data,resolve:resolve,reject:reject});processQueue();}};/***/},/* 22 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=readSingleFile;var _errors=__webpack_require__(4);function readSingleFile(){var _this=this;if(!this.isValid()){return Promise.reject(new Error(_errors.invalidFileType));}return new Promise(function(resolve,reject){_this.readFileEntry({file:_this.file}).then(function(result){if(typeof _this.createDocument!=='function'){throw new Error(_errors.notFoundMethodCreateDocument);}return _this.createDocument(result);}).then(resolve).catch(function(rejection){return reject(rejection||new Error(_errors.invalidReadFile));});});}/***/},/* 23 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=function(value){if(!value||typeof value!=='string'){return defaultColor;}value=value.replace(/\s+/g,'');if(/^#/.test(value)){return value.toUpperCase();}if(!isNaN(Number('0x'+value))){return'#'+value.toUpperCase();}value=value.toLowerCase();return _colorsList2.default[value]||defaultColor;};var _colorsList=__webpack_require__(24);var _colorsList2=_interopRequireDefault(_colorsList);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var defaultColor=_colorsList2.default.black;/**
	             * @description Adjunct a color value to a single mind
	             * @param value
	             * @return {String}
	             * @private
	             *//***/},/* 24 *//***/function(module,exports){'use strict';Object.defineProperty(exports,"__esModule",{value:true});/**
	             *
	             * @private
	             */exports.default={black:'#000000',navy:'#000080',darkblue:'#00008B',mediumblue:'#0000CD',blue:'#0000FF',darkgreen:'#006400',green:'#008000',teal:'#008080',darkcyan:'#008B8B',deepskyblue:'#00BFFF',darkturquoise:'#00CED1',mediumspringgreen:'#00FA9A',lime:'#00FF00',springgreen:'#00FF7F',aqua:'#00FFFF',cyan:'#00FFFF',midnightblue:'#191970',dodgerblue:'#1E90FF',lightseagreen:'#20B2AA',forestgreen:'#228B22',seagreen:'#2E8B57',darkslategray:'#2F4F4F',limegreen:'#32CD32',mediumseagreen:'#3CB371',turquoise:'#40E0D0',royalblue:'#4169E1',steelblue:'#4682B4',darkslateblue:'#483D8B',mediumturquoise:'#48D1CC',white:'#FFFFFF',indigo:'#4B0082',darkolivegreen:'#556B2F',cadetblue:'#5F9EA0',cornflowerblue:'#6495ED',mediumaquamarine:'#66CDAA',dimgray:'#696969',slateblue:'#6A5ACD',olivedrab:'#6B8E23',slategray:'#708090',lightslategray:'#778899',mediumslateblue:'#7B68EE',lawngreen:'#7CFC00',chartreuse:'#7FFF00',aquamarine:'#7FFFD4',maroon:'#800000',purple:'#800080',olive:'#808000',gray:'#808080',skyblue:'#87CEEB',lightskyblue:'#87CEFA',blueviolet:'#8A2BE2',darkred:'#8B0000',darkmagenta:'#8B008B',saddlebrown:'#8B4513',darkseagreen:'#8FBC8F',lightgreen:'#90EE90',mediumpurple:'#9370D8',darkviolet:'#9400D3',palegreen:'#98FB98',darkorchid:'#9932CC',yellowgreen:'#9ACD32',sienna:'#A0522D',brown:'#A52A2A',darkgray:'#A9A9A9',lightblue:'#ADD8E6',greenyellow:'#ADFF2F',paleturquoise:'#AFEEEE',lightsteelblue:'#B0C4DE',powderblue:'#B0E0E6',firebrick:'#B22222',darkgoldenrod:'#B8860B',mediumorchid:'#BA55D3',rosybrown:'#BC8F8F',darkkhaki:'#BDB76B',silver:'#C0C0C0',mediumvioletred:'#C71585',indianred:'#CD5C5C',peru:'#CD853F',chocolate:'#D2691E',tan:'#D2B48C',lightgray:'#D3D3D3',palevioletred:'#D87093',thistle:'#D8BFD8',orchid:'#DA70D6',goldenrod:'#DAA520',crimson:'#DC143C',gainsboro:'#DCDCDC',plum:'#DDA0DD',burlywood:'#DEB887',lightcyan:'#E0FFFF',lavender:'#E6E6FA',darksalmon:'#E9967A',violet:'#EE82EE',palegoldenrod:'#EE82EE',airforceblue:'#5D8AA8',aliceblue:'#F0F8FF',alizarincrimson:'#E32636',almond:'#EFDECD',amaranth:'#E52B50',lightcoral:'#F08080',khaki:'#F0E68C',honeydew:'#F0FFF0',azure:'#F0FFFF',sandybrown:'#F4A460',wheat:'#F5DEB3',beige:'#F5F5DC',whitesmoke:'#F5F5F5',mintcream:'#F5FFFA',ghostwhite:'#F8F8FF',salmon:'#FA8072',antiqueWhite:'#FAEBD7',linen:'#FAF0E6',lightgoldenrodyellow:'#FAFAD2',oldlace:'#FDF5E6',red:'#FF0000',fuchsia:'#FF00FF',magenta:'#FF00FF',deeppink:'#FF1493',orangered:'#FF4500',tomato:'#FF6347',hotpink:'#FF69B4',coral:'#FF7F50',darkorange:'#FF8C00',lightSalmon:'#FFA07A',orange:'#FFA500',lightpink:'#FFB6C1',pink:'#FFC0CB',gold:'#FFD700',peachpuff:'#FFDAB9',navajowhite:'#FFDEAD',moccasin:'#FFE4B5',bisque:'#FFE4C4',mistyrose:'#FFE4E1',blanchedalmond:'#FFEBCD',papayawhip:'#FFEFD5',lavenderblush:'#FFF0F5',seashell:'#FFF5EE',cornsilk:'#FFF8DC',lemonchiffon:'#FFFACD',floralwhite:'#FFFAF0',snow:'#FFFAFA',yellow:'#FFFF00',lightyellow:'#FFFFE0',ivory:'#FFFFF0',none:'inherit'};/***/},/* 25 *//***/function(module,exports){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=function(attribute){var value=attribute&&attribute.value||attribute;return[true,'true','on','yes','1',1].indexOf(value)>=0;};/***/},/* 26 *//***/function(module,exports){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=function(value){var options=arguments.length<=1||arguments[1]===undefined?{}:arguments[1];/**
	                 * @description
	                 * Remove namespace of property. namespace:property => property
	                 * Transform property sub parts to Camel notation. my-property => myProperty
	                 * @type {string}
	                 */var src=String(value||'').replace(/^[0-9a-zA-Z-_]+:/,'').replace(/-+([^-]?)/g,function(f,part){return part&&part.toUpperCase()||'';});return src.charAt(0)[options.capitalize?'toUpperCase':'toLowerCase']()+src.slice(1);};/***/},/* 27 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=readArchive;var _errors=__webpack_require__(4);var _index=__webpack_require__(28);var _index2=_interopRequireDefault(_index);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}/**
	             * @description Read the file
	             * @returns {Promise}
	             */function readArchive(){var _this=this;if(!this.isValid()){return Promise.reject(new Error(_errors.invalidFileType));}return new Promise(function(resolve,reject){return _index2.default.readFile(_this.file,{useWebWorkers:true,workerScriptsPath:_this.config.workerPath}).then(function(result){if(typeof _this.createDocument!=='function'){throw new Error(_errors.notFoundMethodCreateDocument);}return _this.createDocument(result);}).then(resolve).catch(function(rejection){return reject(rejection||new Error(_errors.invalidReadArchive));});});}/***/},/* 28 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _zip=__webpack_require__(29);var _zip2=_interopRequireDefault(_zip);var _Entry=__webpack_require__(30);var _Entry2=_interopRequireDefault(_Entry);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var BlobReader=_zip2.default.BlobReader;var BlobWriter=_zip2.default.BlobWriter;var createWorker=_zip2.default.createWorker;var getDataHelper=_zip2.default.getDataHelper;var seekEOCDR=_zip2.default.seekEOCDR;var readCommonHeader=_zip2.default.readCommonHeader;var getString=_zip2.default.getString;var decodeUTF8=_zip2.default.decodeUTF8;var decodeASCII=_zip2.default.decodeASCII;var ERR_READ=_zip2.default.ERR_READ;var ERR_BAD_FORMAT=_zip2.default.ERR_BAD_FORMAT;exports.default={readFile:function readFile(file,options){Object.merge(_zip2.default,options);return new Promise(function(resolve,reject){var reader=new BlobReader(file);/**
	                         * instead of .init()
	                         */reader.size=file.size;createWorker('inflater',function(worker){// look for End of central directory record
	seekEOCDR(reader,function(dataView){var dataLength=dataView.getUint32(16,true);var filesLength=dataView.getUint16(8,true);if(dataLength<0||dataLength>=reader.size){return reject();}reader.readUint8Array(dataLength,reader.size-dataLength,function(bytes){var index=0;var filename=undefined;var comment=undefined;var data=getDataHelper(bytes.length,bytes);var entries=[];var queue=[];var dataOptions={inflateSN:0};for(var i=0;i<filesLength;i++){var entry=new _Entry2.default({reader:reader,worker:worker,writer:new BlobWriter()});if(data.view.getUint32(index)!==0x504b0102){return reject(new Error(ERR_BAD_FORMAT));}readCommonHeader(entry,data,index+6,true,onerror);entry.commentLength=data.view.getUint16(index+32,true);entry.directory=(data.view.getUint8(index+38)&0x10)==0x10;entry.offset=data.view.getUint32(index+42,true);filename=getString(data.array.subarray(index+46,index+46+entry.filenameLength));if((entry.bitFlag&0x0800)===0x0800){entry.filename=decodeUTF8(filename);}else{entry.filename=decodeASCII(filename);}if(!entry.directory&&entry.filename[entry.filename.length-1]==='/'){entry.directory=true;}var val=index+46+entry.filenameLength+entry.extraFieldLength;index=val+entry.commentLength;comment=getString(data.array.subarray(val,index));if((entry.bitFlag&0x0800)===0x0800){entry.comment=decodeUTF8(comment);}else{entry.comment=decodeASCII(comment);}entries.push(entry);queue.push(entry.getData(dataOptions));}Promise.all(queue).then(function(files){var data=files.map(function(file,i){return{file:file,entry:entries[i]};});entries=null;resolve(data);},reject);},function(){return reject(new Error(ERR_READ));});});},reject);});}};/***/},/* 29 *//***/function(module,exports){/*
	             Copyright (c) 2013 Gildas Lormeau. All rights reserved.
	
	             Redistribution and use in source and binary forms, with or without
	             modification, are permitted provided that the following conditions are met:
	
	             1. Redistributions of source code must retain the above copyright notice,
	             this list of conditions and the following disclaimer.
	
	             2. Redistributions in binary form must reproduce the above copyright
	             notice, this list of conditions and the following disclaimer in
	             the documentation and/or other materials provided with the distribution.
	
	             3. The names of the authors may not be used to endorse or promote products
	             derived from this software without specific prior written permission.
	
	             THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
	             INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
	             FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
	             INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
	             INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	             LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
	             OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	             LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	             NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
	             EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	             */"use strict";Object.defineProperty(exports,"__esModule",{value:true});var ERR_BAD_FORMAT="File format is not recognized.";var ERR_CRC="CRC failed.";var ERR_ENCRYPTED="File contains encrypted entry.";var ERR_ZIP64="File is using Zip64 (4gb+ file size).";var ERR_READ="Error while reading zip file.";var ERR_WRITE="Error while writing zip file.";var ERR_WRITE_DATA="Error while writing file data.";var ERR_READ_DATA="Error while reading file data.";var ERR_DUPLICATED_NAME="File already exists.";var CHUNK_SIZE=512*1024;var TEXT_PLAIN="text/plain";var appendABViewSupported;try{appendABViewSupported=new Blob([new DataView(new ArrayBuffer(0))]).size===0;}catch(e){}function Crc32(){this.crc=-1;}Crc32.prototype.append=function append(data){var crc=this.crc|0,table=this.table;for(var offset=0,len=data.length|0;offset<len;offset++){crc=crc>>>8^table[(crc^data[offset])&0xFF];}this.crc=crc;};Crc32.prototype.get=function get(){return~this.crc;};Crc32.prototype.table=function(){var i,j,t,table=[];// Uint32Array is actually slower than []
	for(i=0;i<256;i++){t=i;for(j=0;j<8;j++){if(t&1)t=t>>>1^0xEDB88320;else t=t>>>1;}table[i]=t;}return table;}();// "no-op" codec
	function NOOP(){}NOOP.prototype.append=function append(bytes,onprogress){return bytes;};NOOP.prototype.flush=function flush(){};function blobSlice(blob,index,length){if(index<0||length<0||index+length>blob.size)throw new RangeError('offset:'+index+', length:'+length+', size:'+blob.size);if(blob.slice)return blob.slice(index,index+length);else if(blob.webkitSlice)return blob.webkitSlice(index,index+length);else if(blob.mozSlice)return blob.mozSlice(index,index+length);else if(blob.msSlice)return blob.msSlice(index,index+length);}function getDataHelper(byteLength,bytes){var dataBuffer,dataArray;dataBuffer=new ArrayBuffer(byteLength);dataArray=new Uint8Array(dataBuffer);if(bytes)dataArray.set(bytes,0);return{buffer:dataBuffer,array:dataArray,view:new DataView(dataBuffer)};}// Readers
	function Reader(){}function TextReader(text){var that=this,blobReader;function init(callback,onerror){var blob=new Blob([text],{type:TEXT_PLAIN});blobReader=new BlobReader(blob);blobReader.init(function(){that.size=blobReader.size;callback();},onerror);}function readUint8Array(index,length,callback,onerror){blobReader.readUint8Array(index,length,callback,onerror);}that.size=0;that.init=init;that.readUint8Array=readUint8Array;}TextReader.prototype=new Reader();TextReader.prototype.constructor=TextReader;function Data64URIReader(dataURI){var that=this,dataStart;function init(callback){var dataEnd=dataURI.length;while(dataURI.charAt(dataEnd-1)=="="){dataEnd--;}dataStart=dataURI.indexOf(",")+1;that.size=Math.floor((dataEnd-dataStart)*0.75);callback();}function readUint8Array(index,length,callback){var i,data=getDataHelper(length);var start=Math.floor(index/3)*4;var end=Math.ceil((index+length)/3)*4;var bytes=atob(dataURI.substring(start+dataStart,end+dataStart));var delta=index-Math.floor(start/4)*3;for(i=delta;i<delta+length;i++){data.array[i-delta]=bytes.charCodeAt(i);}callback(data.array);}that.size=0;that.init=init;that.readUint8Array=readUint8Array;}Data64URIReader.prototype=new Reader();Data64URIReader.prototype.constructor=Data64URIReader;function BlobReader(blob){var that=this;function init(callback){that.size=blob.size;callback();}function readUint8Array(index,length,callback,onerror){var reader=new FileReader();reader.onload=function(e){callback(new Uint8Array(e.target.result));};reader.onerror=onerror;try{reader.readAsArrayBuffer(blobSlice(blob,index,length));}catch(e){onerror(e);}}that.size=0;that.init=init;that.readUint8Array=readUint8Array;}BlobReader.prototype=new Reader();BlobReader.prototype.constructor=BlobReader;// Writers
	function Writer(){}Writer.prototype.getData=function(callback){callback(this.data);};function TextWriter(encoding){var that=this,blob;function init(callback){blob=new Blob([],{type:TEXT_PLAIN});callback();}function writeUint8Array(array,callback){blob=new Blob([blob,appendABViewSupported?array:array.buffer],{type:TEXT_PLAIN});callback();}function getData(callback,onerror){var reader=new FileReader();reader.onload=function(e){callback(e.target.result);};reader.onerror=onerror;reader.readAsText(blob,encoding);}that.init=init;that.writeUint8Array=writeUint8Array;that.getData=getData;}TextWriter.prototype=new Writer();TextWriter.prototype.constructor=TextWriter;function Data64URIWriter(contentType){var that=this,data="",pending="";function init(callback){data+="data:"+(contentType||"")+";base64,";callback();}function writeUint8Array(array,callback){var i,delta=pending.length,dataString=pending;pending="";for(i=0;i<Math.floor((delta+array.length)/3)*3-delta;i++){dataString+=String.fromCharCode(array[i]);}for(;i<array.length;i++){pending+=String.fromCharCode(array[i]);}if(dataString.length>2)data+=btoa(dataString);else pending=dataString;callback();}function getData(callback){callback(data+btoa(pending));}that.init=init;that.writeUint8Array=writeUint8Array;that.getData=getData;}Data64URIWriter.prototype=new Writer();Data64URIWriter.prototype.constructor=Data64URIWriter;function BlobWriter(contentType){var blob,that=this;function init(callback){blob=new Blob([],{type:contentType});callback();}function writeUint8Array(array,callback){blob=new Blob([blob,appendABViewSupported?array:array.buffer],{type:contentType});callback();}function getData(callback){callback(blob);}that.init=init;that.writeUint8Array=writeUint8Array;that.getData=getData;}BlobWriter.prototype=new Writer();BlobWriter.prototype.constructor=BlobWriter;/**
	             * inflate/deflate core functions
	             * @param worker {Worker} web worker for the task.
	             * @param initialMessage {Object} initial message to be sent to the worker. should contain
	             *   sn(serial number for distinguishing multiple tasks sent to the worker), and codecClass.
	             *   This function may add more properties before sending.
	             */function launchWorkerProcess(worker,initialMessage,reader,writer,offset,size,onprogress,onend,onreaderror,onwriteerror){var chunkIndex=0,index,outputSize,sn=initialMessage.sn,crc;function onflush(){worker.removeEventListener('message',onmessage,false);onend(outputSize,crc);}function onmessage(event){var message=event.data,data=message.data,err=message.error;if(err){err.toString=function(){return'Error: '+this.message;};onreaderror(err);return;}if(message.sn!==sn)return;if(typeof message.codecTime==='number')worker.codecTime+=message.codecTime;// should be before onflush()
	if(typeof message.crcTime==='number')worker.crcTime+=message.crcTime;switch(message.type){case'append':if(data){outputSize+=data.length;writer.writeUint8Array(data,function(){step();},onwriteerror);}else step();break;case'flush':crc=message.crc;if(data){outputSize+=data.length;writer.writeUint8Array(data,function(){onflush();},onwriteerror);}else onflush();break;case'progress':if(onprogress)onprogress(index+message.loaded,size);break;case'importScripts'://no need to handle here
	case'newTask':case'echo':break;default:console.warn('zip.js:launchWorkerProcess: unknown message: ',message);}}function step(){index=chunkIndex*CHUNK_SIZE;// use `<=` instead of `<`, because `size` may be 0.
	if(index<=size){reader.readUint8Array(offset+index,Math.min(CHUNK_SIZE,size-index),function(array){if(onprogress)onprogress(index,size);var msg=index===0?initialMessage:{sn:sn};msg.type='append';msg.data=array;// posting a message with transferables will fail on IE10
	try{worker.postMessage(msg,[array.buffer]);}catch(ex){worker.postMessage(msg);// retry without transferables
	}chunkIndex++;},onreaderror);}else{worker.postMessage({sn:sn,type:'flush'});}}outputSize=0;worker.addEventListener('message',onmessage,false);step();}function launchProcess(process,reader,writer,offset,size,crcType,onprogress,onend,onreaderror,onwriteerror){var chunkIndex=0,index,outputSize=0,crcInput=crcType==='input',crcOutput=crcType==='output',crc=new Crc32();function step(){var outputData;index=chunkIndex*CHUNK_SIZE;if(index<size)reader.readUint8Array(offset+index,Math.min(CHUNK_SIZE,size-index),function(inputData){var outputData;try{outputData=process.append(inputData,function(loaded){if(onprogress)onprogress(index+loaded,size);});}catch(e){onreaderror(e);return;}if(outputData){outputSize+=outputData.length;writer.writeUint8Array(outputData,function(){chunkIndex++;setTimeout(step,1);},onwriteerror);if(crcOutput)crc.append(outputData);}else{chunkIndex++;setTimeout(step,1);}if(crcInput)crc.append(inputData);if(onprogress)onprogress(index,size);},onreaderror);else{try{outputData=process.flush();}catch(e){onreaderror(e);return;}if(outputData){if(crcOutput)crc.append(outputData);outputSize+=outputData.length;writer.writeUint8Array(outputData,function(){onend(outputSize,crc.get());},onwriteerror);}else onend(outputSize,crc.get());}}step();}function inflate(worker,sn,reader,writer,offset,size,computeCrc32,onend,onprogress,onreaderror,onwriteerror){var crcType=computeCrc32?'output':'none';if(zip.useWebWorkers){var initialMessage={sn:sn,codecClass:'Inflater',crcType:crcType};launchWorkerProcess(worker,initialMessage,reader,writer,offset,size,onprogress,onend,onreaderror,onwriteerror);}else launchProcess(new zip.Inflater(),reader,writer,offset,size,crcType,onprogress,onend,onreaderror,onwriteerror);}function deflate(worker,sn,reader,writer,level,onend,onprogress,onreaderror,onwriteerror){var crcType='input';if(zip.useWebWorkers){var initialMessage={sn:sn,options:{level:level},codecClass:'Deflater',crcType:crcType};launchWorkerProcess(worker,initialMessage,reader,writer,0,reader.size,onprogress,onend,onreaderror,onwriteerror);}else launchProcess(new zip.Deflater(),reader,writer,0,reader.size,crcType,onprogress,onend,onreaderror,onwriteerror);}function copy(worker,sn,reader,writer,offset,size,computeCrc32,onend,onprogress,onreaderror,onwriteerror){var crcType='input';if(zip.useWebWorkers&&computeCrc32){var initialMessage={sn:sn,codecClass:'NOOP',crcType:crcType};launchWorkerProcess(worker,initialMessage,reader,writer,offset,size,onprogress,onend,onreaderror,onwriteerror);}else launchProcess(new NOOP(),reader,writer,offset,size,crcType,onprogress,onend,onreaderror,onwriteerror);}// ZipReader
	function decodeASCII(str){var i,out="",charCode,extendedASCII=["Ç","ü","é","â","ä","à","å","ç","ê","ë","è","ï","î","ì","Ä","Å","É","æ","Æ","ô","ö","ò","û","ù","ÿ","Ö","Ü","ø","£","Ø","×","ƒ","á","í","ó","ú","ñ","Ñ","ª","º","¿","®","¬","½","¼","¡","«","»",'_','_','_',"¦","¦","Á","Â","À","©","¦","¦",'+','+',"¢","¥",'+','+','-','-','+','-','+',"ã","Ã",'+','+','-','-',"¦",'-','+',"¤","ð","Ð","Ê","Ë","È",'i',"Í","Î","Ï",'+','+','_','_',"¦","Ì",'_',"Ó","ß","Ô","Ò","õ","Õ","µ","þ","Þ","Ú","Û","Ù","ý","Ý","¯","´","­","±",'_',"¾","¶","§","÷","¸","°","¨","·","¹","³","²",'_',' '];for(i=0;i<str.length;i++){charCode=str.charCodeAt(i)&0xFF;if(charCode>127)out+=extendedASCII[charCode-128];else out+=String.fromCharCode(charCode);}return out;}function decodeUTF8(string){return decodeURIComponent(escape(string));}function getString(bytes){var i,str="";for(i=0;i<bytes.length;i++){str+=String.fromCharCode(bytes[i]);}return str;}function getDate(timeRaw){var date=(timeRaw&0xffff0000)>>16,time=timeRaw&0x0000ffff;try{return new Date(1980+((date&0xFE00)>>9),((date&0x01E0)>>5)-1,date&0x001F,(time&0xF800)>>11,(time&0x07E0)>>5,(time&0x001F)*2,0);}catch(e){}}function readCommonHeader(entry,data,index,centralDirectory,onerror){entry.version=data.view.getUint16(index,true);entry.bitFlag=data.view.getUint16(index+2,true);entry.compressionMethod=data.view.getUint16(index+4,true);entry.lastModDateRaw=data.view.getUint32(index+6,true);entry.lastModDate=getDate(entry.lastModDateRaw);if((entry.bitFlag&0x01)===0x01){onerror(ERR_ENCRYPTED);return;}if(centralDirectory||(entry.bitFlag&0x0008)!=0x0008){entry.crc32=data.view.getUint32(index+10,true);entry.compressedSize=data.view.getUint32(index+14,true);entry.uncompressedSize=data.view.getUint32(index+18,true);}if(entry.compressedSize===0xFFFFFFFF||entry.uncompressedSize===0xFFFFFFFF){onerror(ERR_ZIP64);return;}entry.filenameLength=data.view.getUint16(index+22,true);entry.extraFieldLength=data.view.getUint16(index+24,true);}function seekEOCDR(reader,eocdrCallback){// "End of central directory record" is the last part of a zip archive, and is at least 22 bytes long.
	// Zip file comment is the last part of EOCDR and has max length of 64KB,
	// so we only have to search the last 64K + 22 bytes of a archive for EOCDR signature (0x06054b50).
	var EOCDR_MIN=22;if(reader.size<EOCDR_MIN){onerror(ERR_BAD_FORMAT);return;}var ZIP_COMMENT_MAX=256*256,EOCDR_MAX=EOCDR_MIN+ZIP_COMMENT_MAX;// In most cases, the EOCDR is EOCDR_MIN bytes long
	doSeek(EOCDR_MIN,function(){// If not found, try within EOCDR_MAX bytes
	doSeek(Math.min(EOCDR_MAX,reader.size),function(){onerror(ERR_BAD_FORMAT);});});// seek last length bytes of file for EOCDR
	function doSeek(length,eocdrNotFoundCallback){reader.readUint8Array(reader.size-length,length,function(bytes){for(var i=bytes.length-EOCDR_MIN;i>=0;i--){if(bytes[i]===0x50&&bytes[i+1]===0x4b&&bytes[i+2]===0x05&&bytes[i+3]===0x06){eocdrCallback(new DataView(bytes.buffer,i,EOCDR_MIN));return;}}eocdrNotFoundCallback();},function(){onerror(ERR_READ);});}}// ZipWriter
	function encodeUTF8(string){return unescape(encodeURIComponent(string));}function getBytes(str){var i,array=[];for(i=0;i<str.length;i++){array.push(str.charCodeAt(i));}return array;}function createZipWriter(writer,callback,onerror,dontDeflate){var files={},filenames=[],datalength=0;var deflateSN=0;function onwriteerror(err){onerror(err||ERR_WRITE);}function onreaderror(err){onerror(err||ERR_READ_DATA);}var zipWriter={add:function add(name,reader,onend,onprogress,options){var header,filename,date;var worker=this._worker;function writeHeader(callback){var data;date=options.lastModDate||new Date();header=getDataHelper(26);files[name]={headerArray:header.array,directory:options.directory,filename:filename,offset:datalength,comment:getBytes(encodeUTF8(options.comment||""))};header.view.setUint32(0,0x14000808);if(options.version)header.view.setUint8(0,options.version);if(!dontDeflate&&options.level!==0&&!options.directory)header.view.setUint16(4,0x0800);header.view.setUint16(6,(date.getHours()<<6|date.getMinutes())<<5|date.getSeconds()/2,true);header.view.setUint16(8,(date.getFullYear()-1980<<4|date.getMonth()+1)<<5|date.getDate(),true);header.view.setUint16(22,filename.length,true);data=getDataHelper(30+filename.length);data.view.setUint32(0,0x504b0304);data.array.set(header.array,4);data.array.set(filename,30);datalength+=data.array.length;writer.writeUint8Array(data.array,callback,onwriteerror);}function writeFooter(compressedLength,crc32){var footer=getDataHelper(16);datalength+=compressedLength||0;footer.view.setUint32(0,0x504b0708);if(typeof crc32!="undefined"){header.view.setUint32(10,crc32,true);footer.view.setUint32(4,crc32,true);}if(reader){footer.view.setUint32(8,compressedLength,true);header.view.setUint32(14,compressedLength,true);footer.view.setUint32(12,reader.size,true);header.view.setUint32(18,reader.size,true);}writer.writeUint8Array(footer.array,function(){datalength+=16;onend();},onwriteerror);}function writeFile(){options=options||{};name=name.trim();if(options.directory&&name.charAt(name.length-1)!="/")name+="/";if(files.hasOwnProperty(name)){onerror(ERR_DUPLICATED_NAME);return;}filename=getBytes(encodeUTF8(name));filenames.push(name);writeHeader(function(){if(reader){if(dontDeflate||options.level===0)copy(worker,deflateSN++,reader,writer,0,reader.size,true,writeFooter,onprogress,onreaderror,onwriteerror);else deflate(worker,deflateSN++,reader,writer,options.level,writeFooter,onprogress,onreaderror,onwriteerror);}else writeFooter();},onwriteerror);}if(reader)reader.init(writeFile,onreaderror);else writeFile();},close:function close(callback){if(this._worker){this._worker.terminate();this._worker=null;}var data,length=0,index=0,indexFilename,file;for(indexFilename=0;indexFilename<filenames.length;indexFilename++){file=files[filenames[indexFilename]];length+=46+file.filename.length+file.comment.length;}data=getDataHelper(length+22);for(indexFilename=0;indexFilename<filenames.length;indexFilename++){file=files[filenames[indexFilename]];data.view.setUint32(index,0x504b0102);data.view.setUint16(index+4,0x1400);data.array.set(file.headerArray,index+6);data.view.setUint16(index+32,file.comment.length,true);if(file.directory)data.view.setUint8(index+38,0x10);data.view.setUint32(index+42,file.offset,true);data.array.set(file.filename,index+46);data.array.set(file.comment,index+46+file.filename.length);index+=46+file.filename.length+file.comment.length;}data.view.setUint32(index,0x504b0506);data.view.setUint16(index+8,filenames.length,true);data.view.setUint16(index+10,filenames.length,true);data.view.setUint32(index+12,length,true);data.view.setUint32(index+16,datalength,true);writer.writeUint8Array(data.array,function(){writer.getData(callback);},onwriteerror);},_worker:null};if(!zip.useWebWorkers)callback(zipWriter);else{createWorker('deflater',function(worker){zipWriter._worker=worker;callback(zipWriter);},function(err){onerror(err);});}}function resolveURLs(urls){var a=document.createElement('a');return urls.map(function(url){a.href=url;return a.href;});}var DEFAULT_WORKER_SCRIPTS={deflater:['z-worker.js','deflate.js'],inflater:['z-worker.js','inflate.js']};function createWorker(type,callback,onerror){if(zip.workerScripts!==null&&zip.workerScriptsPath!==null){onerror(new Error('Either zip.workerScripts or zip.workerScriptsPath may be set, not both.'));return;}var scripts;if(zip.workerScripts){scripts=zip.workerScripts[type];if(!Array.isArray(scripts)){onerror(new Error('zip.workerScripts.'+type+' is not an array!'));return;}scripts=resolveURLs(scripts);}else{scripts=DEFAULT_WORKER_SCRIPTS[type].slice(0);scripts[0]=(zip.workerScriptsPath||'')+scripts[0];}var worker=new Worker(scripts[0]);// record total consumed time by inflater/deflater/crc32 in this worker
	worker.codecTime=worker.crcTime=0;worker.postMessage({type:'importScripts',scripts:scripts.slice(1)});worker.addEventListener('message',onmessage);function onmessage(ev){var msg=ev.data;if(msg.error){worker.terminate();// should before onerror(), because onerror() may throw.
	onerror(msg.error);return;}if(msg.type==='importScripts'){worker.removeEventListener('message',onmessage);worker.removeEventListener('error',errorHandler);callback(worker);}}// catch entry script loading error and other unhandled errors
	worker.addEventListener('error',errorHandler);function errorHandler(err){worker.terminate();onerror(err);}}function onerror_default(error){console.error(error);}var zip={BlobReader:BlobReader,BlobWriter:BlobWriter,createWorker:createWorker,getDataHelper:getDataHelper,seekEOCDR:seekEOCDR,readCommonHeader:readCommonHeader,getString:getString,decodeUTF8:decodeUTF8,decodeASCII:decodeASCII,copy:copy,inflate:inflate,ERR_READ:ERR_READ,ERR_BAD_FORMAT:ERR_BAD_FORMAT,ERR_READ_DATA:ERR_READ_DATA,ERR_WRITE_DATA:ERR_WRITE_DATA,workerScripts:null};exports.default=zip;/***/},/* 30 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _zip=__webpack_require__(29);var _zip2=_interopRequireDefault(_zip);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var copy=_zip2.default.copy;var readCommonHeader=_zip2.default.readCommonHeader;var getDataHelper=_zip2.default.getDataHelper;var inflate=_zip2.default.inflate;var ERR_BAD_FORMAT=_zip2.default.ERR_BAD_FORMAT;var ERR_READ_DATA=_zip2.default.ERR_READ_DATA;var ERR_WRITE_DATA=_zip2.default.ERR_WRITE_DATA;var Entry=function(){function Entry(options){_classCallCheck(this,Entry);Object.merge(this,options);}_createClass(Entry,[{key:'testCrc32',value:function testCrc32(crc32){var dataCrc32=getDataHelper(4);dataCrc32.view.setUint32(0,crc32);return this.crc32===dataCrc32.view.getUint32(0);}},{key:'getData',value:function getData(){var _this=this;var options=arguments.length<=0||arguments[0]===undefined?{}:arguments[0];return new Promise(function(resolve){var checkCrc32=options.checkCrc32;var onReadError=function onReadError(err){throw new Error(err||ERR_READ_DATA);};function onWriteError(err){throw new Error(err||ERR_WRITE_DATA);}_this.reader.readUint8Array(_this.offset,30,function(bytes){var data=getDataHelper(bytes.length,bytes);if(data.view.getUint32(0)!==0x504b0304){throw new Error(ERR_BAD_FORMAT);}readCommonHeader(_this,data,4,false,onerror);var dataOffset=_this.offset+30+_this.filenameLength+_this.extraFieldLength;var writer=_this.writer;var reader=_this.reader;var worker=_this.worker;var compressedSize=_this.compressedSize;options.inflateSN++;writer.init(function(){var method=inflate;if(_this.compressionMethod===0){method=copy;}method(worker,options.inflateSN,reader,writer,dataOffset,compressedSize,checkCrc32,function(uncompressedSize,crc32){if(checkCrc32&&!_this.testCrc32(crc32)){throw new Error(ERR_CRC);}else{writer.getData(function(data){return resolve(data);});}},null,onReadError,onWriteError);},onWriteError);},onReadError);});}}]);return Entry;}();exports.default=Entry;/***/},/* 31 *//***/function(module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:true});// jscs:disable
	var mask=/^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;// jscs:enable
	exports.default=function(val){return mask.test(val);};/***/},/* 32 *//***/function(module,exports,__webpack_require__){'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.default=function(obj){return(0,_merge2.default)({},obj);};var _merge=__webpack_require__(15);var _merge2=_interopRequireDefault(_merge);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}/***/}/******/]));});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)(module)))

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	(function webpackUniversalModuleDefinition(root, factory) {
	            if (( false ? 'undefined' : _typeof(exports)) === 'object' && ( false ? 'undefined' : _typeof(module)) === 'object') module.exports = factory(__webpack_require__(4));
	})(undefined, function (__WEBPACK_EXTERNAL_MODULE_1__) {
	            return (/******/function (modules) {
	                                    // webpackBootstrap
	                                    /******/ // The module cache
	                                    /******/var installedModules = {};
	
	                                    /******/ // The require function
	                                    /******/function __webpack_require__(moduleId) {
	
	                                                /******/ // Check if module is in cache
	                                                /******/if (installedModules[moduleId])
	                                                            /******/return installedModules[moduleId].exports;
	
	                                                /******/ // Create a new module (and put it into the cache)
	                                                /******/var module = installedModules[moduleId] = {
	                                                            /******/exports: {},
	                                                            /******/id: moduleId,
	                                                            /******/loaded: false
	                                                            /******/ };
	
	                                                /******/ // Execute the module function
	                                                /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	
	                                                /******/ // Flag the module as loaded
	                                                /******/module.loaded = true;
	
	                                                /******/ // Return the exports of the module
	                                                /******/return module.exports;
	                                                /******/
	                                    }
	
	                                    /******/ // expose the modules object (__webpack_modules__)
	                                    /******/__webpack_require__.m = modules;
	
	                                    /******/ // expose the module cache
	                                    /******/__webpack_require__.c = installedModules;
	
	                                    /******/ // __webpack_public_path__
	                                    /******/__webpack_require__.p = "";
	
	                                    /******/ // Load entry module and return exports
	                                    /******/return __webpack_require__(0);
	                                    /******/
	                        }(
	                        /************************************************************************/
	                        /******/[
	                        /* 0 */
	                        /***/function (module, exports, __webpack_require__) {
	
	                                    'use strict';
	
	                                    Object.defineProperty(exports, "__esModule", {
	                                                value: true
	                                    });
	
	                                    var _createClass = function () {
	                                                function defineProperties(target, props) {
	                                                            for (var i = 0; i < props.length; i++) {
	                                                                        var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	                                                            }
	                                                }return function (Constructor, protoProps, staticProps) {
	                                                            if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	                                                };
	                                    }();
	
	                                    var _JsFile = __webpack_require__(1);
	
	                                    var _JsFile2 = _interopRequireDefault(_JsFile);
	
	                                    var _createDocument = __webpack_require__(2);
	
	                                    var _createDocument2 = _interopRequireDefault(_createDocument);
	
	                                    var _parser = __webpack_require__(10);
	
	                                    var _parser2 = _interopRequireDefault(_parser);
	
	                                    var _parseFileInfo = __webpack_require__(5);
	
	                                    var _parseFileInfo2 = _interopRequireDefault(_parseFileInfo);
	
	                                    var _parseDocumentInfo = __webpack_require__(7);
	
	                                    var _parseDocumentInfo2 = _interopRequireDefault(_parseDocumentInfo);
	
	                                    var _parsePages = __webpack_require__(12);
	
	                                    var _parsePages2 = _interopRequireDefault(_parsePages);
	
	                                    var _parseBlockElement = __webpack_require__(13);
	
	                                    var _parseBlockElement2 = _interopRequireDefault(_parseBlockElement);
	
	                                    var _parseBlock = __webpack_require__(14);
	
	                                    var _parseBlock2 = _interopRequireDefault(_parseBlock);
	
	                                    var _parseParagraph = __webpack_require__(15);
	
	                                    var _parseParagraph2 = _interopRequireDefault(_parseParagraph);
	
	                                    function _interopRequireDefault(obj) {
	                                                return obj && obj.__esModule ? obj : { default: obj };
	                                    }
	
	                                    function _classCallCheck(instance, Constructor) {
	                                                if (!(instance instanceof Constructor)) {
	                                                            throw new TypeError("Cannot call a class as a function");
	                                                }
	                                    }
	
	                                    function _possibleConstructorReturn(self, call) {
	                                                if (!self) {
	                                                            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	                                                }return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
	                                    }
	
	                                    function _inherits(subClass, superClass) {
	                                                if (typeof superClass !== "function" && superClass !== null) {
	                                                            throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
	                                                }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	                                    }
	
	                                    var Engine = _JsFile2.default.Engine;
	
	                                    /**
	                                     * @description Supported files by engine
	                                     * @type {{extension: Array, mime: Array}}
	                                     */
	
	                                    var files = {
	                                                extension: ['fb2'],
	                                                mime: ['application/x-fictionbook+xml']
	                                    };
	
	                                    var FbEngine = function (_Engine) {
	                                                _inherits(FbEngine, _Engine);
	
	                                                function FbEngine() {
	                                                            _classCallCheck(this, FbEngine);
	
	                                                            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FbEngine).apply(this, arguments));
	
	                                                            _this.createDocument = _createDocument2.default;
	                                                            _this.files = files;
	
	                                                            /**
	                                                             * @override
	                                                             * @type {Function}
	                                                             */
	                                                            _this.parser = _parser2.default;
	                                                            _this.parseFileInfo = _parseFileInfo2.default;
	                                                            _this.parseDocumentInfo = _parseDocumentInfo2.default;
	                                                            _this.parsePages = _parsePages2.default;
	                                                            _this.parseBlockElement = _parseBlockElement2.default;
	                                                            _this.parseBlock = _parseBlock2.default;
	                                                            _this.parseParagraph = _parseParagraph2.default;
	                                                            return _this;
	                                                }
	
	                                                _createClass(FbEngine, null, [{
	                                                            key: 'test',
	                                                            value: function test(file) {
	                                                                        return Boolean(file && Engine.validateFile(file, files));
	                                                            }
	                                                }]);
	
	                                                return FbEngine;
	                                    }(Engine);
	
	                                    FbEngine.mimeTypes = files.mime.slice(0);
	
	                                    exports.default = FbEngine;
	
	                                    /***/
	                        },
	                        /* 1 */
	                        /***/function (module, exports) {
	
	                                    module.exports = __WEBPACK_EXTERNAL_MODULE_1__;
	
	                                    /***/
	                        },
	                        /* 2 */
	                        /***/function (module, exports, __webpack_require__) {
	
	                                    'use strict';
	
	                                    Object.defineProperty(exports, "__esModule", {
	                                                value: true
	                                    });
	                                    exports.default = createDocument;
	
	                                    var _JsFile = __webpack_require__(1);
	
	                                    var _JsFile2 = _interopRequireDefault(_JsFile);
	
	                                    var _parseBinaryItems = __webpack_require__(3);
	
	                                    var _parseBinaryItems2 = _interopRequireDefault(_parseBinaryItems);
	
	                                    var _parsePublishInfo = __webpack_require__(4);
	
	                                    var _parsePublishInfo2 = _interopRequireDefault(_parsePublishInfo);
	
	                                    var _parseFileInfo = __webpack_require__(5);
	
	                                    var _parseFileInfo2 = _interopRequireDefault(_parseFileInfo);
	
	                                    var _parseDocumentInfo = __webpack_require__(7);
	
	                                    var _parseDocumentInfo2 = _interopRequireDefault(_parseDocumentInfo);
	
	                                    var _parseCustomInfo = __webpack_require__(8);
	
	                                    var _parseCustomInfo2 = _interopRequireDefault(_parseCustomInfo);
	
	                                    var _parseImage = __webpack_require__(9);
	
	                                    var _parseImage2 = _interopRequireDefault(_parseImage);
	
	                                    function _interopRequireDefault(obj) {
	                                                return obj && obj.__esModule ? obj : { default: obj };
	                                    }
	
	                                    var Document = _JsFile2.default.Document;
	                                    var formatPropertyName = _JsFile2.default.Engine.formatPropertyName;
	
	                                    var forEach = [].forEach;
	                                    var descriptionProcessors = {
	                                                'publish-info': {
	                                                            parser: _parsePublishInfo2.default
	                                                },
	                                                'title-info': {
	                                                            name: 'fileInfo',
	                                                            parser: _parseFileInfo2.default
	                                                },
	                                                'src-title-info': {
	                                                            name: 'originalFileInfo',
	                                                            parser: _parseFileInfo2.default
	                                                },
	                                                'document-info': {
	                                                            parser: _parseDocumentInfo2.default
	                                                },
	                                                'custom-info': {
	                                                            parser: _parseCustomInfo2.default
	                                                }
	                                    };
	
	                                    /**
	                                     *
	                                     * @param xml {Document}
	                                     * @private
	                                     */
	                                    function createDocument(xml) {
	                                                var _this = this;
	
	                                                return new Promise(function (resolve) {
	                                                            var documentData = {
	                                                                        meta: {
	                                                                                    name: _this.fileName
	                                                                        },
	                                                                        binaryItems: (0, _parseBinaryItems2.default)(xml.querySelectorAll('binary'))
	                                                            };
	                                                            var page = Document.elementPrototype;
	                                                            var node = xml.querySelector('FictionBook');
	
	                                                            forEach.call(node && node.childNodes || [], function (node) {
	                                                                        var localName = node.localName;
	
	                                                                        if (localName === 'description') {
	                                                                                    forEach.call(node.childNodes || [], function (node) {
	                                                                                                var localName = node.localName;
	
	                                                                                                var _ref = descriptionProcessors[localName] || {};
	
	                                                                                                var name = _ref.name;
	                                                                                                var parser = _ref.parser;
	
	                                                                                                if (parser) {
	                                                                                                            documentData.meta[name || formatPropertyName(localName)] = parser.call(this, node, documentData);
	                                                                                                }
	                                                                                    }, this);
	
	                                                                                    if (documentData.meta.fileInfo && documentData.meta.fileInfo.annotation) {
	                                                                                                page.children.push(documentData.meta.fileInfo.annotation);
	                                                                                    }
	
	                                                                                    if (documentData.meta.fileInfo && documentData.meta.fileInfo.coverpage && documentData.binaryItems[documentData.meta.fileInfo.coverpage.image]) {
	                                                                                                var element = Document.elementPrototype;
	                                                                                                element.children = [(0, _parseImage2.default)({
	                                                                                                            documentData: documentData,
	                                                                                                            imageName: documentData.meta.fileInfo.coverpage.image
	                                                                                                })];
	                                                                                                page.children.push(element);
	                                                                                    }
	                                                                        } else if (localName === 'body') {
	                                                                                    this.parsePages(node, documentData, page.children);
	                                                                        }
	                                                            }, _this);
	
	                                                            resolve(new Document({
	                                                                        meta: documentData.meta,
	                                                                        content: [page]
	                                                            }));
	                                                });
	                                    }
	
	                                    /***/
	                        },
	                        /* 3 */
	                        /***/function (module, exports) {
	
	                                    'use strict';
	
	                                    Object.defineProperty(exports, "__esModule", {
	                                                value: true
	                                    });
	                                    exports.default = parseBinaryItems;
	                                    function parseBinaryItems(nodes) {
	                                                var result = {};
	
	                                                [].forEach.call(nodes || [], function (node) {
	                                                            var attrs = node.attributes || {};
	                                                            var contentType = attrs['content-type'] && attrs['content-type'].value;
	                                                            if (attrs.id && attrs.id.value && contentType && node.textContent) {
	                                                                        result[attrs.id.value] = 'data:' + contentType + ';base64,' + node.textContent;
	                                                            }
	                                                });
	
	                                                return result;
	                                    }
	
	                                    /***/
	                        },
	                        /* 4 */
	                        /***/function (module, exports, __webpack_require__) {
	
	                                    'use strict';
	
	                                    Object.defineProperty(exports, "__esModule", {
	                                                value: true
	                                    });
	                                    exports.default = parsePublishInfo;
	
	                                    var _JsFile = __webpack_require__(1);
	
	                                    var _JsFile2 = _interopRequireDefault(_JsFile);
	
	                                    function _interopRequireDefault(obj) {
	                                                return obj && obj.__esModule ? obj : { default: obj };
	                                    }
	
	                                    var formatPropertyName = _JsFile2.default.Engine.formatPropertyName;
	
	                                    /**
	                                     * @param xml
	                                     * @return {Object}
	                                     * @private
	                                     */
	
	                                    function parsePublishInfo(xml) {
	                                                var info = {};
	
	                                                [].forEach.call(xml && xml.childNodes || [], function (node) {
	                                                            var localName = node.localName;
	
	                                                            if (localName) {
	                                                                        info[formatPropertyName(localName)] = node.textContent || '';
	                                                            }
	                                                });
	
	                                                return info;
	                                    }
	
	                                    /***/
	                        },
	                        /* 5 */
	                        /***/function (module, exports, __webpack_require__) {
	
	                                    'use strict';
	
	                                    Object.defineProperty(exports, "__esModule", {
	                                                value: true
	                                    });
	                                    exports.default = parseFileInfo;
	
	                                    var _JsFile = __webpack_require__(1);
	
	                                    var _JsFile2 = _interopRequireDefault(_JsFile);
	
	                                    var _getPersonInfo = __webpack_require__(6);
	
	                                    var _getPersonInfo2 = _interopRequireDefault(_getPersonInfo);
	
	                                    function _interopRequireDefault(obj) {
	                                                return obj && obj.__esModule ? obj : { default: obj };
	                                    }
	
	                                    var formatPropertyName = _JsFile2.default.Engine.formatPropertyName;
	
	                                    /**
	                                     * @param xml
	                                     * @param documentData
	                                     * @return {Object}
	                                     * @private
	                                     */
	
	                                    function parseFileInfo(xml, documentData) {
	                                                var info = {};
	
	                                                [].forEach.call(xml && xml.childNodes || [], function (node) {
	                                                            var localName = node.localName;
	                                                            var _node$textContent = node.textContent;
	                                                            var textContent = _node$textContent === undefined ? '' : _node$textContent;
	
	                                                            switch (localName) {
	                                                                        case 'genre':
	                                                                                    info[localName] = info[localName] || [];
	                                                                                    info[localName].push(textContent);
	                                                                                    break;
	                                                                        case 'keywords':
	                                                                                    info[localName] = textContent.split(/\s*,\s*/);
	                                                                                    break;
	                                                                        case 'annotation':
	                                                                                    info[localName] = this.parseBlock(node, documentData);
	                                                                                    break;
	                                                                        case 'translator':
	                                                                                    info[localName] = (0, _getPersonInfo2.default)(node);
	                                                                                    break;
	                                                                        case 'coverpage':
	                                                                                    var imageNode = node.querySelector('image');
	                                                                                    var href = imageNode.attributes['xlink:href'] && imageNode.attributes['xlink:href'].value || '';
	                                                                                    info[localName] = {
	                                                                                                image: href.replace('#', '')
	                                                                                    };
	                                                                                    break;
	                                                                        case 'sequence':
	                                                                                    var number = node.attributes.number && node.attributes.number.value;
	                                                                                    info[localName] = {
	                                                                                                name: node.attributes.name ? node.attributes.name.value || '' : '',
	                                                                                                number: isNaN(number) ? 0 : Number(number)
	                                                                                    };
	                                                                                    break;
	                                                                        default:
	                                                                                    if (localName) {
	                                                                                                info[formatPropertyName(localName)] = textContent;
	                                                                                    }
	                                                            }
	                                                }, this);
	
	                                                return info;
	                                    }
	
	                                    /***/
	                        },
	                        /* 6 */
	                        /***/function (module, exports, __webpack_require__) {
	
	                                    'use strict';
	
	                                    Object.defineProperty(exports, "__esModule", {
	                                                value: true
	                                    });
	                                    exports.default = getPersonInfo;
	
	                                    var _JsFile = __webpack_require__(1);
	
	                                    var _JsFile2 = _interopRequireDefault(_JsFile);
	
	                                    function _interopRequireDefault(obj) {
	                                                return obj && obj.__esModule ? obj : { default: obj };
	                                    }
	
	                                    var formatPropertyName = _JsFile2.default.Engine.formatPropertyName;
	
	                                    /**
	                                     *
	                                     * @param xml
	                                     * @return {Object}
	                                     * @private
	                                     */
	
	                                    function getPersonInfo(xml) {
	                                                var info = {};
	
	                                                [].forEach.call(xml && xml.childNodes || [], function (_ref) {
	                                                            var localName = _ref.localName;
	                                                            var _ref$textContent = _ref.textContent;
	                                                            var textContent = _ref$textContent === undefined ? '' : _ref$textContent;
	
	                                                            if (localName) {
	                                                                        info[formatPropertyName(localName)] = textContent;
	                                                            }
	                                                });
	
	                                                return info;
	                                    }
	
	                                    /***/
	                        },
	                        /* 7 */
	                        /***/function (module, exports, __webpack_require__) {
	
	                                    'use strict';
	
	                                    Object.defineProperty(exports, "__esModule", {
	                                                value: true
	                                    });
	                                    exports.default = parseDocumentInfo;
	
	                                    var _getPersonInfo = __webpack_require__(6);
	
	                                    var _getPersonInfo2 = _interopRequireDefault(_getPersonInfo);
	
	                                    function _interopRequireDefault(obj) {
	                                                return obj && obj.__esModule ? obj : { default: obj };
	                                    }
	
	                                    /**
	                                     * @param xml
	                                     * @param documentData
	                                     * @return {Object}
	                                     * @private
	                                     */
	                                    function parseDocumentInfo(xml, documentData) {
	                                                var info = {
	                                                            programs: []
	                                                };
	
	                                                [].forEach.call(xml && xml.childNodes || [], function (node) {
	                                                            var localName = node.localName;
	                                                            var _node$textContent = node.textContent;
	                                                            var textContent = _node$textContent === undefined ? '' : _node$textContent;
	
	                                                            switch (localName) {
	                                                                        case 'author':
	                                                                                    info[localName] = (0, _getPersonInfo2.default)(node);
	                                                                                    break;
	                                                                        case 'id':
	                                                                                    info[localName] = textContent;
	                                                                                    break;
	                                                                        case 'version':
	                                                                                    info[localName] = textContent;
	                                                                                    break;
	                                                                        case 'publisher':
	                                                                                    info[localName] = textContent;
	                                                                                    break;
	                                                                        case 'history':
	                                                                                    info[localName] = this.parseBlock(node, documentData);
	                                                                                    break;
	                                                                        case 'date':
	                                                                                    info[localName] = textContent;
	                                                                                    break;
	                                                                        case 'src-url':
	                                                                                    info.sourceUrl = textContent;
	                                                                                    break;
	                                                                        case 'src-ocr':
	                                                                                    info.originalAuthor = textContent;
	                                                                                    break;
	                                                                        case 'program-used':
	                                                                                    info.programs = textContent.split(',').map(function (program) {
	                                                                                                return program.trim();
	                                                                                    });
	                                                                                    break;
	                                                            }
	                                                }, this);
	
	                                                return info;
	                                    }
	
	                                    /***/
	                        },
	                        /* 8 */
	                        /***/function (module, exports) {
	
	                                    'use strict';
	
	                                    Object.defineProperty(exports, "__esModule", {
	                                                value: true
	                                    });
	
	                                    exports.default = function (xml) {
	                                                return xml && xml.textContent || '';
	                                    };
	
	                                    /***/
	                        },
	                        /* 9 */
	                        /***/function (module, exports, __webpack_require__) {
	
	                                    'use strict';
	
	                                    Object.defineProperty(exports, "__esModule", {
	                                                value: true
	                                    });
	                                    exports.default = parseImage;
	
	                                    var _JsFile = __webpack_require__(1);
	
	                                    var _JsFile2 = _interopRequireDefault(_JsFile);
	
	                                    function _interopRequireDefault(obj) {
	                                                return obj && obj.__esModule ? obj : { default: obj };
	                                    }
	
	                                    var Document = _JsFile2.default.Document;
	
	                                    /**
	                                     *
	                                     * @param options
	                                     * @returns {*}
	                                     * @private
	                                     */
	
	                                    function parseImage() {
	                                                var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	                                                var result = Document.elementPrototype;
	                                                var _options$node = options.node;
	                                                var node = _options$node === undefined ? {} : _options$node;
	                                                var documentData = options.documentData;
	                                                var imageName = options.imageName;
	
	                                                var attrValue = node.attributes && node.attributes['xlink:href'] && node.attributes['xlink:href'].value;
	
	                                                if (!imageName && attrValue) {
	                                                            result.properties.src = documentData.binaryItems[attrValue.replace('#', '')];
	                                                } else {
	                                                            result.properties.src = documentData.binaryItems[imageName];
	                                                }
	
	                                                if (node.attributes && node.attributes['l:href'] && node.attributes['l:href'].value) {
	                                                            attrValue = node.attributes['l:href'].value;
	                                                            result.properties.src = documentData.binaryItems[attrValue.replace('#', '')];
	                                                }
	
	                                                result.properties.tagName = 'IMG';
	                                                result.properties.src = result.properties.src || '';
	                                                result.properties.alt = attrValue || '';
	
	                                                return result;
	                                    }
	
	                                    /***/
	                        },
	                        /* 10 */
	                        /***/function (module, exports, __webpack_require__) {
	
	                                    'use strict';
	
	                                    Object.defineProperty(exports, "__esModule", {
	                                                value: true
	                                    });
	
	                                    var _slicedToArray = function () {
	                                                function sliceIterator(arr, i) {
	                                                            var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
	                                                                        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	                                                                                    _arr.push(_s.value);if (i && _arr.length === i) break;
	                                                                        }
	                                                            } catch (err) {
	                                                                        _d = true;_e = err;
	                                                            } finally {
	                                                                        try {
	                                                                                    if (!_n && _i["return"]) _i["return"]();
	                                                                        } finally {
	                                                                                    if (_d) throw _e;
	                                                                        }
	                                                            }return _arr;
	                                                }return function (arr, i) {
	                                                            if (Array.isArray(arr)) {
	                                                                        return arr;
	                                                            } else if (Symbol.iterator in Object(arr)) {
	                                                                        return sliceIterator(arr, i);
	                                                            } else {
	                                                                        throw new TypeError("Invalid attempt to destructure non-iterable instance");
	                                                            }
	                                                };
	                                    }();
	
	                                    exports.default = parser;
	
	                                    var _JsFile = __webpack_require__(1);
	
	                                    var _JsFile2 = _interopRequireDefault(_JsFile);
	
	                                    var _normalizeEncodingValue = __webpack_require__(11);
	
	                                    var _normalizeEncodingValue2 = _interopRequireDefault(_normalizeEncodingValue);
	
	                                    function _interopRequireDefault(obj) {
	                                                return obj && obj.__esModule ? obj : { default: obj };
	                                    }
	
	                                    var _JsFile$Engine$errors = _JsFile2.default.Engine.errors;
	                                    var invalidFileType = _JsFile$Engine$errors.invalidFileType;
	                                    var invalidReadFile = _JsFile$Engine$errors.invalidReadFile;
	
	                                    /**
	                                     * @description Read files in Fiction Book Format
	                                     * @public
	                                     */
	
	                                    function parser() {
	                                                var _this = this;
	
	                                                return new Promise(function (resolve, reject) {
	                                                            var fileEntry = {
	                                                                        file: _this.file
	                                                            };
	
	                                                            if (!_this.isValid()) {
	                                                                        reject(new Error(invalidFileType));
	                                                                        return;
	                                                            }
	
	                                                            var createDocument = function createDocument(result) {
	                                                                        var domParser = new DOMParser();
	                                                                        resolve(_this.createDocument(domParser.parseFromString(result, 'application/xml')));
	                                                            };
	
	                                                            _this.readFileEntry(fileEntry).then(function (result) {
	                                                                        var defaultEncoding = _normalizeEncodingValue2.default.defaultEncoding;
	
	                                                                        var _$exec = /encoding="(.+)"/.exec(result);
	
	                                                                        var _$exec2 = _slicedToArray(_$exec, 2);
	
	                                                                        var encoding = _$exec2[1];
	
	                                                                        encoding = encoding ? (0, _normalizeEncodingValue2.default)(encoding) : defaultEncoding;
	
	                                                                        if (encoding !== defaultEncoding) {
	                                                                                    fileEntry.encoding = encoding;
	                                                                                    _this.readFileEntry(fileEntry).then(createDocument, function () {
	                                                                                                return reject(new Error(invalidReadFile));
	                                                                                    });
	                                                                        } else {
	                                                                                    createDocument(result);
	                                                                        }
	                                                            }, function () {
	                                                                        return reject(new Error(invalidReadFile));
	                                                            });
	                                                });
	                                    }
	
	                                    /***/
	                        },
	                        /* 11 */
	                        /***/function (module, exports) {
	
	                                    'use strict';
	
	                                    Object.defineProperty(exports, "__esModule", {
	                                                value: true
	                                    });
	                                    var encodings = {
	                                                'windows-1251': 'cp1251'
	                                    };
	
	                                    var defaultEncoding = exports.defaultEncoding = 'utf8';
	
	                                    /**
	                                     *
	                                     * @param value
	                                     * @return {String}
	                                     * @private
	                                     */
	
	                                    exports.default = function (value) {
	                                                return value && encodings[String(value).toLowerCase()] || defaultEncoding;
	                                    };
	
	                                    /***/
	                        },
	                        /* 12 */
	                        /***/function (module, exports, __webpack_require__) {
	
	                                    'use strict';
	
	                                    Object.defineProperty(exports, "__esModule", {
	                                                value: true
	                                    });
	                                    exports.default = parsePages;
	
	                                    var _JsFile = __webpack_require__(1);
	
	                                    var _JsFile2 = _interopRequireDefault(_JsFile);
	
	                                    function _interopRequireDefault(obj) {
	                                                return obj && obj.__esModule ? obj : { default: obj };
	                                    }
	
	                                    var Document = _JsFile2.default.Document;
	
	                                    /**
	                                     *
	                                     * @param xml
	                                     * @param documentData
	                                     * @param list
	                                     * @private
	                                     */
	
	                                    function parsePages(xml, documentData, list) {
	                                                var _xml$attributes = xml.attributes;
	                                                var attributes = _xml$attributes === undefined ? {} : _xml$attributes;
	
	                                                [].forEach.call(xml && xml.childNodes || [], function (node) {
	                                                            var localName = node.localName;
	
	                                                            if (localName === 'title') {
	                                                                        var res = this.parseBlock(node, documentData);
	                                                                        res.properties.className = 'title';
	
	                                                                        list.push(res);
	                                                            } else if (localName === 'section') {
	                                                                        this.parsePages(node, documentData, list);
	                                                            } else if (localName === 'poem') {
	                                                                        this.parsePages(node, documentData, list);
	                                                            } else if (localName === 'stanza') {
	                                                                        var res = this.parseBlockElement({
	                                                                                    node: node,
	                                                                                    documentData: documentData
	                                                                        });
	                                                                        res.properties.className = 'stanza';
	
	                                                                        list.push(res);
	                                                            } else if (localName === 'cite') {
	                                                                        var res = this.parseBlockElement({
	                                                                                    node: node,
	                                                                                    documentData: documentData
	                                                                        });
	                                                                        res.properties.className = 'cite';
	
	                                                                        list.push(res);
	                                                            } else if (localName === 'epigraph') {
	                                                                        var res = this.parseBlockElement({
	                                                                                    node: node,
	                                                                                    documentData: documentData
	                                                                        });
	                                                                        res.properties.className = 'epigraph';
	
	                                                                        list.push(res);
	                                                            } else if (localName) {
	                                                                        list.push(this.parseBlockElement({
	                                                                                    node: node,
	                                                                                    documentData: documentData
	                                                                        }));
	                                                            }
	                                                }, this);
	
	                                                if (attributes.id && attributes.id.value && list[0]) {
	                                                            var el = Document.elementPrototype;
	                                                            el.properties.tagName = 'A';
	                                                            el.properties.name = attributes.id.value;
	
	                                                            var it = list.length - 1;
	                                                            while (it >= 0 && list[it].properties.tagName != 'DIV') {
	                                                                        list[it].children.unshift(el);
	                                                                        --it;
	                                                            }
	                                                }
	                                    }
	
	                                    /***/
	                        },
	                        /* 13 */
	                        /***/function (module, exports, __webpack_require__) {
	
	                                    'use strict';
	
	                                    Object.defineProperty(exports, "__esModule", {
	                                                value: true
	                                    });
	                                    exports.default = parseBlockElement;
	
	                                    var _parseImage = __webpack_require__(9);
	
	                                    var _parseImage2 = _interopRequireDefault(_parseImage);
	
	                                    var _JsFile = __webpack_require__(1);
	
	                                    var _JsFile2 = _interopRequireDefault(_JsFile);
	
	                                    function _interopRequireDefault(obj) {
	                                                return obj && obj.__esModule ? obj : { default: obj };
	                                    }
	
	                                    var Document = _JsFile2.default.Document;
	
	                                    /**
	                                     *
	                                     * @param options {{node, documentData}}
	                                     * @private
	                                     */
	
	                                    function parseBlockElement() {
	                                                var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	                                                var result = undefined;
	                                                var documentData = options.documentData;
	                                                var _options$node = options.node;
	                                                var node = _options$node === undefined ? {} : _options$node;
	                                                var localName = node.localName;
	
	                                                switch (localName) {
	                                                            case 'p':
	                                                                        result = this.parseParagraph({ node: node });
	                                                                        //result.properties.class = 'tag-p';
	
	                                                                        break;
	                                                            case 'empty-line':
	                                                                        result = Document.elementPrototype;
	                                                                        result.properties.tagName = 'BR';
	                                                                        break;
	                                                            case 'subtitle':
	                                                                        result = this.parseParagraph({ node: node });
	                                                                        result.style.textAlign = 'center';
	                                                                        break;
	                                                            case 'image':
	                                                                        result = (0, _parseImage2.default)({
	                                                                                    node: node,
	                                                                                    documentData: documentData
	                                                                        });
	
	                                                                        break;
	                                                            case 'v':
	                                                                        result = this.parseParagraph({ node: node });
	                                                                        result.style.textAlign = 'center';
	                                                                        result.style.fontStyle = 'italic';
	                                                                        result.style.color = 'purple';
	
	                                                                        break;
	                                                            case 'text-author':
	                                                                        result = this.parseParagraph({ node: node });
	                                                                        result.properties.className = 'text-author';
	
	                                                                        break;
	                                                            default:
	                                                                        if (localName) {
	                                                                                    result = this.parseBlock(node, documentData);
	                                                                        }
	                                                }
	
	                                                return result;
	                                    }
	
	                                    /***/
	                        },
	                        /* 14 */
	                        /***/function (module, exports, __webpack_require__) {
	
	                                    'use strict';
	
	                                    Object.defineProperty(exports, "__esModule", {
	                                                value: true
	                                    });
	                                    exports.default = parseBlock;
	
	                                    var _JsFile = __webpack_require__(1);
	
	                                    var _JsFile2 = _interopRequireDefault(_JsFile);
	
	                                    function _interopRequireDefault(obj) {
	                                                return obj && obj.__esModule ? obj : { default: obj };
	                                    }
	
	                                    var Document = _JsFile2.default.Document;
	                                    function parseBlock(xml, documentData) {
	                                                var result = Document.elementPrototype;
	
	                                                [].forEach.call(xml && xml.childNodes || [], function (node) {
	                                                            if (node.localName) {
	                                                                        result.children.push(this.parseBlockElement({
	                                                                                    node: node,
	                                                                                    documentData: documentData
	                                                                        }));
	                                                            }
	                                                }, this);
	
	                                                return result;
	                                    }
	
	                                    /***/
	                        },
	                        /* 15 */
	                        /***/function (module, exports, __webpack_require__) {
	
	                                    'use strict';
	
	                                    Object.defineProperty(exports, "__esModule", {
	                                                value: true
	                                    });
	                                    exports.default = parseParagraph;
	
	                                    var _parseLinkElement = __webpack_require__(16);
	
	                                    var _parseLinkElement2 = _interopRequireDefault(_parseLinkElement);
	
	                                    var _JsFile = __webpack_require__(1);
	
	                                    var _JsFile2 = _interopRequireDefault(_JsFile);
	
	                                    function _interopRequireDefault(obj) {
	                                                return obj && obj.__esModule ? obj : { default: obj };
	                                    }
	
	                                    var Document = _JsFile2.default.Document;
	
	                                    /**
	                                     *
	                                     * @param params
	                                     * @returns {*}
	                                     * @private
	                                     */
	
	                                    function parseParagraph() {
	                                                var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	                                                var element = undefined;
	                                                var attrValue = undefined;
	                                                var node = params.node;
	                                                var result = Document.elementPrototype;
	                                                result.properties.tagName = 'P';
	
	                                                if (!node) {
	                                                            return result;
	                                                }
	
	                                                var children = [].slice.call(node && node.childNodes || [], 0);
	                                                children.forEach(function (child) {
	                                                            var _child$textContent = child.textContent;
	                                                            var textContent = _child$textContent === undefined ? '' : _child$textContent;
	                                                            var localName = child.localName;
	                                                            var _child$attributes = child.attributes;
	                                                            var attributes = _child$attributes === undefined ? {} : _child$attributes;
	
	                                                            if (localName === 'a') {
	                                                                        element = (0, _parseLinkElement2.default)(child);
	                                                            } else {
	                                                                        element = Document.elementPrototype;
	                                                                        element.properties.tagName = 'SPAN';
	                                                                        element.properties.textContent = textContent;
	                                                                        element.properties.className = 'tag-span';
	
	                                                                        if (localName === 'strong') {
	                                                                                    element.style.fontWeight = 'bold';
	                                                                        } else if (localName === 'emphasis') {
	                                                                                    element.style.fontStyle = 'italic';
	                                                                        }
	                                                            }
	
	                                                            attrValue = attributes['xml:lang'] && attributes['xml:lang'].value;
	                                                            if (attrValue) {
	                                                                        element.properties.lang = attrValue;
	                                                            }
	
	                                                            result.children.push(element);
	                                                });
	
	                                                attrValue = node.attributes && node.attributes['xml:lang'] && node.attributes['xml:lang'].value;
	                                                if (attrValue) {
	                                                            result.properties.lang = attrValue;
	                                                }
	
	                                                if (!children[0] && node.textContent) {
	                                                            element = Document.elementPrototype;
	                                                            element.properties.textContent = node.textContent;
	                                                            result.children.push(element);
	                                                }
	
	                                                return result;
	                                    }
	
	                                    /***/
	                        },
	                        /* 16 */
	                        /***/function (module, exports, __webpack_require__) {
	
	                                    'use strict';
	
	                                    Object.defineProperty(exports, "__esModule", {
	                                                value: true
	                                    });
	                                    exports.default = parseLinkElement;
	
	                                    var _JsFile = __webpack_require__(1);
	
	                                    var _JsFile2 = _interopRequireDefault(_JsFile);
	
	                                    function _interopRequireDefault(obj) {
	                                                return obj && obj.__esModule ? obj : { default: obj };
	                                    }
	
	                                    var Document = _JsFile2.default.Document;
	
	                                    /**
	                                     *
	                                     * @param node
	                                     * @returns {*}
	                                     * @private
	                                     */
	
	                                    function parseLinkElement() {
	                                                var node = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	                                                var result = Document.elementPrototype;
	                                                var href = node.attributes['l:href'] || node.attributes['xlink:href'];
	                                                var link = href && href.value || '';
	
	                                                result.properties.tagName = 'A';
	                                                result.properties.textContent = node.textContent;
	                                                result.properties.href = link;
	
	                                                if (link && link[0] !== '#') {
	                                                            result.properties.target = '_blank';
	                                                }
	
	                                                return result;
	                                    }
	
	                                    /***/
	                        }
	                        /******/])
	            );
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)(module)))

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	function Player(scroll) {
		var timeout = 0;
		var SCROLL_TIMEOUT = void 0;
		var thus = this;
		var isPlay = false;
		var directionIsDown = true;
	
		var MAX_DELAY = 3;
		var SHIFT_DELAY = 0.25;
		var DEFAULT_DELAY = 1;
		var INF_TIMEOUT = 60 * 60 * 60 * 1000;
		var DEFAULT_TIMEOUT = 10 * 1000;
	
		SCROLL_TIMEOUT = DEFAULT_TIMEOUT;
	
		var play = function play() {
			if (!isPlay) {
				isPlay = true;
	
				timeout = setInterval(function () {
					scroll(directionIsDown);
				}, SCROLL_TIMEOUT);
			}
		};
	
		var setDelay = function setDelay(val) {
			if (val < 0) {
				directionIsDown = false;
	
				val = -val;
			}
	
			if (val == 0) {
				SCROLL_TIMEOUT = INF_TIMEOUT;
			} else {
				SCROLL_TIMEOUT = DEFAULT_TIMEOUT * DEFAULT_DELAY / val;
			}
	
			if (isPlay) {
				thus.stop();
				thus.play();
			}
		};
	
		var stop = function stop() {
			clearInterval(timeout);
			isPlay = false;
		};
	
		this.play = play.bind(this);
		this.stop = stop.bind(this);
		this.setDelay = setDelay.bind(this);
		this.init = function (init) {
			init(thus, MAX_DELAY, SHIFT_DELAY, DEFAULT_DELAY);
		};
	
		return this;
	}
	
	module.exports.Player = Player;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	function getCookie(name) {
	    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
	
	    return matches ? decodeURIComponent(matches[1]) : undefined;
	}
	
	getCookie.part1 = function (n) {
	    var val = getCookie(n) || '0';
	    var tmp = val.split('_');
	
	    return tmp[0];
	};
	
	var __NAME__ = void 0,
	    __IS_LOGIN__ = void 0;
	
	var __login = function __login() {
	    var login = $('#login');
	    var sh_login = $('#login .login');
	    var sh_exit = $('#login .exit');
	    var err = $('#login .error');
	    var thus = this;
	
	    this.resolve = function () {
	        __NAME__ = getCookie.part1('user');
	        __IS_LOGIN__ = !(__NAME__ == '0');
	
	        if (__IS_LOGIN__) {
	            sh_exit.show();
	            sh_login.hide();
	        } else {
	            sh_login.show();
	            sh_exit.hide();
	        }
	    };
	
	    this.deleteCookie = function (c_name) {
	        document.cookie = encodeURIComponent(c_name) + "=; expires=" + new Date(0).toUTCString();
	    };
	
	    thus.resolve();
	
	    $('#btnLogin').click(function () {
	        var name = $('#login input[name=user]').val().split('/')[0];
	        var psw = $('#login input[name=psw]').val().split('/')[0];
	
	        $.get('/login/_' + name + '/_' + psw).always(function () {
	            login.hide();
	        }).fail(function () {
	            thus.login('Login and/or psw are wrong');
	        }).done(function (data) {
	            //msg('You were login.');
	
	            location.assign('/' + (data.link || ''));
	        });
	    });
	
	    $('#btnExit').click(function () {
	        thus.exit();
	    });
	
	    this.login = function (error) {
	        login.show();
	
	        if (error) {
	            err.html(error);
	            err.show();
	        } else {
	            err.html('');
	            err.hide();
	        }
	    };
	
	    this.exit = function () {
	        $.get('/login/exit/_' + getCookie.part1('user')).done(function () {
	            thus.deleteCookie('user');
	            thus.deleteCookie('connect.sid');
	
	            location.reload();
	        }).fail(function (e) {
	            error(e);
	        });
	    };
	
	    return this;
	};
	
	exports.__login = __login;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */
	
	exports = module.exports = __webpack_require__(11);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome
	               && 'undefined' != typeof chrome.storage
	                  ? chrome.storage.local
	                  : localstorage();
	
	/**
	 * Colors.
	 */
	
	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];
	
	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */
	
	function useColors() {
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	  return (typeof document !== 'undefined' && 'WebkitAppearance' in document.documentElement.style) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (window.console && (console.firebug || (console.exception && console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
	}
	
	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */
	
	exports.formatters.j = function(v) {
	  try {
	    return JSON.stringify(v);
	  } catch (err) {
	    return '[UnexpectedJSONParseError]: ' + err.message;
	  }
	};
	
	
	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */
	
	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;
	
	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);
	
	  if (!useColors) return args;
	
	  var c = 'color: ' + this.color;
	  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));
	
	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });
	
	  args.splice(lastC, 0, c);
	  return args;
	}
	
	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */
	
	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console
	    && console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}
	
	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */
	
	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch(e) {}
	}
	
	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */
	
	function load() {
	  var r;
	  try {
	    return exports.storage.debug;
	  } catch(e) {}
	
	  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	  if (typeof process !== 'undefined' && 'env' in process) {
	    return process.env.DEBUG;
	  }
	}
	
	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */
	
	exports.enable(load());
	
	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */
	
	function localstorage(){
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ },
/* 10 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */
	
	exports = module.exports = debug.debug = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(12);
	
	/**
	 * The currently active debug mode names, and names to skip.
	 */
	
	exports.names = [];
	exports.skips = [];
	
	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */
	
	exports.formatters = {};
	
	/**
	 * Previously assigned color.
	 */
	
	var prevColor = 0;
	
	/**
	 * Previous log timestamp.
	 */
	
	var prevTime;
	
	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */
	
	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}
	
	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */
	
	function debug(namespace) {
	
	  // define the `disabled` version
	  function disabled() {
	  }
	  disabled.enabled = false;
	
	  // define the `enabled` version
	  function enabled() {
	
	    var self = enabled;
	
	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;
	
	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();
	
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	
	    args[0] = exports.coerce(args[0]);
	
	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }
	
	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);
	
	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });
	
	    // apply env-specific formatting
	    args = exports.formatArgs.apply(self, args);
	
	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;
	
	  var fn = exports.enabled(namespace) ? enabled : disabled;
	
	  fn.namespace = namespace;
	
	  return fn;
	}
	
	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */
	
	function enable(namespaces) {
	  exports.save(namespaces);
	
	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;
	
	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/[\\^$+?.()|[\]{}]/g, '\\$&').replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}
	
	/**
	 * Disable debug output.
	 *
	 * @api public
	 */
	
	function disable() {
	  exports.enable('');
	}
	
	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */
	
	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}
	
	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */
	
	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */
	
	var s = 1000
	var m = s * 60
	var h = m * 60
	var d = h * 24
	var y = d * 365.25
	
	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @throws {Error} throw an error if val is not a non-empty string or a number
	 * @return {String|Number}
	 * @api public
	 */
	
	module.exports = function (val, options) {
	  options = options || {}
	  var type = typeof val
	  if (type === 'string' && val.length > 0) {
	    return parse(val)
	  } else if (type === 'number' && isNaN(val) === false) {
	    return options.long ?
				fmtLong(val) :
				fmtShort(val)
	  }
	  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val))
	}
	
	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */
	
	function parse(str) {
	  str = String(str)
	  if (str.length > 10000) {
	    return
	  }
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str)
	  if (!match) {
	    return
	  }
	  var n = parseFloat(match[1])
	  var type = (match[2] || 'ms').toLowerCase()
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n
	    default:
	      return undefined
	  }
	}
	
	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */
	
	function fmtShort(ms) {
	  if (ms >= d) {
	    return Math.round(ms / d) + 'd'
	  }
	  if (ms >= h) {
	    return Math.round(ms / h) + 'h'
	  }
	  if (ms >= m) {
	    return Math.round(ms / m) + 'm'
	  }
	  if (ms >= s) {
	    return Math.round(ms / s) + 's'
	  }
	  return ms + 'ms'
	}
	
	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */
	
	function fmtLong(ms) {
	  return plural(ms, d, 'day') ||
	    plural(ms, h, 'hour') ||
	    plural(ms, m, 'minute') ||
	    plural(ms, s, 'second') ||
	    ms + ' ms'
	}
	
	/**
	 * Pluralization helper.
	 */
	
	function plural(ms, n, name) {
	  if (ms < n) {
	    return
	  }
	  if (ms < n * 1.5) {
	    return Math.floor(ms / n) + ' ' + name
	  }
	  return Math.ceil(ms / n) + ' ' + name + 's'
	}


/***/ }
/******/ ]);
//# sourceMappingURL=bookReader.js.map