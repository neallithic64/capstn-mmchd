<template>
  <div id="viewPatient">
    <!--Top Bar of the screen-->
    <TopNav />
    <div ref="content" class="viewCIF-container">
      <div class="viewCIF-details" style="align-text: left">
        <div class="CIFnumbers">
          <h1 style="margin: -10px 0">Patient No. {{ formData.patient.patientID }}</h1>
        </div>
        <div class="CIFstatus" style="align-text: right">
          <!-- <div v-show="!editStatus && !isPrint" class="CIFActionButtons"> -->
          <div v-show="isPrint" class="CIFActionButtons">
            <img
              src="~/assets/img/pen.png"
              class="printButton"
              @click="downloadPDF"
            />
            <img
              src="~/assets/img/pdf.png"
              class="printButton"
              @click="downloadPDF"
            />
          </div>
        </div>
      </div>
      <div class="viewCIF-details" style="align-text: left">
        <div class="CIFnumbers">
          <p>DRU City: <b>Manila</b></p>
          <p>DRU Name: <b>HAKDOG</b></p>
        </div>
      </div>
      <div class="viewCIF-component">
        <form v-if="pageNum == 1 || isPrint" id="measles1" type="submit">
          <div id="case-investigation-form" class="center">
            <h2 id="form-header">
              Personal Information
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
                      id="Female"
                      v-model="formData.patient.sex"
                      value="Female"
                      class="input-radio"
                      name="sex"
                      type="radio"
                      :disabled="inputEdit()"
                    />
                    <label for="Female"> Female </label>
                  </div>
                  <div style="display: inline-flex; align-items: center">
                    <input
                      id="Male"
                      v-model="formData.patient.sex"
                      value="Male"
                      class="input-radio"
                      name="sex"
                      type="radio"
                      :disabled="inputEdit()"
                    />
                    <label for="Male"> Male </label>
                  </div>
                </div>
                <div class="pregnancy-field field">
                  <label class="required"> Pregnancy </label>
                  <div style="display: inline-flex; align-items: center">
                    <input
                      id="Not Pregnant"
                      v-model="formData.patient.pregWeeks"
                      value="Not Pregnant"
                      class="input-radio"
                      name="pregnancy"
                      type="radio"
                      :disabled="inputEdit()"
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
                      :disabled="inputEdit()"
                    />
                    <label for="pregnancyWeeks" style="display: inline-flex">
                      <input
                        id="pregnancy"
                        v-model="formData.patient.pregWeeks"
                        class="input-form-field"
                        type="number"
                        style="width: 50px; height: 20px; margin: 0 2px"
                        :disabled="inputEdit()"
                      />
                      Weeks Pregnant
                    </label>
                  </div>
                </div>
              </div>
            </div>

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
                <label for="currCity" class="required"> City </label>
                <input
                  id="currCity"
                  v-model="formData.patient.currCity"
                  class="input-form-field"
                  name="currCity"
                  :disabled="inputEdit()"
                >
              </div>
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
                <label for="permCity"> City </label>
                <input
                  id="permCity"
                  v-model="formData.patient.permCity"
                  class="input-form-field"
                  name="permCity"
                  :disabled="inputEdit()"
                >
              </div>
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
            </div>

            <div class="field-row-straight">
              <div class="field">
                <label for="contactperson" class="required">
                  Parent / Caregiver
                </label>
                <input
                  id="contactperson"
                  v-model="formData.patient.guardianName"
                  class="input-form-field"
                  type="text"
                  :disabled="inputEdit()"
                />
              </div>
              <div class="name-field">
                <label for="contactpersonNum" class="required">
                  Contact No.
                </label>
                <input
                  id="contactpersonNum"
                  v-model="formData.patient.guardianContact"
                  class="input-form-field"
                  type="number"
                  :disabled="inputEdit()"
                />
              </div>
            </div>
          </div>
        </form>
        <hr v-if="isPrint" />

        <form v-if="pageNum == 2 || isPrint" id="measles1" type="submit">
          <div id="case-investigation-form" class="center">
            <h2 id="form-header">Risk Factors</h2>

            <div class="risk-flex">
              <div style="display: inline-flex;flex-direction: row;margin: 0 30px;">

                <div style="display: block">
                  <div class="field-row" style="display: inline-flex; margin-bottom: -1 px; flex-direction: column;">
                    <div class="field">
                      <h3 class="required">Lifestyle:</h3>

                      <div style="padding-left: 7px">
                        <input
                          id="LSmoking"
                          v-model="formData.riskFactors.LSmoking"
                          value="LSmoking"
                          name="riskFactorsL"
                          type="checkbox"
                          :disabled="inputEdit()"
                        />
                        <label for="LSmoking">Smoking</label>
                      </div>

                      <div style="padding-left: 7px">
                        <input
                          id="LAlcoholism"
                          v-model="formData.riskFactors.LAlcoholism"
                          value="LAlcoholism"
                          name="riskFactorsL"
                          type="checkbox"
                          :disabled="inputEdit()"
                        />
                        <label for="source">Alcoholism</label>
                      </div>

                      <div style="padding-left: 7px">
                        <input
                          id="LDrugUse"
                          v-model="formData.riskFactors.LDrugUse"
                          value="LDrugUse"
                          name="riskFactorsL"
                          type="checkbox"
                          :disabled="inputEdit()"
                        />
                        <label for="LDrugUse">Drug Use</label>
                      </div>

                      <div style="padding-left: 7px">
                        <input
                          id="LPhysicalInactivity"
                          v-model="formData.riskFactors.LPhysicalInactivity"
                          value="LPhysicalInactivity"
                          name="riskFactorsL"
                          type="checkbox"
                          :disabled="inputEdit()"
                        />
                        <label for="LPhysicalInactivity"
                          >Physical Inactivity</label
                        >
                      </div>

                      <div style="display: flex; align-items: center">
                        <input
                          id="LifestyleOthers"
                          value="Others"
                          class="input-radio"
                          name="riskFactorsL"
                          type="checkbox"
                          :disabled="inputEdit()"
                        />
                        <label for="LifestyleOthers">
                          <div style="display: inline-flex">
                            Others:
                            <input
                              id="LifestyleOthers"
                              v-model="formData.riskFactors.LOthers"
                              class="riskfactorsInput"
                              type="text"
                              :disabled="inputEdit()"
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="field-row" style="display: block; margin-bottom: -1 px">
                  <div class="field" style="display: block">
                    <h3 class="required">Current Health Conditions:</h3>
                    <div style="flex-direction: column; align-items: center">
                      <div style="display: flex; align-items: center">
                        <input
                          id="CAsthma"
                          v-model="formData.riskFactors.CAsthma"
                          value="CAsthma"
                          class="input-radio"
                          name="riskFactorsC"
                          type="checkbox"
                          :disabled="inputEdit()"
                        />
                        <label for="Others"> Asthma </label>
                      </div>

                      <div style="display: flex; align-items: center">
                        <input
                          id="CHereditary"
                          v-model="formData.riskFactors.CHereditary"
                          value="CHereditary"
                          class="input-radio"
                          name="riskFactorsC"
                          type="checkbox"
                          :disabled="inputEdit()"
                        />
                        <label for="Others"> Hereditary </label>
                      </div>

                      <div style="display: flex; align-items: center">
                        <input
                          id="ConditionOthers"
                          value="Others"
                          class="input-radio"
                          name="riskFactorsL"
                          type="checkbox"
                          :disabled="inputEdit()"
                        />
                        <label for="ConditionOthers">
                          <div style="display: inline-flex">
                            Others:
                            <input
                              id="ConditionOthers"
                              v-model="formData.riskFactors.COthers"
                              class="riskfactorsInput"
                              type="text"
                              :disabled="inputEdit()"
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="field-row" style="display: block; margin-bottom: -1 px">
                  <div class="field" style="display: block">
                    <h3 class="required">Historical Health Data:</h3>
                    <div style="flex-direction: column; align-items: center">
                      <div style="display: flex; align-items: center">
                        <input
                          id="HDiabetes"
                          v-model="formData.riskFactors.HDiabetes"
                          value="HDiabetes"
                          class="input-radio"
                          name="riskFactorsH"
                          type="checkbox"
                          :disabled="inputEdit()"
                        />
                        <label for="HDiabetes"> Diabetes </label>
                      </div>

                      <div style="display: flex; align-items: center">
                        <input
                          id="HHeartDisease"
                          v-model="formData.riskFactors.HHeartDisease"
                          value="HHeartDisease"
                          class="input-radio"
                          name="riskFactorsH"
                          type="checkbox"
                          :disabled="inputEdit()"
                        />
                        <label for="HHeartDisease"> Heart Disease </label>
                      </div>

                      <div style="display: flex; align-items: center">
                        <input
                          id="HHypertension"
                          v-model="formData.riskFactors.HHypertension"
                          value="HHypertension"
                          class="input-radio"
                          name="riskFactorsH"
                          type="checkbox"
                          :disabled="inputEdit()"
                        />
                        <label for="HHypertension"> Hypertension </label>
                      </div>

                      <div style="display: flex; align-items: center">
                        <input
                          id="HObesity"
                          v-model="formData.riskFactors.HObesity"
                          value="HObesity"
                          class="input-radio"
                          name="riskFactorsH"
                          type="checkbox"
                          :disabled="inputEdit()"
                        />
                        <label for="HObesity"> Obesity </label>
                      </div>

                      <div style="display: flex; align-items: center">
                        <input
                          id="HistoricalOthers"
                          value="Others"
                          class="input-radio"
                          name="riskFactorsL"
                          type="checkbox"
                          :disabled="inputEdit()"
                        />
                        <label for="HistoricalOthers">
                          <div style="display: inline-flex">
                            Others:
                            <input
                              id="HistoricalOthers"
                              v-model="formData.riskFactors.HOthers"
                              class="riskfactorsInput"
                              type="text"
                              :disabled="inputEdit()"
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="field-row" style="display: block; margin-bottom: -1 px">
                  <div class="field" style="display: block">
                    <h3 class="required">Other Risks:</h3>
                    <div style="display:inline-flex; flex-direction:row">
                      <div class="otherRisk">
                        <div style="display: flex; align-items: center">
                          <input
                            id="OAirPollution"
                            v-model="formData.riskFactors.OAirPollution"
                            value="OAirPollution"
                            class="input-radio"
                            name="riskFactorsO"
                            type="checkbox"
                            :disabled="inputEdit()"
                          />
                          <label for="OAirPollution"> Air Pollution </label>
                        </div>

                        <div style="display: flex; align-items: center">
                          <input
                            id="OCleanWater"
                            v-model="formData.riskFactors.OCleanWater"
                            value="OCleanWater"
                            class="input-radio"
                            name="riskFactorsO"
                            type="checkbox"
                            :disabled="inputEdit()"
                          />
                          <label for="OCleanWater">
                            No access to clean water
                          </label>
                        </div>

                        <div style="display: flex; align-items: center">
                          <input
                            id="OFlooding"
                            v-model="formData.riskFactors.OFlooding"
                            value="OFlooding"
                            class="input-radio"
                            name="riskFactorsO"
                            type="checkbox"
                            :disabled="inputEdit()"
                          />
                          <label for="OFlooding"> Flooding </label>
                        </div>

                        <div style="display: flex; align-items: center">
                          <input
                            id="OHealthEdu"
                            v-model="formData.riskFactors.OHealthEdu"
                            value="OHealthEdu"
                            class="input-radio"
                            name="riskFactorsO"
                            type="checkbox"
                            :disabled="inputEdit()"
                          />
                          <label for="OHealthEdu"> Lack of health education </label>
                        </div>

                        <div style="display: flex; align-items: center">
                          <input
                            id="OHealthFacility"
                            v-model="formData.riskFactors.OHealthFacility"
                            value="OHealthFacility"
                            class="input-radio"
                            name="riskFactorsO"
                            type="checkbox"
                            :disabled="inputEdit()"
                          />
                          <label for="OHealthFacility">
                            Lack of health facilities
                          </label>
                        </div>
                      </div>
                      <div class="otherRisk">
                        <div style="display: flex; align-items: center">
                          <input
                            id="OPoverty"
                            v-model="formData.riskFactors.OPoverty"
                            value="OPoverty"
                            class="input-radio"
                            name="riskFactorsO"
                            type="checkbox"
                            :disabled="inputEdit()"
                          />
                          <label for="OPoverty"> Poverty </label>
                        </div>

                        <div style="display: flex; align-items: center">
                          <input
                            id="OShelter"
                            v-model="formData.riskFactors.OShelter"
                            value="OShelter"
                            class="input-radio"
                            type="checkbox"
                            :disabled="inputEdit()"
                          />
                          <label for="OShelter"> Inadequate shelter </label>
                        </div>

                        <div style="display: flex; align-items: center">
                          <input
                            id="OWasteMgmt"
                            v-model="formData.riskFactors.OWasteMgmt"
                            value="OWasteMgmt"
                            class="input-radio"
                            name="riskFactorsO"
                            type="checkbox"
                            :disabled="inputEdit()"
                          />
                          <label for="OWasteMgmt"> OVacCoverage </label>
                        </div>

                        <div style="display: flex; align-items: center">
                          <input
                            id="OVacCoverage"
                            v-model="formData.riskFactors.OVacCoverage"
                            value="OVacCoverage"
                            class="input-radio"
                            name="riskFactorsO"
                            type="checkbox"
                            :disabled="inputEdit()"
                          />
                          <label for="OVacCoverage">
                            Insufficient vaccination coverage
                          </label>
                        </div>

                        <div style="display: flex; align-items: center">
                          <input
                            id="OtherOthers"
                            value="Others"
                            class="input-radio"
                            name="riskFactorsL"
                            type="checkbox"
                            :disabled="inputEdit()"
                          />
                          <label for="OtherOthers">
                            <div style="display: inline-flex">
                              Others:
                              <input
                                id="OtherOthers"
                                v-model="formData.riskFactors.OOthers"
                                class="riskfactorsInput"
                                type="text"
                                :disabled="inputEdit()"
                              />
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </form>
        <hr v-if="isPrint" />

        <form v-if="pageNum == 3 || isPrint" id="measles3" type="submit">
          <div id="case-investigation-form" class="center">
            <h2 id="form-header">
              Cases
            </h2>
            <div class="CIF-statusHistory">
              <table style="width: 100%;">
                <thead>
                  <th style="width: 10%;">Case ID</th>
                  <th style="width: 15%;">Disease</th>
                  <th style="width: 20%;">Date Submitted</th>
                  <th style="width: 20%;">Date Last Updated</th>
                  <th style="width: 15%;">DRU</th>
                  <th style="width: 20%;">Case Status</th>
                </thead>
                <tbody>
                  <tr>
                    <td><a href="/viewCIFMeasles">123</a></td>
                    <td>Measles</td>
                    <td>Nov 11, 2021</td>
                    <td>Nov 11, 2021</td>
                    <td>ABC</td>
                    <td>Suspected</td>
                  </tr>
                  <tr>
                    <td><a href="/viewCIFMeasles">123</a></td>
                    <td>Measles</td>
                    <td>Nov 11, 2021</td>
                    <td>Nov 11, 2021</td>
                    <td>ABC</td>
                    <td>Suspected</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </form>

      </div>
      
    </div>
  </div>
</template>

<script src="https://code.jquery.com/jquery-1.12.3.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/0.9.0rc1/jspdf.min.js"></script>

<script>
const axios = require('axios');

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
export default {
  middleware: 'is-auth',
  header: {
    title: 'View CIF',
  },
  compute: {},
  data() {
    return {
      isDisabled: false,
      editCase: false,
      isPrint: true,
      diseaseID: 'DI-0000000000000',
      pageNum: 1,
      formPart: 'Measles0',
      formData: {
        cases: {
          caseID: 123,
          diseaseID: '',
          reportedBy: '',
          caseLevel: 'Suspected Case',
          reportDate: '11/30/2021',
          investigationDate: '',
          dateAdmitted: '',
          dateOnset: '',
          reporterName: 'me',
          reporterContact: '',
          investigatorLab: '',
          investigatorName: '',
          investigatorContact: '',
        },
        patient: {
          patientID: 123,
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
        riskFactors: {
          caseID: '',
          LAlcoholism: '',
          LDrugUse: '',
          LPhysicalInactivity: '',
          LSmoking: '',
          LOthers: '',
          CAsthma: '',
          CHereditary: '',
          COthers: '',
          HDiabetes: '',
          HHeartDisease: '',
          HHypertension: '',
          HObesity: '',
          HOthers: '',
          OAirPollution: '',
          OCleanWater: '',
          OFlooding: '',
          OHealthEdu: '',
          OHealthFacility: '',
          OPoverty: '',
          OShelter: '',
          OWasteMgmt: '',
          OVacCoverage: '',
          OOthers: '',
        },
      },
      rowData: {
        caseID: 1234,
        disease: 'Measles',
        city: 'Manila',
        patientNo: '123',
        submittedDate: '2020-10-10',
        updatedDate: '2020-10-10',
        status: 'IDK',
      },
    }
  },
  async fetch() {
    const data = (await axios.get('http://localhost:8080/api/getPatientData?patientID=' + this.$route.query.patientID)).data;
    // this.formData.cases = data.cases;
    // this.formData.caseData = data.caseData;
    this.formData.patient = data.patient;
    this.formData.riskFactors = data.riskFactors; // working already
    console.log(data);
  }, 
  methods: {
    formListClass(index) {
      if (index === this.pageNum) return 'formSummaryItems selected'
      else return 'formSummaryItems'
    },
    move(i) {
      this.pageNum = i
    },
    inputEdit() {
	  // not sure about the "this.cases"
      if (this.pageNum === 9 && this.$auth.user.userID === this.formData.cases.investigatorLab) return false;
      else return true;
    },
    statusInputEdit(value) {
      if (this.editStatus & value!==this.formData.cases.caseLevel ) return false
      else return true
    },
    downloadPDF() {
      this.isPrint = !this.isPrint

      let pWidth = 595.28 // 595.28 is the width of a4
      let srcWidth = this.$refs.content.scrollWidth
      let margin = 12 // narrow margin - 1.27 cm (36);
      let scale = (pWidth - margin * 2) / srcWidth

      var doc = new jsPDF('p', 'pt', 'A4')
      window.html2canvas = html2canvas

      doc.html(this.$refs.content, {
        x: margin,
        y: margin,
        html2canvas: {
          scale: scale,
        },
        callback: function () {
          window.open(doc.output('bloburl'))
        },
      })

      // doc.save('test.pdf')
      console.log(this.$refs.content)
      setTimeout(() => (this.isPrint = !this.isPrint), 5000)
    },
  },
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

h3 {
  font-size: 15px;
  font-weight: 600;
}

.otherRisk {
  flex-direction: column;
  align-items: center;
  /* min-width: max-content; */
  display: block;
  min-width: fit-content;
  margin-right: 40px;
}

.patientlink {
  cursor: pointer;
  text-decoration: underline;
}

.patientlink:hover {
  text-decoration: underline;
}

.viewCIF-container {
  padding: 80px 20px 5px 20px;
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .viewCIF-ontainer {
    width: 100%;
    align-items: center;
    margin: 0px;
  }
}

.viewCIF-section-container {
  /* left: 275px; */
  /* position: relative; */
  /* width: calc(100vw - 320px); */
  /* margin: 5px; */
  width: 100%;
  padding: 5px;
  margin: 10px;
}

@media only screen and (max-width: 800px) {
  .viewCIF-section-container {
    width: 95%;
  }
}

.CIF-SummaryContainer {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  overflow-y: hidden;
  z-index: 1;
}

.viewCIF-component {
  /* position: relative;
  display: inline-flex;
  flex-direction: row; */
  height: fit-content;
  width: 100%;

  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.25));
  background-color: #f2f2f2;
  border-radius: 0 10px 10px 10px;
  padding: 15px;
  padding-bottom: 20px;
  margin-bottom: 20px;
}
@media only screen and (max-width: 1400px) {
  .viewCIF-component {
    position: relative;
    top: 0px;
    min-height: fit-content;
    border-radius: 0 0 10px 10px;
  }
}
.viewCIF-details {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  justify-content: space-between;
}
.CIFnumbers,
.CIFstatus {
  display: inline-flex;
  flex-direction: column;
}

h1 {
  color: #346083;
  font-size: 40px;
  font-weight: 800;
}

h2 {
  color: #008d41;
  font-size: 25px;
  font-weight: 600;
}

b {
  /* color: #346083; */
  font-size: 18px;
  font-weight: 600;
}

.CIFreports {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 7.5px;
}

.CIFActionButtons {
  display: inline-flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;
}

.CIFActionButton {
  width: 50px;
  height: 50px;
  padding: 10px;
  border-radius: 30px;
  cursor: pointer;
}

.CIFActionButton:hover {
  background: #a3a3a3;
}

.printButton {
  width: 30px;
  height: 30px;
  margin-top: 10px;
  margin-bottom: -10px;
}

.CIFEdit {
  width: 30px;
  height: 30px;
  padding: 5px;
}

/* #saveIcon:hover {
  background: url("~/assets/img/saved.png");

} */

.CIF-statusHistory {
  margin-top:-10px;
  margin-bottom:10px;
  padding:20px;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  text-align: left;
  padding: 8px;
}

/* tr:nth-child(odd) {background-color: white;} */

/* ALL FROM CIF */

.case-investigation-form {
  margin-top: 5px;
  width: 100%;
}

#form-header {
  text-align: left;
  padding-left: 5px;
  margin-bottom: 5px;
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
  align-items: baseline;
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

.riskfactorsInput {
  width: 100px;
  height: 20px;
  margin: 0px 2px;
  font-size: 16px;
  font-family: 'Work Sans', sans-serif;
  padding-right: 5px;
  padding-left: 5px;
  /* border: 1p x solid rgba(0, 0, 0, 0.25); */
  border: 1px solid #a3a3a3;
  box-sizing: border-box;
  border-radius: 9px;
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

.checkbox-options {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  /* font-size: 16px; */
}

.required:after {
  content: '*';
  color: red;
}

input:disabled,
select:disabled {
  background: #dddddd;
}

hr {
  margin: 20px 0;
}

.show {
  display: unset;
}

.hide {
  display: none;
}
</style>

