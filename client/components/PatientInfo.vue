<template>
  <form id="PatientInfo" type="submit">
    <div id="case-investigation-form" class="center">
      <h2 id="form-header">Patient Information</h2>

      <div class="field-row-straight">
        <div class="name-field">
          <label for="lastname" class="required"> Last Name </label>
          <input
            id="lastname"
            v-model="patientInfoData.lastname"
            class="input-form-field"
            type="text"
          />
        </div>
        <div class="name-field">
          <label for="firstname" class="required"> First Name </label>
          <input
            id="firstname"
            v-model="patientInfoData.firstname"
            class="input-form-field"
            type="text"
          />
        </div>
        <div class="name-field">
          <label for="middlename" class="required"> Middle Name </label>
          <input
            id="middlename"
            v-model="patientInfoData.middlename"
            class="input-form-field"
            type="text"
          />
        </div>
      </div>

      <div class="field-row" style="display: inline-flex; margin-bottom: -1 px">
        <div class="half-half half-half1">
          <div class="birthday-field field">
            <label for="birthdate" class="required"> Date of Birth </label>
            <input
              id="birthdate"
              v-model="patientInfoData.birthdate"
              class="input-form-field"
              type="date"
            />
          </div>
          <div class="age-field field">
            <label for="age" class="required"> Age </label>
            <input
              id="age"
              v-model="patientInfoData.age"
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
                v-model="patientInfoData.sex"
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
                v-model="patientInfoData.sex"
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
                v-model="patientInfoData.pregnancy"
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
                  v-model="patientInfoData.pregnancy"
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
          <label for="currentAddress" class="required"> Current Address </label>
          <input
            id="currentAddress"
            v-model="patientInfoData.currentAddress"
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
            v-model="patientInfoData.permanentAddress"
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
                v-model="patientInfoData.patientAdmitted"
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
                v-model="patientInfoData.patientAdmitted"
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
              v-model="patientInfoData.dateAdmitted"
              class="input-form-field"
              type="date"
            />
          </div>
        </div>
        <div class="indigenousGroup-field field">
          <label for="indigenousGroup"> Indigenous Group </label>
          <input
            id="indigenousGroup"
            v-model="patientInfoData.indigenousGroup"
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
            v-model="patientInfoData.contactperson"
            class="input-form-field"
            type="text"
          />
        </div>
        <div class="name-field">
          <label for="contactpersonNum" class="required"> Contact No. </label>
          <input
            id="contactpersonNum"
            v-model="patientInfoData.contactpersonNum"
            class="input-form-field"
            type="number"
          />
        </div>
      </div>

      <div class="field-row-straight">
        <div class="field">
          <label for="reportDate" class="required"> Date Reported </label>
          <input
            id="reportDate"
            v-model="patientInfoData.reportDate"
            class="input-form-field"
            type="date"
          />
        </div>
        <div class="field">
          <label for="reporter" class="required"> Reporter </label>
          <input
            id="reporter"
            v-model="patientInfoData.reporter"
            class="input-form-field"
            type="text"
          />
        </div>
        <div class="field">
          <label for="reporterNum" class="required"> Contact No. </label>
          <input
            id="reporterNum"
            v-model="patientInfoData.reportContact"
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
            v-model="patientInfoData.investigationDate"
            class="input-form-field"
            type="date"
          />
        </div>
        <div class="field">
          <label for="investigator" class="required"> Investigator </label>
          <input
            id="investigator"
            v-model="patientInfoData.investigator"
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
            v-model="patientInfoData.investigatorContact"
            class="input-form-field"
            type="number"
          />
        </div>
      </div>
    </div>
    <!-- <button class="next-button" type="submit" @click="send()"></button> -->
    <!-- <button type="button" @click="update">NEXT</button> -->
    <!--Next back button-->
    <div style="margin: -10px 0 5px; float: right">
      <button class="back-button" type="button" @click="back">Cancel</button>

      <button class="next-button" type="button" @click="next">Next</button>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      pageAction: '',
      patientInfoData: {
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
        dateAdmitted: '',
        indigenousGroup: '',
        contactperson: '',
        contactpersonNum: '',
        reportDate: '',
        reporter: '',
        reportContact: '',
        investigationDate: '',
        investigator: '',
        investigatorContact: '',
      },
    }
  },
  methods: {
    back() {
      this.$emit('update', [-1, this.patientInfoData])
    },
    next() {
      this.$emit('update', [1, this.patientInfoData])
    },
    update() {
      this.$emit('update', [this.pageAction, this.patientInfoData])
    },
  },
}
</script>

<style scoped>
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
  height: 10px;
  font-size: 16px;
  font-family: 'Work Sans', sans-serif;
  padding-right: 5px;
  padding-left: 5px;
  /* border: 1p x solid rgba(0, 0, 0, 0.25); */
  border: 1px solid #a3a3a3;
  box-sizing: border-box;
  border-radius: 9px;
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

.required:after {
  content: '*';
  color: red;
}
</style>