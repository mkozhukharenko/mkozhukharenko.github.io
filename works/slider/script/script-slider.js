


// -----------------------------------------------------------------------------

(function () {
'use strict';
	
	function Slider  (requiresSlider, images) {
		this.requiresSlider = requiresSlider;
		this.images = images;
		this.sliderMarkUp();
		$(window).resize(this.ifWindowResized.bind(this));
		this.setNavContainerHeight();

		this.picWidth = this.requiresSlider.find('.pic-container > .pic-1').width();
		this.picNumber = { 
				auto: '-='+ this.picWidth,
				first: 0,
				second: -this.picWidth,
				third: -this.picWidth * 2,
				fourth: -this.picWidth *3,
		};

		this.currentIndex = 1;
		this.isPaused = false;
		this.intervalAuto = 2000;
		this.intervalPause = 4000;
		this.autoSlide();
		this.requiresSlider.find('.nav-section').on('click', 'div', this.clickHandle.bind(this));
		this.timeoutHandler = 0;	
	}

	// Slider.prototype.doSmth = function () {
	// };

	Slider.prototype.cancelPause = function () {
		this.isPaused = false;
	};

	Slider.prototype.clickHandle = function (event) {
		// console.log(this);
		var _this = this;
		this.isPaused = true;
		clearTimeout(this.timeoutHandler);
		this.timeoutHandler = setTimeout( function () { 
			_this.cancelPause(); 
		}, _this.intervalPause);
		if ($(event.target).hasClass("nav-pic-1")) {
			this.slideTo(1);
		}  
		else if ($(event.target).hasClass("nav-pic-2")) {
			this.slideTo(2);
		} 
		else if ($(event.target).hasClass("nav-pic-3")) {
			this.slideTo(3);
		} 				
		else if ($(event.target).hasClass("nav-pic-4")) {
			this.slideTo(4);
		}
	};

	Slider.prototype.slideTo = function (index) {
		var indexCurr = (index > 4) ? 1 : index;
		this.currentIndex = indexCurr;		
		var shiftSize = this.shiftSizeConverter(indexCurr);
		this.setBackround(indexCurr);
		this.requiresSlider.find('.pic-container').animate({marginLeft: shiftSize}, 1000);
	};

	Slider.prototype.slideNext = function () {
		if(!this.isPaused) {
			this.slideTo(this.currentIndex + 1);
		}
	};

	Slider.prototype.autoSlide = function () {
		setInterval(this.slideNext.bind(this), 2000);
	};

	Slider.prototype.setBackround = function (index) {
		$(this.requiresSlider).find('.active').removeClass("active");
		$(this.requiresSlider).find('.nav-pic-' + index).addClass('active');
	};

	Slider.prototype.shiftSizeConverter = function (index) {
		if (index === 1) {
			return this.picNumber.first;
		}
		else if (index === 2) {
			return this.picNumber.second;
		}
		else if (index === 3) {
			return this.picNumber.third;
		}
		else if (index === 4) {
			this.currentIndex = 0;
			return this.picNumber.fourth;
		}
	};	

	Slider.prototype.sliderMarkUp = function () {
		$(document.createElement('div'))
		.attr('class', 'pic-section')
		.html('	<div class="pic-container">' +
					'<div class="pic-1"><img src="' + this.images[0] + '" alt=""></div>' +
					'<div class="pic-2"><img src="' + this.images[1] + '" alt=""></div>' +
					'<div class="pic-3"><img src="' + this.images[2] + '" alt=""></div>' +
					'<div class="pic-4"><img src="' + this.images[3] + '" alt=""></div>' +
				'</div>')		
		.appendTo(this.requiresSlider);
		$(document.createElement('div'))
		.attr('class', 'nav-section')
		.html('<div class="nav-pic-1 active"><img src="img/triangle.png" alt=""></div>' +
				'<div class="nav-pic-2"><img src="img/triangle.png" alt=""></div>' +
				'<div class="nav-pic-3"><img src="img/triangle.png" alt=""></div>' +
				'<div class="nav-pic-4"><img src="img/triangle.png" alt=""></div>')
		.appendTo(this.requiresSlider);
	};

	Slider.prototype.setNavContainerHeight = function () {
		var _this = this;
		var img = ($(this.requiresSlider).find('.pic-1 > img').eq(0));
		img.on('load', function () {	
			var imgHeight = img.css( "height" );
			_this.requiresSlider.find('.nav-section').height(imgHeight);
		});
	};
	
	Slider.prototype.ifWindowResized = function () {
		var height = this.requiresSlider.find('.pic-section').css( "height" );

		this.requiresSlider.find('.nav-section').height(height);
		this.picWidth = this.requiresSlider.find('.pic-container > .pic-1').width();
		this.picNumber = { 
				auto: '-='+ this.picWidth,
				first: 0,
				second: -this.picWidth,
				third: -this.picWidth * 2,
				fourth: -this.picWidth *3,
		};
	};


	var images = ['img/image1.jpg',
				  'img/image2.jpg',
				  'img/image3.jpg',
				  'img/image4.jpg' ];

	var natureImg = ['img/nature1.jpg',
				  'img/nature2.jpg',
				  'img/nature3.jpg',
				  'img/nature4.jpg' ];
				  
	window.slider1 = new Slider($('.slider-1'), images);
	window.slider2 = new Slider($('.slider-2'), natureImg);

})();
