<template>
  <div id="viewCases">
    <!--Top Bar of the screen-->
    <TopNav />
    <div ref="content" class="viewcases-container">
      <h1 class="pageHeader">View Cases</h1>
      <div class="exportButtons">
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
        <div v-show="!isPrint" class="CRFActionButtons">
          <ul class="CRFActionButton" @click="downloadPDF">
          <img
            src="~/assets/img/print.png"
            class="printButton"
            @click="downloadPDF"
          />
          </ul>
          <ul class="CRFActionButton">
            <img src="~/assets/img/csv.png" 
            class="printButton"
            @click="csvExport(getTable())"
          />
          </ul>
        </div>
      </div>
      <div class="viewcases-component">
        <div v-if="allData.length > 0" id="vue-root">
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

<script src="https://code.jquery.com/jquery-1.12.3.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/0.9.0rc1/jspdf.min.js"></script>

<script>
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import dataTable from './dataTable.vue'
const axios = require('axios');

export default {
  components: {
    dataTable,
  },
  middleware: 'is-auth',
  header: {
    title: 'Add Case',
  },
  compute: {},
  data() {
    return {
      isPrint: false,
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
          key: 'reportedBy',
          type: 'text',
          source: 'cases',
          uniqueField: 'id',
        },
        {
          title: 'Patient',
          key: 'patientName',
          type: 'text',
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
      allData: [],
      cifData: [
        {
          caseID: 19,
          disease: 'Measles',
          druID: 123,
          city: 'Manila',
          patientNo: 123,
          submittedDate: '2020-12-10',
          updatedDate: '2020-1-10',
          status: 'Suspected aaa',
        },
        {
          caseID: 19,
          disease: 'Measles',
          druID: 123,
          city: 'Manila',
          patientNo: 123,
          submittedDate: '2020-12-10',
          updatedDate: '2020-1-10',
          status: 'aProbable aaa',
        },
        {
          caseID: 19,
          disease: 'Measles',
          druID: 123,
          city: 'Manila',
          patientNo: 123,
          submittedDate: '2020-12-10',
          updatedDate: '2020-1-10',
          status: 'secret',
        },
        {
          caseID: 19,
          disease: 'Measles',
          druID: 123,
          city: 'Manila',
          patientNo: 123,
          submittedDate: '2020-12-10',
          updatedDate: '2020-1-10',
          status: 'Confirmedd',
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
          Measles: '/addCIFMeasles',
          Diphtheria: '/addCIFDiphtheria',
          'Neonatal Tetanus': '/addCIFNeonatalTetanus',
          Pertussis: '/addCIFPertussis',
          'Meningococcal Disease': '/addCIFMeningococcal',
        },
        crf: {
          Dengue: '/addCRFDengue',
        },
      },
    }
  },
  async mounted() {
    const rows = (await axios.get('http://localhost:8080/api/getCases')).data;
	for (let i = 0; i < rows.length; i++) {
	  rows[i].type = "CIF";
	  // rows[i].patientName = rows[i].patientName;
	  rows[i].updatedDate = rows[i].updatedDate.substr(0, 10);
	  rows[i].reportDate = rows[i].reportDate.substr(0, 10);
	  rows[i].disease = rows[i].diseaseName;
	}
  this.allData = rows;
	this.tableOptions.columns = this.allColumns;
  },
  methods: {
    clickTab(caseTab) {
      this.caseTab = caseTab;
      if (this.caseTab === 'all') this.tableOptions.columns = this.allColumns;
      else if (this.caseTab === 'cif')
        this.tableOptions.columns = this.cifColumns;
      else if (this.caseTab === 'crf')
        this.tableOptions.columns = this.crfColumns;
    },
    formListClass(caseTab) {
      if (caseTab === this.caseTab) return 'formSummaryItems selected';
      else return 'formSummaryItems';
    },
    downloadPDF() {
      // this.isPrint = !this.isPrint

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
      setTimeout(() => (this.isPrint = !this.isPrint), 3000)
   },
    getCols() {
      var colName, columns='';
      if (this.caseTab==='all') colName = this.allColumns;
      else if (this.caseTab==='cif') colName = this.cifColumns;
      else if (this.caseTab==='crf') colName = this.crfColumns;

      for (let i=0; i<Object.keys(colName).length; i++) {
        columns += colName[i].title;
        if (i+1!==Object.keys(colName)) columns += ','
      }
      return columns;
    },
    csvExport(arrData) {
      let csvContent = "data:text/csv;charset=utf-8,";
      let header = this.getCols();
      // let header = Object.keys(arrData[0]).join(",");
      csvContent += [
        header,
        ...arrData.map(item => Object.values(item).join(","))
      ]
        .join("\n")
        .replace(/(^\[)|(\]$)/gm, "");

      const data = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", data);
      link.setAttribute("download", this.caseTab+".csv");
      link.click();
    },
    getTable() {
      if (this.caseTab==='all') return this.allData;
      else if (this.caseTab==='cif') return this.cifData;
      else if (this.caseTab==='crf') return this.crfData;
    }
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

.CRFActionButtons {
  display: inline-flex;
  flex-direction: row;
  cursor: pointer;
}

.printButton {
  width: 30px;
  height: 30px;
  margin: 0 5px;
}

.exportButtons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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

