(function () {

 // решение позиционирования с помощью padding
// .pic1{position:fixed; display:none; padding:0 25% 0 24%;}
 
	function MakeZoomable(gallery) {
		this.gallery = gallery;
		this.$body = $('body');
		if (!MakeZoomable.markupAlreadyCreated) {
			this.setMarkUp();	
		}
		this.ESCAPE_KEY = 27;
		this.$largeImg = $('#large-img');
		this.$containerOuter = $('.large-container-outer');
		this.$blur = $('.blur');

		this.gallery.on('click', 'img', this.zoomImage.bind(this));
		this.$containerOuter.on('click', '.closeButton', this.closeImg.bind(this));
		$(window).resize(this.setImageMaxSize.bind(this));
		$(window).keydown(this.closeByEsc.bind(this));
	}

	MakeZoomable.prototype.zoomImage = function (event) {
		var pathToLarge = $(event.target).attr('src').replace(/small/, 'large');
		this.$containerOuter.show();
		this.$blur.show();
		this.$largeImg.attr('src', pathToLarge);
		this.setImageMaxSize();
	};
	
	MakeZoomable.prototype.closeByEsc = function (event) {
		if (event.keyCode === this.ESCAPE_KEY) this.closeImg();
	};

	MakeZoomable.prototype.closeImg = function () {
		this.$containerOuter.hide();
		this.$blur.hide();
	};

	MakeZoomable.prototype.setImageMaxSize = function () {
		var $largeImg = $('#large-img');
		var $containerInnerHeight = this.$containerOuter.height();
		var $containerOuterWidht = this.$containerOuter.width() - 1; // VERY ODD
		this.$largeImg.css({
			'max-width' : $containerOuterWidht + "px",
			'max-height' : $containerInnerHeight + "px"
		});
	};

	MakeZoomable.prototype.setMarkUp = function () {		
		var $imgContainerOuter = $('<div class="large-container-outer"> </div>');
		var $imgContainerInner = $('<div class="large-container-inner"> </div>');
		var $blur = $('<div class="blur"> </div>');
		var $largeImg = $('<img alt="" src="" id="large-img">');
		var $closeButton = $('<div class="closeButton"> </div>');

		$imgContainerInner.append($largeImg);
		$imgContainerInner.append($closeButton);
		$imgContainerOuter.append($imgContainerInner);
		this.$body.append($blur);
		this.$body.append($imgContainerOuter);

		MakeZoomable.markupAlreadyCreated = true; 
	};

	window.picSet1 = new MakeZoomable($(".gallery-1"));
	window.picSet1 = new MakeZoomable($(".gallery-2"));
}());