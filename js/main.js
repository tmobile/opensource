function navigateTo(url, name) {
    name = name || "";
    window.open(url, name);
}

function openPageInModal(href) {
    var jqOverlay;
    $('body').addClass('overflowH');
    jqOverlay = $('#overlay-container-services');
    jqOverlay.removeClass('display-none');
}

function openVideoModal(title, url) {
    $('#videoModalTitle').text(title);
    $("#videoModalSrc").attr("src", url);
    $('#videoModal').on('hidden.bs.modal', function () {
        $("#videoModalSrc").attr("src", "");
    });
}

function openVideoFromPlaylist(event) {
    openVideoModal(event.target.attributes['video-title'].nodeValue,
        event.target.attributes['video-url'].nodeValue);
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
