"use strict";
function cssCenter1Line() {
    $(".css-center-1-line").each(function () {
        $(this).css("line-height", $(this).css("height"));
    });
}

let __DEBUG__adm;

let assert = function (check, msg) {
	if (!check)
	{
		alert("Error: " + msg);
	}
};

$(document).ready(() => {
    cssCenter1Line();

    let adm = new Adm();

    // DEBUG
    __DEBUG__adm = adm;

    $(".item-menu").click(function() {
        let id = $(this).data("id");
        let side = $(this).data("side");
        let sel = $(this).data("select");

        adm.show(id, side, sel);
    });

	$("#cmdForm").submit(function(e) {
		e.preventDefault();

		adm.cmd();
	});

    // left - user, right - book
    adm.show(0, "left", "user");
    adm.show(0, "right", "book");
});


function filter(obj, checker)
{
	let tmp = Object.create(obj.__proto__);

	for (let i in obj)
	{
		if (obj.hasOwnProperty(i))
		{
			if (checker(i, obj[i], obj))
			{
				tmp[i] = obj[i];
			}
		}
	}

	return tmp;
}

function runOnKeys(func)
{
	let codes = [].slice.call(arguments, 1);

	let pressed = {};

	$(document).on("keydown.help", function(e) {
		e = e || window.event;

		pressed[e.keyCode] = true;

		for (let i = 0; i < codes.length; i++)
		{ // проверить, все ли клавиши нажаты
			if (!pressed[codes[i]])
			{
				return;
			}
		}

		pressed = {};

		func();

	});

	$(document).on("keyup.help", function(e) {
		e = e || window.event;

		delete pressed[e.keyCode];
	});
}

function Helper(input, container, emptySingleContainer)
{
	let isHelpMode = false;

	const CTRL_CODE = 17;
	const SPACE_CODE = 32;

	/**
	 * FUNC = {
	 *     %CMD_NAME%: {
	 *          description: %DESCRIPTION_OF_CMD%,  (String)
	 *          params: %PARAMS%
	 *     }
	 * }
	 */
	let FUNC = JSON.parse($("#mainFunc").html());
	/**
	 * PARAMS = [
	 *     $PARAM_NAME%: {
	 *         description: %DESCRIPTION_OF_PARAM%  (String)
	 *     }
	 * ]
	 */

	/**
	 * $(this).data-func - name of command
	 */
	function setupFunc()
	{
		input.val($(this).data("func"));
	}

	function check(val)
	{
		let funcName = val.split(" ")[0];

		return typeof FUNC[funcName] != "undefined";
	}

	function show(objWithDescription)
	{
		let title = objWithDescription.title || "";

		emptySingleContainer(container);

		container.append($("<span>").html(title + " = ").addClass("object-name"))
			.append($("<span>").addClass("open-curly-brace"));

		let data = $("<ol>").addClass("single-data");

		if (typeof objWithDescription.func != "undefined")
		{// show all func with description
			let li;

			for (let i in objWithDescription.func)
			{
				if (objWithDescription.func.hasOwnProperty(i))
				{
					li = $("<li>").append(
						$("<span>").html(i).addClass("object-name")
					).append($("<span>").html(" [setup]").data("func", i).click(setupFunc))
						.append($("<span>").html(" : "))
						.append(
							$("<span>").html(objWithDescription.func[i].description)
						);
				}
				data.append(li);
			}
		}
		else
		{// show all params for this command
			let li;

			li = $("<li>").append(
				$("<span>").html("description").addClass("object-name")
			).append($("<span>").html(" : "))
				.append(
					$("<span>").html(objWithDescription.description)
				);

			data.append(li);

			for (let i in objWithDescription.params)
			{
				if (objWithDescription.params.hasOwnProperty(i))
				{
					li = $("<li>").append(
						$("<span>").html(i).addClass("object-name")
					).append($("<span>").html(" : "))
						.append(
							$("<span>").html(objWithDescription.params[i])
						);
				}
				data.append(li);
			}
		}

		container.append(data);

		container.append($("<span>").addClass("close-curly-brace"));
	}

	function on()
	{
		if (!isHelpMode)
		{
			isHelpMode = true;

			input.on("input.help", function () {
				let params = input.val().split(" ");
				let cmd = params.shift();

				if (params.length > 0 || typeof FUNC[cmd] !== "undefined")
				{// choose param
					if (typeof FUNC[cmd] === "undefined" || typeof FUNC[cmd].params === "undefined")
					{
						show({
							title: "Unknown command",
							func: FUNC
						});
					}
					else
					{
						show({
							title: "Existing params.",
							description: FUNC[cmd].description,
							params: FUNC[cmd].params
						});
					}
				}
				else
				{// choose cmd
					let regExp_EqualStartOfFuncName = new RegExp("^" + cmd, "i");

					let allowedFunc = filter(FUNC, function (name) {
						return regExp_EqualStartOfFuncName.test(name);
					});

					show({
						title: "Choose command",
						func: allowedFunc
					});
				}
			});

			runOnKeys(function () {
				let params = input.val().split(" ");
				let cmd = params.shift();

				if (params.length == 0)
				{
					let regExp_EqualStartOfFuncName = new RegExp("^" + cmd, "i");

					let allowedFunc = Object.keys(FUNC).filter(function (name) {
						return regExp_EqualStartOfFuncName.test(name);
					});

					if (allowedFunc.length == 1)
					{
						input.val(allowedFunc[0]);
					}
				}
			}, CTRL_CODE, SPACE_CODE);
		}
	}

	function off()
	{
		if (isHelpMode)
		{
			isHelpMode = false;

			input.off(".help");
			$(document).off(".help");
		}
	}

	return {
		on: on,
		off: off,
		check: check
	};
}

function Adm()
{
    let select = {
        left: "0",
        right: "0"
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

	let cmdEl = $("#cmd");

    let singleContainer = {
        left: $("#leftSingleContainer"),
        right: $("#rightSingleContainer")
    };

    let mainContainer = {
        left: $("#leftMainContainer"),
        right: $("#rightMainContainer")
    };

    let mainFiends = {
        user: ["name", "prop"],
        book: ["title", "author", "owner"],
        invite: ["value", "counter"]
    };

    let btn = {
        left: {
            user: $(".btn.item-menu.left-side[data-select=user]"),
            book: $(".btn.item-menu.left-side[data-select=book]"),
            invite: $(".btn.item-menu.left-side[data-select=invite]"),
            0: $("#0")

        },
        right: {
            user: $(".btn.item-menu.right-side[data-select=user]"),
            book: $(".btn.item-menu.right-side[data-select=book]"),
            invite: $(".btn.item-menu.right-side[data-select=invite]"),
            0: $("#0")
        }
    };


	this.help = new Helper(cmdEl, singleContainer["right"], emptySingleContainer);

	this.help.on();

    let thus = this;

    const MAX_DISPLAY_ARRAY_ELEMS = 2;

	function ok(msg)
	{
		console.log("OK: " + msg);
	}

    function getById()
    {
        let id = $(this).data("id");
        let col = $(this).data("col");
        let side = $(this).closest(".side").data("side");


	    loadInSingleContainer(side, id, col);
    }

	/**
	 * Show all child of $(this)
	 */
	function showAllElemsOfArray()
	{
		$(".hidden-array-elem", $(this).closest("li")).each(function (){
			$(this).removeClass("hidden-array-elem");
		});

		$(this).hide();
    }

    function deleteById()
    {
        let id = $(this).data("id");
        let col = $(this).data("col");
        let side = $(this).closest(".side").data("side");
        let data = {
            id: id,
            col: col
        };

        $.ajax({
            method: "DELETE",
            url: "/admin/delete/_" + col + "/_" + id,
            data: JSON.stringify(data)
        }).done(function() {
            thus.reloadDataOnPage();
        });
    }

	/**
	 * @this  $(SingleContainer)
	 */
    function addDataFromSingleContainerInDB()
    {
        let elms = $(this).closest(".single").find("input");
        let data = {};
        let col = $(this).data("col");

        elms.each(function () {
            data[$(this).attr("name")] = $(this).val().length > 0 ? $(this).val() : undefined;
        });

        $.ajax({
            method: "POST",
            url: "/admin/add/_" + col,
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8"
        }).done(function() {
            thus.reloadDataOnPage();
        }).fail(function() {
            console.error("Error");
        });
    }

	/**
	 * Recursion function
	 * @param data - enter data
	 * @param lvl - depth of recursion
	 * @returns {*|jQuery}
	 */
    function parseObjectToHTML(data, lvl)
    {
        if (typeof lvl == "undefined")
        {
            lvl = 0;
        }

        let txt = $("<ol>").addClass("single-data");
        let li;

        for (let i in data)
        {
            if (data.hasOwnProperty(i))
            {
                switch (typeof data[i])
                {
	                case "number" :
                	        // equal string
                    case "string" :
                                    li = $("<li>").html("<span class="object-name">" + i + "</span> : <span>" + data[i] + "</span>");

                                    txt.append(li);

                                    break;

                    // It"s array or object
                    case "object" :
                    	            if (typeof data[i][0] === "undefined")
	                                {// object
		                                li = $("<li>").append($("<span>").html(i + " = ").addClass("object-name"))
			                                .append($("<span>").addClass("open-curly-brace"))
			                                .append(parseObjectToHTML(data[i], lvl + 1));
		                                txt.append(li);

		                                txt.append($("<span>").addClass("close-curly-brace"));
	                                }
	                                else
	                                {// array
		                                let showAllBtn = $("<span>").html("[show]").click(showAllElemsOfArray).addClass();
										let countOfElems = $("<span>").html("(" + data[i].length + "elems)");

		                                li = $("<li>").append($("<span>").html(i + " = ").addClass("object-name"))
			                                .append(showAllBtn)
			                                .append(countOfElems)
			                                .append($("<span>").addClass("open-square-bracket"))
			                                .append(parseArrayToHTML(data[i], lvl + 1));
		                                txt.append(li);

		                                txt.append($("<span>").addClass("close-square-bracket"));
	                                }

                                    break;
                }
            }
        }

        return txt;
    }

	/**
	 * Recursion function
	 * @param data - enter data
	 * @param lvl - depth of recursion
	 * @returns {*|jQuery}
	 */
	function parseArrayToHTML(data, lvl)
	{
		if (typeof lvl == "undefined")
		{
			lvl = 0;
		}

		let txt = $("<ol>").addClass("single-data").addClass("array-data");
		let li;
		let isLastElem = false;

		for (let i in data)
		{
			if (data.hasOwnProperty(i))
			{
				if (+i === data.length - 1)
				{
					isLastElem = true;
				}

				switch (typeof data[i])
				{
					case "number" :
					// equal string
					case "string" :
						li = $("<li>").html("<span>" + data[i] + "</span>").addClass("elems-of-array").addClass(i + 1 > MAX_DISPLAY_ARRAY_ELEMS ? "hidden" : "");

						txt.append(li);

						break;

					// It"s array or object
					case "object" :
						if (typeof data[i][0] === "undefined")
						{// object
							li = $("<li>").addClass(i + 1 > MAX_DISPLAY_ARRAY_ELEMS ? "hidden-array-elem" : "")
								.append($("<span>").addClass("open-curly-brace"))
								.append(parseObjectToHTML(data[i], lvl + 1))
								.append($("<span>").addClass("close-curly-brace").addClass("elems-of-array" + (isLastElem ? " last-elems-of-array" : "")));
							txt.append(li);

						}
						else
						{// array
							let showAllBtn = $("<span>").html("[show]").click(showAllElemsOfArray).addClass();

							li = $("<li>").addClass(i + 1 > MAX_DISPLAY_ARRAY_ELEMS ? "hidden" : "")
								.append(showAllBtn)
								.append($("<span>").addClass("open-square-bracket"))
								.append(parseArrayToHTML(data[i], lvl + 1))
								.append($("<span>").addClass("close-square-bracket").addClass("elems-of-array" + (isLastElem ? " last-elems-of-array" : "")));
							txt.append(li);
						}

						break;
				}
			}
		}

		return txt;
	}

	function resetSingleContainer(side, col)
	{
		return function() {
			thus.add(side, col);
		};
	}

    function parseArrayOfObjectToHTMLForMainPage(d, sel)
    {
        /*
        User - name, prop
        Book - title, author, ?owner?
        Invite - value, counter
         */

        let txt = $("<ol>").addClass("main-container");

        for (let i = 0; i < d.length; ++i)
        {
            let li = $("<li>").addClass("object");

            let idEl = $("<span>").html("[id]").data("id", d[i]._id).data("col", sel)
                .click(getById);
            li.append(idEl);

            let delEl = $("<span>").html("[del]").data("id", d[i]._id).data("col", sel)
                .click(deleteById);
            li.append(delEl);

            for (let k in mainFiends[sel])
            {
                if (mainFiends[sel].hasOwnProperty(k))
                {
                    if (d[i] && d[i][mainFiends[sel][k]] &&
                            typeof d[i][mainFiends[sel][k]] === "string" || typeof d[i][mainFiends[sel][k]] === "number")
                    {
                        let span = $("<span class="object-name">" + mainFiends[sel][k] + "</span> : <span class="object-value">" + d[i][mainFiends[sel][k]]
                                        + "</span> <span class="invisibility">!</span>");

                        li.append(span);
                    }
                    else if (d[i] && d[i][mainFiends[sel][k]] && typeof d[i][mainFiends[sel][k]] === "object")
                    {
                        for (let kk in d[i][mainFiends[sel][k]])
                        {
                            if (d[i][mainFiends[sel][k]].hasOwnProperty(kk))
                            {
                                let span = $("<span class="object-name">" + mainFiends[sel][k] + "." + kk + "</span> : <span class="object-value">"
                                            + d[i][mainFiends[sel][k]][kk] + "</span> <span class="invisibility">!</span>");

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



    function parseSchema(data, lvl = 0, pref = "")
    {
        let txt = $("<ol>").addClass("single-data");
        let li;

        for (let i in data)
        {
            if (data.hasOwnProperty(i) && i[0] != "_")
            {
                switch (typeof data[i])
                {
                    case "number" :
						// number as string
                    case "string" :
                        let def = "";

                        if (data.hasOwnProperty("__" + i) && typeof data["__" + i] != "undefined")
                        {
                            if (data["__" + i] === "array")
                            {
                                def = "-";
                            }
                            else
                            {
                                def = data["__" + i];
                            }
                        }

                        if (def != "-")
                        {
                            li = $("<li>").html("<span class="object-name">" + i + "</span> : <input name="" + (pref + i) + "" value = "" + def + "">");

                            txt.append(li);
                        }
                        break;
	                case "array" :
		                // all arrays is object
                    case "object" :
                        if (data.hasOwnProperty("__" + i) && typeof data["__" + i] != "undefined" && data["__" + i] === "array")
                        {

                        }
                        else
                        {
                            li = $("<li>").append($("<span>").html(i + " = ").addClass("object-name"))
                                .append($("<span>").addClass("open-curly-brace"))
                                .append(parseSchema(data[i], lvl + 1, pref + i + "."));
                            txt.append(li);

                            txt.append($("<span>").addClass("close-curly-brace"));
                        }

                        break;

                }
            }
        }

        return txt;
    }

	function reloadDataOnSide(side)
	{
		loadInMainContainer(side);

		if (singleSel[side].id && singleSel[side].col)
		{
			loadInSingleContainer(side, singleSel[side].id, singleSel[side].col);
		}
	}

    this.reloadDataOnPage = function (side)
    {
	    if (side)
	    {
			reloadDataOnSide(side);
	    }
	    else
	    {
		    reloadDataOnSide("left");
		    reloadDataOnSide("right");
	    }
    };

    function showMessage(data)
    {
    	let el = singleContainer["left"];

	    emptySingleContainer(el);

	    el.append($("<span>").html(data.cmdLine + " = ").addClass("object-name"))
		    .append($("<span>").addClass("open-curly-brace"));

	    data.cmdLine = undefined;

	    el.append(parseObjectToHTML(data)).attr("class", "single")
		    .append($("<span>").addClass("close-curly-brace"));
    }

	function addDataInSingleContainer(data, el, nowSelect)
	{
		emptySingleContainer(el);
		let delEl = $("<span>").html("[del]").data("id", data._id).data("col", nowSelect)
			.click(deleteById);

		el.append($("<span>").html(nowSelect + " = ").addClass("object-name"))
			.append(delEl)
			.append($("<span>").addClass("open-curly-brace"));
		el.append(parseObjectToHTML(data)).attr("class", "single-" + nowSelect + " single")
			.append($("<span>").addClass("close-curly-brace"));

	}

	function emptySingleContainer(el)
	{
		el.empty();
	}

	function loadInSingleContainer (side, _id, col)
	{
		let nowSelect = col;
		$.ajax({
			method: "GET",
			url: "/admin/get/_" + nowSelect + "/_" + _id
		}).done(function(data){

			addDataInSingleContainer(data, singleContainer[side], nowSelect);

			singleSel[side] = {
				id: _id,
				col: nowSelect
			};
		}).fail(function() {
			console.error("Error");

			emptySingleContainer(singleContainer[side]);
			singleSel[side].id = 0;
			singleSel[side].col = 0;
		});
	}

	function loadInMainContainer(side)
	{
		let nowSelect = select[side];
		$.ajax({
			method: "GET",
			url: "/admin/get/_" + nowSelect + "/all/"
		}).done(function(d){
			emptySingleContainer(mainContainer[side]);
			mainContainer[side].append(parseArrayOfObjectToHTMLForMainPage(d, nowSelect));
		}).fail(function() {
			console.error("Error");
		});
	}


    this.show = function (id, side, sel) {
        if (sel)
        {
            btn[side][select[side]].removeClass("select");
            btn[side][sel].addClass("select");

            select[side] = sel;

            loadInMainContainer(side);
        }
        else
        {
            switch (id)
            {
                case "Add":
                            thus.add(side);
                            break;
				case "refresh":
		                    thus.reloadDataOnPage(side);
		                    break;
            }
        }

    };

	function sendCommand(cmd) {
		console.log(cmd);

		$.ajax({
			method: "POST",
			url: "/admin/cmd",
			data: JSON.stringify({
				cmd: cmd
			}),
			contentType: "application/json; charset=utf-8"
		}).done(function(data) {
				thus.reloadDataOnPage();

				if (data && data != "")
				{
					data.cmdLine = cmd;

					showMessage(data);
				}

				ok("command");
		}).fail(function(){
			assert(false, "sendCommand");
		});
	}


	this.cmd = function() {
		let cmd = cmdEl.val();
		cmdEl.val("");

		switch (cmd)
		{
			case "help on":
							this.help.on();

							break;
			case "help off":
							this.help.off();

							break;
			case "":
							break;
			default:

							if (this.help.check(cmd))
							{
								sendCommand(cmd);
							}
		}
	};

    this.add = function (side, col) {
        if (arguments.length < 2)
        {//  is side
            col = select[side];
        }
        else
        {// sideOrCol is col, default side is left
            //col = col;
            side = side || "left";
        }

        $.ajax({
            url: "/admin/get/schema/_" + col,
            method: "GET"
        }).done(function (d) {
            singleContainer[side].empty();

            let addEl = $("<span>").html("[add]").data("id", d._id).data("col", col)
                .click(addDataFromSingleContainerInDB);
			let resetEl = $("<span>").html("[reset]").data("id", d._id).data("col", col)
				.click(resetSingleContainer(side, col));

            singleContainer[side].append($("<span>").html(col + " = ").addClass("object-name"))
                .append(addEl)
	            .append(resetEl)
                .append($("<span>").addClass("open-curly-brace"));
            singleContainer[side].append(parseSchema(d, col)).attr("class", "single-" + col + " single")
                .append($("<span>").addClass("close-curly-brace"));

            singleSel[side] = {
                id: 0,
                col: 0
            };
        }).fail(function() {
            console.log("Error");
        });
    };

}