(function(angular) {
  'use strict';

  function droppableDirective($compile) {
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
        if (ioEvent.stopPropagation) {
          ioEvent.stopPropagation();
        }

        this.classList.remove('drag-drop-over');

        ioParentController.onCardDropped(ioEvent, this.id, JSON.parse(ioEvent.dataTransfer.getData('application/json')));

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
      scope: {},
      require: '^app',
      link: droppableLink
    };
  }

  var app = angular.module('droppable', []);
  app.directive('droppable', ['$compile', droppableDirective]);

})(angular);
