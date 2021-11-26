<template>
  <div id="addCRF">
    <!--Top Bar of the screen-->
    <TopNav />
    <div class="viewcases-container">
      <div class="viewCRF-details" style="align-text: left">
        <div class="CRFnumbers">
          <h1 style="margin-top: -1px">Disease: {{ disease }}</h1>
          <h2 style="margin-top: -1px">Week No: {{ weekNo }}</h2>
          <h3>Last updated: {{ updatedDate }}</h3>
        </div>
      </div>
      <div>
        <div class="viewcases-component">
          <div id="vue-root">
            <dataTable
              :options="tableOptions"
              :datavalues="crfData"
              :casetype="'crfID'"
            />
          </div>
        </div>
        <div class="additionalButtons">
          <button class="addText" @click="popup()">+ add a case</button>
          <div class="CRFendButton">
            <button class="save-button" type="button" @click="save()">
              Save
            </button>
            <button class="submit-button" type="button" @click="submit()">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-show="selectAdd" class="overlay">
      <div class="overlay-form">
        <button class="close" @click="popup()">x</button>
        <div>
          <div class="CRFcontainer">
            <div class="CRFbar">
              <input
                id="CRFinput"
                class="CRFsearchbar"
                type="search"
                autocomplete="off"
                spellcheck="false"
                role="combobox"
                aria-live="off"
                placeholder="Search Patient"
                @keyup="searchPatient"
              />
              <div v-if="patientResult.length" class="CRFsearchPatientValues">
                <div
                  v-for="(patient, i) in patientResult"
                  :key="i"
                  class="CRFsearchResult"
                >
                  <!-- <img class="searchPersonIcon" /> -->
                  <div
                    class="CRFsearchResultInfo"
                    @click="autoFillPatient(patient)"
                  >
                    <div class="CRFsearchPerson">
                      {{
                        patient.firstName +
                        ' ' +
                        patient.midName +
                        ' ' +
                        patient.lastName
                      }}
                    </div>
                    <div class="CRFsearchAddress">
                      {{
                        patient.currHouseStreet +
                        ', ' +
                        patient.currBrgy +
                        ', ' +
                        patient.currCity
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div>
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
                <div class="status-field field">
                  <div class="name-field">
                    <label for="civilStatus" class="required">
                      Civil Status
                    </label>
                    <select
                      id="civilStatus"
                      v-model="formData.patient.civilStatus"
                      name="civilStatus"
                      :disabled="inputEdit()"
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Separated">Separated</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                    <!-- <input
                        id="currCity"
                        v-model="formData.patient.currCity"
                        class="input-form-field"
                        type="number"
                        :disabled="inputEdit()"
                      /> -->
                  </div>
                </div>
              </div>
            </div>

            <hr />

            <div class="field-row">
              <div class="field">
                <label for="currentAddress" class="required">
                  Current Address: Street / House No.
                </label>
                <input
                  id="currentAddress"
                  v-model="formData.patient.currHouseStreet"
                  class="input-form-field"
                  type="text"
                  :disabled="inputEdit()"
                />
              </div>
            </div>

            <div class="field-row-straight">
              <div class="field">
                <label for="currBarangay" class="required"> Barangay </label>
                <input
                  id="currBarangay"
                  v-model="formData.patient.currBrgy"
                  class="input-form-field"
                  type="text"
                  :disabled="inputEdit()"
                />
              </div>
              <div class="name-field">
                <label for="currCity" class="required"> City </label>
                <select
                  id="currCity"
                  v-model="formData.patient.currCity"
                  name="currCity"
                  :disabled="inputEdit()"
                >
                  <option value="Caloocan">Caloocan City</option>
                  <option value="Las Piñas City">Las Piñas City</option>
                  <option value="Makati City">Makati City</option>
                  <option value="Malabon City">Malabon City</option>
                  <option value="Mandaluyong City">Mandaluyong City</option>
                  <option value="Manila City">Manila City</option>
                  <option value="Marikina City">Marikina City</option>
                  <option value="Muntinlupa City">Muntinlupa City</option>
                  <option value="Navotas City">Navotas City</option>
                  <option value="Parañaque City">Parañaque City</option>
                  <option value="Pasay City">Pasay City</option>
                  <option value="Pasig City">Pasig City</option>
                  <option value="Quezon City City">Quezon City</option>
                  <option value="San Juan City">San Juan City</option>
                  <option value="Taguig City">Taguig City</option>
                  <option value="Valenzuela City">Valenzuela City</option>
                </select>
                <!-- <input
                    id="currCity"
                    v-model="formData.patient.currCity"
                    class="input-form-field"
                    type="number"
                    :disabled="inputEdit()"
                  /> -->
              </div>
            </div>

            <div class="field-row">
              <div class="field">
                <label for="permAddress">
                  Permanent Address: Street / House No.
                </label>
                <input
                  id="permAddress"
                  v-model="formData.patient.permHouseStreet"
                  class="input-form-field"
                  type="text"
                  :disabled="inputEdit()"
                />
              </div>
            </div>

            <div class="field-row-straight">
              <div class="field">
                <label for="permBarangay"> Barangay </label>
                <input
                  id="permBarangay"
                  v-model="formData.patient.permBrgy"
                  class="input-form-field"
                  type="text"
                  :disabled="inputEdit()"
                />
              </div>
              <div class="name-field">
                <label for="permCity"> City </label>
                <select
                  id="permCity"
                  v-model="formData.patient.permCity"
                  name="permCity"
                  :disabled="inputEdit()"
                >
                  <option value="Caloocan City">Caloocan City</option>
                  <option value="Las Piñas City">Las Piñas City</option>
                  <option value="Makati City">Makati City</option>
                  <option value="Malabon City">Malabon City</option>
                  <option value="Mandaluyong City">Mandaluyong City</option>
                  <option value="Manila City">Manila City</option>
                  <option value="Marikina City">Marikina City</option>
                  <option value="Muntinlupa City">Muntinlupa City</option>
                  <option value="Navotas City">Navotas City</option>
                  <option value="Parañaque City">Parañaque City</option>
                  <option value="Pasay City">Pasay City</option>
                  <option value="Pasig City">Pasig City</option>
                  <option value="Quezon City">Quezon City</option>
                  <option value="San Juan City">San Juan City</option>
                  <option value="Taguig City">Taguig City</option>
                  <option value="Valenzuela City">Valenzuela City</option>
                </select>
              </div>
            </div>
            <hr />

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
                      :disabled="inputEdit()"
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
                      :disabled="inputEdit()"
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
                    :disabled="inputEdit()"
                  />
                </div>
              </div>
              <div class="indigenousGroup-field field" style="width: 40%">
                <label for="indigenousGroup"> Indigenous Group </label>
                <input
                  id="indigenousGroup"
                  v-model="formData.patient.indGroup"
                  class="input-form-field"
                  type="text"
                  :disabled="inputEdit()"
                />
              </div>
            </div>

            <div class="field-row-straight">
              <div class="field">
                <label for="reportDate" class="required"> Date Reported </label>
                <input
                  id="reportDate"
                  v-model="formData.cases.reportDate"
                  class="input-form-field"
                  type="date"
                  :disabled="inputEdit()"
                />
              </div>
              <div class="field">
                <label for="reporter" class="required"> Reporter </label>
                <input
                  id="reporter"
                  v-model="formData.cases.reporterName"
                  class="input-form-field"
                  type="text"
                  :disabled="inputEdit()"
                />
              </div>
              <div class="field">
                <label for="reporterNum" class="required"> Contact No. </label>
                <input
                  id="reporterNum"
                  v-model="formData.cases.reportContact"
                  class="input-form-field"
                  type="number"
                  :disabled="inputEdit()"
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
                  :disabled="inputEdit()"
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
                  :disabled="inputEdit()"
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
                  :disabled="inputEdit()"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dataTable from './dataTable.vue'
const axios = require('axios')
export default {
  header: {
    title: 'View CRF',
  },
  components: {
    dataTable,
  },
  data() {
    return {
      selectAdd: true,
      isPrint: false,
      patients: [],
      patientResult: [],
      disease: 'Dengue',
      crfNo: '35',
      druID: 'ABC',
      submittedDate: 'Nov 11,2021',
      updatedDate: 'Nov 10, 2020',
      weekNo: '2020-21',

      tableOptions: {
        tableName: 'crf',
        columns: [
          {
            title: 'CRF ID',
            key: 'crfID',
            type: 'clickable',
            source: 'crf',
            uniqueField: 'id',
            sortable: true,
          },
          {
            title: 'Patient',
            key: 'patientNo',
            type: 'number',
            source: 'crf',
          },
          {
            title: 'City',
            key: 'city',
            type: 'text',
            source: 'crf',
            uniqueField: 'id',
            sortable: true,
            filter: true,
          },
          {
            title: 'Age',
            key: 'age',
            type: 'number',
            source: 'crf',
            uniqueField: 'id',
            sortable: true,
          },
          {
            title: 'Sex',
            key: 'sex',
            type: 'text',
            source: 'crf',
            uniqueField: 'id',
            filter: true,
          },
          {
            title: 'Last updated',
            key: 'updatedDate',
            type: 'text',
            dateFormat: true,
            currentFormat: 'YYYY-MM-DD',
            expectFormat: 'DD MMM YYYY',
            sortable: true,
          },
          {
            title: 'Case Status',
            key: 'status',
            type: 'text',
            source: 'cases',
            uniqueField: 'id',
            sortable: true,
            filter: true,
          },
        ],
        // source: 'http://demo.datatable/api/users',
        search: true,
      },
      crfData: [
        {
          crfID: 35,
          disease: 'Dengue',
          patientNo: '1123',
          age: '12',
          sex: 'F',
          city: 'Manila',
          lastUpdated: '2020-11-10',
          status: 'Probable',
        },
        {
          crfID: 55,
          disease: 'Dengue',
          patientNo: '234',
          age: '50',
          sex: 'M',
          city: 'Makati',
          lastUpdated: '2022-11-12',
          status: 'Confirmed',
        },
        {
          crfID: 35,
          disease: 'Dengue',
          patientNo: '1123',
          age: '12',
          sex: 'F',
          city: 'Manila',
          lastUpdated: '2020-11-10',
          status: 'Probable',
        },
      ],
      formData: {
        patient: {
          patientID: '',
          epiID: '',
          lastName: '',
          firstName: '',
          midName: '',
          currHouseStreet: '',
          currBrgy: '',
          currCity: '',
          permHouseStreet: '',
          permBrgy: '',
          permCity: '',
          sex: '',
          birthDate: '',
          ageNo: '',
          ageType: '',
          admitStatus: '',
          civilStatus: '',
          occupation: '',
          occuLoc: '',
          occuAddrID: '',
          guardianName: '',
          guardianContact: '',
          indGroup: '',
          pregWeeks: '',
          HCPN: '',
          ILHZ: '',
        },
        caseData: {
          patientA: '',
          patientAdmitted: '',
        },
        cases: {
          dateAdmitted: '',
          reportDate: '',
          reporterName: '',
          reportContact: '',
          investigationDate: '',
          investigatorName: '',
          investigatorContact: '',
        },
      },
    }
  },
  async fetch() {
    let rows = (
      await axios.get(
        'http://localhost:8080/api/getCaseDefs?diseaseID=' + this.diseaseID
      )
    ).data
    for (let i = 0; i < rows.length; i++) {
      this.classification[rows[i].class] = rows[i].definition
    }
    rows = (await axios.get('http://localhost:8080/api/getPatients')).data
    this.patients = rows
  },
  compute: {},

  mounted() {},
  methods: {
    popup() {
      this.selectAdd = !this.selectAdd
    },
    inputEdit() {
      return false
    },
    searchPatient(event) {
      this.patientResult = []
      if (event.target.value !== '') {
        let ctr = 0
        for (let i = 0; i < this.patients.length && ctr < 5; i++) {
          // eslint-disable-next-line no-useless-escape
          const reg = new RegExp('^' + event.target.value + 'w*', 'i')
          if (
            (
              this.patients[i].firstName +
              ' ' +
              this.patients[i].midName +
              ' ' +
              this.patients[i].lastName
            ).match(reg)
          ) {
            this.patientResult.push(this.patients[i])
            ctr++
          }
        }
      }
    },
    autoFillPatient(patient) {
      // console.log(patient)
      this.formData.patient.lastName = patient.lastName
      this.formData.patient.firstName = patient.firstName
      this.formData.patient.midName = patient.midName
      this.formData.patient.birthDate = patient.birthDate
      this.formData.patient.ageNo = patient.ageNo
      this.formData.patient.sex = patient.sex
      this.formData.patient.civilStatus = patient.civilStatus
      this.formData.patient.currHouseStreet = patient.currHouseStreet
      this.formData.patient.currBrgy = patient.currBrgy
      this.formData.patient.currCity = patient.currCity
      this.formData.patient.permHouseStreet = patient.permHouseStreet
      this.formData.patient.permBrgy = patient.permBrgy
      this.formData.patient.permCity = patient.permCity
      this.formData.patient.guardianName = patient.guardianName
      this.formData.patient.guardianContact = patient.guardianContact
      this.pageNum++
    },
  },
}
</script>

<style>
hr {
  border-top-width: 5px;
  border-color: #008d41;
  margin: 10px 0;
}

.close {
  color: red;
  position: relative;
  float: right;
  top: -15px;
  font-weight: 800;
}

.overlay {
  display: block;
  z-index: 11;
  margin: 0px;
  padding: 90px;
  width: -webkit-fill-available;
  height: -webkit-fill-available;
  /* background: gray; */
  /* opacity: 55%; */
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(100, 100, 100, 0.4);
  /* border: 100px solid rgba(100, 100, 100, 0.4); */
}

.overlay-form {
  padding: 30px;
  border-radius: 40px;
  background: white;
  width: -webkit-fill-available;
  height: -webkit-fill-available;
  overflow-y: auto;
}

.pageHeader {
  font-weight: 800;
  font-size: 32px;
  color: #346083;
}

.viewCRF-details {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  justify-content: space-between;
}
.CRFnumbers,
.CRFstatus {
  display: inline-flex;
  flex-direction: column;
}

.CRFActionButtons {
  display: inline-flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

h1 {
  color: #008d41;
  font-size: 40px;
  font-weight: 800;
}

h2 {
  color: #346083;
  font-size: 25px;
  font-weight: 600;
}

h3 {
  font-size: 15px;
  font-weight: 600;
}

.printButton {
  width: 30px;
  height: 30px;
}

.viewcases-container {
  padding: 80px 20px 5px 20px;
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .viewcases-container {
    width: 100%;
    align-items: center;
    margin: 0px;
  }
}

.viewcases-section-container {
  /* left: 275px; */
  /* position: relative; */
  /* width: calc(100vw - 320px); */
  /* margin: 5px; */
  width: 100%;
  padding: 5px;
  margin: 10px;
}

@media only screen and (max-width: 800px) {
  .viewcases-section-container {
    width: 95%;
  }
}

.viewcases-component {
  /* position: relative;
  display: inline-flex;
  flex-direction: row; */
  height: fit-content;
  width: 100%;

  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.25));
  background-color: #f2f2f2;
  border-radius: 10px;
  padding: 15px;
  padding-bottom: 75px;
  margin-bottom: 40px;
}
@media only screen and (max-width: 800px) {
  .viewcases-component {
    position: relative;
    top: 0px;
    min-height: fit-content;
  }
}

.CRF-SummaryContainer {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  overflow-y: hidden;
  z-index: 1;
  margin-left: 5px;
}

.formSummaryItems {
  background: white;
  border: 1px #f2f2f2 solid;
  border-radius: 10px 10px 0 0;
  margin: 0 -1px -1px 0;
  padding: 5px 10px;
  cursor: pointer;
}

.formSummaryItems:hover {
  background: #f2f2f2;
}

.formSummaryItems.selected {
  background: #f2f2f2;
  font-weight: 600;
  pointer-events: none;
}

#datatabale {
  width: -webkit-fill-available;
}

.additionalButtons {
  position: relative;
  /* position: absolute; */
  margin-top: -115px;
  margin-left: 15px;
}

.addText {
  color: #346083;
  font-size: 12px;
}

.CRFendButton {
  /* margin: -10px 0 5px; */
  float: right;
  margin-top: 65px;
  margin-right: 16px;
  margin-bottom: 50px;
}

.submit-button {
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

.submit-button:hover {
  background-color: #346083;
}

.save-button {
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

.save-button:hover {
  border: #346083 solid 1px;
}

/* SEARCH BAR ALL BELOW */

.CRFcontainer {
  background: white;
  /* border-radius: 40px; */
  border-radius: 20px;
  width: 60%;
  margin: 0 auto;
  margin-bottom: 15px;
}

.CRFsearchbar {
  /* background: #ffffff; */
  background: #f2f2f2;
  border: 1px solid #a3a3a3;
  box-sizing: border-box;
  /* border-radius: 40px; */
  border-radius: 20px;
  width: 100%;
  height: 40px;
  padding: 10px 20px 10px 40px;

  height: 46px;
  font-size: 16px;
  outline: none;
  margin-top: -1px;

  /* background-image: url(../assets/img/search.svg); */
  background-image: url(https://cdn1.iconfinder.com/data/icons/hawcons/32/698956-icon-111-search-512.png);
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: 15px 12.5px;
}

.CRFbar {
  margin: 0 auto;
  width: 100%;
  height: 46px;
  /* border-radius: 40px; */
  border-radius: 20px;
  /* border: 1px solid #dcdcdc; */

  position: relative;
}
.CRFbar:hover {
  box-shadow: 1px 1px 8px 1px #dcdcdc;
}
.CRFbar:focus-within {
  box-shadow: 1px 1px 8px 1px #dcdcdc;
  outline: none;
}

#CRFinput_img {
  position: absolute;
  bottom: 8px;
  left: 10px;
  width: 30px;
  height: 30px;
}

.CRFsearchPatientValues {
  /* background: white; */
  background: #f2f2f2;
  height: fit-content;
  /* border-radius: 0 0 25px 25px; */
  border-radius: 0 0 20px 20px;
  margin-top: -16px;
  padding: 10px;
  display: grid;
  width: 100%;
  position: absolute;
  border: 1px solid #a3a3a3;
  border-top-color: transparent;
}

.CRFsearchResult {
  padding: 5px 10px;
  border-top: 1px solid lightgray;
  display: inline-flex;
  flex-direction: row;
}

.CRFsearchResult:hover {
  background: #eeeeee;
}

.CRFsearchResultInfo {
  display: inline-flex;
  flex-direction: column;
}

.CRFsearchPerson {
  font-size: 16px;
  margin-bottom: -5px;
  font-weight: 400;
}

.CRFsearchAddress {
  font-size: 12px;
  font-weight: 200;
}

/* ALL FROM FORMS */

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
.status-field {
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
  .status-field {
    width: 59%;
  }
}
</style>
