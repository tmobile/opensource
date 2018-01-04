function retrieveEventsData() {
    var API_KEY = 'AIzaSyBMx7fI4YXkSqALBeZ_cV66lSDtSaCFiiI';
    var CLIENT_ID = '342833929601-kl7va0uc0r8po204e3r69d5s87ceqfdp.apps.googleusercontent.com';
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
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
                'calendarId': 'muk4317cue1ndb659obo3fcl60@group.calendar.google.com',
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 10,
                'orderBy': 'startTime'
            })
        })
            .then(function (response) {
                var carousel = $('#events .owl-carousel');

                var pastEventsCount = 0;

                for (var i = 0; i < response.result.items.length; i += 1) {
                    var eventData = response.result.items[i];
                    var eventElement = newEvent(eventData);
                    pastEventsCount += (new Date(eventData.start.dateTime || eventData.start.date) < new Date()) ? 1 : 0;
                    carousel.append(eventElement);
                }

                carousel.owlCarousel({
                    items: 5,
                    loop: true,
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
    var start = eventData.start.dateTime || eventData.start.date;
    var summary = eventData.summary;
    var description = eventData.description || '';
    description = description || '';
    if (!!eventData.start.dateTime) {
        time = ', ' + formatTimeSpan(new Date(start),
            new Date(eventData.end.dateTime))
    }
    date = formatDate(new Date(start));

    var markupClass = new Date(start) < new Date() ? 'event-past' : 'event-upcoming';

    var imageTag;
    if (eventData.attachments) {
        // https://drive.google.com/uc?id=0Bzgk4zncCwI7aDZCSHY4YU0zNUF&export=download
        imageTag = 'https://drive.google.com/uc?id=' +
            eventData.attachments[0].fileId +
            '&export=download';
    }

    var eventTemplate = '<div class="markup ' + markupClass + '"' +
        (!!imageTag ? ' style="background: url(' + imageTag + ');' +
            'background-size: cover;">' : '>') +
        '<div class="markup-overlay"></div>' +
        '<div class="markup-content">' +
        '<div class="markup-header">' + summary + '</div>' +
        '<div class="markup-details"> ' +
        '<div class="markup-text">' + description + '</div>' +
        '</div>' +
        '<div class="markup-footer">' + date + time + '</div>' +
        '</div>' +
        '</div>';
    return eventTemplate;
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
    var startHours = start.getHours() > start.getHours() ? start.getHours() - 12 : start.getHours();
    var startM = start.getHours() > 12 ? 'pm' : 'am';

    var endMin = end.getMinutes();
    var endHours = end.getHours() > 12 ? end.getHours() - 12 : end.getHours();
    var endM = end.getHours() > 12 ? 'pm' : 'am';


    var dateString = startHours + ':' + (startMin === '0' ? '' : startMin) +
        (startM !== endM ? (' ' + startM) : '') +
        ' - ' +
        endHours + ':' + (endMin === '0' ? '' : endMin) + ' ' + endM;
    return dateString;
}