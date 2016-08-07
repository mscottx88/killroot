(function(angular) {
  'use strict';

  function dragDropControlDirective() {
    return {
      restrict: 'A',
      scope: {},
      controller: ['$scope', dragDropControlController]
    };
  }

  function dragDropControlController($scope) {
    function dragStart(ioData) {
      $scope.dragStart = ioData;
      this.dragging = true;
    }

    function dragEnd() {
      this.dragging = false;
    }

    function addNewClonedNode(ioNode) {
      this.clonedNodes.push({
        node: ioNode
      })
      return this.clonedNodes.length - 1;
    }

    function getClonedNode(ioIndex) {
      return this.clonedNodes[ioIndex];
    }

    function setClonedNode(ioIndex, ioNode) {
      this.clonedNodes[ioIndex] = {node: ioNode};
    }

    // assign functions & attributes accessible by the child directive
    this.dragging = null;
    this.dragStart = dragStart.bind(this);
    this.dragEnd = dragEnd.bind(this);

    this.clonedNodes = [];
    this.addNewClonedNode = addNewClonedNode.bind(this);
    this.getClonedNode = getClonedNode.bind(this);
    this.setClonedNode = setClonedNode.bind(this);
  }

  var app = angular.module('dragDropControl', []);
  app.directive('dragDropControl', [dragDropControlDirective]);

})(angular);
