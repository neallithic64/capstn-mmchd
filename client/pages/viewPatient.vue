<template>
  <div id="viewPatient">
    <!--Top Bar of the screen-->
    <TopNav />
    <div id="printPage" ref="content" class="viewPatient-container">
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
                        v-model="newPatientInfo.sex"
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
                        v-model="newPatientInfo.sex"
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
                        v-model="newPatientInfo.pregWeeks"
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
                          v-model="newPatientInfo.pregWeeks"
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
                    v-model="newPatientInfo.civilStatus"
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
                    v-model="newPatientInfo.indGroup"
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
                    v-model="newPatientInfo.occupation"
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
                    v-model="newPatientInfo.occuLoc"
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
                    v-model="newPatientInfo.occuStreet"
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
                    v-model="newPatientInfo.occuCity" 
                    name="occuCity" 
                    :disabled="inputEdit()" 
                    :class="isRequired()" 
                    required
                    @change="getLocBrgyList(newPatientInfo.occuCity,'occuBarangay')"
                    >
                    <option v-for="(city, i) in cityList" :key=i>{{city}}</option>
                  </select>
                </div>
                <div class="field">
                  <label for="occuBarangay" class="required"> Barangay </label>
                  <select
                    id="occuBarangay"
                    v-model="newPatientInfo.occuBrgy"
                    :class="isRequired()"
                    name="occuBarangay"
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
                    v-model="newPatientInfo.currHouseStreet"
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
                    v-model="newPatientInfo.currCity" 
                    name="currCity" 
                    :disabled="inputEdit()" 
                    :class="isRequired()" 
                    required
                    @change="getLocBrgyList(newPatientInfo.currCity,'currBarangay')">
                    >
                    <option v-for="(city, i) in cityList" :key=i>{{city}}</option>
                  </select>
                </div>
                <div class="field">
                  <label for="currBarangay" class="required"> Barangay </label>
                  <select
                    id="currBarangay"
                    v-model="newPatientInfo.currBrgy"
                    :class="isRequired()"
                    name="currBarangay"
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
                    v-model="newPatientInfo.permHouseStreet"
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
                    v-model="newPatientInfo.permCity"
                    name="permCity"
                    :disabled="inputEdit()"
                    @change="getLocBrgyList(newPatientInfo.permCity,'permBarangay')"
                  >
                  <option v-for="(city, i) in cityList" :key=i>{{city}}</option>
                  </select>
                </div>
                <div class="field">
                  <label for="permBarangay"> Barangay </label>
                  <select
                    id="permBarangay"
                    v-model="newPatientInfo.permBrgy"
                    class="input-form-field"
                    name="permBarangay"
                    :disabled="inputEdit()"
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
                    v-model="newPatientInfo.guardianName"
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
                    v-model="newPatientInfo.guardianContact"
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
                    v-model="newPatientInfo.HCPN"
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                  />
                </div>
                <div class="field">
                  <label for="ILHZ"> ILHZ </label>
                  <input
                    id="ILHZ"
                    v-model="newPatientInfo.ILHZ"
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

                        <div style="display: flex; align-items: center;">
                          <input
                            id="LNone"
                            v-model="riskFactors.Lfestyle"
                            value="LNone"
                            name="riskFactorsL"
                            type="checkbox"
                            class="input-radio"
                            disabled
                          />
                          <label for="LNone">None</label>
                        </div>

                        <div style="display: flex; align-items: center;">
                          <input
                            id="LSmoking"
                            v-model="newPatientInfo.riskFactors.LSmoking"
                            value="LSmoking"
                            name="riskFactorsL"
                            type="checkbox"
                            class="input-radio"
                            disabled
                          />
                          <label for="LSmoking">Smoking</label>
                        </div>

                        <div style="display: flex; align-items: center;">
                          <input
                            id="LAlcoholism"
                            v-model="newPatientInfo.riskFactors.LAlcoholism"
                            value="LAlcoholism"
                            name="riskFactorsL"
                            type="checkbox"
                            class="input-radio"
                            disabled
                          />
                          <label for="LAlcoholism">Alcoholism</label>
                        </div>

                        <div style="display: flex; align-items: center;">
                          <input
                            id="LDrugUse"
                            v-model="newPatientInfo.riskFactors.LDrugUse"
                            value="LDrugUse"
                            name="riskFactorsL"
                            type="checkbox"
                            class="input-radio"
                            disabled
                          />
                          <label for="LDrugUse">Drug Use</label>
                        </div>

                        <div style="display: flex; align-items: center;">
                          <input
                            id="LPhysicalInactivity"
                            v-model="newPatientInfo.riskFactors.LPhysicalInactivity"
                            value="LPhysicalInactivity"
                            name="riskFactorsL"
                            type="checkbox"
                            class="input-radio"
                            disabled
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
                            disabled
                          />
                          <label for="LifestyleOthers">
                            <div style="display: inline-flex">
                              Others:
                              <input
                                id="LifestyleOthers"
                                v-model="newPatientInfo.riskFactors.LOthers"
                                class="riskfactorsInput"
                                type="text"
                                disabled
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

                        <div style="display: flex; align-items: center;">
                          <input
                            id="CNone"
                            v-model="riskFactors.CurrentCondition"
                            value="CNone"
                            name="riskFactorsC"
                            type="checkbox"
                            class="input-radio"
                            disabled
                          />
                          <label for="CNone">None</label>
                        </div>

                        <div style="display: flex; align-items: center">
                          <input
                            id="CAsthma"
                            v-model="newPatientInfo.riskFactors.CAsthma"
                            value="CAsthma"
                            class="input-radio"
                            name="riskFactorsC"
                            type="checkbox"
                            disabled
                          />
                          <label for="CAsthma"> Asthma </label>
                        </div>

                        <div style="display: flex; align-items: center">
                          <input
                            id="CHereditary"
                            v-model="newPatientInfo.riskFactors.CHereditary"
                            value="CHereditary"
                            class="input-radio"
                            name="riskFactorsC"
                            type="checkbox"
                            disabled
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
                            disabled
                          />
                          <label for="ConditionOthers">
                            <div style="display: inline-flex">
                              Others:
                              <input
                                id="ConditionOthers"
                                v-model="newPatientInfo.riskFactors.COthers"
                                class="riskfactorsInput"
                                type="text"
                                disabled
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

                        <div style="display: flex; align-items: center;">
                          <input
                            id="HNone"
                            v-model="riskFactors.Historical"
                            value="HNone"
                            name="riskFactorsH"
                            type="checkbox"
                            class="input-radio"
                            disabled
                          />
                          <label for="HNone">None</label>
                        </div>

                        <div style="display: flex; align-items: center">
                          <input
                            id="HDiabetes"
                            v-model="newPatientInfo.riskFactors.HDiabetes"
                            value="HDiabetes"
                            class="input-radio"
                            name="riskFactorsH"
                            type="checkbox"
                            disabled
                          />
                          <label for="HDiabetes"> Diabetes </label>
                        </div>

                        <div style="display: flex; align-items: center">
                          <input
                            id="HHeartDisease"
                            v-model="newPatientInfo.riskFactors.HHeartDisease"
                            value="HHeartDisease"
                            class="input-radio"
                            name="riskFactorsH"
                            type="checkbox"
                            disabled
                          />
                          <label for="HHeartDisease"> Heart Disease </label>
                        </div>

                        <div style="display: flex; align-items: center">
                          <input
                            id="HHypertension"
                            v-model="newPatientInfo.riskFactors.HHypertension"
                            value="HHypertension"
                            class="input-radio"
                            name="riskFactorsH"
                            type="checkbox"
                            disabled
                          />
                          <label for="HHypertension"> Hypertension </label>
                        </div>

                        <div style="display: flex; align-items: center">
                          <input
                            id="HObesity"
                            v-model="newPatientInfo.riskFactors.HObesity"
                            value="HObesity"
                            class="input-radio"
                            name="riskFactorsH"
                            type="checkbox"
                            disabled
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
                            disabled
                          />
                          <label for="HistoricalOthers">
                            <div style="display: inline-flex">
                              Others:
                              <input
                                id="HistoricalOthers"
                                v-model="newPatientInfo.riskFactors.HOthers"
                                class="riskfactorsInput"
                                type="text"
                                disabled
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
                      <div class="otherRisk" style="margin-right: 10px;">

                        <div style="display: flex; align-items: center;">
                          <input
                            id="ONone"
                            v-model="riskFactors.Other"
                            value="ONone"
                            name="riskFactorsO"
                            type="checkbox"
                            class="input-radio"
                            disabled
                          />
                          <label for="ONone">None</label>
                        </div>

                        <div style="display: flex; align-items: center">
                          <input
                            id="OAirPollution"
                            v-model="newPatientInfo.riskFactors.OAirPollution"
                            value="OAirPollution"
                            class="input-radio"
                            name="riskFactorsO"
                            type="checkbox"
                            disabled
                          />
                          <label for="OAirPollution"> Air Pollution </label>
                        </div>

                        <div style="display: flex; align-items: center">
                          <input
                            id="OCleanWater"
                            v-model="newPatientInfo.riskFactors.OCleanWater"
                            value="OCleanWater"
                            class="input-radio"
                            name="riskFactorsO"
                            type="checkbox"
                            disabled
                          />
                          <label for="OCleanWater">
                            No access to clean water
                          </label>
                        </div>

                        <div style="display: flex; align-items: center">
                          <input
                            id="OFlooding"
                            v-model="newPatientInfo.riskFactors.OFlooding"
                            value="OFlooding"
                            class="input-radio"
                            name="riskFactorsO"
                            type="checkbox"
                            disabled
                          />
                          <label for="OFlooding"> Flooding </label>
                        </div>

                        <div style="display: flex; align-items: center">
                          <input
                            id="OHealthEdu"
                            v-model="newPatientInfo.riskFactors.OHealthEdu"
                            value="OHealthEdu"
                            class="input-radio"
                            name="riskFactorsO"
                            type="checkbox"
                            disabled
                          />
                          <label for="OHealthEdu"> Lack of health education </label>
                        </div>

                        <div style="display: flex; align-items: center">
                          <input
                            id="OHealthFacility"
                            v-model="newPatientInfo.riskFactors.OHealthFacility"
                            value="OHealthFacility"
                            class="input-radio"
                            name="riskFactorsO"
                            type="checkbox"
                            disabled
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
                            v-model="newPatientInfo.riskFactors.OPoverty"
                            value="OPoverty"
                            class="input-radio"
                            name="riskFactorsO"
                            type="checkbox"
                            disabled
                          />
                          <label for="OPoverty"> Poverty </label>
                        </div>

                        <div style="display: flex; align-items: center">
                          <input
                            id="OShelter"
                            v-model="newPatientInfo.riskFactors.OShelter"
                            value="OShelter"
                            class="input-radio"
                            type="checkbox"
                            disabled
                          />
                          <label for="OShelter"> Inadequate shelter </label>
                        </div>

                        <div style="display: flex; align-items: center">
                          <input
                            id="OWasteMgmt"
                            v-model="newPatientInfo.riskFactors.OWasteMgmt"
                            value="OWasteMgmt"
                            class="input-radio"
                            name="riskFactorsO"
                            type="checkbox"
                            disabled
                          />
                          <label for="OWasteMgmt"> Lack of waste management </label>
                        </div>

                        <div style="display: flex; align-items: center">
                          <input
                            id="OVacCoverage"
                            v-model="newPatientInfo.riskFactors.OVacCoverage"
                            value="OVacCoverage"
                            class="input-radio"
                            name="riskFactorsO"
                            type="checkbox"
                            disabled
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
                            disabled
                          />
                          <label for="OtherOthers">
                            <div style="display: inline-flex">
                              Others:
                              <input
                                id="OtherOthers"
                                v-model="newPatientInfo.riskFactors.OOthers"
                                class="riskfactorsInput"
                                type="text"
                                disabled
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

        <form v-if="immunization.status!=='N/A'" id="patient3" type="submit">
          <div id="case-investigation-form" class="center">
            <h2 id="form-header">
              Immunization Program Status
            </h2>
            <div>
              <table>
                <thead>
                  <th> BCG </th>
                  <th> HEPA </th>
                  <th> OPV </th>
                  <th> PENTA </th>
                  <th> PCV </th>
                  <th> MCV </th>
                  <th> IMMUNIZATION STATUS </th>
                </thead>
                <tr>
                  <td>
                    <img v-if="immunization.bcg" src="~/assets/img/check.png" style="width:30px"/>
                    <img v-else src="~/assets/img/x.png" style="width:30px"/>
                  </td>
                  <td>
                    <img v-if="immunization.hepa2" src="~/assets/img/check.png" style="width:30px"/>
                    <img v-else src="~/assets/img/x.png" style="width:30px"/>
                  </td>
                  <td>
                    <img v-if="immunization.opv3" src="~/assets/img/check.png" style="width:30px"/>
                    <img v-else src="~/assets/img/x.png" style="width:30px"/>
                  </td>
                  <td>
                    <img v-if="immunization.penta3" src="~/assets/img/check.png" style="width:30px"/>
                    <img v-else src="~/assets/img/x.png" style="width:30px"/>
                  </td>
                  <td>
                    <img v-if="immunization.pcv3" src="~/assets/img/check.png" style="width:30px"/>
                    <img v-else src="~/assets/img/x.png" style="width:30px"/>
                  </td>
                  <td>
                    <img v-if="immunization.mcv2" src="~/assets/img/check.png" style="width:30px"/>
                    <img v-else src="~/assets/img/x.png" style="width:30px"/>
                  </td>
                  
                  <td>
                    <span v-if="immunization.status==='Complete'" > COMPLETE </span>
                    <span v-else> ONGOING </span>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </form>

        <hr/>

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
      today:'',
      newPatientInfo: {
        sex:'',
        pregWeeks:'',
        civilStatus:'',
        currHouseStreet:'',
        currCity:'',
        currBrgy:'',
        occupation:'',
        occuLoc:'',
        occuStreet:'',
        occuCity:'',
        occuBrgy:'',
        guardianName:'',
        guardianContact:'',
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
      riskFactors: {
        Lifestyle:'',
        CurrentCondition:'',
        Historical:'',
        Other:'',
      },
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
      immunization: 
        {
          status: 'Complete', // n/a ongoing complete
          bcg: true,
          hepa2: false,
          opv3: true,
          penta3: true,
          pcv3: false,
          mcv2: false,
        },
    }
  },
  mounted() {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    const yyyy = today.getFullYear();
    if(dd<10){
      dd='0'+dd
    } 
    if(mm<10){
      mm='0'+mm
    } 
    this.today = yyyy+'-'+mm+'-'+dd;
    // document.getElementById('birthdate').setAttribute('max', today);
    console.log(today);
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
    this.update('cancel')
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
      if (this.editCase && !this.validatePatient) return "input-radio input-required";
      else return "input-radio";
    },
    getAddress() {
      if (this.sameAddress) {
        this.newPatientInfo.permHouseStreet = this.newPatientInfo.currHouseStreet;
        this.newPatientInfo.permCity = this.newPatientInfo.currCity;
        this.getBrgy();
        // this.getLocBrgyList(this.newPatientInfo.permCity,'permBarangay');
        // this.newPatientInfo.permBrgy = this.newPatientInfo.currBrgy;
        // console.log(this.newPatientInfo.permBrgy,this.newPatientInfo.currBrgy)
      }
      else {
        this.newPatientInfo.permHouseStreet = '';
        this.newPatientInfo.permCity = '';
        this.newPatientInfo.permBrgy = '';
      }
    },
    getBrgy() {
      const perm = document.getElementById('permBarangay');
      const defaultOption = document.createElement('option');
      defaultOption.text = this.newPatientInfo.currBrgy;
      perm.add(defaultOption);
      perm.selectedIndex = 0;

      this.newPatientInfo.permBrgy = this.newPatientInfo.currBrgy;

      // eslint-disable-next-line no-console
      console.log(this.newPatientInfo.permBrgy)
      // eslint-disable-next-line no-console
      console.log(this.newPatientInfo.currBrgy)
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
      if (this.newPatientInfo.sex!=='' &&
          this.newPatientInfo.pregWeeks!=='' &&
          this.newPatientInfo.civilStatus!=='' &&
          this.newPatientInfo.currHouseStreet!=='' &&
          this.newPatientInfo.currCity!=='' &&
          this.newPatientInfo.currBrgy!=='' &&
          this.newPatientInfo.occupation!=='' &&
          this.newPatientInfo.occuLoc!=='' &&
          this.newPatientInfo.occuStreet!=='' &&
          this.newPatientInfo.occuCity!=='' &&
          this.newPatientInfo.occuBrgy!=='' &&
          this.newPatientInfo.guardianName!=='' &&
          this.newPatientInfo.guardianContact!=='' &&
          this.newPatientInfo.sex!== null &&
          this.newPatientInfo.pregWeeks!== null &&
          this.newPatientInfo.civilStatus!== null &&
          this.newPatientInfo.currHouseStreet!== null &&
          this.newPatientInfo.currCity!== null &&
          this.newPatientInfo.currBrgy!== null &&
          this.newPatientInfo.occupation!== null &&
          this.newPatientInfo.occuLoc!== null &&
          this.newPatientInfo.occuStreet!== null &&
          this.newPatientInfo.occuCity!== null &&
          this.newPatientInfo.occuBrgy!== null &&
          this.newPatientInfo.guardianName!== null &&
          this.newPatientInfo.guardianContact!== null) this.validatePatient = true;
          else this.validatePatient = false;
          if (this.newPatientInfo.pregWeeks!=='Not Pregnant' && this.newPatientInfo.pregWeeks<0)
            {this.newPatientInfo.pregWeeks = ''; this.validatePatient = false;}
          // if (this.newPatientInfo.guardianContact<0) {this.newPatientInfo.guardianContact = ''; this.validatePatient = false;}
      
      this.$nextTick(() => {
        if (this.newPatientInfo.occuBrgy != null) {
          const dropdown = document.getElementById('occuBarangay');
          const defaultOption = document.createElement('option');
          defaultOption.text = this.newPatientInfo.occuBrgy;
          dropdown.add(defaultOption);
          dropdown.selectedIndex = 0;
        }

        if (this.newPatientInfo.currBrgy != null) {
          const dropdown = document.getElementById('currBarangay');
          const defaultOption = document.createElement('option');
          defaultOption.text = this.newPatientInfo.currBrgy;
          dropdown.add(defaultOption);
          dropdown.selectedIndex = 0;
        }

        if (this.newPatientInfo.permBrgy != null) {
          const dropdown = document.getElementById('permBarangay');
          const defaultOption = document.createElement('option');
          defaultOption.text = this.newPatientInfo.permBrgy;
          dropdown.add(defaultOption);
          dropdown.selectedIndex = 0;
        }
      })
    },
    async update(action) {
      if (action==='cancel') {
        this.newPatientInfo.sex = this.formData.patient.sex;
        this.newPatientInfo.pregWeeks = this.formData.patient.pregWeeks;
        this.newPatientInfo.civilStatus = this.formData.patient.civilStatus;
        this.newPatientInfo.currHouseStreet = this.formData.patient.currHouseStreet;
        this.newPatientInfo.currCity = this.formData.patient.currCity;
        this.newPatientInfo.currBrgy = this.formData.patient.currBrgy;
        this.newPatientInfo.occupation = this.formData.patient.occupation;
        this.newPatientInfo.occuLoc = this.formData.patient.occuLoc;
        this.newPatientInfo.occuStreet = this.formData.patient.occuStreet;
        this.newPatientInfo.occuCity = this.formData.patient.occuCity;
        this.newPatientInfo.occuBrgy = this.formData.patient.occuBrgy;
        this.newPatientInfo.guardianName = this.formData.patient.guardianName;
        this.newPatientInfo.guardianContact = this.formData.patient.guardianContact;
        this.newPatientInfo.riskFactors = this.formData.riskFactors;

        this.editCase=false;
      }
      if (action==='done') {
        this.validateForm();
        if (this.validatePatient) {
          this.formData.patient.sex = this.newPatientInfo.sex;
          this.formData.patient.pregWeeks = this.newPatientInfo.pregWeeks;
          this.formData.patient.civilStatus = this.newPatientInfo.civilStatus;
          this.formData.patient.currHouseStreet = this.newPatientInfo.currHouseStreet;
          this.formData.patient.currCity = this.newPatientInfo.currCity;
          this.formData.patient.currBrgy = this.newPatientInfo.currBrgy;
          this.formData.patient.occupation = this.newPatientInfo.occupation;
          this.formData.patient.occuLoc = this.newPatientInfo.occuLoc;
          this.formData.patient.occuStreet = this.newPatientInfo.occuStreet;
          this.formData.patient.occuCity = this.newPatientInfo.occuCity;
          this.formData.patient.occuBrgy = this.newPatientInfo.occuBrgy;
          this.formData.patient.guardianName = this.newPatientInfo.guardianName;
          this.formData.patient.guardianContact = this.newPatientInfo.guardianContact;
          this.formData.riskFactors = this.newPatientInfo.riskFactors;

          const serve = (await axios.post("http://localhost:8080/api/updatePatientDetails", {
            patientID: this.formData.patient.patientID,
            newPatientInfo: this.newPatientInfo
          }));
          
          if (serve.status === 200) {
            this.$toast.success('Patient records updated!', {duration: 4000, icon: 'check_circle'});
          } else {
            // eslint-disable-next-line no-console
            console.log(serve);
            this.$toast.error('Something went wrong!', {duration: 4000, icon: 'error'});
          }
          this.editCase = false;

        }
        else {
          alert("Please fill up all required fields")
          this.$forceUpdate();
        }
      }
    },
    download() {
      this.isPrint = !this.isPrint;

      var pdf = new jsPDF();
      var element = document.getElementById('printPage');
      var width= element.style.width;
      var height = element.style.height;
      html2canvas(element).then(canvas => {
          var image = canvas.toDataURL('image/png');
          pdf.addImage(image, 'JPEG', 15, 40, width, height);
          pdf.save('printPage' + '.pdf');
      });
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

