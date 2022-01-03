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
        <div id="vue-root">
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
            title: 'Date Started',
            key: 'dateStarted',
            type: 'text',
            dateFormat: true,
            currentFormat: 'YYYY-MM-DD',
            expectFormat: 'DD MMM YYYY',
          },
          {
            title: 'No. of Cases',
            key: 'numCases',
            type: 'text',
            source: 'events'
          },
          {
            title: 'No. of Deaths',
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
            title: 'Attack Rate per 10k',
            key: 'attackRate',
            type: 'text',
            source: 'events'
          },
          {
            title: 'Outbreak Status',
            key: 'outbreakStatus',
            type: 'text',
            source: 'events',
            sortable: true,
          },
          {
            title: 'Date Closed',
            key: 'dateClosed',
            type: 'text',
            dateFormat: true,
            currentFormat: 'YYYY-MM-DD',
            expectFormat: 'DD MMM YYYY',
          },
        ],
        // source: 'http://demo.datatable/api/users',
        search: true,
      },
      allOutbreaks: [
        {
          outbreakID: '123',
          disease: 'Measles',
          dateStarted: '2021-12-31',
          numCases: '200',
          numDeaths: '0',
          growthRate: '813%',
          attackRate: '1.07%',
          outbreakStatus: 'Ongoing',
          dateClosed: 'N/A'
        },
        {
          outbreakID: '124',
          disease: 'Dengue',
          dateStarted: '2021-12-09',
          numCases: '1',
          numDeaths: '0',
          growthRate: '813%',
          attackRate: '1.07%',
          outbreakStatus: 'Controlled',
          dateClosed: 'N/A'
        },
        {
          outbreakID: '124',
          disease: 'Dengue',
          dateStarted: '2021-12-01',
          numCases: '1',
          numDeaths: '0',
          growthRate: '813%',
          attackRate: '1.07%',
          outbreakStatus: 'Closed',
          dateClosed: 'N/A'
        },
      ],
    }
  },
  head() {
    return {
      title: 'Outbreaks'
    }
  },
  // async mounted() {
  //   const rows = (await axios.get('http://localhost:8080/api/getPatients')).data;
	// console.log("all cases count: " + rows.length);
	// for (let i = 0; i < rows.length; i++) {
	//   rows[i].reportDate = rows[i].reportDate ? rows[i].reportDate.substr(0, 10) : "undefined";
	//   // default to reportDate if updatedDate is null
	//   rows[i].updatedDate = rows[i].updatedDate ? rows[i].updatedDate.substr(0, 10) : rows[i].reportDate;
	//   rows[i].disease = rows[i].diseaseName;
	// }
  // },
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

