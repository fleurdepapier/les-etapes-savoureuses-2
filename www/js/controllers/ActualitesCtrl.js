
/* Navigation Controller */

var appControllers = angular.module('appControllers', []);

appControllers.controller('ActualitesCtrl', ActualitesCtrl);

function ActualitesCtrl($scope, $rootScope, $resource, $timeout, $location)
{

    $rootScope.pageName = 'actualites';
	$scope.pageTitle1 = "Actualités";

	// On attend un peu pour laisser la transition le plus fluide 
	if( $rootScope.actu == null ){
			$timeout( function(){

			var WPAPI = $resource(baseURLWordpress+'?wpapi=get_posts&dev=1&&type=post&content=1', null, {'query' : {method:'GET', params:{isArray:false}} });
			WPAPI.query( null, function(datas){
				$rootScope.actus = datas.posts;
			});
			
		} , 1000 );
	}
	

	$scope.formatDate = function(actu)
	{
		var date = actu.date.split(" ");
		date = date[0].split('-');

		actu.formatedDate = date[2]+"/"+date[1]+"/"+date[0];

	}

	$scope.getImageURL = function(image)
	{
		return baseURLWordpress+"wp-content/uploads/sites/2/"+image;
	}

	$scope.goToActu = function(link)
	{
		console.log(link);
		$location.path(link);
	}
}