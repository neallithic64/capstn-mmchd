<template>
  <div>
    <TopNav/>
    <form class="settings-container" type="submit">
      <div class="each-setting">
        <div class="auto-submit-top">
          <p style="padding: 20px; font-weight: 400;"> Automatic Data Submission </p>
          <label v-if="$auth.user.userType === 'BHS' || $auth.user.userType === 'RHU' || $auth.user.userType === 'clinic' || 
                  $auth.user.userType === 'privHosp' || $auth.user.userType === 'privLab' || $auth.user.userType === 'govtLab' || 
                  $auth.user.userType === 'airseaPort' || $auth.user.userType === 'govtHosp' || $auth.user.userType === 'CHO'" class="switch">
            <input id="consent" v-model="cronDetails.consent" type="checkbox" @change="hasChanged('checkbox')">
            <span class="slider round"></span>
          </label>
        </div>
        <div v-if="$auth.user.userType === 'pidsrStaff' || $auth.user.userType === 'techStaff' || $auth.user.userType === 'lhsdChief' 
            || $auth.user.userType === 'resuHead' || $auth.user.userType === 'chdDirector' || $auth.user.userType === 'fhsisStaff'">

          <input 
            id="cronUser"
            v-model="cronDetails.userID"
            type="hidden"
            name="cronUser"
            class="cronInputField"
          />

          <div class="field-row-straight-cron">
            <div class="field">
              <label for="cronDay" class="cronLabel"> Submission Day </label>
                <select id="cronDay" v-model="cronDetails.day" class="cronInputField"
                  name="cronDay" @change="hasChanged('day')">
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
            </div>

            <div class="field">
              <div style="display: flex; flex-direction: row;">
                <label for="cronTime" class="cronLabel"> Submission Time </label>
                <!-- <button
                    class="tooltip"
                    data-tooltip="The time the health event was captured"
                    data-tooltip-location="bottom">
                    <img class="tooltip-icon-img" src="~/assets/img/infoicon.png" />    
                </button> -->
              </div>
              <input 
                id="cronTime"
                v-model="cronDetails.time"
                type="time"
                value="17:00"
                name="cronTime"
                class="cronInputField"
                @change="hasChanged('time')"
              />
            </div>
          </div>
        </div>

        <div>
          <p v-if="dayChange == true || timeChange == true" class="cronRemind"> Sure? Next automatic data submit will be on {{ cronDetails.day }} at {{ cronDetails.time }}. </p>
        </div>

        <div style="display: flex; flex-direction: row; justify-content: flex-end; padding-right: 25px;">
          <p v-if="dayChange == true || timeChange == true || consentChange == true" class="cronRemind"> Please do not forget to save your changes! </p>
          <button id="cronSave" class="cronButton" type="button" @click="save()"> Save </button>
        </div>

      </div>
    </form>
  </div>
</template>

<script>
const axios = require('axios');
export default {
  middleware: 'is-auth',
  data() {
    return {
      cronDetails: {
        day: 'Friday',
        time: '17:00',
        userID: '',
        consent: '',
      },
      dayText: 'Friday',
      consentChange: false,
      dayChange: false,
      timeChange: false,
    }
  },
  async fetch() {
    // dummy code first
    const rows = (await axios.get('http://localhost:8080/api/getNotifs?userID=' + this.$auth.user.userID)).data;
	console.log(rows);
	
	// setting form field
	this.cronDetails.userID = this.$auth.user.userID;
  },
  head() {
    return {
      title: 'Settings'
    }
  },
  methods: {
    hasChanged(type) {
      if (type === 'day')
        this.dayChange = true;
      else if (type === 'time')
        this.timeChange = true;
      else if (type === 'checkbox')
        this.consentChange = true;
    },
    async save() {
      switch (this.cronDetails.day) {
        case "Sunday": this.dayText = 0; break;
        case "Monday": this.dayText = 1; break;
        case "Tuesday": this.dayText = 2; break;
        case "Wednesday": this.dayText = 3; break;
        case "Thursday": this.dayText = 4; break;
        case "Friday": this.dayText = 5; break;
        case "Saturday": this.dayText = 6; break;
      }
      this.dayChange = false;
      this.timeChange = false;
      this.consentChange = false;
	  const settingsData = await axios.post("http://localhost:8080/api/updateSettings", {
		cronDetails: this.cronDetails
	  });
	  console.log(settingsData);
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

  .settings-container {
    width: 600px;
    height: fit-content;
    margin: auto;
    margin-top: 70px;
    margin-bottom: 10px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    padding-bottom: 10px;
  }

  .auto-submit-top {
    font-family: 'Work Sans', sans-serif;
    width: 600px;
    height: fit-content;
    background-color: white;
    border-radius: 10px;
    border: 0 0 0 1px black;
    padding: 8px;
    display: flex;
    flex-direction: row;
  }

  .each-setting {
    font-family: 'Work Sans', sans-serif;
    width: 600px;
    height: fit-content;
    background-color: white;
    border-radius: 10px;
    border: 0 0 0 1px black;
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
  }
  
  .switch {
    margin-top: 13px;
    margin-left: 43%;
    position: relative;
    width: 60px;
    height: 34px;
  }

  @media only screen and (max-width: 600px) {
    .settings-container,
    .auto-submit-top {
      width: 90%;
      font-size: 12px;
    }

    .switch {
      margin-left: 35%;
      width: 60px;
      margin-top: 20px;
    }
  }

  

  .switch input { 
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked + .slider {
    background-color: #2196F3;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }

  .field-row-straight-cron {
    width: 100%;
    display: flex;
    flex-direction: row;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 15px;
  }

  @media only screen and (max-width: 950px) {
    .field-row-straight {
      /* flex-direction: column; */
      margin: 0;
      width: 98%;
    }
  }

  .field {
    width: 100%;
    padding: 0px 7px;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    padding-bottom: 5px;
  }

  .cronLabel {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
  }

  .cronInputField {
    height: 30px;
    width: 100%;
    text-align: left;
    font-size: 16px;
    border-style: solid;
    border-width: 1px;
    border-radius: 10px;
    border-color:lightgray;
    padding-left: 5px;
  }

  .cronButton {
    width: 100px;
    height: 30px;
    max-width: 100%;
    font-size: 14px;
    margin-top: 0px;
    font-family: 'Work Sans', sans-serif;
    font-weight: 600;
    background-color: #346083;
    color: white;
    border: #346083 solid 0.75px;
  }

  .cronButton:hover {
    background-color: #008d41;
    color: white;
    border: #008d41 solid 0.75px;
  }

  .cronRemind {
    color: red;
    font-size: 14px;
    margin-left: 25px;
    margin-bottom: 10px;
    margin-right: 10px;
    padding-top: 5px;
  }
</style>