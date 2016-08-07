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
        var data;
        var node;
        var card;
        var getCard;
        var template;
        var x, y;

        if (ioEvent.stopPropagation) {
          ioEvent.stopPropagation();
        }

        this.classList.remove('drag-drop-over');

        data = JSON.parse(ioEvent.dataTransfer.getData('application/json'));

        if (!data.cloned) {
          node = ioParentController.getClonedNode(data.clonedIndex).node;
        } else {
          node = ioParentController.getClonedNode(data.clonedIndex).node[0];
        }

        x = (ioEvent.pageX - (node.clientWidth / 2).toFixed(0)) + 'px';
        y = (ioEvent.pageY - (node.clientHeight / 2).toFixed(0)) + 'px';

        if (!data.cloned) {
          getCard = ioScope.getCard();
          card = getCard(data.cardIndex);

          template = '<div class="cards-container-card" cloned="true" draggable index="' + data.clonedIndex + '">'
                  +   card.text
                  + '</div>'

          node = angular.element(template);
          ioElement.append(node);
          $compile(node)(ioScope);

          node[0].style['left'] = x;
          node[0].style['top'] = y;
          node[0].style['position'] = 'absolute';

          ioParentController.setClonedNode(data.clonedIndex, node);
        } else {
          node.style['left'] = x;
          node.style['top'] = y;
        }

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
        getCard: '&'
      },
      require: '^dragDropControl',
      link: droppableLink
    };
  }

  var app = angular.module('droppable', []);
  app.directive('droppable', ['$compile', droppableDirective]);

})(angular);
