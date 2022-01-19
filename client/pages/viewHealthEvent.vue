<template>
  <div id="viewHE">
    <!--Top Bar of the screen-->
    <TopNav/>
    <div ref="content" class="viewHE-container">
      <div class="viewHE-details" style="align-text: left">
        <div class="HEnumbers">
          <h1 style="margin: -10px 0">Event No. {{ healthEvent.eventID }}</h1>
        </div>
        <div class="HEstatus" style="align-text: right">
          <span style="display: inline-flex; align-items: center"
            >Health Event Status:&nbsp;
            <div v-show="!editStatus" class="HEActionButtons">
              <h1 style="line-height: 1; align-items: center">
                {{ status }}
              </h1>
              <ul
                v-show="!isPrint"
                class="HEEdit"
                @click="popup()"
              >
                <img src="~/assets/img/pen.png" />
              </ul>
            </div>
          </span>
          <div v-show="!editStatus && !isPrint" class="HEActionButtons">
            <img
              src="~/assets/img/pdf.png"
              class="printCaseButton"
              @click="downloadPDF"
            />
          </div>
        </div>
      </div>
      <div class="viewHE-details" style="align-text: left">
        <div class="CIFnumbers">
          <p>Date Captured: <b> {{ healthEvent.dateCaptured }} </b></p>
          <p>Time Captured: <b> {{ healthEvent.timeCaptured }} </b></p>
          <p>Location: <b> {{ healthEvent.locBrgy }}, {{ healthEvent.locCity }} </b></p>
        </div>
        <div class="CRFstatus" style="align-text: right">
          <p>Source: <b> {{ healthEvent.source }} </b> </p>
          <p>Reporting Source: <b>{{ healthEvent.reportSource }}</b></p>
        </div>
      </div>
      <div v-show="!isPrint" class="HE-SummaryContainer">
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

      <div class="viewHEform-component">

        <form v-if="pageNum == 0 || isPrint" id="he1" type="submit">
          <div id="case-report-form" class="center">
            <h2 id="form-header">
              {{ Object.values(formSection.formNames)[0] }}
            </h2>

            <div class="field-row-straight">
              <div class="name-field">
                <div style="display: flex; flex-direction: row;">
                  <label for="dateCaptured" class="required"> Date Captured </label>
                </div>
                <input id="dateCaptured" 
                  v-model="healthEvent.dateCaptured"
                  class="input-form-field"
                  type="date"
                  name="dateCaptured"
                  :disabled="inputEdit()"/>
              </div>

              <div class="field">
                <div style="display: flex; flex-direction: row;">
                  <label for="timeCaptured" class="required"> Time Captured</label>
                </div>
                <input 
                  id="timeCaptured"
                  v-model="healthEvent.timeCaptured"
                  class="input-form-field"
                  type="time"
                  name="timeCaptured"
                  :disabled="inputEdit()"
                />
              </div>
            </div>

            <div class="field">
              <div style="display: flex; flex-direction: row;">
                <label for="source" class="required"> Source </label>
              </div>
              <div style="display: inline-flex; align-items: center">
                <input
                  id="print"
                  v-model="healthEvent.source"
                  value="Print"
                  class="input-radio"
                  name="source"
                  type="radio"
                  :disabled="inputEdit()"
                />
                <label for="print"> Print </label>
              </div>
              <div style="display: inline-flex; align-items: center">
                <input
                  id="internet"
                  v-model="healthEvent.source"
                  value="Internet"
                  class="input-radio"
                  name="source"
                  type="radio"
                  :disabled="inputEdit()"
                />
                <label for="internet"> Internet </label>
              </div>
              <div style="display: inline-flex; align-items: center">
                <input
                  id="television"
                  v-model="healthEvent.source"
                  value="Television"
                  class="input-radio"
                  name="source"
                  type="radio"
                  :disabled="inputEdit()"
                />
                <label for="television"> Television </label>
              </div>
              <div style="display: inline-flex; align-items: center">
                <input
                  id="radioSource"
                  v-model="healthEvent.source"
                  value="Radio"
                  class="input-radio"
                  name="source"
                  type="radio"
                  :disabled="inputEdit()"
                />
                <label for="radioSource"> Radio </label>
              </div>
              <div style="display: inline-flex; align-items: center">
                <input
                  id="doh"
                  v-model="healthEvent.source"
                  value="DOH"
                  class="input-radio"
                  name="source"
                  type="radio"
                  :disabled="inputEdit()"
                />
                <label for="doh"> DOH </label>
              </div>
              <div>
                <input
                  id="public"
                  v-model="healthEvent.source"
                  value="Public"
                  class="input-radio"
                  name="source"
                  type="radio"
                  :disabled="inputEdit()"
                />
                <label for="public"> Public </label>
              </div>
            </div>

            <div class="name-field">
              <div style="display: flex; flex-direction: row;">
                <label for="reportSource" class="required"> Reporting Source </label>
              </div>
              <input id="reportSource" 
                v-model="healthEvent.reportSource"
                class="input-form-field"
                type="text"
                name="reportSource"
                :disabled="inputEdit()"
              />
            </div>
          </div>
        </form>

        <hr v-if="isPrint" />

        <form v-if="pageNum == 1 || isPrint" id="he2" type="submit">
          <div id="case-report-form" class="center">
            <h2 id="form-header"> {{ Object.values(formSection.formNames)[1] }} </h2>

            <div class="name-field">
                <div style="display: flex; flex-direction: row;">
                  <label for="eventDetails" class="required"> Health Event </label>
                </div>
                <textarea 
                  id="eventDetails"
                  v-model="healthEvent.eventDetails"
                  class="textarea-form-field"
                  type="text"
                  name="eventDetails"
                  :disabled="inputEdit()"
                />
              </div>

              <!-- Location -->
              <div class="field-row" style="margin-left: 0px">
                <div class="field">
                  <div style="display: flex; flex-direction: row;">
                    <label for="locHouseStreet" class="required"> Street / House No. </label>
                  </div>
                  <input
                    id="locHouseStreet"
                    v-model="healthEvent.locHouseStreet"
                    class="input-form-field"
                    type="text"
                    :disabled="inputEdit()"
                  />
                </div>
              </div>

              <div class="field-row-straight">
                <div class="name-field">
                  <label for="locCity" class="required"> City </label>
                  <input id="locCity" v-model="healthEvent.locCity"
                    class="input-form-field"
                    name="locCity"
                    :disabled="inputEdit()"/>
                </div>

                <div class="field">
                  <label for="locBrgy" class="required"> Barangay </label>
                  <input
                    id="locBrgy"
                    v-model="healthEvent.locBrgy"
                    class="input-form-field"
                    name="locBrgy"
                    :disabled="inputEdit()"/>
                </div>
              </div>

              <!-- Cases -->
              <div class="field-row-straight">
                <div class="field">
                  <div style="display: flex; flex-direction: row;">
                    <label for="numCases" class="required"> Number of Cases </label>
                  </div>
                  <input
                    id="numCases"
                    v-model="healthEvent.numCases"
                    class="input-form-field"
                    type="number"
                    min="0"
                    :disabled="inputEdit()"
                  />
                </div>
                <div class="field">
                  <div style="display: flex; flex-direction: row;">
                    <label for="numDeaths" class="required"> Number of Deaths </label>
                  </div>
                  
                  <input
                    id="numDeaths"
                    v-model="healthEvent.numDeaths"
                    class="input-form-field"
                    type="number"
                    min="0"
                    :disabled="inputEdit()"
                  />
                </div>
              </div>

              <!-- Remarks -->
              <div class="field-row" style="margin-left: 0px">
                <div class="field">
                  <label for="remarks">
                    Remarks
                  </label>
                  <textarea 
                    id="remarks"
                    v-model="healthEvent.remarks"
                    class="textarea-form-field"
                    type="text"
                    name="remarks"
                    :disabled="inputEdit()"/>
                </div>
              </div>

          </div>
        </form>

        <hr v-if="isPrint" />
      
      </div>

      <div class="HE-statusHistory">
        <h2 style="border-bottom: gray solid; width: fit-content; padding: 0 7px 0 5px;">Event Status History</h2>
        <dataTable
          :options="tableOptions"
          :datavalues="eventHistory"
          :casetype="'patient'"
        />
      </div>
    </div>

    <div v-show="editStatus" class="overlay">
      <div class="overlay-form">
        <button class="close" @click="status('cancel')">x</button>
        <div class="field-row" style="display: inline-flex; margin-bottom: -1 px">
          <div class="field">
            <h2 id="form-header" class="required">
              Please select the health event status.
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
    title: 'View Health Event',
  },
  compute: {},
  data() {
    return {
      editStatus: false,
      newStatus: '',
      status:'',
      isDisabled: false,
      editCase: false,
      isPrint: false, 
      pageNum: 0,
      dateLastUpdated:'',
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
      eventHistory: [
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
      healthEvent: {
        eventID: '',
        userID: '',
        eventStatus:'For Validation',
        dateCaptured: '',
        timeCaptured: '',
        source: '',
        reportSource: '',
        eventDetails: '',
        locHouseStreet: '',
        locCity: '',
        locBrgy: '',
        numCases: '',
        numDeaths: '',
        remarks: ''
      },
      formSection: {
        formNames: {
          form0: 'Source Details',
          form1: 'Health Event Details'
        },
      },
      eventLevels: {
        'Ongoing': 'Other information is still on verification; Specimens are to be collected and pending laboratory results; The concerned team is currently monitoring the event; The concerned team is currently monitoring the event; There are continuous additional cases or deaths',
        'Controlled': 'Gradual or abrupt decrease of cases; Cases showed good prognosis or event has already been managed but other information is still on verification such as description of cases, laboratory findings, etc.; No cases or deaths had been added',
        'Closed': 'Laboratory results have no significant findings that are potential for endangering health; Cases were already discharged and in good condition; Follow-up reports indicate no further monitoring, assistance and investigation needed'
      }
    }
  },
  async fetch() {
    const data = (await axios.get('http://localhost:8080/api/getEvent?eventID=' + this.$route.query.eventID)).data;
    // const data = (await axios.get('http://localhost:8080/api/getCRF?caseID=' + 'CA-0000000000007')).data;
    this.healthEvent = data.event;
    if(this.healthEvent.eventStatus == 'forValidation')
      this.status = "For Validation"
    else this.status = this.healthEvent.eventStatus;
    this.eventHistory = data.eventHistory;
    
    // fixing dates

    // console.log(data);
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
      if (this.editStatus & value!==this.healthEvent.eventStatus ) return false
      else return true
    },
    popup() {
      this.editStatus = !this.editStatus
    },
    async status(change) {
      if (change==='save') {
        this.healthEvent.eventStatus = this.newStatus;
        const updateCase = await axios.post('http://localhost:8080/api/updateEventStatus', {
          eventID: this.healthEvent.eventID,
          newStatus: this.newStatus,
          modifiedBy: this.$auth.user.userID
        });
        if (updateCase.status === 200) {
          alert('Event status updated!');
          location.reload();
        } else {
          // eslint-disable-next-line no-console
          console.log(result);
        }
      }
      if (change==='cancel') {
        this.newStatus = this.healthEvent.eventStatus;
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

.viewHE-container {
  padding: 80px 20px 5px 20px;
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .viewHE-ontainer {
    width: 100%;
    align-items: center;
    margin: 0px;
  }
}

.viewHE-section-container {
  /* left: 275px; */
  /* position: relative; */
  /* width: calc(100vw - 320px); */
  /* margin: 5px; */
  width: 100%;
  padding: 5px;
  margin: 10px;
}

@media only screen and (max-width: 800px) {
  .viewHE-section-container {
    width: 95%;
  }
}

.HE-SummaryContainer {
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

.viewHEform-component {
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
  .viewHEform-component {
    position: relative;
    top: 0px;
    min-height: fit-content;
    border-radius: 0 0 10px 10px;
  }
}
.viewHE-details {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  justify-content: space-between;
}
.HEnumbers,
.HEstatus {
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

.HEActionButtons {
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

.HEEdit {
  width: 30px;
  height: 30px;
  padding: 5px;
}

/* #saveIcon:hover {
  background: url("~/assets/img/saved.png");

} */

.HE-statusHistory {
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
</style>

