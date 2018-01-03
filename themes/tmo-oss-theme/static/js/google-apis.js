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

                for (var i = 0; i < response.result.items.length; i += 1) {
                    var eventData = response.result.items[i];
                    var eventElement = newEvent(eventData.summary,
                        eventData.description,
                        eventData.start.dateTime || eventData.start.date,
                        eventData.end.dateTime || eventData.end.date,
                        !!eventData.start.dateTime);
                    carousel.append(eventElement);
                };

                carousel.owlCarousel({
                    items: 5,
                    loop: true,
                    nav: true,
                    center: true,
                    dots: false,
                    navText: []
                });

                $("#events .owl-nav .owl-prev").addClass("left carousel-control glyphicon glyphicon-chevron-left");
                $("#events .owl-nav .owl-next").addClass("right carousel-control glyphicon glyphicon-chevron-right");
            });
    });
}

function newEvent(summary, description, start, end, timeFlag) {
    var date, time = '';
    description = description | '';
    if (timeFlag) {
        time =  ', ' + formatTimeSpan(new Date(start), new Date(end))
    }
    date = formatDate(new Date(start));

    var markupClass;
    if (new Date(start) < new Date()) {
        markupClass = 'event-past'
    } else {
        markupClass = 'event-upcoming'
    }

    var eventTemplate = '<div class="markup ' + markupClass + '">' +
        '<div class="markup-header">' + summary + '</div>' +
        '<div class="markup-details"> ' + description + '</div>' +
        '<div class="markup-footer">' + date + time + '</div>' +
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