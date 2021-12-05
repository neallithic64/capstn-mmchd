<template>
  <div>
    <TopNav/>
    <div class="notif-container">
      <ul>
        <!-- one notif item -->
        <li class="each-notif" @click="goTo('http://localhost:3000/editCaseDefs')">
          <!-- place v-ifs to check which icon to display in the notif -->
          <!-- v-if notifType=pushDataNotif -->
          <img class="notif-icon" src="../assets/img/pushdata.png"/>
          <!-- v-if notifType=updateNotif
          <img class="notif-icon" src="../assets/img/update.png"/>
          v-if notifType=caseNumNotif
          <img class="notif-icon" src="../assets/img/case.png"/>
          v-if notifType=deadlineNotif
          <img class="notif-icon" src="../assets/img/deadline.png"/>
          v-if notifType=feedbackNotif
          <img class="notif-icon" src="../assets/img/feedback.png"/> -->

          <!-- Message inside is only a sample -->
          <div class="notif-msg"> <b> SUBMISSION UPDATE: </b> Your Case Report Forms for Week 21 has been automatically pushed to MMCHD-RESU. </div>
          <div class="notif-time"> 1h </div>
        </li>

        <!-- All stuff below are just for examples. -->
        <li class="each-notif">
          <img class="notif-icon" src="../assets/img/case.png"/>
          <div class="notif-msg"> <b> WARNING: </b> RITM submitted the 15th Malaria case detected in Taguig City. </div>
          <div class="notif-time"> 1h </div>
        </li>
        <li class="each-notif">
          <img class="notif-icon" src="../assets/img/deadline.png"/>
          <div class="notif-msg"> <b> REMINDER: </b> Please submit your Case Report Forms by Friday. If not submitted, forms will be automatically collected on Friday, 5:00PM. </div>
          <div class="notif-time"> 1h </div>
        </li>
        <li class="each-notif">
          <img class="notif-icon" src="../assets/img/feedback.png"/>
          <div class="notif-msg"> <b> FEEDBACK: </b> FEEDBACK: A feedback report for Dengue has been posted on the feedback bulletin.  </div>
          <div class="notif-time"> 1h </div>
        </li>
        <li class="each-notif">
          <img class="notif-icon" src="../assets/img/update.png"/>
          <div class="notif-msg"> <b> CASE UPDATE: </b> The case level of Malaria Case No. 12345 has been updated to Laboratory-confirmed. </div>
          <div class="notif-time"> 1h </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'is-auth',
  data() {
    return {
      notifs: {}
    }
  },
  fetch() {
    // need to fetch notifs here
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