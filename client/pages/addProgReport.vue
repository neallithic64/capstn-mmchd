<template>
  <div id="addProg">
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
          <form v-if="pageNum == 0 || pageNum == Object.keys(disease.formNames).length" id="dengue1" type="submit">
            <div id="case-report-form" class="center">
              <div style="display:flex; flex-direction:row; justify-content: space-between;">
                <h2 id="form-header">
                  {{ Object.values(disease.formNames)[0] }}
                </h2>
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

              <hr/>

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

              <hr/>

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
          <hr v-if="pageNum == Object.keys(disease.formNames).length" />

          <form v-if="pageNum == 1 || pageNum == Object.keys(disease.formNames).length" id="dengue5" type="submit">
            <div id="progReport-form" class="center">
              <h2 id="form-header">
                {{ Object.values(disease.formNames)[1] }}
              </h2>


            </div>
          </form>
          <hr v-if="pageNum == Object.keys(disease.formNames).length" />

          <form v-if="pageNum == 2 || pageNum == Object.keys(disease.formNames).length" id="dengue6" type="submit">
            <div id="progReport-form" class="center">
              <h2 id="form-header">
                {{ Object.values(disease.formNames)[2] }}
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
                      :class="isRequired()"
                      required
                    />
                    <label for="noLabTest"> No </label>
                  </div>
                  <div class="center-center" style="margin: 0 20px">
                    <input
                      id="processingLabTest"
                      v-model="hasLabTest"
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
                      v-model="hasLabTest"
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

              <div v-show="hasLabTest==='No'">
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
                      :max="today"
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
                      :max="today"
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
                      :max="today"
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
                      :max="today"
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

          <form v-if="pageNum == 3 || pageNum == Object.keys(disease.formNames).length" id="dengue7" type="submit">
            <div id="progReport-form" class="center">
              <h2 id="form-header">
                {{ Object.values(disease.formNames)[3] }}
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
                        <ul v-for="(value, name, i) in caseLevel" :key="i" style="displayLinline-flex">
                          <li>
                            <input :id="name" type="checkbox" class="collapseInput"/>
                            <label :for="name" class="collapseLabel">
                              <input
                                :id="name"
                                v-model="formData.cases.caseLevel"
                                :value="name"
                                class="input-checkbox"
                                name="caseLevel"
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
    title: 'Case Report Form - Dengue',
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
      formPart: 'Dengue0',
      pageDone: [true,true,true,true,],
      pageColor: [true,false,false,false,],
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
          patientConsulted: '',
          patientConsultDate:'',
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
          sourceInfection: '',
          outcome: '',
          dateDied: '',
          finalDiagnosis: '',
          vaccine: '',
          vaccineFirstDate: '',
          vaccineLastDate: '',
        },
      },
      disease: {
        idname: 'Dengue',
        name: 'Dengue',
        formNames: {
          form0: 'Program Details',
          form1: 'Program Information',
          form2: 'Program ',
          form3: 'Vaccination History',
        },
      },
      classification: {},
      cityList: [
        'Caloocan',
        'Las Piñas',
        'Makati',
        'Malabon',
        'Mandaluyong',
        'Manila',
        'Marikina',
        'Muntinlupa',
        'Navotas',
        'Parañaque',
        'Pasay',
        'Pasig',
        'Quezon City',
        'San Juan',
        'Taguig',
        'Valenzuela',
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
  computed: {},
  mounted() {},
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
        // alert('CRF case submitted!');
        this.$toast.success('Case saved!', {duration: 4000, icon: 'check_circle'});
        window.location.href = '/allCases';
      } else {
        // eslint-disable-next-line no-console
        console.log(result);
        this.$toast.error('Something went wrong!', {duration: 4000, icon: 'error'});
      }
    },
    move(page) {
      this.validateForm(this.pageNum);
      this.pageColor[this.pageNum] = this.pageDone[this.pageNum];
      this.validateForm(page);
      this.pageColor[page] = this.pageDone[page];
      
      if (this.pageDone[this.pageNum] || this.pageDone[page] || page===0 || this.pageNum ===0) {
        if (page===4) {
          if (!this.pageColor[8]) alert('Please fill up the required fields in all pages');
          else this.pageNum = page;
        }
        else if (this.pageNum===4) {
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
      }
      else {
        // alert('Please fill up the required fields');
        this.$toast.error('Please fill up the required fields.', {position: 'top-right', duration: 4000, icon: 'error'});
        // document.getElementsByClassName('input-form-field').className = 'input-form-field input-required';
        this.$forceUpdate();
      }
      // console.log(this.pageDone)

      this.$nextTick(() => {
        if ((page === 0 || page === 4) && this.formData.patient.occuBrgy != null) {
          const dropdown = document.getElementById('occuBrgy');
          while (dropdown.firstChild) dropdown.removeChild(dropdown.firstChild);
          const defaultOption = document.createElement('option');
          defaultOption.text = this.formData.patient.occuBrgy;
          dropdown.add(defaultOption);
          dropdown.selectedIndex = 0;
        }
      })
    },
    validateForm(page) {
      switch (page) {
        case 1:
          if (this.patientExist) this.pageDone[page] = true;
          else this.pageDone[page] = false;
          if (this.formData.patient.ageNo<0) {this.formData.patient.ageNo = ''; this.pageDone[page] = false;}
          if (this.formData.patient.pregWeeks!=='Not Pregnant' && this.formData.patient.pregWeeks<0)
            {this.formData.patient.pregWeeks = ''; this.pageDone[page] = false;}
          if (this.formData.patient.guardianContact<0) {this.formData.patient.guardianContact = ''; this.pageDone[page] = false;}
          break;
        case 3:
          if (this.formData.caseData.vaccine!=='' &&
              this.formData.caseData.vaccine!=='') {
            if (this.formData.caseData.vaccine==='No' ||
                (this.formData.caseData.vaccine==='Yes' &&
                this.formData.caseData.vaccineFirstDate!=='' &&
                this.formData.caseData.vaccineFirstDate!==null &&
                this.formData.caseData.vaccineLastDate!=='' &&
                this.formData.caseData.vaccineLastDate!==null))
              this.pageDone[page] = true;
            else this.pageDone[page] = false;
          }
          else this.pageDone[page] = false;
          break;
        case 4:
          if (this.formData.caseData.clinicalClassification!=='' &&
              this.formData.caseData.clinicalClassification!==null
          ) this.pageDone[page] = true;
          else this.pageDone[page] = false;
          break;
        case 7:
          if (this.formData.cases.caseLevel !=='' &&
              this.formData.cases.caseLevel !== null &&
              this.formData.cases.caseLevel !== undefined)
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
      else return false;
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
