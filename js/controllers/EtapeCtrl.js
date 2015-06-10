/* EtapeCtrl Controller */

var appControllers = angular.module('appControllers', []);

appControllers.controller('EtapeCtrl', EtapeCtrl);

function EtapeCtrl($scope, $rootScope, $routeParams, $http, $timeout, $window)
{
	var idFiche = $routeParams.idFiche;
	$scope.noDataForFiche = false;

	$scope.headerRetourHref = "#/home/themes";
	if( $rootScope.currentTheme != null && $rootScope.currentSousTheme == null )
		$scope.headerRetourHref = "#/themes/"+$rootScope.currentTheme.category_slug;
	if( $rootScope.currentTheme != null && $rootScope.currentSousTheme != null )
		$scope.headerRetourHref = "#/themes/"+$rootScope.currentTheme.category_slug+"/"+ $rootScope.currentSousTheme.category_slug;
	

	if( $rootScope.etapesPageName != 'themes' ){
		$scope.headerRetourHref = "#/home/"+$rootScope.etapesPageName;
	}

	$timeout( function(){
		
		if( $rootScope.isOnline == true ){
			var url = baseURLWordpress+'/sitra/getFicheSitraById.php?idFiche='+idFiche;
			$http.get(url).success(function(response){
				$scope.fiche = response.objetsTouristiques[0];

				$scope.initFicheData();

				if( $rootScope.$storage.etapes == null )
					$rootScope.$storage.etapes = new Array();

				$rootScope.$storage.etapes[''+idFiche] = $scope.fiche;
				
			});
		}

		if( $rootScope.isOnline == false && $rootScope.$storage.etapes != null && $rootScope.$storage.etapes[''+idFiche] != null){
			$scope.fiche = $rootScope.$storage.etapes[''+idFiche];
			$scope.initFicheData();
		}
		else if( $rootScope.isOnline == false && ( $rootScope.$storage.etapes == null || $rootScope.$storage.etapes[''+idFiche] == null ) ){
			$scope.noDataForFiche = true;
		}
	
	} , 500 );

	

	$scope.initFicheData = function(){
		$rootScope.headerRetourTitle = $rootScope.getlibelle($scope.fiche.nom);


		if( $scope.fiche.localisation.geolocalisation.geoJson != null ){
			$scope.lattitude = $scope.fiche.localisation.geolocalisation.geoJson.coordinates[1];
			$scope.longitude = $scope.fiche.localisation.geolocalisation.geoJson.coordinates[0];
		}

		if( $scope.fiche.informations.moyensCommunication != null )
		{
			for( var i=0 ; i<$scope.fiche.informations.moyensCommunication.length ; i++ )
			{
				var comm = $scope.fiche.informations.moyensCommunication[i];

				if( comm.type.id == 201 ){
					// Téléphone
					$scope.tel = comm.coordonnee;
				}
				else if( comm.type.id == 204 ){
					// Mail
					$scope.mail = comm.coordonnee;
				}	
				else if( comm.type.id == 205 ){
					// Site Web
					$scope.website = comm.coordonnee;
					$scope.websiteDisplay = comm.coordonnee.substring(7, comm.coordonnee.length);
				}
				else if( comm.type.id == 207 ){
					// Facebook
					$scope.facebook = comm.coordonnee;
				}
				else if( comm.type.id == 3755 ){
					// twitter
					$scope.twitter = comm.coordonnee;
				}
			}
		}
		
		//if( $scope.map != null )
		//	$scope.setupMap($scope.map);
	}


	

	$scope.hasDisctinctionLogo = function(distinction){
		/*if( distinction.id == 2968 || distinction.id == 2969 )
			distinction.id = 1597; // Pour les deux logos Guide du routards décliné, on met guide du routard normal
		*/

		if( distinction.id == 1462 || distinction.id == 1489 || distinction.id == 1592 || distinction.id == 1595 || distinction.id == 1597 || distinction.id == 1604 
			|| distinction.id == 1624 || distinction.id == 1630 || distinction.id == 1664 || distinction.id == 1674 || distinction.id == 1680 || distinction.id == 3846
		 	/* 2 COCOTTE || distinction.id == 2944 */  || distinction.id == 2966  || distinction.id == 2974 || distinction.id == 2952  ){
			$scope.hasDistinction = true;
			return true;
		}	

		return false;
	}


	$scope.externalLinks = function(link){
		$window.open(encodeURI(link), '_system', 'location=yes');
		return false;
	}
}