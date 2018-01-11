function retrieveEventsData() {
    var API_KEY = 'AIzaSyBU1o-gbhJpAOxd9rYuW7xcjXPNinjvhwI';
    var CLIENT_ID = '908427607840-ll2dg2op9q5861q3svqud0aqmf4kf6b9.apps.googleusercontent.com';
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
    // var CALENDAR_ID = '3natpe27nllmrfi5ikgaoagtn4@group.calendar.google.com';
    var CALENDAR_ID = 'muk4317cue1ndb659obo3fcl60@group.calendar.google.com';
    gapi.load('client:auth2', function () {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        }).then(function () {
            var oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            return gapi.client.calendar.events.list({
                'calendarId': CALENDAR_ID,
                'showDeleted': false,
                'singleEvents': true,
                'orderBy': 'startTime'
            })
        })
            .then(function (response) {
                var carousel = $('#events .owl-carousel');
                if (!response.result.items.length) {
                    var noEventsTemplate = '<div class="text-center"><span class="code-span" style="color: black">No Events Scheduled</span></div>';
                    carousel.after(noEventsTemplate);
                    return;
                } else {
                    var allEventsTemplate = '<div class="text-center">' +
                        '<div class="btn btn-white">' +
                        '<button onclick="window.open(\'https://calendar.google.com/calendar?cid=M25hdHBlMjdubGxtcmZpNWlrZ2FvYWd0bjRAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ\', \'_blank\')">' +
                        '<span class="code-span">All Events</span>' +
                        '</button>' +
                        '</div>' +
                        '</div>';
                    carousel.after(allEventsTemplate);
                }

                var pastEventsCount = 0;

                for (var i = 0; i < response.result.items.length; i += 1) {
                    var eventData = response.result.items[i];
                    var result = newEvent(eventData);
                    var eventElement = result.eventTemplate;
                    pastEventsCount += result.isPast ? 1 : 0;

                    carousel.append(eventElement);
                }

                if (pastEventsCount === response.result.items.length) {
                    pastEventsCount -= 1;
                }

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
                            items: 1,
                            startPosition: pastEventsCount
                        },
                        480: {
                            items: 1,
                            startPosition: pastEventsCount
                        },
                        768: {
                            items: 2,
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
            });
    });
}

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
    // if (!!eventData.start.dateTime) {
    if (start <= new Date()) {
        isPast = true;
        markupClass = 'event-past';
    } else {
        markupClass = 'event-upcoming';
    }
    // } else {
    //     var plusOneDay = new Date(start);
    //     if (new Date(start) < new Date().getDay()) {
    //         markupClass = 'event-past';
    //     } else {
    //         markupClass = 'event-upcoming';
    //     }
    // }


    var imageTag = false;
    // if (eventData.attachments) {
    //     imageTag = 'https://drive.google.com/uc?id=' +
    //         eventData.attachments[0].fileId +
    //         '&export=download';
    // }

    var eventTemplate = '<div class="markup ' + markupClass + '"' +
        (!!imageTag ? ' style="background: url(' + imageTag + ');' +
            'background-size: cover;">' : '>') +
        // '<div class="markup-overlay"></div>' +
        '<div class="markup-content">' +
        '<div class="markup-header">' + summary + '</div>' +
        '<div class="markup-details"> ' +
        '<div class="markup-text">' + description + '</div>' +
        '</div>' +
        '<div class="markup-footer">' + date + time + '</div>' +
        '</div>' +
        '</div>';
    return {
        isPast: isPast,
        eventTemplate: eventTemplate
    };
}

function formatDate(date) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
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