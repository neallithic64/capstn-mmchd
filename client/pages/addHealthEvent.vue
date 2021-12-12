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
                  <label for="dateCaptured" class="required"> Date Captured </label>
                  <input id="dateCaptured" 
                    v-model="healthEvent.dateCaptured"
                    class="input-form-field"
                    type="date"
                    name="dateCaptured"
                    :disabled="inputEdit()"
                    @change="validateTime()"/>
                    
                </div>

                <div class="field">
                  <label for="timeCaptured" class="required"> Time Captured </label>
                  <input 
                    id="timeCaptured"
                    v-model="healthEvent.timeCaptured"
                    class="input-form-field"
                    type="time"
                    name="timeCaptured"
                    :disabled="inputEdit()"
                  />
                </div>
              </div>

              <div class="field">
                <label for="source" class="required"> Source </label>
                <div style="display: inline-flex; align-items: center">
                  <input
                    id="print"
                    v-model="healthEvent.source"
                    value="Print"
                    class="input-radio"
                    name="source"
                    type="radio"
                    :disabled="inputEdit()"
                  />
                  <label for="print"> Print </label>
                </div>
                <div style="display: inline-flex; align-items: center">
                  <input
                    id="internet"
                    v-model="healthEvent.source"
                    value="Internet"
                    class="input-radio"
                    name="source"
                    type="radio"
                    :disabled="inputEdit()"
                  />
                  <label for="internet"> Internet </label>
                </div>
                <div style="display: inline-flex; align-items: center">
                  <input
                    id="television"
                    v-model="healthEvent.source"
                    value="Television"
                    class="input-radio"
                    name="source"
                    type="radio"
                    :disabled="inputEdit()"
                  />
                  <label for="television"> Television </label>
                </div>
                <div style="display: inline-flex; align-items: center">
                  <input
                    id="radioSource"
                    v-model="healthEvent.source"
                    value="Radio"
                    class="input-radio"
                    name="source"
                    type="radio"
                    :disabled="inputEdit()"
                  />
                  <label for="radioSource"> Radio </label>
                </div>
                <div style="display: inline-flex; align-items: center">
                  <input
                    id="doh"
                    v-model="healthEvent.source"
                    value="DOH"
                    class="input-radio"
                    name="source"
                    type="radio"
                    :disabled="inputEdit()"
                  />
                  <label for="doh"> DOH </label>
                </div>
                <div style="display: inline-flex; align-items: center">
                  <input
                    id="public"
                    v-model="healthEvent.source"
                    value="Public"
                    class="input-radio"
                    name="source"
                    type="radio"
                    :disabled="inputEdit()"
                  />
                  <label for="public"> Public </label>
                </div>
              </div>

              <div class="name-field">
                  <label for="reportSource" class="required"> Reporting Source </label>
                  <input id="reportSource"  v-model="healthEvent.reportSource" class="input-form-field" type="text" name="reportSource" :disabled="inputEdit()"/>
                    
              </div>
            </div>
          </form>

          <!-- Source Details (Form 1) -->
          <form v-if="pageNum == 1 || pageNum == Object.keys(formSection.formNames).length" id="newUserType" type="submit">
            <div id="new-user-form" class="center">
              <h2 id="form-header"> {{ Object.values(formSection.formNames)[1] }} </h2>

              <div class="name-field">
                  <label for="eventDetails" class="required"> Health Event </label>
                  <textarea 
                    id="eventDetails"
                    v-model="healthEvent.eventDetails" class="textarea-form-field" type="text" name="eventDetails" :disabled="inputEdit()"/>
              </div>

              <!-- Location -->
              <div class="field-row" style="margin-left: 0px">
                <div class="field">
                  <label for="locHouseStreet" class="required">
                    Street / House No.
                  </label>
                  <input
                    id="locHouseStreet"
                    v-model="healthEvent.locHouseStreet"
                    class="input-form-field"
                    type="text"
                    :disabled="inputEdit()"
                  />
                </div>
              </div>

              <div class="field-row-straight">
                <div class="name-field">
                  <label for="locCity" class="required"> City </label>
                  <select id="locCity" v-model="healthEvent.locCity" name="locCity" :disabled="inputEdit()" @change="getLocBrgyList()">
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
                  <select v-if="true" id="locBrgy" v-model="healthEvent.locBrgy" name="locBrgy" :disabled="inputEdit()">
                    <!-- <option v-for="(brgy, i) in brgyList" :key = "i" :value="brgy"> 
                      {{ brgy }} 
                    </option> -->
                  </select>
                </div>
              </div>

              <!-- Cases -->
              <div class="field-row-straight">
                <div class="field">
                  <label for="numCases" class="required">
                    Number of Cases
                  </label>
                  <input
                    id="numCases"
                    v-model="healthEvent.numCases"
                    class="input-form-field"
                    type="number"
                    min="0"
                    :disabled="inputEdit()"
                  />
                </div>
                <div class="field">
                  <label for="numDeaths" class="required">
                    Number of Deaths
                  </label>
                  <input
                    id="numDeaths"
                    v-model="healthEvent.numDeaths"
                    class="input-form-field"
                    type="number"
                    min="0"
                    :disabled="inputEdit()"
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
                    class="textarea-form-field" type="text" name="remarks" :disabled="inputEdit()"/>
                </div>
              </div>
            </div>
          </form>

        </div>

        <!-- Buttons -->
        <div style="margin: -10px 0 5px; float: right">
          <button v-if="pageNum == 0" class="back-button" type="button">
            <nuxt-link to="/allUsers"> Cancel </nuxt-link>
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
      pageDone: [false,false],
      healthEvent: {
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
      // eslint-disable-next-line no-console
      console.log(this.pageNum);
      switch (this.pageNum) {
        case 0:
          if (this.healthEvent.dateCaptured !== '' &&
          this.healthEvent.timeCaptured !== '' &&
          this.healthEvent.source !== null &&
          this.healthEvent.reportSource !== ''
          ) this.pageDone[this.pageNum] = true;
          else this.pageDone[this.pageNum] = false;
        break;
        case 1:
          if (this.healthEvent.healthEvent !== '' &&
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
        const result = await axios.post('http://localhost:8080/api/newUser', {user: this.user});
        // eslint-disable-next-line no-console
        console.log(result);
        this.$router.push('/');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    },
    move(page) {
      this.validateForm();
      if (this.pageDone[this.pageNum] || this.pageDone[page] || this.pageNum === 2) {
        this.pageNum = page;
      } else alert('Please fill up the required fields');
      this.$nextTick(() => {
        if ((page === 1 || page === 2) && this.healthEvent.locBrgy != null) {
          for (let i = 0; i < this.locBrgyList.length; i++) {
            const option = document.createElement('option');
            option.text = this.locBrgyList[i];
            option.value = this.locBrgyList[i];
            document.getElementById('locBrgy').add(option);
            if (this.healthEvent.locBrgy === this.locBrgyList[i])
              document.getElementById('locBrgy').selectedIndex = i+1;
          }
        }

        if ((page === 0) && this.healthEvent.timeCaptured != null) {
          let today = new Date();
          let dd = today.getDate();
          let mm = today.getMonth()+1;
          const yyyy = today.getFullYear();
          let hours = today.getHours();
          let mins = today.getMinutes();
          if(dd<10){
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
          document.getElementById('dateCaptured').setAttribute('max', today);
          if (this.healthEvent.dateCaptured === today) {
            document.getElementById('timeCaptured').value = time;
          }
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
    getLocBrgyList() {
      // eslint-disable-next-line no-console
      console.log(this.healthEvent.locCity);
      const dropdown = document.getElementById('locBrgy');
      while (dropdown.firstChild) dropdown.removeChild(dropdown.firstChild);

      const defaultOption = document.createElement('option');
      defaultOption.text = 'Choose Barangay';

      dropdown.add(defaultOption);
      dropdown.selectedIndex = 0;

      axios.get('barangays.json').then(res => {
          let option;

          this.locBrgyList = res.data[this.healthEvent.locCity].barangay_list;

          for (let i = 0; i < this.locBrgyList.length; i++) {
            option = document.createElement('option');
            option.text = this.locBrgyList[i];
            option.value = this.locBrgyList[i];
            dropdown.add(option);
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

  .info-icon-img {
    width: 10px;
    height: 10px;
    margin: 0 5px;
  }

  .tooltip {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 40px;
    cursor: pointer;
  }

  .tooltipText {
    background-color: #fff;
    position: absolute;
    bottom: 130%;
    padding: 10px 15px;
    border-radius: 5px;
    font-size: 14px;
    opacity: 0;
    transition: all 0.5s;
  }

  .tooltip:hover .tooltipText {
    opacity: 1;
    transform: translateY(-10px);
  }

  .tooltipText::after {
    content: '';
    border-width: 5px;
    border-style: solid;
    border-color: #fff transparent transparent transparent;
    position: absolute;
    top: 100%;
    left: 40%;
    margin-left: 5%;
  }

  img:hover + .info-desc {
    display: block;
  }

  .info-desc {
    display: none;
    background-color: #fff;
    position: absolute;
    bottom: 130%;
    padding: 10px 15px;
    border-radius: 5px;
    font-size: 14px;
    opacity: 0;
    transition: all 0.5s;
  }

  .infodesc-outside {
    position: relative;
    background: #adadad;
    color: white;
    border-radius: 10px;
    font-size: 11px;
    padding: 2px 7px;
    top: -20px;
    left: -20px;
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
</style>