<template>
  <div id="viewCRF">
    <!--Top Bar of the screen-->
    <TopNav />
    <div ref="content" class="viewcases-container">
      <div class="viewCRF-details" style="align-text: left">
        <div class="CRFnumbers">
          <h1 style="margin: -10px 0">Program Immunization Report No. {{immunProgNo}}</h1>
          <h2 style="margin-top: -1px">{{ city }}, {{ barangay }}</h2>
          <h3>{{ month }} {{ year }} </h3>
          <p>Submitted by: <b> {{ submittedBy }} </b> </p>
        </div>
         
        <div class="CRFstatus" style="align-text: right; place-content: end;">
          
          <div v-show="!isPrint" class="CRFActionButtons">
            <ul class="CRFActionButton">
              <img
                src="~/assets/img/pdf.png"
                class="printButton"
                @click="downloadPDF"
              />
            </ul>
            <ul class="CRFActionButton">
              <img src="~/assets/img/csv.png" 
              class="printButton"
              @click="csvExport()"
            />
            </ul>
          </div>
          <p>Submitted on: <b> {{ submittedDate }} </b> </p>
          <p>Last updated: <b> {{ updatedDate }} </b> </p>
        </div>
      </div>

      <div class="viewcases-component">
        <div id="vue-root">
          <dataTable
            :options="tableOptions"
            :datavalues="dataSets"
            :casetype="'immunProg'"
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
const axios = require('axios')

export default {
  components: {
    dataTable,
  },
  middleware: 'is-auth',
  header: {
    title: 'View CRF',
  },
  compute: {},
  data() {
    return {
      isPrint: false,
      immunProgNo: '123',
      city: 'Manila City',
      barangay: 'Barangay 123',
      submittedBy: 'me',
      submittedDate: 'Nov 11,2021',
      updatedDate: 'Nov 10, 2020',
      month: 'January',
      year: '2021',

      tableOptions: {
        sortKey: 'updatedDate',
        columns: [
          {
            title: 'Patient',
            key: 'patientID',
            type: 'clickable',
            sortable: true,
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
            title: 'Immunization Status',
            key: 'immunStatus',
            type: 'text',
            source: 'cases',
            uniqueField: 'id',
            sortable: true,
            filter: true,
          },
          {
            title: 'Action',
            key: 'action',
            source: 'cases',
          },
        ],
        // source: 'http://demo.datatable/api/users',
        search: true,
      },
      dataSets: [
        {
          patientID: 'me',
          city: 'Manila',
          ageNo: '9',
          sex: 'F',
          addDate: '',
          updatedDate: '',
          immunStatus: 'Complete',
          action: 'view',
        },
        {
          patientID: 'me',
          city: 'Manila',
          ageNo: '9',
          sex: 'F',
          addDate: '',
          updatedDate: '',
          immunStatus: 'Ongoing',
          action: 'update',
        },
      ],
    }
  },
  mounted() {},
  /*
  async fetch() {
    const rows = (await axios.get('http://localhost:8080/api/getCRFPage', {
      params: {
        CRFID: this.$route.query.CRFID,
		diseaseID: "DI-0000000000003",
		userID: this.$auth.user.userID
      }
    })).data;
    console.log(rows);
    for (let i = 0; i < rows.dataSets.length; i++) {
      rows.dataSets[i].updatedDate = rows.dataSets[i].updatedDate ? rows.dataSets[i].updatedDate.substr(0, 10) : "N/A";
      rows.dataSets[i].reportDate = rows.dataSets[i].reportDate.substr(0, 10);
    }
    this.dataSets = rows.dataSets;
    this.weekNo = rows.CRF.year + "-" + rows.CRF.week;
    this.CRFID = this.$route.query.CRFID;
  },
  */
  methods: {
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
    csvExport(arrData) {
      let csvContent = "data:text/csv;charset=utf-8,";
      // let header = this.getCols();
      // let arrData = this.getTable();
      let header = Object.keys(arrData[0]).join(",");
      csvContent += [
        header,
        ...arrData.map(item => Object.values(item).join(","))
      ]
        .join("\n")
        .replace(/(^\[)|(\]$)/gm, "");

      const data = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", data);
      link.setAttribute("download", "ImmunizationProgram.csv");
      link.click();
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
  cursor: pointer;
}

.printButton {
  width: 30px;
  height: 30px;
  /* margin: 0 5px; */
  margin: 5px;
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
  font-size: 24px;
  font-weight: 600;
}

b {
  /* color: #346083; */
  font-size: 18px;
  font-weight: 600;
}

.printCRFButton {
  width: 30px;
  height: 30px;
  margin-top: 10px;
  margin-bottom: -15px;
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

