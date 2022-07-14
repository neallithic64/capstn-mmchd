<template>
  <div id="addCRFLeptospirosis" class="addCRFD-body">
    <!--Top Bar of the screen-->
    <TopNav />

    <!--Everything below = main screen-->
    <div class="addCRFD-caseContainer">
      <!--SUMMARY: left side-->
      <div class="addCRFD-formSummary-container">
        <div class="addCRFD-formSummary">
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
      <div class="faddCRFD-formSectionContainer">
        <!--Name of form-->
        <div class="addCRFD-diseaseName">
          <h1 style="margin: 0; font-weight: 600; font-size: 24px">
            {{ disease.name }}
          </h1>
          <p style="margin: 0 5px 5px 5px; font-size: 16px">
            Please fill up the form with complete and correct information
          </p>
        </div>

        <!--Form itself-->
        <div class="addCRFD-formComponent">
          <form v-if="pageNum == 0" id="leptospirosis0" type="submit">
            <div id="case-report-form" class="center">
              <h2 id="addCRFD-formHeader">
                {{ Object.values(disease.formNames)[pageNum] }}
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

          <form v-if="pageNum == 1 || pageNum == Object.keys(disease.formNames).length" id="leptospirosis1" type="submit">
            <div id="case-report-form" class="center">
              <div style="display:flex; flex-direction:row; justify-content: space-between;">
                <h2 id="addCRFD-formHeader">
                  {{ Object.values(disease.formNames)[pageNum] }}
                </h2>
                <div v-if="patientExist && pageNum == 1" style="display:inline-flex; flex-direction:row;">
                  <a class="patient-click" @click="clearPatientInfo()">Clear Patient</a>
                    <div style="color:gray;">&nbsp; | &nbsp;</div>
                  <a :href="'/patient?patientID='+formData.patient.patientID" class="patient-click" target="_blank">Edit Patient</a>
                </div>
              </div>

              <div class="field-row-straight">
                <div class="name-field">
                  <label for="lastname" class="required"> Last Name </label>
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
                  <label for="firstname" class="required"> First Name </label>
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
                  <label for="middlename" class="required"> Middle Name </label>
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
                    <label for="birthdate" class="required"> Date of Birth </label>
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
                    <label for="age" class="required"> Age </label>
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
                  <label for="civilStatus" class="required">
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
                    class="input-form-field "
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
                    class="input-form-field "
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
              </div>

              <hr class="addCRF-hr"/>

              <div class="field-row">
                <div class="field">
                  <label for="occuStreet" class="required"> Occupation Address: Street / House No. </label>
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
                  <label for="occuCity" class="required"> City </label>
                  <select id="occuCity" 
                    v-model="formData.patient.occuCity" 
                    name="occuCity" 
                    :disabled="inputEdit()" 
                    class="input-form-field "
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
                    class="input-form-field "
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
                  <label for="currCity" class="required"> City </label>
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
                  <label for="currBarangay" class="required"> Barangay </label>
                  <select
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
                    class="input-form-field"
                    :disabled="inputEdit()"
					@change="getLocBrgyList(formData.patient.permCity,'permBarangay')"
                  >
                  <option v-for="(city, i) in cityList" :key=i>{{city}}</option>
                  </select>
                </div>
                <div class="field">
                  <label for="permBarangay"> Barangay </label>
                  <select
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

              <hr class="addCRF-hr"/>

              <div class="field-row-straight">
                <div class="field">
                  <label for="contactperson" class="required"> Parent / Caregiver </label>
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
                  <label for="contactpersonNum" class="required"> Contact No. </label>
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
                  <label for="HCPN"> HCPN </label>
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
                  <label for="ILHZ"> ILHZ </label>
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
          <hr v-if="pageNum == Object.keys(disease.formNames).length" class="addCRF-hr" />

          <form v-if="pageNum == 2 || pageNum == Object.keys(disease.formNames).length" id="leptospirosis2" type="submit">
            <div id="case-report-form" class="center">
              <h2 id="addCRFD-formHeader"> {{ Object.values(disease.formNames)[pageNum] }} </h2>

              <div class="field-row">
                <div class="thirtyDesk" style="display: inline-flex; flex-direction: row">
                  <div class=" field">
                    <label class="required"> Patient Consulted </label>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="noConsult"
                        v-model="formData.caseData.patientConsulted"
                        value="No"
                        class="input-radio"
                        name="patientConsulted"
                        type="radio"
                        :disabled="inputEdit()"
                        :class="isRequired()"
                        required
                      />
                      <label for="noConsult"> No </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="yesConsult"
                        v-model="formData.caseData.patientConsulted"
                        value="Yes"
                        class="input-radio"
                        name="patientConsulted"
                        type="radio"
                        :disabled="inputEdit()"
                        :class="isRequired()"
                        required
                      />
                      <label for="yesConsult"> Yes </label>
                    </div>
                  </div>
                </div>
                <div v-if="formData.caseData.patientConsulted=='Yes'" class="patientConsultDate-field field">
                  <label for="patientConsultDate" class="required"> Date of First Consultation </label>
                  <input
                    id="patientConsultDate"
                    v-model="formData.caseData.patientConsultDate"
                    :max="today"
                    type="date"
                    :disabled="inputEdit()"
                    class="input-form-field "
                    :class="isRequired()"
                    required
                  />
                </div>
                <div v-if="formData.caseData.patientConsulted=='Yes'" class="indigenousGroup-field field" style="width: 40%">
                  <label for="patientConsultPlace" class="required"> Place of Consultation </label>
                  <input
                    id="patientConsultPlace"
                    v-model="formData.caseData.patientConsultPlace"
                    type="text"
                    :disabled="inputEdit()"
                    class="input-form-field "
                    :class="isRequired()"
                    required
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
                        value="No"
                        class="input-radio"
                        name="admitStatus"
                        type="radio"
                        :disabled="inputEdit()"
                        :class="isRequired()"
                        required
                      />
                      <label for="noAdmit"> No </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="yesAdmit"
                        v-model="formData.patient.admitStatus"
                        value="Yes"
                        class="input-radio"
                        name="admitStatus"
                        type="radio"
                        :disabled="inputEdit()"
                        :class="isRequired()"
                        required
                      />
                      <label for="yesAdmit"> Yes </label>
                    </div>
                  </div>
                </div>
                <div v-if="formData.patient.admitStatus=='Yes'" class="patientConsultDate-field field">
                  <label for="patientConsultDate" class="required">
                    Date Admitted / Seen / Consulted
                  </label>
                  <input
                    id="dateAdmitted"
                    v-model="formData.cases.dateAdmitted"
                    :max="today"
                    type="date"
                    :disabled="inputEdit()"
                    class="input-form-field "
                    :class="isRequired()"
                    required
                  />
                </div>
                <div class="indigenousGroup-field field" style="width: 40%">
                    
                  </div>
              </div>
              <div class="field-row">
                <div class="dateOnset-field field" style="width:30%">
                  <label for="exposure" class="required">
                    Exposure
                  </label>
                  <select
                      id="exposure"
                      v-model="formData.caseData.exposure"
                      name="exposure"
                      :disabled="inputEdit()"
                    >
                      <option value="Infected Animals">Infected Animals</option>
                      <option value="Animal Urine">Animal Urine</option>
                      <option value="Contaminated Water">Contaminated Water</option>
                    </select>
                </div>
                <div class="dateOnset-field field" style="width:30%; margin-right:50px">
                  <label for="exposurePlace" class="required">
                    Exposure Place
                  </label>
                  <input
                    id="exposurePlace"
                    v-model="formData.cases.exposurePlace"
                    class="input-form-field"
                    type="text"
                    :disabled="inputEdit()"
                    :class="isRequired()"
                    required
                  />
                </div>
              </div>
            </div>

            <hr class="addCRF-hr"/>

            <div id="case-report-form" class="center">
              <div style="display: flex; flex-direction: row;">
                <h2 id="addCRFD-formHeader">Risk Factors</h2>
                <button
                  class="tooltip"
                  data-tooltip="Identify all possible risk factors that may contribute to the analysis of disease spread"
                  data-tooltip-location="right">
                  <img class="tooltip-icon-img" src="~/assets/img/infoicon.png" />    
                </button>
              </div>

              <div class="risk-flex">
                <div style="display: inline-flex;flex-direction: row;">

                  <div style="display: block">
                    <div class="risk-factors" style="display: inline-flex; margin-bottom: -1 px; flex-direction: column;">
                      <div class="field">
                        <h3 class="required addCRFDh3">Lifestyle:</h3>
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
                            <label for="LNone">None</label>
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
                            <label for="LSmoking">Smoking</label>
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
                            <label for="LAlcoholism">Alcoholism</label>
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
                            <label for="LDrugUse">Drug Use</label>
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
                        <h3 class="required addCRFDh3">Current Health Conditions:</h3>
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
                            <label for="CNone">None</label>
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
                        <h3 class="required addCRFDh3">Historical Health Data:</h3>
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
                            <label for="HNone">None</label>
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
                      <h3 class="required addCRFDh3">Other Risks:</h3>
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
                            <label for="ONone">None</label>
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
          <hr v-if="pageNum == Object.keys(disease.formNames).length" class="addCRF-hr"/>

          <form v-if="pageNum == 3 || pageNum == Object.keys(disease.formNames).length" id="leptospirosis3" type="submit">
            <div id="case-investigation-form" class="center">
              <h2 id="addCRFD-formHeader">
                {{ Object.values(disease.formNames)[pageNum] }}
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
                        :class="isRequired()"
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
                        :class="isRequired()"
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
                        v-model="formData.caseData.dateDied"
                        :max="today"
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
                  <label for="finalDiagnosis" class="required">
                    Other Remarks
                  </label>
                  <input
                    id="finalDiagnosis"
                    v-model="formData.caseData.finalDiagnosis"
                    class="input-form-field"
                    style="width: 50%"
                    type="text"
                    :disabled="inputEdit()"
                    :class="isRequired()"
                    required
                  />
                </div>
              </div>
            </div>
          </form>
          <hr v-if="pageNum == Object.keys(disease.formNames).length" class="addCRF-hr"/>

          <form v-if="pageNum == 4 || pageNum == Object.keys(disease.formNames).length" id="leptospirosis4" type="submit">
            <div id="case-investigation-form" class="center">
              <h2 id="addCRFD-formHeader">
                {{ Object.values(disease.formNames)[pageNum] }}
              </h2>

              <div class="vaccine-field field">
                <label class="required" style="margin-right: 50px">
                  Do you have the lab result?
                </label>
                <div style="display: inline-flex; flex-direction: row">
                  <div class="center-center">
                    <input
                      id="noLabTest"
                      v-model="formData.caseData.labTestStatus"
                      value="No"
                      class="input-radio"
                      name="labTest"
                      type="radio"
                      :disabled="inputEdit()"
                      :class="isRequired()"
                      required
                    />
                    <label for="noLabTest"> No </label>
                  </div>
                  <div class="center-center" style="margin: 0 20px">
                    <input
                      id="processingLabTest"
                      v-model="formData.caseData.labTestStatus"
                      value="Processing"
                      class="input-radio"
                      name="labTest"
                      type="radio"
                      :disabled="inputEdit()"
                      :class="isRequired()"
                      required
                    />
                    <label for="processingLabTest"> Processing </label>
                  </div>
                  <div class="center-center" style="margin: 0 20px">
                    <input
                      id="yesLabTest"
                      v-model="formData.caseData.labTestStatus"
                      value="Yes"
                      class="input-radio"
                      name="labTest"
                      type="radio"
                      :disabled="inputEdit()"
                      :class="isRequired()"
                      required
                    />
                    <label for="yesLabTest"> Yes </label>
                  </div>
                </div>
              </div>

              <div v-show="formData.caseData.labTestStatus==='No'">
                <div class="name-field" style="width:50%">
                  <label for="investigatorLab" class="required"> Choose Lab to forward the case to </label>
                  <select id="investigatorLab" 
                      v-model="formData.cases.investigatorLab" 
                      name="investigatorLab" 
                      :disabled="inputEdit()"
                      class="input-form-field "
                      :class="isRequired()"
                      required>
                    <option v-for="(lab, i) in labList" :key=i :value=lab.userID> {{ lab.druName }} </option>
                  </select>
                </div>
              </div>

              <div v-show="formData.caseData.labTestStatus==='Yes'" style="margin-left:7px;">
                <div class="field-row-straight" style="display: inline-flex; flex-direction: row">
                  <div style="width:30%" class="field">
                    <label for="labTestType" class="required">
                      Lab Test done
                    </label>
                    <select
                      id="labTestType"
                      v-model="formData.caseData.labTestType"
                      name="labTestType"
                      :disabled="inputEdit()"
                      class="input-form-field "
                      :class="isRequired()"
                      required
                    >
                      <option value="RDT">RDT</option>
                      <option value="MAT">MAT</option>
                      <option value="PCR">PCR</option>
                    </select>
                  </div>
                  <div style="width:30%" class="field">
                    <label for="labTestCollectDate" class="required">
                      Date Collected
                    </label>
                    <input
                      id="labTestCollectDate"
                      v-model="formData.caseData.labTestCollectDate"
                      :max="today"
                      class="input-form-field"
                      type="date"
                      :disabled="inputEdit()"
                      :class="isRequired()"
                      required
                    />
                  </div>
                  <div style="width:30%" class="field">
                    <label for="labTestResult" class="required">
                      Stool Culture Result
                    </label>
                    <select
                      id="labTestResult"
                      v-model="formData.caseData.labTestResult"
                      name="labTestResult"
                      :disabled="inputEdit()"
                      class="input-form-field "
                      :class="isRequired()"
                      required
                    >
                      <option value="Positive">Positive</option>
                      <option value="Negative">Negative</option>
                      <option value="Pending Result">Pending Result</option>
                      <option value="Not Done">Not Done</option>
                    </select>
                  </div>
                </div>
              </div>
              <div v-if="noLabTest" class="errorLab"> Please input atleast 1 lab test </div>
              
            </div>
          </form>
          <hr v-if="pageNum == Object.keys(disease.formNames).length" class="addCRF-hr"/>

          <form v-if="pageNum == 5 || pageNum == Object.keys(disease.formNames).length" id="leptospirosis5" type="submit">
            <div id="case-investigation-form" class="center">
              <h2 id="addCRFD-formHeader">
                {{ Object.values(disease.formNames)[pageNum] }}
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
                        <ul v-for="(value, name, i) in classification" :key="i" style="displayLinline-flex">
                          <li>
                            <input :id="name" type="checkbox" class="collapseInput"/>
                            <label :for="name" class="collapseLabel">
                              <input
                                :id="name"
                                v-model="formData.cases.caseClassification"
                                :value="name"
                                class="input-checkbox"
                                name="caseClassification"
                                type="radio"
                                :disabled="inputEdit()"
                                :class="isRequired()"
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
    title: 'Case Report Form - Leptospirosis',
  },
  data() {
    return {
      patientExist: false,
      sameAddress:'',
      locBrgyList: [],
      today:'',
      hasLabTest:'',
      noLabTest:false,
      isOpen: true,
      openCollapse: '',
      isDisabled: false,
      diseaseID: 'DI-0000000000003',
      patients: [],
      patientResult: [],
      labList:[],
      pageNum: 0,
      formPart: 'Leptospirosis0',
      pageDone: [true,true,true,true,true,true,false],
      pageColor: [true,false,false,false,false,false,false],
      formData: {
        cases: {
          caseID: '',
          diseaseID: '',
          reportedBy: '',
          caseClassification: '',
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
        caseData: {
          exposurePlace: '',
          patientConsulted: '',
          patientConsultDate:'',
          patientConsultPlace:'',
          exposure: '',
          // Lab
          labTestType: '',
          labTestResult:'',
          labTestCollectDate: '',
          // Page 6++
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
        vitA: '',
      },
      riskFactors: {
        Lifestyle:'',
        CurrentCondition:'',
        Historical:'',
        Other:'',
      },
      disease: {
        idname: 'Leptospirosis',
        name: 'Leptospirosis',
        formNames: {
          form0: 'Search Patient',
          form1: 'Patient Record',
          form2: 'Patient Information',
          form3: 'Outcome',
          form4: 'Laboratory Tests',
          form5: 'Case Classification',
        },
      },
      classification: {},
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
    }
  },
  async fetch() {
    let rows = (await axios.get('http://localhost:8080/api/getCaseDefs?diseaseID=' + this.diseaseID)).data;
    for (let i = 0; i < rows.length; i++) {
      this.classification[rows[i].class] = rows[i].definition;
    }
    rows = (await axios.get('http://localhost:8080/api/getPatients')).data;
    this.patients = rows;
    rows = (await axios.get('http://localhost:8080/api/getLabUsers')).data;
    this.labList = rows;
  },
  head() {
    return {
      title: 'New Leptospirosis Case'
    }
  },
  computed: {},
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
    // console.log(today);
  },
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
    async submit() {
      // TODO: this submit is the "save" type, the cases should only be visible to the DRU, not yet submitted to MMCHD
      const now = new Date();
      this.formData.cases.diseaseID = this.diseaseID;
      this.formData.cases.reportedBy = this.$auth.user.userID;
      this.formData.cases.reportDate = now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate();
      const result = await axios.post('http://localhost:8080/api/newCase', {formData: this.formData, CRFID: this.$route.query.CRFID});
      console.log(result);
      if (result.status === 200) {
        // alert('CRF case submitted!');
        this.$toast.success('Case saved!', {duration: 4000, icon: 'check_circle'});
        if(result.data.outbreakID){
          if(result.data.type === 'Alert'){
            window.open('http://localhost:3000/alertOutbreak?outbreakID='+ result.data.outbreakID)
          } else
            window.open('http://localhost:3000/epiOutbreak?outbreakID='+ result.data.outbreakID);
        }
        window.location.href = '/allCases';
      } else {
        // eslint-disable-next-line no-console
        console.log(result);
        this.$toast.error('Something went wrong!', {duration: 4000, icon: 'error'});
      }
    },
    move(page) {
      this.validateForm(this.pageNum);
      this.validateForm(page);
      
      if (this.pageDone[this.pageNum] || this.pageDone[page] || page===0 || this.pageNum ===0) {
        if (page===Object.keys(this.disease.formNames).length) {
          if (!this.pageColor[Object.keys(this.disease.formNames).length]) 
            this.$toast.error('Please make sure all pages are accomplished.', {position: 'top-right', duration: 4000, icon: 'error'});
          else this.pageNum = page;
        }
        else if (this.pageNum===Object.keys(this.disease.formNames).length) {
          this.pageNum = page;
        }
        else if (page < Object.keys(this.disease.formNames).length && this.pageNum < Object.keys(this.disease.formNames).length) {
          if (this.isOpen) {
            const prevFormNum = 'form' + this.pageNum;
            document.getElementById(prevFormNum).className = 'formnum formnumdone';
            const currFormNum = 'form' + page;
            document.getElementById(currFormNum).className = 'formnum formnumcurr';}

          this.pageDone[this.pageNum] = true;
          this.pageDone[page] = true;
          this.pageNum = page;
        }

        this.$nextTick(() => {
        if ((this.pageNum === 1) && this.formData.patient.occuBrgy != null) {
          const dropdown = document.getElementById('occuBrgy');
          while (dropdown.firstChild) dropdown.removeChild(dropdown.firstChild);
          const defaultOption = document.createElement('option');
          defaultOption.text = this.formData.patient.occuBrgy;
          dropdown.add(defaultOption);
          dropdown.selectedIndex = 0;
        }

        if ((this.pageNum === 1) && this.formData.patient.currBrgy != null) {
          const dropdown = document.getElementById('currBarangay');
          while (dropdown.firstChild) dropdown.removeChild(dropdown.firstChild);
          const defaultOption = document.createElement('option');
          defaultOption.text = this.formData.patient.currBrgy;
          dropdown.add(defaultOption);
          dropdown.selectedIndex = 0;
        }

        if ((this.pageNum === 1) && this.formData.patient.permBrgy != null) {
          const dropdown = document.getElementById('permBarangay');
          while (dropdown.firstChild) dropdown.removeChild(dropdown.firstChild);
          const defaultOption = document.createElement('option');
          defaultOption.text = this.formData.patient.permBrgy;
          dropdown.add(defaultOption);
          dropdown.selectedIndex = 0;
        }
      })
    
      }
      else {
        this.$toast.error('Please fill up the required fields.', {position: 'top-right', duration: 4000, icon: 'error'});
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
          if (this.formData.caseData.patientConsulted!=='' &&
          this.formData.patient.admitStatus!=='' &&
          this.formData.cases.exposure!=='' &&
          this.formData.cases.exposurePlace!=='' &&
          (this.riskFactors.Lifestyle || this.formData.riskFactors.LSmoking || 
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
          ) {
            if ((this.formData.caseData.patientConsulted==='No' ||
              this.formData.caseData.patientConsulted==='Yes' && 
                this.formData.caseData.patientConsultDate!=='' && this.formData.caseData.patientConsultPlace!=='') &&
              (this.formData.patient.admitStatus==='No' ||
              this.formData.patient.admitStatus==='Yes' && this.formData.cases.dateAdmitted!==''))
            this.pageDone[page] = true;
            else this.pageDone[page] = false;
          }
          else this.pageDone[page] = false;
          break;
        case 3:
          if (this.formData.caseData.outcome!=='' && this.formData.caseData.finalDiagnosis!=='' &&
              this.formData.caseData.finalDiagnosis!==null && this.formData.caseData.finalDiagnosis!==undefined) {
            if (this.formData.caseData.outcome==='Alive' ||
                (this.formData.caseData.outcome==='Dead' &&
                this.formData.caseData.dateDied!=='' &&
                this.formData.caseData.dateDied!==null &&
                this.formData.caseData.dateDied!==undefined))
              this.pageDone[page] = true;
            else this.pageDone[page] = false;
          }
          else this.pageDone[page] = false;
          break;
        case 4:
          if (this.formData.caseData.labTestStatus!=='') {
            if (this.formData.caseData.labTestStatus==='Processing') 
              {this.pageDone[page] = true; this.errorLab = false;}
            else if (this.formData.caseData.labTestStatus==='No' &&
                     this.formData.cases.investigatorLab!=='' && 
                     this.formData.cases.investigatorLab!==undefined)
              {this.pageDone[page] = true; this.errorLab = false;}
            else if(this.formData.caseData.labTestStatus==='Yes' &&
                  (this.formData.caseData.labTestResult!== '' && 
                   this.formData.caseData.labTestCollectDate!== '' &&
                   this.formData.caseData.labTestType !==''))
              {this.pageDone[page] = true; this.errorLab = false;}
            else {this.pageDone[page] = false;this.errorLab = true;}
          }
          else {this.pageDone[page] = false; this.errorLab = true;}
          break;
        case 5:
          if (this.formData.cases.caseClassification !=='' &&
              this.formData.cases.caseClassification !== null &&
              this.formData.cases.caseClassification !== undefined)
            this.pageDone[page] = true;
          else this.pageDone[page] = false;
          break;
        case 6:
          if(this.pageColor[1] && this.pageColor[2] && this.pageColor[3] && this.pageColor[4]
             && this.pageColor[5]) {
               this.pageColor[6] = true;
               this.pageDone[6] = true;
             }
          break;
      }
      this.pageColor[page] = this.pageDone[page];
    },
    isRequired() {
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
      }
      else if (this.pageNum===1 && this.patientExist) return true;
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
      this.pageNum++;

      this.patientExist = true;
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

.addCRFD-body {
  font-family: 'Work Sans', sans-serif;
  font-weight: 300;
  padding: 0px;
  margin: 0px;
  background-image: none;
}

.addCRFD-caseContainer {
  margin: 70px 20px 5px 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: max-content;
}

@media only screen and (max-width: 800px) {
  .addCRFD-caseContainer {
    width: 100%;
    flex-direction: column;
    align-items: center;
    margin: 0px;
    margin-top: 85px;
  }
}

.addCRFD-formSummary {
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
  .addCRFD-formSummary {
    width: 100%;
    position: unset;
    height: fit-content;
    z-index: 3;
  }
}

.addCRFD-formSummary-container {
  position: fixed;
  width: fit-content;
  margin: 5px;
  padding: 5px;
}

@media only screen and (max-width: 800px) {
  .addCRFD-formSummary-container {
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

.formnumdone {
  background-color: #346083;
  color: white;
}

.formnumcurr {
  background-color: #53a262;
  color: white;
}

.faddCRFD-formSectionContainer {
  left: 275px;
  position: relative;
  width: calc(100vw - 320px);
  /* margin: 5px; */
  padding: 5px;
}

@media only screen and (max-width: 800px) {
  .faddCRFD-formSectionContainer {
    left: 0px;
    width: 95%;
  }
}

.addCRFD-diseaseName {
  position: relative;
  top: -3px;
  z-index: 2;
}
@media only screen and (max-width: 800px) {
  .addCRFD-diseaseName {
    position: relative;
    top: 0px;
  }
}

.addCRFD-formComponent {
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
  .addCRFD-formComponent {
    position: relative;
    top: 0px;
    min-height: fit-content;
  }
}

.case-report-form {
  margin-top: 5px;
  width: 100%;
}

#addCRFD-formHeader {
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
  #addCRFD-formHeader {
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

/* TOOLTIP */

.tooltip-icon-img {
  width: 10px;
  height: 10px;
  margin: 0 5px;
  z-index: 1;
}

[data-tooltip] {
    position: relative;
    z-index: 10;
  }

  /* Positioning and visibility settings of the tooltip */
  [data-tooltip]:before,
  [data-tooltip]:after {
    position: absolute;
    visibility: hidden;
    opacity: 0;
    left: 50%;
    bottom: calc(100% + 5px); /* 5px is the size of the arrow */
    pointer-events: none;
    transition: 0.2s;
    will-change: transform;
    font-family: 'Work Sans', sans-serif;
  }

  /* The actual tooltip with a dynamic width */
  [data-tooltip]:before {
    content: attr(data-tooltip);
    padding: 9px 10px;
    min-width: 50px;
    max-width: 300px;
    width: max-content;
    width: -moz-max-content;
    border-radius: 6px;
    font-size: 10px;
    background-color: rgba(59, 72, 80, 0.9);
    background-image: linear-gradient(30deg,
      rgba(59, 72, 80, 0.44),
      rgba(59, 68, 75, 0.44),
      rgba(60, 82, 88, 0.44));
    box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.2);
    color: #fff;
    text-align: center;
    white-space: pre-wrap;
    transform: translate(-50%, -5px) scale(0.5);
  }

  /* Tooltip arrow */
  [data-tooltip]:after {
    content: '';
    border-style: solid;
    border-width: 5px 5px 0px 5px; /* CSS triangle */
    border-color: rgba(55, 64, 70, 0.9) transparent transparent transparent;
    transition-duration: 0s; /* If the mouse leaves the element, 
                                the transition effects for the 
                                tooltip arrow are "turned off" */
    transform-origin: top;   /* Orientation setting for the
                                slide-down effect */
    transform: translateX(-50%) scaleY(0);
  }

  /* Tooltip becomes visible at hover */
  [data-tooltip]:hover:before,
  [data-tooltip]:hover:after {
    visibility: visible;
    opacity: 1;
  }
  /* Scales from 0.5 to 1 -> grow effect */
  [data-tooltip]:hover:before {
    transition-delay: 0.3s;
    transform: translate(-50%, -5px) scale(1);
  }
  /* 
    Arrow slide down effect only on mouseenter (NOT on mouseleave)
  */
  [data-tooltip]:hover:after {
    transition-delay: 0.5s; /* Starting after the grow effect */
    transition-duration: 0.2s;
    transform: translateX(-50%) scaleY(1);
  }
  /*
    That's it for the basic tooltip.

    If you want some adjustability
    here are some orientation settings you can use:
  */

  /* LEFT */
  /* Tooltip + arrow */
  [data-tooltip-location="left"]:before,
  [data-tooltip-location="left"]:after {
    left: auto;
    right: calc(100% + 5px);
    bottom: 50%;
  }

  /* Tooltip */
  [data-tooltip-location="left"]:before {
    transform: translate(-5px, 50%) scale(0.5);
  }
  [data-tooltip-location="left"]:hover:before {
    transform: translate(-5px, 50%) scale(1);
  }

  /* Arrow */
  [data-tooltip-location="left"]:after {
    border-width: 5px 0px 5px 5px;
    border-color: transparent transparent transparent rgba(55, 64, 70, 0.9);
    transform-origin: left;
    transform: translateY(50%) scaleX(0);
  }
  [data-tooltip-location="left"]:hover:after {
    transform: translateY(50%) scaleX(1);
  }



  /* RIGHT */
  [data-tooltip-location="right"]:before,
  [data-tooltip-location="right"]:after {
    left: calc(100% + 5px);
    bottom: 50%;
  }

  [data-tooltip-location="right"]:before {
    transform: translate(5px, 50%) scale(0.5);
  }
  [data-tooltip-location="right"]:hover:before {
    transform: translate(5px, 50%) scale(1);
  }

  [data-tooltip-location="right"]:after {
    border-width: 5px 5px 5px 0px;
    border-color: transparent rgba(55, 64, 70, 0.9) transparent transparent;
    transform-origin: right;
    transform: translateY(50%) scaleX(0);
  }
  [data-tooltip-location="right"]:hover:after {
    transform: translateY(50%) scaleX(1);
  }

  /* BOTTOM */
  [data-tooltip-location="bottom"]:before,
  [data-tooltip-location="bottom"]:after {
    top: calc(100% + 5px);
    bottom: auto;
  }

  [data-tooltip-location="bottom"]:before {
    transform: translate(-50%, 5px) scale(0.5);
  }
  [data-tooltip-location="bottom"]:hover:before {
    transform: translate(-50%, 5px) scale(1);
  }

  [data-tooltip-location="bottom"]:after {
    border-width: 0px 5px 5px 5px;
    border-color: transparent transparent rgba(55, 64, 70, 0.9) transparent;
    transform-origin: bottom;
  }

  .tooltip {
    cursor: pointer;
    text-align: center;
    border: none;
    border-radius: 4px;
    outline: inherit;
    text-decoration: none;
    font-family: Roboto, sans-serif;
    font-size: 0.7em;
    /* background-color: rgba(174, 184, 192, 0.55); */
    background-color: transparent;
    color: white;

    -webkit-appearance: none;
    -moz-appearance: none;
    transition: background 350ms ease-in-out, 
                transform 150ms ease;
  }
  .tooltip:hover {
    /* background-color: #484f56; */
    background-color: transparent;
  }
  .tooltip:active {
    transform: scale(0.98);
  }
  .tooltip:focus {
    box-shadow: 0 0 2px 2px #298bcf;
  }
  .tooltip::-moz-focus-inner {
    border: 0;
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

.addCRFDh3 {
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

.addCRF-hr {
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
