window.focuseducation = {};

// App Settings
focuseducation.settings = {
    API_URL: 'http://www.focus-education.co.uk/api/api/'
};

// Speakers
focuseducation.speakerDetailPage = (function(){
    "use strict";
    // Define your library strictly...
    var init, showLoader, hideLoader, getSpeaker, getSpeakerSuccess, getSpeakerFailure, getConferences, getConferencesSuccess, getConferencesFailure;

    showLoader = function() {
        var interval = setInterval(function(){
            $.mobile.loading('show', {
                text: 'Loading Speaker Details',
                textVisible: true
            });
            clearInterval(interval);
        }, 1);
    };

    hideLoader = function() {
        var interval = setInterval(function(){
            $.mobile.loading('hide');
            clearInterval(interval);
        }, 1);
    };

    getSpeakerFailure = function(jqXHR, textStatus, errorThrown) {
        hideLoader();
        var response = JSON.parse(jqXHR.responseText);
        $('#speakerErrorHeader h3').text('Oooppps');
        $('#speakerErrorContent p').html(response.error);
        $('#speakerError').popup('open');
    };

    getSpeakerSuccess = function(data, textStatus, jqXHR) {
        $('#name').text(data.title + ' ' + data.forename + ' ' + data.surname);
        $('#photo').attr('src', 'http://www.focus-education.co.uk/events/events/imagedisplayer.aspx?speakerid=' + data.userid);
        $('#profile').html(data.penpick.replace(/\r\n|\n|\r/g, '<br />'));
        hideLoader();
    };

    getSpeaker = function() {
        var id = localStorage.getItem('speaker_id');
        showLoader();
        $.getJSON(focuseducation.settings.API_URL + 'speaker/id/' + id, function() {})
            .done(getSpeakerSuccess)
            .fail(getSpeakerFailure);
    };

    getConferencesFailure = function(jqXHR, textStatus, errorThrown) {
        var conferences = [];
        $('#conferences-list li').remove();
        conferences.push('<li data-role="list-divider">List Of Conferences</li>');
        conferences.push('<li>There are no conferences listed for this speaker</li>');
        $('#conferences-list').html(conferences);
        $('#conferences-list').listview('refresh');
    };

    getConferencesSuccess = function(data, textStatus, jqXHR) {
        var conferences = [];
        $('#conferences-list li').remove();
        $.each(data, function(i, conference) {
            conferences.push('<li data-role="list-divider">' + conference.date + '</li>');
            conferences.push('<li><a href="conference-detail.html" class="view-speaker-button" data-id="' + conference.id + '"><h2>' + conference.title + '</h2><p><strong>' + conference.venue + '</strong></p><p>' + conference.forename + ' ' + conference.surname + '</p></a></li>');
        });
        $('#conferences-list').html(conferences);
        $('#conferences-list').listview('refresh');
    };

    getConferences = function() {
        var id = localStorage.getItem('speaker_id');
        $.getJSON(focuseducation.settings.API_URL + 'speakerconferences/userid/' + id, function() {})
            .done(getConferencesSuccess)
            .fail(getConferencesFailure);
    };

    init = function() {
        getConferences();
        getSpeaker();
    };

    return {
        init: init
    };
})();

// Speakers
focuseducation.speakersPage = (function(){
    "use strict";
    // Define your library strictly...
    var init, initBinds, showLoader, hideLoader, doSpeakerView, doDividers, getSpeakers, getSpeakersSuccess, getSpeakersFailure;

    showLoader = function() {
        var interval = setInterval(function(){
            $.mobile.loading('show', {
                text: 'Loading Speakers',
                textVisible: true
            });
            clearInterval(interval);
        }, 1);
    };

    hideLoader = function() {
        var interval = setInterval(function(){
            $.mobile.loading('hide');
            clearInterval(interval);
        }, 1);
    };

    doDividers = function() {
        $('#speakers-list').listview({
            autodividers: true,
            autodividersSelector: function(li) {
                return $(li).find('span').text().substr(0,1);
            }
        });
        $('#speakers-list').listview('refresh');
    };

    doSpeakerView = function(e) {
        e.preventDefault();
        var id;
        id = $(this).attr('data-id');
        localStorage.setItem('speaker_id', id);
        $.mobile.changePage(this.href);
    };

    getSpeakersFailure = function(jqXHR, textStatus, errorThrown) {
        hideLoader();

    };

    getSpeakersSuccess = function(data, textStatus, jqXHR) {
        var speakers = [];
        $('#speakers-list li').remove();
        $.each(data, function(i, speaker) {
            speakers.push('<li><a href="speaker-detail.html" class="view-speaker-button" data-id="' + speaker.userid + '">' + speaker.title + ' ' + speaker.forename + ' <span>' + speaker.surname + '</span></a></li>');
        });
        $('#speakers-list').html(speakers);
        $('#speakers-list').listview('refresh');
        doDividers();
        hideLoader();
    };

    getSpeakers = function() {
        showLoader();
        $.getJSON(focuseducation.settings.API_URL + 'speakers', function() {})
            .done(getSpeakersSuccess)
            .fail(getSpeakersFailure);
    };

    initBinds = function () {
        $('#speakers-page').on('click', '.view-speaker-button', doSpeakerView);
    };

    init = function() {
        getSpeakers();
        initBinds();
    };

    return {
        init: init
    };
})();

// Conferences
focuseducation.conferenceDetailPage = (function(){
    "use strict";
    // Define your library strictly...
    var init, initBinds, showLoader, hideLoader, doSpeakerView, doConferenceView, doBookConferenceView, getConference, getConferenceSuccess, getConferenceFailure;

    showLoader = function() {
        var interval = setInterval(function(){
            $.mobile.loading('show', {
                text: 'Loading Conference Details',
                textVisible: true
            });
            clearInterval(interval);
        }, 1);
    };

    hideLoader = function() {
        var interval = setInterval(function(){
            $.mobile.loading('hide');
            clearInterval(interval);
        }, 1);
    };

    doSpeakerView = function(e) {
        e.preventDefault();
        var id;
        id = $(this).attr('data-id');
        localStorage.setItem('speaker_id', id);
        $.mobile.changePage(this.href);
    };

    doConferenceView = function(e) {
        e.preventDefault();
        var id;
        id = $(this).attr('data-id');
        localStorage.setItem('conference_id', id);
        $.mobile.changePage(this.href);
    };

    doBookConferenceView = function(e) {
        e.preventDefault();
        var id;
        id = $(this).attr('data-id');
        localStorage.setItem('conference_id', id);
        $.mobile.changePage(this.href);
    };

    getConferenceFailure = function(jqXHR, textStatus, errorThrown) {
        hideLoader();

    };

    getConferenceSuccess = function(data, textStatus, jqXHR) {
        // Populate the designated fields
        $('#name').text(data.title);
        $('#reference').text(data.conferencecode);
        $('#dates').text(data.dates);
        // $('#date').text(conference.date);
        $('#speaker').html('<a href="speaker-detail.html" class="view-speaker-button" data-id="' + data.userid + '">' + data.speaker + '</a>');
        $('#cost').html(data.cost);
        $('#venue').text(data.venueline);
        $('#details').html(data.notes.replace(/\r\n|\n|\r/g, '<br />'));
        $('#alternatives').html(data.alternatives);
        $('#conference').append('<a href="login.html" class="book-conference-button ui-btn' + (data.conference_status_allowwebbooking == '0' ? ' ui-state-disabled' : '') + '" data-id="' + data.conferenceid + '">Book This Event</a>');
        $('#conference').css('display', 'block');
        hideLoader();
    };

    getConference = function() {
        var id = localStorage.getItem('conference_id');
        showLoader();
        $.getJSON(focuseducation.settings.API_URL + 'conference/id/' + id, function() {})
            .done(getConferenceSuccess)
            .fail(getConferenceFailure);
    };

    initBinds = function () {
        $('#conference-detail-page').on('click', '.view-speaker-button', doSpeakerView);
        $('#conference-detail-page').on('click', '.view-conference-button', doConferenceView);
        $('#conference-detail-page').on('click', '.book-conference-button', doBookConferenceView);
    };

    init = function() {
        getConference();
        initBinds();
    };

    return {
        init: init
    };
})();

// Conferences
focuseducation.conferencesPage = (function(){
    "use strict";
    // Define your library strictly...
    var init, initBinds, showLoader, hideLoader, doConferenceView, getConferences, getConferencesSuccess, getConferencesFailure;

    showLoader = function() {
        var interval = setInterval(function(){
            $.mobile.loading('show', {
                text: 'Loading Conferences',
                textVisible: true
            });
            clearInterval(interval);
        }, 1);
    };

    hideLoader = function() {
        var interval = setInterval(function(){
            $.mobile.loading('hide');
            clearInterval(interval);
        }, 1);
    };

    doConferenceView = function(e) {
        e.preventDefault();
        var id;
        id = $(this).attr('data-id');
        localStorage.setItem('conference_id', id);
        $.mobile.changePage(this.href);
    };

    getConferencesFailure = function(jqXHR, textStatus, errorThrown) {
        hideLoader();

    };

    getConferencesSuccess = function(data, textStatus, jqXHR) {
        var date = '';
        var conferences = [];
        $('#conferences-list li').remove();
        $.each(data, function(i, conference) {
            if (conference.date != date){
                conferences.push('<li data-role="list-divider">' + conference.date + '</li>');
            }
            conferences.push('<li><a href="conference-detail.html" class="view-conference-button" data-id="' + conference.id + '"><h2>' + conference.title + '</h2><p><strong>' + conference.venue + '</strong></p><p>' + conference.forename + ' ' + conference.surname + '</p></a></li>');
            date = conference.date;
        });
        $('#conferences-list').html(conferences);
        $('#conferences-list').listview('refresh');
        hideLoader();
    };

    getConferences = function() {
        showLoader();
        $.getJSON(focuseducation.settings.API_URL + 'conferences', function() {})
            .done(getConferencesSuccess)
            .fail(getConferencesFailure);
    };

    initBinds = function () {
        $('#conferences-page').on('click', '.view-conference-button', doConferenceView);
    };

    init = function() {
        getConferences();
        initBinds();
    };

    return {
        init: init
    };
})();

// Calendar
focuseducation.calendarPage = (function(){
    "use strict";
    // Define your library strictly...
    var init, initBinds, showLoader, hideLoader,
        renderCalendar, getCalendar, getCalendarSuccess, getCalendarFailure, doConferenceView;

    showLoader = function() {
        var interval = setInterval(function(){
            $.mobile.loading('show', {
                text: 'Loading Conferences',
                textVisible: true
            });
            clearInterval(interval);
        }, 1);
    };

    hideLoader = function() {
        var interval = setInterval(function(){
            $.mobile.loading('hide');
            clearInterval(interval);
        }, 1);
    };

    doConferenceView = function(e) {
        e.preventDefault();
        var id;
        id = $(this).attr('data-id');
        localStorage.setItem('conference_id', id);
        $.mobile.changePage(this.href);
    };

    renderCalendar = function(dates) {
        $('#calendar').jqmCalendar({
            events : dates
        });
    };

    getCalendarFailure = function(jqXHR, textStatus, errorThrown) {
        hideLoader();
        var response = JSON.parse(jqXHR.responseText);
        $('#speakerErrorHeader h3').text('Oooppps');
        $('#speakerErrorContent p').html(response.error);
        $('#speakerError').popup('open');
    };

    getCalendarSuccess = function(data, textStatus, jqXHR) {
        // Create a blank date object
        var date = {};
        // Create a blank dates array
        var dates = [];
        $.each(data, function(i, conference) {
            // Split the returned MySQL datetimestamp
            var t = conference.sortdate.split(/[- :]/);
            // Create the date object
            var date = {
                'summary' : '<h2>' + conference.title + '</h2><p><strong>Time:</strong> ' + t[3] + ':' + t[4] + '</p><p><strong>Location:</strong> ' + conference.venue + '</p><p><strong>Date:</strong> ' + conference.startdate + '</p>',
                'begin' : new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]),
                'end' : new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]),
                'url' : 'conference-detail.html',
                'data-id' : conference.id,
                'full-date' : conference.date
            }
            // Push the date object onto the dates array
            dates.push(date);
        });
        renderCalendar(dates);
        hideLoader();
    };

    getCalendar = function() {
        showLoader();
        $.getJSON(focuseducation.settings.API_URL + 'conferences', function() {})
            .done(getCalendarSuccess)
            .fail(getCalendarFailure);
    };

    initBinds = function () {
        $('#home-page').on('click', '.view-conference-button', doConferenceView);
    };

    init = function() {
        getCalendar();
        initBinds();
    };

    return {
        init: init
    };
})();

// Delegates
focuseducation.delegateAddPage = (function(){
    "use strict";
    // Define your library strictly...
    var init, initBinds, showLoader, hideLoader,
        doDelegateAddSubmit, doDelegateAdd, doDelegateAddSuccess, doDelegateAddFailure, doDelegateAddErrors,
        getJobTitlesSuccess, getTitlesSuccess, getDietsSuccess,
        getDelegates;

    showLoader = function() {
        var interval = setInterval(function(){
            $.mobile.loading('show', {
                text: 'Loading',
                textVisible: true
            });
            clearInterval(interval);
        }, 1);
    };

    hideLoader = function() {
        var interval = setInterval(function(){
            $.mobile.loading('hide');
            clearInterval(interval);
        }, 1);
    };

    getJobTitlesSuccess = function(data, textStatus, jqXHR) {
        $.each(data, function(i, jobtitle) {
            $('select[name="jobtitle"]').append($('<option></option>').attr('value', jobtitle.jobtitleid).text(jobtitle.jobtitledesc));
            $('select[name="jobtitle"] option:first').attr('selected','selected');
            $('select[name="jobtitle"]').selectmenu('refresh');
        });
    };

    getTitlesSuccess = function(data, textStatus, jqXHR) {
        $.each(data, function(i, title) {
            $('select[name="title"]').append($('<option></option>').attr('value', title.titleid).text(title.titledesc_short));
            $('select[name="title"] option:first').attr('selected','selected');
            $('select[name="title"]').selectmenu('refresh');
        });
    };

    getDietsSuccess = function(data, textStatus, jqXHR) {
        $.each(data, function(i, diet) {
            $('select[name="diet"]').append($('<option></option>').attr('value', diet.dietid).text(diet.dietdesc));
            $('select[name="diet"] option:first').attr('selected','selected');
            $('select[name="diet"]').selectmenu('refresh');
        });
    };

    getDelegates = function() {
        showLoader();
        var dataDiets = $.getJSON(focuseducation.settings.API_URL + 'diets');
        var dataJobTitles = $.getJSON(focuseducation.settings.API_URL + 'jobtitles');
        var dataTitles = $.getJSON(focuseducation.settings.API_URL + 'titles');
        $.when(dataDiets, dataJobTitles, dataTitles).done(function(dataDietsSuccess, dataJobTitlesSuccess, dataTitlesSuccess){
            getDietsSuccess(dataDietsSuccess[0])
            getJobTitlesSuccess(dataJobTitlesSuccess[0])
            getTitlesSuccess(dataTitlesSuccess[0])
            hideLoader();
            $('#delegate').css('display', 'block');
        });
    };

    doDelegateAddErrors = function(header, content) {
        $('#popup-message-header h3').text(header);
        $('#popup-message-content p').text(content);
        $('#popup-message').popup('open');
    };

    doDelegateAddFailure = function(jqXHR, textStatus, errorThrown) {
        hideLoader();
        var response = JSON.parse(jqXHR.responseText);
        doDelegateAddErrors('Error', response.error);
    };

    doDelegateAddSuccess = function(data, textStatus, jqXHR) {
        hideLoader();
        $.mobile.changePage('delegates.html');        
    };

   doDelegateAdd = function() {
        var user_id = localStorage.getItem('user_id');

        var forename = $('#forename').val(),
            surname = $('#surname').val(),
            title = $('#title').val(),
            jobtitle = $('#jobtitle').val(),
            diet = $('#diet').val(),
            phone1 = $('#phone1').val(),
            phone2 = $('#phone2').val(),
            mobile = $('#mobile').val(),
            email = $('#email').val(),
            main = $('#main').is(':checked') ? 1 : 0;

        var data = {
            forename: forename,
            surname: surname,
            title: title,
            jobtitle: jobtitle,
            diet: diet,
            phone1: phone1,
            phone2: phone2,
            mobile: mobile,
            email: email,
            customerid: user_id,
            main: main
        }

        if(forename.length > 0 && surname.length > 0 && phone1.length > 0 && email.length > 0) {
            showLoader();
            $.ajax({
                url: focuseducation.settings.API_URL + 'delegate_add',
                data: data,
                type: 'POST',
                dataType: 'json'
            })
            .done(doDelegateAddSuccess)
            .fail(doDelegateAddFailure);
        } else {
            doDelegateAddErrors('Error', 'Please complete all the required fields');
        }
    };

    doDelegateAddSubmit = function(e) {
        e.preventDefault();
        doDelegateAdd();
    };

    initBinds = function () {
        $('#delegate-add-form').on('submit', doDelegateAddSubmit);
    };

    init = function() {
        getDelegates();
        initBinds();
    };

    return {
        init: init
    };
})();

// Delegates Edit
focuseducation.delegateEditPage = (function(){
    "use strict";
    // Define your library strictly...
    var init, initBinds, showLoader, hideLoader,
        doDelegateEditSubmit, doDelegateEdit, doDelegateEditSuccess, doDelegateEditFailure, doDelegateEditErrors,
        getJobTitlesSuccess, getTitlesSuccess, getDietsSuccess,
        getDelegates, getDelegatesSuccess;

    showLoader = function() {
        var interval = setInterval(function(){
            $.mobile.loading('show', {
                text: 'Loading Delegates',
                textVisible: true
            });
            clearInterval(interval);
        }, 1);
    };

    hideLoader = function() {
        var interval = setInterval(function(){
            $.mobile.loading('hide');
            clearInterval(interval);
        }, 1);
    };

    getJobTitlesSuccess = function(data, textStatus, jqXHR) {
        $.each(data, function(i, jobtitle) {
            $('select[name="jobtitle"]').append($('<option></option>').attr('value', jobtitle.jobtitleid).text(jobtitle.jobtitledesc));
            $('select[name="jobtitle"] option:first').attr('selected','selected');
            $('select[name="jobtitle"]').selectmenu('refresh');
        });
    };

    getTitlesSuccess = function(data, textStatus, jqXHR) {
        $.each(data, function(i, title) {
            $('select[name="title"]').append($('<option></option>').attr('value', title.titleid).text(title.titledesc_short));
            $('select[name="title"] option:first').attr('selected','selected');
            $('select[name="title"]').selectmenu('refresh');
        });
    };

    getDietsSuccess = function(data, textStatus, jqXHR) {
        $.each(data, function(i, diet) {
            $('select[name="diet"]').append($('<option></option>').attr('value', diet.dietid).text(diet.dietdesc));
            $('select[name="diet"] option:first').attr('selected','selected');
            $('select[name="diet"]').selectmenu('refresh');
        });
    };

    getDelegatesSuccess = function(data, textStatus, jqXHR) {
        $('input[name="forename"]').val(data.Forename);
        $('input[name="surname"]').val(data.Surname);
        $('input[name="phone1"]').val(data.Phone1);
        $('input[name="phone2"]').val(data.Phone2);
        $('input[name="mobile"]').val(data.Mobile);
        $('input[name="email"]').val(data.Email);
    };

    getDelegates = function() {
        var user_id = localStorage.getItem('user_id');
        showLoader();
        var dataDelegates = $.getJSON(focuseducation.settings.API_URL + 'delegates/id/' + user_id);
        var dataDiets = $.getJSON(focuseducation.settings.API_URL + 'diets');
        var dataJobTitles = $.getJSON(focuseducation.settings.API_URL + 'jobtitles');
        var dataTitles = $.getJSON(focuseducation.settings.API_URL + 'titles');
        $.when(dataDelegates, dataDiets, dataJobTitles, dataTitles).done(function(dataDelegatesSuccess, dataDietsSuccess, dataJobTitlesSuccess, dataTitlesSuccess){
            getDelegatesSuccess(dataDelegatesSuccess[0])
            getDietsSuccess(dataDietsSuccess[0])
            getJobTitlesSuccess(dataJobTitlesSuccess[0])
            getTitlesSuccess(dataTitlesSuccess[0])
            hideLoader();
            $('#delegate').css('display', 'block');
        });
    };

    doDelegateEditErrors = function(header, content) {
        $('#popup-message-header h3').text(header);
        $('#popup-message-content p').text(content);
        $('#popup-message').popup('open');
    };

    doDelegateEditFailure = function(jqXHR, textStatus, errorThrown) {
        hideLoader();
        var response = JSON.parse(jqXHR.responseText);
        doLoginErrors('Error', response.error);
    };

    doDelegateEditSuccess = function(data, textStatus, jqXHR) {
        hideLoader();
    };

   doDelegateEdit = function() {
        var user_id = localStorage.getItem('user_id');

        var forename = $('#forename').val(),
            surname = $('#surname').val(),
            title = $('#title').val(),
            jobtitle = $('#jobtitle').val(),
            diet = $('#diet').val(),
            phone1 = $('#phone1').val(),
            phone2 = $('#phone2').val(),
            mobile = $('#mobile').val(),
            email = $('#email').val(),
            main = $('#main').val();

        var data = {
            forename: forename,
            surname: surname,
            title: title,
            jobtitle: jobtitle,
            diet: diet,
            phone1: phone1,
            phone2: phone2,
            mobile: mobile,
            email: email,
            customerid: user_id,
            main: main
        }

        if(forename.length > 0 && surname.length > 0 && phone1.length > 0 && email.length > 0) {
            showLoader();
            $.ajax({
                url: focuseducation.settings.API_URL + 'delegate_edit',
                data: data,
                type: 'POST',
                dataType: 'json'
            })
            .done(doDelegateEditSuccess)
            .fail(doDelegateEditFailure);
        } else {
            doDelegateEditErrors('Error', 'Please complete all the required fields');
        }
    };

    doDelegateEditSubmit = function(e) {
        e.preventDefault();
        doDelegateEdit();
    };

    initBinds = function () {
        $('#delegate-edit-form').on('submit', doDelegateEditSubmit);
    };

    init = function() {
        getDelegates();
        initBinds();
    };

    return {
        init: init
    };
})();

// Delegates
focuseducation.delegatesPage = (function(){
    "use strict";
    // Define your library strictly...
    var init, initBinds, showLoader, hideLoader,
        doBookingSubmit, doBooking, doBookingErrors, doBookingConfirmView,
        doDelegateEditView, doDelegateAddView,
        getConference, getConferenceSuccess, getConferenceFailure,
        getDelegates, getDelegatesSuccess, getDelegatesFailure;

    showLoader = function() {
        var interval = setInterval(function(){
            $.mobile.loading('show', {
                text: 'Loading Delegates',
                textVisible: true
            });
            clearInterval(interval);
        }, 1);
    };

    hideLoader = function() {
        var interval = setInterval(function(){
            $.mobile.loading('hide');
            clearInterval(interval);
        }, 1);
    };

    doBookingConfirmView = function() {
        $.mobile.changePage('confirm-booking.html');
    };

    doBookingErrors = function(header, content) {
        $('#popup-message-header h3').text(header);
        $('#popup-message-content p').text(content);
        $('#popup-message').popup('open');
    };

    doBooking = function() {
        var attendees = [];
        $.each($('input[name="delegate"]'), function() {
            if ($(this).is(':checked')) {
                var row = $(this).parents('.ui-checkbox');
                attendees.push({
                    id: $(this).attr('id'),
                    title: row.find('#title').text(),
                    titledesc: row.find('#titledesc').text(),
                    forename: row.find('#forename').text(),
                    surname: row.find('#surname').text(),
                    jobtitle: row.find('#jobtitle').text(),
                    jobtitledesc: row.find('#jobtitledesc').text(),
                    diet: row.find('#diet').text(),
                    dietdesc: row.find('#dietdesc').text(),
                    phone1: row.find('#phone1').text(),
                    phone2: row.find('#phone2').text(),
                    mobile: row.find('#mobile').text(),
                    email: row.find('#email').text(),
                    customerid: row.find('#customerid').text(),
                    main: row.find('#main').text()
                });
            }
        });
        if(attendees.length > 0) {
            localStorage.setItem('attendees', JSON.stringify(attendees));
            doBookingConfirmView();
        } else {
            doBookingErrors('Error', 'Please select at least one of your delegates to attend this conference.');
        }
    };

    doBookingSubmit = function(e) {
        e.preventDefault();
        doBooking();
    };

    doDelegateEditView = function(e) {
        e.preventDefault();
        var id;
        id = $(this).attr('data-id');
        localStorage.setItem('delegate_id', id);
        $.mobile.changePage(this.href);
    };

    doDelegateAddView = function(e) {
        $.mobile.changePage(this.href);
    };

    getDelegatesFailure = function(jqXHR, textStatus, errorThrown) {
        hideLoader();

    };

    getDelegatesSuccess = function(data, textStatus, jqXHR) {
        var delegates = [];
        $.each(data, function(i, delegate) {
            delegates.push('<label for="delegate-' + delegate.enc_value.Id + '">' +
                '<input name="delegate" id="' + delegate.enc_value.Id + '" type="checkbox">' +
                '<span id="titledesc">' + delegate.enc_value.TitleDesc + '</span> <span id="forename">' + delegate.enc_value.Forename + '</span> <span id="surname">' + delegate.enc_value.Surname + '</span>' +
                '<span style="display:none;" id="id">' + delegate.enc_value.Id + '</span>' +
                '<span style="display:none;" id="title">' + delegate.enc_value.TitleId + '</span>' +
                '<span style="display:none;" id="jobtitle">' + delegate.enc_value.JobTitleId + '</span>' +
                '<span style="display:none;" id="jobtitledesc">' + delegate.enc_value.JobTitleDesc + '</span>' +
                '<span style="display:none;" id="diet">' + delegate.enc_value.DietId + '</span>' +
                '<span style="display:none;" id="dietdesc">' + delegate.enc_value.DietDesc + '</span>' +
                '<span style="display:none;" id="phone1">' + delegate.enc_value.Phone1 + '</span>' +
                '<span style="display:none;" id="phone2">' + delegate.enc_value.Phone2 + '</span>' +
                '<span style="display:none;" id="mobile">' + delegate.enc_value.Mobile + '</span>' +
                '<span style="display:none;" id="email">' + delegate.enc_value.Email + '</span>' +
                '<span style="display:none;" id="customerid">' + delegate.enc_value.CustomerId + '</span>' +
                '<span style="display:none;" id="main">' + delegate.enc_value.MainContact + '</span>' +
            '</label>');
        });
        delegates.push('<a href="delegate-add.html" class="add-delegate-button ui-btn ui-corner-all ui-icon-plus ui-btn-icon-notext">Add Delegate</a>');
        $('#delegates-control-group').controlgroup('container').append(delegates);
        $('#delegates-control-group').enhanceWithin().controlgroup('refresh');
        $('#delegates').css('display', 'block');
        hideLoader();
    };

    getDelegates = function() {
        var user_id = localStorage.getItem('user_id');
        showLoader();
        $.getJSON(focuseducation.settings.API_URL + 'delegates/id/' + user_id, function() {})
            .done(getDelegatesSuccess)
            .fail(getDelegatesFailure);
    };

    getConferenceFailure = function(jqXHR, textStatus, errorThrown) {
        hideLoader();

    };

    getConferenceSuccess = function(data, textStatus, jqXHR) {
        $('#name').text(data.title);
        $('#conference').css('display', 'block');
        hideLoader();
    };

    getConference = function() {
        var id = localStorage.getItem('conference_id');
        showLoader();
        $.getJSON(focuseducation.settings.API_URL + 'conference/id/' + id, function() {})
            .done(getConferenceSuccess)
            .fail(getConferenceFailure);
    };

    initBinds = function () {
        $('#delegates-page').on('click', '.edit-delegate-button', doDelegateEditView);
        $('#delegates-page').on('click', '.add-delegate-button', doDelegateAddView);
        $('#delegates-form').on('submit', doBookingSubmit);
    };

    init = function() {
        getConference();
        getDelegates();
        initBinds();
    };

    return {
        init: init
    };
})();

// Login
focuseducation.loginPage  = (function(){
    "use strict";
    // Define your library strictly...
    var init, initBinds, showLoader, hideLoader, doDelegatesView, doLoginSubmit, doLogin, doLoginSuccess, doLoginFailure, doLoginErrors;

    showLoader = function() {
        var interval = setInterval(function(){
            $.mobile.loading('show', {
                text: 'Checking Your Details',
                textVisible: true
            });
            clearInterval(interval);
        }, 1);
    };

    hideLoader = function() {
        var interval = setInterval(function(){
            $.mobile.loading('hide');
            clearInterval(interval);
        }, 1);
    };

    doDelegatesView = function() {
        $.mobile.changePage('delegates.html');
    };

    doLoginErrors = function(header, content) {
        $('#popup-message-header h3').text(header);
        $('#popup-message-content p').text(content);
        $('#popup-message').popup('open');
    };

    doLoginFailure = function(jqXHR, textStatus, errorThrown) {
        hideLoader();
        var response = JSON.parse(jqXHR.responseText);
        doLoginErrors('Error', response.error);
    };

    doLoginSuccess = function(data, textStatus, jqXHR) {
        var id, name;
        id = data.string[0];
        name = data.string[1];
        localStorage.setItem('user_id', id);
        localStorage.setItem('user_name', name);
        hideLoader();
        doDelegatesView();
    };

    doLogin = function() {
        var data, username, password;
        username = $('#username').val();
        password = $('#password').val();
        data = {
            username: username,
            password: password
        }
        if(username.length > 0 && password.length > 0) {
            showLoader();
            $.ajax({
                url: focuseducation.settings.API_URL + 'login',
                data: data,
                type: 'POST',
                dataType: 'json'
            })
            .done(doLoginSuccess)
            .fail(doLoginFailure);
        } else {
            doLoginErrors('Error', 'Please complete all the required fields');
        }
    };

    doLoginSubmit = function(e) {
        e.preventDefault();
        doLogin();
    };

    initBinds = function () {
        $('#login-form').on('submit', doLoginSubmit);
    };

    init = function() {
        initBinds();
    };

    return {
        init: init
    };
})();

// Login
focuseducation.confirmBookingPage  = (function(){
    "use strict";
    // Define your library strictly...
    var init, initBinds, showLoader, hideLoader,
    doBookingConfirmSubmit, doBookingConfirm, doBookingConfirmSuccess, doBookingConfirmFailure, doBookingConfirmErrors,
    getCompany, getCompanySuccess,
    getConferenceSuccess,
    getConfirmedDelegates;

    showLoader = function() {
        var interval = setInterval(function(){
            $.mobile.loading('show', {
                text: 'Checking Your Details',
                textVisible: true
            });
            clearInterval(interval);
        }, 1);
    };

    hideLoader = function() {
        var interval = setInterval(function(){
            $.mobile.loading('hide');
            clearInterval(interval);
        }, 1);
    };

    doBookingConfirmErrors = function(header, content) {
        $('#popup-message-header h3').text(header);
        $('#popup-message-content p').text(content);
        $('#popup-message').popup('open');
    };

    doBookingConfirmFailure = function(jqXHR, textStatus, errorThrown) {

    };

    doBookingConfirmSuccess = function(data, textStatus, jqXHR) {

    };

    doBookingConfirm = function() {
        var data, delegates, conferenceid, customerid, totalcost, totaldiscount;
        delegates = JSON.parse(localStorage['attendees']);
        conferenceid = localStorage.getItem('conference_id');   
        customerid = localStorage.getItem('user_id');
        totalcost = $('#total').val();
        totaldiscount = 0;

        data = {
            delegates: delegates,
            conferenceid: conferenceid,
            customerid: customerid,
            totalcost: totalcost,
            totaldiscount: totaldiscount
        }
        showLoader();
        $.ajax({
            url: focuseducation.settings.API_URL + 'confirm',
            data: data,
            type: 'POST',
            dataType: 'json'
        })
        .done(doBookingConfirmSuccess)
        .fail(doBookingConfirmFailure);
    };

    doBookingConfirmSubmit = function(e) {
        e.preventDefault();
        doBookingConfirm();
    };

    getConfirmedDelegates = function() {
        var attendees = JSON.parse(localStorage['attendees']);
        $('#confirmed-table tbody tr').remove();
        $.each(attendees, function(i, attendee) {
            $('#confirmed-table tbody').append('<tr><td><span id="title">' + attendee.titledesc + '</span> <span id="forename">' + attendee.forename + '</span> <span id="surname">' + attendee.surname + '</span></td></tr>');
        });
    };

    getConferenceSuccess = function(data, textStatus, jqXHR) {
        var attendees = JSON.parse(localStorage['attendees']);
        var count = attendees.length;
        var total = parseFloat(data.costperdelegateonline * count).toFixed(2);

        var vat_rate = parseFloat(data.vatrate);
        var vat_amount = parseFloat(Math.round(parseFloat(vat_rate) / 100 * parseFloat(total))).toFixed(2);
        var total_cost = parseFloat(Math.round(parseFloat(total) + parseFloat(vat_amount))).toFixed(2);

        $('#event-name').text(data.title);
        $('#event-cost').html('&pound;' + data.costperdelegateonline);
        $('#event-delegates').text(count);
        $('#event-total').html('&pound;' + total_cost + ' (inc. VAT at ' + vat_rate + '%)');

        // Hidden values
        $('#total').val(total_cost);
        $('#amount').val(total_cost.replace('.', ''));
        $('#orderinfo').val('Booking for conference ' + data.title + ' with Focus Education');
    };

    getCompanySuccess = function(data, textStatus, jqXHR) {
        $('#company-organisation').text(data.company);
        $('#company-address1').text(data.address1);
        $('#company-address2').text(data.address2);
        $('#company-town').text(data.town);
        $('#company-county').text(data.county);
        $('#company-postcode').text(data.postcode);
        $('#company-phone').text(data.phone);
        $('#company-email').text(data.email);
        // Hidden values
        $('#merchant').val('focused14672');

        $('#address').val(data.address1 + ' ' + data.address2);
        $('#town').val(data.town);
        $('#county').val(data.county);
        $('#country').val('England');
        $('#postcode').val(data.postcode);
        $('#telephone').val(data.phone);
        $('#customeremail').val('1');
        $('#email').val(data.email);
        $('#company').val(data.company);
    };

    getCompany = function() {
        showLoader();
        var user_id = localStorage.getItem('user_id');
        var conference_id = localStorage.getItem('conference_id');
        var dataCompany = $.getJSON(focuseducation.settings.API_URL + 'company/id/' + user_id);
        var dataConference = $.getJSON(focuseducation.settings.API_URL + 'conference/id/' + conference_id);
        $.when(dataCompany, dataConference).done(function(dataCompanySuccess, dataConferenceSuccess){
            getCompanySuccess(dataCompanySuccess[0]);
            getConferenceSuccess(dataConferenceSuccess[0]);
            getConfirmedDelegates();
            hideLoader();
            $('#company-details').css('display', 'block');
            $('#order-details').css('display', 'block');
            $('#confirmed-delegates').css('display', 'block');
            $('#confirm').css('display', 'block');
        });
    };

    initBinds = function () {
        $('#confirm-booking-form').on('submit', doBookingConfirmSubmit);
    };

    init = function() {
        getCompany();
        initBinds();
    };

    return {
        init: init
    };
})();