function navigateTo(url, name) {
  name = name ||"";
  window.open(url, name);
}

function openPageInModal(href) {
  var jqOverlay;

  $('body').addClass('overflowH');
  jqOverlay = $('#overlay-container-services');
  jqOverlay.removeClass('display-none');

  jqOverlay.find('.event-container').load(href, function () {
    // On load, move first found H1 to modal title
    var jqTitle = jqOverlay.find('.event-container h1:first').remove();
    jqOverlay.find('.success-header').html(jqTitle.html());
  });
}

$(document).on("click", ".animated-scroll", function (e) {
  if (window.location.pathname === '/') {
    e.preventDefault();
    var id = $(this).attr("href"),
      topSpace = 30;
  
    $('html, body').animate({
      scrollTop: $(id).offset().top - topSpace
    }, 800);
  } else {
    window.location = `/${$(this).attr("href")}`
  }
});
