
/* Navigation Controller */

var appControllers = angular.module('appControllers', []);

appControllers.controller('ActualiteSingleCtrl', ActualiteSingleCtrl);

function ActualiteSingleCtrl($scope, $routeParams, $rootScope, $resource, $timeout)
{

	$scope.headerRetourHref = "#/actualites";
    $rootScope.pageName = 'actualites';
	$scope.headerRetourTitle = "Actualités";

	var actu = $routeParams.idActu.split('-');
	var idActu = actu[actu.length-1];

	$scope.dataLoaded = false;

	// On attend un peu pour laisser la transition le plus fluide 
	$timeout( function(){

		var WPAPI = $resource(baseURLWordpress+'?wpapi=get_posts&dev=1&&type=post&content=1&id='+idActu, null, {'query' : {method:'GET', params:{isArray:false}} });
		WPAPI.query( null, function(datas){
			
			$scope.actu = datas.posts[0];

			var date = $scope.actu.date.split(" ");
			date = date[0].split('-');

			$scope.actu.formatedDate = date[2]+"/"+date[1]+"/"+date[0];
			$scope.dataLoaded = true;
		});
		
	} , 1000 );
	


	$scope.getImageURL = function(image)
	{
		return baseURLWordpress+"wp-content/uploads/sites/2/"+image;
	}
}