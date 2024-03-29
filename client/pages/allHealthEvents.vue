<template>
  <div id="viewevents" class="AHEbody">
    <!--Top Bar of the screen-->
    <TopNav/>
    <div ref="content" class="allevents-container">
      <div class="AHEexport">
        <h1 class="AHEpageHeader">All Health Events</h1>
        <div v-show="!isPrint" class="AHEaction">
          <ul class="HEActionButton" @click="downloadPDF">
          <img
            src="~/assets/img/pdf.png"
            class="AHEprint"
            @click="downloadPDF()"
          />
          </ul>
          <ul class="HEActionButton">
            <img src="~/assets/img/csv.png" 
            class="AHEprint"
            @click="csvExport(allEvents)"
          />
          </ul>
        </div>
      </div>
      <div class="allevents-component">
        <div v-if="allEvents.length > 0" id="vue-root">
          <dataTable
            :options="tableOptions"
            :datavalues="allEvents"
            :casetype="'events'"
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
      title: 'All Health Events'
    }
  },
  compute: {},
  data() {
    return {
      isPrint: false,
      tableOptions: {
        tableName: 'events',
        sortKey: 'dateReported',
        sortType:'desc',
        columns: [
          {
            title: 'Event ID',
            key: 'eventID',
            type: 'clickable',
            source: 'events',
            uniqueField: 'id',
          },
          {
            title: 'Source',
            key: 'source',
            type: 'text',
            source: 'events',
          },
          {
            title: 'Date Captured',
            key: 'dateCaptured',
            type: 'text',
            dateFormat: true,
            currentFormat: 'YYYY-MM-DD',
            expectFormat: 'DD MMM YYYY',
          },
          {
            title: 'Date Reported',
            key: 'dateReported',
            type: 'text',
            dateFormat: true,
            currentFormat: 'YYYY-MM-DD',
            expectFormat: 'DD MMM YYYY',
          },
          {
            title: 'City',
            key: 'city',
            type: 'text',
            source: 'events',
            uniqueField: 'id',
            sortable: true,
            filter: true,
          },
          {
            title: 'Cases',
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
            title: 'Status',
            key: 'eventStatus',
            type: 'text',
            source: 'events',
            sortable: true,
          },
          {
            // PHELC, PHERC, PHENC, PHEIC
            title: 'Assessment',
            key: 'assessment',
            type: 'text',
            source: 'events',
            sortable: true,
          },
        ],
        // source: 'http://demo.datatable/api/users',
        search: true,
      },
      allEvents: [],
    }
  },
  head() {
    return {
      title: 'Health Events'
    }
  },
  async mounted() {
    if (this.allEvents.length === 0) {
      this.$toast.show('Loading...', {className: 'blink', icon: 'hourglass_top'});
    }
    const DRUUserTypes = ['BHS', 'RHU', 'CHO', 'govtHosp', 'privHosp', 'clinic', 'govtLab', 'privLab', 'airseaPort', 'fhsisStaff'];
    const rows = (await axios.get('http://localhost:8080/api/getAllEvents')).data;
    
    if (DRUUserTypes.includes(this.$auth.user.userType)) {
      this.allEvents = rows.filter(e => e.userID === this.$auth.user.userID);
    } else this.allEvents = rows;
    if (this.allEvents.length > 0) {
      this.$toast.clear();
      this.$toast.success('All health events loaded!', {duration: 4000, icon: 'check_circle'});
    }
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
      link.setAttribute("download", "HealthEvents.csv");
      link.click();
    },
  },
}
</script>

<style>
.AHEbody {
  font-family: 'Work Sans', sans-serif;
  font-weight: 300;
  padding: 0px;
  margin: 0px;
  background-image: none;
}

.AHEpageHeader {
  font-weight: 800;
  font-size: 32px;
  color: #346083;
}

.allevents-container {
  padding: 80px 20px 5px 20px;
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .allevents-ontainer {
    width: 100%;
    align-items: center;
    margin: 0px;
  }
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

.allevents-component {
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
  .allevents-component {
    position: relative;
    top: 0px;
    min-height: fit-content;
  }
}

#datatabale {
  width: -webkit-fill-available;
}

.AHEaction {
  display: inline-flex;
  flex-direction: row;
  cursor: pointer;
}

.AHEprint {
  width: 30px;
  height: 30px;
  /* margin: 0 5px; */
  margin: 5px;
}

.AHEexport {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>

