<template>
  <div id="viewoutbreaks">
    <!--Top Bar of the screen-->
    <TopNav/>
    <div ref="content" class="alloutbreaks-container">
      <div class="exportButtons">
        <h1 class="pageHeader">All Outbreaks</h1>
        <div v-show="!isPrint" class="actionButtons">
          <ul class="OBActionButton" @click="downloadPDF()">
          <img
            src="~/assets/img/pdf.png"
            class="printButton"
            @click="downloadPDF()"
          />
          </ul>
          <ul class="OBActionButton">
            <img src="~/assets/img/csv.png" 
            class="printButton"
            @click="csvExport(getTable())"
          />
          </ul>
        </div>
      </div>
      <div class="alloutbreaks-component">
        <div v-if="allOutbreaks.length > 0" id="vue-root">
          <dataTable
            :options="tableOptions"
            :datavalues="allOutbreaks"
            :casetype="'outbreaks'"
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
  compute: {},
  data() {
    return {
      isPrint: false,
      tableOptions: {
        tableName: 'outbreaks',
        columns: [
          {
            title: 'Outbreak ID',
            key: 'outbreakID',
            type: 'clickable',
            source: 'ourbreaks',
            uniqueField: 'id',
          },
          {
            title: 'Disease',
            key: 'disease',
            type: 'text',
            source: 'outbreaks',
          },
          {
            title: 'Type',
            key: 'type',
            type: 'text',
            source: 'outbreaks',
          },
          {
            title: 'Start',
            key: 'dateStarted',
            type: 'text',
            dateFormat: true,
            currentFormat: 'YYYY-MM-DD',
            expectFormat: 'DD MMM YYYY',
          },
          {
            title: 'Active Cases',
            key: 'numCases',
            type: 'text',
            source: 'events'
          },
          {
            title: 'Deaths',
            key: 'numDeaths',
            type: 'text',
            source: 'events'
          },
          {
            title: 'Two-week Growth Rate',
            key: 'growthRate',
            type: 'text',
            source: 'events'
          },
          {
            title: 'Attack Rate per 100k',
            key: 'attackRate',
            type: 'text',
            source: 'events'
          },
          {
            title: 'Status',
            key: 'outbreakStatus',
            type: 'text',
            source: 'events',
            sortable: true,
          },
          {
            title: 'End',
            key: 'dateClosed',
            type: 'text',
            dateFormat: true,
            currentFormat: 'YYYY-MM-DD',
            expectFormat: 'DD MMM YYYY',
          },
          {
            title: 'Response Time',
            key: 'responseTime',
            type: 'text',
            source: 'events'
          },
        ],
        // source: 'http://demo.datatable/api/users',
        search: true,
      },
      allOutbreaks: [],
    }
  },
  head() {
    return {
      title: 'Outbreaks'
    }
  },
  async mounted() {
    const rows = (await axios.get('http://localhost:8080/api/getAllOutbreaks')).data;
    console.log(rows[0]);
    for (let i = 0; i < rows.length; i++) {
      rows[i].disease = rows[i].diseaseName;
	  delete rows[i].diseaseID;
	  rows[i].dateStarted = rows[i].startDate.substr(0, 10);
	  rows[i].dateClosed = rows[i].endDate ? rows[i].endDate.substr(0, 10) : "N/A";
	  rows[i].responseTime = rows[i].responseTime ? rows[i].responseTime : "N/A";
	  /* columns left:
	      numCases: 200,
          numDeaths: 0,
          growthRate: '813%',
          attackRate: '1.07%',
	  */
    }
    this.allOutbreaks = rows;
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
      link.setAttribute("download", "outbreaks.csv");
      link.click();
    },
    getTable() {
      return this.allOutbreaks;
      /*
      let data = [];
      for (let i=0; i<this.allOutbreaks.length; i++) {
        data[i] =  {
          // CHANGE VALUES, depends on backend
          caseID : this.allData[i].caseID,
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

.alloutbreaks-container {
  padding: 80px 20px 5px 20px;
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .alloutbreaks-ontainer {
    width: 100%;
    align-items: center;
    margin: 0px;
  }
}

.alloutbreaks-section-container {
  /* left: 275px; */
  /* position: relative; */
  /* width: calc(100vw - 320px); */
  /* margin: 5px; */
  width: 100%;
  padding: 5px;
  margin: 10px;
}

@media only screen and (max-width: 800px) {
  .alloutbreaks-section-container {
    width: 95%;
  }
}

.alloutbreaks-component {
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
  .alloutbreaks-component {
    position: relative;
    top: 0px;
    min-height: fit-content;
  }
}

.events-SummaryContainer {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  overflow-y: hidden;
  z-index: 1;
  margin-left: 5px;
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

