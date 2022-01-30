<template>
  <div id="viewevents">
    <!--Top Bar of the screen-->
    <TopNav/>
    <div ref="content" class="all-reports-container">
      <div class="exportButtons">
        <h1 class="pageHeader">All Reports</h1>
        <div v-show="!isPrint" class="actionButtons">
          <ul class="rep-action-button" @click="downloadPDF">
          <img
            src="~/assets/img/pdf.png"
            class="printButton"
            @click="downloadPDF()"
          />
          </ul>
          <ul class="rep-action-button">
            <img src="~/assets/img/csv.png" 
            class="printButton"
            @click="csvExport(getTable())"
          />
          </ul>
        </div>
      </div>
      <div class="all-reports-component">
        <div v-if="allReports.length > 0" id="vue-root">
          <dataTable
            :options="tableOptions"
            :datavalues="allReports"
            :casetype="'reports'"
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
  head() {
    return {
      title: 'All Feedback Reports'
    }
  },
  compute: {},
  data() {
    return {
      isPrint: false,
      tableOptions: {
        tableName: 'reports',
        sortKey: 'reportDateSub',
        columns: [
          {
            title: 'Report ID',
            key: 'reportID',
            type: 'clickable',
            source: 'reports',
            uniqueField: 'id',
          },
          {
            title: 'Disease',
            key: 'reportDisease',
            type: 'text',
            source: 'reports',
          },
          {
            // Monthly Feedback, Annual Feedback, Adhoc Feedback, Outbreak Feedback
            title: 'Type',
            key: 'reportType',
            type: 'text',
            source: 'reports',
          },
          {
            title: 'Date Submitted',
            key: 'reportDateSub',
            type: 'text',
            dateFormat: true,
            currentFormat: 'YYYY-MM-DD',
            expectFormat: 'DD MMM YYYY',
            sortable: true,
          },
          {
            title: 'Status',
            key: 'reportStatus',
            type: 'text',
            source: 'reports',
            sortable: true,
          },
          {
            title: 'Date Approved',
            key: 'reportDateApp',
            type: 'text',
            dateFormat: true,
            currentFormat: 'YYYY-MM-DD',
            expectFormat: 'DD MMM YYYY',
          },
        ],
        // source: 'http://demo.datatable/api/users',
        search: true,
      },
      allReports: [
        {
          reportID: '123',
          reportDisease: 'Measles',
          reportType: 'Monthly Feedback',
          reportDateSub: '2021-12-13',
          reportStatus: 'For Approval',
          reportDateApp: ''
        },
        {
          reportID: '124',
          reportDisease: 'Measles',
          reportType: 'Annual Feedback',
          reportDateSub: '2021-12-13',
          reportStatus: 'For Approval',
          reportDateApp: ''
        },
        {
          reportID: '125',
          reportDisease: 'Measles',
          reportType: 'Adhoc Feedback',
          reportDateSub: '2021-12-13',
          reportStatus: 'For Revision',
          reportDateApp: ''
        },
        {
          reportID: '126',
          reportDisease: 'Measles',
          reportType: 'Outbreak Feedback',
          reportDateSub: '2021-12-13',
          reportStatus: 'Approved',
          reportDateApp: '2021-12-25'
        }
      ],
    }
  },
  head() {
    return {
      title: 'Reports'
    }
  },
  async mounted() {
    // if (this.dataSets.length === 0) {
    //   this.$toast.show('Loading...', {className: 'blink', icon: 'hourglass_top'});
    // }
    
    // const DRUUserTypes = ['BHS', 'RHU', 'CHO', 'govtHosp', 'privHosp', 'clinic', 'govtLab', 'privLab', 'airseaPort', 'fhsis'];
    // const rows = (await axios.get('http://localhost:8080/api/getAllEvents')).data;
    
    // if (DRUUserTypes.includes(this.$auth.user.userType)) {
    //   this.allEvents = rows.filter(e => e.userID === this.$auth.user.userID);
    // } else this.allEvents = rows;
    
    // if (this.dataSets.length > 0) {
    //   this.$toast.clear();
    //   this.$toast.success('All TCLs loaded!', {duration: 4000, icon: 'check_circle'});
    // }
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

.all-reports-container {
  padding: 80px 20px 5px 20px;
  width: 100%;
}

.blink {
  animation: blink 2s steps(3, end) infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@media only screen and (max-width: 800px) {
  .allevents-ontainer {
    width: 100%;
    align-items: center;
    margin: 0px;
  }
}

.allevents-section-container {
  /* left: 275px; */
  /* position: relative; */
  /* width: calc(100vw - 320px); */
  /* margin: 5px; */
  width: 100%;
  padding: 5px;
  margin: 10px;
}

@media only screen and (max-width: 800px) {
  .allevents-section-container {
    width: 95%;
  }
}

.all-reports-component {
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
  .all-reports-component {
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

