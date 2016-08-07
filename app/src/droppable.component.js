(function(angular) {
  'use strict';

  function droppableDirective() {
    function droppableLink(ioScope, ioElement, ioAttributes, ioParentController) {
      function dragOver(ioEvent) {
        if (ioEvent.preventDefault) {
          ioEvent.preventDefault();
        }
        if (ioEvent.stopPropagation) {
          ioEvent.stopPropagation();
        }

        this.classList.add('drag-drop-over');
        ioEvent.dataTransfer.dropEffect = 'move';

        return false;
      }

      function dragEnter(ioEvent) {
        if (ioEvent.preventDefault) {
          ioEvent.preventDefault();
        }
        if (ioEvent.stopPropagation) {
          ioEvent.stopPropagation();
        }

        this.classList.add('drag-drop-over');

        return false;
      }

      function dragLeave(ioEvent) {
        this.classList.remove('drag-drop-over');

        return false;
      }

      function drop(ioEvent) {
        var data;
        var node;

        if (ioEvent.stopPropagation) {
          ioEvent.stopPropagation();
        }

        this.classList.remove('drag-drop-over');

        data = JSON.parse(ioEvent.dataTransfer.getData('application/json'));
        node = ioParentController.getClonedNode(data.clonedIndex).node;

        node.id = '';
        node.style['left'] = ioEvent.pageX.toString() + 'px';
        node.style['top'] = ioEvent.pageY.toString() + 'px';
        node.style['position'] = 'absolute';

        document.body.appendChild(node);

        return false;
      }

      // attach event listeners to respond to activity in the page
      ioElement[0].addEventListener('dragover', dragOver, false);
      ioElement[0].addEventListener('dragenter', dragEnter, false);
      ioElement[0].addEventListener('dragleave', dragLeave, false);
      ioElement[0].addEventListener('drop', drop, false);

      return {
        link: droppableLink
      };
    }

    return {
      restrict: 'A',
      scope: {
        index: '='
      },
      require: '^dragDropControl',
      link: droppableLink
    };
  }

  var app = angular.module('droppable', []);
  app.directive('droppable', [droppableDirective]);

})(angular);
