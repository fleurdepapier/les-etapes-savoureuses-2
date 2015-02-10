
/* Navigation Controller */

var appControllers = angular.module('appControllers', []);

appControllers.controller('NavCtrl', NavCtrl);

function NavCtrl($scope, $rootScope, $location, $resource)
{

    $rootScope.goToPage = function(page){
    	
    	$rootScope.isOnline = navigator.onLine ;

    	if( $rootScope.isOnline == false && page != "home/themes" ){
    		$location.path('connexion-problem');
    		return;
    	}
    	$location.path(page);
    }

    $scope.switchLanguage = function(){
    	if( $rootScope.lang == "fr" ){
    		document.location = "index.html?l=en";
    	} 
    	else{
    		document.location = "index.html?l=fr";
    	}
    }
	
	// Initialisation du menu A propos :

	if( $rootScope.menuApropos == null && $rootScope.isOnline == true ){
		var WPAPI = $resource(baseURLWordpress+'?wpapi=get_posts&dev=1&type=page&id=144', null, {'query' : {method:'GET', params:{isArray:false}} });
		WPAPI.query( null, function(datas){
			$rootScope.menuApropos = datas.posts[0].custom_fields.pages;
		});
	}

	
}