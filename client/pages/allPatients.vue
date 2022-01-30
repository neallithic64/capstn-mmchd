<template>
  <div id="viewpatients" class="allPatientsBody">
    <!--Top Bar of the screen-->
    <TopNav />
    <div ref="content" class="viewpatients-container">
      <div class="exportButtons">
        <h1 class="pageHeader">All Patients</h1>
        <div v-show="!isPrint" class="actionButtons">
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
      <div class="viewpatients-component">
        <div v-if="allPatients.length > 0" id="vue-root">
          <dataTable
            :options="tableOptions"
            :datavalues="allPatients"
            :casetype="'patients'"
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
      title: 'All Patients'
    }
  },
  data() {
    return {
      isPrint: false,
      tableOptions: {
        tableName: 'patients',
        sortKey: 'patientID',
        columns: [
          {
            title: 'Patient ID',
            key: 'patientID',
            type: 'clickable',
            source: 'patients',
            uniqueField: 'id',
          },
          {
            title: 'Patient Name',
            key: 'patientName',
            type: 'text',
            source: 'patients',
            uniqueField: 'id',
            sortable: true,
          },
          {
            title: 'City',
            key: 'currCity',
            type: 'text',
            source: 'patients',
            uniqueField: 'id',
            sortable: true,
            filter: true,
          },
          {
            title: 'Last Case Update',
            key: 'updatedDate',
            type: 'text',
            dateFormat: true,
            currentFormat: 'YYYY-MM-DD',
            expectFormat: 'DD MMM YYYY',
            sortable: true,
          },
        ],
        // source: 'http://demo.datatable/api/users',
        search: true,
      },
      allPatients: [],
    }
  },
  async mounted() {
    const rows = (await axios.get('http://localhost:8080/api/getPatients', {
      params: { userID: this.$auth.user.userID }
    })).data;
    for (let i = 0; i < rows.length; i++) {
      rows[i].patientName = rows[i].lastName + ", " + rows[i].firstName + " " + rows[i].midName;
      rows[i].updatedDate = rows[i].updatedDate ? this.convDatePHT(new Date(rows[i].updatedDate)) : "N/A";
    }
    this.allPatients = rows;
  },
  methods: {
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
    csvExport(arrData) {
      let csvContent = "data:text/csv;charset=utf-8,";
      // let header = this.getCols();
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
      link.setAttribute("download", "patients.csv");
      link.click();
    },
    getTable() {
      return this.allPatients;
      /*
      let data = [];
      for (let i=0; i<this.allOutbreaks.length; i++) {
        let name = "\""+ this.allData[i].patientName +"\"";
        data[i] =  {
          // CHANGE VALUES, depends on backend
          caseID : this.allData[i].caseID,
          patientName : name,
          diseaseName : this.allData[i].diseaseName,
          reportedBy : this.allData[i].reportedBy,
          city : this.allData[i].city,
          reportDate : this.allData[i].reportDate,
          updatedDate : this.allData[i].updatedDate,
          caseLevel : this.allData[i].caseLevel,
        }
      }
      return data;
      */
    },
    convDatePHT(d) { // only accepts Date object; includes checking
      return !isNaN(Date.parse(d)) ? (new Date(d.getTime() + 28800000)).toISOString().substr(0, 10) : "N/A";
    },
  },
}
</script>

<style>
.allPatientsBody {
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

.viewpatients-container {
  padding: 80px 20px 5px 20px;
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .viewpatients-ontainer {
    width: 100%;
    align-items: center;
    margin: 0px;
  }
}

.viewpatients-section-container {
  /* left: 275px; */
  /* position: relative; */
  /* width: calc(100vw - 320px); */
  /* margin: 5px; */
  width: 100%;
  padding: 5px;
  margin: 10px;
}

@media only screen and (max-width: 800px) {
  .viewpatients-section-container {
    width: 95%;
  }
}

.viewpatients-component {
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
  .viewpatients-component {
    position: relative;
    top: 0px;
    min-height: fit-content;
  }
}

#datatabale {
  width: -webkit-fill-available;
}

.actionButtons {
  display: inline-flex;
  flex-direction: row;
  cursor: pointer;
}

.printButton {
  width: 30px;
  height: 30px;
  /* margin: 0 5px; */
  margin: 5px;
}

.exportButtons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>

