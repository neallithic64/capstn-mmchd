<template>
  <div>
    <TopNav/>
    <!-- Rest of the screen -->
    <div class="addReportOuterContainer">
      <div class="addReportInnerContainter">
        <!-- TOP : report details -->
        <div class="padding5 marginBottom15">
          <!-- title + status -->
          <div class="space-inline alignCenter"> <h1 class="addRep-formHeader marginTopBot5">Add Feedback Report</h1> </div>

          <!-- details -->
          <div class="space-inline alignCenter marginTopBot5 alignTop">
            <!-- input -->
            <div class="half alignStart paddingSide10 block">
              <div class="inlineFlex alignCenter marginTopBot2">
                <legend for="reportTitle" class="inputLegend required"> Report Title: </legend>
                <input id="reportTitle" v-model="report.title" type="text" class="input-form-field"
                  :class="isRequired()" :disabled="!inputEdit()" required />
              </div>

              <div class="inlineFlex alignCenter marginTopBot2">
                <legend for="reportType" class="inputLegend required"> Report Type: </legend>
                <select id="reportType" v-model="report.type" type="text" class="input-form-field"
                  :class="isRequired()" :disabled="!inputEdit()" required @change="changeTime(report.type)">
                  <option v-for="(reportType, index) in reportTypeOption" :key="index">
                    {{reportType}}
                  </option>
                </select>
              </div>

              <div class="inlineFlex alignCenter marginTopBot2">
                <legend for="reportTime" class="inputLegend required"> Year: </legend>
                <select id="reportTime" v-model="report.year" type="text" class="input-form-field"
                  :class="isRequired()" :disabled="!inputEdit()" required>
                  <option v-for="(year, index) in yearOption" :key="index" :value="year">
                    {{year}}
                  </option>
                </select>
              </div>

              <div v-if="timeUnit!=='Annual' && timeUnit!==''" class="inline alignCenter marginTopBot2">
                <legend for="reportTime" class="inputLegend required"> {{timeUnit}}: </legend>
                <select v-if="timeUnit=='Week' || timeUnit==='Month'" id="reportTime" v-model="report.duration" type="text" class="input-form-field"
                  :class="isRequired()" :disabled="!inputEdit()" required>
                  <option v-for="(time, index) in timeOption" :key="index" :value="time">
                    {{time}}
                  </option>
                </select>
                <input v-else id="reportTime" v-model="report.duration" type="text" class="input-form-field"
                  :class="isRequired()" :disabled="!inputEdit()" required/>
              </div>

              <div class="inlineFlex alignCenter marginTopBot2">
                <legend for="reportDisease" class="inputLegend required"> Disease: </legend>
                <select id="reportDisease" v-model="report.disease" type="text" class="input-form-field"
                  :class="isRequired()" :disabled="!inputEdit()" required>
                  <option v-for="(disease, index) in diseaseOption" :key="index">
                    {{disease}}
                  </option>
                </select>
              </div>

            </div>

            <!-- checkbox -->
            <div class="alignLeft alignStart marginTop-1" style="width:40%">
              <div class="reportsOptionsBox">
                <div class="analysisReportOption marginTopBot2" style="width: 210px;font-weight: 600;">
                  Reports Included:
                </div>
                <div v-for="(analysis, index) in reportsOption" :key="index" :class="analysisStyle(index)"
                  class="analysisReportOption marginTopBot2">
                  <input v-model="report.reportsIncluded" class="input-radio" type="checkbox"
                    :value="analysis" :id="analysis" :disabled="!inputEdit()" :class="isOptionRequired()" required/>
                  <label :for="analysis"> {{analysis}} </label>
            </div> </div> </div>
          </div>
        </div>

      <hr class="marginTopBot5"/>

        <!-- CHARTS -->
        <div class="padding15 alignTop block">
          <div v-for="(chart, chartIndex) in report.reportsIncluded" :key="chartIndex" class="fullwidth padding10">
            <h3 class="caps addRep-chartTitle marginBottom5"> {{chart}} </h3>
            <div class="marginTopBottom5 lightgrayB padding30 borderRadius30 boxShadow">
              <div v-if="chart==='Summary'" class="addRep-chartContainer marginBottom5">
                <!-- SUMMARY -->
                <iframe class="addRep-report-powerbi-iframe" src="https://app.powerbi.com/view?r=eyJrIjoiODdiNTM2N2YtMTA3YS00NzA2LTg5YjItMDBlZDllMTQ2ZDY0IiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D&pageName=ReportSection">
                </iframe>
              </div>
              <div v-else-if="chart==='Prevalence Analysis'" class="addRep-chartContainer marginBottom5">
                <!-- Prevalence Analysis -->
              </div>
              <div v-else-if="chart==='Fatality Analysis'" class="addRep-chartContainer marginBottom5">
                <!-- Fatality Analysis -->
              </div>
              <div v-else-if="chart==='Person Analysis'" class="addRep-chartContainer marginBottom5">
                <!-- Person Analysis -->
              </div>
              <div v-else-if="chart==='Time Analysis'" class="addRep-chartContainer marginBottom5">
                <!-- Time Analysis -->
              </div>
              <div v-else-if="chart==='Place Analysis'" class="addRep-chartContainer marginBottom5">
                <!-- Place Analysis -->
              </div>
              <div v-else-if="chart==='Risk Analysis'" class="addRep-chartContainer marginBottom5">
                <!-- Risk Analysis -->
              </div>

              <p> <b> Interpretation / Remarks </b> </p>
              <textarea v-model="report.chartRemarks[chartIndex]" class="input-form-field" :class="isRequired()" 
                  style="resize: vertical;width:100%; height: 100px; padding: 5px; 10px;" required/>
            </div>
            <hr class="marginTop30"/>
          </div>
        </div>

      <!-- <hr class="marginTopBot5"/> -->

        <!-- BOTTOM : prepare + submit buttons -->
        <div class="space-inline alignCenter marginTopBot5 padding5 alignTop">
          <!-- name -->
          <div class="half alignStart paddingSide10 block">
              <div class="inlineFlex alignCenter marginTopBot2">
                <legend for="preparedBy" class="inputLegend required"> Prepared By: </legend>
                <input id="preparedBy" v-model="report.preparedBy" type="text" class="input-form-field"
                  :class="isRequired()" :disabled="!inputEdit()" required />
              </div>
              <div class="inlineFlex alignCenter marginTopBot2">
                <legend for="reportType" class="inputLegend required"> Date and Time: </legend>
                <input id="reportType" v-model="report.dateTime" type="text" class="input-form-field" disabled/>
              </div>
          </div>
          <!-- buttons -->
          <div style="margin: -10px 0 5px; float: right">
            <!-- <button v-if="pageNum == 0" class="back-button" type="button">
              <nuxt-link to="/addCase"> Cancel </nuxt-link>
            </button> -->
            <button class="next-button" type="button" @click="submit()">
              Submit
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'is-auth',
  data() {
    return {
      isValidated:true,
      timeUnit:'',
      report: {
        status: 'Approved',
        title: '',
        type: '',
        year: '',
        duration: '',
        disease: '',
        reportsIncluded: [],
        chartRemarks: [],

        preparedBy: '',
        dateTime: '',
      },
      reportTypeOption: ['Weekly','Monthly','Annual','Adhoc','Outbreak'],
      timeOption: [], weekOption:[], monthOption: [], yearOption:[],
      diseaseOption: [
        'Malaria',
        'Measles',
        'Tetanus',
        'Pertussis',
        'Meningococcal',
        'Dengue',
        'Cholera',
        'Leptospirosis',
        'Chikungunya',
        'Typhoid',
      ],
      reportsOption: [
        'Summary',
        'Prevalence Analysis',
        'Fatality Analysis',
        'Person Analysis',
        'Time Analysis',
        'Place Analysis',
        'Risk Analysis',
      ],
    }
  },
  head() {
    return {
      title: 'New Feedback Report'
    }
  },
  mounted() {
    this.getDate();
    this.yearOption= [2022, 2021, 2020, 2019, 2018];
    this.monthOption= ['January', 'February', 'March', 'April', 'May',
      'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    for (let i=0; i<53; i++) this.weekOption[i] = 'Week ' + (i+1);
    setInterval(() => { this.getDate() }, 10000)
  },
  methods: {
    isRequired() {  if (!this.isValidated) return 'input-required'; },
    isOptionRequired() { if (!this.isValidated && this.report.reportsIncluded.length < 1) return 'input-required'; },
    inputEdit() { return true; },
    analysisStyle(i) {return ''},
    getDate() {
      const today = new Date();
      const hour = today.getHours()>9 ? today.getHours() : '0'+today.getHours()
      const mins = today.getMinutes()>9 ? today.getMinutes() : '0'+today.getMinutes()
      const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Aug', 'Oct', 'Nov', 'Dec'];
      this.report.dateTime = monthsList[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear()
                      + ' ' + hour + ':' + mins;
    },
    changeTime(reportType) {
      this.timeUnit = '';
      this.report.duration = '';
      switch(reportType) {
        case 'Weekly': this.timeUnit = 'Week'; this.timeOption = this.weekOption; break;
        case 'Monthly': this.timeUnit = 'Month'; this.timeOption = this.monthOption; break;
        case 'Annual': this.timeUnit = ''; break;
        case 'Adhoc': this.timeUnit = 'Duration'; break;
        case 'Outbreak': this.timeUnit = 'Duration'; break;
      }
    },
    validate() {
      if (this.report.title!=='' && this.report.type!== '' && this.report.year!== '' &&
          this.report.disease!== '' && this.report.preparedBy!== '' &&
          this.report.reportsIncluded.length > 0 && this.report.chartRemarks.length > 0 &&
          this.report.reportsIncluded.length === this.report.chartRemarks.length) {
        this.isValidated = true;
        console.log(this.isValidated)
        if (this.report.type !== 'Annual' && this.report.duration === '')
          this.isValidated = false;
        else {
          this.isValidated = true;
          for (let i=0; i<this.report.reportsIncluded.length; i++)
            if (this.report.chartRemarks[i] === '' || this.report.chartRemarks[i] === null)
              this.isValidated = this.isValidated & false;
        }
      }
      else this.isValidated = false;
    },
    submit() {
      this.validate();
      if (this.isValidated) {
        this.$toast.success('Feedback Report Submitted!', {duration: 4000, icon: 'check_circle'});
        // TO DO
      }
      else { // eslint-disable-next-line no-lonely-if
        if (this.report.reportsIncluded.length < 1) this.$toast.error('Select atleast 1 report!', {duration: 4000, icon: 'error'});
        else this.$toast.error('Please fill up the required fields!', {duration: 4000, icon: 'error'});
      }
    }
  }
}
</script>

<style>
.addReportOuterContainer { padding: 70px 20px 50px 20px;}
.addReportInnerContainter { /* width: 100%; */ padding: 5px; margin: 10px; }

.fullwidth { width: 100%; }
.half { width: 50%; }
.padding5 { padding: 5px;}
.padding10 { padding: 10px;}
.padding15 { padding: 15px;}
.padding30 { padding: 30px;}
.paddingSide10 { padding: 0 10px; }
.margin5 { margin: 5px;}
.marginTop-1 { margin-top: -1px;}
.marginTop5 { margin-top: 5px;}
.marginTop15 { margin-top: 15px;}
.marginTop30 { margin-top: 30px;}
.marginBottom5 { margin-bottom: 5px;}
.marginBottom15 { margin-bottom: 15px;}
.marginTopBot5 { margin: 5px 0;}
.marginTopBot10 { margin: 10px 0;}
.marginTopBot2 { margin: 2px 0;}
.marginTopBot-5 { margin: -5px 0; }
.borderRadius10 { border-radius: 10px; }
.borderRadius30 { border-radius: 30px; }

.boxShadow { box-shadow: 0px 2px 4px rgb(0 0 0 / 25%); }

.inline { display: inline; }
.inlineFlex { display: inline-flex; }
.block { display: block; }
.alignCenter { align-items: center; }
.alightRight { align-items: right; }
.alignLeft { align-items: left; }
.alignTop { align-items: start; }
.alignStart { align-self: start; }
.alignEnd { align-self: end; }
.caps {text-transform: uppercase;}

.addRep-formHeader {
    margin: -5px 0;
    font-weight: 800;
    font-size: 32px;
    color: #346083;
}

.space-inline {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.reportsOptionsBox {
    width: fit-content;
    /* border: 1px solid black; */
    padding: 2px 16px;
    border-radius: 8px;
}

.analysisReportOption {
    align-items: center;
    width: 215px;
    display: inline-block;
}

.addRep-chartContainer {
  border: lightgray solid 1px;
  width: 100%;
  height: 500px;
  background: lightgray;
}

.addRep-chartTitle {
    font-weight: 600;
    font-size: 20px;
    background-color: #008d41;
    color: transparent;
    text-shadow: 1px 1px, -1px -1px rgb(0 0 0 / 25%);
    -webkit-background-clip: text;
}

.addRep-report-powerbi-iframe {
  height: 100%;
  background-color: gray;
  width: 100%;
  /* border-radius: 10px; */
  /* margin-left: 5px;
  margin-top: 5px; */
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

.input-form-field,
select {
  width: 350px;
  height: 25px;
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
  filter: hue-rotate(-60deg);
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

.inputLegend { width: 140px; }
.input-required:invalid {  box-shadow: 0 0 5px #d45252; border-color: hsl(0, 76%, 50%); /* background-color: #ff6961; */ }
/* .input-required{ border-color: hsl(0, 76%, 50%); } */
.required:after { content: '*'; color: red; }

.greenB { background: #008d41; }
.blueB { background: #346083; }
.orangeB { background: orange; }
.redB { background: red; }
.lightgrayB {background: #f2f2f2;}
.darkerlightgrayB {background: lightgray;}

</style>