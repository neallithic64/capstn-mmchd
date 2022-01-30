<template>
  <div>
    <TopNav/>
    <!--Everything below = main screen-->
    <div class="case-container">
      <!--SUMMARY: left side-->
      <div class="form-summary-container">
        <div class="form-summary">
          <button id="login-submit" type="submit" style="width: 210px; text-align: left" @click="instruct()">
            <h2 style="font-weight: 600">Diseases</h2>
          </button>

          <div v-if="isOpen" class="form-contents">
            <div v-for="(value, i) in formSection" :key="i">
              <!-- <div v-if="i > 1" :id="name" :class="formColor(i - 1)"> -->
              <button :class="formColor(i)" @click="move(i)">
                {{ i+1 }}. {{ value.disease }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!--Everything in the right-->
      <div class="form-section-container">
        <div class="form-component" style="margin-top: 8px;">
          <!-- Form for CaseDefs -->
          <form v-if="pageNum === -1" id="instructEdit" type="submit">
            <div id="new-user-form" class="center">
                <h2 id="form-header"> Instructions </h2>
              <div v-if="$auth.user.userType === 'techStaff' || $auth.user.userType === 'BHS' || $auth.user.userType === 'fhsisStaff'">
                <ul v-for="(value, name, i) in instructions" :key="i" style="displayLinline-flex">
                    <li>
                      <label :for="name" class="defsLabel">
                        {{ name }}
                      </label>
                    </li>
                     <ul>
                        <li>
                          {{ value }}
                        </li>
                     </ul>
                </ul>
              </div>
              <div v-if="$auth.user.userType === 'techStaff' || $auth.user.userType === 'BHS' || $auth.user.userType === 'fhsisStaff'">
                <ul style="displayLinline-flex">
                    <li>
                      <label class="defsLabel">
                        To see disease program targets:
                      </label>
                    </li>
                     <ul>
                        <li>
                          Please click the disease name from the list seen at the left side of the screen.
                        </li>
                     </ul>
                </ul>
              </div>
            </div>
          </form>
          <!-- Form for CaseDefs -->
          <form v-if="pageNum >= 0" id="editCaseDefs" type="submit">
            <div id="edit-casedefs-form" class="center">
              <div style="display: flex; flex-direction: row; justify-content:space-between;">
                <h2 id="form-header"> {{formSection[pageNum].disease}} </h2>
                <div v-show="!isEdit" v-if="$auth.user.userType === 'techStaff' || $auth.user.userType === 'BHS' || $auth.user.userType === 'fhsisStaff'"> 
                  <button id="instructButton" class="instruct-button" type="button" @click="instruct()">
                    Instructions
                  </button>
                  <button id="editButton" class="defsButton" type="button" @click="edit()">
                    Edit
                  </button>
                </div>
              </div>
              <div>
                <div>
                  <ul v-for="(value, i) in newIndicators" :key="i" style="displayLinline-flex">
                    <li>
                      <label class="defsLabel">
                        {{ value.targetName }}
                      </label>
                      <ul>
                        <li>
                          <div style="color:gray; margin-bottom:5px">{{value.targetDesc}} <br/></div>
                          <div class="defsTextArea" style="text-align: center;">
                            <input v-model="value.numerValue" class="target-form-field" type="number" min="0" :disabled="!isEdit"/> 
                            {{value.numerName}}
                            &nbsp; &nbsp; per &nbsp; &nbsp;
                            <input  v-model="value.denomValue" class="target-form-field" type="number" min="0" :disabled="!isEdit"/> 
                            {{value.denomName}}
                          </div>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
              <div v-show="isEdit" id="forSaveButton" style="margin-top: 10px; display: flex; justify-content: flex-end;">
                <button id="saveButton" class="instruct-button" type="button" @click="update('Cancel')">
                    Cancel
                </button>
                <button id="saveButton" class="defsButton" type="button" @click="update('Save')">
                    Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require('axios');

export default {
  middleware: 'is-auth',
  data() {
    return {
      isOpen: true,
      pageNum: -1,
      isEdit: false,
      newIndicators:[],
      formSection: [],
      instructions: {
        'Step 1': 'Click on a disease in the list on the left side to see its case definitions.',
        'Step 2': 'Click on the "Edit" button if you wish to edit the case definitions of the disease.',
        'Step 3': 'Select and edit the target values.',
        'Step 4': 'Lastly, click "Save" to save your changes.',
        'Step 5': 'In case there are issues, please contact the IT Staff.'
      }
    }
  },
  async fetch() {
    // getting all diseases with targets to print in left side
    const diseases = (await axios.get('http://localhost:8080/api/getProgTargets', {
      params: { userID: this.$auth.user.userID }
    })).data;
    this.formSection = diseases;
  },
  head() {
    return {
      title: 'Program Targets'
    }
  },
  methods: {
    formColor(index) {
      if (this.isOpen) {
        if (index === this.pageNum) return 'formnum formnumcurr';
        else return 'formnum';
      }
    },
    move(page) {
      if (!this.isEdit) {
        this.pageNum = page;
        this.newIndicators = this.formSection[this.pageNum].indicators;
      }
    },
    edit() {
      this.isEdit = true;
    },
    update(action) {
      if (action==='Cancel') {
        this.newIndicators = this.formSection[this.pageNum].indicators;
        this.isEdit = false;
      }
      else if (action==='Save') {
        this.formSection[this.pageNum].indicators = this.newIndicators;
        this.save();
        this.isEdit = false;
      }
    },
    async save() {
      const result = await axios.post('http://localhost:8080/api/editProgTargets', {
          userID: this.$auth.user.userID,
          targets: this.formSection[this.pageNum].indicators
      });
      
      if (result.status === 200) {
        // alert('Health event submitted!');
        this.$toast.success('Edit successful!', {duration: 4000, icon: 'check_circle'});
      } else {
        // eslint-disable-next-line no-console
        console.log(result);
        this.$toast.error('Something went wrong!', {duration: 4000, icon: 'error'});
      }
    },
    instruct() {
      this.pageNum = -1;
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

  .defsTextArea {
    max-width: 100%;
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

  .target-form-field,
  select {
    width: 85px;
    text-align-last: center;
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

  .defsButton {
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

  .next-button:hover {
    background-color: #346083;
  }

  .instruct-button {
    width: 100px;
    height: 30px;
    max-width: 100%;
    font-size: 14px;
    margin-top: 0px;
    font-family: 'Work Sans', sans-serif;
    font-weight: 600;
    background-color: #f2f2f2;
    color: #346083;
  }

  .instruct-button:hover {
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

  .defsLabel {
    display: block;
    /* cursor: pointer; */
    padding: 10px;
    /* border: 1px solid #fff; */
    border-bottom: none;
    font-weight: 400;
    margin-top: 5px;
    background: #346083;
    opacity: 0.85;
    color: white;
    font-weight: 600;
  }

  /* .collapseLabel:hover {
    background: #346083;
    opacity: 0.85;
    color: white;
    font-weight: 600;
  } */

  .defsLabel.last {
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