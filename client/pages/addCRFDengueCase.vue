<template>
  <div id="addCRFDengue">
    <!--Top Bar of the screen-->
    <TopNav />

    <!--Everything below = main screen-->
    <div class="case-container">
      <!--SUMMARY: left side-->
      <div class="form-summary-container">
        <div class="form-summary">
          <button id="login-submit" type="submit" style="width: 210px; text-align: left" @click="isOpen = !isOpen">
            <h2 style="font-weight: 600">Case Registration Form</h2>
          </button>

          <div v-if="isOpen" class="form-contents">
            <div v-for="(value, name, i) in disease.formNames" :key="i">
              <!-- <div v-if="i > 1" :id="name" :class="formColor(i - 1)"> -->
              <button :id="name" :class="formColor(i)" @click="move(i)">
                {{ i }}.{{ value }}
              </button>
            </div>
          </div>
        </div>
        <!-- <div>All info: {{ formData }}</div> -->
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
          <form v-if="pageNum == 0" id="dengue0" type="submit">
            <div id="case-report-form" class="center">
              <h2 id="form-header">
                {{ Object.values(disease.formNames)[0] }}
              </h2>

              <!-- <p style="margin-bottom: -20px">Search for Patient:</p> -->

              <div class="container">
                <div class="bar">
                  <input
                    id="input"
                    class="searchbar"
                    type="search"
                    autocomplete="off"
                    spellcheck="false"
                    role="combobox"
                    aria-live="off"
                    placeholder="Search Patient"
                    @keyup="searchPatient"
                  />
                  <div v-if="patientResult.length" class="searchPatientValues">
                    <div v-for="(patient, i) in patientResult" :key="i" class="searchResult">
                      <!-- <img class="searchPersonIcon" /> -->
                      <div class="searchResultInfo" @click="autoFillPatient(patient)">
                        <div class="searchPerson">
                          {{ patient.firstName + ' ' + patient.midName + ' ' + patient.lastName }}
                        </div>
                        <div class="searchAddress">
                          {{ patient.currHouseStreet + ', ' + patient.currBrgy + ', ' + patient.currCity }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <form v-if="pageNum == 1 || pageNum == Object.keys(disease.formNames).length" id="dengue1" type="submit">
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
                    :class="isRequired()"
                    required
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
                    :class="isRequired()"
                    required
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
                    :class="isRequired()"
                    required
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
                      :class="isRequired()"
                      required
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
                      :class="isRequired()"
                      required
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
                        :class="optionsRequired()"
                        required
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
                        :class="optionsRequired()"
                        required
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
                    :class="isRequired()"
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
                      required>
                    <option v-for="(city, i) in cityList" :key=i>{{city}}</option>
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
                    :class="isRequired()"
                    required
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
                  <select
                    id="permCity"
                    v-model="formData.patient.permCity"
                    name="permCity"
                    :disabled="inputEdit()"
                  >
                  <option v-for="(city, i) in cityList" :key=i>{{city}}</option>
                  </select>
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
                    :class="isRequired()"
                    required
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
                    :class="isRequired()"
                    required
                  />
                </div>
              </div>
            </div>
          </form>
          <hr v-if="pageNum == Object.keys(disease.formNames).length" />

          <form v-if="pageNum == 2 || pageNum == Object.keys(disease.formNames).length" id="dengue2" type="submit">
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
                        :class="optionsRequired()"
                        required
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
                        :class="optionsRequired()"
                        required
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
                    v-model="formData.cases.patientConsultDate"
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
                        :class="optionsRequired()"
                        required
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
                        :class="optionsRequired()"
                        required
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
                    :class="isRequired()"
                    required
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
                          <label for="LAlcoholism">Alcoholism</label>
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
                          <label for="CAsthma"> Asthma </label>
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
                          <label for="CHereditary"> Hereditary </label>
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
          <hr v-if="pageNum == Object.keys(disease.formNames).length" />

          <form v-if="pageNum == 3 || pageNum == Object.keys(disease.formNames).length" id="dengue3" type="submit">
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
                        :class="optionsRequired()"
                        required
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
                        :class="optionsRequired()"
                        required
                      />
                      <label for="yesVaccine"> Yes </label>
                    </div>
                  </div>
                </div>
                <div v-if="formData.caseData.vaccine==='Yes'" class="field" style="width:39%">
                  <label for="vaccineFirstDate" class="required">
                    Date First Vaccinated
                  </label>
                  <input
                    id="vaccineFirstDate"
                    v-model="formData.cases.vaccineFirstDate"
                    class="input-form-field"
                    type="date"
                    :disabled="inputEdit()"
                    :class="isRequired()"
                    required
                  />
                </div>
                <div v-if="formData.caseData.vaccine==='Yes'" class="field" style="width:39%">
                  <label for="patientConsultPlace" class="required"> Date Last Vaccinated </label>
                  <input
                    id="patientConsultPlace"
                    v-model="formData.patient.vaccineLastdate"
                    class="input-form-field"
                    type="date"
                    :disabled="inputEdit()"
                    :class="isRequired()"
                    required
                  />
                </div>
              </div>
            </div>
          </form>
          <hr v-if="pageNum == Object.keys(disease.formNames).length" />

          <form v-if="pageNum == 4 || pageNum == Object.keys(disease.formNames).length" id="dengue4" type="submit">
            <div id="case-investigation-form" class="center">
              <h2 id="form-header">
                {{ Object.values(disease.formNames)[4] }}
              </h2>

              <div class="field-row" style="display: inline-flex; margin-bottom: -1 px">
                <div class="field">
                  <label class="required">
                    Please select the clinical classification
                  </label>
                  <div>
                    <!-- <div style="display: inline-flex; flex-direction: column"> -->
                    <!-- CLINICAL CLASSIFICATION -->
                    <div>
                      <div class="collpaseWrapper">
                        <ul v-for="(value, i) in clinicalClassification" :key="i" style="displayLinline-flex">
                          <li>
                            <input :id="value.name" type="checkbox" class="collapseInput"/>
                            <label :for="value.name" class="collapseLabel">
                              <input
                                :id="value.name"
                                v-model="formData.caseData.clinicalClassification"
                                :value="value"
                                class="input-checkbox"
                                name="finalClassification"
                                type="radio"
                                :disabled="inputEdit()"
                                :class="optionsRequired()"
                                required
                              />
                              {{ value.name }}
                            </label>
                            <ul>
                              <li style="padding-bottom:5px;">{{value.description}}</li>
                              <ul style="padding-bottom:5px;background: white;">
                                <li v-for="(symptom, j) in clinicalClassification[i].symptoms" :key="j"
                                  style="padding:0px 25px 5px" class="listBullet">
                                  {{ symptom }}</li>
                              </ul>
                            </ul>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <hr v-if="pageNum == Object.keys(disease.formNames).length" />

          <form v-if="pageNum == 5 || pageNum == Object.keys(disease.formNames).length" id="dengue5" type="submit">
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
                        :class="optionsRequired()"
                        required
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
                        :class="optionsRequired()"
                        required
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
                        :class="isRequired()"
                        required
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
          <hr v-if="pageNum == Object.keys(disease.formNames).length" />

          <form v-if="pageNum == 6 || pageNum == Object.keys(disease.formNames).length" id="dengue6" type="submit">
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
                      :class="optionsRequired()"
                      required
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
                      :class="optionsRequired()"
                      required
                    />
                    <label for="yesLabTest"> Yes </label>
                  </div>
                </div>
              </div>

              <div v-show="hasLabTest==='No'">
                <div class="name-field" style="width:50%">
                  <label for="investigatorLab" class="required"> Choose Lab to forward the case to </label>
                  <select id="investigatorLab" 
                      v-model="formData.cases.investigatorLab" 
                      name="investigatorLab" 
                      :disabled="inputEdit()"
                      :class="isRequired()"
                      required>
                    <option v-for="(lab, i) in labList" :key=i>{{lab}}</option>
                  </select>
                </div>
              </div>

              <div v-show="hasLabTest==='Yes'" style="margin-left:7px;">
                <!-- <div class="field" style="display: inline-flex; flex-direction: row">
                  <label for="labSpecimen" class="required">
                    Please select the specimen collected with the following information
                  </label>
                  <select id="labSpecimen" v-model="formData.caseData.labSpecimen" name="labSpecimen" style="width: 300px" :disabled="inputEdit()">
                    <option value="Serum">Serum</option>
                    <option value="Dried Blood Spot">Dried Blood Spot</option>
                    <option value="Oropharyngeal">Oropharyngeal / Nasopharyngeal Swab</option>
                  </select>
                </div> -->
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
              <div v-if="noLabTest" class="errorLab"> Please input atleast 1 lab test </div>
              
            </div>
          </form>
          <hr v-if="pageNum == Object.keys(disease.formNames).length" />

          <form v-if="pageNum == 7 || pageNum == Object.keys(disease.formNames).length" id="dengue7" type="submit">
            <div id="case-investigation-form" class="center">
              <h2 id="form-header">
                {{ Object.values(disease.formNames)[7] }}
              </h2>

              <div class="field-row" style="display: inline-flex; margin-bottom: -1 px">
                <div class="field">
                  <label class="required">
                    Please select the case classification
                  </label>
                  <div>
                    <!-- <div style="display: inline-flex; flex-direction: column"> -->
                    <!-- CASE CLASSIFICATION -->
                    <div>
                      <div class="collpaseWrapper">
                        <ul v-for="(value, name, i) in caseClassification" :key="i" style="displayLinline-flex">
                          <li>
                            <input :id="name" type="checkbox" class="collapseInput"/>
                            <label :for="name" class="collapseLabel">
                              <input
                                :id="name"
                                v-model="formData.caseData.caseClassification"
                                :value="name"
                                class="input-checkbox"
                                name="finalClassification"
                                type="radio"
                                :disabled="inputEdit()"
                                :class="optionsRequired()"
                                required
                              />
                              {{ name }}
                            </label>
                            <ul>
                              <li>{{ value }}</li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

        </div>

        <!-- Bottom 2 buttons -->
        <div style="margin: -10px 0 5px; float: right">
          <button v-if="pageNum == 0" class="back-button" type="button">
            <nuxt-link to="/addCase"> Cancel </nuxt-link>
          </button>
          <button v-if="pageNum != 0" class="back-button" type="button" @click="move(pageNum - 1)">
            Back
          </button>
          <button v-if="pageNum < Object.keys(disease.formNames).length - 1" class="next-button" type="button" @click="move(pageNum + 1)">
            Next
          </button>
          <button v-if="pageNum == Object.keys(disease.formNames).length - 1" class="next-button" type="button" @click="move(pageNum + 1)">
            Review
          </button>
          <button v-if="pageNum == Object.keys(disease.formNames).length" class="next-button" type="button" @click="submit()">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import infoicon from '../static/infoicon.png'
const axios = require('axios');

export default {
  middleware: 'is-auth',
  header: {
    title: 'Case Report Form - Dengue',
  },
  data() {
    return {
      hasLabTest:'',
      noLabTest:false,
      isOpen: true,
      openCollapse: '',
      isDisabled: false,
      diseaseID: 'DI-0000000000000',
      patients: [],
      patientResult: [],
      labList:['a','b','c','d'],
      pageNum: 0,
      formPart: 'Dengue0',
      pageDone: [true,true,true,true,true,true,true,true,false],
      pageColor: [true,false,false,false,false,false,false,false,false],
      formData: {
        cases: {
          caseID: '',
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
          clinicalClassification:'',
          sourceInfection: [],
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
      classification: {},
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
      caseClassification: {
        'Suspect':'A previously well person with acute febrile illness of 2-7 days duration with clinical signs and symptoms of dengue',
        'Probable':'A suspected case with positive dengue IgM antibody test',
        'Confirmed':'Viral culture isolation, or Polymerase Chain Reaction (PCR), or Dengue NS1 antigen test',
      },
    }
  },
  async fetch() {
    let rows = (await axios.get('http://localhost:8080/api/getCaseDefs?diseaseID=' + this.diseaseID)).data;
    for (let i = 0; i < rows.length; i++) {
      this.classification[rows[i].class] = rows[i].definition;
    }
    rows = (await axios.get('http://localhost:8080/api/getPatients')).data;
    this.patients = rows;
  },
  computed: {},
  methods: {
    formpart(disease, pageNum) {
      this.formPart = disease + pageNum;
      // if (this.isOpen) this.formStatus(this.pageNum);
    },
    formColor(index) {
      if (this.isOpen) {
        if (index === this.pageNum) return 'formnum formnumcurr';
        else if (this.pageColor[index]) return 'formnum formnumdone';
        else return 'formnum';
      }
    },
    async submit() {
      // TODO: this submit is the "save" type, the cases should only be visible to the DRU, not yet submitted to MMCHD
	  const now = new Date();
      this.formData.cases.diseaseID = this.diseaseID;
      this.formData.cases.reportedBy = this.$auth.user.userID;
	  this.formData.cases.reportDate = now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate();
      const result = await axios.post('http://localhost:8080/api/newCase', {formData: this.formData, CRFID: this.$route.query.CRFID});
      if (result.status === 200) {
        alert('case submitted!');
        window.location.href = '/allCases';
      } else {
        // eslint-disable-next-line no-console
        console.log(result);
      }
    },
    move(page) {
      this.validateForm(this.pageNum);
      this.validateForm(page);
      if (this.pageDone[this.pageNum] || this.pageDone[page] || page===0 || this.pageNum ===0) {
        if (page===8) {
          if (!this.pageColor[8]) alert('Please fill up the required fields in all pages');
          else this.pageNum = page;
        }
        else if (this.pageNum===8) {
          this.pageNum = page;
        }
        else if (page < Object.keys(this.disease.formNames).length && this.pageNum < Object.keys(this.disease.formNames).length) {
          const prevFormNum = 'form' + this.pageNum;
          document.getElementById(prevFormNum).className = 'formnum formnumdone';
          const currFormNum = 'form' + page;
          document.getElementById(currFormNum).className = 'formnum formnumcurr';

          this.pageDone[this.pageNum] = true;
          this.pageDone[page] = true;
          this.pageNum = page;
        }
      }
      else {
        alert('Please fill up the required fields');
        // document.getElementsByClassName('input-form-field').className = 'input-form-field input-required';
        this.$forceUpdate();
      }
      console.log(this.pageDone)
    },
    validateForm(page) {
      switch (page) {
        case 1:
          if (this.formData.patient.lastName!=='' &&
          this.formData.patient.firstName!=='' &&
          this.formData.patient.midName!=='' &&
          this.formData.patient.birthDate!=='' &&
          this.formData.patient.ageNo!=='' &&
          this.formData.patient.sex!=='' &&
          this.formData.patient.civilStatus!=='' &&
          this.formData.patient.currHouseStreet!=='' &&
          this.formData.patient.currCity!=='' &&
          this.formData.patient.currBrgy!=='' &&
          this.formData.patient.guardianName!=='' &&
          this.formData.patient.guardianContact!=='' &&
          this.formData.patient.lastName!== null &&
          this.formData.patient.firstName!== null &&
          this.formData.patient.midName!== null &&
          this.formData.patient.birthDate!== null &&
          this.formData.patient.ageNo!== null &&
          this.formData.patient.sex!== null &&
          this.formData.patient.civilStatus!== null &&
          this.formData.patient.currHouseStreet!== null &&
          this.formData.patient.currCity!== null &&
          this.formData.patient.currBrgy!== null &&
          this.formData.patient.guardianName!== null &&
          this.formData.patient.guardianContact!== null
          ) this.pageDone[page] = true;
          else this.pageDone[page] = false;
          if (this.formData.patient.ageNo<0) {this.formData.patient.ageNo = ''; this.pageDone[page] = false;}
          if (this.formData.patient.guardianContact<0) {this.formData.patient.guardianContact = ''; this.pageDone[page] = false;}
          break;
        case 2:
          if (this.formData.caseData.patientConsulted!=='' &&
          this.formData.patient.admitStatus!=='' &&
          this.formData.cases.dateOnset!==''
          ) this.pageDone[page] = true;
          else this.pageDone[page] = false;
          break;
        case 3:
          if (this.formData.caseData.vaccine!=='' &&
              this.formData.caseData.vaccine!=='') {
            if (this.formData.caseData.vaccine==='No' ||
                (this.formData.caseData.vaccine==='Yes' &&
                this.formData.cases.vaccineFirstDate!=='' &&
                this.formData.cases.vaccineFirstDate!==null &&
                this.formData.cases.vaccineLastdate!=='' &&
                this.formData.patient.vaccineLastdate!==null))
              this.pageDone[page] = true;
            else this.pageDone[page] = false;
            console.log(this.formData.cases.vaccineFirstDate!=='')
          }
          else this.pageDone[page] = false;
          break;
        case 4:
          if (this.formData.caseData.clinicalClassification!=='' &&
              this.formData.caseData.clinicalClassification!==null
          ) this.pageDone[page] = true;
          else this.pageDone[page] = false;
          break;
        case 5:
          if (this.formData.caseData.outcome!=='') {
            if (this.formData.caseData.outcome==='Alive' ||
                (this.formData.caseData.outcome==='Dead' &&
                this.formData.cases.dateDied!=='' &&
                this.formData.cases.dateDied!==null &&
                this.formData.cases.dateDied!==undefined))
              this.pageDone[page] = true;
            else this.pageDone[page] = false;
          }
          else this.pageDone[page] = false;
          break;
        case 6:
          if (this.hasLabTest!=='') {
            if (this.hasLabTest==='No' && this.formData.cases.investigatorLab!=='')
              {this.pageDone[page] = true; this.errorLab = false;}
            else if(this.formData.caseData.finalClassification!=='Yes' &&
              (this.formData.caseData.ns1Date!== null ||
                this.formData.caseData.ns1Result!== null ||
                this.formData.caseData.iggDate!== null ||
                this.formData.caseData.iggResult!== null ||
                this.formData.caseData.igmDate!== null ||
                this.formData.caseData.igmResult!== null ||
                this.formData.caseData.pcrDate!== null ||
                this.formData.caseData.pcrResult!== null))
              {this.pageDone[page] = true; this.errorLab = false;}
            else {this.pageDone[page] = false;this.errorLab = true;}
          }
          else {this.pageDone[page] = false; this.errorLab = true;}
          break;
        case 7:
          if (this.formData.caseData.caseClassification!=='' &&
              this.formData.caseData.caseClassification!== null &&
              this.formData.caseData.caseClassification!== undefined &&
              this.formData.caseData.caseClassification.length!== 0)
            this.pageDone[page] = true;
          else this.pageDone[page] = false;
          break;
        case 8:
          if(this.pageColor[1] && this.pageColor[2] && this.pageColor[3] && this.pageColor[4]
             && this.pageColor[5] && this.pageColor[6] && this.pageColor[7]) {
               this.pageColor[8] = true;
               this.pageDone[8] = true;
             }
          break;
      }
      if (this.pageDone[page]) this.pageColor[page] = true;
    },
    isRequired() {
      if (this.pageDone[this.pageNum]) return "input-form-field";
      else return "input-form-field input-required";
    },
    optionsRequired() {
      if (!this.pageDone[this.pageNum]) return "input-required";
    },
    inputEdit() {
      if (this.pageNum === Object.keys(this.disease.formNames).length) {
        // const elems = document.getElementsByTagName('input')
        // for (let i = 0; i < elems.length; i++) {
        //   elems[i].disabled = true;
        //   console.log(elems);
        // }
        return true;
      } else return false;
    },
    autoFillPatient(patient) {
      // console.log(patient);
      this.formData.patient.lastName = patient.lastName;
      this.formData.patient.firstName = patient.firstName;
      this.formData.patient.midName = patient.midName;
      this.formData.patient.birthDate = patient.birthDate.substr(0, 10);
      this.formData.patient.ageNo = patient.ageNo;
      this.formData.patient.sex = patient.sex;
	  this.formData.patient.civilStatus = patient.civilStatus;
      this.formData.patient.pregWeeks = patient.pregWeeks;
      this.formData.patient.currHouseStreet = patient.currHouseStreet;
      this.formData.patient.currBrgy = patient.currBrgy;
      this.formData.patient.currCity = patient.currCity;
      this.formData.patient.permHouseStreet = patient.permHouseStreet;
      this.formData.patient.permBrgy = patient.permBrgy;
      this.formData.patient.permCity = patient.permCity;
      this.formData.patient.guardianName = patient.guardianName;
      this.formData.patient.guardianContact = patient.guardianContact;
      this.pageNum++;
    },
    searchPatient(event) {
      this.patientResult = [];
      if (event.target.value !== '') {
        let ctr = 0;
        for (let i = 0; i < this.patients.length && ctr < 5; i++) {
          // eslint-disable-next-line no-useless-escape
          const reg = new RegExp('^' + event.target.value + 'w*', 'i');
          if ((this.patients[i].firstName + ' ' + this.patients[i].midName + ' ' + this.patients[i].lastName).match(reg)) {
            this.patientResult.push(this.patients[i]);
            ctr++;
          }
        }
      }
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
  z-index: 2;
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

.case-report-form {
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

.thirtyDesk {
  width: 30%;
}

.patientConsulted-field {
  /* width: 25%; */
  width: 41.67%;
}

.patientConsultDate-field {
  /* width: 35%; */
  width: 58.33%;
}

.indigenousGroup-field .patientConsultPlace-field {
  width: 40%;
}

@media only screen and (max-width: 950px) {
  .thirtyDesk {
    width: 100%;
  }
  .patientConsulted-field {
    width: 39%;
  }

  .patientConsultDate-field {
    width: 59%;
  }

  .indigenousGroup-field .patientConsultPlace-field {
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

/* COLLAPSE EME BELOW */

.listBullet::before {
  content: "•"
}

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
  height: fit-content;
  border-radius: 0 0 25px 25px;
  margin-top: -15px;
  padding: 10px;
  display: grid;
  width: 100%;
  position: absolute;
}

.searchResult {
  padding: 5px 10px;
  border-top: 1px solid lightgray;
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
