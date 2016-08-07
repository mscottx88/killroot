(function(angular) {
  'use strict';

  function draggableDirective() {
    function draggableLink(ioScope, ioElement, ioAttributes, ioParentController) {

      const TEMPORARY_DRAG_IMAGE_ID = 'temporary-drag-image'; 

      function dragStart(ioEvent) {
        const MAX_WIDTH_PIXELS = 300;

        var height;
        var width;
        var scale;
        var rect;
        var index;
        var data;
        var image = {};

        image = this.cloneNode(true);

        if (!ioScope.cloned) {
          index = ioParentController.addNewClonedNode(image);
          data = {
            cardIndex: ioScope.index,
            clonedIndex: index,
            cloned: false
          };
        } else {
          data = {
            cardIndex: ioScope.index,
            clonedIndex: ioScope.index,
            cloned: true
          };
        }

        ioEvent.dataTransfer.effectAllowed = 'move';
        ioEvent.dataTransfer.setData('application/json', JSON.stringify(data));

        image.id = TEMPORARY_DRAG_IMAGE_ID;
        image.style.position = 'absolute';

        // because the native HTML Drag&Drop API likes to gradient-effect any element wider than 300px,
        // let's scale it 
        height = this.clientHeight;
        width = this.clientWidth;

        // if the width is greater than the max, scale the height accordingly (maintain aspect-ratio)
        if (width > MAX_WIDTH_PIXELS) {
          scale = width / MAX_WIDTH_PIXELS;
          width = MAX_WIDTH_PIXELS;
          height *= (1 / scale);
        }

        image.style.width = width.toString() + 'px';
        image.style.height = height.toString() + 'px';
        image.style.top = -height.toString() + 'px';

        document.body.appendChild(image);

        // center the drag image under the cursor
        ioEvent.dataTransfer.setDragImage(image, width / 2, height / 2);

        this.classList.add('drag-drop-drag');

        rect = this.getClientRects()[0];

        ioParentController.dragStart({
          index: ioScope.index,
          x: ioEvent.x,
          left: rect.left,
          width: rect.width
        });

        return false;
      }

      function dragEnd(ioEvent) {
        var image;

        this.classList.remove('drag-drop-drag');

        image = document.getElementById(TEMPORARY_DRAG_IMAGE_ID);
        if (image) {
          image.parentNode.removeChild(image);
        }

        ioParentController.dragEnd();

        return false;
      }

      // ensure the element is "draggable", per HTML5 specification
      ioElement[0].draggable = true;

      // attach event listeners to respond to activity in the page
      ioElement[0].addEventListener('dragstart', dragStart, false);
      ioElement[0].addEventListener('dragend', dragEnd, false);

      return {
        link: draggableLink
      };
    }

    return {
      restrict: 'A',
      scope: {
        index: '=',
        cloned: '='
      },
      require: '^dragDropControl',
      link: draggableLink
    };
  }

  var app = angular.module('draggable', []);
  app.directive('draggable', [draggableDirective]);

})(angular);
