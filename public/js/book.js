"use strict";

//let debug = require('debug')('book');
let debug = console.log.bind(console);
import JsFile from './jsFile/filejs';
import JsFileFb from './jsFile/filejs-fb';
let Player = require('./player').Player;

JsFile.defineEngine(JsFileFb);

jQuery.fn.cssInt = function(n) {
    return parseInt($(this[0]).css(n), 10);
};

var doNothing = ()=>{};

var __book = function(idElem, interfaceFunc) {
    var info = {};
    var user = undefined;

	let error = interfaceFunc['error'];
	let msg = interfaceFunc['msg'];

    var bookDoc;
    var bookEl = $('#' + idElem);
    var slider = $('#slider_btn');
    var footnote = $('#footnote');
    var sliderHeight = $('#slider').height() - slider.height();
    var hiddenEl = $('#hidden_' + idElem);
    var lineSize;
    var lineCnt;
    var json;
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

    const ECHO_TIMEOUT = 1000 * 60;

    var __bookmarks = [];

// init interface function, no DOM
	this.player = new Player(scrollOneString);
// no ajax
    this['__int__bookmark'] = interfaceFunc['bookmark'](thus);
    this['__int__loading'] = interfaceFunc['loading'](thus);
    this['__int__controllerLeft'] = interfaceFunc['controllerLeft'](thus);
	let __int__playerInit = interfaceFunc['playerInit'](this.player);
// set settings
    this['__int__ajaxSettings'] = interfaceFunc['ajaxSettings'](thus);

	this.player.init(__int__playerInit);
// ajax part


// end init

/**
 * add border
 */
	this.selectEl = (function() {
		let nowSelect = {
			'user-sel': undefined,
			'jump': undefined,
			'another-state': undefined
		};

		return function (id, state) {
			state = state || 'another-state';

			if (!nowSelect.hasOwnProperty(state))
			{
				state = 'another-state';
			}

			if (typeof id == 'undefined' || id == -1)
			{
				if (typeof nowSelect[state] != 'undefined')
				{
					__[nowSelect[state]].removeClass('select');
					__[nowSelect[state]].attr('select-state', '');

					nowSelect[state] = undefined;
				}
			}
			else
			{
				if (typeof nowSelect[state] != 'undefined')
				{
					__[nowSelect[state]].removeClass('select');

					__[nowSelect[state]].attr('select-state', '');
				}

				nowSelect[state] = +id;
				__[nowSelect[state]].addClass('select');
				__[nowSelect[state]].attr('select-state', state);
			}
		};
	})();

//  id := screen.pos
//  @set up slider
//  ---------------------
//  @return css.top
    function sliderTop(id)
    {
        if (arguments.length)
        {// set top
            slider.css('top', id / maxPos * sliderHeight);
        }
        else
        {// get top
            return Math.floor(slider.cssInt('top') / sliderHeight * maxPos);
        }
    }

//  Y := (coor.Y - offset)
//  @return book.pos
    function sliderPos(Y)
    {
        return Math.floor(Y / sliderHeight * maxPos);
    }

    function setLoadValueFalse(name)
    {
        setTimeout(()=>{
            load[name] = false;
        }, timeout[name + 'load'] || 1000);
    }

    this.addBookmark = function(pos, title, text, id) {
        __bookmarks['__' + id] = {
            pos: pos || 0,
            title: title,
            text: text
        };

        if (mode['online'])
        {
            thus.save();
        }
        else
        {
            saved.bookmarkCount++;
        }
    };

    this.editBookmark = function(id, pos, title, text) {
        let prom = new Promise(function(resolve, reject){

            let dd = {
                mark: {
                    id: id,
                    pos: pos,
                    title: title,
                    text: text
                }
            };

            if (mode['online'])
            {
                if (!load.bookmark)
                {
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
                    }).always(function() {
                        setLoadValueFalse('bookmark');
                    });
                }
                else
                {
	                reject('Queue');
                }
            }
            else
            {
	            reject('Ur in offline mode');
            }
        });

        return prom.then(doNothing, error);
    };

    this.deleteBookmark = function(id) {
        let prom = new Promise(function(resolve, reject){
            let dd = {
                markId: id
            };

            if (mode['online'])
            {
                if (!load.bookmark)
                {
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
                    }).always(function() {
                        setLoadValueFalse('bookmark');
                    });
                }
                else
                {
	                reject('Queue');
                }
            }
            else
            {
	            reject('Ur in offline mode');
            }
        });

        return prom.then((id) => {thus.__int__bookmark.deleteBookmark(id);}, error);
    };

    this.reloadBookmark = function() {
        let prom = new Promise(function(resolve, reject){
            if (mode['online'])
            {
                if (bookId)
                {
                    if (!load.reloadBookmark)
                    {
                        load.reloadBookmark = true;

                        $.ajax({
                            method: 'GET',
                            url: '/book/bookmark/get/_' + bookId
                        }).done (function(d) {
                            loadBookmarks(d);

                            try {
                                resolve();
                            } catch (err) {

                            }
                        }).fail(function() {
	                        reject('System error');
                        }).always(() => {
                            setLoadValueFalse('reloadBookmark');
                        });
                    }
                    else
                    {
	                    reject('Ur already reload');
                    }
                }
                else
                {
	                reject('Ur must open the book');
                }
            }
            else
            {
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
    this.save = function(anyway) {
        let prom = new Promise(function(resolve, reject){
	        if (!thus.isSaved())
	        {
		        if (mode['online'])
		        {
			        if (bookId)
			        {
				        if (!load.save || anyway)
				        {
					        load.save = true;

					        // disable edit/delete bookmarks
					        $('.bookmarks > .btn-bookmark-edit').data('disable', 'true');

					        var tmpSave = screen.pos;

					        var dd = {
						        pos: tmpSave,
						        bookmarks: []
					        };

					        for (var kk = Object.keys(__bookmarks), i = 0; i < kk.length; ++i)
					        {
						        dd.bookmarks.push(__bookmarks[kk[i]]);
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

						        if (dd.bookmarks.length > 0)
						        {
							        $.ajax({
								        method: 'GET',
								        url: '/book/bookmark/get/_' + bookId
							        }).done (function(d) {
								        loadBookmarks(d);

								        try {
									        resolve();
								        } catch (err) {

								        }
							        });
						        }
						        else
						        {
							        try {
								        resolve();
							        } catch (err) {

							        }
						        }
					        }).fail(function(){
						        error('System error');

						        reject();
					        }).always(()=> {
						        setLoadValueFalse('save');
					        });
				        }
				        else
				        {
					        msg('Ur already save');

					        reject();
				        }
			        }
			        else
			        {
				        //error('U must open book');

				        try {
					        resolve();
				        } catch (err) {

				        }
			        }
		        }
		        else
		        {
			        msg('Ur in offline mode');

			        reject();
		        }
	        }
	        else
	        {
		        resolve();
	        }
        });

        return prom.then(doNothing, error);
    };

    this.isSaved = function () {
        return (saved.pos == screen.pos && saved.bookmarkCount == 0);
    };

    /**
     * Switch online <-> offline
     * Add class offline for all el.online
     * Emmit when checkConnect false
     */
    this.swapOnlineMode = function () {
        mode['online'] = !mode['online'];
        if (mode['online'])
        {
            $('.online').removeClass('offline');
            debug('Online mode');

            setTimeout(checkConnect, 1000 * 60);
            thus.save();
        }
        else
        {
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
        if (mode['night'])
        {
            bookEl.addClass('night');
        }
        else
        {
            bookEl.removeClass('night');
        }
    };

    /**
     * Write array of bookmarks in VAR lb = #listOfBookmarks
     * Add bookmarks in slider
     * sync
     * @param bm - array of bookmarks
     */
    function loadBookmarks(bm)
    {
        var lb = $('#listOfBookmarks');


        //debug(bm);

        // bm and slider clear
        lb.empty();
        sliderBookMarks.empty();

        bm.sort((a, b) => {
            if (+a.pos > +b.pos)
                return 1;
            if (+a.pos < +b.pos)
                return -1;

            return 0;
        });

        for(var k in bm)
        {
            if (bm.hasOwnProperty(k))
            {
                var tmp = $(`<div data-id="${bm[k]._id}">
                    <div class="bookmark-pos hide">${bm[k].pos}</div>
                    <div class="bookmark-title contenteditable">${bm[k].title}</div>
                    <div class="bookmark-text contenteditable">${bm[k].text}</div>
                    <a class="icon btn-bookmark-goto">${bm[k].pos}</a>
                    <a class="icon btn-bookmark-edit online">E</a>
                    <a class="icon btn-bookmark-save online">S</a>
                    <a class="icon btn-bookmark-delete online">D</a>
                </div>`).addClass('bookmark').data('pos', bm[k].pos);

                lb.append(tmp);

                var el = $('<div></div>')
                    .addClass('mark-user')
                    .css('top', bm[k].pos / maxPos * sliderHeight)
                    .data('pos', bm[k].pos)
                    .click(function() {
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
    this.getBook = function(id) {
        let prom = new Promise(function(resolve, reject)
        {

            if (mode['online'])
            {
                if (id && id != 0)
                {
                    if (!load.book)
                    {
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


                                var fb2 = new JsFile(blobWithBook, {
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

                                    var el0 = $('<div></div>')
                                        .addClass('mark-div')
                                        .click(function () {
                                            thus.jmp(0);
	                                        thus.selectEl(0, 'jump');
                                        });

                                    sliderMarks.append(el0);


                                    $('.jf-page > div.h-l').each(function () {
                                        var id = $(this).data('id');

                                        if ($(this).next().children() && $(this).next().children()[0] &&
                                                $(this).next().children()[0].tagName === 'A' &&
                                            $(this).next().children()[0].name)
                                        {
                                            // number of footnote

                                        }
                                        else
                                        {
                                            if ($(this).attr('class').indexOf('title') >= 0)
                                            {
                                                if (id > 10)
                                                {
                                                    var el = $('<div></div>')
                                                        .addClass('mark-div')
                                                        .css('top', id / maxPos * sliderHeight)
                                                        .click(function () {
                                                            thus.jmp(id);
	                                                        thus.selectEl(id, 'jump');
                                                        });

                                                    sliderMarks.append(el);
                                                }
                                            }
                                        }
                                    });

                                    // footnote
                                    $('.jf-page a').click(function(){
                                        var id = $(this).attr('href').substr(1);
                                        var num = $(this).html();
                                        var text = '';

                                        $('#book a[name=' + id + ']').each(function () {
                                            text += $(this).closest('p.h-l').html();
                                            text += '<br>';
                                        });

                                        thus.__int__controllerLeft('navigate');

                                        footnote.empty();
                                        var el = $(`<div class="footnote">
	                                                    <p style="text-align: center">${num || ''}</p>
	                                                    <p>${text || ''}</p>
	                                                </div>
                                        `);
                                        footnote.append(el);

                                        return false;
                                    });

                                    $('.jf-page a').dblclick(function() {
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
                                    } catch (err) {

                                    }
                                }, function (e) {
                                    thus.__int__loading.stop();
                                    error('Can not read this file. ' + e);
	                                reject();
                                });
                            }).fail(function () {
                                error('This book did not load.');
	                            reject();
                            }).always(()=> {
                                setLoadValueFalse('book');
                            });
                        }).fail(function () {
                            setLoadValueFalse('book');

                            //bookEl.empty();
                            //bookEl.append($('<span>Can not load file.</span>'));

                            error('Info did not get.');
	                        reject();
                        });
                    }
                    else
                    {
                        msg('Ur loading book now');
	                    reject();
                    }
                }
            }
        });

        return prom.then(doNothing, error);
    };

    this.deleteBook = function (id, title) {
        if (mode['online'])
        {
            if (confirm('rU sure u want delete this book{title: ' + title + '} '))
            {
                if (!load.del) {
                    load.del = true;

                    $.ajax({
                        url: './store/book/delete/_' + id,
                        method: 'delete'
                    }).done(function () {
                        msg('Book has been deleted.');

                        //thus.save(true);

                        location.reload();
                    }).fail(function () {
                        error('You can not delete this book.');
                    }).always(()=> {
                        setLoadValueFalse('del');
                    });
                }
                else {
                    msg('Ur already delete book');
                }
            }
        }
    };
/*
    this.scrollEl = function(id) {
        var top = $('#p_' + id).offset().top - offset_book;
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
	function scrollOneString()
	{
		thus.scroll(false, 0.001);
	}

    /**
     * scrollEl(id) + save jmp pos
     * @param id - scroll pos
     */
    this.jmp = function(id) {
	    if (arguments.length == 0)
	    {
		    id = screen.pos;
	    }

        if (Math.abs(jump.list[jump.it - 1] - screen.pos) > 3)
        {
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
        if (jump.it == jump.list.length)
        {
            if (jump.list[jump.it - 1] && jump.list[jump.it - 1] != screen.pos)
            {
                jump.list.push(screen.pos);
            }
        }

        if (jump.it > 0)
        {
            --jump.it;
            if (jump.list[jump.it] == screen.pos)
            {
                return this.jmpUndo();
            }
            scrollEl(jump.list[jump.it]);

            if (jump.timer)
            {
                clearTimeout(jump.timer);
            }

            jump.timer = setTimeout(function() {
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
        if (jump.it < jump.list.length)
        {
            if (jump.list[jump.it] == screen.pos)
            {
                ++jump.it;
                return this.jmpRedo();
            }
            scrollEl(jump.list[jump.it]);

            ++jump.it;

            if (jump.timer)
            {
                clearTimeout(jump.timer);
            }

            jump.timer = setTimeout(function() {
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

        if (typeof scroll == 'undefined')
        {
            scroll = 0;
        }

        if (typeof id == 'undefined')
        {
            id = screen.pos;
        }

        if (id < 0)
        {
            scrollEl(0);


            return ;
        }
        if (id >= maxPos)
        {
            scrollEl(maxPos - 1);

            return ;
        }


        var hV = 0;
        var shV = 0;
        var shH = screen.now;

        if(isNaN(id) || id < 0 || id >= maxPos)
        {
            scrollEl(0); //debug(id);

            return ;
        }

        // how much i must show
        do {
            hV += __[(id + shV)].innerHeight();
            ++shV;

            //debug(shV, hV, height);
        } while (hV < height  + scroll && id + shV < maxPos);

        // pos + now -> hide
        for (let k = 0; k < shH; ++k)
        {
            __[screen.pos + k].hide();
        }

        // id + sh -> show
        for (let k = 0; k < shV; ++k)
        {
            __[id + k].show();

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
    this.scroll = function (isUp, coef, deltaY){
        coef = coef || 1;
        if (deltaY)
        {
            coef = 3 * lineSize / height * deltaY / 100;
        }
	    else if (coef < 1/8)
        {
	        coef = getPerOfLineSize();
        }

        let _coef = coef;
        let scroll = $(document).scrollTop();
        $(document).scrollTop(0);

        if (!isUp)
        {// down
            {
                // all cases
                let id = screen.pos;
                let hV = 0;
                let shV = 0;

                //debug(' POS = ' + id); debug('!!!!' + (maxPos == __.length));

                // how much i must show

	            do {
		            //debug('curr = ' + (id + shV)); debug('H = ' + hV);
		            hV += __[(id + shV)].innerHeight();
		            ++shV;
	            } while (hV < height * _coef + scroll && id + shV < maxPos);
				--shV;

                if (id + shV == maxPos)
                {
                    scrollEl(maxPos - 1);
                }
                else
                {
                    if (shV > 0)
                    {
	                    let elapsed = height * _coef + scroll - hV + __[id + shV].innerHeight();
	                    if (elapsed >= 0)
	                    {
		                    scrollEl(id + shV, elapsed);

		                    $(document).scrollTop(elapsed);
	                    }
	                    else
	                    {
							alert(elapsed);
	                    }
                    }
                    else
                    {
	                    let elapsed = height * _coef + scroll;
	                    if (elapsed >= 0)
	                    {
		                    scrollEl(id, elapsed);

		                    $(document).scrollTop(elapsed);
	                    }
	                    else
	                    {
		                    alert(elapsed)
	                    }
                    }
                }
            }
        }
        else
        {// up
            if (screen.pos == 0)
            {
                return 1;
            }
            else
            {
                // all cases
                let id = screen.pos;
                let hV = 0;
                let shV = 0;

	            while (hV < height * _coef - scroll && id - shV > 0)
	            {
		            ++shV;
		            hV += __[(id - shV)].innerHeight();
	            }

                if (id - shV == 0)
                {
                    scrollEl(0);
                }
                else
                {
                    if (shV > 0)
                    {
	                    let elapsed = hV - height * _coef + scroll; debug('-------NEW elapsed. scroll = ' + elapsed);

	                    if (elapsed >= 0)
	                    {
		                    scrollEl(id - shV, elapsed);

		                    $(document).scrollTop(elapsed);
	                    }
	                    else
	                    {
		                    alert(elapsed);
	                    }
                    }
                    else
                    {
	                    let elapsed = scroll - height * _coef; debug(elapsed);
	                    if (elapsed >= 0)
	                    {
		                    scrollEl(id, elapsed);

		                    $(document).scrollTop(elapsed);
	                    }
	                    else
	                    {
		                    alert(elapsed);
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
    this.scrollSlider = function(Y) {
        if (arguments.length)
        {// slider <- id
            thus.jmp(sliderPos(Y));

            //scrollTop(screen.pos);
        }
        else
        {// id <- slider
            thus.jmp(sliderPos(slider.cssInt('top')));
            sliderTop(screen.pos);
        }
    };

    function checkConnect() {
        if (mode['online'])
        {
            $.get('./echo/_')
                .done(() => {
                    setTimeout(checkConnect, ECHO_TIMEOUT);
                }).fail(() => {
                if (mode['online'])
                {
                    $('#onlineMode').trigger('click');
                }
            });
        }
    }


    setTimeout(checkConnect, 1000 * 60);

    this.getUserInfo = function() {
        let prom = new Promise(function(resolve, reject) {
            if (mode['online'])
            {
                if (!load.user)
                {
                    load.user = true;

                    $.get('/login/info').done(function (t) {
                        user = t;

                        try {
                            resolve();
                        } catch (err) {

                        }
                    }).fail(() => {
	                    reject();
                    }).always(()=> {
                        load.user = false;
                    });
                }
                else
                {
                    setTimeout(function() {
                        thus.ready(resolve);
                    }, 500);
                }
            }
        });

        return prom.then(doNothing, error);
    };

    this.ready = function (cb) {
        if (user && !load.user)
        {
            //thus.__int__loading.play();
            try {
                cb(thus);
            } catch (err) {

            }
            thus.__int__loading.stop();
        }
        else
        {

            thus.getUserInfo().then(function (){
                cb(thus);
            }, error);
        }
    };

    this.update = function (cb) {
        user = undefined;

        thus.getUserInfo().then(cb, error);
    };

    this.getFiles = function() {
        thus.ready(function() {
            fs.empty();
            fs.append($('<ol>'));

            for (let t in user.books)
            {
	            //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop,JSUnfilteredForInLoop
	            var appEl = $('<div>')
                                .html(user.books[t].author + ' : ' + user.books[t].title)
                                .data('id', user.books[t].id)
                                .addClass('fs')
                                .addClass('online');

	            //noinspection JSUnfilteredForInLoop,JSUnfilteredForInLoop
	            var iconDel = $('<span>')
                    .html('X')
                    .addClass('fs-del')
                    .addClass('online')
                    .data('id', user.books[t].id)
                    .data('title', user.books[t].title);


                let li = $('<li>').append(appEl);
                let divControl = $('<div>').addClass('fs-control').append(iconDel);


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

    this.recalc = function() {
        lineSize = (+bookEl.css('line-height').slice(0, -2));
        height = hiddenEl.height();
        lineCnt = Math.floor(hiddenEl.height() / lineSize);
        offsetBook = bookEl.offset().top;
    };

	function getPerOfLineSize()
	{
		return lineSize/height;
	}

    this.recalc();
    this.getUserInfo().then(() => {
        if (user.lastBook != '0')
        {
            thus.getBook(user.lastBook);
        }
    }, error);

	window.onbeforeunload = function(e) {
        if (mode['online'])
        {
            if (!thus.isSaved())
            {

	            thus.save(true);

            }
        }
        else
        {
            e.returnValue = `U don't save pos (${ Math.abs(screen.pos - saved.pos) }) and u have ${ saved.bookmarkCount } bookmarks`;

            return `U don't save pos (${ Math.abs(screen.pos - saved.pos) }) and u have ${ saved.bookmarkCount } bookmarks`;
        }
    };
// GETTER

    this.getMaxPos = function() {
        return maxPos;
    };


    this.getPos = function() {
        return screen.pos;
    };

    this.debug = function () {
	    return __[screen.pos];
    };

    return this;
};

export {__book};
