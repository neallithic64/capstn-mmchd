<template>
  <div>
    <TopNav/>
    <!--Everything below = main screen-->
    <div class="case-container">
      <!--SUMMARY: left side-->
      <div class="form-summary-container">
        <div class="form-summary">
          <button
            id="login-submit"
            type="submit"
            style="width: 210px; text-align: left"
            @click="isOpen = !isOpen"
          >
            <h2 style="font-weight: 600">New User</h2>
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
            User Type
          </h1>
          <p style="margin: 0 5px 5px 5px; font-size: 16px">
            Please fill up the form with complete and correct information
          </p>
        </div>

        <!--Form itself-->
        <div class="form-component">
          <form v-if="pageNum == 0" id="newuser0" type="submit">
            <div id="new-user-form" class="center">
              <h2 id="form-header">
                {{ Object.values(formSection.formNames)[0] }}
              </h2>
              
            </div>
          </form>

          <form
            v-if="
              pageNum == 1 || pageNum == Object.keys(disease.formNames).length
            "
            id="measles1"
            type="submit"
          >
            <div id="new-user-form" class="center">
              <h2 id="form-header">
                {{ Object.values(disease.formNames)[1] }}
              </h2>

              <div class="field-row-straight">
                <div class="name-field">
                  <label for="lastname" class="required"> Last Name </label>
                  <input
                    id="lastname"
                    v-model="formData.patient.lastName"
                    class="input-form-field"
                    type="text"
                    :disabled="inputEdit()"
                  />
                </div>
                <div class="name-field">
                  <label for="firstname" class="required"> First Name </label>
                  <input
                    id="firstname"
                    v-model="formData.patient.firstName"
                    class="input-form-field"
                    type="text"
                    :disabled="inputEdit()"
                  />
                </div>
                <div class="name-field">
                  <label for="middlename" class="required"> Middle Name </label>
                  <input
                    id="middlename"
                    v-model="formData.patient.midName"
                    class="input-form-field"
                    type="text"
                    :disabled="inputEdit()"
                  />
                </div>
              </div>

              <div
                class="field-row"
                style="display: inline-flex; margin-bottom: -1 px"
              >
                <div class="half-half half-half1">
                  <div class="birthday-field field">
                    <label for="birthdate" class="required">
                      Date of Birth
                    </label>
                    <input
                      id="birthdate"
                      v-model="formData.patient.birthDate"
                      class="input-form-field"
                      type="date"
                      :disabled="inputEdit()"
                    />
                  </div>
                  <div class="age-field field">
                    <label for="age" class="required"> Age </label>
                    <input
                      id="age"
                      v-model="formData.patient.ageNo"
                      class="input-form-field"
                      type="number"
                      :disabled="inputEdit()"
                    />
                  </div>
                </div>

                <div class="half-half half-half2">
                  <div class="sex-field field">
                    <label class="required"> Sex </label>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="female"
                        v-model="formData.patient.sex"
                        value="female"
                        class="input-radio"
                        name="sex"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="female"> Female </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="male"
                        v-model="formData.patient.sex"
                        value="male"
                        class="input-radio"
                        name="sex"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="male"> Male </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'is-auth',
  data() {
    return {
      isOpen: true,
      pageNum: 0,
      user: {
        userID: '',
        userType: '',
        druName: '',
        userFN: '',
        userLN: '',
        userMI: '',
        userSt: '',
        userBrgy: '',
        userCity: '',
        userContactNo: '',
        userEmail: '',
        userName: '',
        userPassword: ''
      },
      formSection: {
        formNames: {
          form1: 'User Type',
          form2: 'User Details',
          form3: 'Login Details',
          form4: 'Confirmation'
        }
      }
    }
  },
  methods: {
    formpart(disease, pageNum) {
      this.formPart = disease + pageNum
      // if (this.isOpen) this.formStatus(this.pageNum)
    },
    formColor(index) {
      if (this.isOpen) {
        if (index === this.pageNum) return 'formnum formnumcurr'
        else if (index < this.pageNum) return 'formnum formnumdone'
        else if (index > this.pageNum) return 'formnum'
      }
    },
    submit() {
      alert('DONE')
      // eslint-disable-next-line no-console
      console.log(this.formData)
      window.location.href = '/allcases'
    },
    move(page) {
      if (
        page < Object.keys(this.disease.formNames).length &&
        this.pageNum < Object.keys(this.disease.formNames).length
      ) {
        // const prevFormId = this.disease.name + this.pageNum
        const prevFormNum = 'form' + this.pageNum
        // document.getElementById(prevFormId).className = 'hide'
        document.getElementById(prevFormNum).className = 'formnum formnumdone'
        // const currFormId = this.disease.name + page
        const currFormNum = 'form' + page
        // document.getElementById(currFormId).className = 'show'
        document.getElementById(currFormNum).className = 'formnum formnumcurr'
      }
      this.pageNum = page
    },
    inputEdit() {
      if (this.pageNum === Object.keys(this.disease.formNames).length) {
        // const elems = document.getElementsByTagName('input')
        // for (let i = 0; i < elems.length; i++) {
        //   elems[i].disabled = true
        //   console.log(elems)
        // }
        return true
      } else return false
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
    margin: 0 7px 6px 5px;
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

  .birthday-field {
    /* width: 30%; */
    width: 66.67%;
  }
  .age-field {
    /* width: 15%; */
    width: 33.33%;
  }
  .sex-field {
    /* width: 15%; */
    width: 27.27%;
  }
  .pregnancy-field {
    /* width: 40%; */
    width: 72.73%;
  }

  @media only screen and (max-width: 950px) {
    .half-half,
    .half-half1,
    .half-half2 {
      width: 100%;
    }

    .birthday-field {
      width: 59%;
    }
    .age-field {
      width: 39%;
    }
    .sex-field {
      width: 39%;
    }
    .pregnancy-field {
      width: 59%;
    }
  }

  .sixtyDesk {
    width: 60%;
  }

  .patientAdmitted-field {
    /* width: 25%; */
    width: 41.67%;
  }

  .dateAdmitted-field {
    /* width: 35%; */
    width: 58.33%;
  }

  .indigenousGroup-field {
    width: 40%;
  }

  @media only screen and (max-width: 950px) {
    .sixtyDesk {
      width: 100%;
    }
    .patientAdmitted-field {
      width: 39%;
    }

    .dateAdmitted-field {
      width: 59%;
    }

    .indigenousGroup-field {
      width: 98%;
    }
  }

  .symptoms-half {
    display: flex;
    flex-direction: column;
  }

  .checkbox-options {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    /* font-size: 16px; */
  }

  .risk-flex {
    display: inline-flex;
    flex-direction: row;
  }

  @media only screen and (max-width: 950px) {
    .risk-flex {
      flex-direction: column;
    }
  }

  .vaccine-label {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
  }

  @media only screen and (max-width: 950px) {
    .vaccine-label {
      display: block;
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

  .searchPatientValues {
    background: white;
    margin-top: -20px;
    height: fit-content;
    /* border-radius: 0 0 25px 25px; */
    border-radius: 25px 25px 0 0;
    padding: 10px;
    padding-bottom: 15px;
    display: grid;
    width: 100%;

    position: absolute;
    bottom: 30px;
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