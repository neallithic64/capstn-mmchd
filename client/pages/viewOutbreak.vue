<template>
  <div id="viewOB">
    <!--Top Bar of the screen-->
    <TopNav/>
    <div ref="content" class="viewOB-container">
      <div v-if="outbreak.responseTime === 'N/A'" id="countdown-container">
        <client-only>
          <Countdown :deadline="resDeadline"></Countdown>
        </client-only>
        <span style="font-weight: 600;"> TIME LEFT FOR INITIAL RESPONSE </span>
      </div>
      <div class="viewOB-details" style="align-text: left">
        <div class="OBnumbers">
          <h1 style="margin: -10px 0">Outbreak No. {{ outbreak.outbreakID }}</h1>
          <h2 style="margin-top: -1px">
            {{ outbreak.diseaseName }}
          </h2>
        </div>
        <div class="OBstatus" style="align-text: right">
          <span style="display: inline-flex; align-items: center"
            >Outbreak Status:&nbsp;
            <div v-show="!editStatus" class="OBActionButtons">
              <h1 style="line-height: 1; align-items: center">
                {{ outbreak.outbreakStatus }}
              </h1>
              <ul
                v-show="!isPrint"
                class="OBEdit"
                @click="popup()"
              >
                <img src="~/assets/img/pen.png" />
              </ul>
            </div>
          </span>
          <div v-show="!editStatus && !isPrint" class="OBActionButtons">
            <img
              src="~/assets/img/pdf.png"
              class="printCaseButton"
              @click="downloadPDF"
            />
          </div>
        </div>
      </div>
      <div class="viewOB-details" style="align-text: left">
        <div class="CIFnumbers">
          <p>Date Started: <b> {{ outbreak.startDate }} </b></p>
          <p>Date Closed: <b> {{ outbreak.endDate }} </b></p>
        </div>
      </div>

      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <div v-show="!isPrint" class="OB-SummaryContainer">
          <ul
            v-for="(value, name, i) in formSection.formNames"
            :key="i"
            :class="formListClass(i)"
            @click="move(i)"
          >
            {{
              i+1
            }}.{{
              value
            }}
          </ul>
        </div>
        <a href="/addReport"> <button class="make-report-button2" > + Make a Feedback Report </button> </a>
      </div>

      <div class="viewOBform-component">

        <form v-show="pageNum == 0 || isPrint" id="ob1" type="submit">
          <div id="case-report-form" class="center" style="margin-bottom: 45px;">
            <h2 id="form-header">
              {{ Object.values(formSection.formNames)[0] }}
            </h2>

            <div class="OB-summary">
              <dataTable
                :options="obSummaryOptions"
                :datavalues="obSummary"
                :casetype="'obSummary'"
              />
            </div>
          </div>
        </form>

        <hr v-if="isPrint" />

        <form v-show="pageNum == 1 || isPrint" id="ob2" type="submit">
          <div id="case-report-form" class="center" style="margin-bottom: 45px;">
            <h2 id="form-header"> {{ Object.values(formSection.formNames)[1] }} </h2>

            <div class="OB-cases">
              <dataTable
                :options="obCasesOptions"
                :datavalues="obCases"
                :casetype="'obCases'"
              />
            </div>
          </div>
        </form>

        <hr v-if="isPrint" />
      
      </div>

      <div v-if="pageNum == 0 || isPrint" id="risk-legend">
        <div id="risk-col">
          <p style="font-weight: 600;"> Risk Classification Legend </p>
          <p style="color: white; background: red; font-weight: 400; padding: 3px;"> High Risk </p>
          <p style="color: white; background: #FC8F00; font-weight: 400; padding: 3px;"> Moderate Risk </p>
          <p style="color: white; background: #008d41; font-weight: 400; padding: 3px;"> Low Risk</p>
        </div>
        <div id="risk-col" style="margin-left: 8px;">
          <p style="font-weight: 600;"> Growth Rate </p>
          <p style="font-weight: 400; padding: 3px;"> &gt;{{ grHighRisk }}% </p>
          <p style="font-weight: 400; padding: 3px;"> &gt;{{ grMod1Risk }}% to &lt;={{ grMod2Risk }}% </p>
          <p style="font-weight: 400; padding: 3px;"> &lt;={{ grLowRisk }}% </p>
        </div>
        <div id="risk-col" style="margin-left: 5px;">
          <p style="font-weight: 600;"> Attack Rate </p>
          <p style="font-weight: 400; padding: 3px;"> &gt;{{ arHighRisk }} </p>
          <p style="font-weight: 400; padding: 3px;"> &gt;{{ arMod1Risk }} to &lt;={{ arMod2Risk }} </p>
          <p style="font-weight: 400; padding: 3px;"> &gt;{{ arLowRisk }} </p>
        </div>
      </div>

      <div class="OB-statusHistory">
        <h2 style="border-bottom: gray solid; width: fit-content; padding: 0 7px 0 5px;">Outbreak Status History</h2>
        <dataTable
          :options="historyOptions"
          :datavalues="eventHistory"
          :casetype="'patient'"
        />
      </div>
    </div>

    <div v-show="editStatus" class="overlay">
      <div class="overlay-form">
        <button class="close" @click="statusAction('cancel')">x</button>
        <div class="field-row" style="display: inline-flex; margin-bottom: -1 px">
          <div class="field">
            <h2 id="form-header" class="required">
              Please select the outbreak status.
            </h2>
            <div>
              <!-- <div style="display: inline-flex; flex-direction: column"> -->
              <!-- CASE DEFINITION -->
              <div>
                <div class="collpaseWrapper">
                  <ul v-for="(value, name, i) in eventLevels" :key="i" style="displayLinline-flex">
                    <li>
                      <input :id="name" type="checkbox" class="collapseInput"/>
                      <label :for="name" class="collapseLabel">
                        <input
                          :id="name"
                          v-model="auditLog.newStatus"
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
                <!-- Remarks -->
                <div class="field-row" style="margin-left: 0px">
                  <div class="field">
                    <label for="remarks" class="required">
                      Remarks
                    </label>
                    <textarea 
                      id="outbreakRemarks"
                      v-model="auditLog.remarks"
                      class="textarea-form-field"
                      type="text"
                      name="remarks"/>
                  </div>
                </div>
              </div>
            </div>
            <div style="margin: -10px 10 5px; float: right; margin-left: auto;">
              <button class="back-button" type="button" @click="statusAction('cancel')">
                Cancel
              </button>
              <button class="next-button" type="button" @click="statusAction('save')">
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
import Countdown from 'vuejs-countdown'
export default {
  components: {
    dataTable,
    Countdown
  },
  middleware: 'is-auth',
  header: {
    title: 'View Health Event',
  },
  compute: {},
  data() {
    return {
      grLowRisk: 0,
      grMod1Risk: 0,
      grMod2Risk: 200,
      grHighRisk: 200,
      arLowRisk: 1,
      arMod1Risk: 1,
      arMod2Risk: 7,
      arHighRisk: 7,
      editStatus: false,
	  resDeadline: '',
      auditLog: {
        newStatus: '',
        remarks: '',
      },
      isDisabled: false,
      editCase: false,
      isPrint: false,
      pageNum: 0,
      dateLastUpdated:'',
      obSummaryOptions: {
        tableName: 'summary',
        columns: [
          {
            title: 'City',
            key: 'city',
            type: 'text',
            source: 'outbreak',
            uniqueField: 'id',
          },
          {
            title: 'Total Active Cases',
            key: 'numCases',
            type: 'text',
            source: 'outbreak'
          },
          {
            title: 'Growth Rate',
            key: 'growthRate',
            type: 'text',
            source: 'outbreak'
          },
          {
            title: 'Attack Rate per 100k',
            key: 'attackRate',
            type: 'text',
            source: 'outbreak'
          },
          {
            title: 'Risk Classification',
            key: 'risk',
            type: 'text',
            source: 'outbreak',
            filter: true,
          },
        ]
      },
      obCasesOptions: {
        tableName: 'obcases',
        columns: [
          {
            title: 'Case ID',
            key: 'caseID',
            type: 'clickable',
            source: 'cases',
            uniqueField: 'id',
            sortable: true,
          },
          {
            title: 'DRU ID',
            key: 'druName',
            type: 'text',
            source: 'cases',
            uniqueField: 'id',
          },
          {
            title: 'City',
            key: 'city',
            type: 'text',
            source: 'cases',
            uniqueField: 'id',
            sortable: true,
            filter: true,
          },
          {
            title: 'Submitted on',
            key: 'reportDate',
            type: 'text',
            dateFormat: true,
            currentFormat: 'YYYY-MM-DD',
            expectFormat: 'DD MMM YYYY',
            // sortable: true,
          },
          {
            title: 'Last updated',
            key: 'updatedDate',
            type: 'text',
            dateFormat: true,
            currentFormat: 'YYYY-MM-DD',
            expectFormat: 'DD MMM YYYY',
            sortable: true,
          },
          {
            title: 'Case Status',
            key: 'caseLevel',
            type: 'text',
            source: 'cases',
            uniqueField: 'id',
            sortable: true,
            filter: true,
          },
        ],
      },
      historyOptions: {
        tableName: 'cases',
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
            title: 'From',
            key: 'prevValue',
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
            title: 'Remarks',
            key: 'remarks',
            type: 'text',
            source: 'cases',
          },
          {
            title: 'Reported By',
            key: 'druName',
            type: 'text',
            source: 'cases',
            uniqueField: 'id',
          },
        ],
        // source: 'http://demo.datatable/api/users',
        search: true,
      },
      eventHistory: [],
      obSummary: [],
      obCases: [],
      outbreak: {
        outbreakID: '123',
        diseaseName: 'Measles',
        startDate: '2021-12-31',
        numCases: '200',
        numDeaths: '0',
        growthRate: '813%',
        attackRate: '1.07',
        outbreakStatus: 'Ongoing',
        endDate: 'N/A'
      },
      formSection: {
        formNames: {
          form0: 'Summary',
          form1: 'Cases'
        },
      },
      eventLevels: {
        'Ongoing': 'Other information is still on verification; Specimens are to be collected and pending laboratory results; The concerned team is currently monitoring the event; The concerned team is currently monitoring the event; There are continuous additional cases or deaths',
        'Ongoing with Initial Response': 'Initial response is given to the areas and people involved in the form of a report, feedback, or relief',
        'Controlled': 'Gradual or abrupt decrease of cases; Cases showed good prognosis or event has already been managed but other information is still on verification such as description of cases, laboratory findings, etc.; No cases or deaths had been added',
        'Closed': 'Laboratory results have no significant findings that are potential for endangering health; Cases were already discharged and in good condition; Follow-up reports indicate no further monitoring, assistance and investigation needed'
      }
    }
  },
  async fetch() {
    const data = (await axios.get('http://localhost:8080/api/getOutbreak?outbreakID=' + this.$route.query.outbreakID)).data;
    this.outbreak = data.outbreak;
    this.outbreak.startDate = this.convDatePHT(new Date(this.outbreak.startDate));
    this.outbreak.endDate = this.outbreak.endDate ? this.convDatePHT(new Date(this.outbreak.endDate)) : "N/A";
    this.outbreak.responseTime = this.outbreak.responseTime ? this.outbreak.responseTime : "N/A";
	
    this.eventHistory = data.outbreakAudit;
    for (let i = 0; i < this.eventHistory.length; i++) {
	  this.eventHistory[i].dateModified = this.eventHistory[i].dateModified
	    ? this.convDatePHT(new Date(this.eventHistory[i].dateModified))
		: "N/A";
	}
	
    this.obCases = data.outbreakCases;
	for (let i = 0; i < this.obCases.length; i++) {
	  this.obCases[i].reportDate = this.obCases[i].reportDate
	    ? this.convDatePHT(new Date(this.obCases[i].reportDate))
		: "N/A";
	  this.obCases[i].updatedDate = this.obCases[i].updatedDate
	    ? this.convDatePHT(new Date(this.obCases[i].updatedDate))
		: "N/A";
	}
	
    this.obSummary = data.outbreakSumm;
    for (let i = 0; i < this.obSummary.length; i++) {
      this.obSummary[i].numCases = this.obSummary[i].numCases ? this.obSummary[i].numCases : 0;
      this.obSummary[i].attackRate = this.obSummary[i].attackRate ? this.obSummary[i].attackRate : "0.00";
      this.obSummary[i].growthRate = this.obSummary[i].growthRate
          ? (parseFloat(this.obSummary[i].growthRate) * 100).toFixed(2) + "%"
          : "0.00%";
      if (this.obSummary[i].growthRate > this.grHighRisk)
        this.obSummary[i].risk = "High";
      else if (this.obSummary[i].attackRate > this.arHighRisk)
        this.obSummary[i].risk = "High";
      else if (this.obSummary[i].growthRate > this.grMod1Risk && this.obSummary[i].growthRate <= this.grMod2Risk)
        this.obSummary[i].risk = "Moderate";
      else if (this.obSummary[i].attackRate > this.arMod1Risk && this.obSummary[i].attackRate <= this.arMod1Risk)
        this.obSummary[i].risk = "Moderate";
      else this.obSummary[i].risk = "Low";
    }
	
	this.resDeadline = (new Date((new Date(this.outbreak.startDate)).getTime() + 115200000)).toString();
  }, 
  head() {
    return {
      title: 'Outbreak ' + this.outbreak.outbreakID
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
      if (this.pageNum === 6) return false;
      else return true;
    },
    statusInputEdit(value) {
      if (this.editStatus & value!==this.outbreak.outbreakStatus ) return false
      else return true
    },
    popup() {
      this.editStatus = !this.editStatus
    },
    async statusAction(change) {
      if (change==='save') {
        const updateCase = await axios.post('http://localhost:8080/api/updateOutbreakStatus', {
          outbreakID: this.outbreak.outbreakID,
          newStatus: this.auditLog,
          userID: this.$auth.user.userID
        });
        if (updateCase.status === 200) {
          alert('Outbreak status updated!');
          location.reload();
        } else {
          // eslint-disable-next-line no-console
          console.log(result);
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
    convDatePHT(d) { // only accepts Date object; includes checking
      return !isNaN(Date.parse(d)) ? (new Date(d.getTime() + 28800000)).toISOString().substr(0, 10) : "N/A";
    },
  },
}
</script>

<style>
body {
  font-family: 'Work Sans', sans-serif;
  font-weight: 300;
  padding: 0px;
  margin: 0px;
  background-image: none;
}

h3 {
  font-size: 15px;
  font-weight: 600;
}

.viewOB-container {
  padding: 80px 20px 5px 20px;
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .viewOB-ontainer {
    width: 100%;
    align-items: center;
    margin: 0px;
  }
}

.viewOB-section-container {
  /* left: 275px; */
  /* position: relative; */
  /* width: calc(100vw - 320px); */
  /* margin: 5px; */
  width: 100%;
  padding: 5px;
  margin: 10px;
}

@media only screen and (max-width: 800px) {
  .viewOB-section-container {
    width: 95%;
  }
}

.OB-SummaryContainer {
  display: flex;
  flex-direction: row;
  overflow-x: hidden;
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

.viewOBform-component {
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
  .viewOBform-component {
    position: relative;
    top: 0px;
    min-height: fit-content;
    border-radius: 0 0 10px 10px;
  }
}
.viewOB-details {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  justify-content: space-between;
}
.OBnumbers,
.OBstatus {
  display: inline-flex;
  flex-direction: column;
}

h1 {
  color: #008d41;
  font-size: 40px;
  font-weight: 800;
}

h2 {
  color: #346083;
  font-size: 25px;
  font-weight: 600;
}

b {
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

.OBActionButtons {
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

.OBEdit {
  width: 30px;
  height: 30px;
  padding: 5px;
}

/* #saveIcon:hover {
  background: url("~/assets/img/saved.png");

} */

.OB-statusHistory {
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
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(100, 100, 100, 0.4);
  /* border: 100px solid rgba(100, 100, 100, 0.4); */
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

#risk-legend {
  font-size: 10px;
  display: flex;
  flex-direction: row;
  /* justify-content: flex-end; */
}

#risk-col {
  font-size: 10px;
  display: flex;
  flex-direction: column;
  /* justify-content: end; */
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

.textarea-form-field {
    width: 100%;
    height: 100px;
    font-size: 16px;
    font-family: 'Work Sans', sans-serif;
    padding-right: 5px;
    padding-left: 5px;
    /* border: 1p x solid rgba(0, 0, 0, 0.25); */
    border: 1px solid #a3a3a3;
    box-sizing: border-box;
    border-radius: 9px;
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

#countdown-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(to bottom right, #b02e0c, #eb4511);;
  color: white;
  margin-bottom: 15px;
  padding-bottom: 5px;
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

.make-report-button2 {
  width: 220px;
  height: 30px;
  font-size: 14px;
  font-family: 'Work Sans', sans-serif;
  font-weight: 600;
  background-color: #008d41;
  color: white;
}

.make-report-button2:hover {
  background-color: #346083;
}
</style>

