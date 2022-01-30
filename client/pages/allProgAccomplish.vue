<template>
  <div id="viewCases" class="APAbody">
    <!--Top Bar of the screen-->
    <TopNav />
    <div ref="content" class="APAcontainer">
      <div class="exportButtons">
        <h1 class="APApageHeader"> All Program Accomplishment Report </h1>
        <div v-show="!isPrint" class="APAactionButtons" style="display: flex;margin-top: 5px;">
          <ul class="APAactionButton">
            <img src="~/assets/img/pdf.png"
              class="printButton"
              @click="downloadPDF"
            />
          </ul>
          <ul class="APAactionButton">
            <img src="~/assets/img/csv.png" 
              class="printButton"
              @click="csvExport(dataSets)"
            />
          </ul>
        </div>
      </div>
      <div class="APAcomponent">
        <div v-if="dataSets.length > 0" id="vue-root">
          <dataTable
            :options="tableOptions"
            :datavalues="dataSets"
            :casetype="'allProgAccomplish'"
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
      title: 'All Accomplishment Reports'
    }
  },
  compute: {},
  data() {
    return {
      isPrint: false,
      tableOptions: {
        tableName: 'cases',
        sortKey: 'dateUpdated',
        columns: [
          {
            title: 'Program Accomplish ID',
            key: 'progAccompID',
            sortable: true,
            type: 'clickable',
          },
          {
            title: 'Disease',
            key: 'diseaseName',
            sortable: true,
            filter:true,
          },
          {
            title: 'City',
            key: 'city',
            sortable: true,
            filter:true,
          },
          {
            title: 'Barangay',
            key: 'brgy',
            sortable: true,
          },
          {
            title: 'Year',
            key: 'year',
            sortable: true,
          },
          {
            title: 'Date Updated',
            key: 'dateUpdated',
            sortable: true,
          },
          {
            title: 'Submit Status',
            key: 'submitStatus',
          },
        ],
        // source: 'http://demo.datatable/api/users',
        search: true,
      },
      dataSets: [],
    }
  },
  async mounted() {
    if (this.dataSets.length === 0) {
      this.$toast.show('Loading...', {icon: 'hourglass_top'});
    }
    const data = (await axios.get('http://localhost:8080/api/getProgAccomps')).data;
    data.forEach(e => e.dateUpdated = this.convDatePHT(new Date(e.dateUpdated)));
    this.dataSets = data;
    if (this.dataSets.length > 0) {
      this.$toast.clear();
      this.$toast.success('All program accomplishments loaded!', {duration: 4000, icon: 'check_circle'});
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
      link.setAttribute("download", "ProgAccomplishReport.csv");
      link.click();
    },
    convDatePHT(d) { // only accepts Date object; includes checking
      return !isNaN(Date.parse(d)) ? (new Date(d.getTime() + 28800000)).toISOString().substr(0, 10) : "N/A";
    },
  },
}
</script>

<style>
.APAbody {
  font-family: 'Work Sans', sans-serif;
  font-weight: 300;
  padding: 0px;
  margin: 0px;
  background-image: none;
}

.APApageHeader {
  font-weight: 800;
  font-size: 32px;
  color: #346083;
}

.APAcontainer {
  padding: 80px 20px 5px 20px;
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .APAcontainer {
    width: 100%;
    align-items: center;
    margin: 0px;
  }
}

.APAsectionContainer {
  /* left: 275px; */
  /* position: relative; */
  /* width: calc(100vw - 320px); */
  /* margin: 5px; */
  width: 100%;
  padding: 5px;
  margin: 10px;
}

@media only screen and (max-width: 800px) {
  .APAsectionContainer {
    width: 95%;
  }
}

.APAcomponent {
  /* position: relative;
  display: inline-flex;
  flex-direction: row; */
  height: fit-content;
  width: 100%;

  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.25));
  background-color: #f2f2f2;
  border-radius: 10px;
  padding: 15px;
  padding-bottom: 20px;
  margin-bottom: 40px;
}
@media only screen and (max-width: 800px) {
  .APAcomponent {
    position: relative;
    top: 0px;
    min-height: fit-content;
  }
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

</style>

