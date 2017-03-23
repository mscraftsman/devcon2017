$(document).ready(function(){

  function menu(){
    $(window).scroll(function() {
      if ($(this).scrollTop() > 100) {
        $('[data-id=menu]').addClass('stacked');
      } else {
        $('[data-id=menu]').removeClass('stacked');
      }
    });

    if ($(window).scrollTop() > 100) {
      $('[data-id=menu]').addClass('stacked');
    } else {
      $('[data-id=menu]').removeClass('stacked');
    }

    $('[data-id=menu]').on('click', function(event){
      $('[data-id=menu]').toggleClass('open');
    });
  }

  // Loads sessions data from spreadsheet
  function loadSessionsData(){

    var key                  = '1WOdGIWVatrnhJoJoH4pgsdwtMhBce9kH1aI-AoBlBW0';
    var sheet                = ['od6', 'otxbfq6', 'o3xkksm', 'ol3w1dm', 'o9ypq48'];
                          // Thursday, Friday, Saturday, MakerCon Friday, LinuxFest Saturday
    var apiURLThursday        = 'https://spreadsheets.google.com/feeds/list/' + key + '/' + sheet[0] + '/public/values?alt=json';
    var apiURLFriday          = 'https://spreadsheets.google.com/feeds/list/' + key + '/' + sheet[1] + '/public/values?alt=json';
    var apiURLSaturday        = 'https://spreadsheets.google.com/feeds/list/' + key + '/' + sheet[2] + '/public/values?alt=json';
    var apiURLMakerCon        = 'https://spreadsheets.google.com/feeds/list/' + key + '/' + sheet[3] + '/public/values?alt=json';
    var apiURLLinuxFest       = 'https://spreadsheets.google.com/feeds/list/' + key + '/' + sheet[4] + '/public/values?alt=json';


    var dataNames            = ['sessionsThursday', 'sessionsFriday', 'sessionsSaturday', 'sessionsMakerCon', 'sessionsLinuxFest'];
    var dataTimings          = ['timingsThursday', 'timingsFriday', 'timingsSaturday', 'timingsMakerCon', 'timingsLinuxFest'];

    var itineraryComponent = Vue.component('session', {
      template: '#itinerary',
      props : [
        'itinerary_timings',
        'itinerary_sessions',
        'itinerary_showmodal',
      ]
    });

    var mobileInfoComponent = Vue.component('mobileinformation', {
      template: '#mobile-information',
      props : [
        'info_title',
        'info_time',
        'info_abstract',
        'info_room',
        'info_session',
        'info_show_modal',
      ],
    });

    var view = new Vue({
      el: '[data-view=sessions]',
      data: {
        sessionsThursday: null,
        sessionsFriday: null,
        sessionsSaturday: null,
        sessionsMakerCon: null,
        sessionsLinuxFest: null,
        timingsThursday: null,
        timingsFriday: null,
        timingsSaturday: null,
        timingsMakerCon: null,
        timingsLinuxFest: null,
      },
      created: function () {
        this.fetchData();
      },
      methods: {
        fetchData: function () {
          // I'll see what I can refactor later - Nirvan
          var self = this;

          // Thursday
          $.get(apiURLThursday, function(data) {
            var timeArr = [];

            $('[data-id=session-loader-thursday]').fadeOut({
              done: function(){
                self.sessionsThursday = data.feed.entry;
                $.each(_.pluck(data.feed.entry, 'gsx$time'), function(index, value){
                  timeArr.push(value.$t);
                });
                self.timingsThursday = _.uniq(timeArr);
              }
            });

          });

          // Friday
          $.get(apiURLFriday, function(data) {
            var timeArr = [];
            //some cleansing process
            // $.each(data.feed.entry, function(index, value){
            //   var obj = value;
            //   if(obj.gsx$_cn6ca){
            //     obj.gsx$room = obj.gsx$_cn6ca;
            //     delete obj.gsx$_cn6ca;
            //   } else {
            //     // create blank object & assign.
            //     var roomObject = new Object();
            //     roomObject.$t = '';
            //     obj.gsx$room = roomObject;
            //   }
            // });

            $('[data-id=session-loader-friday]').fadeOut({
              done: function(){
                self.sessionsFriday = data.feed.entry;
                $.each(_.pluck(data.feed.entry, 'gsx$time'), function(index, value){
                  timeArr.push(value.$t);
                });
                self.timingsFriday = _.uniq(timeArr);
              }
            });
          });

          // Saturday
          $.get(apiURLSaturday, function(data) {
            var timeArr = [];

            $('[data-id=session-loader-saturday]').fadeOut({
              done: function(){
                self.sessionsSaturday = data.feed.entry;
                $.each(_.pluck(data.feed.entry, 'gsx$time'), function(index, value){
                  timeArr.push(value.$t);
                });
                self.timingsSaturday = _.uniq(timeArr);
              }
            });
          });

        },
        showModal: function(sessionData){
          var inst = $('[data-remodal-id=session]').remodal();
          $('[data-modal-info=title]').html(_.where(sessionData.gsx$title, "$t")[0]);
          $('[data-modal-info=person]').html(_.where(sessionData.gsx$speaker, "$t")[0]);
          $('[data-modal-info=time]').html(_.where(sessionData.gsx$time, "$t")[0]);
          $('[data-modal-info=room]').html(_.where(sessionData.gsx$room, "$t")[0]);
          $('[data-modal-info=desc]').html(_.where(sessionData.gsx$abstract, "$t")[0]);

          if((_.where(sessionData.gsx$level, "$t")[0]).toString().length > 0){
            $('[data-level-wrapper=level]').removeClass('no-display');
            $('[data-modal-info=level]')
              .html(_.where(sessionData.gsx$level, "$t")[0])
              .attr('data-level', _.where(sessionData.gsx$level, "$t")[0]);
          } else {
            $('[data-level-wrapper=level]').addClass('no-display');
          }
          inst.open();
        }
      }
    });
  }

  // Loads speakers data from spreadsheet
  function loadSpeakers(){
    var key                  = '1WOdGIWVatrnhJoJoH4pgsdwtMhBce9kH1aI-AoBlBW0';
    var sheet                = 'oyw720';
    var apiSpeakers          = 'https://spreadsheets.google.com/feeds/list/' + key + '/' + sheet + '/public/values?alt=json';

    var view = new Vue({
      el: '[data-view=speakers]',
      data: {
        speakers: null
      },
      created: function () {
        this.fetchData();
      },
      methods: {
        fetchData: function () {
          var self = this;
          // Speakers
          $.get(apiSpeakers, function(data) {
            $('[data-id=speakers-loader]').fadeOut({
              done: function(){
                self.speakers = data.feed.entry;
                //console.log(self.speakers);
              }
            });
          });
        }
      }
    });
  }

  // Loads sponsors data
  function loadSponsors(){
    var key                  = '1WOdGIWVatrnhJoJoH4pgsdwtMhBce9kH1aI-AoBlBW0';
    var sheet                = 'ogt46nu';
    var apiSponsors          = 'https://spreadsheets.google.com/feeds/list/' + key + '/' + sheet + '/public/values?alt=json';

    var view = new Vue({
      el: '[data-view=sponsors]',
      data: {
        sponsors: null
      },
      created: function () {
        this.fetchData();
      },
      methods: {
        fetchData: function () {
          var self = this;
          // Speakers
          $.get(apiSponsors, function(data) {
            $('[data-id=sponsors-loader]').fadeOut({
              done: function(){
                self.sponsors = data.feed.entry;
                //console.log(self.sponsors);
              }
            });
          });
        }
      }
    });
  }

  // Loads jobs data
  function loadJobs(){
    var apiJobs              = 'https://spreadsheets.google.com/feeds/list/11-aWaLzJVtGzYGGMLxgMk0iO3SwIfebNptTNv0QPsxw/ot16nkd/public/values?alt=json';

    var view = new Vue({
      el: '[data-view=jobs]',
      data: {
        jobs: null
      },
      created: function () {
        this.fetchData();
      },
      methods: {
        fetchData: function () {
          var self = this;
          // Speakers
          $.get(apiJobs, function(data) {
            $('[data-id=jobs-loader]').fadeOut({
              done: function(){
                self.jobs = (data.feed.entry).reverse();
                //console.log(self.jobs);
              }
            });
          });
        }
      }
    });
  }

  menu();

  if($('body').hasClass('page-sessions')){
    loadSessionsData();
  }
  if($('body').hasClass('type-homepage')){
    loadSpeakers();
    loadSponsors();
    loadJobs();
  }
  if($('body').hasClass('page-jobs')){
    loadJobs();
  }
});