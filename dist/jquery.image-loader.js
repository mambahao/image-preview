/*! jQuery plugin - v0.1.0 - 2014-04-23
* https://github.com/goschevski/image-loader
* Copyright (c) 2014 Aleksandar Gosevski; Licensed MIT */
(function($) {
  var namespace = 'imageloader';

  function ImageLoader(element, options) {
    if ( !this.isSupported ) { throw 'Older browesers are not supported.'; }

    this.$element = $(element);
    var o = this.options = $.extend({}, $.fn.imageLoader.defaults, options);
    this.$placeholder = $( o.show );

    this.$element.on('change.' + namespace, $.proxy(this._onChange, this));
  }

  ImageLoader.prototype = {
    $: function (selector) {
      return this.$element.find(selector);
    },
    _onChange: function(e) {
      this._reader( e.currentTarget );
    },
    _reader: function( uploader ) {
      var reader = new FileReader(),
        self = this,
        o = this.options;

      reader.onload = (function(file) {
        return $.proxy(  self[ o.cssBackground ? '_setBackground' : '_setImage' ], self);
      }(uploader.files[0]));
      reader.readAsDataURL(uploader.files[0]);

      if ( $.isFunction(o.callback) ) {
        o.callback();
      }
    },
    _setImage: function(e) {
      var o = this.options;
      return this.$placeholder[o.method]('<img src="' + e.target.result + '" width="' + o.width + '" height="' + o.height + '" class="' + o.imgClass + '" />');
    },
    _setBackground: function(e) {
      return this.$placeholder.css({ backgroundImage: 'url(' + e.target.result + ')' });
    },
    isSupported: (function() {
      return window.File && window.FileReader && window.FileList && window.Blob;
    }())
  };

  $.fn.imageLoader = function (option) {
    return this.each(function () {
      var $this = $(this),
        data = $this.data(namespace),
        options = typeof option === 'object' && option;

      if ( !data ) {
        $this.data(namespace, (data = new ImageLoader(this, options)));
      }
      if ( typeof option === 'string' && option.charAt(0) !== '_') {
        data[option]();
      }
    });
  };

  $.fn.imageLoader.Constructor = ImageLoader;
  $.fn.imageLoader.defaults = {
    show: '.show',
    width: 'auto',
    height: 'auto',
    imgClass: 'img-load',
    cssBackground: false,
    method: 'html',
    callback: null
  };
}(jQuery));