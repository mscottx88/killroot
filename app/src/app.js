(function (angular) {

  function appDirective() {
    const BASE_URL = '/public/views';

    return {
      restrict: 'E',
      replace: true,
      templateUrl: BASE_URL + '/app.html',
      controller: ['$scope', appController]
    }
  }

  function appController($scope) {
    function addNewClonedNode(ioData) {
      var data;
       
      data = {
        text: $scope.cards[ioData.fromIndex].text,
        fromIndex: ioData.fromIndex,
        height: ioData.height,
        width: ioData.width,
        left: 0,
        top: 0,
        visible: false
      };

      $scope.clonedNodes.push(data);

      return $scope.clonedNodes.length - 1;
    }

    function getClonedNode(ioIndex) {
      return $scope.clonedNodes[ioIndex];
    }

    function setClonedNode(ioIndex, ioData) {
      $scope.clonedNodes[ioIndex].left = ioData.left;
      $scope.clonedNodes[ioIndex].top = ioData.top;
      $scope.clonedNodes[ioIndex].visible = ioData.visible;

      rebuildProgramText();
      $scope.$applyAsync();
    }

    function removeClonedNode(ioIndex) {
      $scope.clonedNodes.splice(ioIndex, 1);

      rebuildProgramText();
      $scope.$applyAsync();
    }

    function clearProgramText() {
      $scope.programText = '';
    }

    function rebuildProgramText() {
      function comparator(a, b) {
        if (a.left < b.left) {
          return -1;
        } else if (a.left > b.left) {
          return +1;
        } else {
          if (a.top < b.top) {
            return -1;
          } else if (a.top > b.top) {
            return +1;
          } else {
            return 0;
          }
        }
      }
      
      $scope.clonedNodes.sort(comparator);

      clearProgramText();
      for (var index = 0; index < $scope.clonedNodes.length; index++) {
        if (index > 0) {
          $scope.programText += ' ';
        }
        $scope.programText += $scope.clonedNodes[index].text;
      }
    }

    $scope.clonedNodes = [];
    $scope.cards = mockCards;

    this.addNewClonedNode = addNewClonedNode.bind(this);
    this.getClonedNode = getClonedNode.bind(this);
    this.setClonedNode = setClonedNode.bind(this);
    this.removeClonedNode = removeClonedNode.bind(this);
  }

  var app = angular.module('app', ['draggable', 'droppable']);
  app.controller('appController', ['$scope', appController]);
  app.directive('app', appDirective);

})(angular);
