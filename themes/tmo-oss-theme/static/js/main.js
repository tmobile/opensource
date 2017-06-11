function navigateTo(url){
    window.location.href = url;
}

function openPageInModal(href) {
    $('body').addClass('overflowH');
    $('#overlay-container-services').removeClass('display-none');
    $('#overlay-container-services').find('.event-container').load(href);
}

$(document).on("click", ".animated-scroll", function(e) {
    e.preventDefault();
    var id = $(this).attr("href"),
    topSpace = 30;
        
    $('html, body').animate({
          scrollTop: $(id).offset().top - topSpace
    }, 800);
});

