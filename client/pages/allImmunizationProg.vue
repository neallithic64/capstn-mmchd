<template>
  <div id="viewCases" class="AIPbody">
    <!--Top Bar of the screen-->
    <TopNav />
    <div ref="content" class="AIP-view">
      <div class="AIPexport">
        <h1 class="AIPpeageHeader"> Immunization Program Reports </h1>
        <div v-show="!isPrint" class="AIPactionButtons" style="display: flex;margin-top: 5px;">
          <ul class="AIPactionButton">
          <img
            src="~/assets/img/pen.png"
            class="AIPprint"
            @click="isEdit=true"
          />
          </ul>
          <ul class="AIPactionButton">
          <img
            src="~/assets/img/pdf.png"
            class="AIPprint"
            @click="downloadPDF"
          />
          </ul>
          <ul class="AIPactionButton">
            <img src="~/assets/img/csv.png" 
            class="AIPprint"
            @click="csvExport(dataSets)"
          />
          </ul>
        </div>
      </div>
      <div v-if="dataSets.length > 0" class="AIP-viewComponent">
        <dataTable
          :options="tableOptions"
          :datavalues="dataSets"
          :casetype="'immunProgs'"
        />
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
    title: 'Immunization Program',
  },
  head() {
    return {
      title: 'All Program Reports'
    }
  },
  compute: {},
  data() {
    return {
      isPrint: false,
      dayTime: '',
      monthsList: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      tableOptions: {
        tableName: 'cases',
        sortKey: 'updateDate',
        columns: [
          {
            title: 'Immunization Program ID',
            key: 'TCLID',
            sortable: true,
            type: 'clickable',
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
            title: 'Month',
            key: 'month',
            sortable: true,
          },
          {
            title: 'Immunized Patients',
            key: 'immuniPati',
            sortable: true,
          },
          {
            title: 'Total Patients',
            key: 'totalPatients',
            sortable: true,
          },
          /*{
            title: 'Last Updated',
            key: 'updateDate',
            sortable: true,
          },*/
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
      this.$toast.show('Loading...', {className: 'blink', icon: 'hourglass_top'});
    }
    this.dayTime = (new Date()).toString().split(":").slice(0, 2).join(":");
	const data = (await axios.get('http://localhost:8080/api/getAllTCLs')).data;
	for (let i = 0; i < data.length; i++) {
	  data[i].month = this.monthsList[data[i].month];
	  data[i].submitStatus = data[i].isPushed ? "Submitted" : "Ongoing";
	}
	this.dataSets = data;
    if (this.dataSets.length > 0) {
      this.$toast.clear();
      this.$toast.success('All TCLs loaded!', {duration: 4000, icon: 'check_circle'});
    }
  },
  methods: {
    editInput() {
      if (this.isEdit) return 'editable';
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
      link.setAttribute("download", "ImmunizationPrograms.csv");
      link.click();
    },
  },
}
</script>

<style>
.AIPbody {
  font-family: 'Work Sans', sans-serif;
  font-weight: 300;
  padding: 0px;
  margin: 0px;
  background-image: none;
}

.AIPpeageHeader {
  font-weight: 800;
  font-size: 32px;
  color: #346083;
}

.AIP-view {
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
  .AIP-view {
    width: 100%;
    align-items: center;
    margin: 0px;
  }
}

.AIP-viewSectionContainer {
  /* left: 275px; */
  /* position: relative; */
  /* width: calc(100vw - 320px); */
  /* margin: 5px; */
  width: 100%;
  padding: 5px;
  margin: 10px;
}

@media only screen and (max-width: 800px) {
  .AIP-viewSectionContainer {
    width: 95%;
  }
}

.AIP-viewComponent {
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
  .AIP-viewComponent {
    position: relative;
    top: 0px;
    min-height: fit-content;
  }
}

.AIPprint {
  width: 30px;
  height: 30px;
  /* margin: 0 5px; */
  margin: -5px 5px 5px;
}

.AIPexport {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.save-button {
  width: 150px;
  height: 38px;
  max-width: 100%;
  font-size: 16px;
  font-family: 'Work Sans', sans-serif;
  font-weight: 600;
  background-color: #346083;
  color: white;
  border: #346083 solid 0.75px;
}

.save-button:hover {
  background-color: #346083;
}

.cancel-button {
  width: 150px;
  height: 38px;
  max-width: 100%;
  font-size: 16px;
  font-family: 'Work Sans', sans-serif;
  font-weight: 600;
  background-color: white;
  color: #346083;
}

.cancel-button:hover {
  border: #346083 solid 1px;
}

.input-year,
select {
  height: 30px;
  font-size: 16px;
  font-family: 'Work Sans', sans-serif;
  padding-right: 5px;
  padding-left: 5px;
  /* border: 1p x solid rgba(0, 0, 0, 0.25); */
  border: 1px solid #a3a3a3;
  box-sizing: border-box;
  border-radius: 9px;
}

.AIPactionButton {
    list-style: none;
    margin: 0;
    padding: 0;
    margin-top: 5px;
}

.editable {
  background: white;
}

</style>

