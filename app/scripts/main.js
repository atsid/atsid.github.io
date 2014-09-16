(function () {
  'use strict';

  /*
   * Smooth scroll to sections with an offset
   */
  $('a.scroll').on('click', function (e) {
    e.preventDefault();
    $(document.body).animate({
      scrollTop: $($(this).attr('href')).offset().top - 85
    }, 250);
    return false;
  });

  /*
   * Toggles the nav.sticky class based on scrollTop
   */
  var lastScrollPos = 0;
  var adjustNav = function (scrollPos) {
    if (scrollPos > 100 && lastScrollPos < scrollPos) {
      $('nav').addClass('sticky');
    } else if (scrollPos <= 100 && lastScrollPos > scrollPos) {
      $('nav').removeClass('sticky');
    }
    lastScrollPos = scrollPos;
  };

  /*
   * Adds a 1/2 parallax effect to the hero bg
   */
  var hero = $('.hero');
// var adjustHeroParallax = function (scrollPos) {
//   if (scrollPos < hero[0].offsetHeight) {
//     hero.css('backgroundPosition', '50% ' + (scrollPos/2 - 75) + 'px');
//   }
// };


  // scroll listener
  $(document).on('scroll', function () {
    var scrollTop = $(document).scrollTop();
    adjustNav(scrollTop);
    //adjustHeroParallax(scrollTop);
  });


  /*
   * Cycles hero subtitle text
   */
  var titles = ['beautiful experiences.', 'intuitive interfaces.', 'clean APIs.', 'scalable architectures.', 'productive software.'];
  var idx = 0;
  var swapEl = $('.swap');
  var stagingEl = $('<strong style="top: 25px; opacity: 0;" class="swap"></strong>');
  setInterval(function () {
    if ($(document).scrollTop() <= hero[0].offsetHeight) {
      idx = ++idx % titles.length;
      var t = titles[idx];
      stagingEl.css({top: '25px', opacity: 0});
      swapEl.animate({opacity: 0, top: '-25px'}, 200, function () {
        stagingEl.text(t);
        stagingEl.insertAfter(swapEl);
        swapEl.remove();
        var tmp = swapEl;
        swapEl = stagingEl;
        stagingEl = tmp;
        swapEl.animate({opacity: 1, top: '0px'}, 200);
      });
    }
  }, 2000);

})();
