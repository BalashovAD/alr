"use strict";
function cssCenter1Line() {
    $('.css-center-1-line').each(function () {
        $(this).css('line-height', $(this).css('height'));
    });
}

var __DEBUG__adm;

$(document).ready(() => {
    cssCenter1Line();

    let adm = new Adm();

    // DEBUG
    __DEBUG__adm = adm;

    $('.item-menu').click(function() {
        let id = $(this).data('id');
        let side = $(this).data('side');
        let sel = $(this).data('select');

        adm.show(id, side, sel);
    });

    // left - user, right - book
    adm.show(0, 'left', 'user');
    adm.show(0, 'right', 'book');
});


function Adm()
{
    let select = {
        left: '0',
        right: '0'
    };

    let singleSel = {
        left: {
            id: 0,
            col: 0
        },
        right: {
            id: 0,
            col: 0
        }
    };

    let singleContainer = {
        left: $('#leftSingleContainer'),
        right: $('#rightSingleContainer')
    };

    let mainContainer = {
        left: $('#leftMainContainer'),
        right: $('#rightMainContainer')
    };

    let mainFiends = {
        user: ['name', 'prop'],
        book: ['title', 'author'],
        invite: ['value', 'counter']
    };

    let btn = {
        left: {
            user: $('.btn.item-menu.left-side[data-select=user]'),
            book: $('.btn.item-menu.left-side[data-select=book]'),
            invite: $('.btn.item-menu.left-side[data-select=invite]'),
            0: $('#0')

        },
        right: {
            user: $('.btn.item-menu.right-side[data-select=user]'),
            book: $('.btn.item-menu.right-side[data-select=book]'),
            invite: $('.btn.item-menu.right-side[data-select=invite]'),
            0: $('#0')
        }
    };

    let thus = this;

    function getById()
    {
        let id = $(this).data('id');
        let col = $(this).data('col');
        let side = $(this).closest('.side').data('side');


        thus.load(side, id, col);
    }

    function deleteById()
    {
        let id = $(this).data('id');
        let col = $(this).data('col');
        let side = $(this).closest('.side').data('side');
        let data = {
            id: id,
            col: col
        };

        $.ajax({
            method: 'DELETE',
            url: '/admin/delete/_' + col + '/_' + id,
            data: JSON.stringify(data)
        }).done(function() {
            thus.reload();
        });
    }

    function addElem()
    {
        let elms = $(this).closest('.single').find('input');
        let data = {};
        let col = $(this).data('col');

        elms.each(function () {
            data[$(this).attr('name')] = $(this).val();
        });

        $.ajax({
            method: 'POST',
            url: '/admin/add/_' + col,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8"
        }).done(function() {
            thus.reload();
        }).fail(function() {
            console.error('Error');
        });
    }

    function parseObj(data, sel, lvl)
    {
        if (typeof lvl == 'undefined')
        {
            lvl = 0;
        }

        let txt = $('<ol>').addClass('single-data');
        let li;

        for (let i in data)
        {
            if (data.hasOwnProperty(i))
            {
                switch (typeof data[i])
                {
                    case 'string' :
                                    li = $('<li>').html('<span class="object-name">' + i + '</span> : <span>' + data[i] + '</span>');

                                    txt.append(li);

                                    break;

                    case 'object' :
                                    li = $('<li>').append($('<span>').html(i + ' = ').addClass('object-name'))
                                                .append($('<span>').addClass('open-bracket'))
                                                .append(parseObj(data[i], sel, lvl + 1));
                                    txt.append(li);

                                    txt.append($('<span>').addClass('close-bracket'));

                                    break;
                    case 'array' :
                                    break;
                }
            }
        }

        return txt;
    }

    function parseAll(d, sel)
    {
        /*
        User - name, prop
        Book - title, author, ?owner?
        Invite - value, counter
         */

        let txt = $('<ol>').addClass('main-container');

        for (let i = 0; i < d.length; ++i)
        {
            let li = $('<li>').addClass('object');

            let idEl = $('<span>').html('[id]').data('id', d[i]._id).data('col', sel)
                .click(getById);
            li.append(idEl);

            let delEl = $('<span>').html('[del]').data('id', d[i]._id).data('col', sel)
                .click(deleteById);
            li.append(delEl);

            for (let k in mainFiends[sel])
            {
                if (mainFiends[sel].hasOwnProperty(k))
                {
                    if (d[i] && d[i][mainFiends[sel][k]] &&
                            typeof d[i][mainFiends[sel][k]] === 'string' || typeof d[i][mainFiends[sel][k]] === 'number')
                    {
                        let span = $('<span class="object-name">' + mainFiends[sel][k] + '</span> : <span class="object-value">' + d[i][mainFiends[sel][k]]
                                        + '</span> <span class="invisibility">!</span>');

                        li.append(span);
                    }
                    else if (d[i] && d[i][mainFiends[sel][k]] && typeof d[i][mainFiends[sel][k]] === 'object')
                    {
                        for (let kk in d[i][mainFiends[sel][k]])
                        {
                            if (d[i][mainFiends[sel][k]].hasOwnProperty(kk))
                            {
                                let span = $('<span class="object-name">' + mainFiends[sel][k] + '.' + kk + '</span> : <span class="object-value">'
                                            + d[i][mainFiends[sel][k]][kk] + '</span> <span class="invisibility">!</span>');

                                li.append(span);
                            }
                        }
                    }
                }
            }

            txt.append(li);
        }

        return txt;
    }

    function parseSchema(data, lvl = 0, pref = '')
    {
        let txt = $('<ol>').addClass('single-data');
        let li;

        for (let i in data)
        {
            if (data.hasOwnProperty(i) && i[0] != '_')
            {
                switch (typeof data[i])
                {
                    case 'number' :

                    case 'string' :
                        let def = '';

                        if (data.hasOwnProperty('__' + i) && typeof data['__' + i] != 'undefined')
                        {
                            if (data['__' + i] === 'array')
                            {
                                def = '-';
                            }
                            else
                            {
                                def = data['__' + i];
                            }
                        }

                        if (def != '-')
                        {
                            li = $('<li>').html('<span class="object-name">' + i + '</span> : <input name="' + (pref + i) + '" value = "' + def + '">');

                            txt.append(li);
                        }
                        break;

                    case 'object' :
                        if (data.hasOwnProperty('__' + i) && typeof data['__' + i] != 'undefined' && data['__' + i] === 'array')
                        {

                        }
                        else
                        {
                            li = $('<li>').append($('<span>').html(i + ' = ').addClass('object-name'))
                                .append($('<span>').addClass('open-bracket'))
                                .append(parseSchema(data[i], lvl + 1, pref + i + '.'));
                            txt.append(li);

                            txt.append($('<span>').addClass('close-bracket'));
                        }

                        break;
                    case 'array' :
                        break;
                }
            }
        }

        return txt;
    }

    this.reload = function ()
    {
        thus.load('left', 0, select['left']);
        thus.load('right', 0, select['right']);

        if (singleSel['left'].id && singleSel['left'].col)
        {
            thus.load('left', singleSel['left'].id, singleSel['left'].col);
        }
        if (singleSel['right'].id && singleSel['right'].col)
        {
            thus.load('right', singleSel['right'].id, singleSel['right'].col);
        }
    };

    function load(side, _id, col)
    {
        if (arguments.length < 3 || typeof col == 'undefined')
        {
            col = select[side];
        }

        if (_id)
        {// load select[side] WHERE id = _id
            let nowSelect = col;
            $.ajax({
                method: 'GET',
                url: '/admin/get/_' + nowSelect + '/_' + _id
            }).done(function(d){
                singleContainer[side].empty();
                let delEl = $('<span>').html('[del]').data('id', d._id).data('col', nowSelect)
                        .click(deleteById);

                singleContainer[side].append($('<span>').html(nowSelect + ' = ').addClass('object-name'))
                                    .append(delEl)
                                    .append($('<span>').addClass('open-bracket'));
                singleContainer[side].append(parseObj(d, nowSelect)).attr('class', 'single-' + nowSelect + ' single')
                                        .append($('<span>').addClass('close-bracket'));

                singleSel[side] = {
                    id: _id,
                    col: nowSelect
                };
            }).fail(function() {
                console.error('Error');

                singleContainer[side].empty();
                singleSel[side].id = 0;
                singleSel[side].col = 0;
            });
        }
        else
        {// load all doc col = select[side]
            let nowSelect = col;
            $.ajax({
                method: 'GET',
                url: '/admin/get/_' + nowSelect + '/all/'
            }).done(function(d){
                mainContainer[side].empty();
                mainContainer[side].append(parseAll(d, nowSelect));
            }).fail(function() {
                console.error('Error');
            });
        }
    }

    this.show = function (id, side, sel) {
        if (sel)
        {
            btn[side][select[side]].removeClass('select');
            btn[side][sel].addClass('select');

            select[side] = sel;

            load(side);
        }
        else
        {
            switch (id)
            {
                case 'Add':
                            thus.add(side);
                            break;
            }
        }

    };

    this.add = function (sideOrCol) {
        let col;
        let side;
        if (sideOrCol === 'left' || sideOrCol === 'right')
        {// sideOrCol is side
            col = select[sideOrCol];
            side = sideOrCol;
        }
        else
        {// sideOrCol is col, default side is left
            col = sideOrCol;
            side = left;
        }

        $.ajax({
            url: '/admin/get/schema/_' + col,
            method: 'GET'
        }).done(function (d) {
            singleContainer[side].empty();

            let addEl = $('<span>').html('[add]').data('id', d._id).data('col', col)
                .click(addElem);

            singleContainer[side].append($('<span>').html(col + ' = ').addClass('object-name'))
                .append(addEl)
                .append($('<span>').addClass('open-bracket'));
            singleContainer[side].append(parseSchema(d, col)).attr('class', 'single-' + col + ' single')
                .append($('<span>').addClass('close-bracket'));

            singleSel[side] = {
                id: 0,
                col: 0
            };
        }).fail(function() {
            console.log('Error');
        });
    };

    this.load = load;
}