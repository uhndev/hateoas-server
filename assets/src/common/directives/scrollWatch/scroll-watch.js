/**
 * @name scroll-watch
 * @description Attribute-bound directive that watches the scroll levels for a given element and fires
 *              certain functions based on thresholds.  Used as part of the infinite scrolling capabilities
 *              of the survey-builder's timeline view.
 *
 * @example
 * <div class="timeline-container"
 *      scroll-watch
 *      onscrolldown="surveyBuilder.loadNext()"
 *      onscrollup="surveyBuilder.loadPrev()"
 *      onscrolltop="surveyBuilder.hideLimit = 0">
 */

(function() {
  'use strict';

  angular
    .module('dados.common.directives.scrollWatch', [])
    .directive('scrollWatch', scrollWatch);

  function scrollWatch() {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var raw = element[0];
        var scrollingDown = true;
        var lastScrollTop = 0;
        var upScrollThreshold = 1.5; // threshold where onscrollup should fire

        element.bind('scroll', function () {
          var scrollTop = raw.scrollTop + raw.offsetHeight;
          scrollingDown = (scrollTop > lastScrollTop);
          lastScrollTop = scrollTop;

          if (scrollingDown) {
            if (scrollTop >= raw.scrollHeight) { // reached bottom, fire onscrolldown
              scope.$apply(attrs.onscrolldown);
            }
          } else {
            if (scrollTop <= raw.offsetHeight) { // reached top, fire onscrolltop
              scope.$apply(attrs.onscrolltop);
            }

            if (scrollTop <= Math.floor(raw.scrollHeight / upScrollThreshold)) { // reached relative middle
              scope.$apply(attrs.onscrollup);
            }
          }
        });
      }
    };
  }
})();
