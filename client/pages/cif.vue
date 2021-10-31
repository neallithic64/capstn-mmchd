<template>
  <div id="cif">
    <!--Top Bar of the screen-->
    <div class="topbar">
      <nav role="navigation"></nav>
    </div>

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
            <h2 style="font-weight: 600">Case Investigation Form</h2>
          </button>

          <div v-if="isOpen" class="form-contents">
            <button class="formnum formnumdone" @click="formpart(disease, 1)">
              1. Patient Information
            </button>
            <button class="formnum formnumcurr" @click="formpart(disease, 2)">
              2. Clinical Data
            </button>
            <div class="formnum">3. Vaccination History</div>
            <div class="formnum">4. Exposure History</div>
            <div class="formnum">5. Lab Tests</div>
          </div>
        </div>
        <div>
          All info: {{ lastname }}, {{ firstname }}, {{ middlename }}. <br />
          {{ birthdate }}, {{ age }}, {{ sex }}, {{ pregnancy }}. <br />
          {{ currentAddress }}, {{ permanentAddress }} <br />
          {{ patientAdmitted }}, {{ dateAdmitted }}, {{ indigenousGroup }}
          <br />
          {{ contactperson }}, {{ contactpersonNum }} {{ reportDate }} <br />
          {{ reporter }}, {{ reportContact }} <br />
          {{ investigationDate }}, {{ investigator }},
          {{ investigatorContact }}
          <br />
        </div>
      </div>

      <!--Everything in the right-->
      <div class="form-section-container">
        <!--Name of form-->
        <div class="disease-name">
          <h1 style="margin: 0; font-weight: 600; font-size: 24px">
            {{ disease }}
          </h1>
          <p style="margin: 0 5px 5px 5px; font-size: 16px">
            Please fill up the form with complete and correct information
          </p>
        </div>

        <!--Form itself-->
        <div class="form-component">
          <keep-alive>
            <component :is="formPart"></component>
            <!-- <componentForm /> -->
          </keep-alive>
        </div>

        <!--Next back button-->
        <div style="margin: -10px 0 5px; float: right">
          <button class="back-button" type="submit" @click="backPage()">
            Cancel
          </button>

          <button class="next-button" type="submit" @click="nextPage()">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PatientInfo from '../components/PatientInfo.vue'
import Disease2 from '../components/Disease2.vue'

export default {
  header: {
    title: 'Case Investigation Form',
  },
  components: {
    PatientInfo,
    Disease2,
  },
  data() {
    return {
      isOpen: true,
      disease: 'Disease',
      pageNum: 1,
      // formPart: formpart(disease, pageNum),
      formPart: 'PatientInfo',
    }
  },
  methods: {
    formpart(disease, pageNum) {
      if (pageNum === 1) this.formPart = 'PatientInfo'
      else this.formPart = disease + pageNum
    },
    nextPage() {
      if (this.pageNum < 5) {
        this.pageNum++
        this.formpart(this.disease, this.pageNum)
      }
    },
    backPage() {
      if (this.pageNum > 1) {
        this.pageNum--
        this.formpart(this.disease, this.pageNum)
      }
    },
    formStatus(pageNum, currPage) {
      if (pageNum === currPage) return 'formnumcurr'
      else if (currPage < pageNum) return 'formnumdone'
    },
  },
}
</script>

<style>
/* .form-summary:active {
  height: 64px;
  transition: transform 1000ms;
  transition-delay: 5000ms;
  transition-timing-function: linear;
} */

body {
  font-family: 'Work Sans', sans-serif;
  font-weight: 300;
  padding: 0px;
  margin: 0px;
}

.topbar {
  position: fixed;
  width: 100%;
  height: 75px;
  left: 0px;
  top: 0px;
  z-index: 5;

  background: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 0px 0px 10px 10px;
}

.case-container {
  margin: 85px 20px 5px 20px;
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

.formnum:hover {
  /* background: white; */
  color: #000000;
  font-weight: 800;
}

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
  height: max-content;
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

.next-button {
  width: 150px;
  height: 38px;
  max-width: 100%;
  font-size: 16px;
  margin-top: 20px;
  font-family: 'Work Sans', sans-serif;
  font-weight: 600;
  background-color: #346083;
  color: white;
}

.back-button {
  width: 150px;
  height: 38px;
  max-width: 100%;
  font-size: 16px;
  margin-top: 20px;
  font-family: 'Work Sans', sans-serif;
  font-weight: 600;
  background-color: white;
  color: #346083;
}
</style>
