var CALENDAR_ID = '3natpe27nllmrfi5ikgaoagtn4@group.calendar.google.com';
// var CALENDAR_ID = 'muk4317cue1ndb659obo3fcl60@group.calendar.google.com';
var API_KEY = 'AIzaSyBU1o-gbhJpAOxd9rYuW7xcjXPNinjvhwI';
var CLIENT_ID = '908427607840-ll2dg2op9q5861q3svqud0aqmf4kf6b9.apps.googleusercontent.com';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/youtube";

function retrieveEventsData() {
    var mockData;
    if (mockData) {
        initCarousel(mockData);
    } else {
        gapi.load('client:auth2', {
            onerror: function () {
                noEvents('Failed to load data');
            },
            callback: function () {
                startCalendarClient();
                startVideoClient();
            }
        });
    }
}

function startCalendarClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    })
        .then(getEvents)
        .then(initCarousel, noEvents);
}

function startVideoClient() {
    gapi.client.load('youtube', 'v3', function (callbackData) {
        var request = gapi.client.youtube.playlistItems.list({
            part: 'snippet',
            maxResults: 4,
            playlistId: 'PL0mz2nejZ-DgH0XsbYDrKPbeMiEJYWqUg'
        });
        request.execute(function (response) {
            if(!response.error) {
                response.items.forEach(function (video, index) {
                    console.log(video.snippet.title);
                    var videoContainer = $('#youtube-video-' + index + ' [data-toggle="modal"]');
                    var videoFrame = $('#youtube-video-' + index + ' iframe');
                    var videoSrc = 'https://youtube.com/embed/' + video.snippet.resourceId.videoId;

                    videoFrame.attr('src', videoSrc);
                    videoContainer.attr('video-url', videoSrc);
                    videoContainer.attr('video-title', video.snippet.title);
                });
            }
        })
    })
}

function getEvents() {

    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return gapi.client.calendar.events.list({
        'calendarId': CALENDAR_ID,
        'showDeleted': false,
        'singleEvents': true,
        'orderBy': 'startTime'
    })

}

console.log('Start');
retrieveEventsData();
