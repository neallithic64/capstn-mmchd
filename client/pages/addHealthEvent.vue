<template>
  <div class="addHEbody">
    <TopNav/>
    <div class="addHE-caseContainer">
      <!--SUMMARY: left side-->
      <div class="addHE-formSummary-container">
        <div class="addHE-formSummary">
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
      <div class="addHE-formSectionContainer">
        <!--Name of form-->
        <div class="addHE-diseaseName">
          <h1 style="margin: 0; font-weight: 600; font-size: 24px">
            Add Health Event
          </h1>
          <p style="margin: 0 5px 5px 0px; font-size: 16px">
            Please fill up the form with complete and correct information.
          </p>
        </div>

        <!--Form itself-->
        <div class="addHE-formComponent">
          <!-- Source Details (Form 1) -->
          <form v-if="pageNum == 0 || pageNum == Object.keys(formSection.formNames).length" id="newUserType" type="submit">
            <div id="addHE-newUserForm" class="center">
              <h2 id="addHE-formHeader"> {{ Object.values(formSection.formNames)[0] }} </h2>
              <div class="field-row-straight">
                <div class="name-field">
                  <div style="display: flex; flex-direction: row;">
                    <label for="dateCaptured" class="required addHElabel"> Date Captured </label>
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
                    <label for="timeCaptured" class="required addHElabel"> Time Captured</label>
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
                  <label for="source" class="required addHElabel"> Source </label>
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
                  <label for="print addHElabel"> Print </label>
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
                  <label for="internet addHElabel"> Internet </label>
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
                  <label for="television addHElabel"> Television </label>
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
                  <label for="radioSource addHElabel"> Radio </label>
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
                  <label for="doh addHElabel"> DOH </label>
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
                  <label for="public addHElabel">Public </label>
                </div>
              </div>

              <div class="name-field">
                <div style="display: flex; flex-direction: row;">
                  <label for="reportSource" class="required addHElabel"> Reporting Source </label>
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
            <div id="addHE-newUserForm" class="center">
              <h2 id="addHE-formHeader"> {{ Object.values(formSection.formNames)[1] }} </h2>

              <div class="name-field">
                <div style="display: flex; flex-direction: row;">
                  <label for="eventDetails" class="required addHElabel"> Health Event </label>
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
                    <label for="locHouseStreet" class="required addHElabel"> Street / House No. </label>
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
                  <label for="locCity" class="required addHElabel"> City </label>
                  <select id="locCity" v-model="healthEvent.locCity"
                    :class="isRequired()"
                    name="locCity"
                    :disabled="inputEdit()"
                    required
                    @change="getLocBrgyList()">
                      <option value="CALOOCAN CITY">CALOOCAN CITY</option>
                      <option value="LAS PIÑAS CITY">LAS PIÑAS CITY</option>
                      <option value="MAKATI CITY">MAKATI CITY</option>
                      <option value="MALABON CITY">MALABON CITY</option>
                      <option value="MANDALUYING CITY">MANDALUYING CITY</option>
                      <option value="MANILA CITY">MANILA CITY</option>
                      <option value="MARIKINA CITY">MARIKINA CITY</option>
                      <option value="MUNTINLUPA CITY">MUNTINLUPA CITY</option>
                      <option value="NAVOTAS CITY">NAVOTAS CITY</option>
                      <option value="PARAÑAQUE CITY">PARAÑAQUE CITY</option>
                      <option value="PASAY CITY">PASAY CITY</option>
                      <option value="PASIG CITY">PASIG CITY</option>
                      <option value="QUEZON CITY">QUEZON CITY</option>
                      <option value="SAN JUAN CITY">SAN JUAN CITY</option>
                      <option value="TAGUIG CITY">TAGUIG CITY</option>
                      <option value="VALENZUELA CITY">VALENZUELA CITY</option>
                  </select>
                </div>

                <div class="field">
                  <label for="locBrgy" class="required addHElabel"> Barangay </label>
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
                    <label for="numCases" class="required addHElabel"> Number of Cases </label>
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
                    <label for="numDeaths" class="required addHElabel"> Number of Deaths </label>
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
                  <label for="remarks" class="addHElabel">
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
            <nuxt-link to="/allHealthEvents"> Cancel </nuxt-link>
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
        eventStatus:'For Validation',
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
  head() {
    return {
      title: 'New Health Event'
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
        // console.log(result);
        // this.$router.push('/');

        if (result.status === 200) {
          // alert('Health event submitted!');
          this.$toast.success('Health event submitted!', {duration: 4000, icon: 'check_circle'});
          window.location.href = '/allHealthEvents';
        } else {
          // eslint-disable-next-line no-console
          console.log(result);
          this.$toast.error('Something went wrong!', {duration: 4000, icon: 'error'});
        }
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
        // alert('Please fill up the required fields');
        this.$toast.error('Please fill up the required fields.', {position: 'top-right', duration: 4000, icon: 'error'});
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
  .addHEbody {
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

  .addHE-caseContainer {
    margin: 70px 20px 5px 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: max-content;
  }

  @media only screen and (max-width: 800px) {
    .addHE-caseContainer {
      width: 100%;
      flex-direction: column;
      align-items: center;
      margin: 0px;
      margin-top: 85px;
    }
  }

  .addHE-formSummary {
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
    .addHE-formSummary {
      width: 100%;
      position: unset;
      height: fit-content;
      z-index: 3;
    }
  }

  .addHE-formSummary-container {
    position: fixed;
    width: fit-content;
    margin: 5px;
    padding: 5px;
  }

  @media only screen and (max-width: 800px) {
    .addHE-formSummary-container {
      width: 95%;
      position: sticky;
      margin: 0px;
    }
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

  .addHE-formSectionContainer {
    left: 275px;
    position: relative;
    width: calc(100vw - 320px);
    /* margin: 5px; */
    padding: 5px;
  }

  @media only screen and (max-width: 800px) {
    .addHE-formSectionContainer {
      left: 0px;
      width: 95%;
    }
  }

  .addHE-diseaseName {
    position: relative;
    top: -3px;
    z-index: 3;
  }
  @media only screen and (max-width: 800px) {
    .addHE-diseaseName {
      position: relative;
      top: 0px;
    }
  }

  .addHE-formComponent {
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
    .addHE-formComponent {
      position: relative;
      top: 0px;
      min-height: fit-content;
    }
  }

  .addHE-newUserForm {
    margin-top: 5px;
    width: 100%;
  }

  #addHE-formHeader {
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
    #addHE-formHeader {
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

  .addHElabel {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
  }

  .required:after {
    content: '*';
    color: red;
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