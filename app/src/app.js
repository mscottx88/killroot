(function (angular) {

  function appDirective() {
    const BASE_URL = '/public/views';

    return {
      restrict: 'E',
      replace: false,
      templateUrl: BASE_URL + '/app.html'
    }
  }

  function appCtrl($scope) {
  }

  var app = angular.module('app', []);
  app.controller('appCtrl', ['$scope', appCtrl]);
  app.directive('app', appDirective);

})(angular);
