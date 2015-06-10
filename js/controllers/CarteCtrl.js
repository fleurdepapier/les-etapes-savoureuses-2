/* Carte Controller */

var appControllers = angular.module('appControllers', []);

appControllers.controller('CarteCtrl', CarteCtrl);

function CarteCtrl($scope, $rootScope, $http, $location, $timeout)
{
	$rootScope.stopLoadingACote = true;
	
	$scope.markerRollOver = -1;
	$scope.scrollPos = 0;

	$rootScope.$broadcast('rebuild:me');
	$rootScope.etapesPageName = "carte";

	$rootScope.displayFiltresCarte = false;
	$rootScope.toggleFiltresCarte = function(){
		
		if( $rootScope.displayFiltresCarte )
			$rootScope.displayFiltresCarte = false;
		else 
			$rootScope.displayFiltresCarte = true;

	};

	// Functions
	$rootScope.randomizeArray = function(array){
	    for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    }
	    return array;
	}

	$rootScope.changeSelectionCarte = function(){
		//console.log( $rootScope.map , $scope.markerCluster );
		if( $rootScope.map == null || $scope.markerCluster == null )
			return;

		$scope.markerCluster.clearMarkers();

		for( var i = 0 ; i < $scope.allCatMarkers.length ; i++ )
		{
			//console.log($scope.allCatMarkers[i]);
			if( $scope.selectionsDatas[$scope.allCatMarkers[i].idSelection].selected == true ){
				$scope.allCatMarkers[i].setMap($scope.map);
				$scope.markerCluster.addMarker($scope.allCatMarkers[i]);
			}
			else{
				$scope.allCatMarkers[i].setMap(null);
				$scope.markerCluster.removeMarker($scope.allCatMarkers[i]);
			}
		}

		$scope.markerCluster.repaint();

	}

	$scope.setupMap = function(map){

		if( map != null && $scope.listeEtapes != null && $scope.allCatMarkers == null )
		{
			var latlngbounds = new google.maps.LatLngBounds();
			$scope.allCatMarkers = [];

			var svgPin = 'M0.001,0c0,0,44.045-55.22,56.948-97.554c2.039-5.699,3.236-11.795,3.461-18.136c0.036-0.734,0.055-1.459,0.055-2.176 c0.002-33.339-27.071-60.368-60.464-60.368c-33.395,0-60.466,27.029-60.466,60.368c0,0.714,0.021,1.442,0.053,2.176 c0.227,6.341,1.425,12.432,3.462,18.13C-44.051-55.225,0.001,0,0.001,0z';
			$rootScope.map = map;


			for( var i=0 ; i<$scope.listeEtapes.length ; i++)
			{
				if( $scope.listeEtapes[i].localisation.geolocalisation.geoJson != null )
				{
					var customPin = {
						path: svgPin,
						fillColor: $scope.selectionsDatas[$scope.listeEtapes[i].idSelection].color,
						fillOpacity: 1,
						scale: 0.2
					};

					var customPinOver = {
						path: svgPin,
						fillColor: $scope.selectionsDatas[$scope.listeEtapes[i].idSelection].color,
						fillOpacity: 1,
						scale: 0.25
					};

					$scope.listeEtapes[i].iconOut = customPin;
					$scope.listeEtapes[i].iconOver = customPinOver;

					var marker = new google.maps.Marker(
					{ 
						title: $scope.listeEtapes[i].nom.libelleFr, 
						icon: customPin, // $rootScope.baseURL_IMG+"img/MapPin.png",
						data : $scope.listeEtapes[i],
						id: $scope.listeEtapes[i].id,
						idSelection: $scope.listeEtapes[i].idSelection,
						liName: "li-"+i
					});
		        	var lat = $scope.listeEtapes[i].localisation.geolocalisation.geoJson.coordinates[1];
		        	var lng = $scope.listeEtapes[i].localisation.geolocalisation.geoJson.coordinates[0];
		        	var loc = new google.maps.LatLng(lat, lng);

		       	 	marker.setPosition(loc);
		        	marker.setMap($rootScope.map);

		        	$scope.allCatMarkers.push(marker);

					google.maps.event.addListener(marker, 'click', (function(marker, i) {
						return function() {
							$rootScope.goToFiche(marker.data.id);
							$rootScope.$apply();
						}
					})(marker, i));

					

		        	latlngbounds.extend(loc);
				}
			}
			$scope.markerCluster = new MarkerClusterer($scope.map, $scope.allCatMarkers);

			if( $rootScope.currentLatitude != null && $rootScope.currentLongitude != null ){
				
				var path = "M 10.24,224A245.76,245.76 180 1 1 501.76,224A245.76,245.76 180 1 1 10.24,224z";
				var marker = new google.maps.Marker(
				{ 
					title: 'Ma position',
					icon: {
				    	path: path,
					    fillColor: '#4285f4',
					    fillOpacity: 0.9,
					    scale: 0.03,
					    strokeColor: '#FFFFFF',
					    strokeWeight: 1,
					    strokeOpacity: 1
				    }
				});

				var loc = new google.maps.LatLng($rootScope.currentLatitude, $rootScope.currentLongitude);
				marker.setPosition(loc);
				marker.setMap($rootScope.map);

				//latlngbounds.extend(loc);
			}

			$rootScope.map.setCenter(latlngbounds.getCenter());
			$rootScope.map.fitBounds(latlngbounds); 

		}		
	}

	$scope.centerToLocation = function(){
		if( $rootScope.currentLatitude != null && $rootScope.currentLongitude != null ){
			var loc = new google.maps.LatLng($rootScope.currentLatitude, $rootScope.currentLongitude);
			$rootScope.map.setCenter(loc);
			$rootScope.map.setZoom(14);
		}
	}

	$scope.setupLoader = function(){
		
		var cl = new CanvasLoader('canvasLoader');
		cl.setColor('#ffffff'); // default is '#000000'
		cl.setShape('spiral'); // default is 'oval'
		cl.setDensity(16); // default is 40
		cl.setRange(1.5); // default is 1.3
		cl.setSpeed(1); // default is 2
		cl.setFPS(20); // default is 24
		cl.show(); // Hidden by default
		
	}


	// Init page 



	// Sinon requete sitra :	

	var selectionIds = "";
	$rootScope.selectionsDatas = new Array();
	$rootScope.typeSelection = new Array();
	for( var i=0 ; i< $rootScope.themes.length ; i++ )
	{
		if( $rootScope.themes[i].in_all_etapes == true ){
			selectionIds += $rootScope.themes[i].selection_id+",";
			datas = new Object();
			datas.selection_id = $rootScope.themes[i].selection_id;
			datas.color = $rootScope.themes[i].category_color;
			datas.name = $rootScope.themes[i].category_short_name;
			datas.slug = $rootScope.themes[i].category_slug;
			datas.selected = true;
			$rootScope.selectionsDatas[datas.selection_id] = datas;
			$rootScope.typeSelection.push(datas);
		}
	}
	selectionIds = selectionIds.substring(0, selectionIds.length-1);

    var url = baseURLWordpress+'/sitra/requeteSitraMultiSelection.php?selectionIds='+selectionIds;

	$rootScope.$on('mapInitialized', function(event, map) {
		
		$rootScope.map = map; 
		//var search = $location.search();
		//if( search != null && search.c != null && search.c == "all" )
		$scope.setupMap($rootScope.map);
	});
	

	$timeout( function(){

		if( $rootScope.allEtapesForMap == null ){

			$http.get(url).success(function(response){

				var etapes = new Array();
				for( var i=0 ; i<response.response.length ; i++ ){

					for( var j=0 ; j<response.response[i].objetsTouristiques.length ; j++ )
					{
						response.response[i].objetsTouristiques[j].idSelection = response.response[i].query.selectionIds[0];
						etapes.push( response.response[i].objetsTouristiques[j] );
					}
				}

				$scope.listeEtapes = $rootScope.randomizeArray(etapes);
				$rootScope.allEtapesForMap = $scope.listeEtapes;

				$scope.setupMap($rootScope.map);
			});

		}
		else{
			$scope.listeEtapes = $rootScope.allEtapesForMap;
			$scope.setupMap($rootScope.map);
		}
		
	
	} , 500 );

	
}