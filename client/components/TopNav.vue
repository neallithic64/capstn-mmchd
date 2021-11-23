<template>
  <div id="myTopnav" class="topnav">
    <nuxt-link to="/" style="padding: 0px; padding-bottom: 9px">
      <img id="logo" src="~/assets/img/doh-logo.png" />
    </nuxt-link>
    <div class="dropdown">
      <button class="dropbtn">
        Disease Surveillance
        <i class="fa fa-caret-down"></i>
      </button>
      <div class="dropdown-content">
        <nuxt-link to="/allcases"> View Cases </nuxt-link>
        <nuxt-link to="/addCase"> Add Case </nuxt-link>
      </div>
    </div>
    <div class="dropdown">
      <button class="dropbtn">
        Program Surveillance
        <i class="fa fa-caret-down"></i>
      </button>
      <div class="dropdown-content">
        <nuxt-link to="/allprogreports"> View Reports </nuxt-link>
        <nuxt-link to="/newprogreport"> Add Program Report </nuxt-link>
      </div>
    </div>
    <nuxt-link to="/analysis"> Analysis and Visualization </nuxt-link>
    <nuxt-link to="/bulletin"> Feedback Bulletin </nuxt-link>
    <div class="dropdown">
      <button class="dropbtn">
        ESR
        <i class="fa fa-caret-down"></i>
      </button>
      <div class="dropdown-content">
        <nuxt-link to="/allevents"> View Health Events </nuxt-link>
        <nuxt-link to="/newevent"> New Health Event </nuxt-link>
      </div>
    </div>
    <nuxt-link to="/evaluation"> Evaluation </nuxt-link>
    <nuxt-link to="/addUser"> Accounts </nuxt-link>

    <div class="topnav-right-inside">
      <nuxt-link to="/notification"> Notification </nuxt-link>
      <div class="dropdown">
        <button class="dropbtn">
          My Account
          <i class="fa fa-caret-down"></i>
        </button>
        <div class="dropdown-content">
          <nuxt-link to="/myprofile"> My Profile </nuxt-link>
          <nuxt-link to="/settings"> Settings </nuxt-link>
          <nuxt-link to="/logout"> Logout </nuxt-link>
        </div>
      </div>
    </div>

    <a href="javascript:void(0);" class="icon" @click="responsive()">&#9776;</a>

    <div class="topnav-right">
      <button class="notification">
        <i class="fa fa-bell fa-sm"></i>
        <span id="notif-num" class="badge">10+</span>
      </button>
      <div class="dropdown">
        <button id="profile-dropbtn">
          <span v-if="$auth.loggedIn" id="user-initials">
            {{ $auth.user.firstName.charAt(0) }}
          </span>
        </button>
        <div class="dropdown-content-profile">
          <nuxt-link v-if="$auth.loggedIn" to="/myprofile">
            My Profile
          </nuxt-link>
          <nuxt-link to="/settings"> Settings </nuxt-link>
          <nuxt-link to="/">
            <span v-if="$auth.loggedIn" @click="$auth.logout()"> Logout </span>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    responsive() {
      const x = document.getElementById('myTopnav')
      if (x.className === 'topnav') {
        x.className += ' responsive'
      } else {
        x.className = 'topnav'
      }
    },
  },
}
</script>

<style>
body {
  background-image: none;
}

#myTopnav {
  z-index: 10;
  position: fixed;
}

#logo {
  width: 45px;
  height: 45px;
  float: left;
  display: block;
  margin-top: 7px;
  margin-left: 15px;
  margin-right: 10px;
}

.topnav-right {
  display: flex;
  justify-content: flex-end;
}

.topnav-right-inside {
  display: none;
}

.topnav {
  position: absolute;
  width: 100%;
  height: 65fcxc vvpx;
  left: 0px;
  top: 0px;
  background: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 0px 0px 10px 10px;
  font-family: 'Work Sans', sans-serif;
}

/* Style the links inside the navigation bar */
.topnav a {
  float: left;
  display: block;
  color: #000000;
  text-align: center;
  padding: 20px 12px;
  text-decoration: none;
  font-size: 14px;
}

/* Add an active class to highlight the current page */
.active {
  background-color: #04aa6d;
  color: white;
}

/* Hide the link that should open and close the topnav on small screens */
.topnav .icon {
  display: none;
}

/* Dropdown container - needed to position the dropdown content */
.dropdown {
  float: left;
  overflow: hidden;
}

/* Style the dropdown button to fit inside the topnav */
.dropdown .dropbtn {
  font-size: 14px;
  border: none;
  outline: none;
  color: #000000;
  padding: 20px 12px;
  background-color: inherit;
  font-family: inherit;
  margin: 0;
}

.dropdown #profile-dropbtn {
  border: none;
  outline: none;
  color: #ffffff;
  width: 45px;
  height: 45px;
  padding: 8px;
  background-color: #008d41;
  border-radius: 50%;
  font-family: inherit;
  margin-top: 7px;
  margin-right: 15px;
  font-weight: 400;
  font-size: 20px;
}

/* Style the dropdown content (hidden by default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 180px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content-profile {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 180px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

/* Style the links inside the dropdown */
.dropdown-content a {
  float: none;
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

.dropdown-content-profile a {
  float: none;
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

/* Add a dark background on topnav links and the dropdown button on hover */
.topnav a:hover,
.dropdown:hover .dropbtn {
  background-color: #555;
  color: white;
}

.dropdown:hover #profile-dropbtn {
  background-color: #346083;
  color: white;
}

/* Add a grey background to dropdown links on hover */
.dropdown-content a:hover {
  background-color: #ddd;
  color: black;
}

.dropdown-content-profile a:hover {
  background-color: #ddd;
  color: black;
}

/* Show the dropdown menu when the user moves the mouse over the dropdown button */
.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown:hover .dropdown-content-profile {
  display: block;
  right: 0px;
}

/* When the screen is less than 600 pixels wide, hide all links, except for the first one ("Home"). Show the link that contains should open and close the topnav (.icon) */
@media screen and (max-width: 1111px) {
  .topnav a:not(:first-child),
  .topnav-right-inside a:not(:last-child),
  .dropdown .dropbtn {
    display: none;
  }
  .topnav a.icon {
    float: right;
    display: block;
  }
}

/* The "responsive" class is added to the topnav with JavaScript when the user clicks on the icon. This class makes the topnav look good on small screens (display the links vertically instead of horizontally) */
@media screen and (max-width: 1111px) {
  .topnav.responsive {
    position: relative;
  }
  .topnav-right {
    display: none;
  }
  .topnav-right-inside {
    display: inherit;
  }
  .topnav.responsive a.icon {
    position: absolute;
    right: 0;
    top: 0;
  }
  .topnav.responsive a {
    float: none;
    display: block;
    text-align: left;
  }
  .topnav.responsive .dropdown {
    float: none;
    clear: both;
  }
  .topnav.responsive .dropdown-content {
    position: relative;
  }
  .topnav.responsive .dropdown .dropbtn {
    display: block;
    width: 100%;
    text-align: left;
  }
}

.notification {
  color: #000000;
  text-decoration: none;
  padding: 18px 12px;
  position: relative;
  display: inline-block;
  border-radius: 2px;
  margin-right: 15px;
}

.notification:hover {
  color: #346083;
}

.notification .badge {
  position: absolute;
  top: 12px;
  right: -3px;
  padding: 2.5px 5px;
  border-radius: 50%;
  background: red;
  color: white;
  font-size: 8px;
}
</style>