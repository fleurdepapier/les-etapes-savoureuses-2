// Check if a new cache is available on page load.
window.addEventListener('load', function(e) {

	var appCache = window.applicationCache;

	// Check if a new cache is available on page load.
	window.applicationCache.addEventListener('updateready', function(e) {

		//console.log("applicationCache updateready");

		if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
			// Browser downloaded a new app cache.
			window.location.reload();
		} else {
			// Manifest didn't changed. Nothing new to server.
		  	$("#cacheCleaner").fadeOut(500);
		}
	}, false);


	// Fired after the first cache of the manifest.
	appCache.addEventListener('cached', function(e){ 
		//console.log("applicationCache cached");
		$("#cacheCleaner").fadeOut(500);
	}, false);	


	// Checking for an update. Always the first event fired in the sequence.
	appCache.addEventListener('checking', function(e){ 
		//console.log("applicationCache checking");
	}, false);

	// An update was found. The browser is fetching resources.
	appCache.addEventListener('downloading', function(e){ 
		//console.log("applicationCache downloading");
	}, false);

	// The manifest returns 404 or 410, the download failed,
	// or the manifest changed while the download was in progress.
	appCache.addEventListener('error', function(e){ 
		//console.log("applicationCache error ");
		//console.log(e);
		$("#cacheCleaner").fadeOut(500);
	}, false);

	// Fired after the first download of the manifest.
	appCache.addEventListener('noupdate', function(e){ 
		//console.log("applicationCache noupdate");
		$("#cacheCleaner").fadeOut(500);
	}, false);

	// Fired if the manifest file returns a 404 or 410.
	// This results in the application cache being deleted.
	appCache.addEventListener('obsolete', function(e){ 
		//console.log("applicationCache obsolete");
	}, false);

	// Fired for each resource listed in the manifest as it is being fetched.
	appCache.addEventListener('progress', function(e){ 
		//console.log("applicationCache progress");
	}, false);


}, false);
