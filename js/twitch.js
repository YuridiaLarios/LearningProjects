$(document).ready(function() {
  // URL for Twitch TV Streams
  var URL_Streams = 'https://api.twitch.tv/kraken/streams/';

  // URL for Twitch TV Channels
  var URL_Channel = 'https://api.twitch.tv/kraken/channels/';

  // URL for Callbacks including ID
  var callbak = '?callback=?&client_id=bxg83rr6a85bmrfvozwhesgn5holhk';

  // Twitch TV Users
  var twitchUsers = [
    "Nintendo",
    "ClashRoyale",
    "ClashOfClans",
    "Sodapoppin",
    "KittyPlaysGames",
    "ESL_SC2",
    "ESL_CSGO",
    "OgamingSC2",
    "cretetion",
    "freecodecamp",
    "pink_sparkles",
    "medrybw",
    "monstercat",
    "aces_tv",
    "twitchpresents",
    "loserfruit",
    "behkuhtv"
  ];

  var twitchUsersData = [];
  var streamStatus = '';
  var MAX_INFO = 45; // cut info to 45 words
  var refreshRate = 900000; // refresh every 9 minutes
  var active = 'all';
  var videoLink = "http://player.twitch.tv/?channel=";






/***********************************************************************************************************************
  function to get the info of evry user, store it into an object,
  then passed the object into our twitchUserData array. Then it
  checks that all Twitch TV Users were processed and if successfully
  calls upon showUserData(who) function for handling data.
************************************************************************************************************************/
  function getStatus() {
    // Making sure results div is empty.
    $("#results").empty();
    twitchUsersData = [];

    // Reads our Twitch TV Users array and for each user
    // name creates an URL.
    twitchUsers.forEach(function(user) {
    // example:
    // var URL = https://api.twitch.tv/kraken/streams/ + Nintendo + ?callback=?&client_id=bxg83rr6a85bmrfvozwhesgn5holhk;
      var URL = URL_Streams + user + callbak;

      // get json data from each corresponding user using the URL
      $.getJSON(URL, user)
        .done(function(data, textStatus, jqXHR) {
          // creates an object called tempUsersData
          var tempUsersData = {};
          // setting properties of our object
          // getting name:
          tempUsersData.name = user;
          // getting status:
          tempUsersData.status = data.status;
          //  getting streaming:
          // if the user is streaming right now, it stores the number of viwers and
          // a large preview, otherwise it sets these properties to null.
          tempUsersData.streaming = (data.stream !== null);
          if (tempUsersData.streaming) {
            tempUsersData.viewers = data.stream.viewers;
            tempUsersData.preview = data.stream.preview.large;
          } else {
            tempUsersData.viewers = null;
            tempUsersData.preview = null;
          }
          // create a new variable also called URL
          // inside this new scoope
          //example:
          // var URL = https://api.twitch.tv/kraken/channels/ + Nintendo + ?callback=?&client_id=bxg83rr6a85bmrfvozwhesgn5holhk
          var URL = URL_Channel + user + callbak;

          $.getJSON(URL)
            .done(function(data, textStatus, jqXHR) {
              // getting logo
              tempUsersData.logo = data.logo;
              // getting channel url
              tempUsersData.url = 'https://www.twitch.tv/' + data.name;


              // if channel-account is working perform the following:
              if (data.status !== 422 && data.status !== 404) {
                // getting info of user channel
                tempUsersData.info = data.status;
                // getting name of user channel
                tempUsersData.displayName = data.display_name;
                // getting name of game of user channel
                tempUsersData.game = data.game;
                // set either video preview or banner preview of user channel, or
                // if none of them are available then just set the word "twitch"
                // to handle it later.
                if (tempUsersData.preview === null && data.profile_banner !== null) {
                  tempUsersData.preview = data.profile_banner;
                }
                if (tempUsersData.preview === null && data.video_banner !== null) {
                  tempUsersData.preview = data.video_banner;
                }
                if (tempUsersData.preview === null && data.video_banner === null) {
                  tempUsersData.preview = "twitch";
                }
              }

              // push into our initially empty array the new tempUserData object
              // including all properties info collected from above.
              twitchUsersData.push(tempUsersData);


              // making sure all Twitch TV Users were processed
              if (twitchUsersData.length == twitchUsers.length) {
                // Making sure results div is empty.
                $("#results").empty();
                // calls sort method to sort by alphabetical user name
                twitchUsersData.sort(sortList);

                twitchUsersData.forEach(function(who) {
                  // make "all" button active
                  $("#all").addClass("active");
                  // call userData method
                  showUserData(who);
                });
              }
            })
          // if it fails thro an error to the console. Nothing will be display.
          .fail(function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown.toString());
          });
        })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown.toString());
      });
    });
  } // end of getStatus function





/***********************************************************************************************************************
  function to generate all the divs and attach all info to
  their corresponding div to be displayed.
************************************************************************************************************************/
  function showUserData(who) {

    var html = '';
    // bootstrap grid layout div
    html += '<div class="col-lg-4 col-md-6 col-sm-6 col-xs-row">';
    // individual thumbanils div
    html += '<div class="thumbnail">'
    // background image or preview div
    html += '<div class="infocard stream" id="infocard_' + who.name + '">';
    if (who.streaming) {
      html += '<iframe id="myIframe" class="embed-responsive-item" src="'+ videoLink + who.name +'&data-paused=true&muted=true&autoplay=false&"';
      html += 'height="100%" width="100%" frameborder="0" scrolling="no"muted="true" allowfullscreen></iframe>';
    }
    html += '</div>'; // end of "infocard aka back image"

    // CHANNEL PAGE LINK surrounding caption to make it all clickable
    if (who.url !== null) {
      html += '<a href="' + who.url + '" target="_blank">';
    }
    // caption div
    html += '<div class="caption">';
    // if there is no logo just put an unicorn as logo
    if ((who.logo === null) || (who.logo === undefined)) {
      userLogo = '../images/unicorn.jpg';
    } else {
      userLogo = who.logo;
    }
    // logo live or off streaming status
    if (who.streaming) {
      streamStatus = 'stream-on';
    } else {
      streamStatus = 'stream-off';
    }

    // LOGO: either live or off class and picture of logo
    html += '<img class="logo ' + streamStatus + '" src="' + userLogo + '" alt="">';
    //USERNAME
    var displayName = who.displayName;
    if (who.displayName === undefined) {
      displayName = who.name;
    }
    html += '<h3>' + displayName + '</h3>';
    // GAME INFO
    var game = "";
    if (who.game !== null) {
      game = who.game;
    }
    if (who.streaming) {
      html += '<h4>' + game + '&nbsp;&nbsp;<span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span> ' + who.viewers + '</h4>';
    }
    // GAME INFO
    if (who.info !== null) {
      // calls truncate function to cut down the info
      html += '<hp>' + truncate(who.info, MAX_INFO) + '</hp>';
    }
    html += '</div>';
    html += '</div>';
    html += '</img>';
    html += '</a>';
    html += '</div>';

    // apend info to our results div
    $("#results").hide().append(html).fadeIn("500");


    // preview attached
    if (who.preview !== null && who.preview !== 'twitch') {
      $('#infocard_' + who.name).css({
        "background-image": 'url(' + who.preview + ')',
      });
    }
    // if preview not available set background color to black
    if (who.preview === "twitch") {
      $('#infocard_' + who.name).css(
        "background-color", "black"
      );
    }
  } // end of shouUserData function





  /***********************************************************************************************************************
    function to cut down the info description of current game.
  ************************************************************************************************************************/
  function truncate(str, num) {
    if (typeof(str) !== 'undefined') {
      if (str.length > num) {
        return str.slice(0, num - 3) + '&#8230;';
      }
    }
    return str;
  } // end of truncate function





  /***********************************************************************************************************************
    function to sort thumbnails by username in alphabetical name
  ************************************************************************************************************************/
  function sortList(a, b) {
    var nameA = a.name.toLowerCase(),
      nameB = b.name.toLowerCase();
    if (nameA < nameB)
      return -1;
    if (nameA > nameB)
      return 1;
    return 0;
  } // end of sortList function





  /***********************************************************************************************************************
    functions to control navigation tab clicks
  ************************************************************************************************************************/

  // highlights corresponding active nav tav
  $(".btn-group > .btn").click(function() {
    $(".btn-group > .btn").removeClass("active");
    $(this).addClass("active");
  });

  // displays all thumbnails after "all" tab is clicked.
  $("#all").click(function() {
    $("#results").empty();
    // calls sort method to sort by alphabetical user name
    twitchUsersData.sort(sortList);
    twitchUsersData.forEach(function(who) {
      showUserData(who);
    });
  });

  // displays only users who are streaming after "online" tab is clicked.
  $("#online").click(function() {
    $("#results").empty();
    // calls sort method to sort by alphabetical user name
    twitchUsersData.sort(sortList);
    twitchUsersData.filter(function(channel) {
      return channel.streaming;
    }).forEach(function(who) {
      showUserData(who);
    });
  });

  // displays only users who are offline after "offline" tab is clicked.
  $("#offline").click(function() {
    $("#results").empty();
    // calls sort method to sort by alphabetical user name
    twitchUsersData.sort(sortList);
    twitchUsersData.filter(function(channel) {
      return (!channel.streaming);
    }).forEach(function(who) {
      showUserData(who);
    });
  });

  // MAIN PROGRAM
  getStatus();

  // update info every 9 mins
  intervalID = setInterval(getStatus, refreshRate);
  // update current time every 15 seconds


});
