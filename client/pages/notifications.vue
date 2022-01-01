<template>
  <div>
    <TopNav/>
    <div class="notif-container">
      <p v-if="notifs.length === 0" style="padding: 20px;"> No notifications available. </p>
      <ul v-if="notifs.length > 0">
        <li v-for="(value, name, i) in notifs" :key="i" class="each-notif" @click="goTo(value.redirectTo)">
          <img v-if="value.type==='pushDataNotif'" class="notif-icon" src="../assets/img/pushdata.png"/>
          <img v-if="value.type==='updateNotif'" class="notif-icon" src="../assets/img/update.png"/>
          <img v-if="value.type==='caseNotif'" class="notif-icon" src="../assets/img/case.png"/>
          <img v-if="value.type==='deadlineNotif'" class="notif-icon" src="../assets/img/deadline.png"/>
          <img v-if="value.type==='feedbackNotif'" class="notif-icon" src="../assets/img/feedback.png"/>
          <!-- Message inside is only a sample -->
          <div class="notif-msg"> {{value.message}} </div>
          <div class="notif-time"> {{value.dateString}} </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const axios = require('axios');
export default {
  middleware: 'is-auth',
  data() {
    return {
      notifs: []
    }
  },
  async fetch() {
    // need to fetch notifs here
    const rows = (await axios.get('http://localhost:8080/api/getNotifs?userID=' + this.$auth.user.userID)).data;
    // create dateString for notif-time
    const currentDate = new Date();
    const filtNotifs = [];
    let dateDiff;
    
    for (const e of rows) {
      dateDiff = currentDate - new Date(e.dateCreated);
      
      if (dateDiff < (1000 * 60 * 60)) // within an hour
        e.dateString = Math.floor(dateDiff / (1000 * 60)) + "min";
      else if (dateDiff < (1000 * 60 * 60 * 24)) // within the day
        e.dateString = Math.floor(dateDiff / (1000 * 60 * 60)) + "h";
      else if (dateDiff < (1000 * 60 * 60 * 24 * 14)) // within 14 days
        e.dateString = Math.floor(dateDiff / (1000 * 60 * 60 * 24)) + "d";
      if (e.dateString) filtNotifs.push(e);
    }
    this.notifs = filtNotifs;
  },
  methods: {
    goTo(link) {
        window.location.href = link;
    }
  }
    
}
</script>

<style>
  body {
      font-family: 'Work Sans', sans-serif;
      font-weight: 300;
      padding: 0px;
      margin: 0px;
      background-image: none;
  }

  .notif-container {
    width: 600px;
    height: fit-content;
    margin: auto;
    margin-top: 70px;
    margin-bottom: 10px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  }

  .each-notif {
    width: 600px;
    height: 100px;
    background-color: white;
    border-radius: 10px;
    border: 0 0 0 1px black;
    padding: 10px;
    display: flex;
    flex-direction: row;
  }

  .notif-msg {
    width: 480px;
    max-height: 100px;
    margin-left: 15px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-left: 10px;
    font-size: 14px;
    margin: auto;
  }

  .notif-time {
    font-size: 12px;
    padding-right: 5px;
  }

  .each-notif:hover {
    background-color: #f2f2f2;
  }

  .notif-icon {
    width: 65px;
    height: 65px;
    margin: auto;
  }

  @media only screen and (max-width: 600px) {
    .notif-container,
    .each-notif,
    .notif-msg {
      width: 90%;
    }
  }
</style>