<template>
  <div>
    <TopNav/>
    <!-- Rest of the screen -->
    <div class="addReportOuterContainer">
      <div class="addReportInnerContainter">
        <!-- TOP : report details -->
        <div class="padding5 marginBottom15">

          <!-- title + status -->
          <div class="space-inline">
            <h1 class="formHeader">Add Feedback Report</h1>
            <div class="main-status" :class="getColor(report.status)"> {{report.status}} </div>
          </div>

          <!-- details -->
          <div class="space-inline marginTopBot5 alignTop">
            <!-- input -->
            <div class="half alignStart paddingSide10">
              <div class="inline alignCenter marginTopBot2">
                <legend for="reportTitle" class="inputLegend required"> Report Title: </legend>
                <input id="reportTitle" v-model="report.title" type="text" class="input-form-field"
                  :class="isRequired()" :disabled="!inputEdit()" required />
              </div>

              <div class="inline alignCenter marginTopBot2">
                <legend for="reportType" class="inputLegend required"> Report Type: </legend>
                <select id="reportType" v-model="report.type" type="text" class="input-form-field"
                  :class="isRequired()" :disabled="!inputEdit()" required @change="changeTime(report.type)">
                  <option v-for="(reportType, index) in reportTypeOption" :key="index">
                    {{reportType}}
                  </option>
                </select>
              </div>

              <div class="inline alignCenter marginTopBot2">
                <legend for="reportTime" class="inputLegend required"> Year: </legend>
                <select id="reportTime" v-model="report.year" type="text" class="input-form-field"
                  :class="isRequired()" :disabled="!inputEdit()" required>
                  <option v-for="(year, index) in yearOption" :key="index">
                    {{year}}
                  </option>
                </select>
              </div>

              <div v-if="timeUnit==='Week' || timeUnit==='Month'" class="inline alignCenter marginTopBot2">
                <legend for="reportTime" class="inputLegend required"> {{timeUnit}}: </legend>
                <select id="reportTime" v-model="report.time" type="text" class="input-form-field"
                  :class="isRequired()" :disabled="!inputEdit()" required>
                  <option v-for="(time, index) in timeOption" :key="index">
                    {{time}}
                  </option>
                </select>
              </div>

              <div class="inline alignCenter marginTopBot2">
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
            <div class="half alignLeft alignStart">
              <div class="analysisReportOption marginTopBot2" style="width: 245px;font-weight: 600;">
                Reports Included:
              </div>
              <div v-for="(analysis, index) in reportsOption" :key="index" :class="analysisStyle(index)"
                class="analysisReportOption marginTopBot2">
                <input v-model="report.reportsIncluded" class="input-radio" type="checkbox"
                   :value="analysis" :id="analysis" :disabled="!inputEdit()" :class="isRequired()"/>
                <label :for="analysis"> {{analysis}} </label>
              </div>

            </div>
          </div>
          
        </div>

      <hr class="marginTopBot5"/>

        <!-- CHARTS -->
        <div class="space-inline marginTopBot5 padding5 alignTop">
          <div v-if="report.reportsIncluded.length > 0" class="fullwidth">
            <hr class="marginTopBot5"/>
            <h3>CHART Title</h3>
            <div class="">
              <div class="chartContainer"></div>
              <p>Interpretation / Remarks</p>
              <textarea v-model="report.chartRemarks" class="input-form-field" style="resize: vertical;width:100%;    height: 100px;"/>
            </div>
          </div>
        </div>

      <hr class="marginTopBot5"/>

        <!-- BOTTOM : prepare + submit buttons -->
        <div class="space-inline marginTopBot5 padding5 alignTop">
          <!-- name -->
          <div>
              report.preparedBy
              report.dateTime
          </div>
          <!-- buttons -->
          <div></div>
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
      timeUnit:'',
      report: {
        status: 'Approved',
        title: '',
        type: '',
        year: '',
        time: '',
        disease: '',
        reportsIncluded: [],
        chartRemarks: [],

        preparedBy: '',
        dateTime: '',
      },
      reportTypeOption: ['Weekly','Monthly','Annual','Adhoc','Outbreak'],
      reportTimeOption: ['Week','Month'],
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
      title: 'New Report'
    }
  },
  mounted() {
    this.yearOption= [2022, 2021, 2020, 2019, 2018];
    this.monthOption= ['January', 'February', 'March', 'April', 'May',
      'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    for (let i=0; i<52; i++)
      this.weekOption[i] = 'Week ' + (i+1);
  },
  methods: {
    getColor(status) {
      switch (status) {
        case 'Approved': return 'green';
        case 'Pending': return 'blue';
        case 'For Revision': return 'orange';
        case 'Declined': return 'red';
      }
    },
    isRequired() {  return true; },
    inputEdit() { return true; },
    analysisStyle(i) {return ''},
    changeTime(reportType) {
      this.timeUnit = '';
      switch(reportType) {
        case 'Weekly': this.timeUnit = 'Week'; this.timeOption = this.weekOption; break;
        case 'Monthly': this.timeUnit = 'Month'; this.timeOption = this.monthOption; break;
      }
    },
  }
}
</script>

<style>
.addReportOuterContainer { padding: 70px 20px 5px 20px;}
.addReportInnerContainter { /* width: 100%; */ padding: 5px; margin: 10px; }

.fullwidth { width: 100%; }
.padding5 { padding: 5px;}
.paddingSide10 { padding: 0 10px; }
.margin5 { margin: 5px;}
.marginBottom5 { margin-bottom: 5px;}
.marginBottom15 { margin-bottom: 15px;}
.marginTopBot5 { margin: 5px 0;}
.marginTopBot10 { margin: 10px 0;}
.marginTopBot2 { margin: 2px 0;}
.inline { display: inline-flex; }
.half { width: 50%; }
.inputLegend { width: 140px; }

.alignCenter { align-items: center; }
.alightRight { align-items: right; }
.alignLeft { align-items: left; }
.alignTop { align-items: start; }
.alignStart { align-self: start; }
.alignEnd { align-self: end; }

.formHeader {
    margin: -5px 0;
    font-weight: 800;
    font-size: 32px;
    color: #346083;
}

.space-inline {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.main-status {
  padding: 3px 15px 4px;
  border-radius: 22px;
  color: white;
  font-weight: 900;
  font-size: 20px;
}

.analysisReportOption {
    align-items: center;
    width: 250px;
    display: inline-block;
}

.chartContainer {
  border: gray solid 1px;
  border-radius: 15px;
  width: 100%;
  height: 250px;
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

.input-required:invalid {  box-shadow: 0 0 5px #d45252; border-color: hsl(0, 76%, 50%); /* background-color: #ff6961; */ }
.input-required{ border-color: hsl(0, 76%, 50%); }
.required:after { content: '*'; color: red; }

.green { background: #53a262; }
.blue { background: #346083; }
.orange { background: orange; }
.red { background: red; }

</style>