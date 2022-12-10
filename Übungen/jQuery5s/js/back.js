function machZurueck(stelle, klassenName) {
klassenName = klassenName || 'back';
historyLength = window.history.length;
	historyLength += (jQuery.browser=='msie') ? 1 : 0;
	if (historyLength>1) {
		var zurueckLink = $('<a href="#" class="' + klassenName + '"><small>Zurück</small></a>');
		zurueckLink.click(function() {
				history.back();
				return false;
		});
		$(stelle).append(zurueckLink);
	}
}