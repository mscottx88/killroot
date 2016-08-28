(function (angular) {
  'use strict';

  angular
    .module('app', ['draggable', 'droppable'])
    .controller('appController', ['$scope', appController])
    .directive('app', appDirective);

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
    const NODE_ROW_PADDING_PERCENT = 0.25;

    function addNewClonedNode(ioData) {
      var data;

      data = {
        text: $scope.cards[ioData.fromIndex].text,
        fromIndex: ioData.fromIndex,
        height: ioData.height,
        width: ioData.width,
        left: 0,
        top: 0,
        visible: false,
        type: $scope.cards[ioData.fromIndex].type
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
    }

    function removeClonedNode(ioIndex) {
      $scope.clonedNodes.splice(ioIndex, 1);
    }

    function clearProgramText() {
      $scope.programTextLines = [];
    }

    function sortClonedNodes() {
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
    }

    function rebuildProgramText() {
      function buildProgramTextLine(ioRow) {
        var textLine = '';

        function appendNodeText(ioNode, ioIndex) {
          if (ioIndex > 0) {
            textLine += ' ';
          }
          textLine += ioNode.text;
        }

        ioRow.nodes.forEach(appendNodeText);
        $scope.programTextLines.push({ text: textLine });
      }

      clearProgramText();
      $scope.clonedNodeRows.forEach(buildProgramTextLine);

      $scope.$applyAsync();
    }

    function onCardDropped(ioEvent, ioId, ioData) {
      var node;
      var x;
      var y;

      if (ioId === 'module-drop-area-trash-can') {
        if (ioData.cloned) {
          this.removeClonedNode(ioData.clonedIndex);
        }
      } else {
        node = this.getClonedNode(ioData.clonedIndex);

        x = (ioEvent.pageX - Math.round(node.width / 2));
        y = (ioEvent.pageY - Math.round(node.height / 2));

        moveSiblingNodes(node, x, y);

        this.setClonedNode(ioData.clonedIndex, {
          left: x,
          top: y,
          visible: true
        });
      }

      rebuildClonedNodeRows();
      rebuildProgramText();
    }

    function moveSiblingNodes(ioSource, ioX, ioY) {
      var deltaX, deltaY;

      function moveRelative(ioNode, ioIndex) {
        if (ioIndex === 0) {
          return;
        }

        ioNode.left += deltaX;
        ioNode.top += deltaY;
      }

      if (typeof ioSource.ordinalIndex === 'undefined' || ioSource.ordinalIndex !== 0) {
        return;
      }

      deltaX = ioX - ioSource.left;
      deltaY = ioY - ioSource.top;

      $scope.clonedNodeRows[ioSource.rowIndex].nodes.forEach(moveRelative);
      $scope.clonedNodeRows[ioSource.rowIndex].left += deltaX;
      $scope.clonedNodeRows[ioSource.rowIndex].top += deltaY;
    }

    function isRectangleInRectangleVerticalRange(ioSource, ioTarget) {
      return !(ioSource.top + ioSource.height < ioTarget.top) && !(ioSource.top > ioTarget.top + ioTarget.height);
    }

    function extendBoundingRectangle(ioSource, ioTarget) {
      if (ioSource.left < ioTarget.left) {
        ioTarget.width += (ioTarget.left - ioSource.left);
        ioTarget.left = ioSource.left;
      }
      if (ioSource.top < ioTarget.top) {
        ioTarget.height += (ioTarget.top - ioSource.top);
        ioTarget.top = ioSource.top;
      }
      if (ioSource.left + ioSource.width > ioTarget.left + ioTarget.width) {
        ioTarget.width += ((ioSource.left + ioSource.width) - (ioTarget.left + ioTarget.width));
      }
      if (ioSource.top + ioSource.height > ioTarget.top + ioTarget.height) {
        ioTarget.height += ((ioSource.top + ioSource.height) - (ioTarget.top + ioTarget.height));
      }
    }

    function rebuildClonedNodeRows() {
      var rows = [];
      var row;

      function addNode(ioNode, ioIndex) {
        var index;

        function findOverlappingRow(ioRow) {
          if (isRectangleInRectangleVerticalRange(ioNode, ioRow)) {
            return true;
          }
        }

        index = rows.findIndex(findOverlappingRow);
        if (index === -1) {
          row = {
            left: ioNode.left,
            top: ioNode.top,
            height: ioNode.height,
            width: ioNode.width,
            visible: true,
            nodes: [$scope.clonedNodes[ioIndex]]
          }
          rows.push(row);
        } else {
          extendBoundingRectangle(ioNode, rows[index]);
          rows[index].nodes.push($scope.clonedNodes[ioIndex]);
        }
      }

      sortClonedNodes();
      $scope.clonedNodes.forEach(addNode);

      condenseClonedNodeRows(rows);
      sortClonedNodeRows(rows);
      assignClonedNodeRows(rows);

      $scope.clonedNodeRows = rows;
      $scope.$applyAsync();
    }

    function assignClonedNodeRows(ioRows) {
      function assignNodes(ioRow, ioIndex) {
        function assignRow(ioNode) {
          ioNode.rowIndex = ioIndex;
        }
        ioRow.nodes.forEach(assignRow);
      }
      ioRows.forEach(assignNodes);
    }

    function sortClonedNodeRows(ioRows) {
      function comparator(a, b) {
        if (a.top < b.top) {
          return -1;
        } else if (a.top > b.top) {
          return +1;
        } else {
          return 0;
        }
      }

      ioRows.sort(comparator);
    }

    function condenseClonedNodeRows(ioRows) {
      function condenseRow(ioRow) {
        var topNode, leftNode;
        var top, left;

        function findTopLeftNodes(ioNode) {
          if (ioNode.top < top || typeof top === 'undefined') {
            top = ioNode.top;
            topNode = ioNode;
          }
          if (ioNode.left < left || typeof left === 'undefined') {
            left = ioNode.left;
            leftNode = ioNode;
          }
        }

        function alignNode(ioNode, ioIndex) {
          if (ioNode.top !== top) {
            ioNode.top = top;
          }
          if (ioNode.left !== left) {
            ioNode.left = left + ((ioNode.width + (ioNode.width * NODE_ROW_PADDING_PERCENT)) * ioIndex);
          }
          ioNode.ordinalIndex = ioIndex;
        }

        ioRow.nodes.forEach(findTopLeftNodes);
        ioRow.nodes.forEach(alignNode);

        ioRow.height = topNode.height;
        ioRow.width = (leftNode.width * ioRow.nodes.length) + ((ioRow.nodes.length - 1) * leftNode.width * NODE_ROW_PADDING_PERCENT);
      }

      ioRows.forEach(condenseRow);
    }

    function onNodeDrag(ioEvent, ioIndex) {
      var node; 
      var x, y;

      node = this.getClonedNode(ioIndex);

      x = (ioEvent.pageX - Math.round(node.width / 2));
      y = (ioEvent.pageY - Math.round(node.height / 2));

      moveSiblingNodes(node, x, y);

      this.setClonedNode(ioIndex, {
        left: x,
        top: y,
        visible: true
      });

      $scope.$applyAsync();
    }

    $scope.clonedNodes = [];
    $scope.clonedNodeRows = [];
    $scope.cards = mockCards;

    this.addNewClonedNode = addNewClonedNode.bind(this);
    this.getClonedNode = getClonedNode.bind(this);
    this.setClonedNode = setClonedNode.bind(this);
    this.removeClonedNode = removeClonedNode.bind(this);
    this.onCardDropped = onCardDropped.bind(this);
    this.onNodeDrag = onNodeDrag.bind(this);
  }
})(angular);
