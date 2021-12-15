<template>
  <div id="viewCRF">
    <!--Top Bar of the screen-->
    <TopNav />
    <div ref="content" class="viewCRF-container">
      <div class="viewCRF-details" style="align-text: left">
        <div class="CRFnumbers">
          <h1 style="margin: -10px 0">Case No. {{ formData.cases.caseID }}</h1>
           <h2 style="margin-top: -1px">
            Patient No. <a :href="'/patient?patientID=' + formData.patient.patientID" class="patientlink"> {{ formData.patient.patientID }} </a>
          </h2>
        </div>
        <div class="CRFstatus" style="align-text: right">
          <span style="display: inline-flex; align-items: center"
            >Case Classification:&nbsp;
            <div v-show="!editStatus" class="CRFActionButtons">
              <h1 style="line-height: 1; align-items: center">
                {{ formData.cases.caseLevel }}
              </h1>
              <ul
                v-show="!isPrint"
                class="CRFEdit"
                @click="popup()"
              >
                <img src="~/assets/img/pen.png" />
              </ul>
            </div>
          </span>
          <div v-show="!editStatus && !isPrint" class="CRFActionButtons">
            <img
              src="~/assets/img/pdf.png"
              class="printCaseButton"
              @click="downloadPDF"
            />
          </div>
        </div>
      </div>
      <div class="viewCRF-details" style="align-text: left">
        <div class="CIFnumbers">
          <p>DRU City: <b> {{DRUData.druCity}} </b></p>
          <p>DRU Name: <b> {{DRUData.druName}} </b></p>
          <p>DRU Type: <b> {{DRUData.druType}} </b></p>
          <p>DRU Address: <b> {{DRUData.druAddress}} </b></p>
        </div>
        <div class="CRFstatus" style="align-text: right">
          <p>Week No: <b> {{ CRFData.year }}-{{ CRFData.week }} </b> </p>
          <p>Reported Date: <b>{{ formData.cases.reportDate }}</b></p>
          <p>Last Updated: <b>{{ formData.cases.updatedDate }}</b></p>
        </div>
      </div>
      <div v-show="!isPrint" class="CRF-SummaryContainer">
        <ul
          v-for="(value, name, i) in disease.formNames"
          v-show="i > 0"
          :key="i"
          :class="formListClass(i)"
          @click="move(i)"
        >
          {{
            i
          }}.{{
            value
          }}
        </ul>
      </div>
      <div class="viewCRFform-component">

        <form v-if="pageNum == 1 || isPrint" id="dengue1" type="submit">
          <div id="case-report-form" class="center">
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

            <div class="field-row" style="display: inline-flex; margin-bottom: -1 px">
              <div class="half-half half-half1">
                <div class="birthday-field field">
                  <label for="birthdate" class="required"> Date of Birth </label>
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
                <div class="sex-field field">
                  <label class="required"> Sex </label>
                  <div style="display: inline-flex; align-items: center">
                    <input
                      id="female"
                      v-model="formData.patient.sex"
                      value="Female"
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
                      value="Male"
                      class="input-radio"
                      name="sex"
                      type="radio"
                      :disabled="inputEdit()"
                    />
                    <label for="male"> Male </label>
                  </div>
                </div>
              </div>

              <div class="half-half half-half2">
                <div class="status-field field">
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
            </div>

            <div class="field-row">
              <div class="field">
                <label for="currentAddress" class="required"> Current Address: Street / House No. </label>
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
              <div class="name-field">
                <label for="currCity" class="required"> City </label>
                <input id="currCity" v-model="formData.patient.currCity" class="input-form-field" name="currCity" :disabled="inputEdit()"/>
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
                <input
                  id="permCity"
                  v-model="formData.patient.permCity"
                  class="input-form-field"
                  name="permCity"
                  :disabled="inputEdit()"
                />
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
                <label for="contactperson" class="required"> Parent / Caregiver </label>
                <input
                  id="contactperson"
                  v-model="formData.patient.guardianName"
                  class="input-form-field"
                  type="text"
                  :disabled="inputEdit()"
                />
              </div>
              <div class="name-field">
                <label for="contactpersonNum" class="required"> Contact No. </label>
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

        <form v-if="pageNum == 2 || isPrint" id="dengue2" type="submit">
          <div id="case-report-form" class="center">
            <h2 id="form-header"> {{ Object.values(disease.formNames)[2] }} </h2>

            <div class="field-row">
              <div class="thirtyDesk" style="display: inline-flex; flex-direction: row">
                <div class=" field">
                  <label class="required"> Patient Consulted </label>
                  <div style="display: inline-flex; align-items: center">
                    <input
                      id="noConsult"
                      v-model="formData.caseData.patientConsulted"
                      value="no"
                      class="input-radio"
                      name="patientConsulted"
                      type="radio"
                      :disabled="inputEdit()"
                    />
                    <label for="noConsult"> No </label>
                  </div>
                  <div style="display: inline-flex; align-items: center">
                    <input
                      id="yesConsult"
                      v-model="formData.caseData.patientConsulted"
                      value="yesConsult"
                      class="input-radio"
                      name="patientConsulted"
                      type="radio"
                      :disabled="inputEdit()"
                    />
                    <label for="yesConsult"> Yes </label>
                  </div>
                </div>
              </div>
              <div class="patientConsultDate-field field">
                <label for="patientConsultDate">
                  Date of First Consultation
                </label>
                <input
                  id="patientConsultDate"
                  v-model="formData.caseData.patientConsultDate"
                  class="input-form-field"
                  type="date"
                  :disabled="inputEdit()"
                />
              </div>
              <div class="indigenousGroup-field field" style="width: 40%">
                <label for="patientConsultPlace"> Place of Consultation </label>
                <input
                  id="patientConsultPlace"
                  v-model="formData.patient.patientConsultPlace"
                  class="input-form-field"
                  type="text"
                  :disabled="inputEdit()"
                />
              </div>
            </div>

            <div class="field-row">
              <div class="thirtyDesk" style="display: inline-flex; flex-direction: row">
                <div class=" field">
                  <label class="required"> Patient Admitted </label>
                  <div style="display: inline-flex; align-items: center">
                    <input
                      id="noAdmit"
                      v-model="formData.patient.admitStatus"
                      value="noAdmit"
                      class="input-radio"
                      name="admitStatus"
                      type="radio"
                      :disabled="inputEdit()"
                    />
                    <label for="noAdmit"> No </label>
                  </div>
                  <div style="display: inline-flex; align-items: center">
                    <input
                      id="yesAdmit"
                      v-model="formData.patient.admitStatus"
                      value="yesAdmit"
                      class="input-radio"
                      name="admitStatus"
                      type="radio"
                      :disabled="inputEdit()"
                    />
                    <label for="yesAdmit"> Yes </label>
                  </div>
                </div>
              </div>
              <div class="patientConsultDate-field field">
                <label for="patientConsultDate">
                  Date Admitted / Seen / Consulted
                </label>
                <input
                  id="dateAdmitted"
                  v-model="formData.cases.dateAdmitted"
                  class="input-form-field"
                  type="date"
                  :disabled="inputEdit()"
                />
              </div>
              <div class="indigenousGroup-field field" style="width: 40%">
                  
                </div>
            </div>
            <div class="field-row" style="width:50%">
              <div class="dateOnset-field field">
                <label for="dateOnset" class="required">
                  Date onset of Illness (first Symptom/s)
                </label>
                <input
                  id="dateAdmitted"
                  v-model="formData.cases.dateOnset"
                  class="input-form-field"
                  type="date"
                  :disabled="inputEdit()"
                />
              </div>
            </div>
          </div>

          <hr />

          <div id="case-report-form" class="center">
            <h2 id="form-header">Risk Factors</h2>

            <div class="risk-flex">
              <div style="display: inline-flex; flex-direction: column; margin: 0 30px;">
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
                        <label for="LPhysicalInactivity">Physical Inactivity</label>
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
                              class="input-form-field"
                              type="text"
                              style="width: 150px; height: 20px; margin: 0 2px;"
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
                              class="input-form-field"
                              type="text"
                              style="
                                width: 150px;
                                height: 20px;
                                margin: 0 2px;
                              "
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
                              class="input-form-field"
                              type="text"
                              style="width: 150px; height: 20px; margin: 0 2px;"
                              :disabled="inputEdit()"
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="field-row" style="display: block; margin-bottom: -1 px; margin: 0 30px">
                <div class="field" style="display: block">
                  <h3 class="required">Other Risks:</h3>
                  <div style="flex-direction: column; align-items: center">
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
                      <label for="OHealthEdu">
                        Lack of health education
                      </label>
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
                            class="input-form-field"
                            type="text"
                            style="width: 150px; height: 20px; margin: 0 2px"
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
        </form>
        <hr v-if="isPrint" />

        <form v-if="pageNum == 3 || isPrint" id="dengue3" type="submit">
          <div id="case-report-form" class="center">
            <h2 id="form-header"> {{ Object.values(disease.formNames)[3] }} </h2>

            <div class="field-row">
              <div class="thirtyDesk" style="display: inline-flex; flex-direction: row; width:22%">
                <div class=" field">
                  <label class="required"> Vaccinated with Dengue Vaccine </label>
                  <div style="display: inline-flex; align-items: center">
                    <input
                      id="noVaccine"
                      v-model="formData.caseData.vaccine"
                      value="No"
                      class="input-radio"
                      name="patientConsulted"
                      type="radio"
                      :disabled="inputEdit()"
                    />
                    <label for="noVaccine"> No </label>
                  </div>
                  <div style="display: inline-flex; align-items: center">
                    <input
                      id="yesVaccine"
                      v-model="formData.caseData.vaccine"
                      value="Yes"
                      class="input-radio"
                      name="patientConsulted"
                      type="radio"
                      :disabled="inputEdit()"
                    />
                    <label for="yesVaccine"> Yes </label>
                  </div>
                </div>
              </div>
              <div v-if="formData.caseData.vaccine==='Yes'" class="field" style="width:39%">
                <label for="vaccineFirstDate">
                  Date First Vaccinated
                </label>
                <input
                  id="vaccineFirstDate"
                  v-model="formData.caseData.vaccineFirstDate"
                  class="input-form-field"
                  type="date"
                  :disabled="inputEdit()"
                />
              </div>
              <div v-if="formData.caseData.vaccine==='Yes'" class="field" style="width:39%">
                <label for="patientConsultPlace"> Date Last Vaccinated </label>
                <input
                  id="patientConsultPlace"
                  v-model="formData.caseData.vaccineLastdate"
                  class="input-form-field"
                  type="date"
                  :disabled="inputEdit()"
                />
              </div>
            </div>
          </div>
        </form>
        <hr v-if="isPrint" />

        <form v-if="pageNum == 4 || isPrint" id="dengue4" type="submit">
          <div id="case-investigation-form" class="center">
            <h2 id="form-header">
              {{ Object.values(disease.formNames)[4] }}
            </h2>

            <div
              class="field-row"
              style="display: inline-flex; margin-bottom: -1 px"
            >
              <div class="field">
                <label class="required">
                  Please select the clinical classification
                </label>
                <div>
                  <div style="display: inline-flex; flex-direction: column">
                    <div
                      v-for="(value, name, i) in clinicalClassification"
                      :key="i"
                      class="checkbox-options"
                    >
                      <input
                        :id="i"
                        v-model="formData.caseData.clinicalClassification"
                        :value="name"
                        class="input-checkbox"
                        name="clinicalClassification"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label :for="i">
                        {{ value.name }}
                      </label>
                      <!-- <div class="tooltip">
                        <img
                          id="infofever"
                          class="info-icon-img"
                          src="~/assets/img/infoicon.png"
                        />
                        <span class="tooltipText" style="width: 500px">{{
                          value
                        }}</span>
                      </div> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
        <hr v-if="isPrint" />

        <form v-if="pageNum == 5 || isPrint" id="dengue5" type="submit">
          <div id="case-investigation-form" class="center">
            <h2 id="form-header">
              {{ Object.values(disease.formNames)[5] }}
            </h2>

            <div class="field-row">
              <div class="field">
                <label class="required"> Please select the outcome </label>
                <div style="display: inline-flex; flex-display: row; margin-right: 50px;">
                  <div style="display: inline-flex; align-items: center; margin-right: 30px;">
                    <input
                      id="Alive"
                      v-model="formData.caseData.outcome"
                      value="Alive"
                      class="input-radio"
                      name="outcome"
                      type="radio"
                      :disabled="inputEdit()"
                    />
                    <label for="Alive"> Alive </label>
                  </div>

                  <div style="display: inline-flex; align-items: center; margin-right: 30px;">
                    <input
                      id="Dead"
                      v-model="formData.caseData.outcome"
                      value="Dead"
                      class="input-radio"
                      name="outcome"
                      type="radio"
                      :disabled="inputEdit()"
                    />
                    <label for="Dead"> Dead </label>
                  </div>
                </div>

                <div v-if="formData.caseData.outcome == 'Dead'" class="field-row-straight">
                  <div class="field" style="margin-left: 95px">
                    <label for="dateDied" class="required"> Date died </label>
                    <input
                      id="dateDied"
                      v-model="formData.cases.dateDied"
                      class="input-form-field"
                      style="width: 175px"
                      type="date"
                      :disabled="inputEdit()"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="field-row-straight">
              <div class="field">
                <label for="finalDiagnosis" class="">
                  Other Remarks
                </label>
                <input
                  id="finalDiagnosis"
                  v-model="formData.cases.finalDiagnosis"
                  class="input-form-field"
                  style="width: 50%"
                  type="text"
                  :disabled="inputEdit()"
                />
              </div>
            </div>
          </div>
        </form>

        <form v-if="pageNum == 6 || isPrint" id="dengue6" type="submit">
          <div id="case-investigation-form" class="center">
            <h2 id="form-header">
              {{ Object.values(disease.formNames)[6] }}
            </h2>

            <div class="vaccine-field field">
                <label class="required" style="margin-right: 50px">
                  Do you have the lab result?
                </label>
                <div style="display: inline-flex; flex-direction: row">
                  <div class="center-center">
                    <input
                      id="noLabTest"
                      v-model="hasLabTest"
                      value="No"
                      class="input-radio"
                      name="labTest"
                      type="radio"
                      :disabled="inputEdit()"
                    />
                    <label for="noLabTest"> No </label>
                  </div>
                  <div class="center-center" style="margin: 0 20px">
                    <input
                      id="yesLabTest"
                      v-model="hasLabTest"
                      value="Yes"
                      class="input-radio"
                      name="labTest"
                      type="radio"
                      :disabled="inputEdit()"
                    />
                    <label for="yesLabTest"> Yes </label>
                  </div>
                </div>
              </div>

              <div v-show="hasLabTest==='No'">
                <div class="name-field" style="width:50%">
                  <label for="investigatorLab" class="required"> Choose Lab to forward the case to </label>
                  <select id="investigatorLab" v-model="formData.cases.investigatorLab" name="investigatorLab" :disabled="inputEdit()">
                    <option v-for="(lab, i) in labList" :key=i>{{lab}}</option>
                  </select>
                </div>
              </div>

              <div v-show="hasLabTest==='Yes'" style="margin-left:7px;">
                <div class="field-row-straight" style="display: inline-flex; flex-direction: row">
                  <div style="width:10%; align-self:center;font-size:20px;font-weight:500">
                    <label for="labSpecimen">
                      NS1
                    </label>
                  </div>
                  <div style="width:40%" class="field">
                    <label for="ns1Date">
                      Date done
                    </label>
                    <input
                      id="ns1Date"
                      v-model="formData.caseData.ns1Date"
                      class="input-form-field"
                      type="date"
                      :disabled="inputEdit()"
                    />
                  </div>
                  <div style="width:51%" class="field">
                    <label for="ns1Result">
                      Result
                    </label>
                    <select
                      id="ns1Result"
                      v-model="formData.caseData.ns1Result"
                      name="ns1Result"
                      :disabled="inputEdit()"
                    >
                      <option value="Single">Positive</option>
                      <option value="Married">Negative</option>
                      <option value="Separated">Equivocal</option>
                      <option value="Widowed">Pending Result</option>
                    </select>
                  </div>
                </div>
                <div class="field-row-straight" style="display: inline-flex; flex-direction: row">
                  <div style="width:10%; align-self:center;font-size:20px;font-weight:500">
                    <label for="labSpecimen">
                      IgG ELISA
                    </label>
                  </div>
                  <div style="width:40%" class="field">
                    <label for="iggDate">
                      Date done
                    </label>
                    <input
                      id="iggDate"
                      v-model="formData.caseData.iggDate"
                      class="input-form-field"
                      type="date"
                      :disabled="inputEdit()"
                    />
                  </div>
                  <div style="width:51%" class="field">
                    <label for="iggResult">
                      Result
                    </label>
                    <select
                      id="iggResult"
                      v-model="formData.caseData.iggResult"
                      name="iggResult"
                      :disabled="inputEdit()"
                    >
                      <option value="Single">Positive</option>
                      <option value="Married">Negative</option>
                      <option value="Separated">Equivocal</option>
                      <option value="Widowed">Pending Result</option>
                    </select>
                  </div>
                </div>
                <div class="field-row-straight" style="display: inline-flex; flex-direction: row">
                  <div style="width:10%; align-self:center;font-size:20px;font-weight:500">
                    <label for="igmDate">
                      IgM ELISA
                    </label>
                  </div>
                  <div style="width:40%" class="field">
                    <label for="igmDate">
                      Date done
                    </label>
                    <input
                      id="igmDate"
                      v-model="formData.caseData.igmDate"
                      class="input-form-field"
                      type="date"
                      :disabled="inputEdit()"
                    />
                  </div>
                  <div style="width:51%" class="field">
                    <label for="igmResult">
                      Result
                    </label>
                    <select
                      id="igmResult"
                      v-model="formData.caseData.igmResult"
                      name="igmResult"
                      :disabled="inputEdit()"
                    >
                      <option value="Single">Positive</option>
                      <option value="Married">Negative</option>
                      <option value="Separated">Equivocal</option>
                      <option value="Widowed">Pending Result</option>
                    </select>
                  </div>
                </div>
                <div class="field-row-straight" style="display: inline-flex; flex-direction: row">
                  <div style="width:10%; align-self:center;font-size:20px;font-weight:500">
                    <label for="pcrDate">
                      PCR
                    </label>
                  </div>
                  <div style="width:40%" class="field">
                    <label for="iggDate">
                      Date done
                    </label>
                    <input
                      id="pcrDate"
                      v-model="formData.caseData.pcrDate"
                      class="input-form-field"
                      type="date"
                      :disabled="inputEdit()"
                    />
                  </div>
                  <div style="width:51%" class="field">
                    <label for="pcrResult">
                      Result
                    </label>
                    <select
                      id="pcrResult"
                      v-model="formData.caseData.pcrResult"
                      name="pcrResult"
                      :disabled="inputEdit()"
                    >
                      <option value="Single">Positive</option>
                      <option value="Married">Negative</option>
                      <option value="Separated">Equivocal</option>
                      <option value="Widowed">Pending Result</option>
                    </select>
                  </div>
                </div>
              </div>
            
          </div>
        </form>
        <hr v-if="isPrint" />

        <form v-if="pageNum == 7 || isPrint" id="dengue7" type="submit">
          <div id="case-investigation-form" class="center">
            <h2 id="form-header">
              {{ Object.values(disease.formNames)[7] }}
            </h2>

            <div
              class="field-row"
              style="display: inline-flex; margin-bottom: -1 px"
            >
              <div class="field">
                <label class="required">
                  Please select the case classification
                </label>
                <div>
                  <div style="display: inline-flex; flex-direction: column">
                    <div
                      v-for="(value, name, i) in caseLevel"
                      :key="i"
                      class="checkbox-options"
                    >
                      <input
                        :id="i"
                        v-model="formData.caseData.caseLevel"
                        :value="name"
                        class="input-checkbox"
                        name="caseLevel"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label :for="i">
                        {{ name }}
                      </label>
                      <div class="tooltip">
                        <img
                          id="infofever"
                          class="info-icon-img"
                          src="~/assets/img/infoicon.png"
                        />
                        <span class="tooltipText" style="width: 500px">{{
                          value
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
        <hr v-if="isPrint" />
      
      </div>
      <div class="CRF-statusHistory">
        <h2 style="border-bottom: gray solid; width: fit-content; padding: 0 7px 0 5px;">Case Status History</h2>
        <dataTable
          :options="tableOptions"
          :datavalues="caseHistory"
          :casetype="'patient'"
        />
      </div>
    </div>
    <div v-show="editStatus" class="overlay">
      <div class="overlay-form">
        <button class="close" @click="status('cancel')">x</button>
        <div class="field-row" style="display: inline-flex; margin-bottom: -1 px">
          <div class="field">
            <h2 id="form-header" class="required">
              Please select the final classification
            </h2>
            <div>
              <!-- <div style="display: inline-flex; flex-direction: column"> -->
              <!-- CASE DEFINITION -->
              <div>
                <div class="collpaseWrapper">
                  <ul v-for="(value, name, i) in caseLevel" :key="i" style="displayLinline-flex">
                    <li>
                      <input :id="name" type="checkbox" class="collapseInput"/>
                      <label :for="name" class="collapseLabel">
                        <input
                          :id="name"
                          v-model="newStatus"
                          :value="name"
                          class="input-checkbox"
                          name="finalClassification"
                          type="radio"
                          :disabled="statusInputEdit(name)"
                        />
                        {{ name }}
                      </label>
                      <ul>
                        <li style="background-color: lightgrey;">{{ value }}</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div style="margin: -10px 10 5px; float: right; margin-left: auto;">
              <button class="back-button" type="button" @click="status('cancel')">
                Cancel
              </button>
              <button class="next-button" type="button" @click="status('save')">
                Save
              </button>
            </div>
          </div>
        </div>
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
    title: 'View CRF',
  },
  compute: {},
  data() {
    return {
      editStatus:false,
      weekNo: '2021-20',
      labList: ['a','b','c','d'],
      newStatus:'',
      hasLabTest:'',
      isDisabled: false,
      editCase: false,
      isPrint: false,
      diseaseID: 'DI-0000000000000',
      caseDefs: [],
      pageNum: 1,
      formPart: 'Dengue0',
<<<<<<< HEAD
      tableOptions: {
        tableName: 'cases',
        columns: [
          {
            title: 'Date',
            key: 'reportDate',
            type: 'text',
            dateFormat: true,
            currentFormat: 'YYYY-MM-DD',
            expectFormat: 'DD MMM YYYY',
            // sortable: true,
          },
          {
            title: 'From',
            key: 'from',
            type: 'text',
            source: 'cases',
            uniqueField: 'id',
          },
          {
            title: 'To',
            key: 'to',
            type: 'text',
            source: 'cases',
            uniqueField: 'id',
          },
          {
            title: 'Reported By',
            key: 'reportedBy',
            type: 'text',
            source: 'cases',
            uniqueField: 'id',
          },
        ],
        // source: 'http://demo.datatable/api/users',
        search: true,
      },
      caseHistory: [
        {
          reportDate: '2020-10-10',
          from: 'a',
          to: 'a',
          reportedBy: 'a',
        },
        {
          reportDate: '2021-10-10',
          from: 'b',
          to: 'b',
          reportedBy: 'b',
        }
      ],
=======
      CRFData:{
        CRFID: '',
        diseaseID: '',
        userID:'',
        week:'',
        year:'',
        isPushed:false
      },
      DRUData:{
        druName:'',
        druType:'',
        druCity:'',
        druAddress:''
      },
>>>>>>> 197d18fba817f5e81e0bec5781bbfc309ffc7d56
      formData: {
        cases: {
          caseID: '',
          diseaseID: '',
          reportedBy: '',
          caseLevel: 'Probable',
          reportDate: '',
          investigationDate: '',
          dateAdmitted: '',
          dateOnset: '',
          reporterName: '',
          reporterContact: '',
          investigatorName: '',
          investigatorContact: '',
          investigatorLab:'',
        },
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
        caseData: {
          patientConsulted: '',
          patientConultDate:'',
          patientConsultPlace:'',
          // Lab
          ns1Date:'',
          ns1Result:'',
          iggDate:'',
          iggResult:'',
          igmDate:'',
          igmResult:'',
          pcrDate:'',
          pcrResult:'',
          // Page 6++
          finalClassification: '',
          clinicalClassification: '',
          sourceInfection: '',
          outcome: '',
          dateDied: '',
          finalDiagnosis: '',
        },
      },
      info: {
        complications: 'i',
        otherSymptoms: 'j',
        diagnosis: 'k',
        // page 3
        MCVaccine: '',
        vitA: '',
      },
      disease: {
        idname: 'Dengue',
        name: 'Dengue',
        formNames: {
          form0: 'Search Patient',
          form1: 'Patient Record',
          form2: 'Patient Information',
          form3: 'Vaccination History',
          form4: 'Clinical Classification',
          form5: 'Outcome',
          form6: 'Laboratory Tests',
          form7: 'Case Classification',
        },
      },
      rowData: {
        caseID: 1234,
        disease: 'Dengue',
        city: 'Manila',
        patientNo: '123',
        submittedDate: '2020-10-10',
        updatedDate: '2020-10-10',
        status: 'IDK',
      },
      clinicalClassification: [
        {name: 'Dengue Without Warning Signs',
          description: 'Person with acute febrile illness of 2-7 days duration plus two of the following:',
          symptoms:['Headache','Body Malaise','Mylagia','Arthralgia','Retro-orbital pain','Anorexia',
                    'Nausea','Vomiting','Diarrhea','Flushed Skin','Skin Rash (Petecheal, Herman\'s Sign)']},
        {name: 'Dengue With Warning Signs',
          description: 'Person with acute febrile illness of 2-7 days duration with any of the following:',
          symptoms:['Abdominal Pain or Tenderness','Persistent Vomiting','Clinical Fluid Accumulation (ascites, pleural effussion)',
                    'Mucosal Bleeding','Lethargy','Restlessness','Liver Enlargement > 2cm','Laboratory: increase in HCT concurrect with rapid decrease in platelet count']},
        {name: 'Severe Dengue **(requires strict observation and medical intervention)',
          description: 'Dengue with atleast one of the following critera:',
          symptoms:['Severe Plasma Leakage: leading to shock and/or fluid accumultation with respiratory distress',
                    'Severe Bleeding: as evaluated by clinician',
                    'Severe Organ Involvement: such as AST or ALT ≥ 1000, impaired consciosness and failure of heart and other organs.']}
      ],
      caseLevel: {
        'Suspect':'A previously well person with acute febrile illness of 2-7 days duration with clinical signs and symptoms of dengue',
        'Probable':'A suspected case with positive dengue IgM antibody test',
        'Confirmed':'Viral culture isolation, or Polymerase Chain Reaction (PCR), or Dengue NS1 antigen test',
      },
    }
  },
  async fetch() {
    const data = (await axios.get('http://localhost:8080/api/getCRF?caseID=' + this.$route.query.caseID)).data;
    // const data = (await axios.get('http://localhost:8080/api/getCRF?caseID=' + 'CA-0000000000007')).data;
    this.formData.cases = data.cases;
    this.formData.caseData = data.caseData;
    this.formData.patient = data.patient;
    this.formData.riskFactors = data.riskFactors; // working already
    this.DRUData = data.DRUData;
    this.CRFData = data.crfData;
    
    // fixing dates

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
      if (this.pageNum === 6 && this.$auth.user.userID === this.formData.cases.investigatorLab) return false;
      else return true;
    },
    statusInputEdit(value) {
      if (this.editStatus & value!==this.formData.cases.caseLevel ) return false
      else return true
    },
    popup() {
      this.editStatus = !this.editStatus
    },
    status(change) {
      if (change==='save') {
        this.formData.caseData.finalClassification = this.newStatus;
        this.formData.cases.caseLevel = this.newStatus;
        // TODO: add notification here -julia
        // TODO: add notif/alert checking here 
      }
      if (change==='cancel') {
        this.newStatus = this.formData.cases.caseLevel;
      }
      this.popup()
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

.viewCRF-container {
  padding: 80px 20px 5px 20px;
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .viewCRF-ontainer {
    width: 100%;
    align-items: center;
    margin: 0px;
  }
}

.viewCRF-section-container {
  /* left: 275px; */
  /* position: relative; */
  /* width: calc(100vw - 320px); */
  /* margin: 5px; */
  width: 100%;
  padding: 5px;
  margin: 10px;
}

@media only screen and (max-width: 800px) {
  .viewCRF-section-container {
    width: 95%;
  }
}

.CRF-SummaryContainer {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  overflow-y: hidden;
  z-index: 1;
}

.formSummaryItems {
  background: white;
  border: 1px #f2f2f2 solid;
  border-radius: 10px 10px 0 0;
  margin: 0 -1px -1px 0;
  padding: 5px 7px;
  cursor: pointer;
}

.formSummaryItems:hover {
  background: #f2f2f2;
}

.formSummaryItems.selected {
  background: #f2f2f2;
  font-weight: 400;
  pointer-events: none;
}

.viewCRFform-component {
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
  .viewCRFform-component {
    position: relative;
    top: 0px;
    min-height: fit-content;
    border-radius: 0 0 10px 10px;
  }
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

b {
  /* color: #346083; */
  font-size: 18px;
  font-weight: 600;
}

.CRFreports {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 7.5px;
}

.CRFActionButtons {
  display: inline-flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;
}

.CRFActionButton {
  width: 50px;
  height: 50px;
  padding: 10px;
  border-radius: 30px;
  cursor: pointer;
}

/* .CRFActionButton:hover {
  background: #a3a3a3;
} */

.printCaseButton {
  width: 30px;
  height: 30px;
  margin-top: 10px;
  margin-bottom: -10px;
}

.CRFEdit {
  width: 30px;
  height: 30px;
  padding: 5px;
}

/* #saveIcon:hover {
  background: url("~/assets/img/saved.png");

} */

.CRF-statusHistory {
  margin-top:10px;
  margin-bottom:30px;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  text-align: left;
  padding: 8px;
}

tr:nth-child(odd) {background-color: #f2f2f2;}

/* POPUP BELOW */

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


/* COLLAPSE EME BELOW */

.collpaseWrapper {
  margin: 15px 0;
  padding: 15px auto;
  width: 99%;
  /* background-color: lightgrey; */
  /* border: lightgray solid 1px; */
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
  z-index: 1;
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
  margin-left: 40px;
  bottom: 130%;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 14px;
  opacity: 0;
  transition: all 0.5s;
  z-index: -2;
}

.shorttooltip:hover .shorttooltipText {
  opacity: 1;
  transform: translateY(-10px);
  margin: 0;
}

#infofever:hover ~ .tooltipText {
  opacity: 1;
  transform: translateY(-10px);
  z-index: 3;
  margin-left: 300px;
}

.tooltipText::after {
  content: '';
  border-width: 5px;
  border-style: solid;
  border-color: #fff transparent transparent transparent;
  position: absolute;
  top: 100%;
  left: 40%;
  margin-left: -21%;
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
  z-index: 1;
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
</style>

