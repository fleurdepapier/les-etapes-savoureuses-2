
/* Navigation Controller */

var appControllers = angular.module('appControllers', []);

appControllers.controller('AProposCtrl', AProposCtrl);

function AProposCtrl($scope, $rootScope, $routeParams, $resource, $timeout)
{

    $rootScope.aproposPage = $routeParams.page;
	$scope.pageName = 'apropos';


	var page = $rootScope.aproposPage.split('-');
	var idPage = page[page.length-1];

	
	// On attend un peu pour laisser la transition le plus fluide 
	$timeout( function(){

		var WPAPI = $resource(baseURLWordpress+'?wpapi=get_posts&dev=1&type=page&id='+idPage, null, {'query' : {method:'GET', params:{isArray:false}} });
		WPAPI.query( null, function(datas){
			
			$scope.pageTitle1 = datas.posts[0].title_plain;
			$scope.contentPage = datas.posts[0].custom_fields.blocs;
		});
		
	} , 1000 );
	

}