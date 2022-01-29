<template>
  <div>
    <TopNav v-show="!isPrint"/>
    <!-- Rest of the screen -->
    <div ref="content" :class="[{ addReportOuterContainer: !isPrint }, { padding20 : isPrint, }, { paddingTop75 : isPrint, },]">
      <!-- HEADER -->
      <div class="centerSide paddingSide25">
        <div class="">
          <div class="marginTop40 marginBottom-40 centerText">
            <div v-if="!isPrint && !editReport" class="patientActionButtons inline marginBottom-50">
              <img src="~/assets/img/pen.png" class="printButton width30" @click="editReport=true" />
              <img src="~/assets/img/pdf.png" class="printButton width30" @click="downloadPDF" />
            </div>
          </div>
          <img v-if="isPrint" src="~/assets/img/logo.png" style="height: 100px; marginBottom15"/>
          <h1 v-else class="textAlighRight greenC weight800 size32"> Feedback Report # 123 </h1>
        </div>
        <hr v-if="isPrint" class="marginTopBot10"/>
        <div class="space-inline marginTop5">
          <h3 class="weight600 size18"> {{report.title}} </h3>
          <h3 class="weight600 size18">
              {{report.type}} Report - {{report.year}}
              <span v-if="report.duration!==''">, {{report.duration}} </span> 
          </h3>
          <h3 class="weight600 size18"> {{report.disease}} </h3>
        </div>
        <hr class="marginTopBot10"/>
      </div>

      <!-- CHARTS -->
      <div class="padding15 alignTop block paddingTop-10">
        <div v-for="(chart, chartIndex) in report.reportsIncluded" :key="chartIndex" class="fullwidth padding10">
          <h3 v-if="isPrint" class="caps chartTitle marginBottom-15 blueC"> {{chart}} </h3>
          <div v-else class="caps chartTitle marginBottom-15 blueB whiteC"> {{chart}} </div>
          <div class="marginBottom15 padding30" :class="getMinClass(chartIndex, report.reportsIncluded.length)">
            <div class="chartContainer marginBottom5">
              <iframe class="report-powerbi-iframe" src="https://app.powerbi.com/view?r=eyJrIjoiODdiNTM2N2YtMTA3YS00NzA2LTg5YjItMDBlZDllMTQ2ZDY0IiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D&pageName=ReportSection">
              </iframe>
            </div>
            <div style="width:100%; padding: 5px; 10px;"> {{report.chartRemarks[chartIndex]}} </div>
          </div>
          <hr class="marginTopBot5"/>
          <div v-if=" isPrint && chartIndex != report.reportsIncluded.length - 1" class="space-inline size10 marginBottom85">
            <p> Department of Health - Metro Manila Center for Health Development </p>
            <p> {{report.title}} | Page {{chartIndex+1}}</p>
          </div>
        </div>
      </div>

      <div class="addReportInnerContainter">

        <!-- BOTTOM : prepare + submit buttons -->
        <div class="marginTopBot5 padding5 alignTop">
          <!-- name -->
          <div class="space-inline alignStart block marginBottom15">
            <div class="grid">
              <div class="inline alignCenter marginTopBot2">  <span class="width105"> Prepared By: </span>
                <span class="approval-people"> <b> &nbsp;{{report.preparedBy}} </b> </span>
              </div>
              <div class="inline alignCenter marginTopBot2">  <span class="width105"> Prepared On: </span>
                <span class="approval-people"> <b> &nbsp;{{report.dateTime}} </b> </span>
              </div>
              <div class="inline alignCenter marginTopBot2"></div>
            </div>
            <div class="grid">
              <div class="inline alignCenter marginTopBot2">  <span class="width155"> Noted By: </span>
                <img class="width20" src="~/assets/img/check.png">
                  <span class="approval-people"> <b> &nbsp;{{report.notedBy}} </b> </span> <span v-if="report.notedByDate"> &nbsp;({{report.notedByDate}}) </span>
              </div>
              <div class="inline alignCenter marginTopBot2">  <span class="width155"> Recommended By: </span>
                <img class="width20" src="~/assets/img/arrow.png" style="opacity: 0.75;">
                  <span class="approval-people"> <b> &nbsp;{{report.recommendedBy}} </b> </span> <span v-if="report.recommendedByDate"> &nbsp;({{report.recommendedByDate}}) </span>
              </div>
              <div class="inline alignCenter marginTopBot2">  <span class="width155"> Approved By: </span>
                <img class="width20" src="~/assets/img/circle.png" style="opacity: 0.3;">
                  <span class="approval-people"> <b> &nbsp;{{report.approvedBy}} </b></span> <span v-if="report.approvedByDate"> &nbsp;({{report.approvedByDate}}) </span>
              </div>
            </div>
          </div>
          <div v-show="isPrint" class="padding15 border margin20 marginBottom115">
            <span class="italics"> *NOTE: Case counts reported here do NOT represent the final number and are subject to change after inclusion of delayed reports and eview of cases.
            Data Source: 2022  </span>
          </div>
          <!-- buttons -->
          <div style="margin: -10px 0 5px; float: right">
            <!-- <button v-if="pageNum == 0" class="back-button" type="button">
              <nuxt-link to="/addCase"> Cancel </nuxt-link>
            </button> -->
            <!-- <button class="next-button" type="button" @click="submit()">
              Submit
            </button> -->
          </div>
        </div>

        <hr class="marginTopBot5"/>

        <!-- APPROVAL / REMARKS -->

        <div v-if="!isPrint " class="paddingTopBot25">
          <div>
            <div class="inline marginTopBot2">
              <legend for="status" class="inputLegend required"> Status (from person name): </legend>
              <select id="status" v-model="status" type="text" class="input-form-field marginLeft5"
                :class="isRequired()" required>
                <option value="approve"> Approve </option>
                <option value="for revision"> For Revision </option>
                <option value="decline"> Decline </option>
              </select>
            </div>
            <div style="margin: -30px 0 0; float: right;">
              <button class="back-button" type="button" @click="submit()">
                Cancel
              </button>
              <button class="next-button" type="button" @click="submit()">
                Submit
              </button>
            </div>
        </div>
          <div>
            <legend for="remarks" class="inputLegend"> Remarks / Comments: </legend>
            <textarea id="remarks" v-model="remarks" class="input-form-field" :class="isRequired()" 
                style="resize: vertical;width:100%; height: 100px; padding: 5px; 10px;"/>
          </div>
        </div>

        <hr class="marginTopBot5"/>

        <!-- Historry -->
        <div v-show="!isPrint" id="case-investigation-form" class="center">
          <h3 class="caps chartTitle marginBottom5"> Report History </h3>
          <dataTable
          :options="tableOptions"
          :datavalues="dataSet"
          :casetype="'feedbackReport'"
          />
        </div>

      </div>
    </div>
  </div>
</template>

<script>
// import jsPDF from 'jspdf'
// import html2canvas from 'html2canvas'
import dataTable from './dataTable.vue'

export default {
  components: { dataTable, },
  middleware: 'is-auth',
  data() {
    return {
      status:'',
      remarks: '',
      isPrint: false,
      editReport: false,
      isValidated: true,
      today:'',
      timeUnit:'',
      report: {
        status: 'Pending',
        title: 'THe Best Report',
        type: 'Weekly',
        year: '2020',
        duration: 'Week 54',
        disease: 'Dengue',
        reportsIncluded: ['Person Analysis', 'Summary1', 'Summary2', 'Time Analysis'],
        chartRemarks: ['AB', 'ABC1', 'ABC2', 'ABCD',],

        preparedBy: 'Secret',
        dateTime: 'Feb 29 2022',

        notedBy: 'me',
        notedByDate: 'Jan 28, 2013',
        recommendedBy: 'mysef',
        recommendedByDate: 'Feb 02, 2013',
        approvedBy: 'I',
        approvedByDate: '',
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

      tableOptions: {
        tableName: 'cases',
        sortKey: '',
        columns: [
          {
            title: 'Date',
            key: 'date',
            type: 'text',
            dateFormat: true,
            currentFormat: 'YYYY-MM-DD',
            expectFormat: 'DD MMM YYYY',
            // sortable: true,
          },
          {
            title: 'Action', // approve, decline, edit, comment, etc.
            key: 'action',
          },
          {
            title: 'By',
            key: 'actor',
          },
          {
            title: 'Remarks',
            key: 'remarks',
            type: 'text',
            source: 'cases',
            uniqueField: 'id',
            sortable: true,
            filter: true,
          },
        ],
        // source: 'http://demo.datatable/api/users',
        search: false,
      },
      dataSet: [
        {
          date:'today',
          action: 'approve',
          actor: 'me',
          remarks: 'nice report ...',
        },
      ]
    }
  },
  head() {
    return {
      title: 'View Feedback Report'
    }
  },
  mounted() {
    this.yearOption= [2022, 2021, 2020, 2019, 2018];
    this.monthOption= ['January', 'February', 'March', 'April', 'May',
      'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    for (let i=0; i<52; i++) this.weekOption[i] = 'Week ' + (i+1);
    setInterval(() => { this.getDate() }, 60000)
  },
  methods: {
    getColor(status) {
      switch (status) {
        case 'Approved': return 'greenB';
        case 'Pending': return 'blueB';
        case 'For Revision': return 'orangeB';
        case 'Declined': return 'redB';
      }
    },
    isRequired() {  if (!this.isValidated) return 'input-required'; },
    isOptionRequired() { if (!this.isValidated && this.report.reportsIncluded.length < 1) return 'input-required'; },
    inputEdit() { return false; },
    getMinClass(index, reportCount) {
      if (!this.isPrint) return '';
      else if (index === 0) return 'fullHeightFirst';
      else if (index === reportCount-1) return '';
      else return 'fullHeightNotFirst';
    },
    validate() {
      if (this.status === '' || this.status === null) this.validate = false;
      else this.validate = true;
    },
    submit(action) {
      if (action === 'Cancel') {
        // 
      }
      else {
        this.validate();
        // SAVE SAVE in db
      }
    },
    downloadPDF() {
      
      this.isPrint = true;
      window.print();
      setTimeout(() => (this.isPrint = false), 10000);
      
      /*
      this.isPrint = !this.isPrint

      const pWidth = 595.28 // 595.28 is the width of a4
      const srcWidth = this.$refs.content.scrollWidth
      const margin = 12 // narrow margin - 1.27 cm (36);
      const scale = (pWidth - margin * 2) / srcWidth

      // eslint-disable-next-line new-cap
      const doc = new jsPDF('p', 'pt', 'A4')
      window.html2canvas = html2canvas

      doc.html(this.$refs.content, {
        x: margin,
        y: margin,
        html2canvas: {
          // eslint-disable-next-line object-shorthand
          scale: scale,
        },
        // eslint-disable-next-line object-shorthand
        callback: function () {
          window.open(doc.output('bloburl'))
        },
      })

      // doc.save('test.pdf')
      console.log(this.$refs.content)
      setTimeout(() => (this.isPrint = !this.isPrint), 5000)

      */
    },
  }
}
</script>

<style>
body {font-family: 'Work Sans', sans-serif;}
.addReportOuterContainer { padding: 80px 20px 50px 20px;}
.addReportInnerContainter { /* width: 100%; */ padding: 5px; margin: 10px; }

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
.paddingSide10 { padding: 0 10px; }
.paddingSide20 { padding: 0 20px; }
.paddingSide25 { padding: 0 25px; }
.paddingSide30 { padding: 0 30px; }
.margin5 { margin: 5px;}
.margin10 { margin: 10px;}
.margin20 { margin: 20px;}
.margin30 { margin: 30px;}
.marginTop-1 { margin-top: -1px;}
.marginTop-5 { margin-top: -5px;}
.marginTop5 { margin-top: 5px;}
.marginTop10 { margin-top: 10px;}
.marginTop15 { margin-top: 15px;}
.marginTop20 { margin-top: 20px;}
.marginTop30 { margin: 30px 0 0 0;}
.marginBottom-5 { margin-bottom: -5px;}
.marginBottom-15 { margin-bottom: -15px;}
.marginBottom-25 { margin-bottom: -25px;}
.marginBottom-40 { margin-bottom: -40px;}
.marginBottom-50 { margin-bottom: -50px;}
.marginBottom5 { margin-bottom: 5px;}
.marginBottom15 { margin-bottom: 15px;}
.marginBottom25 { margin-bottom: 25px;}
.marginBottom50 { margin-bottom: 50px;}
.marginBottom60 { margin-bottom: 60px;}
.marginBottom80 { margin-bottom: 80px;}
.marginBottom85 { margin-bottom: 85px;}
.marginBottom90 { margin-bottom: 90px;}
.marginBottom100 { margin-bottom: 100px;}
.marginBottom115 { margin-bottom: 115px;}
.marginBottom120 { margin-bottom: 120px;}
.marginTopBot5 { margin: 5px 0;}
.marginTopBot10 { margin: 10px 0;}
.marginTopBot2 { margin: 2px 0;}
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

.inline { display: inline-flex; }
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

.form-header {
  text-align: left;
  padding-left: 5px;
  margin-bottom: 5px;
  font-weight: 600;
  font-size: 20px;
  background-color: #346083;
  color: transparent;
  text-shadow: 1px 1px, -1px -1px rgba(0, 0, 0, 0.25);
  -webkit-background-clip: text;
  -moz-background-clip: text;
  background-clip: text;
}

.space-inline {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* align-items: center; */
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
    /* border: 1px solid black; */
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
  /* width: 100%; */
  height: 415px;
  background: lightgray;
}

.chartTitle {
    font-weight: 600;
    font-size: 20px;
    /* background-color: #008d41;
    color: transparent;
    text-shadow: 1px 1px, -1px -1px rgb(0 0 0 / 25%);
    -webkit-background-clip: text; */
}

.report-powerbi-iframe {
  height: 100%;
  background-color: gray;
  width: 100%;
  /* border-radius: 10px; */
  /* margin-left: 5px;
  margin-top: 5px; */
}

.approvalPeople {
    font-size: 16px;
    font-family: 'Work Sans', sans-serif;
    padding-right: 5px;
    padding-left: 5px;
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

.width155 { width: 155px; }
.width105 { width: 105px; }
.fullHeightFirst { min-height: 725px;} /* 1000-265 - 10 */
.fullHeightNotFirst { min-height: 900px; }
.input-required:invalid {  box-shadow: 0 0 5px #d45252; border-color: hsl(0, 76%, 50%); /* background-color: #ff6961; */ }
/* .input-required{ border-color: hsl(0, 76%, 50%); } */
.required:after { content: '*'; color: red; }

.greenB { background: #008d41; }
.blueB { background: #346083; }
.orangeB { background: orange; }
.redB { background: red; }
.lightgrayB {background: #f2f2f2;}
.darkerlightgrayB {background: lightgray;}
.whiteB {background: white;}
.greenC { color: #008d41; }
.blueC { color: #346083; }
.orangeC { color: orange; }
.redC { color: red; }
.lightgrayC {color: #f2f2f2;}
.darkerlightgrayC {color: lightgray;}
.whiteC {color: white;}

</style>