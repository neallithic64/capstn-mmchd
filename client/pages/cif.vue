<template>
  <div id="cif">
    <!--Top Bar of the screen-->
    <TopNav />

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
            <div v-for="(value, name, i) in disease[0]" :key="i">
              <div v-if="i == 2" :id="name" class="formnum formnumcurr">
                {{ value }}
              </div>
              <div v-if="i > 2" :id="name" class="formnum">{{ value }}</div>
            </div>
            <!-- <button
              id="form1"
              class="formnum formnumdone"
              @click="formpart(disease, 1)"
            >
              1. Patient Information
            </button> -->
          </div>
        </div>
        <div>All info: {{ formdata }}</div>
      </div>

      <!--Everything in the right-->
      <div class="form-section-container">
        <!--Name of form-->
        <div class="disease-name">
          <h1 style="margin: 0; font-weight: 600; font-size: 24px">
            {{ disease[0].name }}
          </h1>
          <p style="margin: 0 5px 5px 5px; font-size: 16px">
            Please fill up the form with complete and correct information
          </p>
        </div>

        <!--Form itself-->
        <div class="form-component">
          <keep-alive>
            <component :is="formPart" @update="updateForm($event)" />
            <!-- <patient-info ref="patientForm" @click="doSomething" /> -->
            <!-- <patient-info @changeTitle="ChangeT($event)" /> -->
            <!-- <componentForm /> -->
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PatientInfo from '../components/PatientInfo.vue'
import Measles2 from '../components/Measles2.vue'

export default {
  header: {
    title: 'Case Investigation Form',
  },
  components: {
    PatientInfo,
    Measles2,
  },
  data() {
    return {
      isOpen: true,
      pageNum: 1,
      // formPart: formpart(disease, pageNum),
      formPart: 'PatientInfo',
      laast: '',
      formdata: [],
      disease: [
        {
          filename: 'Measles',
          name: 'Measles/Rubella',
          form1: '1. Patient Information',
          form2: '2. Clinical Data',
          form3: '3. Vaccination History',
          form4: '4. Exposure History',
          form5: '5. Laboratory Tests',
          form6: '6. Final Classification',
          form7: '7. Source of Information',
          form8: '8. Outcome',
        },
      ],
    }
  },
  methods: {
    formpart(disease, pageNum) {
      if (pageNum === 1) this.formPart = 'PatientInfo'
      else this.formPart = disease + pageNum
      this.formStatus(pageNum)
    },
    formStatus(currPage) {
      for (let i = 1; i < Object.keys(this.disease[0]).length - 1; i++) {
        const formnum = 'form' + i
        if (i === currPage)
          document.getElementById(formnum).className = 'formnum formnumcurr'
        else if (i < currPage)
          document.getElementById(formnum).className = 'formnum formnumdone'
        else if (i > currPage)
          document.getElementById(formnum).className = 'formnum'
      }
    },
    updateForm(value) {
      this.formdata[this.pageNum - 1] = value[1]
      this.pageNum += value[0]
      this.formpart(this.disease[0].filename, this.pageNum)
      console.log(this.formdata)
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
  margin-top: 40px;
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
  margin-top: 40px;
  font-family: 'Work Sans', sans-serif;
  font-weight: 600;
  background-color: white;
  color: #346083;
}
</style>
