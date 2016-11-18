"use strict";

function Player(scroll)
{
	let timeout = 0;
	let SCROLL_TIMEOUT;
	let thus = this;
	let isPlay = false;
	let directionIsDown = true;

	const MAX_DELAY = 3;
	const SHIFT_DELAY = 0.25;
	const DEFAULT_DELAY = 1;
	const INF_TIMEOUT = 60 * 60 * 60 * 1000;
	const DEFAULT_TIMEOUT = 10 * 1000;

	SCROLL_TIMEOUT = DEFAULT_TIMEOUT;

	let play = function () {
		if (!isPlay)
		{
			isPlay = true;

			timeout = setInterval(() => {
				scroll(directionIsDown);
			}, SCROLL_TIMEOUT);
		}
	};

	let setDelay = function (val) {
		if (val < 0)
		{
			directionIsDown = false;

			val = -val;
		}

		if (val == 0)
		{
			SCROLL_TIMEOUT = INF_TIMEOUT;
		}
		else
		{
			SCROLL_TIMEOUT = DEFAULT_TIMEOUT * DEFAULT_DELAY / val;
		}

		if (isPlay)
		{
			thus.stop();
			thus.play();
		}
	};

	let stop = function () {
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