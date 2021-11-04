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
            <div v-for="(value, name, i) in disease" :key="i">
              <!-- <div v-if="i > 1" :id="name" :class="formColor(i - 1)"> -->
              <button
                v-if="i > 1"
                :id="name"
                :class="formColor(i - 2)"
                @click="move(i - 2)"
              >
                {{ i - 2 }}. {{ value }}
              </button>
            </div>
          </div>
        </div>
        <div>All info: {{ formData }}</div>
      </div>

      <!--Everything in the right-->
      <div class="form-section-container">
        <!--Name of form-->
        <div class="disease-name">
          <h1 style="margin: 0; font-weight: 600; font-size: 24px">
            {{ disease.name }}
          </h1>
          <p style="margin: 0 5px 5px 5px; font-size: 16px">
            Please fill up the form with complete and correct information
          </p>
        </div>

        <!--Form itself-->
        <div class="form-component">
          <form v-if="pageNum == 0" id="measles0" type="submit">
            <div id="case-investigation-form" class="center">
              <h2 id="form-header">{{ disease[pageNum] }}</h2>
            </div>
          </form>

          <form
            v-if="pageNum == 1 || pageNum == Object.keys(disease).length - 2"
            id="measles1"
            type="submit"
          >
            <div id="case-investigation-form" class="center">
              <h2 id="form-header">{{ disease.form1 }}</h2>

              <div class="field-row-straight">
                <div class="name-field">
                  <label for="lastname" class="required"> Last Name </label>
                  <input
                    id="lastname"
                    v-model="formData.caseData.lastname"
                    class="input-form-field"
                    type="text"
                  />
                </div>
                <div class="name-field">
                  <label for="firstname" class="required"> First Name </label>
                  <input
                    id="firstname"
                    v-model="formData.caseData.firstname"
                    class="input-form-field"
                    type="text"
                  />
                </div>
                <div class="name-field">
                  <label for="middlename" class="required"> Middle Name </label>
                  <input
                    id="middlename"
                    v-model="formData.caseData.middlename"
                    class="input-form-field"
                    type="text"
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
                      v-model="formData.caseData.birthdate"
                      class="input-form-field"
                      type="date"
                    />
                  </div>
                  <div class="age-field field">
                    <label for="age" class="required"> Age </label>
                    <input
                      id="age"
                      v-model="formData.caseData.age"
                      class="input-form-field"
                      type="number"
                    />
                  </div>
                </div>

                <div class="half-half half-half2">
                  <div class="sex-field field">
                    <label class="required"> Sex </label>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="female"
                        v-model="formData.caseData.sex"
                        value="female"
                        class="input-radio"
                        name="sex"
                        type="radio"
                      />
                      <label for="female"> Female </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="male"
                        v-model="formData.caseData.sex"
                        value="male"
                        class="input-radio"
                        name="sex"
                        type="radio"
                      />
                      <label for="male"> Male </label>
                    </div>
                  </div>
                  <div class="pregnancy-field field">
                    <label class="required"> Pregnancy </label>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="Not Pregnant"
                        v-model="formData.caseData.pregnancy"
                        value="Not Pregnant"
                        class="input-radio"
                        name="pregnancy"
                        type="radio"
                      />
                      <label for="Not Pregnant"> Not Pregnant </label>
                    </div>

                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="Pregnant"
                        value="pregnant"
                        class="input-radio"
                        name="pregnancy"
                        type="radio"
                      />
                      <div style="display: inline-flex">
                        <input
                          id="pregnancy"
                          v-model="formData.caseData.pregnancy"
                          class="input-form-field"
                          type="number"
                          style="width: 50px; height: 20px; margin: 0 2px"
                        />
                        Weeks Pregnant
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="field-row">
                <div class="field">
                  <label for="currentAddress" class="required">
                    Current Address
                  </label>
                  <input
                    id="currentAddress"
                    v-model="formData.caseData.currentAddress"
                    class="input-form-field"
                    type="text"
                  />
                </div>
              </div>

              <div class="field-row">
                <div class="field">
                  <label for="permanentAddress"> Permanent Address </label>
                  <input
                    id="permanentAddress"
                    v-model="formData.caseData.permanentAddress"
                    class="input-form-field"
                    type="text"
                  />
                </div>
              </div>

              <div class="field-row">
                <div
                  class="sixtyDesk"
                  style="display: inline-flex; flex-direction: row"
                >
                  <div class="patientAdmitted-field field">
                    <label class="required"> Patient Admitted </label>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="yes"
                        v-model="formData.caseData.patientAdmitted"
                        value="yes"
                        class="input-radio"
                        name="patientAdmitted"
                        type="radio"
                      />
                      <label for="yes"> Yes </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="no"
                        v-model="formData.caseData.patientAdmitted"
                        value="no"
                        class="input-radio"
                        name="patientAdmitted"
                        type="radio"
                      />
                      <label for="no"> No </label>
                    </div>
                  </div>
                  <div class="dateAdmitted-field field">
                    <label for="dateAdmitted" class="required">
                      Date Admitted / Seen
                    </label>
                    <input
                      id="dateAdmitted"
                      v-model="formData.cases.dateAdmitted"
                      class="input-form-field"
                      type="date"
                    />
                  </div>
                </div>
                <div class="indigenousGroup-field field">
                  <label for="indigenousGroup"> Indigenous Group </label>
                  <input
                    id="indigenousGroup"
                    v-model="formData.caseData.indigenousGroup"
                    class="input-form-field"
                    type="text"
                  />
                </div>
              </div>

              <div class="field-row-straight">
                <div class="field">
                  <label for="contactperson" class="required">
                    Parent / Caregiver
                  </label>
                  <input
                    id="contactperson"
                    v-model="formData.caseData.contactperson"
                    class="input-form-field"
                    type="text"
                  />
                </div>
                <div class="name-field">
                  <label for="contactpersonNum" class="required">
                    Contact No.
                  </label>
                  <input
                    id="contactpersonNum"
                    v-model="formData.caseData.contactpersonNum"
                    class="input-form-field"
                    type="number"
                  />
                </div>
              </div>

              <div class="field-row-straight">
                <div class="field">
                  <label for="reportDate" class="required">
                    Date Reported
                  </label>
                  <input
                    id="reportDate"
                    v-model="formData.cases.reportDate"
                    class="input-form-field"
                    type="date"
                  />
                </div>
                <div class="field">
                  <label for="reporter" class="required"> Reporter </label>
                  <input
                    id="reporter"
                    v-model="formData.cases.reporterName"
                    class="input-form-field"
                    type="text"
                  />
                </div>
                <div class="field">
                  <label for="reporterNum" class="required">
                    Contact No.
                  </label>
                  <input
                    id="reporterNum"
                    v-model="formData.cases.reportContact"
                    class="input-form-field"
                    type="number"
                  />
                </div>
              </div>

              <div class="field-row-straight">
                <div class="field">
                  <label for="investigationDate" class="required">
                    Date of Investigation
                  </label>
                  <input
                    id="investigationDate"
                    v-model="formData.cases.investigationDate"
                    class="input-form-field"
                    type="date"
                  />
                </div>
                <div class="field">
                  <label for="investigator" class="required">
                    Investigator
                  </label>
                  <input
                    id="investigator"
                    v-model="formData.cases.investigatorName"
                    class="input-form-field"
                    type="text"
                  />
                </div>
                <div class="field">
                  <label for="investigatorContact" class="required">
                    Contact No.
                  </label>
                  <input
                    id="investigatorContact"
                    v-model="formData.cases.investigatorContact"
                    class="input-form-field"
                    type="number"
                  />
                </div>
              </div>
            </div>
          </form>
          <hr />
          <form
            v-if="pageNum == 2 || pageNum == Object.keys(disease).length - 2"
            id="measles2"
            type="submit"
          >
            <div id="case-investigation-form" class="center">
              <h2 id="form-header">{{ disease.form2 }}</h2>

              <div
                class="field-row"
                style="display: inline-flex; margin-bottom: -1 px"
              >
                <div class="field">
                  <label class="required">
                    Select the following symptoms shown by patient
                  </label>

                  <div style="margin-left: 5px">
                    <div class="symptoms-half">
                      <div
                        class="checkbox-options"
                        style="display: inline-flex"
                      >
                        <input
                          id="fever"
                          value="fever"
                          class="input-checkbox"
                          name="fever"
                          type="checkbox"
                        />
                        <div class="checkbox-options">
                          Fever

                          <input
                            id="fever"
                            v-model="formData.caseData.symptoms.fever"
                            class="input-form-field"
                            type="date"
                            style="width: 175px; height: 20px; margin: 0 2px"
                          />
                          <img
                            id="infofever"
                            class="info-icon-img"
                            src="~/assets/img/infoicon.png"
                          />
                          <div class="info-desc infodesc-outside">
                            {{ info.symptoms.fever }}
                          </div>
                        </div>
                      </div>

                      <div class="checkbox-options">
                        <input
                          id="rash"
                          value="rash"
                          class="input-checkbox"
                          name="rash"
                          type="checkbox"
                        />
                        <div class="checkbox-options">
                          Rash

                          <input
                            id="rash"
                            v-model="formData.caseData.symptoms.rash"
                            class="input-form-field"
                            type="date"
                            style="width: 175px; height: 20px; margin: 0 2px"
                          />
                          <img
                            id="infofever"
                            class="info-icon-img"
                            src="~/assets/img/infoicon.png"
                          />
                          <div class="info-desc infodesc-outside">
                            {{ info.symptoms.rash }}
                          </div>
                        </div>
                      </div>

                      <div class="checkbox-options">
                        <input
                          id="lymph"
                          v-model="formData.caseData.symptoms.lymph"
                          value="lymph"
                          class="input-checkbox"
                          name="pregnancy"
                          type="checkbox"
                        />
                        <label for="lymph">
                          Swollen lymphatic nodules (specify location)
                          <img
                            id="infofever"
                            class="info-icon-img"
                            src="~/assets/img/infoicon.png"
                          />
                          <div class="info-desc infodesc-outside">
                            {{ info.symptoms.lymph }}
                          </div>
                        </label>
                      </div>
                    </div>

                    <div class="symptoms-half">
                      <div class="checkbox-options">
                        <input
                          id="cough"
                          v-model="formData.caseData.symptoms.cough"
                          value="cough"
                          class="input-checkbox"
                          name="cough"
                          type="checkbox"
                        />
                        <label for="cough">
                          Cough
                          <img
                            id="infofever"
                            class="info-icon-img"
                            src="~/assets/img/infoicon.png"
                          />
                          <div class="info-desc infodesc-outside">
                            {{ info.symptoms.cough }}
                          </div>
                        </label>
                      </div>

                      <div class="checkbox-options">
                        <input
                          id="koplik"
                          v-model="formData.caseData.symptoms.koplik"
                          value="koplik"
                          class="input-checkbox"
                          name="koplik"
                          type="checkbox"
                        />
                        <label for="koplik">
                          Koplik Sign
                          <img
                            id="infofever"
                            class="info-icon-img"
                            src="~/assets/img/infoicon.png"
                          />
                          <div class="info-desc infodesc-outside">
                            {{ info.symptoms.koplik }}
                          </div>
                        </label>
                      </div>

                      <div class="checkbox-options">
                        <input
                          id="runnynose"
                          v-model="formData.caseData.symptoms.runnynose"
                          value="runnynose"
                          class="input-checkbox"
                          name="runnynose"
                          type="checkbox"
                        />
                        <label for="runnynose">
                          Runny Nose
                          <img
                            id="infofever"
                            class="info-icon-img"
                            src="~/assets/img/infoicon.png"
                          />
                          <div class="info-desc infodesc-outside">
                            {{ info.symptoms.runnynose }}
                          </div>
                        </label>
                      </div>

                      <div class="checkbox-options">
                        <input
                          id="redeye"
                          v-model="formData.caseData.symptoms.edeye"
                          value="redeye"
                          class="input-checkbox"
                          name="redeye"
                          type="checkbox"
                        />
                        <label for="redeye">
                          Red eye/conjunctivitis
                          <img
                            id="infofever"
                            class="info-icon-img"
                            src="~/assets/img/infoicon.png"
                          />
                          <div class="info-desc infodesc-outside">
                            {{ info.symptoms.redeye }}
                          </div>
                        </label>
                      </div>

                      <div class="checkbox-options">
                        <input
                          id="arthritis"
                          v-model="formData.caseData.symptoms.arthritis"
                          value="arthritis"
                          class="input-checkbox"
                          name="arthritis"
                          type="checkbox"
                        />
                        <label for="arthritis">
                          Arthralgia/arthritis
                          <img
                            id="infofever"
                            class="info-icon-img"
                            src="~/assets/img/infoicon.png"
                          />
                          <div class="info-desc infodesc-outside">
                            {{ info.symptoms.arthritis }}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="field-row">
                <div class="field">
                  <label for="complications">
                    Are there any complications? Please specify.
                    <img
                      id="infofever"
                      class="info-icon-img"
                      src="~/assets/img/infoicon.png"
                    />
                    <div class="info-desc infodesc-outside">
                      {{ info.complications }}
                    </div>
                  </label>
                  <input
                    id="complications"
                    v-model="formData.caseData.complications"
                    class="input-form-field"
                    type="text"
                  />
                </div>
              </div>

              <div class="field-row">
                <div class="field">
                  <label for="otherSymptoms">
                    Other symptoms
                    <img
                      id="infofever"
                      class="info-icon-img"
                      src="~/assets/img/infoicon.png"
                    />
                    <div class="info-desc infodesc-outside">
                      {{ info.otherSymptoms }}
                    </div>
                  </label>
                  <input
                    id="otherSymptoms"
                    v-model="formData.caseData.otherSymptoms"
                    class="input-form-field"
                    type="text"
                  />
                </div>
              </div>

              <div class="field-row">
                <div class="field">
                  <label for="diagnosis">
                    Working/Final Diagnosis
                    <img
                      id="infofever"
                      class="info-icon-img"
                      src="~/assets/img/infoicon.png"
                    />
                    <div class="info-desc infodesc-outside">
                      {{ info.diagnosis }}
                    </div>
                  </label>
                  <input
                    id="diagnosis"
                    v-model="formData.caseData.diagnosis"
                    class="input-form-field"
                    type="text"
                  />
                </div>
              </div>
            </div>
          </form>

          <form
            v-if="pageNum == 3 || pageNum == Object.keys(disease).length - 2"
            id="measles3"
            type="submit"
          >
            <div id="case-investigation-form" class="center">
              <h2 id="form-header">{{ disease[pageNum] }}</h2>
            </div>
          </form>

          <form
            v-if="pageNum == 4 || pageNum == Object.keys(disease).length - 2"
            id="measles4"
            type="submit"
          >
            <div id="case-investigation-form" class="center">
              <h2 id="form-header">{{ disease[pageNum] }}</h2>
            </div>
          </form>

          <form
            v-if="pageNum == 5 || pageNum == Object.keys(disease).length - 2"
            id="measles5"
            type="submit"
          >
            <div id="case-investigation-form" class="center">
              <h2 id="form-header">{{ disease[pageNum] }}</h2>
            </div>
          </form>

          <form
            v-if="pageNum == 6 || pageNum == Object.keys(disease).length - 2"
            id="measles6"
            type="submit"
          >
            <div id="case-investigation-form" class="center">
              <h2 id="form-header">{{ disease[pageNum] }}</h2>
            </div>
          </form>

          <form
            v-if="pageNum == 7 || pageNum == Object.keys(disease).length - 2"
            id="measles7"
            type="submit"
          >
            <div id="case-investigation-form" class="center">
              <h2 id="form-header">{{ disease[pageNum] }}</h2>
            </div>
          </form>

          <form
            v-if="pageNum == 8 || pageNum == Object.keys(disease).length - 2"
            id="measles8"
            type="submit"
          >
            <div id="case-investigation-form" class="center">
              <h2 id="form-header">{{ disease[pageNum] }}</h2>
            </div>
          </form>
        </div>

        <!-- Bottom 2 buttons -->
        <div style="margin: -10px 0 5px; float: right">
          <button
            v-if="pageNum == 0"
            class="back-button"
            type="button"
            @click="move(0)"
          >
            Cancel
          </button>
          <button
            v-if="pageNum != 0"
            class="back-button"
            type="button"
            @click="move(pageNum - 1)"
          >
            Back
          </button>
          <button
            v-if="pageNum < Object.keys(disease).length - 3"
            class="next-button"
            type="button"
            @click="move(pageNum + 1)"
          >
            Next
          </button>
          <button
            v-if="pageNum == Object.keys(disease).length - 3"
            class="next-button"
            type="button"
            @click="pageNum++"
          >
            Review
          </button>
          <button
            v-if="pageNum == Object.keys(disease).length - 2"
            class="next-button"
            type="button"
            @click="submit"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import infoicon from '../static/infoicon.png'
export default {
  header: {
    title: 'Case Investigation Form - Measles',
  },
  data() {
    return {
      isOpen: true,
      pageNum: 2,
      formPart: 'Measles2',
      formData: {
        cases: {
          caseID: '',
          patientID: '',
          diseaseID: '',
          reportedBy: '',
          caseLevel: '',
          reportDate: '',
          investigationDate: '',
          dateAdmitted: '',
          dateOnset: '',
          reporterName: '',
          reporterContact: '',
          investigatorName: '',
          investigatorContact: '',
        },
        caseData: {
          firstname: '',
          lastname: '',
          middlename: '',
          birthdate: '',
          age: '',
          sex: '',
          pregnancy: '',
          currentAddress: '',
          permanentAddress: '',
          patientAdmitted: '',
          indigenousGroup: '',
          contactperson: '',
          contactpersonNum: '',
          symptoms: {
            fever: '',
            rash: '',
            lymph: false,
            cough: false,
            koplik: false,
            runnynose: false,
            redeye: false,
            arthrisis: false,
          },
          complications: '',
          otherSymptoms: '',
          diagnosis: '',
        },
      },
      info: {
        symptoms: {
          fever: 'a',
          rash: 'b',
          lymph: 'c',
          cough: 'd',
          koplik: 'e',
          runnynose: 'f',
          redeye: 'g',
          arthritis: 'h',
        },
        complications: 'i',
        otherSymptoms: 'j',
        diagnosis: 'k',
      },
      disease: {
        idname: 'Measles',
        name: 'Measles/Rubella',
        form0: 'Case Definition',
        form1: 'Patient Information',
        form2: 'Clinical Data',
        form3: 'Vaccination History',
        form4: 'Exposure History',
        form5: 'Laboratory Tests',
        form6: 'Final Classification',
        form7: 'Source of Information',
        form8: 'Outcome',
      },
    }
  },
  methods: {
    formpart(disease, pageNum) {
      if (pageNum === 1) this.formPart = 'PatientInfo'
      else this.formPart = disease + pageNum
      // if (this.isOpen) this.formStatus(this.pageNum)
    },
    updateForm(value) {
      if (this.pageNum === Object.keys(this.disease).length) alert('SUBMIT')
      else {
        this.formData[this.pageNum - 1] = value[1]
        this.pageNum += value[0]
        this.formpart(this.disease.idname, this.pageNum)
        console.log(this.formData)
      }
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
      console.log(this.formData)
    },
    move(page) {
      if (this.pageNum < Object.keys(this.disease).length - 2) {
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

.case-investigation-form {
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

@media only screen and (max-width: 950px) {
  .name-field {
    width: 98%;
  }
}

.input-form-field {
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
  font-size: 16px;
}

.info-icon-img {
  width: 10px;
  height: 10px;
  margin: 0 5px;
}

img:hover + .info-desc {
  display: block;
}

.info-desc {
  display: none;
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

.show {
  display: unset;
}

.hide {
  display: none;
}
</style>
