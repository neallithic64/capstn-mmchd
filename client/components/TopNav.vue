<template>
  <div id="myTopnav" class="topnav">
    <nuxt-link to="/" style="padding: 0px; padding-bottom: 9px">
      <img id="logo" src="~/assets/img/doh-logo.png" />
    </nuxt-link>
    <div 
      v-if="$auth.user.userType === 'pidsrStaff' || $auth.user.userType === 'techStaff' ||
      $auth.user.userType === 'BHS' || $auth.user.userType === 'RHU' || $auth.user.userType === 'CHO' ||
      $auth.user.userType === 'govtHosp' || $auth.user.userType === 'privHosp' || $auth.user.userType === 'clinic' ||
      $auth.user.userType === 'govtLab' || $auth.user.userType === 'privLab' || $auth.user.userType === 'airseaPort'"
      class="dropdown"
    >
      <button class="dropbtn">
        Disease Surveillance
        <i class="fa fa-caret-down"></i>
      </button>
      <div class="dropdown-content">
        <nuxt-link to="/addCase"> Add Case </nuxt-link>
        <nuxt-link to="/allCases"> All Case Reports </nuxt-link>
        <nuxt-link to="/allOutbreaks"> All Outbreaks </nuxt-link>
        <nuxt-link v-if="$auth.user.userType === 'BHS' || $auth.user.userType === 'RHU' || $auth.user.userType === 'CHO' ||
        $auth.user.userType === 'govtHosp' || $auth.user.userType === 'privHosp' || $auth.user.userType === 'clinic' ||
        $auth.user.userType === 'govtLab' || $auth.user.userType === 'privLab' || $auth.user.userType === 'airseaPort' ||
        $auth.user.userType === 'techStaff'"
        to="/allPatients"> All Patients </nuxt-link>
        <nuxt-link v-if="$auth.user.userType === 'pidsrStaff' || $auth.user.userType === 'techStaff' ||
        $auth.user.userType === 'BHS' || $auth.user.userType === 'RHU' || $auth.user.userType === 'CHO' ||
        $auth.user.userType === 'govtHosp' || $auth.user.userType === 'privHosp' || $auth.user.userType === 'clinic' ||
        $auth.user.userType === 'govtLab' || $auth.user.userType === 'privLab' || $auth.user.userType === 'airseaPort'" 
        to="/caseDefs"> Case Definitions </nuxt-link>
      </div>
    </div>
    <div
      v-if="$auth.user.userType === 'fhsisStaff' || $auth.user.userType === 'techStaff' || $auth.user.userType === 'BHS' ||
      $auth.user.userType === 'RHU' || $auth.user.userType === 'CHO' || $auth.user.userType === 'clinic'" 
      class="dropdown"
    >
      <button class="dropbtn">
        Program Surveillance
        <i class="fa fa-caret-down"></i>
      </button>
      <div class="dropdown-content">
        <nuxt-link to="/addImmunizationProg"> Add Immunization Program </nuxt-link>
        <nuxt-link to="/allImmunizationProg"> Immunization Program Reports </nuxt-link>
        <nuxt-link to="/addProgAccomplish"> Add Accomplishment Report </nuxt-link>
        <nuxt-link to="/allProgAccomplish"> Accomplishment Reports </nuxt-link>
        <nuxt-link to="/progTargets"> Program Targets </nuxt-link>
      </div>
    </div>
    <div 
      v-if="$auth.user.userType === 'pidsrStaff' || $auth.user.userType === 'fhsisStaff' || $auth.user.userType === 'techStaff' ||
      $auth.user.userType === 'BHS' || $auth.user.userType === 'RHU' || $auth.user.userType === 'CHO' ||
      $auth.user.userType === 'govtHosp' || $auth.user.userType === 'privHosp' || $auth.user.userType === 'clinic' ||
      $auth.user.userType === 'govtLab' || $auth.user.userType === 'privLab' || $auth.user.userType === 'airseaPort'"
      class="dropdown">
      <button class="dropbtn">
        ESR
        <i class="fa fa-caret-down"></i>
      </button>
      <div class="dropdown-content">
        <nuxt-link to="/addHealthEvent"> Add Health Event </nuxt-link>
        <nuxt-link to="/allHealthEvents"> View Health Events </nuxt-link>
      </div>
    </div>

    <div v-if="$auth.user.userType === 'pidsrStaff' || $auth.user.userType === 'fhsisStaff' || $auth.user.userType === 'techStaff'"
      class="dropdown">
      <button class="dropbtn">
        Reports and Analytics
        <i class="fa fa-caret-down"></i>
      </button>
      <div class="dropdown-content">
        <nuxt-link to="/addReport"> Add Feedback Report </nuxt-link>
        <nuxt-link to="/analytics"> View Analytics </nuxt-link>
        <nuxt-link to="/allReports"> All Feedback Reports </nuxt-link>
      </div>
    </div>
    <nuxt-link
      v-if="$auth.user.userType === 'lhsdChief' || $auth.user.userType === 'aehmdChief' || 
      $auth.user.userType === 'resuHead' || $auth.user.userType === 'chdDirector'"
      to="/allReports"> 
      Reports
    </nuxt-link>
    <nuxt-link v-if="$auth.user.userType === 'idpcStaff' || $auth.user.userType === 'eohStaff' || $auth.user.userType === 'hemStaff'" to="/allCases"> Case Reports </nuxt-link>
    <nuxt-link v-if="$auth.user.userType === 'idpcStaff' || $auth.user.userType === 'eohStaff' || $auth.user.userType === 'hemStaff'" to="/allOutbreaks"> Outbreaks </nuxt-link>
    <nuxt-link to="/bulletin"> Feedback Bulletin </nuxt-link>
    <nuxt-link to="/evaluation"> Evaluation </nuxt-link>
    <nuxt-link v-if="$auth.user.userType === 'lhsdChief' || $auth.user.userType === 'resuHead' || $auth.user.userType === 'chdDirector'" to="/caseDefs"> Case Definitions </nuxt-link>
    <div v-if="$auth.user.userType === 'lhsdChief' || $auth.user.userType === 'aehmdChief' || 
      $auth.user.userType === 'resuHead' || $auth.user.userType === 'chdDirector' || $auth.user.userType === 'techStaff'" class="dropdown">
      <button class="dropbtn">
        Users
        <i class="fa fa-caret-down"></i>
      </button>
      <div class="dropdown-content">
        <nuxt-link to="/addUser"> Add User </nuxt-link>
        <nuxt-link to="/allUsers"> All Users </nuxt-link>
      </div>
    </div>
    

    <div class="topnav-right-inside">
      <nuxt-link to="/notifications"> Notification </nuxt-link>
      <div class="dropdown">
        <button class="dropbtn">
          My Account
          <i class="fa fa-caret-down"></i>
        </button>
        <div class="dropdown-content">
          <nuxt-link v-if="$auth.loggedIn" to="/myProfile"> My Profile </nuxt-link>
          <nuxt-link v-if="$auth.loggedIn" to="/settings"> Settings </nuxt-link>
          <nuxt-link v-if="$auth.loggedIn" to="/logout" @click="$auth.logout()"> Logout </nuxt-link>
        </div>
      </div>
    </div>

    <a href="javascript:void(0);" class="icon" @click="responsive()">&#9776;</a>

    <div class="topnav-right">
      <button class="notification" @click="goToNotifs()">
        <i class="fa fa-bell fa-sm"></i>
        <span id="notif-num" class="badge">{{ newNotifs }}</span>
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
          <div v-if="$auth.loggedIn" style="width: inherit;" @click="$auth.logout()">
            <nuxt-link to='/login'> Logout </nuxt-link> 
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require('axios');
export default {
   data() {
    return {
      newNotifs: 0,
    }
  },
  async fetch(){
    // get number of new notifications
    const count = (await axios.get('http://localhost:8080/api/getNewNotifs?userID=' + this.$auth.user.userID)).data;
    this.newNotifs = count.newNotifCount;
  },
  mounted(){
    // window.clearInterval(window.interval);
    // this.checkOutbreak();
  },
  methods: {
    responsive() {
      const x = document.getElementById('myTopnav');
      if (x.className === 'topnav') {
        x.className += ' responsive';
      } else {
        x.className = 'topnav';
      }
    },
    goToNotifs() {
      window.location.href = 'http://localhost:3000/notifications';
    },
    checkOutbreak(){
      window.interval = setInterval(() => {
         this.$toast.success('Entered Interval' + this.newNotifs, {duration: 4000, icon: 'check_circle'});
         this.newNotifs = this.newNotifs + 1;
      }, 5000)
    }
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
  background-image: none;
}

.topnav-right-inside {
  display: none;
  background-image: none;
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
  background-image: none;
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