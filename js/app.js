

var currentLanguage = "fr";


var ngapp = new angular.module('ngapp', ['ngRoute', 'appControllers', 'ngAnimate', 'snap', 'ngStorage', 'ngTouch', 'ngResource', 'ngMap', 'ngSanitize']);

ngapp.config(['$routeProvider', function($routeProvider) {
	
	$routeProvider
	.when('/home/:page', {
		templateUrl: 'templates/home.html',
		controller: 'HomeCtrl'
	})
	.when('/themes/:idTheme', {
		templateUrl: 'templates/sousthemes.html',
		controller: 'SousThemesCtrl'
	})
	.when('/themes/:idTheme/:idSousTheme', {
		templateUrl: 'templates/listeEtapes.html',
		controller: 'ListeEtapesCtrl'
	})
	.when('/etapes/:idFiche', {
		templateUrl: 'templates/etape.html',
		controller: 'EtapeCtrl'
	})
	.when('/tutoriel', {
		templateUrl: 'templates/tutoriel.html',
		controller: 'TutorielCtrl'
	})
	.when('/actualites', {
		templateUrl: 'templates/actualites.html',
		controller: 'ActualitesCtrl'
	})
	.when('/actualites/:idActu', {
		templateUrl: 'templates/actualite-single.html',
		controller: 'ActualiteSingleCtrl'
	})
	.when('/jouer', {
		templateUrl: 'templates/jouer.html',
		controller: 'JouerCtrl'
	})
	.when('/apropos/:page', {
		templateUrl: 'templates/apropos.html',
		controller: 'AProposCtrl'
	})
	.when('/application-mobile', {
		templateUrl: 'templates/application.html',
	})
	.when('/connexion-problem', {
		templateUrl: 'templates/connexion-problem.html',
	})
	.otherwise({
		redirectTo: '/home/themes'
	});
	
}]);


var baseURL = "http://www.lesetapessavoureuses.fr/lesetapessavoureuses-app/";
var baseURLWordpress = "http://www.lesetapessavoureuses.fr/";

if( lang == "en" )
	baseURLWordpress = "http://en.lesetapessavoureuses.fr/";


ngapp.run(function($window, $rootScope, $location, $resource, $templateCache, $localStorage, $timeout, $http)
{
	$rootScope.geolocationError = false;
	$rootScope.themesLoaded = false;


	// Traduction 
	$rootScope.trads = null;
	$rootScope.lang = lang;

	if( $rootScope.lang == null )
		$rootScope.lang = "fr";

	$http.get('datas/trad.json').success(function(datas){
		////console.log(datas);
		$rootScope.trads = datas;
		$rootScope.loadingTrad = $rootScope.getTrad("loading");
	});
	$rootScope.getTrad = function(id){
		if( $rootScope.trads[id] == null )
			return "";

		if( $rootScope.lang == "en" )
			return $rootScope.trads[id]['en'];

		return $rootScope.trads[id]['fr'];
	}

	$rootScope.getPosition = function(){
		if( $rootScope.currentLatitude != null && $rootScope.currentLongitude != null )
			return;

		geoPosition.getCurrentPosition(geoSuccess, geoError, {timeout:5000, maximumAge:0,enableHighAccuracy : true});
	}

	function geoSuccess(position) {
		$rootScope.currentLatitude = position.coords.latitude;
		$rootScope.currentLongitude = position.coords.longitude;
		$rootScope.$broadcast('acote-handler');
	}

	function geoError() {
		$rootScope.geolocationError = true;
	}

	/*if (geoPosition.init()) {
	   $rootScope.getPosition();
	}*/

	$templateCache.removeAll();
	$rootScope.themes == null;
	$rootScope.online = navigator.onLine;
	$rootScope.stopLoadingACote = false;

	$rootScope.$storage = $localStorage.$default({ });

	if( $rootScope.$storage.listeEtapesInStorage == null)
		$rootScope.$storage.listeEtapesInStorage = new Array();

	if( $rootScope.$storage.listeAllEtapes == null)
		$rootScope.$storage.listeAllEtapes = new Array();

	if( $rootScope.$storage.images == null)
		$rootScope.$storage.images = new Array();
	if( $rootScope.$storage.imagesID == null)
		$rootScope.$storage.imagesID = new Array();


	$rootScope.$storage.listeEtapesLoaded = new Array();
	$rootScope.allEtapesForMap = null;
	$rootScope.listEtapeTriee = null;

	$rootScope.firstBuild = 'first-build';
	var firstCall = true;

	if( $rootScope.$storage.tutorialSeen == undefined )
	{
		$rootScope.$storage.tutorialSeen = true;
		$rootScope.firstBuild = 'tutoriel';
		firstCall = true;
		$location.path('/tutoriel');
	}
	else{
		firstCall = true;
		//$rootScope.firstBuild = 'first-build';
		$location.path('/home/themes');
	}

	$rootScope.$on('$routeChangeStart', function(next, current){	

		$rootScope.isOnline = navigator.onLine ;
		$rootScope.stopLoadingACote = true;

//    	$(window).trigger("resize.doResize");

		if( current.$$route != null )
		{
			var currentName = $rootScope.currentCtrl;
			var nextName = current.$$route.controller;
			//console.log(currentName, nextName);
			if( currentName == null )
			{
				$rootScope.animSide = "no-anim";
			}

			// Default
			$rootScope.animSide = "fadeAnimation";
			$rootScope.aproposPage = null;

			if( currentName == "HomeCtrl" && nextName == "HomeCtrl" )
			{
				$rootScope.animSide = "no-anim";
			}
			if( currentName == "HomeCtrl" && nextName == "SousThemesCtrl" )
			{
				$rootScope.animSide = "left";
			}
			if( currentName == "SousThemesCtrl" && nextName == "HomeCtrl" )
			{
				$rootScope.animSide = "right";
			}
			if( currentName == "SousThemesCtrl" && nextName == "ListeEtapesCtrl" )
			{
				$rootScope.animSide = "left";
			}
			if( currentName == "ListeEtapesCtrl" && nextName == "SousThemesCtrl" )
			{
				$rootScope.animSide = "right";
			}
			if( currentName == "ListeEtapesCtrl" && nextName == "EtapeCtrl" )
			{
				$rootScope.animSide = "left";
			}
			if( currentName == "SousThemesCtrl" && nextName == "EtapeCtrl" )
			{
				$rootScope.animSide = "left";
			}
			if( currentName == "HomeCtrl" && nextName == "EtapeCtrl" )
			{
				$rootScope.animSide = "left";
			}
			if( currentName == "EtapeCtrl" )
			{
				$rootScope.animSide = "right";
			}

			if( currentName == "ActualitesCtrl" && nextName == "ActualiteSingleCtrl" )
			{
				$rootScope.animSide = "left";
			}
			if( currentName == "ActualiteSingleCtrl" && nextName == "ActualitesCtrl" )
			{
				$rootScope.animSide = "right";
			}
			
			$rootScope.currentCtrl = current.$$route.controller;

		}
		
	});

	$rootScope.$on('$routeChangeSuccess', function(next, current){	

    	$(window).trigger("resize.doResize");

    });

		

	$rootScope.getlibelle = function(data){
		////console.log("getlibelle :" +data);
		if( data == null )
			return null;

		if( $rootScope.lang == "en" && data.libelleEn != null ){
			return data.libelleEn;
		}
		else if( $rootScope.lang == "fr" && data.libelleFr != null ){
			return data.libelleFr;
		}
		else{
			return null;
		}
	}

	$rootScope.replaceN = function(data){
		if( data != null )	
			return data.replace(/\n/g, "<br />");
	}

	// Detecter les changements de connexion a internet
	$rootScope.isOnline = navigator.onLine;
	$rootScope.alertOffline = false;
	$rootScope.alertAppli = false;

	
	if( $rootScope.alertAppli == false && version == "site-mobile" ){
		$rootScope.alertAppli = true;
		
		$timeout( function(){ 
			swal({   
				title: $rootScope.getTrad('swal_appli_titre'),//"Souhaitez-vous télécharger l'application mobile ?",   
				text: $rootScope.getTrad('swal_appli_texte'),//"Emportez les étapes savoureuses avec vous !",
				showCancelButton: true,   
				confirmButtonColor: "#9d2344",   
				confirmButtonText: $rootScope.getTrad('oui'),//"Oui",   
				cancelButtonText: $rootScope.getTrad('non_merci'),//"Non, merci",   
				closeOnConfirm: false,   
				closeOnCancel: true
			}, function(isConfirm){

				var system = getMobileOperatingSystem();

				if( isConfirm && system == 'Android' ){
					window.open('http://www.google.fr/');
				}
				if( isConfirm && system == 'iOS' ){
					window.open('http://www.apple.com/');
				}

			});
		} , 2000 );

	

	}


	$window.addEventListener("offline", function()
	{
		$rootScope.$emit('triggerOffline', null );
		if( $rootScope.alertOffline == false )
		{
			$rootScope.alertOffline = true;

			swal({   
				title: $rootScope.getTrad('swal_connect_titre'),//"Attention !",   
				text: $rootScope.getTrad('swal_connect_texte'),//"Vous n'êtes pas connecté à internet. Vous n'aurez donc pas accès à toutes les fonctionnalités du site.",   
				type: "warning" 
			});
			$location.path('/home/themes');

		}
		$rootScope.$apply(function(){ $rootScope.isOnline = false;});
	}, false);

	
	$window.addEventListener("online", function()
	{
		$rootScope.$apply(function() {$rootScope.isOnline = true;});
	}, false);
	
	$rootScope.version = version;


	$rootScope.resizeImageHeight = 350;
	$(window).on("resize.doResize", function (){
        var newSize = Math.round(window.outerWidth/1.5);
        if( newSize == 0 ){
        	newSize = 350;
        }

        $rootScope.resizeImageHeight = newSize;
        $(".resize-image").stop(true,true).height(newSize+"px");
    });



});

app.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});


if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i)) {
    $('html').addClass('ipad ios7');
}


/**
 * Determine the mobile operating system.
 * This function either returns 'iOS', 'Android' or 'unknown'
 *
 * @returns {String}
 */
function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
  {
    return 'iOS';

  }
  else if( userAgent.match( /Android/i ) )
  {

    return 'Android';
  }
  else
  {
    return 'unknown';
  }
}




