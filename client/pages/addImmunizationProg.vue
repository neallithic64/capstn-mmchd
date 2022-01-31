<template>
  <div id="viewCRF" class="addIPbody">
    <!--Top Bar of the screen-->
    <TopNav />
    <div ref="content" class="addIPcontainer">
      <div class="addIP-viewDetails" style="align-text: left">
        <div class="addIP-info">
          <h1 style="margin: -10px 0" class="addIPh1">Program Immunization Report No. {{TCLID}}</h1>
          <h2 style="margin-top: -1px" class="addIPh2">{{ city }}, {{ barangay }}</h2>
          <!--p>Last updated: <b class="addIPhBold"> {{ updatedDate }} </b> </p-->
        </div>
        <div class="addIP-status" style="align-text: right; place-content: end;">
          <div v-show="!isPrint" class="addIP-actionButts">
            <ul class="CRFActionButton">
              <img
                src="~/assets/img/pdf.png"
                class="addIP-printButt"
                @click="downloadPDF"
              />
            </ul>
            <ul class="CRFActionButton">
              <img src="~/assets/img/csv.png" 
              class="addIP-printButt"
              @click="csvExport(dataSets)"
            />
            </ul>
          </div>
          <div style="display:inline-flex">
		    {{ monthsList[month] + " " + year }}
            <!--select v-model="month" class="input-year" style="float: right;margin-right: 10px;">
              <option v-for="index in (0,maxMonth)" :key="index" :value="index-1">
                {{monthsList[index-1]}}
              </option>
            </select>
            <select v-model="year" class="input-year" style="float: right;" @change="countMonth()">
              <option value='2022'>2022</option>
              <option value='2021'>2021</option>
              <option value='2020'>2020</option>
              <option value='2019'>2019</option>
              <option value='2018'>2018</option>
            </select-->
          </div>
        </div>
      </div>

      <div class="addIPcomponent" style="margin-top: 20px;">
        <dataTable
          :options="tableOptions"
          :datavalues="dataSets"
          :casetype="'immunProg'"
        />
        <div v-if="year+'' === new Date().getFullYear()+'' && month+'' === new Date().getMonth()+''" class="addIPaddButton">
          <button class="addIPaddText"><a :href="'/addImmunizationProgEntry?TCLID=' + TCLID">+ add an entry</a></button></div>
      </div>
        <div v-if="year+'' === new Date().getFullYear()+'' && month+'' === new Date().getMonth()+''" class="addIPendButt">
          <button class="back-button" type="button" @click="save()">
            Save
          </button>
          <button class="submit-button" type="button" @click="submit()">
            Submit
          </button>
        </div>
    </div>
    <div v-show="popupOpen" class="overlay">
      <div class="overlay-form">
        <button class="close" @click="popupOpen=false">x</button>
        <h2 style="color:red; text-align:center" class="addIPh2"> PUSH DATA APPROACH CONSENT </h2>
        <hr style="border-color: inherit;"/>
        <div style="padding:10px; text-align:justify;">
          <p style="margin:10px 5px; font-size:16px"> If you agree, all details will be pushed to MMCHD-RESU.
             Otherwise, data that will identify the person 
             (e.g. patient name, complete address) will not be pushed.</p>
          <p style="margin:10px 5px; font-size:16px"> Only data that is necessary for 
            time, place, and person analysis will be pushed.</p>
          <!--p style="margin:10px 5px; font-size:12px"> You can update this in your settings anytime.</p-->
          <div class="popupButtons" style="text-align: center;">
            <button class="back-button" type="button" @click="popup(false)">
              Disagree
            </button>
            <button class="next-button" type="button" @click="popup(true)">
              Agree
            </button>
          </div>
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
  head() {
    return {
      title: 'Immunization Program'
    }
  },
  compute: {},
  data() {
    return {
      popupOpen: true,
      monthsList: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      maxMonth:'',
      isPrint: false,
      TCLID: '123',
      city: 'Manila City',
      barangay: 'Barangay 123',
      updatedDate: 'Nov 10, 2020',
      month: '0',
      year: '2022',
      tableOptions: {
        sortKey: 'updatedDate',
        columns: [
          {
            title: 'Patient',
            key: 'patientName',
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
      dataSets: [],
    }
  },
  async mounted() {
	const rows = (await axios.get('http://localhost:8080/api/getTCL', {
	  params: {
	    TCLID: this.$route.query.TCLID,
		diseaseID: "DI-0000000000003",
		userID: this.$auth.user.userID
	  }
	})).data;
	console.log(rows);
	this.city = rows.userData.city;
	this.barangay = rows.userData.brgy;
	this.dataSets = rows.tclData;
    this.year = rows.TCL.year;
    this.month = rows.TCL.month;
    this.countMonth();
	this.TCLID = this.$route.query.TCLID ? this.$route.query.TCLID : rows.TCL.TCLID;
	if (!rows.pushDataAccept) this.popupOpen = true;
    else this.popupOpen = false;
  },
  methods: {
    async popup(change) {
      try {
        this.popupOpen = !this.popupOpen;
        const result = await axios.post('http://localhost:8080/api/updatePushData', {
		  userID: this.$auth.user.userID,
		  pushDataAccept: change
		});
        if (result.status === 200) {
          this.$toast.success('User Settings Updated!', {duration: 4000, icon: 'check_circle'});
        } else {
          // eslint-disable-next-line no-console
          console.log(result);
          this.$toast.error('Something went wrong!', {duration: 4000, icon: 'error'});
        }
        this.popupOpen = false;
      } catch(e) {
        // eslint-disable-next-line no-console
        console.log(e);
        this.$toast.error('Something went wrong!', {duration: 4000, icon: 'error'});
      }
    },
    countMonth() {
      this.maxMonth = this.year == 2022 ? (new Date()).getMonth() : 11;
    },
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
.addIPbody {
  font-family: 'Work Sans', sans-serif;
  font-weight: 300;
  padding: 0px;
  margin: 0px;
  background-image: none;
}

.addIP-viewDetails {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  justify-content: space-between;
}
.addIP-info,
.addIP-status {
  display: inline-flex;
  flex-direction: column;
}

.addIP-actionButts {
  display: inline-flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;
}

.addIP-printButt {
  width: 30px;
  height: 30px;
  /* margin: 0 5px; */
  margin: 5px;
}

.addIPh1 {
  color: #008d41;
  font-size: 40px;
  font-weight: 800;
}

.addIPh2 {
  color: #346083;
  font-size: 25px;
  font-weight: 600;
}

.addIPhBold {
  /* color: #346083; */
  font-size: 18px;
  font-weight: 600;
}

.addIPcontainer {
  padding: 80px 20px 5px 20px;
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .addIPcontainer {
    width: 100%;
    align-items: center;
    margin: 0px;
  }
}

.addIPcomponent {
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
  .addIPcomponent {
    position: relative;
    top: 0px;
    min-height: fit-content;
  }
}

.input-year,
select {
  width: 75px;
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

#datatabale {
  width: -webkit-fill-available;
}

.addIPaddButton {
  /* position: relative; */
  position: absolute;
  margin-top: 0px;
  margin-left: 5px;
}

.addIPaddText {
  color: #346083;
  font-size: 12px;
}

.addIPendButt {
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

.save-button, .back-button {
  width: 150px;
  height: 38px;
  max-width: 100%;
  font-size: 16px;
  margin-top: 30px;
  font-family: 'Work Sans', sans-serif;
  font-weight: 600;
  background-color: white;
  color: #346083;
}

.save-button:hover, .back-button:hover {
  border: #346083 solid 1px;
}

.overlay {
  display: block;
  z-index: 11;
  margin: 0px;
  padding: 10% 30% 20%;
  width: -webkit-fill-available;
  height: -webkit-fill-available;
  /* background: gray; */
  /* opacity: 55%; */
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(100, 100, 100, 0.4);
  /* border: 100px solid rgba(100, 100, 100, 0.4); */
}

@media only screen and (max-width:1000px) {
  .overlay  {
    padding: 20% 15%;
  }
}

.overlay-form {
  padding: 30px;
  border-radius: 40px;
  background: white;
  /* width: -webkit-fill-available;
  height: -webkit-fill-available; */
  overflow-y: auto;
  box-shadow: 1px 4px 8px rgb(0 0 0 / 40%);
}

</style>

