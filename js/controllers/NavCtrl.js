
/* Navigation Controller */

var appControllers = angular.module('appControllers', []);

appControllers.controller('NavCtrl', NavCtrl);

function NavCtrl($scope, $rootScope, $location, $resource)
{

    $rootScope.goToPage = function(page){
        
        $rootScope.isOnline = navigator.onLine ;

        if( page == "application-mobile" ){
            // Evite de faire un controller pour la page app mobile
            $rootScope.pageName = "application-mobile";
            $rootScope.pageTitle1 = "Application mobile";
        }

        if( $rootScope.isOnline == false && page != "home/themes" ){
            $location.path('connexion-problem');
            return;
        }
        $location.path(page);
    }

    $scope.switchLanguage = function(){
        if( $rootScope.lang == "en" ){
            document.location = "index.html?l=fr";
        } 
        else{
            document.location = "index.html?l=en";
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