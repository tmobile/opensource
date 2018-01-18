$(document).on("click", ".project-a ", function(e) {
    e.preventDefault();
    var id = $(this).attr("href"),
        topSpace = 30;

    $('html, body').animate({

        scrollTop: $(id).offset().top - topSpace
    }, 800);

});

$(document).on("click", ".view-projects", function(e) {
    e.preventDefault();
    var id = $(this).attr("href"),
        topSpace = 30;

    $('html, body').animate({

        scrollTop: $(id).offset().top - topSpace
    }, 800);

});

$(document).on("click", ".overlay-state-wrp", function(e) {
    e.preventDefault();
    closePopup();

});



function openPopup() {
    $('body').addClass('overflow');
    $('#dots-overlay').addClass('display-none');
    $('#overlay-container-id').removeClass('display-none');  
}

function closePopup() {
    $('body').removeClass('overflowH');
    $('#overlay-container-id').addClass('display-none');
    $('#dots-overlay').removeClass('display-none');
}

function openModel() {
    $('body').addClass('overflowH');
    $('#overlay-container-services').removeClass('display-none');
}

function openModel2() {
    $('body').addClass('overflowH');
    $('#overlay-container-services-2').removeClass('display-none');
}

function closeModel() {
    $('body').removeClass('overflowH');
    $('#overlay-container-services').addClass('display-none');
    $('#overlay-container-services-2').addClass('display-none');
}

/*$(window).resize(function() {
    location.reload();
});
*/
