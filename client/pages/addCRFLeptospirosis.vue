<template>
  <div id="addCRF" class="addCRFbody">
    <!--Top Bar of the screen-->
    <TopNav />
    <div class="addCRF-viewCasesContainer">
      <div class="addCRF-details" style="align-text: left">
        <div class="addCRFnumbers">
          <h1 class="addCRFh1" style="margin-top: -1px">{{ disease }} Case Report Form </h1>
          <h2 class="addCRFh2" style="margin-top: -7px">Week No: {{ weekNo }}</h2>
          <!-- <h3 class="addCRFh3">Last updated: {{ updatedDate }}</h3> -->
        </div>
      </div>
      <div style="margin-top: 20px;">
        <div class="addCRF-viewCasesComponent">
          <div id="vue-root">
            <dataTable
              :options="tableOptions"
              :datavalues="crfData"
              :casetype="'addcrfID'"
            />
          </div>
        </div>
        <div class="addCRFadditionalButtons">
          <button class="addCRF-addText"><a :href="'/addCRFLeptospirosisCase?CRFID=' + CRFID">+ Add a Case</a></button>
        </div>
        <!-- <div class="addCRF-endButton">
          <button class="submit-button" type="button" @click="submit()">
            Submit
          </button>
        </div> -->
      </div>
    </div>
    <div v-show="popupOpen" class="addCRFoverlay">
      <div class="addCRF-overlayForm">
        <h2 style="color:red; text-align:center"> AUTOMATIC DATA SUBMISSION CONSENT </h2>
        <hr style="border-color: inherit;" class="addCRFhr"/>
        <div style="padding:10px; text-align:justify;">
          <p style="margin:10px 5px; font-size:16px"> If you agree, all details will be pushed to MMCHD-RESU.
             Otherwise, data that will identify the person 
             (e.g. patient name, complete address) will not be pushed.</p>
          <p style="margin:10px 5px; font-size:16px"> Only data that is necessary for 
            time, place, and person analysis will be pushed.</p>
          <!--p style="margin:10px 5px; font-size:12px"> You can update this in your settings anytime.</p-->
          <div class="addCRFpopupButtons">
            <button class="back-button" type="button" @click="popup(false)">
              Disagree
            </button>
            <button class="next-button" type="button" @click="popup(true)">
              Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dataTable from './dataTable.vue'
const axios = require('axios')
export default {
  components: {
    dataTable,
  },
  middleware: 'is-auth',
  header: {
    title: 'View CRF',
  },
  data() {
    return {
      popupOpen: true,
      selectAdd: true,
      isPrint: false,
      patients: [],
      patientResult: [],
      disease: 'Leptospirosis',
      CRFID: "",
      druID: 'ABC',
      submittedDate: 'Nov 11, 2021',
      updatedDate: 'Nov 10, 2020',
      weekNo: '2020-21',
      tableOptions: {
        tableName: 'crf',
        columns: [
          {
            title: 'Case ID',
            key: 'caseID',
            type: 'clickable',
            source: 'crf',
            uniqueField: 'id',
            sortable: true,
          },
          {
            title: 'Patient',
            key: 'patientID',
            type: 'number',
            source: 'crf',
          },
          {
            title: 'City',
            key: 'city',
            type: 'text',
            source: 'crf',
            uniqueField: 'id',
            sortable: true,
            filter: true,
          },
          {
            title: 'Age',
            key: 'ageNo',
            type: 'number',
            source: 'crf',
            uniqueField: 'id',
            sortable: true,
          },
          {
            title: 'Sex',
            key: 'sex',
            type: 'text',
            source: 'crf',
            uniqueField: 'id',
            filter: true,
          },
          {
            title: 'Reported on',
            key: 'reportDate',
            type: 'text',
            dateFormat: true,
            currentFormat: 'YYYY-MM-DD',
            expectFormat: 'DD MMM YYYY',
            sortable: true,
          },
          // {
          //   title: 'Last updated',
          //   key: 'updatedDate',
          //   type: 'text',
          //   dateFormat: true,
          //   currentFormat: 'YYYY-MM-DD',
          //   expectFormat: 'DD MMM YYYY',
          //   sortable: true,
          // },
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
        // source: 'http://demo.datatable/api/users',
        search: true,
      },
      crfData: [],
    }
  },
  async fetch() {
    const rows = (await axios.get('http://localhost:8080/api/getCRFPage', {
      params: {
        diseaseID: "DI-0000000000004",
        userID: this.$auth.user.userID
      }
    })).data;
    console.log(rows);
    for (let i = 0; i < rows.crfData.length; i++) {
      rows.crfData[i].reportDate = this.convDatePHT(new Date(rows.crfData[i].reportDate));
      rows.crfData[i].updatedDate = this.convDatePHT(new Date(rows.crfData[i].updatedDate));
    }
    this.crfData = rows.crfData;
    this.weekNo = rows.CRF.year + "-" + rows.CRF.week;
    this.CRFID = rows.CRF.CRFID;
    if (!rows.pushDataAccept) this.popupOpen = true;
    else this.popupOpen = false;
  },
  compute: {},
  head() {
    return {
      title: 'New Leptospirosis Form'
    }
  },
  mounted() {},
  methods: {
    async popup(change) {
      try {
        this.popupOpen = !this.popupOpen
        const result = await axios.post('http://localhost:8080/api/updatePushData', {
          userID: this.$auth.user.userID,
          pushDataAccept: change
        });
        if (result.status === 200) {
          this.$toast.success('User Settings Updated!', {duration: 4000, icon: 'check_circle'});
        } else {
          // eslint-disable-next-line no-console
          console.log(result);
          this.$toast.error('Something went wrong!', {duration: 4000, icon: 'error'});
        }
        this.popupOpen = false;
      } catch(e) {
        // eslint-disable-next-line no-console
        console.log(e);
        this.$toast.error('Something went wrong!', {duration: 4000, icon: 'error'});
      }
    },
    async submit() {
      const submitResponse = (await axios.post('http://localhost:8080/api/submitCRF', {
        CRFID: this.CRFID,
        diseaseID: "DI-0000000000004",
        userID: this.$auth.user.userID
      }));
      // console.log(submitResponse.data);
      
      if (submitResponse.status === 200) {
        // location.reload();
        this.$toast.success('Cases submitted!', {duration: 4000, icon: 'check_circle'});
      } else {
        // eslint-disable-next-line no-console
        console.log(submitResponse);
        this.$toast.error('Something went wrong!', {duration: 4000, icon: 'error'});
      }
    },
    convDatePHT(d) { // only accepts Date object; includes checking
      return !isNaN(Date.parse(d)) ? (new Date(d.getTime() + 28800000)).toISOString().substr(0, 10) : "N/A";
    },
  },
}
</script>

<style>

.addCRFbody {
  font-family: 'Work Sans', sans-serif;
  font-weight: 300;
  padding: 0px;
  margin: 0px;
  background-image: none;
}

.addCRFhr {
  border-top-width: 5px;
  border-color: #008d41;
  margin: 10px 0;
}

.addCRFoverlay {
  display: block;
  z-index: 11;
  margin: 0px;
  padding: 10% 30% 20%;
  width: -webkit-fill-available;
  height: -webkit-fill-available;
  /* background: gray; */
  /* opacity: 55%; */
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(100, 100, 100, 0.4);
  /* border: 100px solid rgba(100, 100, 100, 0.4); */
}

@media only screen and (max-width:1000px) {
  .addCRFoverlay  {
    padding: 20% 15%;
  }
}

.addCRF-overlayForm {
  padding: 30px;
  border-radius: 40px;
  background: white;
  /* width: -webkit-fill-available;
  height: -webkit-fill-available; */
  overflow-y: auto;
  box-shadow: 1px 4px 8px rgb(0 0 0 / 40%);
}

.addCRFaddCRFpopupButtons {
  /* margin: -10px 0 5px; */
  margin: 10px auto;
  text-align: center;
}

.addCRFpageHeader {
  font-weight: 800;
  font-size: 32px;
  color: #346083;
}

.addCRF-details {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  justify-content: space-between;
}
.addaddCRFnumbers {
  display: inline-flex;
  flex-direction: column;
}

.addCRFh1 {
  color: #008d41;
  font-size: 40px;
  font-weight: 800;
}

.addCRFh2 {
  color: #346083;
  font-size: 25px;
  font-weight: 600;
}

.addCRFh3 {
  font-size: 15px;
  font-weight: 600;
}

.addCRF-viewCasesContainer {
  padding: 80px 20px 5px 20px;
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .addCRF-viewCasesContainer {
    width: 100%;
    align-items: center;
    margin: 0px;
  }
}

.addCRF-viewCasesComponent {
  /* position: relative;
  display: inline-flex;
  flex-direction: row; */
  height: fit-content;
  width: 100%;

  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.25));
  background-color: #f2f2f2;
  border-radius: 10px;
  padding: 15px;
  padding-bottom: 75px;
  margin-bottom: 40px;
}
@media only screen and (max-width: 800px) {
  .addCRF-viewCasesComponent {
    position: relative;
    top: 0px;
    min-height: fit-content;
  }
}

.formSummaryItems {
  background: white;
  border: 1px #f2f2f2 solid;
  border-radius: 10px 10px 0 0;
  margin: 0 -1px -1px 0;
  padding: 5px 10px;
  cursor: pointer;
}

.formSummaryItems:hover {
  background: #f2f2f2;
}

.formSummaryItems.selected {
  background: #f2f2f2;
  font-weight: 600;
  pointer-events: none;
}

.addCRFadditionalButtons {
  /* position: relative; */
  position: absolute;
  margin-top: -110px;
  margin-left: 20px;
}

.addCRF-addText {
  color: #346083;
  font-size: 16px;
  font-weight: 600;
}

.addCRF-endButton {
  /* margin: -10px 0 5px; */
  float: right;
  margin-top: -40px;
  margin-right: 16px;
  margin-bottom: 50px;
}

.submit-button, .next-button {
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

.submit-button:hover, .next-button:hover {
  background-color: #346083;
}

.save-button, .back-button {
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

.save-button:hover, .back-button:hover {
  border: #346083 solid 1px;
}

</style>
