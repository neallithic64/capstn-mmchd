<template>
  <div id="viewCIF" class="viewCIFbody">
    <!--Top Bar of the screen-->
    <TopNav />
    <div ref="content" class="viewCIF-container">
      <div class="viewCIF-details" style="align-text: left">
        <div class="CIFnumbers">
          <h1 class="viewCIFh1" style="margin: -10px 0">Case No. {{ formData.cases.caseID }}</h1>
          <h2 class="viewCIFh2" style="margin-top: -1px">
            Patient No. <a :href="'/viewPatient?patientID=' + formData.patient.patientID" class="patientlink"> {{ formData.patient.patientID }} </a>
          </h2>
        </div>
        <div class="CIFstatus" style="align-text: right">
          <span style="display: inline-flex; align-items: center"
            >Case Status:&nbsp;
            <div v-show="!editStatus" class="CIFActionButtons">
              <h1 class="viewCIFh1" style="line-height: 1; align-items: center">
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
          <p>DRU City: <b class="viewCIFb">{{ DRUData.druCity }}</b></p>
          <p>DRU Name: <b class="viewCIFb"> {{ DRUData.druName }} </b></p>
          <p>DRU Type: <b class="viewCIFb"> {{ DRUData.druType }} </b></p>
          <p>DRU Address: <b class="viewCIFb"> {{ DRUData.druAddress }} </b></p>
        </div>
        <div class="CIFstatus" style="align-text: right">
          
          <p>Reported Date: <b>{{ formData.cases.reportDate }}</b></p>
          <p>Last Updated: <b>{{ dateLastUpdated }}</b></p>
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
        <form v-if="pageNum == 1 || isPrint" id="Rabies1" type="submit">
            <div id="case-investigation-form" class="center">
              <div style="display:flex; flex-direction:row; justify-content: space-between;">
                <h2 id="addCIF-formHeader">
                  {{ Object.values(disease.formNames)[pageNum] }}
                </h2>
              </div>

              <div class="field-row-straight">
                <div class="name-field">
                  <label for="lastname" class="required"> Last Name </label>
                  <input
                    id="lastname"
                    v-model="formData.patient.lastName"
                    class="input-form-field"
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
                    class="input-form-field"
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
                    class="input-form-field"
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
                      class="input-form-field"
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
                      class="input-form-field"
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
                    class="input-form-field"
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
                    class="input-form-field"
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
              </div>

              <hr class="addCIFhr"/>

              <div class="field-row">
                <div class="field">
                  <label for="occuStreet" class="required"> Occupation Address: Street / House No. </label>
                  <input
                    id="occuStreet"
                    v-model="formData.patient.occuStreet"
                    class="input-form-field"
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
                    class="input-form-field"
                    :class="isRequired()" 
                    required
                    @change="getLocBrgyList(formData.patient.occuCity, 'occuBarangay')">
                    <option v-for="(city, i) in cityList" :key=i>{{city}}</option>
                  </select>
                </div>
                <div class="field">
                  <label for="occuBarangay" class="required"> Barangay </label>
                  <select
                    id="occuBarangay"
                    v-model="formData.patient.occuBrgy"
                    class="input-form-field"
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
                    v-model="formData.patient.currHouseStreet"
                    class="input-form-field"
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
                    class="input-form-field"
                    :class="isRequired()" 
                    required
                    @change="getLocBrgyList(formData.patient.currCity, 'currBarangay')"
                    >
                    <option v-for="(city, i) in cityList" :key=i>{{city}}</option>
                  </select>
                </div>
                <div class="field">
                  <label for="currBarangay" class="required"> Barangay </label>
                  <select
                    id="currBarangay"
                    v-model="formData.patient.currBrgy"
                    class="input-form-field"
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
                    class="input-form-field"
                    name="permCity"
                    :disabled="inputEdit()"
					@change="getLocBrgyList(formData.patient.permCity, 'permBarangay')"
                  >
                  <option v-for="(city, i) in cityList" :key=i>{{city}}</option>
                  </select>
                </div>
                <div class="field">
                  <label for="permBarangay"> Barangay </label>
                  <select
                    id="permBarangay"
                    v-model="formData.patient.permBrgy"
                    class="input-form-field"
                    name="permBarangay"
                    :disabled="inputEdit()"
                  >
                  </select>
                </div>
              </div>

              <hr class="addCIFhr"/>

              <div class="field-row-straight">
                <div class="field">
                  <label for="district" class="required"> District </label>
                  <input
                    id="district"
                    v-model="formData.patient.district"
                    class="input-form-field"
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
                <div class="field">
                  <label for="ILHZ" class="required"> ILHZ </label>
                  <input
                    id="ILHZ"
                    v-model="formData.patient.ILHZ"
                    class="input-form-field"
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                    required
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
                    class="input-form-field"
                    :class="isRequired()"
                    type="number"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
              </div>
            </div>
          </form>
        <hr v-if="isPrint" class="viewCIFhr"/>

        <form v-if="pageNum == 2 || isPrint" id="Rabies2" type="submit">
            <div id="case-investigation-form" class="center">
              <h2 id="addCIF-formHeader"> {{ Object.values(disease.formNames)[pageNum] }} </h2>

              <div class="field-row">
                <div class="sixtyDesk" style="display: inline-flex; flex-direction: row">
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
                        :class="isRequired()"
                        required
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
                        :class="isRequired()"
                        required
                      />
                      <label for="noAdmitted"> No </label>
                    </div>
                  </div>
                  <div class="dateAdmitted-field field">
                    <label for="dateAdmitted" class="required">
                      Date Onset of Illness
                    </label>
                    <input
                      id="dateAdmitted"
                      v-model="formData.cases.dateOnset"
                      :max="today"
                      class="input-form-field"
                      :class="isRequired()"
                      type="date"
                      :disabled="inputEdit()"
                      required
                    />
                  </div>
                  <div v-if="formData.caseData.patientAdmitted=='Yes'" class="dateAdmitted-field field">
                    <label for="dateAdmitted" class="required">
                      Date Admitted / Seen
                    </label>
                    <input
                      id="dateAdmitted"
                      v-model="formData.cases.dateAdmitted"
                      :max="today"
                      class="input-form-field"
                      :class="isRequired()"
                      type="date"
                      :disabled="inputEdit()"
                      required
                    />
                  </div>
                </div>
              </div>

              <div class="field-row-straight">
                <div class="field">
                  <label for="reportDate" class="required">
                    Date of Report
                  </label>
                  <input
                    id="reportDate"
                    v-model="formData.cases.reportDate"
                    :max="today"
                    class="input-form-field"
                    :class="isRequired()"
                    type="date"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
                <div class="field">
                  <label for="reporter" class="required"> Name of Reporter </label>
                  <input
                    id="reporter"
                    v-model="formData.cases.reporterName"
                    class="input-form-field"
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
                <div class="field">
                  <label for="reporterNum" class="required">
                    Contact No.
                  </label>
                  <input
                    id="reporterNum"
                    v-model="formData.cases.reporterContact"
                    class="input-form-field"
                    :class="isRequired()"
                    type="number"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
              </div>

              <div class="field-row-straight">
                <div class="field">
                  <label for="investigateDate" class="required">
                    Date of Investigation
                  </label>
                  <input
                    id="investigateDate"
                    v-model="formData.cases.investigateDate"
                    :max="today"
                    class="input-form-field"
                    :class="isRequired()"
                    type="date"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
                <div class="field">
                  <label for="investigatorName" class="required"> Name of Investigator </label>
                  <input
                    id="investigatorName"
                    v-model="formData.cases.investigatorName"
                    class="input-form-field"
                    :class="isRequired()"
                    type="text"
                    :disabled="inputEdit()"
                    required
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
                    :class="isRequired()"
                    type="number"
                    :disabled="inputEdit()"
                    required
                  />
                </div>
              </div>

            </div>

            <hr class="addCIFhr"/>

            <div id="case-investigation-form" class="center">
              <div style="display: flex; flex-direction: row;">
                <h2 id="addCIF-formHeader">Risk Factors</h2>
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
                        <h3 class="required addCIFh3">Lifestyle:</h3>
                        <div style="flex-direction: column; align-items: center">

                          <div style="display: flex; align-items: center;">
                            <input
                              id="LNone"
                              v-model="formData.riskFactors.Lifestyle"
                              value="LNone"
                              name="riskFactorsL"
                              type="checkbox"
                              class="input-radio"
                              :disabled="inputEdit()"
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
                        <h3 class="required addCIFh3">Current Health Conditions:</h3>
                        <div style="flex-direction: column; align-items: center">

                          <div style="display: flex; align-items: center;">
                            <input
                              id="CNone"
                              v-model="formData.riskFactors.CurrentCondition"
                              value="CNone"
                              name="riskFactorsC"
                              type="checkbox"
                              class="input-radio"
                              :disabled="inputEdit()"
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
                        <h3 class="required addCIFh3">Historical Health Data:</h3>
                        <div style="flex-direction: column; align-items: center">

                          <div style="display: flex; align-items: center;">
                            <input
                              id="HNone"
                              v-model="formData.riskFactors.Historical"
                              value="HNone"
                              name="riskFactorsH"
                              type="checkbox"
                              class="input-radio"
                              :disabled="inputEdit()"
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
                      <h3 class="required addCIFh3">Other Risks:</h3>
                      <div style="display:inline-flex; flex-direction:row">
                        <div class="otherRisk" style="margin-right: 10px;">

                          <div style="display: flex; align-items: center;">
                            <input
                              id="ONone"
                              v-model="formData.riskFactors.Other"
                              value="ONone"
                              name="riskFactorsO"
                              type="checkbox"
                              class="input-radio"
                              :disabled="inputEdit()"
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
        <hr v-if="isPrint" class="viewCIFhr"/>

        <form v-if="pageNum == 3 || isPrint" id="Rabies3" type="submit">
            <div id="case-investigation-form" class="center">
              <h2 id="addCIF-formHeader">
                {{ Object.values(disease.formNames)[pageNum] }}
              </h2>
            </div>
            <div class="field-row" style="margin-bottom: -1 px; display: block;">
                <div class="field">
                  <label class="required"> <b style="font-size: 15px;"> Type of Exposure </b> </label>
                  <div style="margin-left: 5px; display:flex; flex-direction:column;">
                    <div class="symptoms-half" style="display: inline-flex; flex-direction:row;">
                      <div class="checkbox-options" style="display: inline-flex; margin-right: 25px;">
                        <input
                          id="exposureBite"
                          v-model="formData.caseData.exposure"
                          value="Bite"
                          class="input-checkbox"
                          name="exposure"
                          type="checkbox"
                          :class="isRequired()"
                          :disabled="inputEdit()"
                          required
                        />
                        <label for="exposureBite"> Bite </label>
                      </div>

                      <div class="checkbox-options" style="display: inline-flex; margin-right: 25px;">
                        <input
                          id="exposureScratch"
                          v-model="formData.caseData.exposure"
                          value="Scratch"
                          class="input-checkbox"
                          name="exposure"
                          type="checkbox"
                          :class="isRequired()"
                          :disabled="inputEdit()"
                          required
                        />
                        <label for="exposureScratch"> Scratch </label>
                      </div>

                      <div class="checkbox-options">
                        <label for="exposureAffectedSite">
                        Affected Site
                        <input
                            id="exposureAffectedSite"
                            v-model="formData.caseData.exposureAffectedSite"
                            class="input-form-field"
                            type="text"
                            style="width: 125px; height: 19px; margin: 0 2px"
                            :disabled="inputEdit()"
                        />
                        </label>
                      </div>
                    </div>
                    <div class="symptoms-half" style="display: inline-flex; flex-direction:row;">
                      <div class="checkbox-options" style="display: inline-flex; margin-right: 25px;">
                        <input
                          id="exposureSaliva"
                          v-model="formData.caseData.exposure"
                          value="Saliva"
                          class="input-checkbox"
                          name="exposure"
                          type="checkbox"
                          :class="isRequired()"
                          :disabled="inputEdit()"
                          required
                        />
                        <label for="exposureSaliva"> Saliva </label>
                      </div>

                      <div class="checkbox-options" style="display: inline-flex; margin-right: 25px;">
                        <input
                          id="exposureConsumedMeat"
                          v-model="formData.caseData.exposure"
                          value="Consumed Meat"
                          class="input-checkbox"
                          name="exposure"
                          type="checkbox"
                          :class="isRequired()"
                          :disabled="inputEdit()"
                          required
                        />
                        <label for="exposureConsumedMeat"> Consumed Meat </label>
                      </div>

                      <div class="checkbox-options" style="display: inline-flex; margin-right: 25px;">
                        <input
                          id="exposureUnknown"
                          v-model="formData.caseData.exposure"
                          value="Unknown"
                          class="input-checkbox"
                          name="exposure"
                          type="checkbox"
                          :class="isRequired()"
                          :disabled="inputEdit()"
                          required
                        />
                        <label for="exposureUnknown"> Unknown </label>
                      </div>

                      <div class="checkbox-options">
                        <input
                          id="exposureOthers"
                          value="exposureOthers"
                          class="input-checkbox"
                          name="exposureOthers"
                          type="checkbox"
                          :class="isRequired()"
                          :disabled="inputEdit()"
                        />
                        <label for="exposureOthers">
                          Others, specify
                            <input
                                id="exposureOthers"
                                v-model="formData.caseData.exposureOthers"
                                class="input-form-field"
                                type="text"
                                style="width: 175px; height: 19px; margin: 0 2px"
                                :disabled="inputEdit()"
                            />
                        </label>
                      </div>
                    </div>
                    <div class="symptoms-half" style="display: inline-flex; flex-direction:row;">
                      <div class="checkbox-options" style="display: inline-flex; margin-right: 55px;">
                        <label for="exposeDate" style=" margin-left: 5px;">
                            Date of Exposure:
                            <input
                                id="exposeDate"
                                v-model="formData.caseData.exposeDate"
                                :max="today"
                                class="input-form-field"
                                type="date"
                                style="width: 175px; height: 19px; margin: 0 2px" 
                                :class="isRequired()"
                                :disabled="inputEdit()"
                                required
                            />
                        </label>
                      </div>

                      <div class="checkbox-options" style="display: inline-flex">
                        <label for="exposePlace">
                            Place of Exposure:
                            <input
                                id="exposePlace"
                                v-model="formData.caseData.exposePlace"
                                class="input-form-field"
                                type="text"
                                style="width: 175px; height: 19px; margin: 0 2px"
                                :class="isRequired()"
                                :disabled="inputEdit()"
                                required
                            />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="field" style="display: block">
                  <label class="required"> <b style="font-size: 15px;"> Category of Exposure: </b> </label>
                  <div style="flex-direction: column; align-items: center; margin-left: 5px;">
                    <div v-for="(category, i) in categoryExposure" :key="i" style="display: flex; flex-direction: row; align-items: center;">
                      <input
                        :id="category"
                        v-model="formData.caseData.categoryExposure[i]"
                        :value="category"
                        class="input-radio"
                        name="categoryExposure"
                        type="checkbox"
                        :disabled="inputEdit()"
                        :class="isRequired()"
                        style="margin-bottom: auto; margin-top: 3px;"
                        required
                      />
                      <label :for="category" style="display: inline-flex">
                        {{ category }}
                      </label>
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label> <b style="font-size: 15px;"> Others </b> </label>
                  <div style="margin-left:5px;">
                    <div class="symptoms-half" style="display: inline-flex; flex-direction:row;">
                      <label class="required" style="width:150px">Type of Animal</label>
                      <div class="checkbox-options" style="display: inline-flex; margin-right: 25px;">
                        <input
                          id="exposeAnimalDog"
                          v-model="formData.caseData.exposeAnimal"
                          value="Dog"
                          class="input-checkbox"
                          name="exposeAnimal"
                          type="radio"
                          :class="isRequired()"
                          :disabled="inputEdit()"
                          required
                        />
                        <label for="exposeAnimalDog"> Dog </label>
                      </div>

                      <div class="checkbox-options" style="display: inline-flex; margin-right: 25px;">
                        <input
                          id="exposeAnimalCat"
                          v-model="formData.caseData.exposeAnimal"
                          value="Cat"
                          class="input-checkbox"
                          name="exposeAnimal"
                          type="radio"
                          :class="isRequired()"
                          :disabled="inputEdit()"
                          required
                        />
                        <label for="exposeAnimalCat"> Cat </label>
                      </div>

                      <div class="checkbox-options" style="display: inline-flex; margin-right: 25px;">
                        <input
                          id="exposeAnimalBat"
                          v-model="formData.caseData.exposeAnimal"
                          value="Bat"
                          class="input-checkbox"
                          name="exposeAnimal"
                          type="radio"
                          :class="isRequired()"
                          :disabled="inputEdit()"
                          required
                        />
                        <label for="exposeAnimalBat"> Bat </label>
                      </div>

                      <div class="checkbox-options">
                        <input
                          id="exposeAnimalOthers"
                          v-model="formData.caseData.exposeAnimal"
                          value="Others"
                          class="input-checkbox"
                          name="exposeAnimal"
                          type="radio"
                          :class="isRequired()"
                          :disabled="inputEdit()"
                          required
                        />
                        <label for="exposeAnimalOthers">
                          Others, specify
                            <input
                                id="exposeAnimalOthers"
                                v-model="formData.caseData.exposeAnimalOthers"
                                class="input-form-field"
                                type="text"
                                style="width: 175px; height: 19px; margin: 0 2px"
                                :disabled="inputEdit()"
                            />
                        </label>
                      </div>
                    </div>

                    <div class="symptoms-half" style="display: inline-flex; flex-direction:row;">
                      <label class="required" style="width:150px">Animal Status</label>
                      <div class="checkbox-options" style="display: inline-flex; margin-right: 25px;">
                        <input
                          id="exposeAnimalStatusDomestic"
                          v-model="formData.caseData.exposeAnimalStatus"
                          value="Domestic"
                          class="input-checkbox"
                          name="exposeAnimalStatus"
                          type="radio"
                          :class="isRequired()"
                          :disabled="inputEdit()"
                          required
                        />
                        <label for="exposeAnimalStatusDomestic"> Domestic </label>
                      </div>

                      <div class="checkbox-options" style="display: inline-flex; margin-right: 25px;">
                        <input
                          id="exposeAnimalStatusStray"
                          v-model="formData.caseData.exposeAnimalStatus"
                          value="Stray"
                          class="input-checkbox"
                          name="exposeAnimalStatus"
                          type="radio"
                          :class="isRequired()"
                          :disabled="inputEdit()"
                          required
                        />
                        <label for="exposeAnimalStatusStray"> Stray </label>
                      </div>

                      <div class="checkbox-options" style="display: inline-flex; margin-right: 25px;">
                        <input
                          id="exposeAnimalStatusWild"
                          v-model="formData.caseData.exposeAnimalStatus"
                          value="Wild"
                          class="input-checkbox"
                          name="exposeAnimalStatus"
                          type="radio"
                          :class="isRequired()"
                          :disabled="inputEdit()"
                          required
                        />
                        <label for="exposeAnimalStatusWild"> Wild </label>
                      </div>

                      <div class="checkbox-options">
                        <input
                          id="exposeAnimalStatusOthers"
                          v-model="formData.caseData.exposeAnimalStatus"
                          value="Others"
                          class="input-checkbox"
                          name="exposeAnimalStatus"
                          type="radio"
                          :class="isRequired()"
                          :disabled="inputEdit()"
                          required
                        />
                        <label for="exposeAnimalStatusOthers">
                          Others, specify
                            <input
                                id="exposeAnimalStatusOthers"
                                v-model="formData.caseData.exposeAnimalStatusOther"
                                class="input-form-field"
                                type="text"
                                style="width: 175px; height: 19px; margin: 0 2px"
                                :disabled="inputEdit()"
                            />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </form>
        <hr v-if="isPrint" class="viewCIFhr"/>

        <form v-if="pageNum == 4 || isPrint" id="Rabies4" type="submit">
            <div id="case-investigation-form" class="center">
              <h2 id="addCIF-formHeader">
                {{ Object.values(disease.formNames)[pageNum] }}
              </h2>

              <div>
                <div class="vaccine-field field vaccine-label" style="flex-direction: row;">
                    <label class="required" style="margin-right: 50px;flex-direction: row;">
                    Has the patient received Measles-Containing Vaccine (MCV)?
                    </label>
                    <div style="display: inline-flex; flex-direction: row">
                    <div class="center-center" style="margin-right: 25px;">
                        <input
                        id="vaccinationHistoryVaccinated"
                        v-model="formData.caseData.vaccinationHistory"
                        value="Vaccinated"
                        class="input-radio"
                        name="vaccinationHistoryVaccinated"
                        type="radio"
                        :disabled="inputEdit()"
                        :class="isRequired()"
                        required
                        />
                        <label for="vaccinationHistoryVaccinated"> Vaccinated </label>
                    </div>
                    <div class="center-center" style="margin-right: 25px;">
                        <input
                        id="vaccinationHistoryUnvaccinated"
                        v-model="formData.caseData.vaccinationHistory"
                        value="Unvaccinated"
                        class="input-radio"
                        name="vaccinationHistoryUnvaccinated"
                        type="radio"
                        :disabled="inputEdit()"
                        :class="isRequired()"
                        required
                        />
                        <label for="vaccinationHistoryUnvaccinated"> Unvaccinated </label>
                    </div>
                    <div class="center-center">
                        <input
                        id="vaccinationHistoryUnknown"
                        v-model="formData.caseData.vaccinationHistory"
                        value="Unknown"
                        class="input-radio"
                        name="vaccinationHistoryUnknown"
                        type="radio"
                        :disabled="inputEdit()"
                        :class="isRequired()"
                        required
                        />
                        <label for="vaccinationHistoryUnknown"> Unknown </label>
                    </div>
                    </div>
                </div>

                <div v-if="formData.caseData.vaccinationHistory==='Vaccinated'" style="padding-left: 7px">
                    <div class="field" style="display: inline-flex; flex-direction: row">
                        <label for="vaccineDateStart" class="required width300">
                            Date vaccine started:
                        </label>
                        <input
                            id="vaccineDateStart"
                            v-model="formData.caseData.vaccineDateStart"
                            :max="today"
                            class="input-form-field"
                            :class="isRequired()"
                            type="date"
                            style="width: 175px; height: 25px"
                            :disabled="inputEdit()"
                            required
                        />
                    </div>
                    <div class="field" style="display: inline-flex; flex-direction: row">
                        <label for="vaccineBrand" class="required width300">
                            Brand name of vaccine: 
                        </label>
                        <input
                            id="vaccineBrand"
                            v-model="formData.caseData.vaccineBrand"
                            class="input-form-field"
                            :class="isRequired()"
                            type="text"
                            style="width: 175px; height: 25px"
                            :disabled="inputEdit()"
                            required
                        />
                    </div>
                    <div class="vaccine-field field vaccine-label" style="flex-direction: row;">
                            <label class="required width300" for="routeAdmin">
                                Route of Administration?
                            </label>
                            <div style="display: inline-flex; flex-direction: row">
                                <div class="center-center margin-right25">
                                    <input
                                    id="routeAdminIM"
                                    v-model="formData.caseData.routeAdmin"
                                    value="IM"
                                    class="input-radio"
                                    name="routeAdmin"
                                    type="radio"
                                    :disabled="inputEdit()"
                                    :class="isRequired()"
                                    required
                                    />
                                    <label for="routeAdmin"> IM </label>
                                </div>
                                <div class="center-center margin-right25">
                                    <input
                                    id="routeAdminIntradermal"
                                    v-model="formData.caseData.routeAdmin"
                                    value="Intradermal"
                                    class="input-radio"
                                    name="routeAdminIntradermal"
                                    type="radio"
                                    :disabled="inputEdit()"
                                    :class="isRequired()"
                                    required
                                    />
                                    <label for="routeAdminIntradermal"> Intradermal </label>
                                </div>
                            </div>
                        </div>
                        <div class="vaccine-field field vaccine-label" style="flex-direction: row;">
                            <label class="required width300" for="postexpoure">
                                Post exposure completed?
                            </label>
                            <div style="display: inline-flex; flex-direction: row">
                                <div class="center-center margin-right25">
                                    <input
                                    id="postExposureYes"
                                    v-model="formData.caseData.postExposure"
                                    value="Yes"
                                    class="input-radio"
                                    name="postExposureYes"
                                    type="radio"
                                    :disabled="inputEdit()"
                                    :class="isRequired()"
                                    required
                                    />
                                    <label for="postExposureYes"> Yes </label>
                                </div>
                                <div class="center-center margin-right25">
                                    <input
                                    id="postExposureNo"
                                    v-model="formData.caseData.postExposure"
                                    value="No"
                                    class="input-radio"
                                    name="postExposureNo"
                                    type="radio"
                                    :disabled="inputEdit()"
                                    :class="isRequired()"
                                    required
                                    />
                                    <label for="postExposureNo"> No </label>
                                </div>
                            </div>
                        </div>
                </div>

                <div>
                    <b style="font-size:15px; margin-left:5px;"> Patient History </b>
                    <div style="margin-left:5px;">
                        <div class="vaccine-field field vaccine-label" style="flex-direction: row;">
                            <label class="required width300" for="woundCleaned">
                                Wound cleaned?
                            </label>
                            <div style="display: inline-flex; flex-direction: row">
                                <div class="center-center margin-right25">
                                    <input
                                    id="woundCleanYes"
                                    v-model="formData.caseData.woundClean"
                                    value="Yes"
                                    class="input-radio"
                                    name="woundCleanYes"
                                    type="radio"
                                    :disabled="inputEdit()"
                                    :class="isRequired()"
                                    required
                                    />
                                    <label for="woundCleanYes"> Yes </label>
                                </div>
                                <div class="center-center margin-right25">
                                    <input
                                    id="woundCleanNo"
                                    v-model="formData.caseData.woundClean"
                                    value="No"
                                    class="input-radio"
                                    name="woundCleanNo"
                                    type="radio"
                                    :disabled="inputEdit()"
                                    :class="isRequired()"
                                    required
                                    />
                                    <label for="woundCleanNo"> No </label>
                                </div>
                                <div class="center-center margin-right25">
                                    <input
                                    id="woundCleanUnknown"
                                    v-model="formData.caseData.woundClean"
                                    value="Unknown"
                                    class="input-radio"
                                    name="woundCleanUnknown"
                                    type="radio"
                                    :disabled="inputEdit()"
                                    :class="isRequired()"
                                    required
                                    />
                                    <label for="woundCleanUnknown"> Unknown </label>
                                </div>
                            </div>
                        </div>

                        <div class="vaccine-field field vaccine-label" style="flex-direction: row;">
                            <label class="required width300" for="patientRIG">
                                Patient given RIG (Rabies Immunoglobutin)?
                            </label>
                            <div style="display: inline-flex; flex-direction: row">
                                <div class="center-center margin-right25">
                                    <input
                                    id="patientRIGYes"
                                    v-model="formData.caseData.patientRIG"
                                    value="Yes"
                                    class="input-radio"
                                    name="patientRIGYes"
                                    type="radio"
                                    :disabled="inputEdit()"
                                    :class="isRequired()"
                                    required
                                    />
                                    <label for="patientRIGYes"> Yes </label>
                                </div>
                                <div class="center-center margin-right25">
                                    <input
                                    id="patientRIGNo"
                                    v-model="formData.caseData.patientRIG"
                                    value="No"
                                    class="input-radio"
                                    name="patientRIGNo"
                                    type="radio"
                                    :disabled="inputEdit()"
                                    :class="isRequired()"
                                    required
                                    />
                                    <label for="patientRIGNo"> No </label>
                                </div>
                                <div class="center-center margin-right25">
                                    <input
                                    id="patientRIGUnknown"
                                    v-model="formData.caseData.patientRIG"
                                    value="Unknown"
                                    class="input-radio"
                                    name="patientRIGUnknown"
                                    type="radio"
                                    :disabled="inputEdit()"
                                    :class="isRequired()"
                                    required
                                    />
                                    <label for="patientRIGUnknown"> Unknown </label>
                                </div>
                            </div>
                        </div>

                        <div class="vaccine-field field vaccine-label" style="flex-direction: row;">
                            <label class="required width300" for="patientVaccine">
                                Patient given Rabies Vaccine?
                            </label>
                            <div style="display: inline-flex; flex-direction: row">
                                <div class="center-center margin-right25">
                                    <input
                                    id="patientVaccineYes"
                                    v-model="formData.caseData.patientVaccine"
                                    value="Yes"
                                    class="input-radio"
                                    name="patientVaccineYes"
                                    type="radio"
                                    :disabled="inputEdit()"
                                    :class="isRequired()"
                                    required
                                    />
                                    <label for="patientVaccineYes"> Yes </label>
                                </div>
                                <div class="center-center margin-right25">
                                    <input
                                    id="patientVaccineNo"
                                    v-model="formData.caseData.patientVaccine"
                                    value="No"
                                    class="input-radio"
                                    name="patientVaccineNo"
                                    type="radio"
                                    :disabled="inputEdit()"
                                    :class="isRequired()"
                                    required
                                    />
                                    <label for="patientVaccineNo"> No </label>
                                </div>
                                <div class="center-center margin-right25">
                                    <input
                                    id="patientVaccineUnknown"
                                    v-model="formData.caseData.patientVaccine"
                                    value="Unknown"
                                    class="input-radio"
                                    name="patientVaccineUnknown"
                                    type="radio"
                                    :disabled="inputEdit()"
                                    :class="isRequired()"
                                    required
                                    />
                                    <label for="patientVaccineUnknown"> Unknown </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </form>
        <hr v-if="isPrint" class="viewCIFhr"/>

        <form v-if="pageNum == 5 || isPrint" id="Rabies5" type="submit">
          <div id="case-investigation-form" class="center">
            <h2 id="form-header" class="viewCIFh2" style="display: inline-flex;">
              {{ Object.values(disease.formNames)[pageNum] }}
              <ul
                v-show="!isPrint && !editLab && !editOutcome"
                class="CIFEdit"
                @click="editOutcome=true"
              >
                <img src="~/assets/img/pen.png" />
              </ul>
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

                  <div
                    style="
                      display: inline-flex;
                      align-items: center;
                      margin-right: 30px;
                    "
                  >
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

                <div
                  v-if="newOutcome.outcome == 'Dead'"
                  class="field-row-straight"
                >
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
                  Final Diagnosis
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
        <hr v-if="isPrint" class="viewCIFhr"/>

        <form v-if="pageNum == 6 || isPrint" id="Rabies6" type="submit">
          <div id="case-investigation-form" class="center">
            <h2 id="form-header" class="viewCIFh2" style="display: inline-flex;">
              {{ Object.values(disease.formNames)[pageNum] }}
              <!-- ADD this in ul v-show below: 
                && $auth.user.userID === formData.cases.investigatorLab -->
              <ul
                v-show="!isPrint && !editLab && !editOutcome"
                class="CIFEdit"
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
                      class="input-form-field"
                      :class="isRequired()"
                      required
                    >
                    <option v-for="(lab, i) in labList" :key=i :value=lab.userID> {{ lab.druName }} </option>
                  </select>
              </div>
            </div>

            <div v-show="newLabData.labTestStatus==='Yes'">
                <div class="field-row-straight">
                  <div class="field">
                    <label for="labDateCollected" class="required">
                      Date Collected
                    </label>
                    <input
                      id="labDateCollected"
                      v-model="newLabData.labDateCollected"
                      :max="today"
                      class="input-form-field"
                      type="date"
                      :disabled="inputEdit()"
                      :class="isRequired()"
                      required
                    />
                  </div>

                  <div class="field">
                    <label for="labDateReceived" class="required">
                      Date Received
                    </label>
                    <input
                      id="labDateReceived"
                      v-model="newLabData.labDateReceived"
                      :max="today"
                      class="input-form-field"
                      type="date"
                      :disabled="inputEdit()"
                      :class="isRequired()"
                      required
                    />
                  </div>
                </div>

                <div class="field-row-straight">
                  <div class="field">
                    <label for="labTestResult" class="required">
                      Lab Result
                    </label>
                    <input
                      id="labTestResult"
                      v-model="newLabData.labTestResult"
                      class="input-form-field"
                      type="text"
                      :disabled="inputEdit()"
                      :class="isRequired()"
                      required
                    />
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
        <hr v-if="isPrint" class="viewCIFhr"/>

        <form v-if="pageNum == 7 || isPrint" id="Rabies7" type="submit">
            <div id="case-investigation-form" class="center">
              <h2 id="addCIF-formHeader">
                {{ Object.values(disease.formNames)[pageNum] }}
              </h2>

              <div class="field-row" style="display: inline-flex; margin-bottom: -1 px">
                <div class="field">
                  <label class="required">
                    Please select the final classification
                  </label>
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
                                v-model="formData.caseData.finalClassification"
                                :value="name"
                                class="input-checkbox"
                                name="finalClassification"
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

        <hr v-if="isPrint" class="viewCIFhr"/>
      </div>
      <div class="CIF-statusHistory">
        <div class="CIF-statusHistory">
        <h2 class="viewCIFh2" style="border-bottom: gray solid; width: fit-content; padding: 0 7px 0 5px;">Case Status History</h2>
        
        <dataTable
          :options="tableOptions"
          :datavalues="caseHistory"
          :casetype="'patient'"
        />
      </div>
      </div>
    </div>
    <div v-show="editStatus" class="overlay">
      <div class="overlay-form">
        <button class="close" @click="status('cancel')">x</button>
        <div class="field-row" style="display: inline-flex; margin-bottom: -1 px">
          <div class="field">
            <h2 id="form-header" class="required viewCIFh2">
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
    title: 'View CIF',
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
      newStatus:'',
      hasLabTest:'',
      isDisabled: false,
      editCase: false,
      isPrint: false,
      today: '',
      diseaseID: 'DI-0000000000000',
      caseDefs: [],
      cityList: [],
      pageNum: 1,
      formPart: 'rabies0',
      dateLastUpdated: '',
      newLabData: {
        labTestStatus: '',
        investigatorLab : '',
        labDateCollected: '',
        labDateReceived : '',
        labTestResult : '',
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
      DRUData:{
        druName:'',
        druType:'',
        druCity:'',
        druAddress:''
      }, 
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
          investigatorLab: '',
          investigateDate: '', // ADDED
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
          district: '', // ADDED
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
          // page 3
          exposure: [false, false, true, false, false], // NOTE: idk if need to delete this
          exposureAffectedSite: '',
          exposureOthers: '',
          exposeDate: '',
          exposePlace: '',
          categoryExposure: [],
          exposeAnimal: '',
          exposeAnimalOther: '',
          exposeAnimalStatus: '',
          exposeAnimalStatusOther: '',
          // page 4
          vaccinationHistory: '',
          vaccineDateStart: '',
          vaccineBrand: '',
          routeAdmin: '',
          postExposre: '',
          woundClean: '',
          patientRIG: '',
          patientVaccine: '',
          // Page 5+6+7
          finalClassification: '',
          outcome: '',
          dateDied: '',
          finalDiagnosis: '',
          labTestStatus: '',
          labDateCollected: '',
          labDateReceived: '',
          labTestResult: '',
        },
      },
      disease: {
        idname: 'Rabies',
        name: 'Rabies',
        formNames: {
          form0: 'Search Patient',
          form1: 'Patient Record',
          form2: 'Patient Information',
          form3: 'Exposure History',
          form4: 'Vaccination History',
          form5: 'Outcome',
          form6: 'Laboratory Tests',
          form7: 'Classification',
        },
      },
      rowData: {
        caseID: 1234,
        disease: 'Rabies',
        city: 'Manila',
        patientNo: '123',
        submittedDate: '2020-10-10',
        updatedDate: '2020-10-10',
        status: 'IDK',
      },
      labList: [],
      classification: {},
    }
  },
  async fetch() {
    const data = (await axios.get('http://localhost:8080/api/getCIF?caseID=' + this.$route.query.caseID)).data;
    this.formData.cases = data.cases;
    this.formData.caseData = data.caseData;
    this.formData.patient = data.patient;
    this.formData.riskFactors = data.riskFactors; // working already
    this.DRUData = data.DRUData;
    this.caseHistory = data.caseHistory;
    this.dateLastUpdated = data.dateLastUpdated;
    this.editLabResult('cancel')
    this.hasLabTest = this.formData.caseData.labDateSent ? "Yes" : "No";
    this.editPatientOutcome('cancel')

    let rows = (await axios.get('http://localhost:8080/api/getLabUsers')).data;
    this.labList = rows;

    // console.log(data);
    this.newOutcome = {
      outcome: this.formData.caseData.outcome,
      dateDied: this.formData.cases.dateDied,
      finalDiagnosis: this.formData.cases.finalDiagnosis,
    }
    this.newLabData = {
        investigatorLab : this.formData.caseData.investigatorLab,
        labTestStatus : this.formData.caseData.labTestStatus,
        labDateCollected : this.formData.caseData.labDateCollected,
        labDateReceived : this.formData.caseData.labDateReceived,
        labTestResult : this.formData.caseData.labTestResult,
    }
  }, 
  head() {
    return {
      title: 'Rabies ' + this.formData.cases.caseID
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
    // console.log(today);
  },
  methods: {
    formListClass(index) {
      if (index === this.pageNum) return 'formSummaryItems selected'
      else return 'formSummaryItems'
    },
    move(i) {
      if (this.pageNum === 6 && this.editOutcome) this.editPatientOutcome('cancel');
      if (this.pageNum === 7 && this.editLab) this.editLabResult('cancel');
      this.pageNum = i
    },
    inputEdit() {
      if (this.pageNum === 7 && this.editLab) return false;
      else if (this.pageNum === 6 && this.editOutcome) return false;
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
          this.$toast.error('Please fill up required fields.', {position: 'top-right', duration: 4000, icon: 'error'});
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

      if (this.newLabData.labTestStatus!=='' &&
          this.newLabData.labTestStatus!==undefined) {
            if (this.newLabData.labTestStatus==='Processing' ||
                this.newLabData.labTestStatus==='Unknown' ||
                (this.newLabData.labTestStatus==='No' && 
                this.newLabData.investigatorLab!=='' && 
                this.newLabData.investigatorLab!==undefined) ||
                (this.newLabData.labTestStatus==='Yes' &&
                this.newLabData.labDateCollected!=='' &&
                this.newLabData.labDateReceived!=='' &&
                this.newLabData.labTestResult!=='' &&
                this.newLabData.labDateCollected!==undefined &&
                this.newLabData.labDateReceived!==undefined &&
                this.newLabData.labTestResult!==undefined))
              this.editLabValidate = true;
            else this.editLabValidate = false;
          }
          else this.editLabValidate = false;

          console.log(this.newLabData)
    },
    async editLabResult(change) {
      if (change==='save') {
        this.validateLab();
        if (this.editLabValidate) {
            this.formData.caseData.investigatorLab = this.newLabData.investigatorLab
            this.formData.caseData.labTestStatus = this.newLabData.labTestStatus
            this.formData.caseData.labDateCollected = this.newLabData.labDateCollected
            this.formData.caseData.labDateReceived = this.newLabData.labDateReceived
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
          this.$toast.error('Please fill up the required fields', {duration: 4000, icon: 'error'});
          this.$forceUpdate();
        }
      }
      if (change==='cancel') {
        this.newLabData.investigatorLab = this.formData.caseData.investigatorLab
        this.newLabData.labTestStatus = this.formData.caseData.labTestStatus
        this.newLabData.labDateCollected = this.formData.caseData.labDateCollected
        this.newLabData.labDateReceived = this.formData.caseData.labDateReceived
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
          // alert('CIF status updated!');
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

.viewCIFbody {
  font-family: 'Work Sans', sans-serif;
  font-weight: 300;
  padding: 0px;
  margin: 0px;
  background-image: none;
}

.viewCIFh3 {
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
  .viewCIF-container {
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
@media only screen and (max-width: 900px) {
  .viewCIF-details {
    flex-direction: column;
  }
}
.CIFnumbers,
.CIFstatus {
  display: inline-flex;
  flex-direction: column;
}

.viewCIFh1 {
  color: #008d41;
  font-size: 40px;
  font-weight: 800;
}

.viewCIFh2 {
  color: #346083;
  font-size: 25px;
  font-weight: 600;
}

.viewCIFb {
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
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(100, 100, 100, 0.4);
  /* border: 100px solid rgba(100, 100, 100, 0.4); */
}

@media only screen and (max-width: 550px) {
  .overlay {
    padding: 85px;
  }
}

@media only screen and (max-width: 400px) {
  .overlay {
    padding: 40px;
  }
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

.viewCIFh3 {
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

.viewCIFhr {
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


</style>

