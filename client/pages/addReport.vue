<template>
  <div>
    <TopNav/>
    <!-- Rest of the screen -->
    <div class="addReportOuterContainer">
      <div class="addReportInnerContainter">
        <!-- TOP : report details -->
        <div class="padding5 marginBottom15">
          <!-- title + status -->
          <div class="space-inline"> <h1 class="formHeader marginTopBot5">Add Feedback Report</h1> </div>

          <!-- details -->
          <div class="space-inline marginTopBot5 alignTop">
            <!-- input -->
            <div class="half alignStart paddingSide10 block">
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
            <div class="alignLeft alignStart marginTop-1" style="width:36%">
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
            <h3 class="caps chartTitle marginBottom5"> {{chart}} </h3>
            <div class="marginTopBottom5 lightgray padding30 borderRadius30 boxShadow">
              <div class="chartContainer marginBottom5"></div>
              <p> <b> Interpretation / Remarks </b> </p>
              <textarea v-model="report.chartRemarks[chartIndex]" class="input-form-field" :class="isRequired()" 
                  style="resize: vertical;width:100%; height: 100px; padding: 5px; 10px;" required/>
            </div>
            <hr class="marginTop30"/>
          </div>
        </div>

      <!-- <hr class="marginTopBot5"/> -->

        <!-- BOTTOM : prepare + submit buttons -->
        <div class="space-inline marginTopBot5 padding5 alignTop">
          <!-- name -->
          <div class="half alignStart paddingSide10 block">
              <div class="inline alignCenter marginTopBot2">
                <legend for="preparedBy" class="inputLegend required"> Prepared By: </legend>
                <input id="preparedBy" v-model="report.preparedBy" type="text" class="input-form-field"
                  :class="isRequired()" :disabled="!inputEdit()" required />
              </div>
              <div class="inline alignCenter marginTopBot2">
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
    const today = new Date();
    const hour = today.getHours()>9 ? today.getHours() : '0'+today.getHours()
    const mins = today.getMinutes()>9 ? today.getMinutes() : '0'+today.getMinutes()
    const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Aug', 'Oct', 'Nov', 'Dec'];
    this.report.dateTime = monthsList[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear()
                     + ' ' + hour + ':' + mins;

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
    isRequired() {  if (!this.isValidated) return 'input-required'; },
    isOptionRequired() { if (!this.isValidated && this.report.reportsIncluded.length < 1) return 'input-required'; },
    inputEdit() { return true; },
    analysisStyle(i) {return ''},
    changeTime(reportType) {
      this.timeUnit = '';
      this.report.time = '';
      switch(reportType) {
        case 'Weekly': this.timeUnit = 'Week'; this.timeOption = this.weekOption; break;
        case 'Monthly': this.timeUnit = 'Month'; this.timeOption = this.monthOption; break;
      }
    },
    validate() {
      if (this.report.title!=='' && this.report.type!== '' && this.report.year!== '' &&
          this.report.disease!== '' && this.report.preparedBy!== '' &&
          this.report.reportsIncluded.length > 0 && this.report.chartRemarks.length > 0 &&
          this.report.reportsIncluded.length === this.report.chartRemarks.length) {
        this.isValidated = true;
        console.log(this.isValidated)
        if (this.report.type === 'Monthly' || this.report.type === 'Weekly') 
        { if (this.report.time === '') this.isValidated = false; }
        else {
          this.isValidated = true;
          for (let i=0; i<this.report.reportsIncluded.length; i++)
            if (this.reports.chartRemarks[i] === '' || this.reports.chartRemarks[i] === null)
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

.inline { display: inline-flex; }
.block { display: block; }
.alignCenter { align-items: center; }
.alightRight { align-items: right; }
.alignLeft { align-items: left; }
.alignTop { align-items: start; }
.alignStart { align-self: start; }
.alignEnd { align-self: end; }
.caps {text-transform: uppercase;}

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

.reportsOptionsBox {
    width: fit-content;
    border: 1px solid black;
    padding: 2px 16px;
    border-radius: 8px;
}

.analysisReportOption {
    align-items: center;
    width: 215px;
    display: inline-block;
}

.chartContainer {
  border: lightgray solid 1px;
  width: 100%;
  height: 500px;
  background: lightgray;
}

.chartTitle {
    font-weight: 600;
    font-size: 20px;
    background-color: #008d41;
    color: transparent;
    text-shadow: 1px 1px, -1px -1px rgb(0 0 0 / 25%);
    -webkit-background-clip: text;
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

.green { background: #53a262; }
.blue { background: #346083; }
.orange { background: orange; }
.red { background: red; }
.lightgray {background: #f2f2f2;}
.darkerlightgray {background: lightgray;}

</style>