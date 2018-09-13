function initCarousel(response) {
    var carousel = $('#events .owl-carousel');
    if (!response.result.items.length) {
        return noEvents('No Events Scheduled');
    }
    var allEventsTemplate =
        '<div class="btn btn-white">' +
        '<button onclick="window.open(\'https://calendar.google.com/calendar?cid=M25hdHBlMjdubGxtcmZpNWlrZ2FvYWd0bjRAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ\', \'_blank\')">' +
        '<span class="code-span">ALL EVENTS</span>' +
        '</button>' +
        '</div>';
    carousel.after(allEventsTemplate);

    var filteredEventsList = filterToTen(response.result.items);

    var pastEventsCount = 0;

    for (var i = 0; i < filteredEventsList.length; i += 1) {
        var eventData = filteredEventsList[i];
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

function newEvent(eventData) {
    var start = new Date(eventData.start.dateTime || eventData.start.date);
    var summary = eventData.summary;
    // var descText = $(eventData.description).text()
    // var descText = escapeHtml(eventData.description);
    // console.log('desc', descText);
    var description = eventData.description || '';
    var isPast = false;

    var dateString;
    var date = moment(eventData.start.dateTime || eventData.start.date).format('MMM Do');
    var endDate = moment(eventData.end.dateTime || eventData.end.date).format('MMM Do');
    if (eventData.start.dateTime) {
        var startA = moment(eventData.start.dateTime).format('a');
        var endA = moment(eventData.end.dateTime).format('a');
        var startTime = moment(eventData.start.dateTime).format('h:mm');
        var endTime = moment(eventData.end.dateTime).format('h:mm a');
        dateString = date + ', ' + startTime + (startA !== endA ? (' ' + startA) : '') +
            ' - ' + endTime
    } else {
        dateString = (date + ' - ' + endDate);
    }

    var markupClass;
    if (start <= new Date()) {
        isPast = true;
        markupClass = 'event-past';
    } else {
        markupClass = 'event-upcoming';
    }

    var eventTemplate = '<div event-id="' + eventData.id + '" onclick="changeEventModal(event)" class="markup ' + markupClass + '">' +
        '<div class="markup-header" title="'+eventData.summary+'">' + eventData.summary + '</div>' +
        '<div class="markup-details"> ' +
        '<div class="markup-desc" title="' + description + '">' + description + ' </div>' +
        '</div>' +
        '<div class="markup-footer">' +
        '<span class="fa fa-calendar"></span>' + dateString +
        '</div>' +
        '</div>'
    // '<div class="markup-overlay"></div>';
    return {
        isPast: isPast,
        eventTemplate: eventTemplate
    };
}

function changeEventModal(event) {
    var eventId = event.currentTarget.getAttribute('event-id');
    var calendarId = event.currentTarget.getAttribute('event-id');
    var mockData;
    if (mockData) {
        onRequestEvent(mockEvent1);
    } else {
        var request = gapi.client.calendar.events.get({
            eventId: eventId,
            calendarId: CALENDAR_ID
        });

        request.execute(onRequestEvent)
    }
}

function appendModalElement(icon, content, subtext, shiftIcon) {
    var template = '<div class="modal-info">' +
        '<div class="modal-icon">' +
            '<div class="fa ' + icon + ' ' + (shiftIcon ? 'shift-icon' : 'stay-icon') + '"></div>' +
        '</div>' +
        '<div class="content">' +
        content +
        (subtext ? ('<div class="subtext">' + subtext + '</div>') : '') +
        '</div>' +
        '</div>';
    return template;
}


function noEvents() {
    var carousel = $('#events .owl-carousel');
    var eventTemplate = '<div class="markup event-past">' +
        '<div class="markup-overlay">' +
        '<div class="markup-content">' +
        '<div class="markup-details"> ' +
        '<div class="markup-text">No Events Scheduled</div>' +
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
}

function onRequestEvent(response) {
    var options = {};
    $('#event-info-modal').modal(options);
    var modalContent = $('#event-info-modal .modal-content');
    modalContent.html('');
    var string = '<div class="modal-header"><h5 class="modal-title">' + response.result.summary + '</h5></div>' +
        '<div class="modal-body">';
        // '<div class="container-fluid">';
    var x = moment(response.start.dateTime).format('MMM Do YYYY');
    var date = moment(response.start.dateTime || response.start.date).format('MMM Do YYYY');
    var startTime = moment(response.start.dateTime || response.start.date).format('h:mm a');
    var endTime = moment(response.end.dateTime).format('h:mm a');
    string += appendModalElement('fa-clock-o', date, response.start.dateTime ? startTime + ' - ' + endTime : '', !!response.start.dateTime);
    if (response.location) {
        var locationArr = response.location.split(',');
        var locationLabel = locationArr[0];
        locationArr.splice(0, 1);
        var locationCoor = locationArr.join(',');
        string += appendModalElement('fa-map-marker', locationLabel, locationCoor, !!locationCoor);
    }
    if (response.description) {
        string += appendModalElement('fa-align-justify', text2HTML(response.description), '', true);
    }
    string += appendModalElement('fa-calendar', response.result.organizer.displayName,
        response.creator ? 'Created by: ' + response.creator.displayName : '',
        !!response.creator);
    string += '</div>';
    modalContent.append($(string));
}

function text2HTML(text) {
    // 0: Check if text is an HTML string
    if (!(/[a-z][\s\S]*>/).test(text)){

      // 1: Replace hypelinks with anchor tag
      var linkExp = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=()]*)/);
	  var linkArr = linkExp.exec(text);
      if (linkArr && linkArr.length){
		var hl = '<a href="'+linkArr[0]+'">'+linkArr[0]+'</a>';
      	text = text.replace(linkArr[0], hl) ;
      }
      
      // 2: Line Breaks
      text = text.replace(/\r\n?|\n/g, "<br>");

      // 3: Paragraphs
      text = text.replace(/<br>\s*<br>/g, "</p><p>");

      // 4: Wrap in Paragraph Tags
      text = "<p>" + text + "</p>";
    }

    return text;
}
