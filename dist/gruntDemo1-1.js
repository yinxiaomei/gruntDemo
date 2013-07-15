/*
 * grunt-demo-1
 * https://github.com/qhwa/grunt-demo-1
 *
 * Copyright (c) 2012 qhwa
 * Licensed under the MIT license.
 */

(function($) {

  var ALI_LINK_REG = /^http:\/\/(.+\.)?alibaba\.com/;
  console.log("je2");

  // Collection method.
  $.fn.alilink = function() {
    return this.each(function() {
      var self = $(this);
      if( isAliLink(this) ){
        self.addClass('ali-link');
      } else {
        self.removeClass('ali-link');
       
      }
    });
  };

  // Custom selector.
  $.expr[':'].alilink = function(elem) {
    return isAliLink(elem);
  };

  function isAliLink(el) {
    return (/a/i).test(el.tagName) && ALI_LINK_REG.test(el.href);
  }


}(jQuery));

(function() {
  // Get any jquery=___ param from the query string.
  var jqversion = location.search.match(/[?&]jquery=(.*?)(?=&|$)/);
  var path;
  if (jqversion) {
    // A version was specified, load that version from code.jquery.com.
    path = 'http://code.jquery.com/jquery-' + jqversion[1] + '.js';
  } else {
    // No version was specified, load the local version.
    path = '../libs/jquery/jquery.js';
  }
  // This is the only time I'll ever use document.write, I promise!
 // document.write('<script src="' + path + '"></script>');
}());
