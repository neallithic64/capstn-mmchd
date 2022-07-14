<template>
  <div id="addCRFDengue" class="addIPentryBody">
    <!--Top Bar of the screen-->
    <TopNav />

    <!--Everything below = main screen-->
    <div class="AIPE-case-container">
      <!--SUMMARY: left side-->
      <div class="AIPE-form-summary-container">
        <div class="AIPE-form-summary">
          <button id="login-submit" type="submit" style="width: 210px; text-align: left" @click="isOpen = !isOpen">
            <h2 style="font-weight: 600"> Form Summary </h2>
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
      <div class="IPentry-formSectionContainer">
        <!--Name of form-->
        <div class="AIPE-name">
          <h1 style="margin: 0; font-weight: 600; font-size: 24px">
            Immunization Program Form
          </h1>
          <p style="margin: 0 5px 5px 5px; font-size: 16px">
            Please fill up the form with complete and correct information
          </p>
        </div>

        <!--Form itself-->
        <div class="AIPE-form-component">

          <form v-if="pageNum == 0" id="dengue0" type="submit">
            <div id="AIPE-case-form" class="center">
              <h2 id="AIPE-formHeader">
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

          <form v-if="pageNum == 1 || pageNum == Object.keys(disease.formNames).length" id="Dengue1date" type="submit">
            <div id="AIPE-case-form" class="center">
              <div style="display:flex; flex-direction:row; justify-content: space-between;">
                <h2 id="AIPE-formHeader">
                  {{ Object.values(disease.formNames)[1] }}
                </h2>
                <div v-if="patientExist" style="display:inline-flex; flex-direction:row;">
                  <a class="patient-click" @click="clearPatientInfo()">Clear Patient</a>
                    <div style="color:gray;">&nbsp; | &nbsp;</div>
                  <a :href="'/patient?patientID='+formData.patient.patientID" class="patient-click" target="_blank">Edit Patient</a>
                </div>
              </div>

              <div class="field-row-straight">
                <div class="name-field">
                  <label for="lastname" class="required AIPElabel"> Last Name </label>
                  <input
                    id="lastname"
                    v-model="formData.patient.lastName"
                    class="input-form-field "
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
                <div class="name-field">
                  <label for="firstname" class="required AIPElabel"> First Name </label>
                  <input
                    id="firstname"
                    v-model="formData.patient.firstName"
                    class="input-form-field "
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
                <div class="name-field">
                  <label for="middlename" class="required AIPElabel"> Middle Name </label>
                  <input
                    id="middlename"
                    v-model="formData.patient.midName"
                    class="input-form-field "
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
              </div>

              <div class="field-row" style="display: inline-flex; margin-bottom: -1 px">
                <div class="half-half half-half1">
                  <div class="birthday-field field">
                    <label for="birthdate" class="required AIPElabel"> Date of Birth </label>
                    <input
                      id="birthdate"
                      v-model="formData.patient.birthDate"
                      :max="today"
                      class="input-form-field "
                      :class="isRequired()"
                      type="date"
                      :disabled="inputEdit()"
                      required
                      @change="getAge()"
                    />
                  </div>
                  <div class="age-field field">
                    <label for="age" class="required AIPElabel"> Age </label>
                    <input
                      id="age"
                      v-model="formData.patient.ageNo"
                      class="input-form-field "
                      :class="isRequired()"
                      type="number"
                      min="0"
                      :disabled="inputEdit()"
                      required
                    />
                  </div>
                </div>

                <div class="half-half half-half2">
                  <div class="sex-field field">
                    <label class="required AIPElabel"> Sex </label>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="Female"
                        v-model="formData.patient.sex"
                        value="Female"
                        class="input-radio"
                        name="sex"
                        type="radio"
                        :disabled="inputEdit()"
                        :class="isRequired()"
                        required
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
                        :class="isRequired()"
                        required
                      />
                      <label for="Male"> Male </label>
                    </div>
                  </div>
                  <div class="pregnancy-field field">
                    <label class="required AIPElabel"> Pregnancy </label>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="Not Pregnant"
                        v-model="formData.patient.pregWeeks"
                        name="pregWeeks"
                        type="radio"
                        value="Not Pregnant"
                        class="input-radio"
                        :disabled="inputEdit()"
                        :class="isRequired()"
                        required
                      />
                      <label for="Not Pregnant"> Not Pregnant </label>
                    </div>

                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="pregnancyWeeks"
                        name="pregWeeks"
                        type="radio"
                        class="input-radio"
                        :disabled="inputEdit()"
                        :class="isRequired()"
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
                  <label for="civilStatus" class="required AIPElabel">
                    Civil Status
                  </label>
                  <select
                    id="civilStatus"
                    v-model="formData.patient.civilStatus"
                    name="civilStatus"
                    :disabled="inputEdit()"
                    class="input-form-field "
                    :class="isRequired()"
                    required
                  >
                    <option value="SINGLE">SINGLE</option>
                    <option value="MARRIED">MARRIED</option>
                    <option value="SEPARATED">SEPARATED</option>
                    <option value="WIDOWED">WIDOWED</option>
                  </select>
                </div>
                <div class="field">
                  <label for="indigenousGroup AIPElabel"> Indigenous Group </label>
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
                  <label for="occupation" class="required AIPElabel"> Occupation </label>
                  <input
                    id="occupation"
                    v-model="formData.patient.occupation"
                    class="input-form-field "
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
                <div class="field">
                  <label for="occuLoc" class="required AIPElabel"> Occupation Location (Work/School) </label>
                  <input
                    id="occuLoc"
                    v-model="formData.patient.occuLoc"
                    class="input-form-field "
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
              </div>

              <hr class="AIPEhr"/>

              <div class="field-row">
                <div class="field">
                  <label for="occuStreet" class="required AIPElabel"> Occupation Address: Street / House No. </label>
                  <input
                    id="occuStreet"
                    v-model="formData.patient.occuStreet"
                    class="input-form-field "
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
              </div>

              <div class="field-row-straight">
                <div class="name-field">
                  <label for="occuCity" class="required AIPElabel"> City </label>
                  <select id="occuCity" 
                    v-model="formData.patient.occuCity" 
                    name="occuCity" 
                    :disabled="inputEdit()" 
                    class="input-form-field "
                    :class="isRequired()" 
                    required
                    @change="getLocBrgyList(formData.patient.occuCity,'occuBarangay')"
                    >
                    <option v-for="(city, i) in cityList" :key=i>{{city}}</option>
                  </select>
                </div>
                <div class="field">
                  <label for="occuBarangay" class="required AIPElabel"> Barangay </label>
                  <input v-if="patientExist"
                    id="occuBarangay"
                    v-model="formData.patient.occuBrgy"
                    class="input-form-field"
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                    required
                  />
                  <select v-else
                    id="occuBarangay"
                    v-model="formData.patient.occuBrgy"
                    class="input-form-field "
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
                  <label for="currentAddress" class="required AIPElabel"> Current Address: Street / House No. </label>
                  <input
                    id="currentAddress"
                    v-model="formData.patient.currHouseStreet"
                    class="input-form-field "
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
              </div>

              <div class="field-row-straight">
                <div class="name-field">
                  <label for="currCity" class="required AIPElabel"> City </label>
                  <select id="currCity" 
                    v-model="formData.patient.currCity" 
                    class="input-form-field "
                    name="currCity" 
                    :disabled="inputEdit()" 
                    :class="isRequired()" 
                    required
                    @change="getLocBrgyList(formData.patient.currCity,'currBarangay')"
                  >
                    <option v-for="(city, i) in cityList" :key=i>{{city}}</option>
                  </select>
                </div>
                <div class="field">
                  <label for="currBarangay" class="required AIPElabel"> Barangay </label>
                  <input v-if="patientExist"
                    id="currBarangay"
                    v-model="formData.patient.currBrgy"
                    class="input-form-field"
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                    required
                  />
                  <select v-else
                    id="currBarangay"
                    v-model="formData.patient.currBrgy"
                    class="input-form-field "
                    :class="isRequired()"
                    name="currBarangay"
                    :disabled="inputEdit()"
                    required
                  >
                  </select>
                </div>
              </div>

              <div class="field-row-straight">
                <div class="field-row-straight">
                  <input
                    id="sameAddress"
                    v-model="sameAddress"
                    class="input-radio "
                    type="checkbox"
                    :disabled="inputEdit()"
                    style="width: auto; margin:0 5px;"
                    @change="getAddress()"
                  />
                  <label for="sameAddress" style="font-size:12px"> Same permanent address as current address </label>
                </div>
              </div>

              <div class="field-row">
                <div class="field">
                  <label for="permAddress AIPElabel"> Permanent Address: Street / House No. </label>
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
                  <label for="permCity" class="AIPElabel"> City </label>
                  <select
                    id="permCity"
                    v-model="formData.patient.permCity"
                    name="permCity"
                    class="input-form-field"
                    :disabled="inputEdit()"
                    @change="getLocBrgyList(formData.patient.permCity,'permBarangay')"
                  >
                  <option v-for="(city, i) in cityList" :key=i>{{city}}</option>
                  </select>
                </div>
                <div class="field">
                  <label for="permBarangay" class="AIPElabel"> Barangay </label>
                  <input v-if="patientExist"
                    id="permBarangay"
                    v-model="formData.patient.permBrgy"
                    class="input-form-field"
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                    required
                  />
                  <select v-else
                    id="permBarangay"
                    v-model="formData.patient.permBrgy"
                    class="input-form-field "
                    :class="isRequired()"
                    name="permBarangay"
                    :disabled="inputEdit()"
                  >
                  </select>
                </div>
              </div>

              <hr class="AIPEhr"/>

              <div class="field-row-straight">
                <div class="field">
                  <label for="contactperson" class="required AIPElabel"> Parent / Caregiver </label>
                  <input
                    id="contactperson"
                    v-model="formData.patient.guardianName"
                    class="input-form-field "
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
                <div class="name-field">
                  <label for="contactpersonNum" class="required AIPElabel"> Contact No. </label>
                  <input
                    id="contactpersonNum"
                    v-model="formData.patient.guardianContact"
                    class="input-form-field "
                    :class="isRequired()"
                    type="number"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
              </div>

              <div class="field-row-straight">
                <div class="field">
                  <label for="HCPN" class="AIPElabel"> HCPN </label>
                  <input
                    id="HCPN"
                    v-model="formData.patient.HCPN"
                    class="input-form-field "
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                  />
                </div>
                <div class="field">
                  <label for="ILHZ" class="AIPElabel"> ILHZ </label>
                  <input
                    id="ILHZ"
                    v-model="formData.patient.ILHZ"
                    class="input-form-field "
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                  />
                </div>
              </div>
            </div>
          </form>
          <hr v-if="pageNum == Object.keys(disease.formNames).length" class="AIPEhr"/>

          <form v-if="pageNum == 2 || pageNum == Object.keys(disease.formNames).length" id="Dengue2date" type="submit">
            <div id="AIPE-case-form" class="center">
              <h2 id="AIPE-formHeader"> {{ Object.values(disease.formNames)[2] }} </h2>

              <div class="risk-flex">
                <div style="display: inline-flex;flex-direction: row;">

                  <div style="display: block">
                    <div class="risk-factors" style="display: inline-flex; margin-bottom: -1 px; flex-direction: column;">
                      <div class="field">
                        <h3 class="required AIPEh3">Lifestyle:</h3>
                        <div style="flex-direction: column; align-items: center">

                          <div style="display: flex; align-items: center;">
                            <input
                              id="LNone"
                              v-model="riskFactors.Lifestyle"
                              value="LNone"
                              name="riskFactorsL"
                              type="checkbox"
                              :disabled="inputEdit()"
                              class="input-radio"
                              :class="isRequired()"
                              required
                            />
                            <label for="LNone" class="AIPElabel">None</label>
                          </div>

                          <div style="display: flex; align-items: center;">
                            <input
                              id="LSmoking"
                              v-model="formData.riskFactors.LSmoking"
                              value="LSmoking"
                              name="riskFactorsL"
                              type="checkbox"
                              :disabled="inputEdit()"
                              class="input-radio"
                            />
                            <label for="LSmoking" class="AIPElabel">Smoking</label>
                          </div>

                          <div style="display: flex; align-items: center;">
                            <input
                              id="LAlcoholism"
                              v-model="formData.riskFactors.LAlcoholism"
                              value="LAlcoholism"
                              name="riskFactorsL"
                              type="checkbox"
                              :disabled="inputEdit()"
                              class="input-radio"
                            />
                            <label for="LAlcoholism" class="AIPElabel">Alcoholism</label>
                          </div>

                          <div style="display: flex; align-items: center;">
                            <input
                              id="LDrugUse"
                              v-model="formData.riskFactors.LDrugUse"
                              value="LDrugUse"
                              name="riskFactorsL"
                              type="checkbox"
                              :disabled="inputEdit()"
                              class="input-radio"
                            />
                            <label for="LDrugUse" class="AIPElabel">Drug Use</label>
                          </div>

                          <div style="display: flex; align-items: center;">
                            <input
                              id="LPhysicalInactivity"
                              v-model="formData.riskFactors.LPhysicalInactivity"
                              value="LPhysicalInactivity"
                              name="riskFactorsL"
                              type="checkbox"
                              :disabled="inputEdit()"
                              class="input-radio"
                            />
                            <label for="LPhysicalInactivity" class="AIPElabel"
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
                            <label for="LifestyleOthers" class="AIPElabel">
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
                        <h3 class="required AIPEh3">Current Health Conditions:</h3>
                        <div style="flex-direction: column; align-items: center">

                          <div style="display: flex; align-items: center;">
                            <input
                              id="CNone"
                              v-model="riskFactors.CurrentCondition"
                              value="CNone"
                              name="riskFactorsC"
                              type="checkbox"
                              :disabled="inputEdit()"
                              class="input-radio"
                              :class="isRequired()"
                              required
                            />
                            <label for="CNone" class="AIPElabel">None</label>
                          </div>

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
                            <label for="CAsthma" class="AIPElabel"> Asthma </label>
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
                            <label for="CHereditary" class="AIPElabel"> Hereditary </label>
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
                            <label for="ConditionOthers" class="AIPElabel">
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
                        <h3 class="required AIPEh3">Historical Health Data:</h3>
                        <div style="flex-direction: column; align-items: center">

                          <div style="display: flex; align-items: center;">
                            <input
                              id="HNone"
                              v-model="riskFactors.Historical"
                              value="HNone"
                              name="riskFactorsH"
                              type="checkbox"
                              :disabled="inputEdit()"
                              class="input-radio"
                              :class="isRequired()"
                              required
                            />
                            <label for="HNone" class="AIPElabel">None</label>
                          </div>

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
                            <label for="HDiabetes" class="AIPElabel"> Diabetes </label>
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
                            <label for="HHeartDisease" class="AIPElabel"> Heart Disease </label>
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
                            <label for="HHypertension" class="AIPElabel"> Hypertension </label>
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
                            <label for="HObesity" class="AIPElabel"> Obesity </label>
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
                            <label for="HistoricalOthers" class="AIPElabel">
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
                      <h3 class="required AIPEh3">Other Risks:</h3>
                      <div style="display:inline-flex; flex-direction:row">
                        <div class="otherRisk" style="margin-right: 10px;">

                          <div style="display: flex; align-items: center;">
                            <input
                              id="ONone"
                              v-model="riskFactors.Other"
                              value="ONone"
                              name="riskFactorsO"
                              type="checkbox"
                              :disabled="inputEdit()"
                              class="input-radio"
                              :class="isRequired()"
                              required
                            />
                            <label for="ONone" class="AIPElabel">None</label>
                          </div>

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
                            <label for="OAirPollution" class="AIPElabel"> Air Pollution </label>
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
                            <label for="OCleanWater" class="AIPElabel">
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
                            <label for="OFlooding" class="AIPElabel"> Flooding </label>
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
                            <label for="OHealthEdu" class="AIPElabel"> Lack of health education </label>
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
                            <label for="OHealthFacility" class="AIPElabel">
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
                            <label for="OPoverty" class="AIPElabel"> Poverty </label>
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
                            <label for="OShelter" class="AIPElabel"> Inadequate shelter </label>
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
                            <label for="OWasteMgmt" class="AIPElabel"> Lack of waste management </label>
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
                            <label for="OVacCoverage" class="AIPElabel">
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
                            <label for="OtherOthers" class="AIPElabel">
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
          <hr v-if="pageNum == Object.keys(disease.formNames).length" class="AIPEhr"/>

          <form v-if="pageNum == 3 || pageNum == Object.keys(disease.formNames).length" id="Dengue3date" type="submit">
            <div id="AIPE-case-form" class="center">
              <h2 id="AIPE-formHeader"> {{ Object.values(disease.formNames)[3] }} </h2>
              <div class="viewcases-component">
                <div id="vue-root">
                  <table v-if="dataSets[0]" id="datatable">
                    <tbody>
                      <template>
                        <tr>
                          <th colspan="2">BCG</th>
                          <td> <input v-if="loadedData[0].BCGdate != '' || action!='view'" v-model="dataSets[0].BCGdate" type="date" max="today" :disabled="loadedData[0].BCGdate != '' || inputEdit()"/> </td>
                          <td> <span v-if="loadedData[0].BCGdate != '' " style="display: inline-flex"> <img src="~/assets/img/check.png" class="IPentryComplete"/> COMPLETE </span> </td>
                        </tr>
                        <tr>
                          <th rowspan="2"> HEPA B1</th>
                          <th> w/in 24 hrs </th>
                          <td> <input v-if="loadedData[0].HEPAwithdate != '' || action!='view'" v-model="dataSets[0].HEPAwithdate" type="date" max="today" :disabled="loadedData[0].HEPAwithdate != '' || inputEdit()"/> </td>
                          <td rowspan="2"> <span v-if="loadedData[0].HEPAwithdate != '' && loadedData[0].HEPAmoredate != '' " style="display: inline-flex"> <img src="~/assets/img/check.png" class="IPentryComplete"/> COMPLETE </span></td>
                        </tr>
                        <tr>
                          <th>more than 24 hrs</th>
                          <td> <input v-if="loadedData[0].HEPAmoredate != '' || action!='view'" v-model="dataSets[0].HEPAmoredate" type="date" max="today" :disabled="loadedData[0].HEPAmoredate != '' || inputEdit()"/> </td>
                        </tr>
                        <tr>
                          <th rowspan="3"> OPV </th>
                          <th> 1 </th>
                          <td> <input v-if="loadedData[0].OPV1date != '' || action!='view'" v-model="dataSets[0].OPV1date" type="date" max="today" :disabled="loadedData[0].OPV1date != '' || inputEdit()"/> </td>
                          <td rowspan="3"> <span v-if="loadedData[0].OPV1date != '' && loadedData[0].OPV2date != '' && loadedData[0].OPV3date != '' " style="display: inline-flex"> <img src="~/assets/img/check.png" class="IPentryComplete"/> COMPLETE </span> </td>
                        </tr>
                        <tr>
                          <th> 2 </th>
                          <td> <input v-if="loadedData[0].OPV2date != '' || action!='view'" v-model="dataSets[0].OPV2date" type="date" max="today" :disabled="loadedData[0].OPV2date != '' || inputEdit()"/> </td>
                        </tr>
                        <tr>
                          <th> 3 </th>
                          <td> <input v-if="loadedData[0].OPV3date != '' || action!='view'" v-model="dataSets[0].OPV3date" type="date" max="today" :disabled="loadedData[0].OPV3date != '' || inputEdit()"/> </td>
                        </tr>
                        <tr>
                          <th rowspan="3"> PENTA </th>
                          <th> 1 </th>
                          <td> <input v-if="loadedData[0].PENTA1date != '' || action!='view'" v-model="dataSets[0].PENTA1date" type="date" max="today" :disabled="loadedData[0].PENTA1date != '' || inputEdit()"/> </td>
                          <td rowspan="3"> <span v-if="loadedData[0].PENTA1date != '' && loadedData[0].PENTA2date != '' && loadedData[0].PENTA3date != '' " style="display: inline-flex"> <img src="~/assets/img/check.png" class="IPentryComplete"/> COMPLETE </span> </td>
                        </tr>
                        <tr>
                          <th> 2 </th>
                          <td> <input v-if="loadedData[0].PENTA2date != '' || action!='view'" v-model="dataSets[0].PENTA2date" type="date" max="today" :disabled="loadedData[0].PENTA2date != '' || inputEdit()"/> </td>
                        </tr>
                        <tr>
                          <th> 3 </th>
                          <td> <input v-if="loadedData[0].PENTA3date != '' || action!='view'" v-model="dataSets[0].PENTA3date" type="date" max="today" :disabled="loadedData[0].PENTA3date != '' || inputEdit()"/> </td>
                        </tr>
                        <tr>
                          <th rowspan="3"> PCV </th>
                          <th> 1 </th>
                          <td> <input v-if="loadedData[0].PCV1date != '' || action!='view'" v-model="dataSets[0].PCV1date" type="date" max="today" :disabled="loadedData[0].PCV1date != '' || inputEdit()"/> </td>
                          <td rowspan="3"> <span v-if="loadedData[0].PCV1date != '' && loadedData[0].PCV2date != '' && loadedData[0].PCV3date != '' " style="display: inline-flex"> <img src="~/assets/img/check.png" class="IPentryComplete"/> COMPLETE </span> </td>
                        </tr>
                        <tr>
                          <th> 2 </th>
                          <td> <input v-if="loadedData[0].PCV2date != '' || action!='view'" v-model="dataSets[0].PCV2date" type="date" max="today" :disabled="loadedData[0].PCV2date != '' || inputEdit()"/> </td>
                        </tr>
                        <tr>
                          <th> 3 </th>
                          <td> <input v-if="loadedData[0].PCV3date != '' || action!='view'" v-model="dataSets[0].PCV3date" type="date" max="today" :disabled="loadedData[0].PCV3date != '' || inputEdit()"/> </td>
                        </tr>
                        <tr>
                          <th rowspan="2">MCV</th>
                          <th> MCV 1 (AMV)</th>
                          <td> <input v-if="loadedData[0].MCV1date != '' || action!='view'" v-model="dataSets[0].MCV1date" type="date" max="today" :disabled="loadedData[0].MCV1date != '' || inputEdit()"/> </td>
                          <td rowspan="2"> <span v-if="loadedData[0].MCV1date != '' && loadedData[0].MCV2date != '' " style="display: inline-flex"> <img src="~/assets/img/check.png" class="IPentryComplete"/> COMPLETE </span> </td>
                        </tr>
                        <tr>
                          <th> MCV 2 (MMR)</th>
                          <td> <input v-if="loadedData[0].MCV2date != '' || action!='view'" v-model="dataSets[0].MCV2date" type="date" max="today" :disabled="loadedData[0].MCV2date != '' || inputEdit()"/> </td>
                        </tr>
                        <tr>
                          <th rowspan="3"> Dengue </th>
                          <th> 1 </th>
                          <td> <input v-if="loadedData[0].Dengue1date != '' || action!='view'" v-model="dataSets[0].Dengue1date" type="date" max="today" :disabled="loadedData[0].Dengue1date != '' || inputEdit()"/> </td>
                          <td rowspan="3"> <span v-if="loadedData[0].Dengue1date != '' && loadedData[0].Dengue2date != '' && loadedData[0].Dengue3date != '' " style="display: inline-flex"> <img src="~/assets/img/check.png" class="IPentryComplete"/> COMPLETE </span> </td>
                        </tr>
                        <tr>
                          <th> 2 </th>
                          <td> <input v-if="loadedData[0].Dengue2date != '' || action!='view'" v-model="dataSets[0].Dengue2date" type="date" max="today" :disabled="loadedData[0].Dengue2date != '' || inputEdit()"/> </td>
                        </tr>
                        <tr>
                          <th> 3 </th>
                          <td> <input v-if="loadedData[0].Dengue3date != '' || action!='view'" v-model="dataSets[0].Dengue3date" type="date" max="today" :disabled="loadedData[0].Dengue3date != '' || inputEdit()"/> </td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </form>
          <hr v-if="pageNum == Object.keys(disease.formNames).length" class="AIPEhr"/>

        </div>

        <!-- Bottom 2 buttons -->
        <div style="margin: -10px 0 5px; float: right">
          <button v-if="pageNum==0" class="back-button" type="button" @click="cancel()">
            <nuxt-link to="/addImmunizationProg"> Cancel </nuxt-link>
          </button>
          <button v-else class="back-button" type="button" @click="move(pageNum - 1)">
            Back
          </button>
          <button v-if="pageNum != 3" class="next-button" type="button" @click="move(pageNum + 1)">
            Next
          </button>
          <button v-else class="next-button" type="button" @click="move(4)">
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
    title: 'Immunization Program Report Entry',
  },
  data() {
    return {
      action:'add',
      patientExist: false,
      sameAddress:'',
      today:'',
      isOpen: true,
      pageNum: 0,
      formPart: 'Dengue0',
      pageDone: [true,true,true,false,],
      pageColor: [true,false,false,false,],
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
          occuStreet: '',
          occuCity: '',
          occuBrgy: '',
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
        immunization: {}
      },
      riskFactors: {
        Lifestyle:'',
        CurrentCondition:'',
        Historical:'',
        Other:'',
      },
      disease: {
        idname: 'Dengue',
        name: 'Dengue',
        formNames: {
          form0: 'Search Patient',
          form1: 'Patient Record',
          form2: 'Risk Factors',
          form3: 'Immunization Info',
        },
      },
      cityList: [
        'CALOOCAN CITY',
        'LAS PIÑAS CITY',
        'MAKATI CITY',
        'MALABON CITY',
        'MANDALUYONG CITY',
        'MANILA CITY',
        'MARIKINA CITY',
        'MUNTINLUPA CITY',
        'NAVOTAS CITY',
        'PARAÑAQUE CITY',
        'PASAY CITY',
        'PASIG CITY',
        'QUEZON CITY',
        'SAN JUAN CITY',
        'TAGUIG CITY',
        'VALENZUELA CITY',
      ],
      columns: [
        {
          title: 'BCG',
          key: 'BCGdate',
        },
        {
          title: 'HEPA B1-1',
          key: 'HEPAwithdate',
        },
        {
          title: 'HEPA B1-2',
          key: 'HEPAmoredate',
        },
        {
          title: 'OPV 1',
          key: 'OPV1date',
        },
        {
          title: 'OPV 2',
          key: 'OPV2date',
        },
        {
          title: 'OPV 3',
          key: 'OPV3date',
        },
        {
          title: 'PENTA 1',
          key: 'PENTA1date',
        },
        {
          title: 'PENTA 2',
          key: 'PENTA2date',
        },
        {
          title: 'PENTA 3',
          key: 'PENTA3date',
        },
        {
          title: 'PCV 1',
          key: 'PCV1date',
        },
        {
          title: 'PCV 2',
          key: 'PCV2date',
        },
        {
          title: 'PCV 3',
          key: 'PCV3date',
        },
        {
          title: 'MCV 1',
          key: 'MCV1date',
        },
        {
          title: 'MCV 2',
          key: 'MCV2date',
        },
      ],
      loadedData: [
        {
          BCGdate: '',
          HEPAwithdate: '',
          HEPAmoredate: '',
          OPV1date: '',
          OPV2date: '',
          OPV3date: '',
          PENTA1date: '',
          PENTA2date: '',
          PENTA3date: '',
          PCV1date: '',
          PCV2date: '',
          PCV3date: '',
          MCV1date: '',
          MCV2date: '',
          Dengue1date: '',
          Dengue2date: '',
          Dengue3date: '',
        },
      ],
      dataSets: [
        {
          BCGdate: '',
          HEPAwithdate: '',
          HEPAmoredate: '',
          OPV1date: '',
          OPV2date: '',
          OPV3date: '',
          PENTA1date: '',
          PENTA2date: '',
          PENTA3date: '',
          PCV1date: '',
          PCV2date: '',
          PCV3date: '',
          MCV1date: '',
          MCV2date: '',
          Dengue1date: '',
          Dengue2date: '',
          Dengue3date: '',
        },
      ],
      patientResult: [],
      patients: [],
    }
  },
  async fetch() {
    // needs checking if there's filtering needed for this one, assume yes first
    this.patients = (await axios.get('http://localhost:8080/api/getPatients', {
      params: {
        userID: this.$auth.user.userID,
        userOnly: false
      }
    })).data;
  },
  computed: {},
  mounted() {
    this.today = this.convDatePHT(new Date());

    this.dataSets[0].BCGdate = this.loadedData[0].BCGdate;
    this.dataSets[0].HEPAwithdate = this.loadedData[0].HEPAwithdate;
    this.dataSets[0].HEPAmoredate = this.loadedData[0].HEPAmoredate;
    this.dataSets[0].OPV1date = this.loadedData[0].OPV1date;
    this.dataSets[0].OPV2date = this.loadedData[0].OPV2date;
    this.dataSets[0].OPV3date = this.loadedData[0].OPV3date;
    this.dataSets[0].PENTA1date = this.loadedData[0].PENTA1date;
    this.dataSets[0].PENTA2date = this.loadedData[0].PENTA2date;
    this.dataSets[0].PENTA3date = this.loadedData[0].PENTA3date;
    this.dataSets[0].PCV1date = this.loadedData[0].PCV1date;
    this.dataSets[0].PCV2date = this.loadedData[0].PCV2date;
    this.dataSets[0].PCV3date = this.loadedData[0].PCV3date;
    this.dataSets[0].MCV1date = this.loadedData[0].MCV1date;
    this.dataSets[0].MCV2date = this.loadedData[0].MCV2date;
    this.dataSets[0].Dengue1date = this.loadedData[0].Dengue1date;
    this.dataSets[0].Dengue2date = this.loadedData[0].Dengue2date;
    this.dataSets[0].Dengue3date = this.loadedData[0].Dengue3date;
    // this.$forceUpdate();
  },
  methods: {
    formpart(disease, pageNum) {
      this.formPart = disease + pageNum;
      // if (this.isOpen) this.formStatus(this.pageNum);
    },
    formColor(index) {
      if (this.isOpen) {
        if (this.patientExist) {
          if (index === 3) return 'formnum formnumcurr';
          else if (index === this.pageNum) return 'formnum formgray';
          else return 'formnum';
        }
        else if (!this.patientExist) {
          if (index === this.pageNum) return 'formnum formnumcurr';
          else if (this.pageColor[index]) return 'formnum formnumdone';
          else return 'formnum';
        }
      }
    },
    getAge() {
      const today = new Date();
      const age = today.getFullYear() - parseInt(this.formData.patient.birthDate.substr(0,4));
      console.log(today.getMonth()+1)
      console.log(parseInt(this.formData.patient.birthDate.substr(5,2)))
      if (today.getMonth()+1>parseInt(this.formData.patient.birthDate.substr(5,2))) this.formData.patient.ageNo = age;
      else if (today.getMonth()+1===parseInt(this.formData.patient.birthDate.substr(5,2))) {
        console.log(today)
        console.log(parseInt(this.formData.patient.birthDate.substr(8,2)))
        if (today.getDate()>=parseInt(this.formData.patient.birthDate.substr(8,2))) this.formData.patient.ageNo = age;
        else this.formData.patient.ageNo = age-1;
      }
      else this.formData.patient.ageNo = age-1;
      if (this.formData.patient.ageNo<0) this.formData.patient.ageNo = 0;
    },
    async save() {
      const result = await axios.post('http://localhost:8080/api/newImmuProgEntry', {
        formData: this.formData,
        immunisationData: this.loadedData[0],
        TCLID: this.$route.query.TCLID
      });
      if (result.status === 200) {
        // alert('CRF case submitted!');
        this.$toast.success('Case saved!', {duration: 4000, icon: 'check_circle'});
      } else {
        // eslint-disable-next-line no-console
        console.log(result);
        this.$toast.error('Something went wrong!', {duration: 4000, icon: 'error'});
      }
      return result.data;
    },
    saveData() {
      this.loadedData[0].BCGdate = this.dataSets[0].BCGdate;
      this.loadedData[0].HEPAwithdate = this.dataSets[0].HEPAwithdate;
      this.loadedData[0].HEPAmoredate = this.dataSets[0].HEPAmoredate;
      this.loadedData[0].OPV1date = this.dataSets[0].OPV1date;
      this.loadedData[0].OPV2date = this.dataSets[0].OPV2date;
      this.loadedData[0].OPV3date = this.dataSets[0].OPV3date;
      this.loadedData[0].PENTA1date = this.dataSets[0].PENTA1date;
      this.loadedData[0].PENTA2date = this.dataSets[0].PENTA2date;
      this.loadedData[0].PENTA3date = this.dataSets[0].PENTA3date;
      this.loadedData[0].PCV1date = this.dataSets[0].PCV1date;
      this.loadedData[0].PCV2date = this.dataSets[0].PCV2date;
      this.loadedData[0].PCV3date = this.dataSets[0].PCV3date;
      this.loadedData[0].MCV1date = this.dataSets[0].MCV1date;
      this.loadedData[0].MCV2date = this.dataSets[0].MCV2date;
      this.loadedData[0].Dengue1date = this.dataSets[0].Dengue1date;
      this.loadedData[0].Dengue2date = this.dataSets[0].Dengue2date;
      this.loadedData[0].Dengue3date = this.dataSets[0].Dengue3date;
    },
    async move(page) {
      this.validateForm(this.pageNum);
      this.pageColor[this.pageNum] = this.pageDone[this.pageNum];
      this.validateForm(page);
      this.pageColor[page] = this.pageDone[page];
      
      if ((this.patientExist ||this.pageDone[this.pageNum] || this.pageDone[page] || page===0 || this.pageNum ===0) && page!==4) {
        if (page < Object.keys(this.disease.formNames).length && this.pageNum < Object.keys(this.disease.formNames).length) {
          if (page!==3) this.pageDone[page] = true;
          if (this.pageNum!==3) this.pageDone[this.pageNum] = true;
          
          this.pageNum = page;
        }

        this.$nextTick(() => {
          if ((page === 1 ) && this.formData.patient.occuBrgy != null) {
            const dropdown = document.getElementById('occuBarangay');
            const defaultOption = document.createElement('option');
            defaultOption.text = this.formData.patient.occuBrgy;
            dropdown.add(defaultOption);
            dropdown.selectedIndex = 0;
          }

          if ((page === 1) && this.formData.patient.currBrgy != null) {
            const dropdown = document.getElementById('currBarangay');
            const defaultOption = document.createElement('option');
            defaultOption.text = this.formData.patient.currBrgy;
            dropdown.add(defaultOption);
            dropdown.selectedIndex = 0;
          }

          if ((page === 1) && this.formData.patient.permBrgy != null) {
            const dropdown = document.getElementById('permBarangay');
            const defaultOption = document.createElement('option');
            defaultOption.text = this.formData.patient.permBrgy;
            dropdown.add(defaultOption);
            dropdown.selectedIndex = 0;
          }
        })

      }

      else if (page===4) {
        if (this.patientExist || (this.pageDone[1] && this.pageDone[2] && this.pageColor[1] && this.Color[2])) {
          this.saveData();
          const res = await this.save();
          console.log(res);
          // redirect to view page with update action
          window.location.href = "/viewImmunizationProgEntry?action=update&patientID=" + res.patientID;
        }
        else {
          // alert('Please fill up the required fields');
          this.$toast.error('Please fill up the required fields.', {position: 'top-right', duration: 4000, icon: 'error'});
          // document.getElementsByClassName('input-form-field').className = 'input-form-field input-required';
          this.$forceUpdate();
        }
      }

      else {
        // alert('Please fill up the required fields');
        this.$toast.error('Please fill up the required fields.', {position: 'top-right', duration: 4000, icon: 'error'});
        // document.getElementsByClassName('input-form-field').className = 'input-form-field input-required';
        this.$forceUpdate();
      }
      // console.log(this.pageDone)
    },
    validateForm(page) {
      switch (page) {
        case 1:
          if (this.patientExist) this.pageDone[page] = true;
          else if (this.formData.patient.lastName!=='' &&
          this.formData.patient.firstName!=='' &&
          this.formData.patient.midName!=='' &&
          this.formData.patient.birthDate!=='' &&
          this.formData.patient.ageNo!=='' &&
          this.formData.patient.sex!=='' &&
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
          this.formData.patient.lastName!== null &&
          this.formData.patient.firstName!== null &&
          this.formData.patient.midName!== null &&
          this.formData.patient.birthDate!== null &&
          this.formData.patient.ageNo!== null &&
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
          ) this.pageDone[page] = true;
          else this.pageDone[page] = false;
          if (this.formData.patient.ageNo<0) {this.formData.patient.ageNo = ''; this.pageDone[page] = false;}
          if (this.formData.patient.pregWeeks!=='Not Pregnant' && this.formData.patient.pregWeeks<0)
            {this.formData.patient.pregWeeks = ''; this.pageDone[page] = false;}
          if (this.formData.patient.guardianContact<0) {this.formData.patient.guardianContact = ''; this.pageDone[page] = false;}
          break;
        case 2:
          if ((this.riskFactors.Lifestyle || this.formData.riskFactors.LSmoking || 
            this.formData.riskFactors.LAlcoholism || this.formData.riskFactors.LDrugUse || 
            this.formData.riskFactors.LPhysicalInactivity || this.formData.riskFactors.LOthers) && 
          (this.riskFactors.CurrentCondition || this.formData.riskFactors.CAsthma || 
            this.formData.riskFactors.CHereditary || this.formData.riskFactors.COthers) && 
          (this.riskFactors.Historical || this.formData.riskFactors.HDiabetes || 
            this.formData.riskFactors.HHeartDisease || this.formData.riskFactors.HHypertension || 
            this.formData.riskFactors.HObesity || this.formData.riskFactors.HOthers) && 
          (this.riskFactors.Other || this.formData.riskFactors.OAirPollution || 
            this.formData.riskFactors.OCleanWater || this.formData.riskFactors.OFlooding || 
            this.formData.riskFactors.OHealthEdu || this.formData.riskFactors.OHealthFacility || 
            this.formData.riskFactors.OPoverty || this.formData.riskFactors.OShelter || 
            this.formData.riskFactors.OWasteMgmt || this.formData.riskFactors.OVacCoverage || 
            this.formData.riskFactors.OOthers)
          ) this.pageDone[page] = true;
          else this.pageDone[page] = false;
          break;
        case 3:
          if(this.pageColor[1] && this.pageColor[2] && this.pageColor[3]) {
              //  this.pageColor[3] = true;
              //  this.pageDone[3] = true;
             }
          break;
      }
      if (this.pageDone[page]) this.pageColor[page] = true;
    },
    isRequired() {
      if (!this.pageDone[this.pageNum]) return "input-required";
    },
    inputEdit() {
      if ((this.pageNum===1 || this.pageNum===2) && this.patientExist) return true;
      else return false;
    },
    clearPatientInfo() {
      this.formData.patient.patientID = '';
      this.formData.patient.lastName = '';
      this.formData.patient.firstName = '';
      this.formData.patient.midName = '';
      this.formData.patient.birthDate = '';
      this.formData.patient.ageNo = '';
      this.formData.patient.sex = '';
      this.formData.patient.civilStatus = '';
      this.formData.patient.pregWeeks = '';
      this.formData.patient.currHouseStreet = '';
      this.formData.patient.currBrgy = '';
      this.formData.patient.currCity = '';
      this.formData.patient.permHouseStreet = '';
      this.formData.patient.permBrgy = '';
      this.formData.patient.permCity = '';
      this.formData.patient.guardianName = '';
      this.formData.patient.guardianContact = '';

      this.patientExist = false;
    },
    autoFillPatient(patient) {
      // console.log(patient);
      this.formData.patient.patientID = patient.patientID;
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

      this.patientExist = true;
      this.pageNum = 3;
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
    getAddress() {
      if (this.sameAddress) {
        this.formData.patient.permHouseStreet = this.formData.patient.currHouseStreet;
        this.formData.patient.permCity = this.formData.patient.currCity;
        this.getBrgy();
        // this.getLocBrgyList(this.formData.patient.permCity,'permBarangay');
        // this.formData.patient.permBrgy = this.formData.patient.currBrgy;
        // console.log(this.formData.patient.permBrgy,this.formData.patient.currBrgy)
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
    getBrgy() {
      const perm = document.getElementById('permBarangay');
      const defaultOption = document.createElement('option');
      defaultOption.text = this.formData.patient.currBrgy;
      perm.add(defaultOption);
      perm.selectedIndex = 0;

      this.formData.patient.permBrgy = this.formData.patient.currBrgy;

      // eslint-disable-next-line no-console
      console.log(this.formData.patient.permBrgy)
      // eslint-disable-next-line no-console
      console.log(this.formData.patient.currBrgy)
    },
    convDatePHT(d) { // only accepts Date object; includes checking
      return !isNaN(Date.parse(d)) ? (new Date(d.getTime() + 28800000)).toISOString().substr(0, 10) : "N/A";
    },
  },
}
</script>

<style>

.IPentryComplete {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.input-required:invalid, textarea:invalid { 
    box-shadow: 0 0 5px #d45252;
    border-color: hsl(0, 76%, 50%);
    /* background-color: #ff6961; */
}

.input-required{
  border-color: hsl(0, 76%, 50%);
}

.addIPentryBody {
  font-family: 'Work Sans', sans-serif;
  font-weight: 300;
  padding: 0px;
  margin: 0px;
  background-image: none;
}

.AIPE-case-container {
  margin: 70px 20px 5px 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: max-content;
}

@media only screen and (max-width: 800px) {
  .AIPE-case-container {
    width: 100%;
    flex-direction: column;
    align-items: center;
    margin: 0px;
    margin-top: 85px;
  }
}

.AIPE-form-summary {
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
  .AIPE-form-summary {
    width: 100%;
    position: unset;
    height: fit-content;
    z-index: 3;
  }
}

.AIPE-form-summary-container {
  position: fixed;
  width: fit-content;
  margin: 5px;
  padding: 5px;
}

@media only screen and (max-width: 800px) {
  .AIPE-form-summary-container {
    width: 95%;
    position: sticky;
    margin: 0px;
  }
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

@media only screen and (max-width: 800px) {
  .formnum {
    width: 98%;
    min-width: 200px;
  }
}

.formgray {
  background-color: gray;
  color: white;
}

.formnumdone {
  background-color: #346083;
  color: white;
}

.formnumcurr {
  background-color: #53a262;
  color: white;
}

.IPentry-formSectionContainer {
  left: 275px;
  position: relative;
  width: calc(100vw - 320px);
  /* margin: 5px; */
  padding: 5px;
}

@media only screen and (max-width: 800px) {
  .IPentry-formSectionContainer {
    left: 0px;
    width: 95%;
  }
}

.AIPE-name {
  position: relative;
  top: -3px;
  z-index: 2;
}
@media only screen and (max-width: 800px) {
  .AIPE-name {
    position: relative;
    top: 0px;
  }
}

.AIPE-form-component {
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
  .AIPE-form-component {
    position: relative;
    top: 0px;
    min-height: fit-content;
  }
}

.AIPE-case-form {
  margin-top: 5px;
  width: 100%;
}

#AIPE-formHeader {
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
  #AIPE-formHeader {
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

.patient-click {
  color: gray;
  cursor:pointer;
}

.patient-click:hover {
  color:#346083;
  text-decoration: underline;
}

.risk-factors {
  margin: 0 3px;
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

.AIPElabel {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  z-index: 1;
}

.required:after {
  content: '*';
  color: red;
}

.AIPEh3 {
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
  background: none;
  color: #c4c4c4;
}

.AIPEhr {
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
