var Mapifies;

if (!Mapifies) Mapifies = {};

/**
 * The main object that holds the maps
 */
Mapifies.MapObjects = {};

/**
 * Creates a new map on the passed element with the defined options
 * @id Mapifies.MapObjects.Set
 * @alias MapObjects.Set
 * @param {Object} element
 * @param {Object} options
 * @return {Object}
 */
Mapifies.MapObjects.Set = function ( element, options ) {
	var mapName = jQuery(element).attr('id');
	var thisMap = new GMap2(element);
	Mapifies.MapObjects[mapName] = thisMap;
	Mapifies.MapObjects[mapName].Options = options;
	return Mapifies.MapObjects[mapName];
};

/**
 * Adds additional objects and functions to an existing MapObject
 * @param {Object} element
 * @param {Object} description
 * @param {Object} appending
 */
Mapifies.MapObjects.Append = function ( element, description, appending ) {
	var mapName = jQuery(element).attr('id');
	Mapifies.MapObjects[mapName][description] = appending;
};

/**
 * Returns the current map object for the passed element
 * @id Mapifies.MapObjects.Get
 * @alias MapObjects.Get
 * @param {Object} element
 * @return {Object}
 */
Mapifies.MapObjects.Get = function ( element ) {
	return Mapifies.MapObjects[jQuery(element).attr('id')];
};

/**
 * The main function to initialise the map
 * @id Mapifies.Initialise
 * @alias Initialise
 * @param {Object} element
 * @param {Object} options
 * @param {Object} callback
 * @return {Function}
 */
Mapifies.Initialise = function ( element, options, callback ) {
	
	function defaults() {
		return {
			// Initial type of map to display
			'language': 'en',
			// Options: "map", "sat", "hybrid"
			'mapType': 'map',
			// Initial map center
			'mapCenter': [55.958858,-3.162302],
			// Initial map size
			'mapDimensions': [400, 400],
			// Initial zoom level
			'mapZoom': 12,
			// Initial map control size
			// Options: "large", "small", "none"
			'mapControlSize': 'small',
			// Initialise type of map control
			'mapEnableType': false,
			// Initialise small map overview
			'mapEnableOverview': false,
			// Enable map dragging when left button held down
			'mapEnableDragging': true,
			// Enable map info windows
			'mapEnableInfoWindows': true,
			// Enable double click zooming
			'mapEnableDoubleClickZoom': false,
			// Enable zooming with scroll wheel
			'mapEnableScrollZoom': false,
			// Enable smooth zoom
			'mapEnableSmoothZoom': false,
			// Enable Google Bar
			'mapEnableGoogleBar': false,
			// Enables scale bar
			'mapEnableScaleControl': false,
			// Enable the Mapifies icon
			'mapShowMapifiesIcon': true,
			//Debug Mode
			'debugMode': false
		};
	};
	options = jQuery.extend(defaults(), options);
	
	if (GBrowserIsCompatible()) {
			
		var thisMap = Mapifies.MapObjects.Set(element, options);
		var mapType = Mapifies.GetMapType(options.mapType);
		thisMap.setCenter(new GLatLng(options.mapCenter[0], options.mapCenter[1]), options.mapZoom, mapType);
		
		if (options.mapShowMapifiesIcon) {
			Mapifies.AddScreenOverlay(element,
				{
					imageUrl:'http://hg.digitalspaghetti.me.uk/jmaps/raw-file/3228fade0b3c/docs/images/jmaps-mapicon.png',
					screenXY:[70,10],
					overlayXY:[0,0],
					size:[42,25]
				}
			);
		}
		
		// Attach a controller to the map view
		// Will attach a large or small.  If any other value passed (i.e. "none") it is ignored
		switch (options.mapControlSize) {
			case "small":
				thisMap.addControl(new GSmallMapControl());
				break;
			case "large":
				thisMap.addControl(new GLargeMapControl());
				break;
		};
		// Type of map Control (Map,Sat,Hyb)
		if (options.mapEnableType) 
			thisMap.addControl(new GMapTypeControl()); // Off by default
		// Show the small overview map
		if (options.mapEnableOverview) 
			thisMap.addControl(new GOverviewMapControl());// Off by default
		// GMap2 Functions (in order of the docs for clarity)
		// Enable a mouse-dragable map
		if (!options.mapEnableDragging) 
			thisMap.disableDragging(); // On by default
		// Enable Info Windows
		if (!options.mapEnableInfoWindows) 
			thisMap.disableInfoWindow(); // On by default
		// Enable double click zoom on the map
		if (options.mapEnableDoubleClickZoom) 
			thisMap.enableDoubleClickZoom(); // On by default
		// Enable scrollwheel on the map
		if (options.mapEnableScrollZoom) 
			thisMap.enableScrollWheelZoom(); //Off by default
		// Enable smooth zooming
		if (options.mapEnableSmoothZoom) 
			thisMap.enableContinuousZoom(); // Off by default
		// Enable Google Bar
		if (options.mapEnableGoogleBar) 
			thisMap.enableGoogleBar(); //Off by default
		// Enables Scale bar
		if (options.mapEnableScaleControl) 
			thisMap.addControl(new GScaleControl());
		
		if (options.debugMode) 
			console.log(Mapifies);
		
		if (typeof callback == 'function') 
			return callback(element, options);
	} else {
		jQuery(element).text('Your browser does not support Google Maps.');
		return false;
	}
	return;
};

Mapifies.MoveTo = function ( element, options, callback ) {
		
	function defaults() {
		return {
			centerMethod: 'normal',
			mapType: null,
			mapCenter: [],
			mapZoom: null
		};
	};
	
	var thisMap = Mapifies.MapObjects.Get(element);
	options = jQuery.extend(defaults(), options);	
	
	if (options.mapType)
		var mapType = Mapifies.GetMapType(options.mapType);
	var point = new GLatLng(options.mapCenter[0], options.mapCenter[1]);
	switch (options.centerMethod) {
		case 'normal':
			thisMap.setCenter(point, options.mapZoom, mapType);
		break;
		case 'pan':
			thisMap.panTo(point);
		break;
	}
	if (typeof callback == 'function') return callback(point, options);
}
	
Mapifies.SavePosition = function( element, options, callback ) {
	var thisMap = Mapifies.MapObjects.Get(element);
	thisMap.savePosition();
	if (typeof callback == 'function') return callback();
};

Mapifies.GotoSavedPosition = function ( element, options, callback) {
	var thisMap = Mapifies.MapObjects.Get(element);
	thisMap.returnToSavedPosition();
	if (typeof callback == 'function') return callback();
};
	
Mapifies.CreateKeyboardHandler = function( element, options, callback ) {
	var thisMap = Mapifies.MapObjects.Get(element);
	var keyboardHandler = new GKeyboardHandler(thisMap);
	if (typeof callback == 'function') return callback(keyboardHandler);
};

/**
 * Returns the constant value for the Google maptype
 * @param {String} mapType
 * @return {String} mapType
 */
Mapifies.GetMapType = function ( mapType ) {
	// Lets set our map type based on the options
	switch(mapType) {
		case "map":	// Normal Map
			mapType = G_NORMAL_MAP;
		break;
		case "sat":	// Satallite Imagery
			mapType = G_SATELLITE_MAP;
		break;
		case "hybrid":	//Hybrid Map
			mapType = G_HYBRID_MAP;
		break;
	};
	return mapType;
};

Mapifies.GetTravelMode = function ( travelMode ) {
	switch(travelMode) {
		case "driving":	
			travelMode = G_TRAVEL_MODE_DRIVING;
		break;
		case "walking":	
			travelMode = G_TRAVEL_MODE_WALKING;
		break;
	};
	return travelMode;
};

function createIcon (options) {
	
	function defaults() {
		return {
			iconImage: "",
			iconShadow: "",
			iconSize: null,
			iconShadowSize: null,
			iconAnchor: null,
			iconInfoWindowAnchor: null,
			iconPrintImage: "",
			iconMozPrintImage: "",
			iconPrintShadow: "",
			iconTransparent: ""
		};
	};
	
	options = jQuery.extend(defaults(), options);
	var icon = new GIcon(G_DEFAULT_ICON);
		
	if(options.iconImage)
		icon.image = options.iconImage;
	if(options.iconShadow)
		icon.shadow = options.iconShadow;
	if(options.iconSize)
		icon.iconSize = options.iconSize;
	if(options.iconShadowSize)
		icon.shadowSize = options.iconShadowSize;
	if(options.iconAnchor)
		icon.iconAnchor = options.iconAnchor;
	if(options.iconInfoWindowAnchor)
		icon.infoWindowAnchor = options.iconInfoWindowAnchor;
	return icon;
};

function getCenter ( element ) {
	var thisMap = Mapifies.MapObjects.Get(element);
	return thisMap.getCenter();
};
	
function getBounds(element){
	var thisMap = Mapifies.MapObjects.Get(element);
	return thisMap.getBounds();
};
/**
 * Search for an address and get a geolocation returned either as a point or latlng coordinates
 * @method
 * @namespace Mapifies
 * @id Mapifies.SearchAddress
 * @param {Object} element The jQuery object containing the map element 
 * @param {Object} options An object of options
 * @param {Function} callback The callback function that returns the object
 * @return {Function} Returns a passed callback function or true
 */
Mapifies.SearchAddress = function( element, options, callback) {
	
	/**
	 * Default options for SearchAddress
	 * @method
	 * @namespace Mapifies.SearchAddress
	 * @id Mapifies.SearchAddress.defaults
	 * @alias Mapifies.SearchAddress.defaults
	 * @return {Object} The options for SearchAddress
	 */
	function defaults() {
		return {
			// what to return, "latlng" or "points"
			type: 'latlng',
			// Address to search for
			address: null,
			// Optional Cache to store Geocode Data (not implemented yet)
			cache: {},
			// Country code for localisation (not implemented yet)
			countryCode: 'uk'
		};
	};
	var thisMap = Mapifies.MapObjects.Get(element);
	options = jQuery.extend(defaults(), options);
			
	// Check to see if the Geocoder already exists in the object
	// or create a temporary locally scoped one.
	if (typeof thisMap.Geocoder == 'undefined') {
		var geocoder = new GClientGeocoder;
	} else {
		var geocoder = thisMap.Geocoder;
	}
		
	// Geocode the address
	switch (options.type) {
		case 'latlng':
			geocoder.getLatLng(options.address, function(point){
				if (typeof callback == 'function') return callback(point, options);
			});
		break;
		case 'points':
			geocoder.getLocations(options.address, function(points){
				if (typeof callback == 'function') return callback(points, options);
			});
		break;
	};
	
	return;
};
	
/**
 * Search for directions between two or more points and return it to a map and a directions panel
 * @id Mapifies.SearchDirections
 * @param {Object} element The jQuery object containing the map element 
 * @param {Object} options An object of options
 * @param {Function} callback The callback function that returns the object
 * @return {Function} Returns a passed callback function or true
 * @method
 * @namespace Mapifies
 */
Mapifies.SearchDirections = function( element, options, callback) {
	function defaults() {
		return {
			// From address
			'directions': '',
			// Optional panel to show text directions
			'panel': "",
			//The locale to use for the directions result.
			'locale': 'en_GB',
			//The mode of travel, such as driving (default) or walking
			'travelMode': 'driving',
			// Option to avoid highways
			'avoidHighways': false,
			// Get polyline
			'getPolyline': true,
			// Get directions
			'getSteps': true,
			// Preserve Viewport
			'preserveViewport' : false
		};
	};
	var thisMap = Mapifies.MapObjects.Get(element);
	options = jQuery.extend(defaults(), options);
	
	var queryOptions = {
		'locale': options.locale,
		'travelMode': options.travelMode,
		'avoidHighways': options.avoidHighways,
		'getPolyline': options.getPolyline,
		'getSteps': options.getSteps,
		'preserveViewport' : options.preserveViewport
	};
	
	var panel = $(options.panel).get(0);
	var directions = new GDirections(thisMap, panel);
	
	GEvent.addListener(directions, "load", onLoad);
    GEvent.addListener(directions, "error", onError);
	
	directions.load(options.directions, queryOptions);
	
	function onLoad() {
		if (typeof callback == 'function') return callback(directions, options);	
	}
	
	function onError() {
		if (typeof callback == 'function') return callback(directions, options);	
	}
	
	return;
};

/**
 * Returns an friendly object based on the SearchDirections return code
 * @method
 * @id SearchDirectionsCode
 * @param {Number} code The number of the code returned
 * @return {Object} Result Returns a result object with code, success and a friendly message
 */
function SearchDirectionsCode(code){
	switch (code) {
		case G_GEO_SUCCESS:
			return {'code':G_GEO_SUCCESS,'success':true,'message':'Success'};
		case G_GEO_UNKNOWN_ADDRESS:
			return {'code' : G_GEO_UNKNOWN_ADDRESS, 'success' : false, 'message' : 'No corresponding geographic location could be found for one of the specified addresses. This may be due to the fact that the address is relatively new, or it may be incorrect'};
			break;
		case G_GEO_SERVER_ERROR:
			return {'code' : G_GEO_UNKNOWN_ADDRESS, 'success' : false, 'message' : 'A geocoding or directions request could not be successfully processed, yet the exact reason for the failure is not known.'};
			break;
		case G_GEO_MISSING_QUERY:
			return {'code' : G_GEO_UNKNOWN_ADDRESS, 'success' : false, 'message' : 'The HTTP q parameter was either missing or had no value. For geocoder requests, this means that an empty address was specified as input. For directions requests, this means that no query was specified in the input.'};
			break;
		case G_GEO_BAD_KEY:
			return {'code' : G_GEO_UNKNOWN_ADDRESS, 'success' : false, 'message' : 'The given key is either invalid or does not match the domain for which it was given.'};
			break;
		case G_GEO_BAD_REQUEST:
			return {'code' : G_GEO_UNKNOWN_ADDRESS, 'success' : false, 'message' : 'A directions request could not be successfully parsed.'};
			break;
		default:
			return {
				'code': null,
				'success': false,
				'message': 'An unknown error occurred.'
			};
		break;
	};
};
/**
 * Create an adsense ads manager for the map.  Requires your adsense publisher id and channel
 * @id Mapifies.CreateAdsManager
 * @param {Object} element The jQuery object containing the map element 
 * @param {Object} options An object of options
 * @param {Function} callback The callback function that returns the object
 * @return {Function} Returns a passed callback function or true
 * @method
 * @namespace Mapifies
 */

Mapifies.CreateAdsManager = function( element, options, callback) {

	/**
	 * Default options for CreateAdsManager
	 * @method
	 * @namespace Mapifies.CreateAdsManager
	 * @id Mapifies.CreateAdsManager.defaults
	 * @alias Mapifies.CreateAdsManager.defaults
	 * @return {Object} The options for CreateAdsManager
	 */

	function defaults() {
		return {
			'publisherId':'',
			'maxAdsOnMap':3,
			'channel':0,
			'minZoomLevel':6
		}
	};
	var thisMap = Mapifies.MapObjects.Get(element);
	options = jQuery.extend(defaults(), options);
	
	var adsOptions = {
		'maxAdsOnMap':options.maxAdsOnMap,
		'channel':options.channel,
		'minZoomLevel':options.minZoomLevel
	}
	
	var adsManager = new GAdsManager(thisMap, options.publisherId, adsOptions);
	if (typeof callback == 'function') return callback(adsManager, options);
};
/**
 * Add a GeoXML or KML feed to the selected map
 * @param {Object} element
 * @param {Object} options
 * @param {Object} callback
 */
Mapifies.AddFeed = function( element, options, callback ) {
	function defaults() {
		return {
			// URL of the feed to pass (required)
			feedUrl: "",
			// Position to center the map on (optional)
			mapCenter: []
		};
	};
	var thisMap = Mapifies.MapObjects.Get(element);
	options = jQuery.extend(defaults(), options);

	// Load feed
	var feed = new GGeoXml(options.feedUrl);
	// Add as overlay
	thisMap.addOverlay(feed);
	
	// If the user has passed the optional mapCenter,
	// then center the map on that point
	if (options.mapCenter[0] && options.mapCenter[1])
		thisMap.setCenter(new GLatLng(options.mapCenter[0], options.mapCenter[1]));
		
	if (typeof callback == 'function') return callback( feed, options );
	return;
};

/**
 * Removes the specificed feed on the passed map
 * @param {Object} element
 * @param {Object} feed
 * @param {Object} callback
 * @return {Function}
 */
Mapifies.RemoveFeed = function ( element, feed, callback ) {
	var thisMap = Mapifies.MapObjects.Get(element);
	thisMap.removeOverlay(feed);
	if (typeof callback == 'function') return callback( feed, options );
	return;
};
/**
 * Adds an ground overlay image to the selected map
 * @id Mapifies.AddGroundOverlay
 * @param {Object} element
 * @param {Object} options
 * @param {Function} callback
 * @return {Function} Returns a passed callback function or true
 * @method
 * @namespace Mapifies
 */
Mapifies.AddGroundOverlay = function( element, options, callback) {
	
	/**
	 * Default options for AddGroundOverlay
	 * @id Mapifies.AddGroundOverlay.defaults
	 * @alias Mapifies.AddGroundOverlay.defaults
	 * @return {Object} The options for AddGroundOverlay
	 * @method
	 * @namespace Mapifies.AddGroundOverlay
	 */
	function defaults() {
		return {
			// South West Boundry
			overlaySouthWestBounds: [],
			// North East Boundry
			overlayNorthEastBounds: [],
			// Image
			overlayImage: ""
		};
	};
	
	var thisMap = Mapifies.MapObjects.Get(element);
	options = jQuery.extend(defaults(), options);
	
	var boundries = new GLatLngBounds(new GLatLng(options.overlaySouthWestBounds[0], options.overlaySouthWestBounds[1]), new GLatLng(options.overlayNorthEastBounds[0], options.overlayNorthEastBounds[1]));
	groundOverlay = new GGroundOverlay(options.overlayImage, boundries);
	
	thisMap.addOverlay(groundOverlay);
		
	if (typeof callback == 'function') return callback( groundOverlay, options );
	return;
};

/**
 * Removes an ground overlay image to the selected map
 * @id Mapifies.RemoveGroundOverlay
 * @param {Object} element
 * @param {Object} groundOverlay
 * @return {Boolean} True
 * @method
 * @namespace Mapifies
 */
Mapifies.RemoveGroundOverlay = function ( element, groundOverlay ) {
	var thisMap = Mapifies.MapObjects.Get(element);
	thisMap.removeOverlay(groundOverlay);
	return;
};
/**
 * Adds a marker to the selected map with the passed options
 * @param {Object} element
 * @param {Object} options
 * @param {Object} callback
 * @return {Function}
 */
Mapifies.AddMarker = function ( element, options, callback ) {
	
	function defaults() {
		var values = {
			// Point lat & lng
			pointLatLng: [],
			// Point HTML for infoWindow
			pointHTML: null,
			// Event to open infoWindow (click, dblclick, mouseover, etc)
			pointOpenHTMLEvent: "click",
			// Point is draggable?
			pointIsDraggable: false,
			// Point is removable?
			pointIsRemovable: false,
			// Event to remove on (click, dblclick, mouseover, etc)
			pointRemoveEvent: "dblclick",
			// These two are only required if adding to the marker manager
			pointMinZoom: 4,
			pointMaxZoom: 17,
			// Optional Icon to pass in (not yet implemented)
			pointIcon: null,
			// For maximizing infoWindows (not yet implemented)
			pointMaxContent: null,
			pointMaxTitle: null,
			centerMap: false
		};
		return values;
	};
	
	var thisMap = Mapifies.MapObjects.Get(element);
	options = jQuery.extend({}, defaults(), options);
	var markerOptions = {}
	
	if (typeof options.pointIcon == 'object')
		jQuery.extend(markerOptions, {'icon': options.pointIcon});
		
	if (options.pointIsDraggable)
		jQuery.extend(markerOptions, {'draggable': options.pointIsDraggable});
			
	if (options.centerMap)
		jQuery.jmap.GMap2.setCenter(new GLatLng(options.pointLatLng[0],options.pointLatLng[1]));
		
	// Create marker, optional parameter to make it draggable
	var marker = new GMarker(new GLatLng(options.pointLatLng[0],options.pointLatLng[1]), markerOptions);
		
	// If it has HTML to pass in, add an event listner for a click
	if(options.pointHTML)
		GEvent.addListener(marker, options.pointOpenHTMLEvent, function(){
			marker.openInfoWindowHtml(options.pointHTML, {maxContent: options.pointMaxContent, maxTitle: options.pointMaxTitle});
		});
	// If it is removable, add dblclick event
	if(options.pointIsRemovable)
		GEvent.addListener(marker, options.pointRemoveEvent, function(){
			thisMap.removeOverlay(marker);
		});

	// If the marker manager exists, add it
	if(thisMap.MarkerManager) {
		thisMap.MarkerManager.addMarker(marker, options.pointMinZoom, options.pointMaxZoom);	
	} else {
		// Direct rendering to map
		thisMap.addOverlay(marker);
	}
		
	if (typeof callback == 'function') return callback(marker, options);
	return;
};


/**
 * Removes the specificed marker on the passed map
 * @param {Object} element
 * @param {Object} marker
 * @return {Boolean}
 */
Mapifies.RemoveMarker = function (element, marker ) {
	var thisMap = Mapifies.MapObjects.Get(element);
	thisMap.removeOverlay(marker);
	return;
};

Mapifies.CreateMarkerManager = function(element, options, callback) {
	
	function defaults() {
		return {
			// Border Padding in pixels
			borderPadding: 100,
			// Max zoom level 
			maxZoom: 17,
			// Track markers
			trackMarkers: false
		}
	}
	var thisMap = Mapifies.MapObjects.Get(element);
	options = jQuery.extend(defaults(), options);
	var markerManager = new GMarkerManager(thisMap, options);
	Mapifies.MapObjects.Append(element, 'MarkerManager',markerManager);

	// Return the callback
	if (typeof callback == 'function') return callback( options );
};
Mapifies.AddPolygon = function(element, options, callback) {
	
	function defaults() {
		return {
			// An array of GLatLng objects
			polygonPoints: [],
			// The outer stroke colour
	 		polygonStrokeColor: "#000000",
	 		// Stroke thickness
	 		polygonStrokeWeight: 5,
	 		// Stroke Opacity
	 		polygonStrokeOpacity: 1,
	 		// Fill colour
	 		polygonFillColor: "#ff0000",
	 		// Fill opacity
	 		polygonFillOpacity: 1,
	 		// Optional center map
	 		mapCenter: [],
	 		// Is polygon clickable?
	 		polygonClickable: true
		}
	}
	
	var thisMap = Mapifies.MapObjects.Get(element);
	options = jQuery.extend(defaults(), options);
	var polygonOptions = {};
	
	if (!options.polygonClickable)
		polygonOptions = jQuery.extend(polygonOptions, {clickable: false});
	 		
	if(options.mapCenter[0] && options.mapCenter[1])
		thisMap.setCenter(new GLatLng(options.mapCenter[0], options.mapCenter[1]));
	
	var allPoints = [];
	jQuery.each(options.polygonPoints, function(i, point) {
		allPoints.push(new GLatLng(point[0],point[1]));
	});
	
	var polygon = new GPolygon(allPoints, options.polygonStrokeColor, options.polygonStrokeWeight, options.polygonStrokeOpacity, options.polygonFillColor, options.polygonFillOpacity, polygonOptions);
	thisMap.addOverlay(polygon);
		
	if (typeof callback == 'function') return callback(polygon, polygonOptions, options);
	return;
}

Mapifies.RemovePolygon = function (element, polygon ) {
	var thisMap = Mapifies.MapObjects.Get(element);
	thisMap.removeOverlay(polygon);
	return;
};
/**
 * Adds an polyline to the map made up of several geopoints.
 * @id Mapifies.AddPolyline
 * @param {Object} element
 * @param {Object} options
 * @param {Function} callback
 * @return {Function} Returns a passed callback function or true
 * @method
 * @namespace Mapifies
 */
Mapifies.AddPolyline = function (element, options, callback) {
	
	/**
	 * Default options for AddPolyline
	 * @id Mapifies.AddPolyline.defaults
	 * @alias Mapifies.AddPolyline.defaults
	 * @return {Object} The options for AddPolyline
	 * @method
	 * @namespace Mapifies.AddPolyline
	 */
	function defaults() {
		return {
			// An array of GLatLng objects
			polylinePoints: [],
			// Colour of the line
			polylineStrokeColor: "#ff0000",
			// Width of the line
			polylineStrokeWidth: 10,
			// Opacity of the line
			polylineStrokeOpacity: 1,
			// Optional center map
			mapCenter: [],
			// Is line Geodesic (i.e. bends to the curve of the earth)?
			polylineGeodesic: false,
			// Is line clickable?
			polylineClickable: true
		};
	};
	
	var thisMap = Mapifies.MapObjects.Get(element);
	options = jQuery.extend(defaults(), options);
	var polyLineOptions = {};
	if (options.polylineGeodesic)
		jQuery.extend(polyLineOptions, {geodesic: true});
			
	if(!options.polylineClickable)
		jQuery.extend(polyLineOptions, {clickable: false});

	if (options.mapCenter[0] && options.mapCenter[1])
		thisMap.setCenter(new GLatLng(options.mapCenter[0], options.mapCenter[1]));

	var allPoints = [];
	jQuery.each(options.polylinePoints, function(i, point) {
		allPoints.push(new GLatLng(point[0],point[1]));
	});

	var polyline = new GPolyline(allPoints, options.polylineStrokeColor, options.polylineStrokeWidth, options.polylineStrokeOpacity, polyLineOptions);
	thisMap.addOverlay(polyline);
		
	if (typeof callback == 'function') return callback(polyline, polyLineOptions, options);
	return;
}

/**
 * Removes an polyline to the map made up of several geopoints.
 * @id Mapifies.RemovePolyline
 * @param {Object} element
 * @param {Object} polyline
 * @param {Function} callback
 * @return {Function} Returns a passed callback function or true
 * @method
 * @namespace Mapifies
 */
Mapifies.RemovePolyline = function (element, polyline, callback ) {
	var thisMap = Mapifies.MapObjects.Get(element);
	thisMap.removeOverlay(polyline);
	return;
};
/**
 * Adds a screen overlau to the selected map.
 * @id Mapifies.AddScreenOverlay
 * @param {Object} element
 * @param {Object} options
 * @param {Function} callback
 * @return {Function} Returns a passed callback function or true
 * @method
 * @namespace Mapifies
 */
Mapifies.AddScreenOverlay = function( element, options, callback ) {
	
	/**
	 * Default options for AddScreenOverlay
	 * @id Mapifies.AddScreenOverlay.defaults
	 * @alias Mapifies.AddScreenOverlay.defaults
	 * @return {Object} The options for AddScreenOverlay
	 * @method
	 * @namespace Mapifies.AddScreenOverlay
	 */
	function defaults() {
		return {
			'imageUrl':'',
			'screenXY':[],
			'overlayXY':[],
			'size':[]
		};
	};
	var thisMap = Mapifies.MapObjects.Get(element);
	options = jQuery.extend(defaults(), options);

	var overlay = new GScreenOverlay(options.imageUrl, new GScreenPoint(options.screenXY[0],options.screenXY[1]), new GScreenPoint(options.overlayXY[0],options.overlayXY[1]), new GScreenSize(options.size[0],options.size[1]));
	thisMap.addOverlay(overlay);
		
	if (typeof callback == 'function') return callback(overlay, options);
};

/**
 * Removes a screen overlay to the selected map.
 * @id Mapifies.RemoveScreenOverlay
 * @param {Object} element
 * @param {Object} overlay
 * @param {Boolean} True
 */
Mapifies.RemoveScreenOverlay = function ( element, overlay ) {
	var thisMap = Mapifies.MapObjects.Get(element);
	thisMap.removeOverlay(overlay);
	return;
};
Mapifies.CreateStreetviewPanorama = function( element, options, callback ) {
	
	function defaults() {
		return {
			'overideContainer':'',
			'latlng':[40.75271883902363, -73.98262023925781],
			'pov': []
		}
	};
	var thisMap = Mapifies.MapObjects.Get(element);
	options = jQuery.extend(defaults(), options);
	// Create Street View Overlay
	
	var container = null;
	if (options.overideContainer !== '') {
		container = jQuery(options.overideContainer).get(0);
	} else {
		container = jQuery(element).get(0);
	}
	
	var viewOptions = {};
	if (options.pov.length > 0) {
		jQuery.extend(viewOptions, {'pov':new GPov(options.latlng[0],options.latlng[1],options.latlng[2])});
	}
	if (options.latlng.length > 0) {
		jQuery.extend(viewOptions, {'latlng':new GLatLng(options.latlng[0],options.latlng[1])});
	}
	
	var overlay = new GStreetviewPanorama(container, viewOptions);
	if (typeof callback == 'function') return callback(overlay, options);
	return;
};

/**
 * Removes the specificed feed on the passed map
 * @param {Object} element
 * @param {Object} feed
 * @param {Object} callback
 * @return {Function}
 */
Mapifies.RemoveStreetviewPanorama = function ( element, view, callback ) {
	var thisMap = Mapifies.MapObjects.Get(element);
	view.remove();
	if (typeof callback == 'function') return callback( view );
	return;
};
/**
 * Adds a traffic layer to the selected map.
 * @id Mapifies.AddTrafficInfo
 * @param {Object} element
 * @param {Object} options
 * @param {Function} callback
 * @return {Function} Returns a passed callback function or true
 * @method
 * @namespace Mapifies
 */
Mapifies.AddTrafficInfo = function( element, options, callback) {
	
	/**
	 * Default options for AddTrafficInfo
	 * @id Mapifies.AddTrafficInfo.defaults
	 * @alias Mapifies.AddTrafficInfo.defaults
	 * @return {Object} The options for AddTrafficInfo
	 * @method
	 * @namespace Mapifies.AddTrafficInfo
	 */
	function defaults() {
		return {
			// Center the map on this point (optional)
			mapCenter: []
		};
	};
	var thisMap = Mapifies.MapObjects.Get(element);
	options = jQuery.extend(defaults(), options);

	var trafficOverlay = new GTrafficOverlay;
	// Add overlay
	thisMap.addOverlay(trafficOverlay);
	// If the user has passed the optional mapCenter,
	// then center the map on that point
	if (options.mapCenter[0] && options.mapCenter[1]) {
		thisMap.setCenter(new GLatLng(options.mapCenter[0], options.mapCenter[1]));
	}
	if (typeof callback == 'function') return callback(trafficOverlay, options);
};

/**
 * Removes a traffic layer to the selected map.
 * @id Mapifies.RemoveTrafficInfo
 * @param {Object} element
 * @param {Object} trafficOverlay
 * @param {Boolean} True
 */
Mapifies.RemoveTrafficInfo = function ( element, trafficOverlay ) {
	var thisMap = Mapifies.MapObjects.Get(element);
	thisMap.removeOverlay(trafficOverlay);
	return;
};var Mapifies;

if (!Mapifies) Mapifies = {};

(function($){
	$.fn.jmap = function(method, options, callback) {
		return this.each(function(){
			if (method == 'init' && typeof options == 'undefined') {
				new Mapifies.Initialise(this, {}, null);
			} else if (method == 'init' && typeof options == 'object') {
				new Mapifies.Initialise(this, options, callback);
			} else if (method == 'init' && typeof options == 'function') {
				new Mapifies.Initialise(this, {}, options);
			} else if (typeof method == 'object' || method == null) {
				new Mapifies.Initialise(this, method, options);
			} else {
				try {
					new Mapifies[method](this, options, callback);
				} catch(err) {
					throw Error('Mapifies Function Does Not Exist');
				}
			}
		});
	}
})(jQuery);
