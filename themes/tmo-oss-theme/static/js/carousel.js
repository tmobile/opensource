$(document).ready(function () {
  var owl = $('.owl-carousel');

  owl.owlCarousel({
    items: 5, // THIS IS IMPORTANT
    dotsEach: true,
    loop: false,
    responsive: {
      0: {
        items: 1
      },
      480: {
        items: 1
      }, // from zero to 480 screen width 4 items
      768: {
        items: 2
      }, // from 480 screen widthto 768 6 items
      1024: {
        items: 4 // from 768 screen width to 1024 8 items
      }
    },
  });


  owl.owlCarousel();
  // Go to the next item
  $('.customNextBtn').click(function () {
    owl.trigger('next.owl.carousel');
  });
  // Go to the previous item
  $('.customPrevBtn').click(function () {
    // With optional speed parameter
    // Parameters has to be in square bracket '[]'
    owl.trigger('prev.owl.carousel', [300]);
  });
});
