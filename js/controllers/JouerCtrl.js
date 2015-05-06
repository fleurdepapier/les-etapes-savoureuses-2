
/* Jouer Controller */

var appControllers = angular.module('appControllers', []);

appControllers.controller('JouerCtrl', JouerCtrl);

function JouerCtrl($scope, $rootScope, $routeParams, $resource, $http, $timeout)
{
	$scope.pageName = 'jouer';
	$scope.pageTitle1 = "Jouer";
	$scope.displayInfo = false;
	$scope.displayReglement = false;
	$scope.message = '';
	$scope.formSend = false;

	$timeout( function(){
	
		if( $rootScope.isOnline == true ){


			var WPAPI = $resource(baseURLWordpress+'?wpapi=get_posts&dev=1&type=page&id=11', null, {'query' : {method:'GET', params:{isArray:false}} });
			WPAPI.query( null, function(datas){
				//console.log( datas);
				$scope.dataPage = datas.posts[0].custom_fields;

				if( $scope.dataPage.id_form != "0" && $scope.dataPage.id_form != "" ){
					var url = baseURLWordpress+"/formulaire-generateur/?id_form="+$scope.dataPage.id_form;
					$http.get(url).success(function(response){
						$scope.form = response;
					});
				}
				else{
					$scope.formSend = true; 
				}
			});
		}
		else{
			$scope.message = 'Vous devez être connecté à internet pour pouvoir jouez.';
		}
	} , 500 );

	$scope.toggleInfo = function(){
		if( $scope.displayInfo )
			$scope.displayInfo = false;
		else 
			$scope.displayInfo = true;
	}

	$scope.toggleReglement = function(){
		if( $scope.displayReglement )
			$scope.displayReglement = false;
		else 
			$scope.displayReglement = true;
	}

	$scope.submitForm = function(){
		//console.log("SUBMIT !! ");

 		var data = $("form").serialize();
		var url = baseURLWordpress+"/formulaire-generateur/?id_form=1";
		/*$http.post(url, data).success(function(response){
			//console.log(response);
		})*/
		
		$.post( url, data , function( data ) {

			if( $(data).find('.validation_error').length > 0 ){
				$scope.message = 'Erreur : le formulaire ne semble pas correctement rempli.';
			}
			else{
				$scope.message = 'Félicitations, votre participation a bien été enregistrée';
				$scope.formSend = true; 
			}
			$scope.$apply();
		  	//alert( "Data Loaded: " + data );
		}).fail(function() {
			$scope.message = 'Une erreur s\'est produite. Veuillez vérifier votre connexion internet et reessayer utiltérieurement.';
		});
	}
}