/* Greybox Redux Redux Again
 * Required: http://jquery.com/
 * Written by: John Resig
 * Based on code by: 4mir Salihefendic (http://amix.dk) 
 * Turned into plugin by Dave McFarland
 * License: LGPL (read more in LGPL.txt)
 */


(function($) {

var settings; //global to this function
var GB_DONE = false;

$.fn.greybox = function(callerSettings) {
    var GB_done = false;

    settings = $.extend({
      gbHeight : 400,
      gbWidth : 400,
      captionHeight: 18,
      ffMacFlash: false
     },callerSettings || {});
  
     return this.click(function(evt){
     evt.preventDefault();
     var t = this.title || $(this).text() || this.href;
     GB_show(t,this.href);
   });
 } // end of greybox function

var GB_hide = function() {
  $("#GB_window,#GB_overlay").hide();
} 

var GB_show = function(caption, url) {
  if(!settings.GB_DONE) {
    $(document.body)
      .append('<div id="GB_overlay"></div><div id="GB_window"><div id="GB_loading"></div><div id="GB_caption"></div></div>');

    //make overlay fill entire height of doc
    var docH = $(document).height();
    $('#GB_overlay').css('height', docH);


    if(isMacFF()&&settings.ffMacFlash){
      $("#GB_overlay").addClass("GB_overlayMacFFBGHack");//use png overlay so hide flash
    }else{
      $("#GB_overlay").addClass("GB_overlayBG");//use background and opacity
    }

    $('#GB_caption')
       .click(GB_hide)
       .css({
					height: settings.captionHeight,
          lineHeight: settings.captionHeight + 'px'
       });
    $("#GB_overlay").click(GB_hide);
    $(window).resize(GB_position);
    settings.GB_DONE = true;
  }

  $("#GB_frame").remove(); // remove previous iFrame
  $("#GB_caption").html(caption); // add caption
  $("#GB_overlay").show(); // show grey overlay
  $('#GB_loading').show();
  GB_position(); // resize and place in middle of window
  $("#GB_window").append("<iframe id='GB_frame' src='"+url+"'></iframe>");
  
  $("#GB_frame").css("height",settings.gbHeight - settings.captionHeight - 5 +"px");
  $("#GB_frame").bind('load',function() {$('#GB_loading').hide()});
  $('#GB_window').show();


}

var GB_position = function() {
  var de = document.documentElement;
  var w = self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
  var h = self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight;
  $("#GB_window").css({
      width:settings.gbWidth+"px",
      height:settings.gbHeight+"px",
      left: ((w - settings.gbWidth)/2)+"px" ,
      top: (((h - settings.gbHeight)/2)-15)+"px" 
   });

}

var isMacFF = function() {
  var userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('mac') != -1 && $.browser.mozilla) {
    return true;
  } else {
    return false;
  }
}

})(jQuery);