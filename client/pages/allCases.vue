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
          <ul v-if="$auth.user.userType === 'pidsrStaff' || $auth.user.userType === 'techStaff' ||
            $auth.user.userType === 'BHS' || $auth.user.userType === 'RHU' || $auth.user.userType === 'CHO' ||
            $auth.user.userType === 'govtHosp' || $auth.user.userType === 'privHosp' || $auth.user.userType === 'clinic' ||
            $auth.user.userType === 'govtLab' || $auth.user.userType === 'privLab' || $auth.user.userType === 'airseaPort'"
            :class="formListClass('crfDRU')" @click="clickTab('crfDRU')">
            CRF
          </ul>
          <ul v-if="$auth.user.userType === 'pidsrStaff' || $auth.user.userType === 'fhsisStaff' || $auth.user.userType === 'techStaff'"
           :class="formListClass('crfCHD')" @click="clickTab('crfCHD')"> 
           CRF
          </ul>
        </div>
        <div v-show="!isPrint" class="CRFActionButtons">
          <ul class="CRFActionButton" @click="downloadPDF">
          <img
            src="~/assets/img/pdf.png"
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
            v-show="caseTab === 'crfDRU'"
            :options="tableOptions"
            :datavalues="crfDRUData"
            :casetype="'crfDRU'"
          />
          <dataTable
            v-show="caseTab === 'crfCHD'"
            :options="tableOptions"
            :datavalues="crfCHDData"
            :casetype="'crfCHD'"
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
          key: 'diseaseName',
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
          key: 'diseaseName',
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
      crfDRUColumns: [
        {
          title: 'Week No.',
          key: 'weekNo',
          type: 'text',
          sortable: true,
        },
        {
          title: 'CRF No.',
          key: 'CRFID',
          type: 'clickable',
          source: 'cases',
          uniqueField: 'id',
          sortable: true,
        },
        {
          title: 'Disease',
          key: 'diseaseName',
          type: 'text',
          source: 'cases',
          uniqueField: 'id',
          sortable: true,
          filter: true,
        },
        {
          title: 'Submit Status',
          key: 'submitStatus',
          type: 'text',
          filter: true,
        },
        {
          title: 'Submitted on',
          key: 'submittedOn',
          type: 'text',
          dateFormat: true,
          currentFormat: 'YYYY-MM-DD',
          expectFormat: 'DD MMM YYYY',
          // sortable: true,
        },
        {
          title: 'Report Status',
          key: 'reportStatus',
          type: 'text',
          dateFormat: true,
          currentFormat: 'YYYY-MM-DD',
          expectFormat: 'DD MMM YYYY',
          filter: true,
        },
		
		/*
        {
          title: 'Action',
          key: 'action',
          type: 'text',
        },
		*/
      ],
      crfCHDColumns: [
        {
          title: 'Week No.',
          key: 'weekNo',
          type: 'text',
          sortable: true,
        },
        {
          title: 'CRF No.',
          key: 'CRFID',
          type: 'clickable',
          source: 'cases',
          uniqueField: 'id',
          sortable: true,
        },
        {
          title: 'Disease',
          key: 'diseaseName',
          type: 'text',
          source: 'cases',
          uniqueField: 'id',
          sortable: true,
          filter: true,
        },
        {
          title: 'DRU ID',
          key: 'userID',
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
          title: 'Submit Status',
          key: 'submitStatus',
          type: 'text',
          filter: true,
        },
        {
          title: 'Submitted on',
          key: 'submittedOn',
          type: 'text',
          dateFormat: true,
          currentFormat: 'YYYY-MM-DD',
          expectFormat: 'DD MMM YYYY',
          // sortable: true,
        },
        {
          title: 'Report Status',
          key: 'reportStatus',
          type: 'text',
          dateFormat: true,
          currentFormat: 'YYYY-MM-DD',
          expectFormat: 'DD MMM YYYY',
          filter: true,
        },
      ],
      allData: [],
      cifData: [],
      crfDRUData: [],
      crfCHDData: [],
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
    const cifRows = (await axios.get('http://localhost:8080/api/getCases')).data;
	const crfRows = (await axios.get('http://localhost:8080/api/getAllCRFs')).data;
	for (let i = 0; i < cifRows.length; i++) {
	  cifRows[i].reportDate = cifRows[i].reportDate ? cifRows[i].reportDate.substr(0, 10) : "undefined";
	  // default to reportDate if updatedDate is null
	  cifRows[i].updatedDate = cifRows[i].updatedDate ? cifRows[i].updatedDate.substr(0, 10) : cifRows[i].reportDate;
	}
    this.allData = cifRows;
	this.cifData = cifRows.filter(e => e.type === "CIF");
	
	/* note on CRFs:
        not-CHD: their CRFs
        CHD: their CRFS + pushed CRFs (from not-CHD)
	*/
	for (let i = 0; i < crfRows.length; i++) {
	  crfRows[i].weekNo = crfRows[i].year + "-" + crfRows[i].week;
	}
	this.crfCHDData = crfRows;
	this.crfDRUData = crfRows;
	this.tableOptions.columns = this.allColumns;
  },
  methods: {
    clickTab(caseTab) {
      this.caseTab = caseTab;
      if (this.caseTab === 'all') this.tableOptions.columns = this.allColumns;
      else if (this.caseTab === 'cif')
        this.tableOptions.columns = this.cifColumns;
      else if (this.caseTab === 'crfDRU')
        this.tableOptions.columns = this.crfDRUColumns;
      else if (this.caseTab === 'crfCHD')
        this.tableOptions.columns = this.crfCHDColumns;
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
      else if (this.caseTab==='crfDRU') colName = this.crfDRUColumns;
      else if (this.caseTab==='crfCHD') colName = this.crfCHDColumns;

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
      else if (this.caseTab==='crfDRU') return this.crfDRUData;
      else if (this.caseTab==='crfCHD') return this.crfCHDData;
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
  /* margin: 0 5px; */
  margin: -5px 5px 5px;
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

