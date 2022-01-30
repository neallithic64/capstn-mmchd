<template>
  <div id="viewCases" class="allCaseBody">
    <!--Top Bar of the screen-->
    <TopNav />
    <div ref="content" class="allCases-viewcasesContainer">
      <h1 class="allCasesHeader">All Case Reports</h1>
      <div class="allCasesExport">
        <div class="allCases-summaryContainer">
          <ul :class="formListClass('all')" @click="clickTab('all')">
            ALL
          </ul>
          <ul :class="formListClass('cif')" @click="clickTab('cif')">
            CIF
          </ul>
          <ul v-if="!['Chief', 'Staff', 'resuHead', 'chdDirector'].some(e => $auth.user.userType.includes(e))"
            :class="formListClass('crfDRU')" @click="clickTab('crfDRU')">
            CRF
          </ul>
          <ul v-if="['Chief', 'Staff', 'resuHead', 'chdDirector'].some(e => $auth.user.userType.includes(e))"
            :class="formListClass('crfCHD')" @click="clickTab('crfCHD')">
            CRF
          </ul>
        </div>
        <div v-show="!isPrint" class="allCasesActionButtons" style="margin-top: -15px;">
          <ul class="CRFActionButton">
          <img
            src="~/assets/img/pdf.png"
            class="allCasesPrint"
            @click="downloadPDF"
          />
          </ul>
          <ul class="CRFActionButton">
            <img src="~/assets/img/csv.png" 
            class="allCasesPrint"
            @click="csvExport(getTable())"
          />
          </ul>
        </div>
      </div>
      <div class="allCases-viewcasesComponent">
        <div v-if="allData.length > 0" id="vue-root">
          <dataTable
            v-show="caseTab === 'all'"
            :options="tableOptions"
            :datavalues="allData"
            :casetype="'all'"
            :print="printTab('all')"
          />
          <dataTable
            v-show="caseTab === 'cif'"
            :options="tableOptions"
            :datavalues="cifData"
            :casetype="'cif'"
            :print="printTab('cif')"
          />
          <dataTable
            v-show="caseTab === 'crfDRU'"
            :options="tableOptions"
            :datavalues="crfDRUData"
            :casetype="'crfDRU'"
            :print="printTab('crfDRU')"
          />
          <dataTable
            v-show="caseTab === 'crfCHD'"
            :options="tableOptions"
            :datavalues="crfCHDData"
            :casetype="'crfCHD'"
            :print="printTab('crfCHD')"
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
  head() {
    return {
      title: 'All Case Reports'
    }
  },
  data() {
    return {
      isPrint: false,
      caseTab: 'all',
      tableOptions: {
        tableName: 'cases',
        columns: [],
        // source: 'http://demo.datatable/api/users',
        search: true,
        sortKey: 'caseID',
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
    }
  },
  async mounted() {

    if (this.allData.length === 0) {
      this.$toast.show('Loading...', {icon: 'hourglass_top'});
    }
    const CHDtypes = ['Chief', 'Staff', 'resuHead', 'chdDirector'];
    const cifRows = (await axios.get('http://localhost:8080/api/getCases', {
      params: {userID: this.$auth.user.userID}
    })).data;
    const crfRows = (await axios.get('http://localhost:8080/api/getAllCRFs', {
      params: {userID: this.$auth.user.userID}
    })).data;
    for (let i = 0; i < cifRows.length; i++) {
      cifRows[i].reportDate = cifRows[i].reportDate ? this.convDatePHT(new Date(cifRows[i].reportDate)) : "undefined";
      // default to reportDate if updatedDate is null
      cifRows[i].updatedDate = cifRows[i].updatedDate ? this.convDatePHT(new Date(cifRows[i].updatedDate)) : cifRows[i].reportDate;
    }
    this.cifData = cifRows.filter(e => e.type === "CIF");
    
    /* note on CRFs:
        not-CHD: their CRFs
        CHD: their CRFS + pushed CRFs (from not-CHD)
    */
    for (let i = 0; i < crfRows.length; i++) {
      crfRows[i].weekNo = crfRows[i].year + "-" + crfRows[i].week;
    }
    this.crfCHDData = crfRows.filter(e => e.userID === this.$auth.user.userID || e.isPushed > 0);
    this.crfDRUData = crfRows.filter(e => e.userID === this.$auth.user.userID);
    this.tableOptions.columns = this.allColumns;
    if (this.$auth.user.userType === "techStaff") {
      this.allData = cifRows;
    } else if (CHDtypes.find(e => this.$auth.user.userType.includes(e)) !== undefined) {
      this.allData = cifRows.filter(e1 => e1.type === "CIF" ||
            !!this.crfCHDData.find(e2 => e2.CRFID === e1.CRFID && e2.userID === this.$auth.user.userType));
    } else { // is not-CHD; CIF, or CRF whose CRFID matches a CRF that matches the user's ID
      this.allData = cifRows.filter(e1 => e1.type === "CIF" ||
            !!this.crfDRUData.find(e2 => e2.CRFID === e1.CRFID && e2.userID === this.$auth.user.userType));
    }
    if (this.allData.length > 0) {
      this.$toast.clear();
      this.$toast.success('All cases loaded!', {duration: 4000, icon: 'check_circle'});
    }
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
    printTab(tab) {
      if (this.isPrint && this.caseTab===tab) return true;
      else return false;
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
      link.setAttribute("download", this.caseTab.toUpperCase()+".csv");
      link.click();
    },
    getTable() {
      let data = [];
      if (this.caseTab==='all') {
        for (let i=0; i<this.allData.length; i++) {
          let name = "\""+ this.allData[i].patientName +"\"";
          data[i] =  {
            type:this.allData[i].type,
            caseID : this.allData[i].caseID,
            diseaseName : this.allData[i].diseaseName,
            reportedBy : this.allData[i].reportedBy,
            patientName : name,
            city : this.allData[i].city,
            reportDate : this.allData[i].reportDate,
            updatedDate : this.allData[i].updatedDate,
            caseLevel : this.allData[i].caseLevel,
          }
        }
        return data;
      }
      else if (this.caseTab==='cif') {
        for (let i=0; i<this.cifData.length; i++) {
          let name = "\""+ this.cifData[i].patientName +"\"";
          data[i] =  {
            caseID : this.cifData[i].caseID,
            diseaseName : this.cifData[i].diseaseName,
            reportedBy : this.cifData[i].reportedBy,
            patientName : name,
            city : this.cifData[i].city,
            reportDate : this.cifData[i].reportDate,
            updatedDate : this.cifData[i].updatedDate,
            caseLevel : this.cifData[i].caseLevel,
          }
        }
        return data;
      }
      else if (this.caseTab==='crfDRU') {
        for (let i=0; i<this.crfDRUData.length; i++) {
          data[i] =  {
            weekNo : this.crfDRUData[i].weekNo,
            CRFID : this.crfDRUData[i].CRFID,
            diseaseName : this.crfDRUData[i].diseaseName,
            submitStatus : this.crfDRUData[i].submitStatus,
            submittedOn : this.crfDRUData[i].submittedOn,
            reportStatus : this.crfDRUData[i].reportStatus,
          }
        }
        return data;
      }
      else if (this.caseTab==='crfCHD') {
        for (let i=0; i<this.crfCHDData.length; i++) {
          data[i] =  {
            weekNo : this.crfCHDData[i].weekNo,
            CRFID : this.crfCHDData[i].CRFID,
            diseaseName : this.crfCHDData[i].diseaseName,
            userID : this.crfCHDData[i].userID,
            city : this.crfCHDData[i].city,
            submitStatus : this.crfCHDData[i].submitStatus,
            submittedOn : this.crfCHDData[i].submittedOn,
            reportStatus : this.crfCHDData[i].reportStatus,
          }
        }
        return data;
      }
    },
    convDatePHT(d) { // only accepts Date object; includes checking
      return !isNaN(Date.parse(d)) ? (new Date(d.getTime() + 28800000)).toISOString().substr(0, 10) : "N/A";
    },
  },
}
</script>

<style>
.allCaseBody {
  font-family: 'Work Sans', sans-serif;
  font-weight: 300;
  padding: 0px;
  margin: 0px;
  background-image: none;
}

.allCasesHeader {
  font-weight: 800;
  font-size: 32px;
  color: #346083;
}

.allCases-viewcasesContainer {
  padding: 80px 20px 5px 20px;
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .allCases-viewcasesContainer {
    width: 100%;
    align-items: center;
    margin: 0px;
  }
}

.allCases-viewcasesComponent {
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
  .allCases-viewcasesComponent {
    position: relative;
    top: 0px;
    min-height: fit-content;
  }
}

.allCases-summaryContainer {
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

.allCasesActionButtons {
  display: inline-flex;
  flex-direction: row;
  cursor: pointer;
}

.allCasesPrint {
  width: 30px;
  height: 30px;
  /* margin: 0 5px; */
  margin: -5px 5px 5px;
}

.allCasesExport {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

</style>

