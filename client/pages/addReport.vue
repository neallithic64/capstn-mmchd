<template>
  <div>
    <TopNav v-show="!isPrint"/>
    <!-- Rest of the screen -->
    <div ref="content" :class="[{ addReportOuterContainer: !isPrint }, { padding20 : isPrint, }, { paddingTop75 : isPrint, },]">
      <!-- HEADER -->
      <div v-show="isPrint" class="centerSide paddingSide25">
        <div class="marginTop40 marginBottom-40 centerText"></div>
        <img src="~/assets/img/logo.png" style="height: 100px; marginBottom15"/>
        <hr class="marginTopBot10" id="1"/>
        
        <div class="space-inline marginTop5">
          <h3 class="weight500 size18"> {{report.title}} </h3>
          <h3 class="weight500 size18">
              {{report.type}} Report - {{report.year}}
              <span v-if="report.duration!==''">, {{report.duration}} </span> 
          </h3>
          <h3 class="weight500 size18"> {{report.disease}} </h3>
        </div>
        <hr class="marginTop20" id="2"/>
      </div>

      <div v-if="!isPrint" class="addReportInnerContainter">
        <div class="padding5">
          <h1 class="addRep-formHeader marginTopBot10"> Add Feedback Report </h1>
          <!-- details -->
          <div class="space-inline alignCenter marginTopBot10 alignTop">
            <!-- input -->
            <div class="half alignStart paddingSide10 block" style="width: 45%">
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

              <div v-if="timeUnit!=='Annual' && timeUnit!==''" class="inlineFlex alignCenter marginTopBot2">
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
            <div class="alignLeft alignStart marginTop-25" style="width:45%">
              <div class="reportsOptionsBox">
                <div class="analysisReportOption marginTopBot2" style="width: 100%;font-weight: 600;">
                  Reports Included:
                </div>
                <div v-for="(analysis, index) in reportsOption" :key="index"
                  class="analysisReportOption marginTopBot2">
                  <input v-model="report.reportsIncluded" class="input-radio" type="checkbox"
                    :value="analysis" :id="analysis" :disabled="!inputEdit()" :class="isOptionRequired()" @change="call" required/>
                  <label :for="analysis"> {{analysis}} </label>
            </div> </div> </div>
          </div>
          <hr class="marginTop30 marginBottom10" id="2"/>
        </div>
      </div>
      
      <!-- CHARTS -->
      <div class="padding15 alignTop block paddingTop-10">
        <div v-for="(chart, chartIndex) in report.reportsIncluded" :key="chartIndex" class="fullwidth padding10">
          <h3 v-if="isPrint" class="caps addRep-chartTitle marginBottom-15 blueC"> {{chart}} </h3>
          <div v-else class="caps addRep-chartTitle marginBottom-15 blueB whiteC paddingLeft10 marginRight10 marginLeft10"> {{chart}} </div>
          <div class="padding30" :class="getMinClass(chartIndex, report.reportsIncluded.length)">
            <div class="addRep-chartContainer marginBottom5" :style="biSize()">
              <iframe v-if="chart === reportsOption[0]" class="addRep-report-powerbi-iframe" :src="getLink(0)"></iframe>
              <iframe v-else-if="chart === reportsOption[1]" class="addRep-report-powerbi-iframe" :src="getLink(1)"></iframe>
              <iframe v-else-if="chart === reportsOption[2]" class="addRep-report-powerbi-iframe" :src="getLink(2)"></iframe>
              <iframe v-else-if="chart === reportsOption[3]" class="addRep-report-powerbi-iframe" :src="getLink(3)"></iframe>
              <iframe v-else-if="chart === reportsOption[4]" class="addRep-report-powerbi-iframe" :src="getLink(4)"></iframe>
              <iframe v-else-if="chart === reportsOption[5]" class="addRep-report-powerbi-iframe" :src="getLink(5)"></iframe>
              <iframe v-else-if="chart === reportsOption[6]" class="addRep-report-powerbi-iframe" :src="getLink(6)"></iframe>
              <iframe v-else-if="chart === reportsOption[7]" class="addRep-report-powerbi-iframe" :src="getLink(7)"></iframe>
            </div>
            <!-- <div v-if="!isRevise" style="padding: 5px 10px;" :class="chartRemarkClass()" :contentEditable="isRevise" class="width100" required> {{inputChartRemarks[chartIndex]}} </div> -->
            <div v-if="isPrint" style="padding: 5px 10px;" class="width100"> {{report.chartRemarks[chartIndex]}} </div>
            <div v-else>
              Interpretation / Remarks
              <textarea v-model="report.chartRemarks[chartIndex]" class="input-form-field marginTop10" :class="isRequired()" 
                  style="resize: vertical;width:100%; height: 100px; padding: 5px; 10px;" required/>
            </div>
          </div>
          <hr v-if="isPrint" class="marginTopBot5" id="3charts"/>
          <div v-if=" isPrint && chartIndex != report.reportsIncluded.length - 1" class="space-inline size10 marginBottom85">
            <p> Department of Health - Metro Manila Center for Health Development </p>
            <p> {{report.title}} | Page {{chartIndex+1}}</p>
          </div>
        </div>

        <hr v-if="!isPrint" class="marginBottom5 marginTop20" id="4"/>
      </div>

      <div class="addReportInnerContainter">

        <!-- BOTTOM : prepare + submit buttons -->
        <div class="marginTopBot5 padding5 alignTop">
          <!-- name -->
          <div v-if="false" class="space-inline alignStart block marginBottom30">
            <div class="grid">
              <div class="inlineFlex alignCenter marginTopBot2">  <span class="width105"> Prepared By: </span>
                <span class="approval-people"> <b> &nbsp;{{report.preparedBy}} </b> </span>
              </div>
              <div class="inlineFlex alignCenter marginTopBot2">  <span class="width105"> Prepared On: </span>
                <span class="approval-people"> <b> &nbsp;{{report.dateTime}} </b> </span>
              </div>
              <div class="inlineFlex alignCenter marginTopBot2"></div>
            </div>
            <div  class="grid">
              <div class="inlineFlex alignCenter marginTopBot2">  <span class="width155"> Noted By: </span>
                <img v-if="report.notedByDate" class="width20" src="~/assets/img/check.png">
                <img v-else class="width20" src="~/assets/img/arrow.png" style="opacity: 0.75;">
                  <span class="approval-people"> <b> &nbsp;{{report.notedBy}} </b> </span> <span v-if="report.notedByDate"> &nbsp;({{report.notedByDate}}) </span>
              </div>
              <div class="inlineFlex alignCenter marginTopBot2">  <span class="width155"> Recommended By: </span>
                <img v-if="report.recommendedByDate" class="width20" src="~/assets/img/check.png">
                <img v-else-if="report.notedByDate" class="width20" src="~/assets/img/arrow.png" style="opacity: 0.75;">
                <img v-else class="width20" src="~/assets/img/circle.png" style="opacity: 0.3;">
                  <span class="approval-people"> <b> &nbsp;{{report.recommendedBy}} </b> </span> <span v-if="report.recommendedByDate"> &nbsp;({{report.recommendedByDate}}) </span>
              </div>
              <div class="inlineFlex alignCenter marginTopBot2">  <span class="width155"> Approved By: </span>
                <img v-if="report.approvedByDate" class="width20" src="~/assets/img/check.png" >
                <img v-else-if="report.recommendedByDate" class="width20" src="~/assets/img/arrow.png" style="opacity: 0.75;">
                <img v-else class="width20" src="~/assets/img/circle.png" style="opacity: 0.3;">
                  <span class="approval-people"> <b> &nbsp;{{report.approvedBy}} </b></span> <span v-if="report.approvedByDate"> &nbsp;({{report.approvedByDate}}) </span>
              </div>
            </div>
          </div>

          <!-- BOTTOM : prepare + submit buttons -->
          <div v-if="!isPrint" class="space-inline alignCenter marginTopBot5 padding5 alignTop">
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
                <div v-if="isValidated & readyPrint" class="inlineFlex alignCenter marginTopBot2">
                  <legend for="reportType" class="inputLegend required"> Upload Report: </legend>
                  <input type="file" ref="file" accept=".pdf" @change="addFile" required/>
                </div>
            </div>
            <!-- buttons -->
            <div style="margin: -10px 0 5px; " class="grid">
              <!-- <button v-if="pageNum == 0" class="back-button" type="button">
                <nuxt-link to="/addCase"> Cancel </nuxt-link>
              </button> -->
              <!-- <button class="addRep-backButton" type="button" @click="isPrint = true"> -->
              <button class="addRep-backButton" type="button" @click="downloadPDF">
                Print
              </button>
              <button v-if="readySubmit" class="addRep-nextButton" type="button" @click="submit()">
                Submit
              </button>
            </div>
          </div>

          <div v-show="isPrint" class="padding15 border margin20">
            <span class="italics marginBottom115"> *NOTE: Case counts reported here do NOT represent the final number and are subject to change after inclusion of delayed reports and eview of cases.
            Data Source: 2022  </span>
          </div>
        </div>
        <hr v-show="isPrint" class="marginTopBot5" id="5"/>

        <div v-show="isPrint" class="space-inline size10 marginBottom25">
          <p> Department of Health - Metro Manila Center for Health Development </p>
          <p> {{report.title}} | Page {{report.reportsIncluded.length}}</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
// import jsPDF from 'jspdf'
// import html2canvas from 'html2canvas'

export default {
  middleware: 'is-auth',
  data() {
    return {
      isPrint: false,
      isValidated: true,
      readyPrint: false,
      readySubmit: false,
      inputChartRemarks: [],
      today:'',
      timeUnit:'',
      report: {
        status: '',
        title: '',
        type: '',
        year: '',
        duration: '',
        disease: '',
        reportsIncluded: [],
        chartRemarks: [],

        // reportsIncluded: ['Person Analysis', 'Summary1', 'Summary2', 'Time Analysis'],
        // chartRemarks: ['AB', 'ABC1', 'ABC2', 'ABCD',],

        preparedBy: '',
        dateTime: '',
        notedBy: '',
        notedByDate: 'Jan 28, 2013',
        recommendedBy: '',
        recommendedByDate: 'Feb 02, 2013',
        approvedBy: 'I',
        approvedByDate: '',
      },
      reportTypeOption: ['Weekly', 'Monthly', 'Annual', 'Adhoc', 'Outbreak'],
      timeOption: [], weekOption: [], monthOption: [], yearOption: [],
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
        'Prevalence Analysis',
        'Fatality Analysis',
        'Person Analysis',
        'Time Analysis',
        'Place Analysis',
        'Risk Analysis',
        'Accomplishment Analysis',
        'Health Events',
      ],
      biLinks: [
        "https://app.powerbi.com/view?r=eyJrIjoiNTAwZDAxNDktM2E2Zi00ZWQxLWEyYzQtYzkwNDY1OTljZDg1IiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D",
        "https://app.powerbi.com/view?r=eyJrIjoiNTRhNTRmN2MtMjU2NC00YmRhLWE0ZmYtYjFhZGU0MmYwOTlkIiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D",
        "https://app.powerbi.com/view?r=eyJrIjoiNWI4OTdkOGUtYzNiZS00ZjQwLWJkNzItZWY3Yjk1YjU1MTVjIiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D",
        "https://app.powerbi.com/view?r=eyJrIjoiNjMyNzJjYjUtNDMyOS00YmE4LTk2MDQtMzM1OGNlYzc5ZmI1IiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D",
        "https://app.powerbi.com/view?r=eyJrIjoiMDJkYjk3OGYtMTFlOC00YWFiLWJlMWMtYWM1NmM4NGRlZDZjIiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D",
        "https://app.powerbi.com/view?r=eyJrIjoiZTE5NTAxMjEtYjRjMC00ZDY1LWJmYTMtMDhkN2I2MGExODBjIiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D",
        "https://app.powerbi.com/view?r=eyJrIjoiYTdlYWJmYzEtMDliOC00NzBiLTlkYjEtNjViN2E1MjkxMjFlIiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D",
        "https://app.powerbi.com/view?r=eyJrIjoiZjJjZDVhZDAtYjljZi00NzQzLWI4ZGMtN2Q0OTRhYWUxMGU3IiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D",
      ]

    }
  },
  head() {
    return {
      title: 'Add Feedback Report'
    }
  },
  mounted() {
    this.getDate();
    this.yearOption= [2022, 2021, 2020, 2019, 2018];
    this.monthOption= ['January', 'February', 'March', 'April', 'May',
      'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    for (let i=0; i<53; i++) this.weekOption[i] = 'Week ' + (i+1);
    setInterval(() => { this.getDate() }, 10000)
	this.report.preparedBy = this.$auth.user.userID;
  },
  methods: {
    call() {console.log(this.report.reportsIncluded); console.log(this.chartRemarks);},
    getLink(i) { return this.biLinks[i]; },
    isRequired() {  if (!this.isValidated) return 'input-required'; },
    isOptionRequired() { if (!this.isValidated && this.report.reportsIncluded.length < 1) return 'input-required'; },
    inputEdit() { if (this.isPrint) return false; else return true; },
    biSize() { if (!this.isPrint) return 'min-height: 70vh;    min-width: 70vh;'},
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
    getMinClass(index, reportCount) {
      if (!this.isPrint) return 'addRep-chartContainerView';
      else if (index === reportCount-1) return 'fullHeightLast';
      else if (index === 0) return 'fullHeightFirst';
      else return 'fullHeightNotFirst';
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
          for (let i=0; i<this.reportsOption.length; i++)
            for (let j=0; j<=this.report.reportsIncluded.length; j++)
              if (this.report.reportsIncluded[j] === this.reportsOption[i])
                if (this.report.chartRemarks[i] === '' || this.report.chartRemarks[i] === null)
                  this.isValidated = this.isValidated & false;
        }
      }
      else this.isValidated = false;
    },
    print() {window.print();},
    downloadPDF() {
      this.validate();
      if (!this.isValidated) { // eslint-disable-next-line no-lonely-if
        if (this.report.reportsIncluded.length < 1) this.$toast.error('Select atleast 1 report!', {duration: 4000, icon: 'error'});
        else this.$toast.error('Please fill up the required fields!', {duration: 4000, icon: 'error'});
      }
      else {
        this.isPrint = true;
        // window.addEventListener('load', function () {
        if (this.isPrint) {
          this.$toast.success('Printing...', {duration: 8500, icon: 'check_circle'});
          setTimeout(() => (this.print()), 10000);
          setTimeout(() => (this.isPrint=false), 15000);
          setTimeout(() => (this.readyPrint=true), 15000);
          // window.onafterprint = function(){
          //   this.isPrint = false;
          // }
            // setTimeout(() => (this.isPrint = false), 10000);
          }
        // })
      }
    },
    async addFile(event) {
      this.readySubmit = true;
      this.file = event.target.files[0];      
      console.log(this.file);

      await this.convertPDFToBase64(this.file)
    },
    convertPDFToBase64(fileToLoad) {
        // FileReader function for read the file.
        const fileReader = new FileReader();
        // Convert data to base64
        fileReader.readAsDataURL(fileToLoad);

        let base64;
        // Onload of file read the file content
        fileReader.onload = async function(fileLoadedEvent) {
          base64 = fileLoadedEvent.target.result;
          const result = (
            await axios.post ('http://localhost:8080/api/postFileBlob', {
              file: base64
            })
          );
          console.log(result);
        };
    },
    async submit() {
      if (!this.readySubmit) this.$toast.error('Please upload the file.', {duration: 4000, icon: 'error'});
      else {
        const response = (await axios.post('http://localhost:8080/api/postAddReport', {
		  report: this.report
		}));
		if (response.status === 200) {
          this.$toast.success('Feedback Report Submitted!', {duration: 4000, icon: 'check_circle'});
		}
      }
    },
  }
}
</script>

<style>
body {font-family:Arial, Helvetica, sans-serif}
.addReportOuterContainer { padding: 80px 20px 50px 20px;}
.addReportInnerContainter { /* width: 100%; */ padding: 5px; margin: 10px; }
.fullSize {min-height: 80vh;    min-width: 80vh;}

.fullwidth { width: 100%; }
.half { width: 50%; }
.width20 {width: 20px;}
.width25 {width: 25px;}
.width30 {width: 30px;}
.padding5 { padding: 5px;}
.padding10 { padding: 10px;}
.padding15 { padding: 15px;}
.padding20 { padding: 20px;}
.padding30 { padding: 30px;}
.paddingTop-10 { padding-top: -10px;}
.paddingTop60 { padding-top: 60px;}
.paddingTop75 { padding-top: 75px;}
.paddingTopBot15 { padding: 15px 0; }
.paddingTopBot25 { padding: 25px 0; }
.paddingLeft5 { padding-left: 5px; }
.paddingLeft10 { padding-left: 10px; }
.paddingSide5 { padding: 0 5px; }
.paddingSide10 { padding: 0 10px; }
.paddingSide20 { padding: 0 20px; }
.paddingSide25 { padding: 0 25px; }
.paddingSide30 { padding: 0 30px; }
.margin5 { margin: 5px;}
.margin10 { margin: 10px;}
.margin20 { margin: 20px;}
.margin30 { margin: 30px;}
.marginRight10 { margin-right: 10px;}
.marginLeft10 { margin-left: 10px;}
.marginTop-1 { margin-top: -1px;}
.marginTop-5 { margin-top: -5px;}
.marginTop-6 { margin-top: -6px;}
.marginTop-10 { margin-top: -10px;}
.marginTop-25 { margin-top: -25px;}
.marginTop-35 { margin-top: -35px;}
.marginTop2 { margin-top: 2px;}
.marginTop5 { margin-top: 5px;}
.marginTop10 { margin-top: 10px;}
.marginTop15 { margin-top: 15px;}
.marginTop20 { margin-top: 20px;}
.marginTop30 { margin: 30px 0 0 0;}
.marginBottom-3 { margin-bottom: -3px;}
.marginBottom-5 { margin-bottom: -5px;}
.marginBottom-15 { margin-bottom: -15px;}
.marginBottom-25 { margin-bottom: -25px;}
.marginBottom-40 { margin-bottom: -40px;}
.marginBottom-50 { margin-bottom: -50px;}
.marginBottom5 { margin-bottom: 5px;}
.marginBottom15 { margin-bottom: 15px;}
.marginBottom25 { margin-bottom: 25px;}
.marginBottom30 { margin-bottom: 30px;}
.marginBottom50 { margin-bottom: 50px;}
.marginBottom60 { margin-bottom: 60px;}
.marginBottom80 { margin-bottom: 80px;}
.marginBottom85 { margin-bottom: 85px;}
.marginBottom90 { margin-bottom: 90px;}
.marginBottom100 { margin-bottom: 100px;}
.marginBottom115 { margin-bottom: 115px;}
.marginBottom120 { margin-bottom: 120px;}
.marginTopBot2 { margin: 2px 0;}
.marginTopBot5 { margin: 5px 0;}
.marginTopBot10 { margin: 10px 0;}
.marginTopBot20 { margin: 20px 0;}
.marginTopBot-5 { margin: -5px 0; }
.marginLeft5 { margin-left: 5px; }
.marginLeft10 { margin-left: 10px; }
.marginSide25 { margin: 0 25px; }
.borderRadius10 { border-radius: 10px; }
.borderRadius30 { border-radius: 30px; }
.centerUp { align-self: center; }
.centerSide { text-align: -webkit-center; }

.border {border: 1px solid black;}
.boxShadow { box-shadow: 0px 2px 4px rgb(0 0 0 / 25%); }
.italics { font-style: italic; }
.weight800 { font-weight: 800; }
.weight700 { font-weight: 700; }
.weight600 { font-weight: 600; }
.weight500 { font-weight: 500; }
.weight400 { font-weight: 400; }
.weight200 { font-weight: 200; }
.size32 { font-size: 32px; }
.size24 { font-size: 24px; }
.size22 { font-size: 22px; }
.size20 { font-size: 20px; }
.size18 { font-size: 18px; }
.size16 { font-size: 16px; }
.size12 { font-size: 12px; }
.size10 { font-size: 10px; }
.size8 { font-size: 8px; }

.inline { display: inline; }
.inlineFlex { display: inline-flex; }
.block { display: block; }
.grid { display: grid; }
.centerText { text-align: end; }
.alignCenter { align-items: center; }
.alightRight { align-items: right; }
.alignLeft { align-items: left; }
.alignTop { align-items: start; }
.alignStart { align-self: start; }
.alignEnd { align-self: end; }
.textAlighRight { text-align-last: left; }
.caps {text-transform: uppercase;}

.peopleLeft { width: 60% }
.peopleRight { width: 40% }
@media screen and (max-width: 1111px) {
  .peopleLeft { width: 40% }
  .peopleRight { width: 60% }
}

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
  /* align-items: center; */
}

.addRep-actionStatusButton {
    display: -webkit-inline-box;
    margin-top: -10px;
    padding-top: 5px;
}

.reportsOptionsBox {
    width: fit-content;
    /* border: 1px solid black; */
    padding: 2px 16px;
    border-radius: 8px;
}

.analysisReportOption {
    align-items: center;
    width: 240px;
    display: inline-block;
}

.addRep-mainStatus {
  padding: 3px 15px 4px;
  border-radius: 22px;
  color: white;
  font-weight: 900;
  font-size: 20px;
  width: fit-content;
  float: right;
}

.addRep-chartContainerView {
    margin: 15px 10px 10px;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.25));
    background-color: #f2f2f2;
}

.addRep-chartContainer {
  border: lightgray solid 1px;
  width: 100%;
  height: 415px;
  background: lightgray;
}

.addRep-chartTitle {
    font-weight: 600;
    font-size: 20px;
    /* background-color: #008d41;
    color: transparent;
    text-shadow: 1px 1px, -1px -1px rgb(0 0 0 / 25%);
    -webkit-background-clip: text; */
}

.addRep-report-powerbi-iframe {
  height: 100%;
  background-color: gray;
  width: 100%;
  /* border-radius: 10px; */
  /* margin-left: 5px;
  margin-top: 5px; */
}

.addRep-approvalPeople {
    font-size: 16px;
    padding-right: 5px;
    padding-left: 5px;
}

.addRep-backButton {
    width: 150px;
    height: 38px;
    max-width: 100%;
    font-size: 16px;
    font-weight: 600;
    background-color: white;
    color: #346083;
    margin-right: 10px;
    margin-top: 30px;
  }

.addRep-backButton:hover {
  border: #346083 solid 1px;
}

.addRep-nextButton {
  width: 150px;
  height: 38px;
  max-width: 100%;
  font-size: 16px;
  font-weight: 600;
  background-color: #346083;
  color: white;
  border: #346083 solid 0.75px;
  margin-top: 10px;
}

.input-form-field,
select {
  width: 350px;
  height: 25px;
  font-size: 16px;
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
  padding-right: 5px;
  padding-left: 5px;
  /* border: 1p x solid rgba(0, 0, 0, 0.25); */
  border: 1px solid #a3a3a3;
  box-sizing: border-box;
  border-radius: 9px;
  margin: 0 5px;
}

.width100 { width: 100%; }
.width155 { width: 155px; }
.width105 { width: 105px; }
.fullHeightLast { min-height: 710px;}
.fullHeightFirst { min-height: 730px;} /* 1000-265 - 10 + 5 (removed from margin bottom) */
.fullHeightNotFirst { min-height: 905px; }
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
.darkGrayB {background: gray;}
.whiteB {background: white;}
.greenC { color: #008d41; }
.blueC { color: #346083; }
.orangeC { color: orange; }
.redC { color: red; }
.lightgrayC {color: #f2f2f2;}
.darkerlightgrayC {color: lightgray;}
.darkGrayC {color:gray}
.whiteC {color: white;}

</style>