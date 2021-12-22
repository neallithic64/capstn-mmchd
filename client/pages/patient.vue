<template>
  <div id="viewPatient">
    <!--Top Bar of the screen-->
    <TopNav />
    <div ref="content" class="viewPatient-container">
      <div class="viewPatient-details" style="align-text: left">
        <div class="patientNumbers">
          <h1 style="margin: -10px 0">Patient No. {{ formData.patient.patientID }}</h1>
        </div>
        <div class="patientStatus" style="align-text: right">
          <div v-if="editCase">
            <button class="cancel-button" type="button" @click="update('cancel')">
              Cancel
            </button>
            <button class="done-button" type="button" @click="update('done')">
              Done
            </button>
          </div>
          <div v-else-if="!isPrint && !editCase" class="patientActionButtons">
            <img
              src="~/assets/img/pen.png"
              class="printButton"
              @click="editCase=true"
            />
            <img
              src="~/assets/img/pdf.png"
              class="printButton"
              @click="downloadPDF"
            />
          </div>
        </div>
      </div>
      <div class="viewPatient-details" style="align-text: left">
        <div class="patientNumbers">
          <p>DRU City: <b>{{ DRUData.druCity }}</b></p>
          <p>DRU Name: <b>{{ DRUData.druName }}</b></p>
        </div>
      </div>
      <div class="viewPatient-component">
        <form id="patient1" type="submit">
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
                    disabled
                  />
                </div>
                <div class="name-field">
                  <label for="firstname" class="required"> First Name </label>
                  <input
                    id="firstname"
                    v-model="formData.patient.firstName"
                    class="input-form-field"
                    type="text"
                    disabled
                  />
                </div>
                <div class="name-field">
                  <label for="middlename" class="required"> Middle Name </label>
                  <input
                    id="middlename"
                    v-model="formData.patient.midName"
                    class="input-form-field"
                    type="text"
                    disabled
                  />
                </div>
              </div>

              <div class="field-row" style="display: inline-flex; margin-bottom: -1 px">
                <div class="half-half half-half1">
                  <div class="birthday-field field">
                    <label for="birthdate" class="required"> Date of Birth </label>
                    <input
                      id="birthdate"
                      v-model="formData.patient.birthDate"
                      :max="today"
                      class="input-form-field"
                      type="date"
                      disabled
                    />
                  </div>
                  <div class="age-field field">
                    <label for="age" class="required"> Age </label>
                    <input
                      id="age"
                      v-model="formData.patient.ageNo"
                      class="input-form-field"
                      type="number"
                      min="0"
                      disabled
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
                        disabled
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
                        disabled
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
                        name="pregWeeks"
                        type="radio"
                        value="Not Pregnant"
                        class="input-radio"
                        :disabled="inputEdit()"
                        required
                      />
                      <label for="Not Pregnant"> Not Pregnant </label>
                    </div>

                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="pregnancyWeeks"
                        name="pregWeeks"
                        type="radio"
                        :disabled="inputEdit()"
                        style="margin: 0 5px;"
                        required
                      />
                      <label for="pregnancyWeeks" style="display: inline-flex">
                        <input
                          id="pregnancyWeeks"
                          v-model="formData.patient.pregWeeks"
                          type="number"
                          min="0"
                          class="input-form-field"
                          style="width: 50px; height: 20px; margin: 0 2px"
                          :class="isRequired()"
                          :disabled="inputEdit()"
                          required
                        />
                        Weeks Pregnant
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="field-row-straight">
                <div class="status-field field">
                  <label for="civilStatus" class="required">
                    Civil Status
                  </label>
                  <select
                    id="civilStatus"
                    v-model="formData.patient.civilStatus"
                    name="civilStatus"
                    :disabled="inputEdit()"
                    :class="isRequired()"
                    required
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Separated">Separated</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div class="field">
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
                  <label for="occupation" class="required"> Occupation </label>
                  <input
                    id="occupation"
                    v-model="formData.patient.occupation"
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
                <div class="field">
                  <label for="occuLoc" class="required"> Occupation Location (Work/School) </label>
                  <input
                    id="occuLoc"
                    v-model="formData.patient.occuLoc"
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
              </div>

              <hr/>

              <div class="field-row">
                <div class="field">
                  <label for="occuStreet" class="required"> Occupation Address: Street / House No. </label>
                  <input
                    id="occuStreet"
                    v-model="formData.patient.occuStreet"
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
              </div>

              <div class="field-row-straight">
                <div class="name-field">
                  <label for="occuCity" class="required"> City </label>
                  <select id="occuCity" 
                    v-model="formData.patient.occuCity" 
                    name="occuCity" 
                    :disabled="inputEdit()" 
                    :class="isRequired()" 
                    required
                    @change="getLocBrgyList(formData.patient.occuCity,'occuBrgy')"
                    >
                    <option v-for="(city, i) in cityList" :key=i>{{city}}</option>
                  </select>
                </div>
                <div class="field">
                  <label for="occuBrgy" class="required"> Barangay </label>
                  <select
                    id="occuBrgy"
                    v-model="formData.patient.occuBrgy"
                    :class="isRequired()"
                    name="occuBrgy"
                    :disabled="inputEdit()"
                    required
                  >
                  </select>
                </div>
              </div>

              <div class="field-row">
                <div class="field">
                  <label for="currentAddress" class="required"> Current Address: Street / House No. </label>
                  <input
                    id="currentAddress"
                    v-model="formData.patient.currHouseStreet"
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
              </div>

              <div class="field-row-straight">
                <div class="name-field">
                  <label for="currCity" class="required"> City </label>
                  <select id="currCity" 
                    v-model="formData.patient.currCity" 
                    name="currCity" 
                    :disabled="inputEdit()" 
                    :class="isRequired()" 
                    required
                    @change="getLocBrgyList(formData.patient.currCity,'currBrgy')">
                    >
                    <option v-for="(city, i) in cityList" :key=i>{{city}}</option>
                  </select>
                </div>
                <div class="field">
                  <label for="currBrgy" class="required"> Barangay </label>
                  <select
                    id="currBrgy"
                    v-model="formData.patient.currBrgy"
                    :class="isRequired()"
                    name="currBrgy"
                    :disabled="inputEdit()"
                    required
                  >
                  </select>
                </div>
              </div>

              <div v-if="editCase" class="field-row-straight">
                <div class="field-row-straight">
                  <input
                    id="sameAddress"
                    v-model="sameAddress"
                    class="input-form-field"
                    type="checkbox"
                    :disabled="inputEdit()"
                    style="width: auto; margin:-5px 5px;"
                    @change="getAddress()"
                  />
                  <label for="sameAddress" style="font-size:12px"> Same permanent address as current address </label>
                </div>
              </div>

              <div class="field-row">
                <div class="field">
                  <label for="permAddress"> Permanent Address: Street / House No. </label>
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
                <div class="name-field">
                  <label for="permCity"> City </label>
                  <select
                    id="permCity"
                    v-model="formData.patient.permCity"
                    name="permCity"
                    :disabled="inputEdit()"
                    @change="getLocBrgyList(formData.patient.permCity,'permBrgy')"
                  >
                  <option v-for="(city, i) in cityList" :key=i>{{city}}</option>
                  </select>
                </div>
                <div class="field">
                  <label for="permBrgy" class="required"> Barangay </label>
                  <select
                    id="permBrgy"
                    v-model="formData.patient.permBrgy"
                    :class="isRequired()"
                    name="permBrgy"
                    :disabled="inputEdit()"
                    required
                  >
                  </select>
                </div>
              </div>

              <hr/>

              <div class="field-row-straight">
                <div class="field">
                  <label for="contactperson" class="required"> Parent / Caregiver </label>
                  <input
                    id="contactperson"
                    v-model="formData.patient.guardianName"
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
                <div class="name-field">
                  <label for="contactpersonNum" class="required"> Contact No. </label>
                  <input
                    id="contactpersonNum"
                    v-model="formData.patient.guardianContact"
                    :class="isRequired()"
                    type="number"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
              </div>

              <div class="field-row-straight">
                <div class="field">
                  <label for="HCPN"> HCPN </label>
                  <input
                    id="HCPN"
                    v-model="formData.patient.HCPN"
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                  />
                </div>
                <div class="field">
                  <label for="ILHZ"> ILHZ </label>
                  <input
                    id="ILHZ"
                    v-model="formData.patient.ILHZ"
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                  />
                </div>
              </div>

          </div>
        </form>
        <hr />

        <form id="patient2" type="submit">
          <div id="case-investigation-form" class="center">
            <h2 id="form-header">Risk Factors</h2>

            <div class="risk-flex">
              <div style="display: inline-flex;flex-direction: row;">

                <div style="display: block">
                  <div class="risk-factors" style="display: inline-flex; margin-bottom: -1 px; flex-direction: column;">
                    <div class="field">
                      <h3 class="required">Lifestyle:</h3>
                      <div style="flex-direction: column; align-items: center">
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
                </div>

                <div style="display: block">
                  <div class="risk-factors" style="display: inline-flex; margin-bottom: -1 px; flex-direction: column;">
                    <div class="field">
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
                </div>

                 <div style="display: block">
                  <div class="risk-factors" style="display: inline-flex; margin-bottom: -1 px; flex-direction: column;">
                    <div class="field">
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
                </div>

                <div class="risk-factors" style="display: block; margin-bottom: -1 px">
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
                          <label for="OWasteMgmt"> Lack of waste management </label>
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
        <hr />

        <form id="patient3" type="submit">
          <div id="case-investigation-form" class="center">
            <h2 id="form-header">
              Cases
            </h2>
            <dataTable
            :options="tableOptions"
            :datavalues="allData"
            :casetype="'patient'"
            />
          
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
import dataTable from './dataTable.vue'
export default {
  components: {
    dataTable,
  },
  middleware: 'is-auth',
  header: {
    title: 'View Patient',
  },
  compute: {},
  data() {
    return {
      validatePatient:true,
      sameAddress:'',
      ageNo:'',
      tableOptions: {
        tableName: 'cases',
        columns: [
          {
            title: 'Type',
            key: 'type',
            source: 'cases',
            uniqueField: 'id',
          },
          {
            title: 'Case ID',
            key: 'caseID',
            type: 'clickable',
            source: 'cases',
            uniqueField: 'id',
            sortable: true,
          },
          {
            title: 'Disease',
            key: 'disease',
            type: 'text',
            source: 'cases',
            uniqueField: 'id',
            sortable: true,
            filter: true,
          },
          {
            title: 'DRU Name',
            key: 'reportedBy',
            type: 'text',
            source: 'cases',
            uniqueField: 'id',
          },
          {
            title: 'City',
            key: 'city',
            type: 'text',
            source: 'cases',
            uniqueField: 'id',
            sortable: true,
            filter: true,
          },
          {
            title: 'Submitted on',
            key: 'reportDate',
            type: 'text',
            dateFormat: true,
            currentFormat: 'YYYY-MM-DD',
            expectFormat: 'DD MMM YYYY',
            // sortable: true,
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
            key: 'caseLevel',
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
      allData: [
        {
          type:'CIF',
          caseID:'123',
          disease:'Measles',
          reportedBy:'aa',
          city:'Manila City',
          reportDate:'today',
          updatedDate:'today',
          caseLevel:'Suspected',
        },
        {
          type:'CRF',
          caseID:'321',
          disease:'Dengue',
          reportedBy:'bb',
          city:'Makati City',
          reportDate:'today',
          updatedDate:'today',
          caseLevel:'Probable',
        },
      ],
      isDisabled: false,
      editCase: false,
      isPrint: false,
      DRUData:{
        druName:'',
        druType:'',
        druCity:'',
        druAddress:''
      }, 
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
          birthDate: '2011-10-31',
          ageNo: '',
          ageType: '',
          admitStatus: '',
          civilStatus: '',
          occupation: '',
          occuLoc: '',
          occuStreet: '',
          occuCity: '',
          occuBrgy: '',
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
      cityList: [
        'Caloocan City',
        'Las Piñas City',
        'Makati City',
        'Malabon City',
        'Mandaluyong City',
        'Manila City',
        'Marikina City',
        'Muntinlupa City',
        'Navotas City',
        'Parañaque City',
        'Pasay City',
        'Pasig City',
        'Quezon City',
        'San Juan City',
        'Taguig City',
        'Valenzuela City',
      ],
    }
  },
  mounted() {
    var today = new Date();
    this.ageNo = today.getFullYear() - parseInt(this.formData.patient.birthDate.substr(0,4));
  },
  async fetch() {
    const data = (await axios.get('http://localhost:8080/api/getPatientData?patientID=' + this.$route.query.patientID)).data;
    // this.formData.cases = data.cases;
    // this.formData.caseData = data.caseData;
    this.formData.patient = data.patient;
    this.formData.riskFactors = data.riskFactors; // working already
    this.DRUData = data.DRUData;
    this.allData = data.rowData;
    // console.log(data);
  }, 
  methods: {
    inputEdit() {
	  // not sure about the "this.cases"
      if (this.editCase) return false;
      else return true;
    },
    isRequired() {
      if (this.editCase && !this.validatePatient) return "input-form-field input-required";
      else return "input-form-field";
    },
    optionsRequired() {
      if (this.editCase && !this.validatePatient) return "input-required";
    },
    getAddress() {
      if (this.sameAddress) {
        this.formData.patient.permHouseStreet = this.formData.patient.currHouseStreet;
        this.formData.patient.permCity = this.formData.patient.currCity;
        this.getLocBrgyList(this.formData.patient.permCity,'permBarangay');
        this.formData.patient.permBrgy = this.formData.patient.currBrgy;
        console.log(this.formData.patient.permBrgy,this.formData.patient.currBrgy)
      }
      else {
        this.formData.patient.permHouseStreet = '';
        this.formData.patient.permCity = '';
        this.formData.patient.permBrgy = '';
      }
    },
    getLocBrgyList(city, element) {
      if (city) {
        // eslint-disable-next-line no-console
        console.log(city);
        const dropdown1 = document.getElementById(element);
        while (dropdown1.firstChild) dropdown1.removeChild(dropdown1.firstChild);

        const defaultOption = document.createElement('option');
        defaultOption.text = 'Choose Barangay';

        dropdown1.add(defaultOption);
        dropdown1.selectedIndex = 0;

        axios.get('barangays.json').then(res => {
            let option;
            if (city!== 'Quezon City') city = city.replace(' City','');

            this.locBrgyList = res.data[city].barangay_list;

            for (let i = 0; i < this.locBrgyList.length; i++) {
              option = document.createElement('option');
              option.text = this.locBrgyList[i];
              option.value = this.locBrgyList[i];
              dropdown1.add(option);
            }
          })
          // eslint-disable-next-line no-console
          .catch(err => console.log(err))
      }
    },
    validateForm() {
      if (this.formData.patient.sex!=='' &&
          this.formData.patient.pregWeeks!=='' &&
          this.formData.patient.civilStatus!=='' &&
          this.formData.patient.currHouseStreet!=='' &&
          this.formData.patient.currCity!=='' &&
          this.formData.patient.currBrgy!=='' &&
          this.formData.patient.occupation!=='' &&
          this.formData.patient.occuLoc!=='' &&
          this.formData.patient.occuStreet!=='' &&
          this.formData.patient.occuCity!=='' &&
          this.formData.patient.occuBrgy!=='' &&
          this.formData.patient.guardianName!=='' &&
          this.formData.patient.guardianContact!=='' &&
          this.formData.patient.sex!== null &&
          this.formData.patient.pregWeeks!== null &&
          this.formData.patient.civilStatus!== null &&
          this.formData.patient.currHouseStreet!== null &&
          this.formData.patient.currCity!== null &&
          this.formData.patient.currBrgy!== null &&
          this.formData.patient.occupation!== null &&
          this.formData.patient.occuLoc!== null &&
          this.formData.patient.occuStreet!== null &&
          this.formData.patient.occuCity!== null &&
          this.formData.patient.occuBrgy!== null &&
          this.formData.patient.guardianName!== null &&
          this.formData.patient.guardianContact!== null &&
          this.formData.patient.occuLoc!== 'Choose Barangay' &&
          this.formData.patient.occuBrgy!== 'Choose Barangay'
          ) this.validatePatient = true;
          else this.validatePatient = false;
          if (this.formData.patient.pregWeeks!=='Not Pregnant' && this.formData.patient.pregWeeks<0)
            {this.formData.patient.pregWeeks = ''; this.validatePatient = false;}
          if (this.formData.patient.guardianContact<0) {this.formData.patient.guardianContact = ''; this.validatePatient = false;}
    },
    update(action) { // TO DO FUNCTIONS
      if (action==='cancel') {
        // reload the data ?
        this.editCase=false;
      }
      if (action==='done') {
        this.validateForm();
        if (this.validatePatient) {
           // save the data in db
           this.editCase=false;
        }
        else alert("Please fill up all required fields")
      }
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

.input-required:invalid, textarea:invalid { 
    box-shadow: 0 0 5px #d45252;
    border-color: hsl(0, 76%, 50%);
    /* background-color: #ff6961; */
}

.input-required{
  border-color: hsl(0, 76%, 50%);
}

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
  margin-right: 30px;
}

.patientlink {
  cursor: pointer;
  text-decoration: underline;
}

.patientlink:hover {
  text-decoration: underline;
}

.viewPatient-container {
  padding: 80px 20px 5px 20px;
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .viewPatient-ontainer {
    width: 100%;
    align-items: center;
    margin: 0px;
  }
}

.viewPatient-section-container {
  /* left: 275px; */
  /* position: relative; */
  /* width: calc(100vw - 320px); */
  /* margin: 5px; */
  width: 100%;
  padding: 5px;
  margin: 10px;
}

@media only screen and (max-width: 800px) {
  .viewPatient-section-container {
    width: 95%;
  }
}

.viewPatient-component {
  /* position: relative;
  display: inline-flex;
  flex-direction: row; */
  height: fit-content;
  width: 100%;

  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.25));
  background-color: #f2f2f2;
  border-radius: 0 10px 10px 10px;
  padding: 15px;
  padding-bottom: 40px;
  margin-bottom: 40px;
}
@media only screen and (max-width: 1400px) {
  .viewPatient-component {
    position: relative;
    top: 0px;
    min-height: fit-content;
    border-radius: 0 0 10px 10px;
  }
}
.viewPatient-details {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  justify-content: space-between;
}
.patientNumbers,
.patientStatus {
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

.patientActionButtons {
  display: inline-flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;
}

.printButton {
  width: 30px;
  height: 30px;
  margin-top: 10px;
  margin-bottom: -10px;
  margin-left: 10px;
}

/* #saveIcon:hover {
  background: url("~/assets/img/saved.png");

} */

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

.risk-factors {
  width: 100%;
  display: flex;
  flex-direction: row;
  margin: 0 35px 6px 15px;
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

.done-button {
  width: 150px;
  height: 38px;
  max-width: 100%;
  font-size: 16px;
  margin: 0px;
  font-family: 'Work Sans', sans-serif;
  font-weight: 600;
  background-color: #346083;
  color: white;
  border: #346083 solid 0.75px;
}

.cancel-button {
  width: 150px;
  height: 38px;
  max-width: 100%;
  font-size: 16px;
  margin:0px;
  font-family: 'Work Sans', sans-serif;
  font-weight: 600;
  background-color: white;
  color: #346083;
}

.cancel-button:hover {
  border: #346083 solid 1px;
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

