(function($){

    $.getJSON("https://8bgaf4sxq3.execute-api.us-west-2.amazonaws.com/api/calendar", function (response){
        var carousel = $('#events .owl-carousel');
        if (!response.data.items.length) {
            return noEvents('No Events Scheduled');
        }
        response.data.items.sort(function(a, b){
            var firstval = (a.start.dateTime?a.start.dateTime : a.start.date);
			var secondval = (b.start.dateTime?b.start.dateTime : b.start.date);
            return Date.parse(firstval) - Date.parse(secondval);
        })
        var allEventsTemplate = '<div class="cat-prize-section">' +
            '<div class="container grid text-center">' +
            '<div class="btn btn-white">' +
            '<button onclick="window.open(\'https://calendar.google.com/calendar?cid=M25hdHBlMjdubGxtcmZpNWlrZ2FvYWd0bjRAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ\', \'_events\')">' +
            '<span class="code-span">ALL EVENTS</span>' +
            '</button>' +
            '</div>' +
            '</div>' +
            '</div>';
        carousel.after(allEventsTemplate);
        var filteredEventsList = filterToTen(response.data.items);
        var pastEventsCount = 0;

        for (var i = 0; i < filteredEventsList.length; i += 1) {
            var eventData = filteredEventsList[i];
            var result = newEvent(eventData);
            var eventElement = result.eventTemplate;
            pastEventsCount += result.isPast ? 1 : 0;

            carousel.append(eventElement);
        }
        if (pastEventsCount === response.data.items.length) {
            pastEventsCount -= 1;
        }
        carousel.owlCarousel({
            items: 5,
            nav: true,
            mouseDrag: false,
            center: true,
            dots: false,
            navText: [],
            margin: 0,
            responsive: {
                0: {
                    items: 1,
                    startPosition: pastEventsCount
                },
                1024: {
                    items: 3,
                    startPosition: pastEventsCount
                },
                1200: {
                    items: 5,
                    startPosition: pastEventsCount
                }
            }
        });

        $("#events .owl-nav .owl-prev").addClass("left carousel-control glyphicon glyphicon-chevron-left");
        $("#events .owl-nav .owl-next").addClass("right carousel-control glyphicon glyphicon-chevron-right");
    })
    .fail(function(e){
        console.log(JSON.stringify(e));
        return noEvents('Error loading events. Please try later.');
    });
})(jQuery);

function newEvent(eventData) {
    var date, time = '';
    var start = new Date(eventData.start.dateTime || eventData.start.date);
    var summary = eventData.summary;
    var description = eventData.description || '';
    description = description || '';

    var isPast = false;
    if (!!eventData.start.dateTime) {
        time = ', ' + formatTimeSpan(start,
            new Date(eventData.end.dateTime))
    } else {
        var plusOneDay = start;
        plusOneDay.setDate(plusOneDay.getDate() + 1);
        start = plusOneDay;
    }
    date = formatDate(start);


    var markupClass;
    if (start <= new Date()) {
        isPast = true;
        markupClass = 'event-past';
    } else {
        markupClass = 'event-upcoming';
    }


    var imageTag = true;
    // if (eventData.attachments) {
    //     imageTag = 'https://drive.google.com/uc?id=' +
    //         eventData.attachments[0].fileId +
    //         '&export=download';
    // }

    var eventTemplate = '<div class="markup ' + markupClass + '">' +
        '<div class="markup-overlay">' +
        '<div class="markup-content">' +
        '<div class="markup-details"> ' +
        '<div class="markup-text" title="'+summary+'">' + summary + '</div>' +
        '<div class="markup-desc" title="' + description + '">' + description + ' ' +
        '</div>' +
        '</div>' +
        '<div class="markup-footer">' +
        '<span class="fa fa-calendar"></span>' +
        date + time + '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    // '<div class="markup-overlay"></div>';
    return {
        isPast: isPast,
        eventTemplate: eventTemplate
    };
}

function formatDate(date) {
    var monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
    ];

    var day = date.getDate();
    var suffix = 'th';
    switch (day) {
        case 1:
            suffix = 'st';
            break;
        case 2:
            suffix = 'nd';
            break;
        case 3:
            suffix = 'rd';
            break;
    }


    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return monthNames[monthIndex] + ' ' + day + suffix;
}

function formatTimeSpan(start, end) {
    var startMin = start.getMinutes();
    var startHours = start.getHours() > 12 ? start.getHours() - 12 : start.getHours();
    var startM = start.getHours() > 12 ? 'pm' : 'am';

    var endMin = end.getMinutes();
    var endHours = end.getHours() > 12 ? end.getHours() - 12 : end.getHours();
    var endM = end.getHours() > 12 ? 'pm' : 'am';


    var dateString = startHours + (startMin === 0 ? '' : (':' + startMin)) +
        (startM !== endM ? (' ' + startM) : '') +
        ' - ' +
        endHours + (endMin === 0 ? '' : (':' + endMin)) + ' ' + endM;
    return dateString;
}

function noEvents(message) {
    var carousel = $('#events .owl-carousel');

    var eventTemplate = '<div class="markup event-past">' +
        '<div class="markup-overlay">' +
        '<div class="markup-content">' +
        '<div class="markup-details"> ' +
        '<div class="markup-text">'+ message + '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    carousel.append(eventTemplate);
    carousel.owlCarousel({
        items: 5,
        nav: true,
        mouseDrag: false,
        center: true,
        dots: false,
        navText: [],
        margin: 10,
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
        }
    });
    return;
}

function filterToTen(events) {
    var minDistanceToNow;
    var index;
    for (var i = 0; i < events.length; i += 1) {
        var eventDate = new Date(events[i].start.dateTime || events[i].start.date);
        var eventTimeAway = Math.abs(eventDate - new Date());
        if (minDistanceToNow) {
            if (eventTimeAway < minDistanceToNow) {
                minDistanceToNow = eventTimeAway;
                index = i;
            }
        } else {
            minDistanceToNow = eventTimeAway;
            index = i;
        }
    }

    var list = [];
    for (var j = 5; j > 0; j -= 1) {
        if (events[index - j]) {
            list.push(events[index - j])
        }
    }

    for (var k = 0; k < 5; k += 1) {
        if (events[index + k]) {
            list.push(events[index + k])
        }
    }
    return list;
}