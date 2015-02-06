

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


var baseURL = "http://www.lesetapessavoureuses.fr/lesetapessavoureuses-app-dev/";
var baseURLWordpress = "http://www.lesetapessavoureuses.fr/";


ngapp.run(function($window, $rootScope, $location, $resource, $templateCache, $localStorage, $timeout)
{
	$rootScope.geolocationError = false;
	$rootScope.themesLoaded = false;

	

	$templateCache.removeAll();
	$rootScope.themes == null;
	$rootScope.online = navigator.onLine;

	$rootScope.$storage = $localStorage.$default({ });

	if( $rootScope.$storage.listeEtapesInStorage == null)
		$rootScope.$storage.listeEtapesInStorage = new Array();

	if( $rootScope.$storage.listeAllEtapes == null)
		$rootScope.$storage.listeAllEtapes = new Array();

	if( $rootScope.$storage.images == null)
		$rootScope.$storage.images = new Array();

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

//    	$(window).trigger("resize.doResize");

		if( current.$$route != null )
		{
			var currentName = $rootScope.currentCtrl;
			var nextName = current.$$route.controller;
			console.log(currentName, nextName);
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
		if( data == null )
			return null;

		if( currentLanguage == "en" && data.libelleEn != null ){
			return data.libelleEn;
		}
		else if( currentLanguage == "fr" && data.libelleFr != null ){
			return data.libelleFr;
		}
		else{
			return null;
		}
	}

	// Detecter les changements de connexion a internet
	$rootScope.isOnline = navigator.onLine;
	$rootScope.alertOffline = false;
	$rootScope.alertAppli = false;

	if( $rootScope.alertAppli == false && version == "site-mobile" ){
		$rootScope.alertAppli = true;
		
		$timeout( function(){ 
			swal({   
				title: "Souhaitez-vous télécharger l'application mobile ?",   
				text: "Emportez les étapes savoureuses avec vous !",
				showCancelButton: true,   
				confirmButtonColor: "#9d2344",   
				confirmButtonText: "Oui",   
				cancelButtonText: "Non, merci",   
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
				title: "Attention !",   
				text: "Vous n'êtes pas connecté à internet. Vous n'aurez donc pas accès à toutes les fonctionnalités du site.",   
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
        $rootScope.resizeImageHeight = Math.round(window.outerWidth/1.5);
        console.log(Math.round(window.outerWidth/1.5));
        console.log(window.outerWidth);
        $(".resize-image").stop(true,true).height(Math.round(window.outerWidth/1.5)+"px");
    });



	$rootScope.updateGeoPosition = function(lat,long) {
		console.log(lat,long);
	}
	$rootScope.geoError = function(){
		$rootScope.geolocationError = true;
	}
});

ngapp.filter('unsafe', function($sce) {
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