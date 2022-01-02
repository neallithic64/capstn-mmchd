<template>
  <div>
    <TopNav/>
    <div class="case-container">
      <!--SUMMARY: left side-->
      <div class="form-summary-container">
        <div class="form-summary">
          <button id="login-submit" type="submit" style="width: 210px; text-align: left" @click="isOpen = !isOpen">
            <h2 style="font-weight: 600">Event-based Surveillance</h2>
          </button>

          <div v-if="isOpen" class="form-contents">
            <div v-for="(value, name, i) in formSection.formNames" :key="i">
              <!-- <div v-if="i > 1" :id="name" :class="formColor(i - 1)"> -->
              <button :id="name" :class="formColor(i)" @click="move(i)">
                {{ i+1 }}. {{ value }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!--Everything in the right-->
      <div class="form-section-container">
        <!--Name of form-->
        <div class="disease-name">
          <h1 style="margin: 0; font-weight: 600; font-size: 24px">
            Add Health Event
          </h1>
          <p style="margin: 0 5px 5px 0px; font-size: 16px">
            Please fill up the form with complete and correct information.
          </p>
        </div>

        <!--Form itself-->
        <div class="form-component">
          <!-- Source Details (Form 1) -->
          <form v-if="pageNum == 0 || pageNum == Object.keys(formSection.formNames).length" id="newUserType" type="submit">
            <div id="new-user-form" class="center">
              <h2 id="form-header"> {{ Object.values(formSection.formNames)[0] }} </h2>
              <div class="field-row-straight">
                <div class="name-field">
                  <div style="display: flex; flex-direction: row;">
                    <label for="dateCaptured" class="required"> Date Captured </label>
                    <button
                        class="tooltip"
                        data-tooltip="The date the health event was captured"
                        data-tooltip-location="bottom">
                        <img class="tooltip-icon-img" src="~/assets/img/infoicon.png" />    
                    </button>
                  </div>
                  <input id="dateCaptured" 
                    v-model="healthEvent.dateCaptured"
                    :class="isRequired()"
                    type="date"
                    name="dateCaptured"
                    :disabled="inputEdit()"
                    required
                    @change="validateTime()"/>
                </div>

                <div class="field">
                  <div style="display: flex; flex-direction: row;">
                    <label for="timeCaptured" class="required"> Time Captured</label>
                    <button
                        class="tooltip"
                        data-tooltip="The time the health event was captured"
                        data-tooltip-location="bottom">
                        <img class="tooltip-icon-img" src="~/assets/img/infoicon.png" />    
                    </button>
                  </div>
                  <input 
                    id="timeCaptured"
                    v-model="healthEvent.timeCaptured"
                    :class="isRequired()"
                    type="time"
                    name="timeCaptured"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
              </div>

              <div class="field">
                <div style="display: flex; flex-direction: row;">
                  <label for="source" class="required"> Source </label>
                  <button
                      class="tooltip"
                      data-tooltip="The primary source of information"
                      data-tooltip-location="bottom">
                      <img class="tooltip-icon-img" src="~/assets/img/infoicon.png" />    
                  </button>
                </div>
                <div style="display: inline-flex; align-items: center">
                  <input
                    id="print"
                    v-model="healthEvent.source"
                    value="Print"
                    class="input-radio"
                    :class="optionsRequired()"
                    name="source"
                    type="radio"
                    :disabled="inputEdit()"
                    required
                  />
                  <label for="print"> Print </label>
                </div>
                <div style="display: inline-flex; align-items: center">
                  <input
                    id="internet"
                    v-model="healthEvent.source"
                    value="Internet"
                    class="input-radio"
                    :class="optionsRequired()"
                    name="source"
                    type="radio"
                    :disabled="inputEdit()"
                    required
                  />
                  <label for="internet"> Internet </label>
                </div>
                <div style="display: inline-flex; align-items: center">
                  <input
                    id="television"
                    v-model="healthEvent.source"
                    value="Television"
                    class="input-radio"
                    :class="optionsRequired()"
                    name="source"
                    type="radio"
                    :disabled="inputEdit()"
                    required
                  />
                  <label for="television"> Television </label>
                </div>
                <div style="display: inline-flex; align-items: center">
                  <input
                    id="radioSource"
                    v-model="healthEvent.source"
                    value="Radio"
                    class="input-radio"
                    :class="optionsRequired()"
                    name="source"
                    type="radio"
                    :disabled="inputEdit()"
                    required
                  />
                  <label for="radioSource"> Radio </label>
                </div>
                <div style="display: inline-flex; align-items: center">
                  <input
                    id="doh"
                    v-model="healthEvent.source"
                    value="DOH"
                    class="input-radio"
                    :class="optionsRequired()"
                    name="source"
                    type="radio"
                    :disabled="inputEdit()"
                    required
                  />
                  <label for="doh"> DOH </label>
                </div>
                <div>
                  <input
                    id="public"
                    v-model="healthEvent.source"
                    value="Public"
                    class="input-radio"
                    :class="optionsRequired()"
                    name="source"
                    type="radio"
                    :disabled="inputEdit()"
                    required
                  />
                  <label for="public"> Public </label>
                </div>
              </div>

              <div class="name-field">
                <div style="display: flex; flex-direction: row;">
                  <label for="reportSource" class="required"> Reporting Source </label>
                  <button
                      class="tooltip"
                      data-tooltip="The name of agency or facility reporting the event"
                      data-tooltip-location="bottom">
                      <img class="tooltip-icon-img" src="~/assets/img/infoicon.png" />    
                  </button>
                </div>
                <input id="reportSource" 
                  v-model="healthEvent.reportSource"
                  :class="isRequired()"
                  type="text"
                  name="reportSource"
                  :disabled="inputEdit()"
                  required
                />
              </div>
            </div>
          </form>

          <!-- Source Details (Form 1) -->
          <form v-if="pageNum == 1 || pageNum == Object.keys(formSection.formNames).length" id="newUserType" type="submit">
            <div id="new-user-form" class="center">
              <h2 id="form-header"> {{ Object.values(formSection.formNames)[1] }} </h2>

              <div class="name-field">
                <div style="display: flex; flex-direction: row;">
                  <label for="eventDetails" class="required"> Health Event </label>
                  <button
                      class="tooltip"
                      data-tooltip="Describe the health event captured (e.g. chemical spillage, cases of fever, etc.)"
                      data-tooltip-location="bottom">
                      <img class="tooltip-icon-img" src="~/assets/img/infoicon.png" />    
                  </button>
                </div>
                <textarea 
                  id="eventDetails"
                  v-model="healthEvent.eventDetails"
                  class="textarea-form-field"
                  :class="textareaRequired()"
                  type="text"
                  name="eventDetails"
                  :disabled="inputEdit()"
                  required
                />
              </div>

              <!-- Location -->
              <div class="field-row" style="margin-left: 0px">
                <div class="field">
                  <div style="display: flex; flex-direction: row;">
                    <label for="locHouseStreet" class="required"> Street / House No. </label>
                    <button
                      class="tooltip"
                      data-tooltip="The place of the event"
                      data-tooltip-location="bottom">
                      <img class="tooltip-icon-img" src="~/assets/img/infoicon.png" />    
                    </button>
                  </div>
                  <input
                    id="locHouseStreet"
                    v-model="healthEvent.locHouseStreet"
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
              </div>

              <div class="field-row-straight">
                <div class="name-field">
                  <label for="locCity" class="required"> City </label>
                  <select id="locCity" v-model="healthEvent.locCity"
                    :class="isRequired()"
                    name="locCity"
                    :disabled="inputEdit()"
                    required
                    @change="getLocBrgyList()">
                    <option value="Caloocan">Caloocan</option>
                    <option value="Las Piñas">Las Piñas</option>
                    <option value="Makati">Makati</option>
                    <option value="Malabon">Malabon</option>
                    <option value="Mandaluyong">Mandaluyong</option>
                    <option value="Manila">Manila</option>
                    <option value="Marikina">Marikina</option>
                    <option value="Muntinlupa">Muntinlupa</option>
                    <option value="Navotas">Navotas</option>
                    <option value="Parañaque">Parañaque</option>
                    <option value="Pasay">Pasay</option>
                    <option value="Pasig">Pasig</option>
                    <option value="Quezon City">Quezon City</option>
                    <option value="San Juan">San Juan</option>
                    <option value="Taguig">Taguig</option>
                    <option value="Valenzuela">Valenzuela</option>
                  </select>
                </div>

                <div class="field">
                  <label for="locBrgy" class="required"> Barangay </label>
                  <select
                    id="locBrgy"
                    v-model="healthEvent.locBrgy"
                    :class="isRequired()"
                    name="locBrgy"
                    :disabled="inputEdit()"
                    required
                  >
                    <!-- <option v-for="(brgy, i) in brgyList" :key = "i" :value="brgy"> 
                      {{ brgy }} 
                    </option> -->
                  </select>
                </div>
              </div>

              <!-- Cases -->
              <div class="field-row-straight">
                <div class="field">
                  <div style="display: flex; flex-direction: row;">
                    <label for="numCases" class="required"> Number of Cases </label>
                    <button
                      class="tooltip"
                      data-tooltip="The number of people affected (this can be an estimate)"
                      data-tooltip-location="bottom">
                      <img class="tooltip-icon-img" src="~/assets/img/infoicon.png" />    
                    </button>
                  </div>
                  <input
                    id="numCases"
                    v-model="healthEvent.numCases"
                    :class="isRequired()"
                    type="number"
                    min="0"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
                <div class="field">
                  <div style="display: flex; flex-direction: row;">
                    <label for="numDeaths" class="required"> Number of Deaths </label>
                    <button
                      class="tooltip"
                      data-tooltip="The number of reported deaths"
                      data-tooltip-location="bottom">
                      <img class="tooltip-icon-img" src="~/assets/img/infoicon.png" />    
                    </button>
                  </div>
                  
                  <input
                    id="numDeaths"
                    v-model="healthEvent.numDeaths"
                    :class="isRequired()"
                    type="number"
                    min="0"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
              </div>

              <!-- Remarks -->
              <div class="field-row" style="margin-left: 0px">
                <div class="field">
                  <label for="remarks">
                    Remarks
                  </label>
                  <textarea 
                    id="remarks"
                    v-model="healthEvent.remarks"
                    class="textarea-form-field"
                    type="text"
                    name="remarks"
                    :disabled="inputEdit()"/>
                </div>
              </div>
            </div>
          </form>

        </div>

        <!-- Buttons -->
        <div style="margin: -10px 0 5px; float: right">
          <button v-if="pageNum == 0" class="back-button" type="button">
            <nuxt-link to="/"> Cancel </nuxt-link>
          </button>
          <button v-if="pageNum != 0" class="back-button" type="button" @click="move(pageNum - 1)">
            Back
          </button>
          <button v-if="pageNum < Object.keys(formSection.formNames).length - 1" class="next-button" type="button" @click="move(pageNum + 1)">
            Next
          </button>
          <button v-if="pageNum == Object.keys(formSection.formNames).length - 1" class="next-button" type="button" @click="move(pageNum + 1)">
            Review
          </button>
          <button v-if="pageNum == Object.keys(formSection.formNames).length" class="next-button" type="button" @click="submit()">
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  middleware: 'is-auth',
  data() {
    return {
      isOpen: true,
      pageNum: 0,
      locBrgyList: [],
      pageDone: [true,true],
      healthEvent: {
        eventID:'',
        userID:'',
        eventStatus:'forValidation',
        dateCaptured: '',
        timeCaptured: '',
        source: '',
        reportSource: '',
        eventDetails: '',
        locHouseStreet: '',
        locCity: '',
        locBrgy: '',
        numCases: '',
        numDeaths: '',
        remarks: ''
      },
      formSection: {
        formNames: {
          form1: 'Source Details',
          form2: 'Health Event Details'
        }
      }
    }
  },
  mounted() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    const yyyy = today.getFullYear();
    if(dd<10){
      dd='0'+dd
    } 
    if(mm<10){
      mm='0'+mm
    } 

    today = yyyy+'-'+mm+'-'+dd;
    document.getElementById('dateCaptured').setAttribute('max', today);
  },
  methods: {
    formColor(index) {
      if (this.isOpen) {
        if (index === this.pageNum) return 'formnum formnumcurr';
        else if (index < this.pageNum) return 'formnum formnumdone';
        else if (index > this.pageNum) return 'formnum';
      }
    },
    validateForm() {
      switch (this.pageNum) {
        case 0:
          if (this.healthEvent.dateCaptured !== '' &&
          this.healthEvent.timeCaptured !== '' &&
          this.healthEvent.source !== null &&
          this.healthEvent.reportSource !== ''
          ) this.pageDone[this.pageNum] = true;
          else {
            this.pageDone[this.pageNum] = false;
          }
        break;
        case 1:
          if (this.healthEvent.eventDetails !== '' &&
          this.healthEvent.locHouseStreet !== '' &&
          this.healthEvent.locCity !== '' &&
          (this.healthEvent.locBrgy !== '' && this.healthEvent.locBrgy !== "Choose Barangay") &&
          this.healthEvent.numCases !== '' &&
          this.healthEvent.numDeaths !== ''
          ) this.pageDone[this.pageNum] = true;
          else this.pageDone[this.pageNum] = false;
        break;
      }
      // eslint-disable-next-line no-console
      console.log(this.pageDone);
    },
    validateTime() {
      // eslint-disable-next-line no-console
      console.log(this.healthEvent.dateCaptured);

      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth()+1;
      const yyyy = today.getFullYear();
      let hours = today.getHours();
      let mins = today.getMinutes();
      if(dd<10) {
        dd='0'+dd
      } if(mm<10) {
        mm='0'+mm
      } if(hours<10) {
        hours='0'+hours
      } if(mins<10) {
        mins='0'+mins
      } 

      today = yyyy+'-'+mm+'-'+dd;
      const time = hours+':'+mins;

      if (this.healthEvent.dateCaptured === today) {
        document.getElementById('timeCaptured').value = time;
        this.healthEvent.timeCaptured = time;
      }

      // eslint-disable-next-line no-console
      console.log(this.healthEvent.timeCaptured)
    },
    async submit() {
      try {
        this.healthEvent.userID = this.$auth.user.userID;
        const result = await axios.post('http://localhost:8080/api/newEvent', {event: this.healthEvent});
        // eslint-disable-next-line no-console
        console.log(result);
        this.$router.push('/');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    },
    move(page) {
      // eslint-disable-next-line no-console
      console.log(page);
      this.validateForm();
      if (this.pageDone[this.pageNum] || this.pageNum === 2) {
        this.pageNum = page;
      } else {
        alert('Please fill up the required fields');
        this.$forceUpdate(); 
      }

      this.$nextTick(() => {
        // if ((page === 1 || page === 3) && this.healthEvent.locBrgy != null) {
        //   for (let i = 0; i < this.locBrgyList.length; i++) {
        //     const option = document.createElement('option');
        //     option.text = this.locBrgyList[i];
        //     option.value = this.locBrgyList[i];
        //     document.getElementById('locBrgy').add(option);
        //     if (this.healthEvent.locBrgy === this.locBrgyList[i])
        //       document.getElementById('locBrgy').selectedIndex = i+1;
        //   }
        // }
        if (((page === 1 || page === 3) && this.pageNum !== 0) && this.healthEvent.locBrgy != null) {
          const defaultOption = document.createElement('option');
          defaultOption.text = this.healthEvent.locBrgy;
          defaultOption.value = this.healthEvent.locBrgy;
          document.getElementById('locBrgy').add(defaultOption);
          document.getElementById('locBrgy').selectedIndex = 0;
        }
      })

      // eslint-disable-next-line no-console
      console.log(this.healthEvent.locBrgy);
    },
    inputEdit() {
      if (this.pageNum === Object.keys(this.formSection.formNames).length) {
        return true;
      } else return false;
    },
    isRequired() {
      if (this.pageDone[this.pageNum]) return "input-form-field";
      else return "input-form-field input-required";
    },
    optionsRequired() {
      if (!this.pageDone[this.pageNum]) return "input-required";
    },
    textareaRequired() {
      if (this.pageDone[this.pageNum]) return "textarea-form-field";
      else return "textarea-form-field input-required";
    },
    getLocBrgyList() {
      // eslint-disable-next-line no-console
      console.log(this.healthEvent.locCity);
      const dropdown1 = document.getElementById('locBrgy');
      while (dropdown1.firstChild) dropdown1.removeChild(dropdown1.firstChild);

      const defaultOption = document.createElement('option');
      defaultOption.text = 'Choose Barangay';

      dropdown1.add(defaultOption);
      dropdown1.selectedIndex = 0;

      axios.get('barangays.json').then(res => {
          let option;

          this.locBrgyList = res.data[this.healthEvent.locCity].barangay_list;

          for (let i = 0; i < this.locBrgyList.length; i++) {
            option = document.createElement('option');
            option.text = this.locBrgyList[i];
            option.value = this.locBrgyList[i];
            dropdown1.add(option);
          }
        })
        // eslint-disable-next-line no-console
        .catch(err => console.log(err))
    },
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

  .input-required:invalid { 
    box-shadow: 0 0 5px #d45252;
    border-color: hsl(0, 76%, 50%);
    /* background-color: #ff6961; */
  }

  .input-required{
    border-color: hsl(0, 76%, 50%);
  }

  .case-container {
    margin: 70px 20px 5px 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: max-content;
  }

  @media only screen and (max-width: 800px) {
    .case-container {
      width: 100%;
      flex-direction: column;
      align-items: center;
      margin: 0px;
      margin-top: 85px;
    }
  }

  .form-summary {
    width: fit-content;
    height: fit-content;
    left: 23px;
    top: 97px;
    padding: 20px;
    z-index: -1;

    background: #f2f2f2;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
  }
  @media only screen and (max-width: 800px) {
    .form-summary {
      width: 100%;
      position: unset;
      height: fit-content;
      z-index: 3;
    }
  }

  .form-summary-container {
    position: fixed;
    width: fit-content;
    margin: 5px;
    padding: 5px;
  }

  @media only screen and (max-width: 800px) {
    .form-summary-container {
      width: 95%;
      position: sticky;
      margin: 0px;
    }
  }

  .disease {
    font-family: Work Sans;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 33px;
    margin: 0;
    color: #000000;
    text-align: center;
  }

  .error-message {
        color: #da4944;
        font-weight: 500;
        font-size: 12px;
  }

  .formnum {
    width: 200px;
    height: fit-content;
    margin: 5px;
    background: #ffffff;
    border: 1px solid #c4c4c4;
    box-sizing: border-box;
    border-radius: 10px;
    line-height: 30px;
    color: rgba(49, 49, 49, 0.5);
    padding: 2px;
    padding-left: 15px;
    font-family: 'Roboto', 'Open Sans', 'Helvetica Neue', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    display: flex;
  }

  /* .formnum:hover {
    color: #000000;
    font-weight: 800;
  } */

  @media only screen and (max-width: 800px) {
    .formnum {
      width: 98%;
      min-width: 200px;
    }
  }

  .formnumdone {
    background-color: #346083;
    color: white;
  }

  .formnumcurr {
    background-color: #53a262;
    color: white;
  }

  .form-section-container {
    left: 275px;
    position: relative;
    width: calc(100vw - 320px);
    /* margin: 5px; */
    padding: 5px;
  }

  @media only screen and (max-width: 800px) {
    .form-section-container {
      left: 0px;
      width: 95%;
    }
  }

  .disease-name {
    position: relative;
    top: -3px;
    z-index: 3;
  }
  @media only screen and (max-width: 800px) {
    .disease-name {
      position: relative;
      top: 0px;
    }
  }

  .form-component {
    position: relative;
    height: fit-content;
    width: 100%;
    top: -3px;

    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.25));
    background-color: #f2f2f2;
    border-radius: 15px;
    padding: 15px;
    z-index: 2;
    min-height: calc(100vh - 220px);
  }
  @media only screen and (max-width: 800px) {
    .form-component {
      position: relative;
      top: 0px;
      min-height: fit-content;
    }
  }

  .new-user-form {
    margin-top: 5px;
    width: 100%;
  }

  #form-header {
    text-align: left;
    padding-left: 5px;
    font-weight: 600;
    font-size: 20px;
    background-color: #008d41;
    color: transparent;
    text-shadow: 1px 1px, -1px -1px rgba(0, 0, 0, 0.25);
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
  }

  @media only screen and (max-width: 950px) {
    #form-header {
      text-align: center;
    }
  }

  .field-row-straight {
    width: 100%;
    display: flex;
    flex-direction: row;
    margin: 0 7px 6px 0px;
  }

  @media only screen and (max-width: 950px) {
    .field-row-straight {
      /* flex-direction: column; */
      margin: 0;
      width: 98%;
    }
  }

  .field-row {
    width: 100%;
    display: flex;
    flex-direction: row;
    margin: 0 7px 6px 5px;
  }

  @media only screen and (max-width: 950px) {
    .field-row {
      flex-direction: column;
      margin: 0 0 10px;
    }
  }

  .usertype-column {
    display: flex; 
    flex-direction: column; 
    margin-right: 50px;
  }

  @media only screen and (max-width: 950px) {
    .usertype-column {
      display: flex; 
      flex-direction: column; 
      margin-right: 0px;
    }
  }

  .name-field {
    width: 100%;
    padding: 0px 7px;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    padding-bottom: 5px;
  }

  .field {
    width: 100%;
    padding: 0px 7px;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    padding-bottom: 5px;
  }

  .halffield {
    width: 50%;
    padding: 0px 7px;
    font-size: 14px;
    display: flex;
    padding-bottom: 5px;
  }

  @media only screen and (max-width: 950px) {
    .name-field {
      width: 98%;
    }

    .halffield {
      width: 100%;
      flex-direction: column;
    }
  }

  .input-form-field,
  select {
    width: 100%;
    height: 30px;
    font-size: 16px;
    font-family: 'Work Sans', sans-serif;
    padding-right: 5px;
    padding-left: 5px;
    /* border: 1p x solid rgba(0, 0, 0, 0.25); */
    border: 1px solid #a3a3a3;
    box-sizing: border-box;
    border-radius: 9px;
  }

  .textarea-form-field {
    width: 100%;
    height: 100px;
    font-size: 16px;
    font-family: 'Work Sans', sans-serif;
    padding-right: 5px;
    padding-left: 5px;
    /* border: 1p x solid rgba(0, 0, 0, 0.25); */
    border: 1px solid #a3a3a3;
    box-sizing: border-box;
    border-radius: 9px;
  }

  .input-radio {
    /* width: 10%; */
    height: 15px;
    font-size: 16px;
    font-family: 'Work Sans', sans-serif;
    padding-right: 5px;
    padding-left: 5px;
    /* border: 1p x solid rgba(0, 0, 0, 0.25); */
    border: 1px solid #a3a3a3;
    box-sizing: border-box;
    border-radius: 9px;
    margin: 0 5px;
  }

  .input-checkbox {
    /* width: 10%; */
    height: 15px;
    font-size: 16px;
    font-family: 'Work Sans', sans-serif;
    padding-right: 5px;
    padding-left: 5px;
    /* border: 1p x solid rgba(0, 0, 0, 0.25); */
    border: 1px solid #a3a3a3;
    box-sizing: border-box;
    border-radius: 9px;
    margin: 0 5px;
  }

  .half-half {
    display: inline-flex;
  }

  .half-half1 {
    width: 45%;
  }

  .half-half2 {
    width: 55%;
  }

  .userType-field {
    /* width: 15%; */
    width: 100%;
  }

  @media only screen and (max-width: 950px) {
    .half-half,
    .half-half1,
    .half-half2 {
      width: 100%;
    }
    .userType-field {
      width: 50%;
    }
  }

  .tooltip-icon-img {
  width: 10px;
  height: 10px;
  margin-left: 5px;
  margin-right: 5px;
}

  label {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
  }

  .required:after {
    content: '*';
    color: red;
  }

  h3 {
    font-size: 15px;
    font-weight: 600;
  }

  .next-button {
    width: 150px;
    height: 38px;
    max-width: 100%;
    font-size: 16px;
    margin-top: 30px;
    font-family: 'Work Sans', sans-serif;
    font-weight: 600;
    background-color: #346083;
    color: white;
    border: #346083 solid 0.75px;
  }

  .next-button:hover {
    background-color: #346083;
  }

  .back-button {
    width: 150px;
    height: 38px;
    max-width: 100%;
    font-size: 16px;
    margin-top: 30px;
    font-family: 'Work Sans', sans-serif;
    font-weight: 600;
    background-color: white;
    color: #346083;
  }

  .back-button:hover {
    border: #346083 solid 1px;
  }

  input:disabled,
  select:disabled {
    background: #dddddd;
  }

  hr {
    margin: 20px 0;
  }

  .center-center {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
  }

  .show {
    display: unset;
  }

  .hide {
    display: none;
  }

  /* COLLAPSE EME BELOW */

  .collpaseWrapper {
    margin: 15px 0;
    padding: 15px auto;
    width: 100%;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .collapseLabel {
    display: block;
    cursor: pointer;
    padding: 10px;
    /* border: 1px solid #fff; */
    border-bottom: none;
    font-weight: 400;
  }

  .collapseLabel:hover {
    background: #346083;
    opacity: 0.85;
    color: white;
    font-weight: 600;
  }

  .collapseLabel.last {
    border-bottom: 1px solid #fff;
  }

  ul ul li {
    padding: 10px;
    background: white;
  }

  .collapseInput[type='checkbox'] {
    position: absolute;
    left: -9999px;
  }

  .collapseInput[type='checkbox'] ~ ul {
    height: 0;
    transform: scaleY(0);
  }

  .collapseInput[type='checkbox']:checked ~ ul {
    height: 100%;
    transform-origin: top;
    transition: transform 0.2s ease-out;
    transform: scaleY(1);
  }

  .collapseInput[type='checkbox']:checked + label {
    background: #346083;
    opacity: 0.85;
    color: white;
    font-weight: 500;
    border-bottom: 1px solid #fff;
  }

  /* SEARCH BAR ALL BELOW */

  .searchbar {
    background: #ffffff;
    border: 1px solid #a3a3a3;
    box-sizing: border-box;
    border-radius: 40px;
    width: 100%;
    height: 40px;
    padding: 10px 20px 10px 40px;

    height: 45px;
    border: none;
    font-size: 16px;
    outline: none;
    margin-top: -1px;

    /* background-image: url(../assets/img/search.svg); */
    background-image: url(https://cdn1.iconfinder.com/data/icons/hawcons/32/698956-icon-111-search-512.png);
    background-size: 20px;
    background-repeat: no-repeat;
    background-position: 15px 12.5px;
  }

  .bar {
    margin: 0 auto;
    width: 100%;
    height: 45px;
    border-radius: 40px;
    /* border: 1px solid #dcdcdc; */

    position: relative;
  }
  .bar:hover {
    box-shadow: 1px 1px 8px 1px #dcdcdc;
  }
  .bar:focus-within {
    box-shadow: 1px 1px 8px 1px #dcdcdc;
    outline: none;
  }

  .container {
    background: white;
    border-radius: 40px;
    width: 60%;
    margin: 0 auto;
  }

  #input_img {
    position: absolute;
    bottom: 8px;
    left: 10px;
    width: 30px;
    height: 30px;
  }

  .searchResult {
    padding: 5px 10px;
    border-bottom: 1px solid lightgray;
    display: inline-flex;
    flex-direction: row;
  }

  .searchResult:hover {
    background: #eeeeee;
  }

  .searchResultInfo {
    display: inline-flex;
    flex-direction: column;
  }

  .searchPerson {
    font-size: 16px;
    margin-bottom: -5px;
    font-weight: 400;
  }

  .searchAddress {
    font-size: 12px;
    font-weight: 200;
  }

  .searchPersonIcon {
    content: url('~/assets/img/personIcon.png');
    height: 25px;
    width: 25px;
    margin: auto 5px auto 0;
  }

  [data-tooltip] {
    position: relative;
    z-index: 10;
  }

  /* Positioning and visibility settings of the tooltip */
  [data-tooltip]:before,
  [data-tooltip]:after {
    position: absolute;
    visibility: hidden;
    opacity: 0;
    left: 50%;
    bottom: calc(100% + 5px); /* 5px is the size of the arrow */
    pointer-events: none;
    transition: 0.2s;
    will-change: transform;
    font-family: 'Work Sans', sans-serif;
  }

  /* The actual tooltip with a dynamic width */
  [data-tooltip]:before {
    content: attr(data-tooltip);
    padding: 9px 10px;
    min-width: 50px;
    max-width: 300px;
    width: max-content;
    width: -moz-max-content;
    border-radius: 6px;
    font-size: 10px;
    background-color: rgba(59, 72, 80, 0.9);
    background-image: linear-gradient(30deg,
      rgba(59, 72, 80, 0.44),
      rgba(59, 68, 75, 0.44),
      rgba(60, 82, 88, 0.44));
    box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.2);
    color: #fff;
    text-align: center;
    white-space: pre-wrap;
    transform: translate(-50%, -5px) scale(0.5);
  }

  /* Tooltip arrow */
  [data-tooltip]:after {
    content: '';
    border-style: solid;
    border-width: 5px 5px 0px 5px; /* CSS triangle */
    border-color: rgba(55, 64, 70, 0.9) transparent transparent transparent;
    transition-duration: 0s; /* If the mouse leaves the element, 
                                the transition effects for the 
                                tooltip arrow are "turned off" */
    transform-origin: top;   /* Orientation setting for the
                                slide-down effect */
    transform: translateX(-50%) scaleY(0);
  }

  /* Tooltip becomes visible at hover */
  [data-tooltip]:hover:before,
  [data-tooltip]:hover:after {
    visibility: visible;
    opacity: 1;
  }
  /* Scales from 0.5 to 1 -> grow effect */
  [data-tooltip]:hover:before {
    transition-delay: 0.3s;
    transform: translate(-50%, -5px) scale(1);
  }
  /* 
    Arrow slide down effect only on mouseenter (NOT on mouseleave)
  */
  [data-tooltip]:hover:after {
    transition-delay: 0.5s; /* Starting after the grow effect */
    transition-duration: 0.2s;
    transform: translateX(-50%) scaleY(1);
  }
  /*
    That's it for the basic tooltip.

    If you want some adjustability
    here are some orientation settings you can use:
  */

  /* LEFT */
  /* Tooltip + arrow */
  [data-tooltip-location="left"]:before,
  [data-tooltip-location="left"]:after {
    left: auto;
    right: calc(100% + 5px);
    bottom: 50%;
  }

  /* Tooltip */
  [data-tooltip-location="left"]:before {
    transform: translate(-5px, 50%) scale(0.5);
  }
  [data-tooltip-location="left"]:hover:before {
    transform: translate(-5px, 50%) scale(1);
  }

  /* Arrow */
  [data-tooltip-location="left"]:after {
    border-width: 5px 0px 5px 5px;
    border-color: transparent transparent transparent rgba(55, 64, 70, 0.9);
    transform-origin: left;
    transform: translateY(50%) scaleX(0);
  }
  [data-tooltip-location="left"]:hover:after {
    transform: translateY(50%) scaleX(1);
  }



  /* RIGHT */
  [data-tooltip-location="right"]:before,
  [data-tooltip-location="right"]:after {
    left: calc(100% + 5px);
    bottom: 50%;
  }

  [data-tooltip-location="right"]:before {
    transform: translate(5px, 50%) scale(0.5);
  }
  [data-tooltip-location="right"]:hover:before {
    transform: translate(5px, 50%) scale(1);
  }

  [data-tooltip-location="right"]:after {
    border-width: 5px 5px 5px 0px;
    border-color: transparent rgba(55, 64, 70, 0.9) transparent transparent;
    transform-origin: right;
    transform: translateY(50%) scaleX(0);
  }
  [data-tooltip-location="right"]:hover:after {
    transform: translateY(50%) scaleX(1);
  }

  /* BOTTOM */
  [data-tooltip-location="bottom"]:before,
  [data-tooltip-location="bottom"]:after {
    top: calc(100% + 5px);
    bottom: auto;
  }

  [data-tooltip-location="bottom"]:before {
    transform: translate(-50%, 5px) scale(0.5);
  }
  [data-tooltip-location="bottom"]:hover:before {
    transform: translate(-50%, 5px) scale(1);
  }

  [data-tooltip-location="bottom"]:after {
    border-width: 0px 5px 5px 5px;
    border-color: transparent transparent rgba(55, 64, 70, 0.9) transparent;
    transform-origin: bottom;
  }

  .tooltip {
    cursor: pointer;
    text-align: center;
    border: none;
    border-radius: 4px;
    outline: inherit;
    text-decoration: none;
    font-family: Roboto, sans-serif;
    font-size: 0.7em;
    /* background-color: rgba(174, 184, 192, 0.55); */
    background-color: transparent;
    color: white;

    -webkit-appearance: none;
    -moz-appearance: none;
    transition: background 350ms ease-in-out, 
                transform 150ms ease;
  }
  .tooltip:hover {
    /* background-color: #484f56; */
    background-color: transparent;
  }
  .tooltip:active {
    transform: scale(0.98);
  }
  .tooltip:focus {
    box-shadow: 0 0 2px 2px #298bcf;
  }
  .tooltip::-moz-focus-inner {
    border: 0;
  }
</style>