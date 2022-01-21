<template>
  <div id="addProg">
    <!--Top Bar of the screen-->
    <TopNav />
    <div>

    </div>
  </div>
</template>

<script>
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
  },
}
</script>

<style>

</style>