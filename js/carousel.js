$(document).ready(function () {
  var owl = $('#about .owl-carousel');

  owl.owlCarousel({
    items: 5, // THIS IS IMPORTANT
    dots: false,
    nav: true,
    loop: false,
    navText: [],
    responsive: {
      0: {
        items: 1
      },
      480: {
        items: 1
      }, 
      768: {
        items: 2
      }, 
      1024: {
        items: 3
      },
      1200: {
        items: 5
      }
    },
  });

  var carouselInit = function(event){
    $("#about .owl-nav .owl-prev").addClass("left carousel-control glyphicon glyphicon-chevron-left");
    $("#about .owl-nav .owl-next").addClass("right carousel-control glyphicon glyphicon-chevron-right");
  };

  owl.owlCarousel({
    onInitialized: carouselInit()
  });
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
