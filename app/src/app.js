(function (angular) {

  function appDirective() {
    const BASE_URL = '/public/views';

    return {
      restrict: 'E',
      replace: true,
      templateUrl: BASE_URL + '/app.html'
    }
  }

  function appController($scope) {

    $scope.cards = mockCards;
  }

  var app = angular.module('app', ['dragDrop']);
  app.controller('appController', ['$scope', appController]);
  app.directive('app', appDirective);

})(angular);
