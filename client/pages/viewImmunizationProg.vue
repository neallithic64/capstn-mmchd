<template>
  <div id="viewCRF" class="VIPbody">
    <!--Top Bar of the screen-->
    <TopNav />
    <div ref="content" class="VIPcontainer">
      <div class="VIPdetails" style="align-text: left">
        <div class="VIPnumbers">
          <h1 class="VIPh1" style="margin: -10px 0">Program Immunization Report No. {{ TCLID }}</h1>
          <h2 class="VIPh2" style="margin-top: -1px">{{ city }}, {{ brgy }}</h2>
          <h3 class="VIPh3">{{ month }} {{ year }} </h3>
          <p>Submitted by: <b class="VIPb"> {{ submittedBy }} </b> </p>
        </div>
         
        <div class="VIPstatus" style="align-text: right; place-content: end;">
          
          <div v-show="!isPrint" class="VIPactionButts">
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
              @click="csvExport(dataSets)"
            />
            </ul>
          </div>
          <!--p>Reported on: <b class="VIPb"> {{ submittedDate }} </b> </p>
          <p>Last updated: <b class="VIPb"> {{ updatedDate }} </b> </p-->
        </div>
      </div>

      <div class="VIPcomponent">
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
  head() {
    return {
      title: 'Immunization Program'
    }
  },
  data() {
    return {
      isPrint: false,
      monthsList: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      TCLID: '',
      city: '',
      brgy: '',
      submittedBy: '',
      dateSubmitted: 'Nov 11, 2021',
      // updatedDate: 'Nov 10, 2020',
      month: '',
      year: '',

      tableOptions: {
        sortKey: 'dateAdded',
        columns: [
          {
            title: 'Patient',
            key: 'patientID',
            type: 'clickable',
            sortable: true,
          },
          {
            title: 'City',
            key: 'patientCity',
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
            title: 'Reported on',
            key: 'dateAdded',
            type: 'text',
            dateFormat: true,
            currentFormat: 'YYYY-MM-DD',
            expectFormat: 'DD MMM YYYY',
            sortable: true,
          },
          /*
          {
            title: 'Last updated',
            key: 'updatedDate',
            type: 'text',
            dateFormat: true,
            currentFormat: 'YYYY-MM-DD',
            expectFormat: 'DD MMM YYYY',
            sortable: true,
          },
          */
          {
            title: 'Immunization Status',
            key: 'immunizationStatus',
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
      dataSets: [],
    }
  },
  mounted() {},
  async fetch() {
    const rows = (await axios.get('http://localhost:8080/api/getTCL', {
      params: {
        TCLID: this.$route.query.TCLID,
        diseaseID: "DI-0000000000003",
        userID: this.$auth.user.userID
      }
    })).data;
    console.log(rows);
    for (let i = 0; i < rows.tclData.length; i++) {
      rows.tclData[i].dateAdded = this.convDatePHT(new Date(rows.tclData[i].dateAdded));
      rows.tclData[i].action = rows.tclData[i].immunizationStatus === "Complete" ? "view" : "update";
      // rows.tclData[i].updatedDate = rows.tclData[i].updatedDate ? this.convDatePHT(new Date(rows.tclData[i].updatedDate)) : "N/A";
      // rows.tclData[i].reportDate = this.convDatePHT(new Date(rows.tclData[i].reportDate));
    }
    this.dataSets = rows.tclData;
    this.month = this.monthsList[rows.TCL.month];
    this.year = rows.TCL.year;
    this.TCLID = this.$route.query.TCLID;
    this.city = rows.userData.city;
    this.brgy = rows.userData.brgy;
    this.submittedBy = rows.userData.druName;
  },
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
    convDatePHT(d) { // only accepts Date object; includes checking
      return !isNaN(Date.parse(d)) ? (new Date(d.getTime() + 28800000)).toISOString().substr(0, 10) : "N/A";
    },
  },
}
</script>

<style>
.VIPbody {
  font-family: 'Work Sans', sans-serif;
  font-weight: 300;
  padding: 0px;
  margin: 0px;
  background-image: none;
}

.VIPdetails {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  justify-content: space-between;
}
.VIPnumbers,
.VIPstatus {
  display: inline-flex;
  flex-direction: column;
}

.VIPactionButts {
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

.VIPh1 {
  color: #008d41;
  font-size: 40px;
  font-weight: 800;
}

.VIPh2 {
  color: #346083;
  font-size: 25px;
  font-weight: 600;
}

.VIPh3 {
  font-size: 24px;
  font-weight: 600;
}

.VIPb {
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

.VIPcontainer {
  padding: 80px 20px 5px 20px;
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .VIPcontainer {
    width: 100%;
    align-items: center;
    margin: 0px;
  }
}

.VIPcomponent {
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
  .VIPcomponent {
    position: relative;
    top: 0px;
    min-height: fit-content;
  }
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

</style>

