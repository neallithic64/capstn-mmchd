<template>
  <div id="viewCRF" class="viewCRFDbody">
    <!--Top Bar of the screen-->
    <TopNav />
    <div ref="content" class="viewCRFDcontainer">
      <div class="viewCRF-details" style="align-text: left">
        <div class="CRFnumbers">
          <h1 class="viewCRFDh1" style="margin: -10px 0">Case No. {{ CRFID }}</h1>
          <h2 class="viewCRFDh2" style="margin-top: -1px">Disease: {{ disease }}</h2>
        </div>
         
        <div class="CRFstatus" style="align-text: right">
          <h3 class="viewCRFDh3">Week No: {{ weekNo }} </h3>
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
        </div>
      </div>

      <div class="viewCRF-details" style="align-text: left">
        <div class="CIFnumbers">
          <p>DRU City: <b class="viewCRFDb">{{ druCity }}</b></p>
          <p>DRU Name: <b class="viewCRFDb">{{ druName }}</b></p>
          <p>DRU Type: <b class="viewCRFDb">{{ druType }}</b></p>
          <p>DRU Address: <b class="viewCRFDb">{{ druAddr }}</b></p>
        </div>
        <div class="CRFstatus" style="align-text: right">
          <p>Submitted on: <b class="viewCRFDb"> {{ submittedDate }} </b> </p>
          <p>Last updated: <b class="viewCRFDb"> {{ updatedDate }} </b> </p>
        </div>
      </div>

      <div class="viewCRFD-caseComponent">
        <div id="vue-root">
          <dataTable
            :options="tableOptions"
            :datavalues="crfData"
            :casetype="'crfCase'"
          />
        </div>
      </div>
      <div class="additionalButtons">
          <button class="addText" type="button" @click="lateCases()"><a :href="'/addCRFDengueCase?CRFID=' + CRFID">+ Add a Late Case</a></button>
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
      disease: 'Dengue',
      CRFID: '',
      submittedDate: '',
      updatedDate: '',
      druCity: '',
      druName: '',
      druType: '',
      druAddr: '',
      weekNo: '',
      tableOptions: {
        tableName: 'crf',
        columns: [
          {
            title: 'Case ID',
            key: 'caseID',
            type: 'clickable',
            source: 'crf',
            uniqueField: 'id',
            sortable: true,
          },
          {
            title: 'Patient',
            key: 'patientName',
            type: 'number',
            source: 'crf',
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
            key: 'reportDate',
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
            title: 'Case Status',
            key: 'caseLevel',
            type: 'text',
            source: 'cases',
            uniqueField: 'id',
            sortable: true,
            filter: true,
          },
        ],
        // source: 'http://demo.datatable/api/users',
        search: true,
      },
      crfData: [],
    }
  },
  mounted() {},
  async fetch() {
    const rows = (await axios.get('http://localhost:8080/api/getCRFPage', {
      params: {
        CRFID: this.$route.query.CRFID,
        diseaseID: "DI-0000000000003",
        userID: this.$auth.user.userID
      }
    })).data;
    for (let i = 0; i < rows.crfData.length; i++) {
      rows.crfData[i].updatedDate = rows.crfData[i].updatedDate ? this.convDatePHT(new Date(rows.crfData[i].updatedDate)) : "N/A";
      rows.crfData[i].reportDate = this.convDatePHT(new Date(rows.crfData[i].reportDate));
    }
    this.submittedDate = rows.CRF.isPushed
        ? this.convDatePHT(new Date(rows.CRF.year, 0, (1 + rows.CRF.week * 7)))
        : "N/A";
    this.updatedDate = rows.crfData.reduce((acc, val) => {
      let accD = new Date(acc.updatedDate), valD = new Date(val.updatedDate);
      return accD > valD ? accD : valD;
    }).updatedDate;
    if (this.updatedDate === "N/A") {
      this.updatedDate = rows.crfData.reduce((acc, val) => {
        let accD = new Date(acc.reportDate), valD = new Date(val.reportDate);
        return accD > valD ? accD : valD;
      }).reportDate;
    }
    console.log(rows);
    this.crfData = rows.crfData;
    this.weekNo = rows.CRF.year + "-" + rows.CRF.week;
    this.CRFID = this.$route.query.CRFID;
    this.druCity = rows.userData.druCity;
    this.druName = rows.userData.druName;
    this.druType = rows.userData.druType;
    this.druAddr = rows.userData.druAddr;
  },
  head() {
    return {
      title: 'Dengue ' + this.CRFID
    }
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
    csvExport() {
      let csvContent = "data:text/csv;charset=utf-8,";
      let header = this.getCols();
      let arrData = this.getTable();
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
      link.setAttribute("download", "CRF"+this.disease+".csv");
      link.click();
    },
    getCols() {
      var columns='';
      for (let i=0; i<Object.keys(this.tableOptions.columns).length; i++) {
        columns += this.tableOptions.columns[i].title;
        if (i+1!==Object.keys(this.tableOptions.columns)) columns += ','
      }
      return columns;
    },
    getTable() {
      let data = [];
      for (let i=0; i<this.crfData.length; i++) {
        let name = "\""+ this.crfData[i].patientName +"\"";
        data[i] =  {
          caseID : this.crfData[i].caseID,
          patientName : name,
          city : this.crfData[i].city,
          ageNo : this.crfData[i].ageNo,
          sex : this.crfData[i].sex,
          reportDate : this.crfData[i].reportDate,
          updatedDate : this.crfData[i].updatedDate,
          caseLevel : this.crfData[i].caseLevel,
        }
      }
      return data;
    },
    convDatePHT(d) { // only accepts Date object; includes checking
      return !isNaN(Date.parse(d)) ? (new Date(d.getTime() + 28800000)).toISOString().substr(0, 10) : "N/A";
    },
  },
}
</script>

<style>
.viewCRFDbody {
  font-family: 'Work Sans', sans-serif;
  font-weight: 300;
  padding: 0px;
  margin: 0px;
  background-image: none;
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

.viewCRFDh1 {
  color: #008d41;
  font-size: 40px;
  font-weight: 800;
}

.viewCRFDh2 {
  color: #346083;
  font-size: 25px;
  font-weight: 600;
}

.viewCRFDh3 {
  font-size: 24px;
  font-weight: 600;
}

.viewCRFDb {
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

.viewCRFDcontainer {
  padding: 80px 20px 5px 20px;
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .viewCRFDcontainer {
    width: 100%;
    align-items: center;
    margin: 0px;
  }
}

.viewCRFD-caseComponent {
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
  .viewCRFD-caseComponent {
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

.additionalButtons {
  /* position: relative; */
  position: absolute;
  margin-top: -110px;
  margin-left: 20px;
}

.addText {
  color: #346083;
  font-size: 16px;
  font-weight: 600;
}

.CRFendButton {
  /* margin: -10px 0 5px; */
  float: right;
  margin-top: -40px;
  margin-right: 16px;
  margin-bottom: 50px;
}

.submit-button, .next-button {
  width: 150px;
  height: 38px;
  max-width: 100%;
  font-size: 16px;
  margin-top: 30px;
  font-family: 'Work Sans', sans-serif;
  font-weight: 600;
  background-color: #346083;
  color: white;
  border: #346083 solid 0.75px;
}

.submit-button:hover, .next-button:hover {
  background-color: #346083;
}

</style>

