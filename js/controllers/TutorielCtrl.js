
/* Tutoriel Controller */

var appControllers = angular.module('appControllers', []);

appControllers.controller('TutorielCtrl', TutorielCtrl);

function TutorielCtrl($scope, $rootScope, $location, $resource, $timeout)
{
	$rootScope.pageClass = "tutoriel-page";
	$rootScope.firstBuild = 'tutoriel';
	$scope.currentSlide = 0;
	$scope.slideAnim = 'swipe-left';
	$scope.nbSlides = 0;
	$scope.tutoHeight = false;

	
	if( $rootScope.isOnline == true ){
		var WPAPI = $resource(baseURLWordpress+'?wpapi=get_posts&dev=1&type=page&id=7', null, {'query' : {method:'GET', params:{isArray:false}} });
		WPAPI.query( null, function(datas){
			$scope.dataPage = datas.posts[0].custom_fields;
			$scope.nbSlides = $scope.dataPage.slide_home.length - 1;
			//console.log($scope.dataPage);
			$rootScope.$storage.tutoriel = $scope.dataPage;

			$scope.setTutoHeight();
		});
	}

	else if( $rootScope.isOnline == false && $rootScope.$storage.tutoriel != null ){
		$scope.dataPage = $rootScope.$storage.tutoriel;
		$scope.nbSlides = $scope.dataPage.slide_home.length - 1;
	}
	else if( $rootScope.isOnline == false && $rootScope.$storage.tutoriel == null ){
		$location.path('/home/themes');
	}

	$scope.prevSlide = function() {
		//$scope.slideAnim = 'swipe-left';
		if( $scope.currentSlide > 0 )
			$scope.currentSlide--;
    };

    $scope.nextSlide = function() {
		//$scope.slideAnim = 'swipe-right';
		if( $scope.currentSlide < $scope.nbSlides )
			$scope.currentSlide++;
    };

    $scope.go = function ( path ) {
		$location.path( path );
	};

	$scope.setTutoHeight = function(){
		$timeout( function(){
			$("#tuto-content .block-slide").each(function(){
				//console.log($(this).height());
				var height = -Math.round( $(this).height() *.5)-50;
				$(this).css("margin-top", height+"px");
			});
			$scope.tutoHeight = true;
		} , 100 );
	};

}