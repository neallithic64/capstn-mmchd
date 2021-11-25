<template>
  <div id="viewCases">
    <!--Top Bar of the screen-->
    <TopNav />
    <div class="viewcases-container">
      <h1 class="pageHeader">View Cases</h1>
      <div class="CIF-SummaryContainer">
        <ul :class="formListClass('all')" @click="clickTab('all')">
          ALL
        </ul>
        <ul :class="formListClass('cif')" @click="clickTab('cif')">
          CIF
        </ul>
        <ul :class="formListClass('crf')" @click="clickTab('crf')">
          CRF
        </ul>
      </div>
      <div class="viewcases-component">
        <div id="vue-root">
          <dataTable
            v-show="caseTab === 'all'"
            :options="tableOptions"
            :datavalues="allData"
            :casetype="'all'"
          />
          <dataTable
            v-show="caseTab === 'cif'"
            :options="tableOptions"
            :datavalues="cifData"
            :casetype="'cif'"
          />
          <dataTable
            v-show="caseTab === 'crf'"
            :options="tableOptions"
            :datavalues="crfData"
            :casetype="'crf'"
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
    title: 'Add Case',
  },
  components: {
    dataTable,
  },
  compute: {},
  data() {
    return {
      caseTab: 'all',
      tableOptions: {
        tableName: 'cases',
        columns: [],
        // source: 'http://demo.datatable/api/users',
        search: true,
      },
      allColumns: [
        {
          title: 'Type',
          key: 'type',
          source: 'cases',
          uniqueField: 'id',
        },
        {
          title: 'Case ID',
          key: 'caseID',
          type: 'clickable',
          source: 'cases',
          uniqueField: 'id',
          sortable: true,
        },
        {
          title: 'Disease',
          key: 'disease',
          type: 'text',
          source: 'cases',
          uniqueField: 'id',
          sortable: true,
          filter: true,
        },
        {
          title: 'DRU ID',
          key: 'druID',
          type: 'text',
          source: 'cases',
          uniqueField: 'id',
        },
        {
          title: 'Patient',
          key: 'patientNo',
          type: 'number',
          source: 'cases',
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
          key: 'submittedDate',
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
          key: 'status',
          type: 'text',
          source: 'cases',
          uniqueField: 'id',
          sortable: true,
          filter: true,
        },
      ],
      cifColumns: [
        {
          title: 'Case ID',
          key: 'caseID',
          type: 'clickable',
          source: 'cases',
          uniqueField: 'id',
          sortable: true,
        },
        {
          title: 'Disease',
          key: 'disease',
          type: 'text',
          source: 'cases',
          uniqueField: 'id',
          sortable: true,
          filter: true,
        },
        {
          title: 'DRU ID',
          key: 'druID',
          type: 'text',
          source: 'cases',
          uniqueField: 'id',
        },
        {
          title: 'Patient',
          key: 'patientNo',
          type: 'number',
          source: 'cases',
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
          key: 'submittedDate',
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
          key: 'status',
          type: 'text',
          source: 'cases',
          uniqueField: 'id',
          sortable: true,
          filter: true,
        },
      ],
      crfColumns: [
        {
          title: 'CRF No.',
          key: 'crfNo',
          type: 'clickable',
          source: 'cases',
          uniqueField: 'id',
          sortable: true,
        },
        {
          title: 'Disease',
          key: 'disease',
          type: 'text',
          source: 'cases',
          uniqueField: 'id',
          sortable: true,
          filter: true,
        },
        {
          title: 'DRU ID',
          key: 'druID',
          type: 'text',
          source: 'cases',
          uniqueField: 'id',
        },
        {
          title: 'Submitted on',
          key: 'submittedDate',
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
          title: 'Week No.',
          key: 'weekNo',
          type: 'text',
          sortable: true,
        },
      ],
      allData: [
        {
          type: 'CIF',
          caseID: 19,
          disease: 'Measles',
          druID: 123,
          city: 'Manila',
          patientNo: 123,
          submittedDate: '2020-12-10',
          updatedDate: '2020-1-10',
          status: 'Condtional Probable',
        },
        {
          type: 'CIF',
          caseID: 10,
          disease: 'Disease',
          druID: 123,
          city: 'PH',
          patientNo: 223,
          submittedDate: '2020-11-30',
          updatedDate: '2020-1-12',
          status: 'Conditional Confirm',
        },
        {
          type: 'CRF',
          caseID: 19,
          disease: 'Measles',
          druID: 345,
          city: 'Manila',
          patientNo: 123,
          submittedDate: '2020-12-10',
          updatedDate: '2020-2-12',
          status: 'Suspected',
        },
        {
          type: 'CRF',
          caseID: 21,
          disease: 'Dengue',
          city: 'PH',
          patientNo: 223,
          submittedDate: '2021-11-10',
          updatedDate: '2021-12-10',
          status: 'Probable',
        },
        {
          caseID: 29,
          disease: 'Dengue',
          city: 'PH',
          patientNo: 223,
          submittedDate: '2020-11-10',
          updatedDate: '2020-11-10',
          status: 'Suspected',
        },
        {
          caseID: 30,
          disease: 'Measles',
          city: 'Manila',
          patientNo: 123,
          submittedDate: '2020-10-10',
          updatedDate: '2020-10-10',
          status: 'IDK',
        },
        {
          caseID: 31,
          disease: 'Dengue',
          city: 'PH',
          patientNo: 223,
          submittedDate: '2020-11-10',
          updatedDate: '2020-11-10',
          status: 'IDK',
        },
        {
          caseID: 32,
          disease: 'Measles',
          city: 'Manila',
          patientNo: 123,
          submittedDate: '2020-10-10',
          updatedDate: '2020-10-10',
          status: 'IDK',
        },
        {
          caseID: 33,
          disease: 'Dengue',
          city: 'earth',
          patientNo: 223,
          submittedDate: '2020-11-10',
          updatedDate: '2020-11-10',
          status: 'IDK',
        },
        {
          caseID: 34,
          disease: 'cries',
          city: 'Manila',
          patientNo: 123,
          submittedDate: '2020-10-10',
          updatedDate: '2020-10-10',
          status: 'dd',
        },
        {
          caseID: 35,
          disease: 'hatdog',
          city: 'PH',
          patientNo: 223,
          submittedDate: '2020-11-10',
          updatedDate: '2020-11-10',
          status: 'e',
        },
      ],
      cifData: [
        {
          caseID: 19,
          disease: 'Measles',
          druID: 123,
          city: 'Manila',
          patientNo: 123,
          submittedDate: '2020-12-10',
          updatedDate: '2020-1-10',
          status: 'IDK',
        },
      ],
      crfData: [
        {
          crfNo: 35,
          disease: 'Dengue',
          druID: 'ABC',
          submittedDate: '2020-11-10',
          updatedDate: '2020-11-10',
          weekNo: '2021-21',
        },
      ],
      diseases: {
        cif: {
          Measles: '/cifMeasles',
          Diphtheria: '/cifDiphtheria',
          'Neonatal Tetanus': '/cifNeonatalTetanus',
          Pertussis: '/cifPertussis',
          'Meningococcal Disease': '/cifMeningococcal',
        },
        crf: {
          Dengue: 'crfDengue',
        },
      },
    }
  },

  mounted() {
    this.tableOptions.columns = this.allColumns
  },
  methods: {
    clickTab(caseTab) {
      this.caseTab = caseTab
      if (this.caseTab === 'all') this.tableOptions.columns = this.allColumns
      else if (this.caseTab === 'cif')
        this.tableOptions.columns = this.cifColumns
      else if (this.caseTab === 'crf')
        this.tableOptions.columns = this.crfColumns
    },
    formListClass(caseTab) {
      if (caseTab === this.caseTab) return 'formSummaryItems selected'
      else return 'formSummaryItems'
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
}

.pageHeader {
  font-weight: 800;
  font-size: 32px;
  color: #346083;
}

.viewcases-container {
  padding: 80px 20px 5px 20px;
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .viewcases-ontainer {
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

.CIF-SummaryContainer {
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

