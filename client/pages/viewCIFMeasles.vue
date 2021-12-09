<template>
  <div id="viewCIF">
    <!--Top Bar of the screen-->
    <TopNav />
    <div ref="content" class="viewCIF-container">
      <div class="viewCIF-details" style="align-text: left">
        <div class="CIFnumbers">
          <h1 style="margin: -10px 0">Case No. {{ formData.cases.caseID }}</h1>
          <h2 style="margin-top: -1px">
            Patient No. <a href="/patient" class="patientlink"> {{ formData.patient.patientID }} </a>
          </h2>
        </div>
        <div class="CIFstatus" style="align-text: right">
          <span style="display: inline-flex; align-items: center"
            >Case Status:&nbsp;
            <div v-show="!editStatus" class="CIFActionButtons">
              <h1 style="line-height: 1; align-items: center">
                {{ formData.cases.caseLevel }}
              </h1>
              <ul
                v-show="!isPrint"
                class="CIFEdit"
                @click="popup()"
              >
                <img src="~/assets/img/pen.png" />
              </ul>
            </div>
          </span>
          <div v-show="!editStatus && !isPrint" class="CIFActionButtons">
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
          <p>DRU Type: <b>type</b></p>
          <p>DRU Address: <b>house</b></p>
        </div>
        <div class="CIFstatus" style="align-text: right">
          
          <p>Reported Date: <b>{{ formData.cases.reportDate }}</b></p>
          <p>Last Updated: <b>{{ formData.cases.updatedDate }}</b></p>
        </div>
      </div>
      <div v-show="!isPrint" class="CIF-SummaryContainer">
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
      <div class="viewCIF-component">
        <form v-if="pageNum == 1 || isPrint" id="measles1" type="submit">
          <div id="case-investigation-form" class="center">
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
                      v-model="formData.caseData.pregnancy"
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
                        v-model="formData.patient.pregMonths"
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
                <select
                  id="currCity"
                  v-model="formData.patient.currCity"
                  name="currCity"
                  :disabled="inputEdit()"
                >
                </select>
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
                <select
                  id="permCity"
                  v-model="formData.patient.permCity"
                  name="permCity"
                  :disabled="inputEdit()"
                >
                </select>
              </div>
              <div class="field">
                <label for="permBarangay"> Barangay </label>
                <input
                  id="permBarangay"
                  v-model="formData.patient.permBarangay"
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
            <h2 id="form-header">
              {{ Object.values(disease.formNames)[2] }}
            </h2>

            <div class="field-row">
              <div
                class="sixtyDesk"
                style="display: inline-flex; flex-direction: row"
              >
                <div class="patientAdmitted-field field">
                  <label class="required"> Patient Admitted </label>
                  <div style="display: inline-flex; align-items: center">
                    <input
                      id="yesAdmitted"
                      v-model="formData.caseData.patientAdmitted"
                      value="Yes"
                      class="input-radio"
                      name="patientAdmitted"
                      type="radio"
                      :disabled="inputEdit()"
                    />
                    <label for="yesAdmitted"> Yes </label>
                  </div>
                  <div style="display: inline-flex; align-items: center">
                    <input
                      id="noAdmitted"
                      v-model="formData.caseData.patientAdmitted"
                      value="No"
                      class="input-radio"
                      name="patientAdmitted"
                      type="radio"
                      :disabled="inputEdit()"
                    />
                    <label for="noAdmitted"> No </label>
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
          </div>

          <hr />

          <div id="case-investigation-form" class="center">
            <h2 id="form-header">Risk Factors</h2>

            <div class="risk-flex">
              <div
                style="
                  display: inline-flex;
                  flex-direction: column;
                  margin: 0 30px;
                "
              >
                <div style="display: block">
                  <div
                    class="field-row"
                    style="
                      display: inline-flex;
                      margin-bottom: -1 px;
                      flex-direction: column;
                    "
                  >
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

                <div
                  class="field-row"
                  style="display: block; margin-bottom: -1 px"
                >
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
                              style="width: 150px; height: 20px; margin: 0 2px"
                              :disabled="inputEdit()"
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="field-row"
                  style="display: block; margin-bottom: -1 px"
                >
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

              <div
                class="field-row"
                style="display: block; margin-bottom: -1 px; margin: 0 30px"
              >
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

        <form v-if="pageNum == 3 || isPrint" id="measles3" type="submit">
          <div id="case-investigation-form" class="center">
            <h2 id="form-header">
              {{ Object.values(disease.formNames)[3] }}
            </h2>

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
                    <div class="checkbox-options" style="display: inline-flex">
                      <input
                        id="fever"
                        value="fever"
                        class="input-checkbox"
                        name="fever"
                        type="checkbox"
                        :disabled="inputEdit()"
                      />
                      <div class="checkbox-options">
                        <label for="fever">
                          Fever
                          <input
                            id="fever"
                            v-model="formData.caseData.sympFever"
                            class="input-form-field"
                            type="date"
                            style="width: 175px; height: 20px; margin: 0 2px"
                            :disabled="inputEdit()"
                          />
                        </label>
                      </div>
                    </div>

                    <div class="checkbox-options">
                      <input
                        id="rash"
                        value="rash"
                        class="input-checkbox"
                        name="rash"
                        type="checkbox"
                        :disabled="inputEdit()"
                      />
                      <div class="checkbox-options">
                        <label for="rash">
                          Rash

                          <input
                            id="rash"
                            v-model="formData.caseData.sympRash"
                            class="input-form-field"
                            type="date"
                            style="width: 175px; height: 20px; margin: 0 2px"
                            :disabled="inputEdit()"
                          />
                        </label>
                      </div>
                    </div>

                    <div class="checkbox-options">
                      <input
                        id="lymph"
                        v-model="formData.caseData.sympLymph"
                        value="lymph"
                        class="input-checkbox"
                        name="lymph"
                        type="checkbox"
                        :disabled="inputEdit()"
                      />
                      <label for="lymph">
                        Swollen lymphatic nodules (specify location)
                      </label>
                    </div>
                  </div>

                  <div class="symptoms-half">
                    <div class="checkbox-options">
                      <input
                        id="cough"
                        v-model="formData.caseData.sympCough"
                        value="cough"
                        class="input-checkbox"
                        name="cough"
                        type="checkbox"
                        :disabled="inputEdit()"
                      />
                      <label for="cough"> Cough </label>
                    </div>

                    <div class="checkbox-options">
                      <input
                        id="koplik"
                        v-model="formData.caseData.sympKoplik"
                        value="koplik"
                        class="input-checkbox"
                        name="koplik"
                        type="checkbox"
                        :disabled="inputEdit()"
                      />
                      <label for="koplik"> Koplik Sign </label>
                    </div>

                    <div class="checkbox-options">
                      <input
                        id="runnynose"
                        v-model="formData.caseData.sympRunnynose"
                        value="runnynose"
                        class="input-checkbox"
                        name="runnynose"
                        type="checkbox"
                        :disabled="inputEdit()"
                      />
                      <label for="runnynose"> Runny Nose </label>
                    </div>

                    <div class="checkbox-options">
                      <input
                        id="redeye"
                        v-model="formData.caseData.sympRedeye"
                        value="redeye"
                        class="input-checkbox"
                        name="redeye"
                        type="checkbox"
                        :disabled="inputEdit()"
                      />
                      <label for="redeye"> Red eye/conjunctivitis </label>
                    </div>

                    <div class="checkbox-options">
                      <input
                        id="arthritis"
                        v-model="formData.caseData.sympArthritis"
                        value="arthritis"
                        class="input-checkbox"
                        name="arthritis"
                        type="checkbox"
                        :disabled="inputEdit()"
                      />
                      <label for="arthritis"> Arthralgia/arthritis </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="field-row">
              <div class="field">
                <label for="complications">
                  Are there any complications? Please specify.
                  <!-- <img
                      id="infofever"
                      class="info-icon-img"
                      src="~/assets/img/infoicon.png"
                    />
                    <div class="info-desc infodesc-outside">
                      {{ info.complications }}
                    </div> -->
                  <div class="tooltip shorttooltip">
                    <span class="tooltipText shorttooltipText">{{
                      info.complications
                    }}</span>
                    <img
                      id="infofever"
                      class="info-icon-img"
                      src="~/assets/img/infoicon.png"
                    />
                  </div>
                </label>
                <input
                  id="complications"
                  v-model="formData.caseData.complications"
                  class="input-form-field"
                  type="text"
                  :disabled="inputEdit()"
                />
              </div>
            </div>

            <div class="field-row">
              <div class="field">
                <label for="otherSymptoms">
                  Other symptoms
                  <div class="tooltip shorttooltip">
                    <span class="tooltipText shorttooltipText">{{
                      info.otherSymptoms
                    }}</span>
                    <img
                      id="infofever"
                      class="info-icon-img"
                      src="~/assets/img/infoicon.png"
                    />
                  </div>
                </label>
                <input
                  id="otherSymptoms"
                  v-model="formData.caseData.otherSymptoms"
                  class="input-form-field"
                  type="text"
                  :disabled="inputEdit()"
                />
              </div>
            </div>

            <div class="field-row">
              <div class="field">
                <label for="diagnosis">
                  Working/Final Diagnosis
                  <div class="tooltip shorttooltip">
                    <span class="tooltipText shorttooltipText">{{
                      info.diagnosis
                    }}</span>
                    <img
                      id="infofever"
                      class="info-icon-img"
                      src="~/assets/img/infoicon.png"
                    />
                  </div>
                </label>
                <input
                  id="diagnosis"
                  v-model="formData.caseData.diagnosis"
                  class="input-form-field"
                  type="text"
                  :disabled="inputEdit()"
                />
              </div>
            </div>
          </div>
        </form>
        <hr v-if="isPrint" />

        <form v-if="pageNum == 4 || isPrint" id="measles4" type="submit">
          <div id="case-investigation-form" class="center">
            <h2 id="form-header">
              {{ Object.values(disease.formNames)[4] }}
            </h2>
          </div>
          <div>
            <div class="vaccine-field field">
              <label class="required" style="margin-right: 50px">
                Has the patient received Measles-Containing Vaccine (MCV)?
              </label>
              <div style="display: inline-flex; flex-direction: row">
                <div class="center-center">
                  <input
                    id="mcvNo"
                    v-model="formData.caseData.MCVaccine"
                    value="No"
                    class="input-radio"
                    name="mcv"
                    type="radio"
                    :disabled="inputEdit()"
                  />
                  <label for="mcvNo"> No </label>
                </div>
                <div class="center-center" style="margin: 0 20px">
                  <input
                    id="mcvYes"
                    v-model="formData.caseData.MCVaccine"
                    value="Yes"
                    class="input-radio"
                    name="mcv"
                    type="radio"
                    :disabled="inputEdit()"
                  />
                  <label for="mcvYes"> Yes </label>
                </div>
              </div>
            </div>

            <div
              v-if="formData.caseData.MCVaccine == 'Yes'"
              style="padding-left: 7px"
            >
              <div class="field" style="display: block">
                <label style="margin-right: 50px">
                  Indicate the number of doses whichever is applicable
                </label>
                <div
                  style="
                    display: inline-flex;
                    flex-direction: row;
                    margin-left: 5px;
                  "
                >
                  <div style="margin-right: 20px">
                    <label for="MV"> MV </label>
                    <input
                      id="MV"
                      v-model="formData.patient.MCVmv"
                      class="input-form-field"
                      type="number"
                      style="width: 50px; height: 20px"
                      :disabled="inputEdit()"
                    />
                  </div>

                  <div style="margin: 0 20px">
                    <label for="MR"> MR </label>
                    <input
                      id="MR"
                      v-model="formData.patient.MCVmr"
                      class="input-form-field"
                      type="number"
                      style="width: 50px; height: 20px"
                      :disabled="inputEdit()"
                    />
                  </div>

                  <div style="margin: 0 20px">
                    <label for="MMR"> MMR </label>
                    <input
                      id="MMR"
                      v-model="formData.patient.MCVmmr"
                      class="input-form-field"
                      type="number"
                      style="width: 50px; height: 20px"
                      :disabled="inputEdit()"
                    />
                  </div>
                </div>
              </div>

              <div
                class="field"
                style="display: inline-flex; flex-direction: row"
              >
                <label
                  for="MCVlastDoseDate"
                  class="required"
                  style="margin-right: 50px"
                >
                  Date last dose received:
                </label>
                <input
                  id="MCVlastDoseDate"
                  v-model="formData.caseData.MCVlastDoseDate"
                  class="input-form-field"
                  type="date"
                  style="width: 175px; height: 25px"
                  :disabled="inputEdit()"
                />
              </div>

              <div class="field">
                <label class="required">
                  Measles vaccine received validated through:
                </label>
                <div style="display: inline-flex; align-items: center">
                  <input
                    id="Vaccination Card"
                    v-model="formData.caseData.MCVvalidation"
                    value="Vaccination Card"
                    class="input-radio"
                    name="MCVvalidation"
                    type="radio"
                    :disabled="inputEdit()"
                  />
                  <label for="Vaccination Card"> Vaccination Card </label>
                </div>

                <div style="display: inline-flex; align-items: center">
                  <input
                    id="Logsheet"
                    v-model="formData.caseData.MCVvalidation"
                    value="Logsheet"
                    class="input-radio"
                    name="MCVvalidation"
                    type="radio"
                    :disabled="inputEdit()"
                  />
                  <label for="Logsheet"> Logsheet </label>
                </div>

                <div style="display: inline-flex; align-items: center">
                  <input
                    id="By recall"
                    v-model="formData.caseData.MCVvalidation"
                    value="By recall"
                    class="input-radio"
                    name="MCVvalidation"
                    type="radio"
                    :disabled="inputEdit()"
                  />
                  <label for="By recall"> By recall </label>
                </div>

                <div style="display: inline-flex; align-items: center">
                  <input
                    id="VaccineValidateOthers"
                    value="VaccineValidateOthers"
                    class="input-radio"
                    name="MCVvalidation"
                    type="radio"
                    :disabled="inputEdit()"
                  />
                  <label
                    for="VaccineValidateOthers"
                    style="display: inline-flex"
                  >
                    Others, specify:
                    <input
                      id="VaccineValidateOthers"
                      v-model="formData.patient.MCVvalidation"
                      class="input-form-field"
                      type="text"
                      style="width: 150px; height: 20px; margin: 0 2px"
                      :disabled="inputEdit()"
                    />
                  </label>
                </div>
              </div>

              <div class="vaccine-field field vaccine-label">
                <label
                  class="required"
                  for="MCVCampaign"
                  style="margin-right: 50px"
                >
                  Was vaccination received during special campaigns?
                </label>
                <div style="display: inline-flex; flex-direction: row">
                  <div class="center-center">
                    <input
                      id="VaxCampaignNo"
                      v-model="formData.caseData.MCVCampaign"
                      value="No"
                      class="input-radio"
                      name="MCVCampaign"
                      type="radio"
                      :disabled="inputEdit()"
                    />
                    <label for="VaxCampaignNo"> No </label>
                  </div>
                  <div class="center-center" style="margin: 0 20px">
                    <input
                      id="VaxCampaignYes"
                      v-model="formData.caseData.MCVCampaign"
                      value="Yes"
                      class="input-radio"
                      name="MCVCampaign"
                      type="radio"
                      :disabled="inputEdit()"
                    />
                    <label for="VaxCampaignYes"> Yes </label>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="formData.caseData.MCVaccine == 'No'"
              style="padding-left: 7px"
            >
              <div class="field" style="display: block">
                <label class="required"> Please state the reason/s: </label>
                <div style="flex-direction: column; align-items: center">
                  <div
                    v-for="(reason, i) in noVaccineReasons"
                    :key="i"
                    style="
                      display: flex;
                      flex-direction: row;
                      align-items: center;
                    "
                  >
                    <input
                      v-if="i > 0"
                      :id="reason"
                      v-model="formData.caseData.noMCVreason"
                      :value="reason"
                      class="input-radio"
                      name="noMCVreason"
                      type="checkbox"
                    />
                    <label
                      v-if="i > 0"
                      :for="reason"
                      style="display: inline-flex"
                      >{{ reason }}</label
                    >
                  </div>

                  <div style="display: flex; align-items: center">
                    <input
                      id="Others"
                      value="Others"
                      class="input-radio"
                      name="noMCVreason"
                      type="checkbox"
                      :disabled="inputEdit()"
                    />
                    <label for="Others">
                      <div style="display: inline-flex">
                        Others, specify:
                        <input
                          id="Others"
                          v-model="formData.caseData.noMCVreason[0]"
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

            <div class="vaccine-field field">
              <label class="required" for="vitA" style="margin-right: 50px">
                Was the patient given Vitamin A during this illness?
              </label>
              <div style="display: inline-flex; flex-direction: row">
                <div class="center-center">
                  <input
                    id="vitANo"
                    v-model="formData.caseData.vitA"
                    value="No"
                    class="input-radio"
                    name="vitA"
                    type="radio"
                    :disabled="inputEdit()"
                  />
                  <label for="vitANo"> No </label>
                </div>
                <div class="center-center" style="margin: 0 20px">
                  <input
                    id="vitAYes"
                    v-model="formData.caseData.vitA"
                    value="Yes"
                    class="input-radio"
                    name="vitA"
                    type="radio"
                    :disabled="inputEdit()"
                  />
                  <label for="vitAYes"> Yes </label>
                </div>
              </div>
            </div>
          </div>
        </form>
        <hr v-if="isPrint" />

        <form v-if="pageNum == 5 || isPrint" id="measles5" type="submit">
          <div id="case-investigation-form" class="center">
            <h2 id="form-header">
              {{ Object.values(disease.formNames)[5] }}
            </h2>

            <div>
              <div>
                <div class="vaccine-field field">
                  <label class="required" style="margin-right: 50px">
                    With history of travel within 23 days prior to onset of
                    rash?
                  </label>
                  <div style="display: inline-flex; flex-direction: row">
                    <div class="center-center">
                      <input
                        id="noHistory"
                        v-model="formData.caseData.travelHistory"
                        value="No"
                        class="input-radio"
                        name="travelHistory"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="noHistory"> No </label>
                    </div>
                    <div class="center-center" style="margin: 0 20px">
                      <input
                        id="yesHistory"
                        v-model="formData.caseData.travelHistory"
                        value="Yes"
                        class="input-radio"
                        name="travelHistory"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="yesHistory"> Yes </label>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="formData.caseData.travelHistory == 'Yes'"
                class="field-row"
                style="padding: 0 7px"
              >
                <div class="field halffield">
                  <label for="travelHistoryPlace" class="required">
                    Place of Travel
                  </label>
                  <input
                    id="travelHistoryPlace"
                    v-model="formData.caseData.travelHistoryPlace"
                    class="input-form-field"
                    type="text"
                    :disabled="inputEdit()"
                  />
                </div>
                <div style="display: inline-flex; flex-direction: row">
                  <div class="field">
                    <label for="travelHistoryDate" class="required">
                      Date of Travel
                    </label>
                    <input
                      id="travelHistoryDate"
                      v-model="formData.caseData.travelHistoryDate"
                      class="input-form-field"
                      type="date"
                      :disabled="inputEdit()"
                    />
                  </div>
                  <div class="field">
                    <label class="required"> Days from rash onset </label>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="less"
                        v-model="formData.caseData.travelDaysRashOnset"
                        value="< 7 days"
                        class="input-radio"
                        name="travelDaysRashOnset"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="less"> &lt; 7 days </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="more"
                        v-model="formData.caseData.travelDaysRashOnset"
                        value="7-23 days"
                        class="input-radio"
                        name="travelDaysRashOnset"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="more"> 7-23 days </label>
                    </div>
                  </div>
                </div>
              </div>

              <div style="display: block">
                <div class="vaccine-field field">
                  <label class="required" style="margin-right: 50px">
                    Was there contact with a confirmed Measles case 7-23 days
                    prior to rash onset?
                  </label>
                  <div style="display: inline-flex; flex-direction: row">
                    <div class="center-center">
                      <input
                        id="noMeasles"
                        v-model="formData.caseData.expContactMeasles"
                        value="No"
                        class="input-radio"
                        name="expContactMeasles"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="noMeasles"> No </label>
                    </div>
                    <div class="center-center" style="margin: 0 20px">
                      <input
                        id="unknownMeasles"
                        v-model="formData.caseData.expContactMeasles"
                        value="Unknown"
                        class="input-radio"
                        name="expContactMeasles"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="unknownMeasles"> Unknown </label>
                    </div>
                    <div class="center-center" style="margin: 0 20px">
                      <input
                        id="yesMeasles"
                        v-model="formData.caseData.expContactMeasles"
                        value="Yes"
                        class="input-radio"
                        name="expContactMeasles"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="yesMeasles"> Yes </label>
                    </div>
                  </div>
                </div>
              </div>

              <div style="display: block">
                <div class="vaccine-field field">
                  <label class="required" style="margin-right: 50px">
                    Was there contact with a confirmed Rubella case 7-23 days
                    prior to rash onset?
                  </label>
                  <div style="display: inline-flex; flex-direction: row">
                    <div class="center-center">
                      <input
                        id="noRubella"
                        v-model="formData.caseData.expContactRubella"
                        value="No"
                        class="input-radio"
                        name="expContactRubella"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="noRubella"> No </label>
                    </div>
                    <div class="center-center" style="margin: 0 20px">
                      <input
                        id="unknownRubella"
                        v-model="formData.caseData.expContactRubella"
                        value="Unknown"
                        class="input-radio"
                        name="expContactRubella"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="unknownRubella"> Unknown </label>
                    </div>
                    <div class="center-center" style="margin: 0 20px">
                      <input
                        id="yesRubella"
                        v-model="formData.caseData.expContactRubella"
                        value="Yes"
                        class="input-radio"
                        name="expContactRubella"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="yesRubella"> Yes </label>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="formData.caseData.expContactRubella == 'Yes'"
                style="padding: 0 7px"
              >
                <div class="field-row-straight">
                  <div class="field">
                    <label for="expContactName" class="required">
                      Name of Contact
                    </label>
                    <input
                      id="expContactName"
                      v-model="formData.caseData.expContactName"
                      class="input-form-field"
                      type="text"
                      :disabled="inputEdit()"
                    />
                  </div>
                  <div class="field">
                    <label for="expContactPlace" class="required">
                      Place of Residence
                    </label>
                    <input
                      id="expContactPlace"
                      v-model="formData.caseData.expContactPlace"
                      class="input-form-field"
                      type="text"
                      :disabled="inputEdit()"
                    />
                  </div>
                  <div class="field">
                    <label for="expContactDate" class="required">
                      Date of travel
                    </label>
                    <input
                      id="expContactDate"
                      v-model="formData.caseData.expContactDate"
                      class="input-form-field"
                      type="date"
                      :disabled="inputEdit()"
                    />
                  </div>
                </div>
                <div class="field-row">
                  <div class="field">
                    <label class="required">
                      Type of place where exposure probably occured
                    </label>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="Day care"
                        v-model="formData.caseData.expPlaceType"
                        value="Day care"
                        class="input-radio"
                        name="expPlaceType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="Day care"> Day care </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="Barangay"
                        v-model="formData.caseData.expPlaceType"
                        value="Barangay"
                        class="input-radio"
                        name="expPlaceType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="Barangay"> Barangay </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="Home"
                        v-model="formData.caseData.expPlaceType"
                        value="Home"
                        class="input-radio"
                        name="expPlaceType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="Home"> Home </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="School"
                        v-model="formData.caseData.expPlaceType"
                        value="School"
                        class="input-radio"
                        name="expPlaceType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="School"> School </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="Health Care Facility"
                        v-model="formData.caseData.expPlaceType"
                        value="Health Care Facility"
                        class="input-radio"
                        name="expPlaceType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="Health Care Facility">
                        Health Care Facility
                      </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="Dormitory"
                        v-model="formData.caseData.expPlaceType"
                        value="Dormitory"
                        class="input-radio"
                        name="expPlaceType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="Dormitory"> Dormitory </label>
                    </div>

                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="ExposurePlaceTypeOthers"
                        value="ExposurePlaceTypeOthers"
                        class="input-radio"
                        name="expPlaceType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label
                        for="ExposurePlaceTypeOthers"
                        style="display: inline-flex"
                      >
                        Others, specify:
                        <input
                          id="ExposurePlaceTypeOthers"
                          v-model="formData.patient.expPlaceType"
                          class="input-form-field"
                          type="text"
                          style="width: 150px; height: 20px; margin: 0 2px"
                          :disabled="inputEdit()"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div style="display: block">
                <div class="vaccine-field field">
                  <label class="required" style="margin-right: 50px">
                    Are there other known cases with fever and rash (regardless
                    of presence of 3C.s) in the community?
                  </label>
                  <div style="display: inline-flex; flex-direction: row">
                    <div class="center-center">
                      <input
                        id="noCommunityCases"
                        v-model="formData.caseData.otherCommunityCases"
                        value="no"
                        class="input-radio"
                        name="otherCommunityCases"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="noCommunityCases"> No </label>
                    </div>
                    <div class="center-center" style="margin: 0 20px">
                      <input
                        id="unknownCommunityCases"
                        v-model="formData.caseData.otherCommunityCases"
                        value="unknown"
                        class="input-radio"
                        name="otherCommunityCases"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="unknownCommunityCases"> Unknown </label>
                    </div>
                    <div class="center-center" style="margin: 0 20px">
                      <input
                        id="yesCommunityCases"
                        v-model="formData.caseData.otherCommunityCases"
                        value="yes"
                        class="input-radio"
                        name="otherCommunityCases"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="yesCommunityCases"> Yes </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        <hr v-if="isPrint" />

        <form v-if="pageNum == 6 || isPrint" id="measles6" type="submit">
          <div id="case-investigation-form" class="center">
            <h2 id="form-header">
              {{ Object.values(disease.formNames)[6] }}
            </h2>

            <div
              class="field-row"
              style="display: inline-flex; margin-bottom: -1 px"
            >
              <div class="field">
                <label class="required">
                  Please select the final classification
                </label>
                <div>
                  <div style="display: inline-flex; flex-direction: column">
                    <div
                      v-for="(value, name, i) in classification"
                      :key="i"
                      class="checkbox-options"
                    >
                      <input
                        :id="i"
                        v-model="formData.caseData.finalClassification"
                        :value="name"
                        class="input-checkbox"
                        name="finalClassification"
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
                        <span class="tooltipText" style="width: 650px">{{
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

        <form v-if="pageNum == 7 || isPrint" id="measles7" type="submit">
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
                  Please select the source of information
                </label>

                <div
                  v-for="(source, i) in sourceList"
                  :key="i"
                  style="padding-left: 7px"
                >
                  <input
                    :id="source"
                    v-model="formData.caseData.sourceInfection"
                    :value="source"
                    name="product"
                    type="checkbox"
                    :disabled="inputEdit()"
                  />
                  <label :for="source">{{ source }}</label>
                </div>
              </div>
            </div>
          </div>
        </form>
        <hr v-if="isPrint" />

        <form v-if="pageNum == 8 || isPrint" id="measles8" type="submit">
          <div id="case-investigation-form" class="center">
            <h2 id="form-header">
              {{ Object.values(disease.formNames)[8] }}
            </h2>

            <div class="field-row">
              <div class="field">
                <label class="required"> Please select the outcome </label>
                <div
                  style="
                    display: inline-flex;
                    flex-display: row;
                    margin-right: 50px;
                  "
                >
                  <div
                    style="
                      display: inline-flex;
                      align-items: center;
                      margin-right: 30px;
                    "
                  >
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

                  <div
                    style="
                      display: inline-flex;
                      align-items: center;
                      margin-right: 30px;
                    "
                  >
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

                <div
                  v-if="formData.caseData.outcome == 'Dead'"
                  class="field-row-straight"
                >
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
                <label for="finalDiagnosis" class="required">
                  Final Diagnosis
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

        <form v-if="pageNum == 9 || isPrint" id="measles9" type="submit">
          <div id="case-investigation-form" class="center">
            <h2 id="form-header">
              {{ Object.values(disease.formNames)[9] }}
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
                <input v-model="formData.cases.investigatorLab" name="investigatorLab" :disabled="inputEdit()"/>
              </div>
            </div>

            <div v-show="hasLabTest==='Yes'">
              <div
                class="field"
                style="display: inline-flex; flex-direction: row"
              >
                <label for="labspecimen" class="required">
                  Please select the specimen collected with the following
                  information
                </label>
                <select
                  id="labspecimen"
                  v-model="formData.caseData.labspecimen"
                  name="labspecimen"
                  style="width: 300px"
                  :disabled="inputEdit()"
                >
                  <option value="Serum">Serum</option>
                  <option value="Dried Blood Spot">Dried Blood Spot</option>
                  <option value="Oropharyngeal">
                    Oropharyngeal / Nasopharyngeal Swab
                  </option>
                </select>
              </div>

              <div class="field-row-straight">
                <div class="field">
                  <label for="labDateCollected" class="required">
                    Date Collected
                  </label>
                  <input
                    id="labDateCollected"
                    v-model="formData.cases.labDateCollected"
                    class="input-form-field"
                    type="date"
                    :disabled="inputEdit()"
                  />
                </div>
                <div class="field">
                  <label for="labDateSent" class="required">
                    Date sent to RITM
                  </label>
                  <input
                    id="labDateSent"
                    v-model="formData.cases.labDateSent"
                    class="input-form-field"
                    type="date"
                    :disabled="inputEdit()"
                  />
                </div>
                <div class="field">
                  <label for="labDateReceived" class="required">
                    Date received in RITM
                  </label>
                  <input
                    id="labDateReceived"
                    v-model="formData.cases.labDateReceived"
                    class="input-form-field"
                    type="date"
                    :disabled="inputEdit()"
                  />
                </div>
              </div>

              <div class="field-row-straight">
                <div class="field">
                  <label for="labMeaslesResult" class="required">
                    Measles IgM result
                  </label>
                  <input
                    id="labMeaslesResult"
                    v-model="formData.cases.labMeaslesResult"
                    class="input-form-field"
                    type="text"
                    :disabled="inputEdit()"
                  />
                </div>
                <div class="field">
                  <label for="labRubellaResult" class="required">
                    Rubella IgM result
                  </label>
                  <input
                    id="labRubellaResult"
                    v-model="formData.cases.labRubellaResult"
                    class="input-form-field"
                    type="text"
                    :disabled="inputEdit()"
                  />
                </div>
              </div>

              <div class="field-row-straight">
                <div class="field">
                  <label for="labVirusResult" class="required">
                    Virus Isolation
                  </label>
                  <input
                    id="labVirusResult"
                    v-model="formData.cases.labVirusResult"
                    class="input-form-field"
                    type="text"
                    :disabled="inputEdit()"
                  />
                </div>
                <div class="field">
                  <label for="labPCRResult" class="required"> PRC Result </label>
                  <input
                    id="labPCRResult"
                    v-model="formData.cases.labPCRResult"
                    class="input-form-field"
                    type="text"
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
        </form>
        <hr v-if="isPrint" />
      </div>
      <div class="CIF-statusHistory">
        <div class="CIF-statusHistory">
        <h2 style="border-bottom: gray solid; width: fit-content; padding: 0 7px 0 5px;">Case Status History</h2>
        <div style="border-top: gray solid;">
          <table style="width: 100%;">
            <thead>
              <th style="width: 25%;">Date</th>
              <th style="width: 25%;">From</th>
              <th style="width: 25%;">To</th>
              <th style="width: 25%;">By</th>
            </thead>
            <tbody>
              <tr>
                <td>Nov 11, 2021</td>
                <td>Probable</td>
                <td>Suspected</td>
                <td>me</td>
              </tr>
              <tr>
                <td>Nov 11, 2021</td>
                <td>Probable</td>
                <td>Suspected</td>
                <td>me</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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
                  <ul v-for="(value, name, i) in classification" :key="i" style="displayLinline-flex">
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
      editStatus:false,
      newStatus:'',
      hasLabTest:'',
      isDisabled: false,
      editCase: false,
      isPrint: false,
      diseaseID: 'DI-0000000000000',
      caseDefs: [],
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
        caseData: {
          patientAdmitted: '',
          // page 2
          sympFever: '',
          sympRash: '',
          sympLymph: false,
          sympCough: false,
          sympKoplik: false,
          sympRunnynose: false,
          sympRedeye: false,
          sympArthrisis: false,
          complications: '',
          otherSymptoms: '',
          diagnosis: '',
          // page 3
          MCVaccine: '',
          MCVmv: '',
          MCVmr: '',
          MCVmmr: '',
          MCVlastDoseDate: '',
          MCVvalidation: '',
          MCVCampaign: '',
          noMCVreason: [''],
          vitA: '',
          // page 4
          travelHistory: '',
          travelHistoryPlace: '',
          travelHistoryDate: '',
          travelDaysRashOnset: '',
          expContactMeasles: '',
          expContactRubella: '',
          expContactName: '',
          expContactPlace: '',
          expContactDate: '',
          expPlaceType: '',
          otherCommunityCases: '',
          // page 5
          labspecimen: '',
          labDateCollected: '',
          labDateSent: '',
          labDateReceived: '',
          labMeaslesResult: '',
          labRubellaResult: '',
          labVirusResult: '',
          labPCRResult: '',
          // Page 6++
          finalClassification: '',
          sourceInfection: [],
          outcome: '',
          dateDied: '',
          finalDiagnosis: '',
        },
      },
      noVaccineReasons: [
        'Other',
        'Mother was busy',
        'Against belief',
        'Medical contraindication',
        'Fear of side effects',
        'Child was sick',
        'No vaccine available',
        'Vaccinator not available',
        'Not eligible for vaccination',
        'Forgot Schedule',
      ],
      sourceList: ['Endemic', 'Imported', 'Import-related', 'Unknown'],
      classification: {
        'Clinically Compatible Measles':
          'A suspected measles case, for which no adequate clinical specimen was taken and the case has not been linked epidemiologically to a laboratory-confirmed case of measles or other communicable disease OR laboratory confirmation is still pending',
        'Epidemiologically Linked Confirmed Measles':
          'A suspected measles case that has not been confirmed by a laboratory but was geographically and temporally related with dates of rash onset occurring between 7 and 23 days apart from a laboratory-confirmed case or another epidemiologically confirmed measles case',
        'Epidemiologically Linked Confirmed Rubella':
          'A suspected case who has direct contact with another laboratory confirmed rubella case with rash onset occurred 12-23 days before the present case',
        'Laboratory-Confirmed Measles':
          'A suspected measles case that has been confirmed by a proficient laboratory as positive for Measles IgM antibodies and/or positive for measles virus isolation or Polymerase Chain Reaction (PCR)',
        'Laboratory-Confirmed Rubella':
          'A suspected measles case with a positive laboratory test results for rubella-specific IgM antibodies or other laboratory test method',
        'Non-Measles/Rubella Discarded Case':
          'A suspected case that has been investigated and discarded as a non-measles (and non-rubella) when anyofthe following are true: negative laboratory testing in a proficient laboratory on an adequate specimen collected during the proper time period after rash onset; epidemiological linkage to a laboratory confirmed outbreak of another communicable disease that is not measles/rubella; confirmation of another etiology',
        'Suspected Case':
          'Any individual, regardless of age, with the following signs and symptoms: fever (38°C or more) or hot to touch; and Maculo-papular rash (non-vesicular) AND at least one of the following: cough, coryza (runny nose), or conjunctivitis (red eyes)',
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
        idname: 'Measles',
        name: 'Measles/Rubella',
        formNames: {
          form0: 'Case Definition',
          form1: 'Patient Record',
          form2: 'Patient Information',
          form3: 'Clinical Data',
          form4: 'Vaccination History',
          form5: 'Exposure History',
          form6: 'Final Classification',
          form7: 'Source of Information',
          form8: 'Outcome',
          form9: 'Laboratory Tests',
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
      diseases: {
        cif: {
          Measles: '/cifMeasles',
          Diphtheria: '/cifDiphtheria',
          'Neonatal Tetanus': '/cifNeonatalTetanus',
          Pertussis: '/cifPertussis',
          'Meningococcal Disease': '/cifMeningococcal',
        },
        crf: {
          Dengue: 'crfDengue',
        },
      },
    }
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
    popup() {
      this.editStatus = !this.editStatus
    },
    status(change) {
      if (change==='save') {
        this.formData.caseData.finalClassification = this.newStatus;
        this.formData.cases.caseLevel = this.newStatus;

        // TODO: add notification here -julia
        // TODO: add notif/alert checking here 
        // notif message: The case level of <disease name> <case no> has been updated to <new caselevel>.
        // notif type: updateStatus
        // receiver: dru who submitted the case
        // redirectTo: viewCIF/CRF url of the case that was updated
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
  margin-left: -14%;
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

