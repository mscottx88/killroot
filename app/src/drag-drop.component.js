(function(angular) {
  'use strict';

  function dragDropControlDirective() {
    return {
      restrict: 'A',
      scope: {
        columnDescriptors: '='
      },
      controller: ['$scope', dragDropControlController]
    };
  }

  function dragDropControlController($scope) {
    function dragOver(ioData) {
      var leftToRight;

      // ignore this event if the controller is not in a dragging state
      if (!this.dragging) {
        return;
      }

      // ignore this event if the drag over element is the drag element, or if the
      // cursor has not moved relative to the start of the drag
      if (ioData.index === $scope.dragStart.index || ioData.x === $scope.dragStart.x) {
        return;
      }

      // wait until the cursor is going to be over the newly dropped column area
      // to make this possible, based on the direction, delay the drop until the cursor
      // passes over the threshold

      // dragging from right to left
      if (ioData.x < $scope.dragStart.x) {
        // when dragging from right to left, the cursor must be at the "new" right - that is
        // the position where the dropped column will appear in its new position (right side)
        if (ioData.x > ioData.left + $scope.dragStart.width) {
          return;
        }

        leftToRight = false;

        // dragging from left to right
      } else {
        // when dragging from left to right, the cursor must be at the "new" left - that is
        // the position where the dropped column will appear in its new position (left side)
        if (ioData.x < $scope.dragStart.left + ioData.width) {
          return;
        }

        leftToRight = true;
      }

      // add the "from" element to the to index
      $scope.columnDescriptors.splice(ioData.index, 0, ($scope.columnDescriptors.splice($scope.dragStart.index, 1))[0]);

      // reset the drag start
      dragStart.call(this, ioData, leftToRight);

      // update
      $scope.$applyAsync();
    }

    function dragStart(ioData, ioLeftToRight) {
      var saveLeft;
      var saveWidth;

      // before changing the start values, remember these
      if (typeof ioLeftToRight !== 'undefined') {
        saveLeft = $scope.dragStart.left;
        saveWidth = $scope.dragStart.width;
      }

      $scope.dragStart = ioData;
      this.dragging = true;

      // now, adjust mid-drag the new drag start position
      if (typeof ioLeftToRight !== 'undefined') {
        if (ioLeftToRight) {
          $scope.dragStart.left = saveLeft + ioData.width;
        } else {
          $scope.dragStart.left = ioData.left;
        }
        $scope.dragStart.width = saveWidth;
      }
    }

    function dragEnd() {
      this.dragging = false;
    }

    // assign functions & attributes accessible by the child directive
    this.dragging = null;
    this.dragStart = dragStart.bind(this);
    this.dragOver = dragOver.bind(this);
    this.dragEnd = dragEnd.bind(this);
  }

  function dragDropDirective() {
    function dragDropLink(ioScope, ioElement, ioAttributes, ioParentController) {

      const TEMPORARY_DRAG_IMAGE_ID = 'temporary-drag-image';

      function dragStart(ioEvent) {
        const MAX_WIDTH_PIXELS = 300;

        var height;
        var width;
        var scale;
        var rect;
        var image = {};

        ioEvent.dataTransfer.effectAllowed = 'move';
        ioEvent.dataTransfer.setData('application/json', JSON.stringify(ioAttributes.value.index));

        image = this.cloneNode(true);

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
        image.style.backgroundColor = 'grey';
        image.style.opacity = '0.5';

        document.body.appendChild(image);

        // center the drag image under the cursor
        ioEvent.dataTransfer.setDragImage(image, width / 2, height / 2);

        this.classList.add('drag-drop-drag');

        rect = this.getClientRects()[0];

        ioParentController.dragStart({
          index: ioAttributes.value.index,
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
        image.parentNode.removeChild(image);

        ioParentController.dragEnd();

        return false;
      }

      function dragOver(ioEvent) {
        var rect;

        if (ioEvent.preventDefault) {
          ioEvent.preventDefault();
        }
        if (ioEvent.stopPropagation) {
          ioEvent.stopPropagation();
        }
        if (!ioParentController.dragging) {
          return false;
        }

        this.classList.add('drag-drop-over');
        ioEvent.dataTransfer.dropEffect = 'move';

        rect = this.getClientRects()[0];

        ioParentController.dragOver({
          index: ioAttributes.value.index,
          x: ioEvent.x,
          left: rect.left,
          width: rect.width
        });

        return false;
      }

      function dragEnter(ioEvent) {
        if (ioEvent.preventDefault) {
          ioEvent.preventDefault();
        }
        if (ioEvent.stopPropagation) {
          ioEvent.stopPropagation();
        }
        if (!ioParentController.dragging) {
          return false;
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

        return false;
      }

      // ensure the element is "draggable", per HTML5 specification
      ioElement[0].draggable = true;

      // attach event listeners to respond to activity in the page
      ioElement[0].addEventListener('dragstart', dragStart, false);
      ioElement[0].addEventListener('dragend', dragEnd, false);
      ioElement[0].addEventListener('dragover', dragOver, false);
      ioElement[0].addEventListener('dragenter', dragEnter, false);
      ioElement[0].addEventListener('dragleave', dragLeave, false);
      ioElement[0].addEventListener('drop', drop, false);

      return {
        link: dragDropLink
      };
    }

    return {
      restrict: 'A',
      require: '^dragDropControl',
      link: dragDropLink
    };
  }

  var app = angular.module('dragDrop', []);
  app.directive('dragDropControl', [dragDropControlDirective]);
  app.directive('dragDrop', [dragDropDirective]);

})(angular);
