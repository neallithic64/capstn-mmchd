<template>
  <div id="viewCRF" class="viewCRFDCbody">
    <!--Top Bar of the screen-->
    <TopNav />
    <div ref="content" class="viewCRF-container">
      <div class="viewCRF-details" style="align-text: left">
        <div class="CRFnumbers">
          <h1 class="viewCRFDCh1" style="margin: -10px 0">Case No. {{ formData.cases.caseID }}</h1>
           <h2 class="viewCRFDCh2" style="margin-top: -1px">
            Patient No. <a :href="'/viewPatient?patientID=' + formData.patient.patientID" class="patientlink"> {{ formData.patient.patientID }} </a>
          </h2>
        </div>
        <div class="CRFstatus" style="align-text: right">
          <span style="display: inline-flex; align-items: center"
            >Case Classification:&nbsp;
            <div v-show="!editStatus" class="CRFActionButtons">
              <h1 class="viewCRFDCh1" style="line-height: 1; align-items: center">
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
          <p>DRU City: <b class="viewCRFDChr"> {{DRUData.druCity}} </b></p>
          <p>DRU Name: <b class="viewCRFDChr"> {{DRUData.druName}} </b></p>
          <p>DRU Type: <b class="viewCRFDChr"> {{DRUData.druType}} </b></p>
          <p>DRU Address: <b class="viewCRFDChr"> {{DRUData.druCity + ", " + DRUData.druBrgy + ", " + DRUData.druHouseStreet}} </b></p>
        </div>
        <div class="CRFstatus" style="align-text: right">
          <p>Week No: <b class="viewCRFDChr"> {{ CRFData.year }}-{{ CRFData.week }} </b> </p>
          <p>Reported Date: <b class="viewCRFDChr">{{ formData.cases.reportDate }}</b></p>
          <p>Last Updated: <b class="viewCRFDChr">{{ dateLastUpdated }}</b></p>
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

        <form v-if="pageNum == 1 || isPrint" id="cholera1" type="submit">
            <div id="case-report-form" class="center">
              <div style="display:flex; flex-direction:row; justify-content: space-between;">
                <h2 id="addCRFD-formHeader">
                  {{ Object.values(disease.formNames)[pageNum] }}
                </h2>
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
        <hr v-if="isPrint" class="viewCRFDChr"/>

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
        <hr v-if="isPrint" class="viewCRFDChr"/>

        <form v-if="pageNum == 3 || isPrint" id="cholera3" type="submit">
          <div id="case-investigation-form" class="center">
            <h2 id="form-header" class="viewCRFDCh2" style="display: inline-flex;">
              {{ Object.values(disease.formNames)[pageNum] }}
              <ul
                v-show="!isPrint && !editLab && !editOutcome"
                class="CRFEdit"
                @click="editOutcome=true"
              >
                <img src="~/assets/img/pen.png" />
              </ul>
            </h2>

            <div class="field-row">
              <div class="field">
                <label class="required"> Please select the outcome </label>
                <div style="display: inline-flex; flex-display: row; margin-right: 50px;">
                  <div style="display: inline-flex; align-items: center; margin-right: 30px;">
                    <input
                      id="Alive"
                      v-model="newOutcome.outcome"
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
                      v-model="newOutcome.outcome"
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

                <div v-if="newOutcome.outcome == 'Dead'" class="field-row-straight">
                  <div class="field" style="margin-left: 95px">
                    <label for="dateDied" class="required"> Date died </label>
                    <input
                      id="dateDied"
                      v-model="newOutcome.dateDied"
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
                  v-model="newOutcome.finalDiagnosis"
                  class="input-form-field"
                  style="width: 50%"
                  type="text"
                  :disabled="inputEdit()"
                  :class="isRequired()"
                  required
                />
              </div>
            </div>
            <div v-show="editOutcome" style="margin: -10px 10 5px; margin-left: auto;text-align: -webkit-right;">
              <button class="back-button" type="button" @click="editPatientOutcome('cancel')">
                Cancel </button>
              <button class="next-button" type="button" @click="editPatientOutcome('save')">
                Save </button>
            </div>
          </div>
        </form>
        <hr v-if="isPrint" class="viewCRFDChr"/>

        <form v-if="pageNum == 4 || isPrint" id="cholera4" type="submit">
          <div id="case-investigation-form" class="center">
            <h2 id="form-header" class="viewCRFDCh2" style="display: inline-flex;">
              {{ Object.values(disease.formNames)[pageNum] }}
              <!-- ADD this in ul v-show below: 
                && $auth.user.userID === formData.cases.investigatorLab -->
              <ul
                v-show="!isPrint && !editLab && !editOutcome"
                class="CRFEdit"
                @click="editLab=true"
              >
                <img src="~/assets/img/pen.png" />
              </ul>
            </h2>

            <div class="vaccine-field field">
                <label class="required" style="margin-right: 50px">
                  Do you have the lab result?
                </label>
                <div style="display: inline-flex; flex-direction: row">
                  <div class="center-center">
                    <input
                      id="noLabTest"
                      v-model="newLabData.labTestStatus"
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
                      v-model="newLabData.labTestStatus"
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
                      v-model="newLabData.labTestStatus"
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

              <div v-show="newLabData.labTestStatus==='No'">
                <div class="name-field" style="width:50%">
                  <label for="investigatorLab" class="required"> Choose Lab to forward the case to </label>
                  <select id="investigatorLab" 
                      v-model="newLabData.investigatorLab" 
                      name="investigatorLab" 
                      :disabled="inputEdit()"
                      class="input-form-field "
                      :class="isRequired()"
                      required>
                    <option v-for="(lab, i) in labList" :key=i :value=lab.userID> {{ lab.druName }} </option>
                  </select>
                </div>
              </div>

              <div v-show="newLabData.labTestStatus==='Yes'" style="margin-left:7px;">
                <div class="field-row-straight" style="display: inline-flex; flex-direction: row">
                  <div style="width:30%" class="field">
                    <label for="labTestType" class="required">
                      Lab Test done
                    </label>
                    <select
                      id="labTestType"
                      v-model="newLabData.labTestType"
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
                      v-model="newLabData.labTestCollectDate"
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
                      v-model="newLabData.labTestResult"
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

            <div v-show="editLab" style="margin: -10px 10 5px; margin-left: auto;text-align: -webkit-right;">
              <button class="back-button" type="button" @click="editLabResult('cancel')">
                Cancel </button>
              <button class="next-button" type="button" @click="editLabResult('save')">
                Save </button>
            </div>

          </div>
        </form>
        <hr v-if="isPrint" class="viewCRFDChr"/>

        <form v-if="pageNum == 5 || isPrint" id="cholera5" type="submit">
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
            <h2 id="form-header" class="viewCRFDCh2 required">
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
      editOutcome: false,
      editOutcomeValidate: true,
      newOutcome: {},
      editLab: false,
      editLabValidate:true,
      editStatus:false,
      weekNo: '2021-20',
      labList: [],
      newStatus:'',
      hasLabTest:'',
      isDisabled: false,
      editCase: false,
      isPrint: false,
      diseaseID: 'DI-0000000000000',
      caseDefs: [],
      pageNum: 1,
      formPart: 'cholera0',
      dateLastUpdated:'',
      newLabData: {
        // labTestStatus : '',
        // investigatorLab : '', // formadata.cases, the rest in caseData
        // labTestType : '',
        // labTestCollectDate : '',
        // labTestResult : '',
      },
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
      caseHistory: [],
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
        druBrgy:'',
        druHouseStreet:''
      },
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
        MCVaccine: '',
        vitA: '',
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
      rowData: {
        caseID: 1234,
        disease: 'Cholera',
        city: 'Manila',
        patientNo: '123',
        submittedDate: '2020-10-10',
        updatedDate: '2020-10-10',
        status: 'IDK',
      },
    }
  },
  async fetch() {
    const data = (await axios.get('http://localhost:8080/api/getCRF?caseID=' + this.$route.query.caseID)).data;
    this.formData.cases = data.cases;
    this.formData.caseData = data.caseData;
    this.formData.patient = data.patient;
    this.formData.riskFactors = data.riskFactors; // working already
    this.DRUData = data.DRUData;
    this.CRFData = data.crfData;
    this.dateLastUpdated = data.dateLastUpdated;
    this.caseHistory = data.caseHistory;
	if ((!['Chief', 'Staff', 'resuHead', 'chdDirector'].some(e => this.$auth.user.userType.includes(e)) && !this.DRUData.pushDataAccept) ||
	    (this.$auth.user.druName !== this.DRUData.druName)) {
	  this.formData.patient.firstName = "";
	  this.formData.patient.midName = "";
	  this.formData.patient.lastName = "";
	  this.formData.patient.currHouseStreet = "";
	  this.formData.patient.permHouseStreet = "";
	}
    this.editLabResult('cancel')
    this.editPatientOutcome('cancel')
    
    // fixing dates

    let rows = (await axios.get('http://localhost:8080/api/getLabUsers')).data;
    this.labList = rows;

    // console.log(data);

    this.newOutcome = {
      outcome: this.formData.caseData.outcome,
      dateDied: this.formData.cases.dateDied,
      finalDiagnosis: this.formData.cases.finalDiagnosis,
    }

    this.newLabData = {
      labTestStatus: this.formData.caseData.labTestStatus,
      investigatorLab: this.formData.cases.investigatorLab,
      labTestType: this.formData.caseData.labTestType,
      labTestCollectDate: this.formData.caseData.labTestCollectDate,
      labTestResult: this.formData.caseData.labTestResult,
    }
    
  },
  head() {
    return {
      title: 'Cholera ' + this.formData.cases.caseID
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
      // this.$auth.user.userID === this.formData.cases.investigatorLab
      if (this.pageNum === 6 && this.editLab) return false;
      else if (this.pageNum === 5 && this.editOutcome) return false;
      else return true;
    },
    isRequired() {
      if (!this.editLabValidate) return "input-required"
      else if (!this.editOutcomeValidate) return "input-required"
    },
    statusInputEdit(value) {
      if (this.editStatus & value!==this.formData.cases.caseLevel ) return false
      else return true
    },
    popup() {
      this.editStatus = !this.editStatus
    },
    validateOutcome() {
      this.editOutcomeValidate = false;
      if (this.newOutcome.outcome!=='' && this.newOutcome.finalDiagnosis!=='' && this.newOutcome.finalDiagnosis!==null) {
        if (this.newOutcome.outcome==='Alive' ||
            (this.newOutcome.outcome==='Dead' &&
            this.newOutcome.dateDied!=='' && this.newOutcome.dateDied!==undefined))
          this.editOutcomeValidate = true;
        else this.editOutcomeValidate = false;
      }
      else this.editOutcomeValidate = false;
    },
    async editPatientOutcome(change) {
      if (change==='save') {
        this.validateOutcome();
        if (this.editOutcomeValidate) {
          this.formData.caseData.outcome = this.newOutcome.outcome;
          this.formData.caseData.dateDied = this.newOutcome.dateDied;
          this.formData.caseData.finalDiagnosis = this.newOutcome.finalDiagnosis;
          
          const serve = await axios.post("http://localhost:8080/api/editPatientOutcome", {
            caseID: this.formData.cases.caseID,
            newOutcome: this.newOutcome,
            submitted: this.$auth.user.userID
          });

          if (serve.status === 200) {
            this.$toast.success('Case updated!', {duration: 4000, icon: 'check_circle'});
          } else {
            // eslint-disable-next-line no-console
            console.log(serve);
            this.$toast.error('Something went wrong!', {duration: 4000, icon: 'error'});
          }
          this.editOutcome = false;
        }
        else {
          alert('Please fill up the required fields');
          this.$forceUpdate();
        }
      }
      if (change==='cancel') {
        this.newOutcome.outcome = this.formData.caseData.outcome;
        this.newOutcome.dateDied = this.formData.caseData.dateDied;
        this.newOutcome.finalDiagnosis = this.formData.caseData.finalDiagnosis;
        
        this.editOutcome = false;
      }
    },
    validateLab() {
      this.editLabValidate = false;
      if (this.newLabData.labTestStatus!=='') {
        if (this.newLabData.labTestStatus==='Processing')
            this.editLabValidate = true;
        else if (this.newLabData.labTestStatus==='No' && 
                this.formData.cases.investigatorLab!=='' && 
                this.formData.cases.investigatorLab!==undefined)
            this.editLabValidate = true;
        else if(this.newLabData.labTestStatus==='Yes' &&
                this.newLabData.labTestType!== '' && 
                this.newLabData.labTestResult!== '' && 
                this.newLabData.labTestCollectDate!== '' && 
                this.newLabData.labTestType!== undefined && 
                this.newLabData.labTestResult!== undefined && 
                this.newLabData.labTestCollectDate!== undefined)
            this.editLabValidate = true;
        else this.editLabValidate = false;
        }
      else this.editLabValidate = false;
    },
    async editLabResult(change) {
      if (change==='save') {
        this.validateLab();
        if (this.editLabValidate) {
          this.hasLabTest = this.newLabData.hasLabTest;

          this.formData.caseData.labTestStatus = this.newLabData.labTestStatus
          this.formData.cases.investigatorLab = this.newLabData.investigatorLab
          this.formData.caseData.labTestType = this.newLabData.labTestType
          this.formData.caseData.labTestCollectDate = this.newLabData.labTestCollectDate
          this.formData.caseData.labTestResult = this.newLabData.labTestResult
          
          const serve = (await axios.post("http://localhost:8080/api/editCIFLab", {
            caseID: this.formData.cases.caseID,
            newLabData: this.newLabData,
            submitted: this.$auth.user.userID
          }));
          
          if (serve.status === 200) {
            this.$toast.success('Case updated!', {duration: 4000, icon: 'check_circle'});
          } else {
            // eslint-disable-next-line no-console
            console.log(serve);
            this.$toast.error('Something went wrong!', {duration: 4000, icon: 'error'});
          }
          this.editLab = false;
        }
        else {
          alert('Please fill up the required fields');
          this.$forceUpdate();
        }
      }
      if (change==='cancel') {

        this.newLabData.hasLabTest = this.hasLabTest
        this.newLabData.labTestStatus = this.formData.caseData.labTestStatus
        this.newLabData.investigatorLab = this.formData.cases.investigatorLab
        this.newLabData.labTestType = this.formData.caseData.labTestType
        this.newLabData.labTestCollectDate = this.formData.caseData.labTestCollectDate
        this.newLabData.labTestResult = this.formData.caseData.labTestResult
        
        this.editLab = false;
      }
    },
    async status(change) {
      if (change==='save') {
        this.formData.caseData.finalClassification = this.newStatus;
        this.formData.cases.caseLevel = this.newStatus;
        const result = await axios.post('http://localhost:8080/api/updateCaseStatus', {
          caseId: this.formData.cases.caseID,
          newStatus: this.newStatus
        });
        console.log(result);
        if (result.status === 200) {
          // alert('CRF case status updated!');
          if(result.data.outbreakID){
            if(result.data.type === 'Alert'){
              window.open('http://localhost:3000/alertOutbreak?outbreakID='+ result.data.outbreakID)
            } else
              window.open('http://localhost:3000/epiOutbreak?outbreakID='+ result.data.outbreakID);
          }
          location.reload();
          this.$toast.success('Case Status updated!', {duration: 4000, icon: 'check_circle'});
        } else {
          // eslint-disable-next-line no-console
          console.log(result);
          this.$toast.error('Something went wrong!', {duration: 4000, icon: 'error'});
        }
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

.input-required:invalid { 
    box-shadow: 0 0 5px #d45252;
    border-color: hsl(0, 76%, 50%);
    /* background-color: #ff6961; */
}

.input-required{
  border-color: hsl(0, 76%, 50%);
}

.viewCRFDCbody {
  font-family: 'Work Sans', sans-serif;
  font-weight: 300;
  padding: 0px;
  margin: 0px;
  background-image: none;
}

.viewCRFDCh3 {
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
@media only screen and (max-width: 900px) {
  .viewCRF-details {
    flex-direction: column;
  }
}
.CRFnumbers,
.CRFstatus {
  display: inline-flex;
  flex-direction: column;
}

.viewCRFDCh1 {
  color: #008d41;
  font-size: 40px;
  font-weight: 800;
}

.viewCRFDCh2 {
  color: #346083;
  font-size: 25px;
  font-weight: 600;
}

.viewCRFDCb {
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


.overlay {
  display: block;
  z-index: 11;
  margin: 0px;
  padding: 10% 30% 20%;
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

@media only screen and (max-width:1000px) {
  .overlay  {
    padding: 20% 15%;
  }
}

.overlay-form {
  padding: 30px;
  border-radius: 40px;
  background: white;
  /* width: -webkit-fill-available;
  height: -webkit-fill-available; */
  overflow-y: auto;
  box-shadow: 1px 4px 8px rgb(0 0 0 / 40%);
}

</style>
