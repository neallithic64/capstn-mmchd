<template>
  <div id="viewCRF">
    <!--Top Bar of the screen-->
    <TopNav />
    <div class="viewcases-container">
      <div class="viewCRF-details" style="align-text: left">
        <div class="CRFnumbers">
          <h1 style="margin: -10px 0">Case No. {{ crfNo }}</h1>
          <h2 style="margin-top: -1px">Disease: {{ disease }}</h2>
          <h3 style="margin-top: -1px">Week No: {{ weekNo }}</h3>
        </div>
        <div class="CRFstatus" style="align-text: right">
          <div class="CRFstatus">
            <p>Submitted on: {{ submittedDate }}</p>
            <p>Last updated: {{ updatedDate }}</p>
          </div>
          <div v-show="!isPrint" class="CRFActionButtons">
            <img src="~/assets/img/print.png" class="printButton" />
          </div>
        </div>
      </div>
      <div class="viewcases-component">
        <div id="vue-root">
          <dataTable
            :options="tableOptions"
            :datavalues="crfData"
            :casetype="'crfCase'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dataTable from './dataTable.vue'
export default {
  header: {
    title: 'View CRF',
  },
  components: {
    dataTable,
  },
  middleware: 'is-auth',
  compute: {},
  data() {
    return {
      isPrint: false,
      disease: 'Dengue',
      crfNo: '35',
      druID: 'ABC',
      submittedDate: 'Nov 11,2021',
      updatedDate: 'Nov 10, 2020',
      weekNo: '2020-21',

      tableOptions: {
        tableName: 'crf',
        columns: [
          {
            title: 'CRF ID',
            key: 'crfID',
            type: 'clickable',
            source: 'crf',
            uniqueField: 'id',
            sortable: true,
          },
          {
            title: 'Patient',
            key: 'patientNo',
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
            key: 'age',
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
            title: 'Date added',
            key: 'addDate',
            type: 'text',
            dateFormat: true,
            currentFormat: 'YYYY-MM-DD',
            expectFormat: 'DD MMM YYYY',
            sortable: true,
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
            key: 'status',
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
      crfData: [
        {
          crfID: 35,
          disease: 'Dengue',
          patientNo: '1123',
          age: '12',
          sex: 'F',
          city: 'Manila',
          addDate:'2020-02-10',
          updatedDate: '2020-11-10',
          status: 'Probable',
        },
        {
          crfID: 55,
          disease: 'Dengue',
          patientNo: '234',
          age: '50',
          sex: 'M',
          city: 'Makati',
          addDate:'2020-02-10',
          updatedDate: '2022-11-12',
          status: 'Confirmed',
        },
      ],
    }
  },
  mounted() {},
  methods: {},
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

.pageHeader {
  font-weight: 800;
  font-size: 32px;
  color: #346083;
}

.viewCRF-details {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  justify-content: space-between;
}
.CRFnumbers,
.CRFstatus {
  display: inline-flex;
  flex-direction: column;
}

.CRFActionButtons {
  display: inline-flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
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

h3 {
  font-size: 15px;
  font-weight: 600;
}

.printButton {
  width: 30px;
  height: 30px;
}

.viewcases-container {
  padding: 80px 20px 5px 20px;
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .viewcases-container {
    width: 100%;
    align-items: center;
    margin: 0px;
  }
}

.viewcases-section-container {
  /* left: 275px; */
  /* position: relative; */
  /* width: calc(100vw - 320px); */
  /* margin: 5px; */
  width: 100%;
  padding: 5px;
  margin: 10px;
}

@media only screen and (max-width: 800px) {
  .viewcases-section-container {
    width: 95%;
  }
}

.viewcases-component {
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
  .viewcases-component {
    position: relative;
    top: 0px;
    min-height: fit-content;
  }
}

.CRF-SummaryContainer {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  overflow-y: hidden;
  z-index: 1;
  margin-left: 5px;
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

#datatabale {
  width: -webkit-fill-available;
}

/* h2 {
  text-align: center;
  font-weight: 600;
  font-size: 20px;
  background-color: #008d41;
  color: transparent;
  text-shadow: 1px 1px, -1px -1px rgba(0, 0, 0, 0.25);
  -webkit-background-clip: text;
  -moz-background-clip: text;
  background-clip: text;
} */
</style>

