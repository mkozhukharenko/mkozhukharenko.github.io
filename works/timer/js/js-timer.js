(function () {
	'use strict';

	function addEvent(obj, eventName, handler) {
	var handlerWrapper = function(event) {
		event = event || window.event;
		if (!event.target && event.srcElement) {
			event.target = event.srcElement;
		}
		return handler.call(obj, event);
	};

	if (obj.addEventListener) {
		obj.addEventListener(eventName, handlerWrapper, false);
	} else if (obj.attachEvent) {
		obj.attachEvent('on' + eventName, handlerWrapper);
	}
	return handlerWrapper;
	}

    function Timer(requiresTimer) {
		this.requiresTimer = requiresTimer;
		this.intervalHandler = null;
		this.timerMarkUp = this.timerMarkUp();
		this.requiresTimer.appendChild(this.timerMarkUp);
		this.stopButton = this.requiresTimer.querySelector('.btn-primary');
		this.lapButton = this.requiresTimer.querySelector('.btn-info');
		this.resetButton = this.requiresTimer.querySelector('.btn-danger');
		this.stopwatchDisplay = this.requiresTimer.querySelector('.stopwatch-current');
		this.stopwatchLapsContainer = this.requiresTimer.querySelector('.stopwatch-laps');		
		this.millisecondsAmount = 0;
		this.laps = [];
		addEvent(this.stopButton, 'click', this.startStopTimer.bind(this));
		addEvent(this.lapButton, 'click', this.lapTimer.bind(this));
		addEvent(this.resetButton, 'click', this.resetTimer.bind(this));
		addEvent(this.requiresTimer, 'click', this.closeThisLap.bind(this));
		this.keyboardControl();
	}

	Timer.prototype.startStopTimer = function () {
		if (this.intervalHandler === null) {
			this.startTimer();
		} else {
			this.stopTimer();
		}
	};

	Timer.prototype.startTimer = function () {

		this.previousDate = Date.now();
        function updateTimeValue() {
        	this.millisecondsAmount += Date.now() - this.previousDate;
        	this.previousDate  = Date.now();
			this.updateTimerDisplay();
        }
		this.intervalHandler = setInterval(updateTimeValue.bind(this), 60);
	};
	
	Timer.prototype.stopTimer = function() {
		clearInterval(this.intervalHandler);
		this.intervalHandler = null;
	};

	Timer.prototype.updateTimerDisplay = function () {
		this.stopwatchDisplay.innerHTML = this.formatTime(this.millisecondsAmount);
	};

	Timer.prototype.lapTimer = function () {
		if (this.millisecondsAmount === 0) {
			return;
		} 
		if (this.laps[this.laps.length-1] === this.millisecondsAmount) {
			return;
		}
		this.laps.push(this.millisecondsAmount);
		this.updateLapsContainer();		
	};

	Timer.prototype.resetTimer = function () {
		this.stopTimer();
		this.millisecondsAmount = 0;
		this.stopwatchDisplay.innerHTML = this.formatTime(this.millisecondsAmount);
		this.laps = [];	
		this.updateLapsContainer();
	};
	
	Timer.prototype.updateLapsContainer = function () {
	this.stopwatchLapsContainer.innerHTML = '';
	this.laps.forEach(updateLaps.bind(this));
		function updateLaps (laps) {
			var lapInfo = document.createElement('div');
				lapInfo.classList.add('alert-info');
				lapInfo.classList.add('alert');
			var closeButton = document.createElement('span');
				closeButton.classList.add('label-danger');
				closeButton.classList.add('label');		
				closeButton.innerHTML = 'x';
			lapInfo.innerHTML = '' + this.formatTime(laps) + '';
			lapInfo.appendChild(closeButton);
			// optrion 2 inset after last lap:
			// this.stopwatchLapsContainer.appendChild(lapInfo); 
			this.stopwatchLapsContainer.insertBefore(lapInfo, this.stopwatchLapsContainer.firstChild);
		}
	};
	
	Timer.prototype.closeThisLap = function (event) {
		if (event.target !== null && event.target.classList.contains('label-danger')) {
			var allLaps = document.querySelectorAll('.alert-info');
			var lapIndexToRemove = Array.prototype.indexOf.call(allLaps, event.target.parentNode);
			this.laps.splice(lapIndexToRemove, 1);
			this.updateLapsContainer();
		}
	};
	
	Timer.prototype.keyboardControl = function (event) {
		var _this = this;
		
		addEvent(_this.requiresTimer, 'mouseenter', function () {
			Timer.lastActive = _this;
			console.log('mouseenter');
		}, false);

		addEvent(document, 'keyup', function (event){
			if (Timer.lastActive == _this) {
				if (event.keyCode === 83) {
					_this.startStopTimer();
				}
				else if (event.keyCode === 76) {
					_this.lapTimer();
				}
				else if (event.keyCode === 82) {
					_this.resetTimer();
				}
			}
		}, false);
	};

	Timer.prototype.formatTime = function (miliseconds) {
	    var mili = parseInt((miliseconds)%1000);
	    var seconds = parseInt((miliseconds/1000)%60);
	    var minutes = parseInt((miliseconds/(1000*60))%60);
	    var hours = parseInt((miliseconds/(1000*60*60))%24);
	    
	    hours = (hours < 10) ? "0" + hours : hours;
	    minutes = (minutes < 10) ? "0" + minutes : minutes;
	    seconds = (seconds < 10) ? "0" + seconds : seconds;   
	    if (mili < 10) {mili = "00" + mili;
		}  else if (mili < 100) {mili = "0" + mili;
		}  else if (mili <= 1000) {mili = mili;} // можно удалить
	    
	    return hours + ":" + minutes + ":" + seconds + ":" + mili;
	};

	Timer.prototype.timerMarkUp = function () {
		var raw = document.createElement('div');
			raw.classList.add('raw');
		var stopwatchCurrent = document.createElement('h2');
			stopwatchCurrent.classList.add('stopwatch-current');
			stopwatchCurrent.innerHTML = '00:00:00:000';
		var stopwatchControls = document.createElement('div');
			stopwatchControls.classList.add('topwatch-controls');
			stopwatchControls.innerHTML = "<div class='btn-group btn-group-lg'> \
												<button class='btn btn-primary'>Start</button> \
												<button class='btn btn-info'>Lap</button> \
											</div> \
											<button class='btn btn-danger btn-sm'>Reset</button>";
		var stopwatchLaps = document.createElement('div');
			stopwatchLaps.classList.add('stopwatch-laps');
		raw.appendChild(stopwatchCurrent);	
		raw.appendChild(stopwatchControls);	
		raw.appendChild(stopwatchLaps);			
		return raw;
	};

var timer1 = document.querySelector('.timer-first');
window.timer1 = new Timer(timer1);

var timer2 = document.querySelector('.timer-second');
window.timer2 = new Timer(timer2);


} )();