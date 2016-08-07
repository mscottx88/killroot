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
    function getCard(ioIndex) {
      return $scope.cards[ioIndex];
    }

    $scope.cards = mockCards;
    $scope.getCard = getCard;
  }

  var app = angular.module('app', ['dragDropControl', 'draggable', 'droppable']);
  app.controller('appController', ['$scope', appController]);
  app.directive('app', appDirective);

})(angular);
