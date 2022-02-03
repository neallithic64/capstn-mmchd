<template>
  <div>
    <TopNav v-show="!isPrint"/>
    <!-- Rest of the screen -->
    <div ref="content" :class="[{ addReportOuterContainer: !isPrint }, { padding20 : isPrint, }, { paddingTop75 : isPrint, },]">
      <!-- HEADER -->
      <div class="centerSide paddingSide25">
        <div class="space-inline">
          <h1 class="textAlighRight greenC weight800 size32 marginTop2 marginBottom-3"> Feedback Report {{report.reportID}} </h1>
          <div class="viewRep-mainStatus marginLeft10 marginTop10" :class="getColor(report.status)"> {{report.status}} </div>
        </div>
        <div class="space-inline marginTop5">
          <h3 class="weight500 size18"> {{report.title}} </h3>
          <h3 class="weight500 size18">
              {{report.reportType}} Report - {{report.year}}
              <span v-if="report.duration!==''">, {{report.duration}} </span> 
          </h3>
          <h3 class="weight500 size18"> {{report.diseaseName}} </h3>
        </div>
        <hr class="marginTopBot10" id="2"/>
      </div>

      <!-- PDF -->
      <div class="addReportInnerContainter width100" style="text-align: -webkit-center;">
        <iframe></iframe>
      </div>

      <div class="addReportInnerContainter">
        <hr class="marginTopBot10" id="3"/>
        <!-- BOTTOM : prepare + submit buttons -->
        <div class="marginTopBot5 padding5 alignTop">
          <!-- name -->
          <div class="space-inline alignStart block marginBottom30">
            <div class="grid">
              <div class="inlineFlex alignCenter marginTopBot2">  <span class="width105"> Prepared By: </span>
                <span class="approval-people"> <b> &nbsp;{{report.dateCreated}} </b> </span>
              </div>
              <div class="inlineFlex alignCenter marginTopBot2">  <span class="width105"> Prepared On: </span>
                <span class="approval-people"> <b> &nbsp;{{report.dateCreated}} </b> </span>
              </div>
              <div class="inlineFlex alignCenter marginTopBot2"></div>
            </div>
            <div class="grid">
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

        <hr class="marginTopBot5" id="5"/>
        </div>

        <!-- APPROVAL / REMARKS -->

        <div v-show="(!isPrint && isAssess) && 
            ($auth.user.userType === 'lhsdChief' || $auth.user.userType === 'resuHead' ||
             $auth.user.userType === 'chdDirector' || $auth.user.userType === 'techStaff')"
         class="marginTopBot20 padding5">
          <div>
            <div class="inlineFlex marginTopBot2">
              <legend for="inputStatus" class="inputLegend required"> Status (from person name): </legend>
              <select id="inputStatus" v-model="inputStatus" type="text" class="input-form-field marginLeft5"
                :class="isRequired()" required>
                <option value="Approve"> Approve </option>
                <option value="Reject"> Reject </option>
              </select>
            </div>
          </div>
          <div>
            <legend for="inputRemarks" class="inputLegend"> Remarks / Comments: </legend>
            <textarea id="inputRemarks" v-model="inputRemarks" class="input-form-field width100" :class="isRequired()" 
                style="resize: vertical; height: 100px; padding: 5px; 10px;"/>
          </div>
          <div class="marginTop5" style="display: flex; justify-content: right;">
            <button class="viewRep-backButton" type="button" @click="submit('cancel')">
              Cancel
            </button>
            <button class="viewRep-nextButton" type="button" @click="submit('submit')">
              Submit
            </button>
          </div>
        <hr class="marginTop30" />
        </div>

        <!-- Historry -->
        <div v-show="!isPrint" id="case-investigation-form" class="center">
          <h3 class="caps viewRep-chartTitle marginBottom5 viewRep-formHeader"> Report History </h3>
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
import dataTable from './dataTable.vue'
const axios = require("axios");
// import jsPDF from 'jspdf'
// import html2canvas from 'html2canvas'

export default {
  components: { dataTable, },
  middleware: 'is-auth',
  data() {
    return {
      isPrint: false,
      isAssess: false,
      isRevise: false,
      isValidated: true,
      inputStatus:'',
      inputRemarks: '',
      inputChartRemarks: [],
      today:'',
      timeUnit:'',
      report: {
	    reportID: '',
        status: '',
        title: '',
        reportType: '',
        year: '',
        duration: '',
        diseaseName: '',
        reportsIncluded: [],
        chartRemarks: [],
        dateCreated: '',
        // dateTime: '',

        notedBy: '',
        notedByDate: '',
        recommendedBy: '',
        recommendedByDate: '',
        approvedBy: '',
        approvedByDate: '',
      },
      tableOptions: {
        tableName: 'cases',
        sortKey: '',
        columns: [
          {
            title: 'Date',
            key: 'dateModified',
            type: 'text',
            dateFormat: true,
            currentFormat: 'YYYY-MM-DD',
            expectFormat: 'DD MMM YYYY',
            // sortable: true,
          },
          {
            title: 'Action', // approve, Reject, edit, comment, etc.
            key: 'action',
          },
          {
            title: 'By',
            key: 'modifiedBy',
          },
          {
            title: 'Remarks',
            key: 'remarks',
          },
        ],
        // source: 'http://demo.datatable/api/users',
        search: false,
      },
      dataSet: [
        {
          dateModified: 'today',
          action: 'approve',
          modifiedBy: 'me',
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
  async mounted() {
    const today = new Date();
    const hour = today.getHours()>9 ? today.getHours() : '0'+today.getHours()
    const mins = today.getMinutes()>9 ? today.getMinutes() : '0'+today.getMinutes()
    const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Aug', 'Oct', 'Nov', 'Dec'];
    this.today = monthsList[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear()
                      + ' ' + hour + ':' + mins;

    for (let i=0; i<this.report.chartRemarks.length; i++) this.inputChartRemarks[i] = this.report.chartRemarks[i];
    if (this.report.status === 'For Approval') this.isAssess = true;

    const pdfFile = await axios.get("http://localhost:8080/api/getFileBlob", {
	  params: {reportID: this.$route.query.reportID}
	});
	// console.log(pdfFile.data);
	const pdfPreview = document.querySelector('iframe');
	pdfPreview.src = pdfFile.data;
	pdfPreview.classList.add("width100");
	pdfPreview.style = "height: 70vh;"
	
	// report data
    const reportData = (await axios.get("http://localhost:8080/api/getReport", {
	  params: { reportID: this.$route.query.reportID }
	})).data;
	console.log(reportData);
	for (let i = 0; i < reportData.dataSet.length; i++) {
	  reportData.dataSet[i].dateModified = reportData.dataSet[i].dateModified
	    ? this.convDatePHT(new Date(reportData.dataSet[i].dateModified))
		: "N/A";
	}
	this.dataSet = reportData.dataSet;
	
	reportData.report.dateCreated = reportData.report.dateCreated
	  ? this.convDatePHT(new Date(reportData.report.dateCreated))
	  : "N/A";
	reportData.report.approvedByDate = reportData.report.approvedByDate
	  ? this.convDatePHT(new Date(reportData.report.approvedByDate))
	  : "N/A";
	reportData.report.reportsIncluded = JSON.parse(reportData.report.reportsIncluded);
	reportData.report.chartRemarks = JSON.parse(reportData.report.chartRemarks);
	this.report = reportData.report;
  },
  methods: {
    getColor(status) {
      switch (status) {
        case 'Approved': return 'greenB';
        case 'For Approval': return 'darkGrayB';
        case 'Rejected': return 'redB';
      }
    },
    isRequired() {  if (!this.isValidated) return 'input-required'; },
    inputEdit() { return false; },
    chartRemarkClass() { 
      if (this.isRevise && !this.isValidated) return 'whiteB input-required';
      else if (this.isRevise) return 'whiteB';
    },
    getMinClass(index, reportCount) {
      if (!this.isPrint) return 'viewRep-chartContainerView';
      else if (index === 0) return 'fullHeightFirst';
      else if (index === reportCount-1) return '';
      else return 'fullHeightNotFirst';
    },
    validate() {
      if (this.inputStatus === '' || this.inputStatus === null) this.isValidated = false;
      else this.isValidated = true;
    },
    submit(action) {
      if (action === 'cancel') {
        // CANCEL ASSESSMENT / one with drop down
        this.isAssess = false;
        this.inputStatus = '';
        this.inputRemarks = '';
      }
      else {
        // SUBMIT ASSESSMENT (drop down)
        this.validate();
        if (!this.isValidated) this.$toast.error('Please select a status!', {duration: 4000, icon: 'error'});
        else { // eslint-disable-next-line no-lonely-if
          if (this.inputStatus === 'Approve') {
            this.report.status = 'Approved';
            this.report.approvedByDate = this.today;
          }
          else if (this.inputStatus === 'Reject') this.report.status = 'Rejected';
          // QUESTION: what happens pag nareject, does the 3 people sa lower part have to change (if so, use x.png)
          this.isAssess = false;

          // TO DO: SAVE SAVE in db
          this.$toast.success('Status saved!', {duration: 4000, icon: 'check_circle'});
        }
      }
    },
    print() {window.print();},
    downloadPDF() {
      this.isPrint = true;
      // window.addEventListener('load', function () {
      if (this.isPrint) {
        setTimeout(() => (this.print()), 10);
        setTimeout(() => (this.isPrint=false), 1000);
        // window.onafterprint = function(){
        //   this.isPrint = false;
        // }
          // setTimeout(() => (this.isPrint = false), 10000);
        }
      // })
    },
	convDatePHT(d) { // only accepts Date object; includes checking
      return !isNaN(Date.parse(d))
	      ? (new Date(d.getTime() + 28800000)).toISOString().substr(0, 10).split("-").join("/")
		  : "N/A";
    },
  }
}
</script>

<style>
body {font-family:Arial, Helvetica, sans-serif}
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

.viewRep-formHeader {
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

.viewRep-actionStatusButton {
    display: -webkit-inline-box;
    margin-top: -10px;
    padding-top: 5px;
}

.viewRep-mainStatus {
  padding: 3px 15px 4px;
  border-radius: 22px;
  color: white;
  font-weight: 900;
  font-size: 20px;
  width: fit-content;
  float: right;
}

.viewRep-chartContainerView {
    margin: 15px 10px 10px;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.25));
    background-color: #f2f2f2;
}

.viewRep-chartContainer {
  border: lightgray solid 1px;
  /* width: 100%; */
  height: 415px;
  background: lightgray;
}

.viewRep-chartTitle {
    font-weight: 600;
    font-size: 20px;
    /* background-color: #008d41;
    color: transparent;
    text-shadow: 1px 1px, -1px -1px rgb(0 0 0 / 25%);
    -webkit-background-clip: text; */
}

.viewRep-report-powerbi-iframe {
  height: 100%;
  background-color: gray;
  width: 100%;
  /* border-radius: 10px; */
  /* margin-left: 5px;
  margin-top: 5px; */
}

.viewRep-approvalPeople {
    font-size: 16px;
    padding-right: 5px;
    padding-left: 5px;
}

.viewRep-backButton {
    width: 150px;
    height: 38px;
    max-width: 100%;
    font-size: 16px;
    font-weight: 600;
    background-color: white;
    color: #346083;
    margin-right: 10px;
  }

.viewRep-backButton:hover {
  border: #346083 solid 1px;
}

.viewRep-nextButton {
  width: 150px;
  height: 38px;
  max-width: 100%;
  font-size: 16px;
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
.fullHeightFirst { min-height: 740px;} /* 1000-265 - 10 + 15 (removed from margin bottom) */
.fullHeightNotFirst { min-height: 915px; }
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