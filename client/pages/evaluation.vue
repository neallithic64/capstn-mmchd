<template>
  <div id="viewCases" class="EvaluationBody">
    <!--Top Bar of the screen-->
    <TopNav />
    <div ref="content" class="evalView width100 margin0 alignCenter">
      <h1 class="allCasesHeader">Evaluation</h1>
      <div v-show="!isPrint" class="EvalExport">
        <div class="allCases-summaryContainer">
          <ul :class="formListClass('dru')" @click="clickTab('dru')">
            DRU Evaluation
          </ul>
          <ul :class="formListClass('healthprog')" @click="clickTab('healthprog')">
            Health Program Evaluation
          </ul>
        </div>
        <div class="EvalActionButtons" style="margin-top: -15px;">
          <ul class="EvalActionButton">
          <img
            src="~/assets/img/pdf.png"
            class="EvalPrint"
            @click="downloadPDF"
          />
          </ul>
          <!-- <ul class="EvalActionButton">
            <img src="~/assets/img/csv.png" 
            class="EvalPrint"
            @click="csvExport(getTable())"
          />
          </ul> -->
        </div>
      </div>
      <div :class="containerPrintClass()">
        <div v-show="caseTab==='dru'" v-if="!isPrint" style="margin:20px 0;">
            <div class="EvalContainer">
                <div class="searchDRUword"> Search DRU: </div>
                <div class="bar">
                  <input
                    id="input"
                    class="searchbar"
                    type="search"
                    autocomplete="off"
                    spellcheck="false"
                    role="combobox"
                    aria-live="off"
                    placeholder="Type in DRU"
                    @keyup="searchDRU"
                  />
                  <div v-if="DRUResult.length && showDRUchoices" class="searchDRUValues">
                    <div v-for="(DRU, i) in DRUResult" :key="i" class="searchResult">
                      <!-- <img class="searchPersonIcon" /> -->
                      <div class="searchResultInfo" @click="selectDRU(DRU)">
                        <div class="searchPerson">
                          {{ DRU.druName }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
        <div v-show="(caseTab==='dru' || isPrint) && DRUselected"> <!--class= "evalViewComponent bgColorWhite width100 borderRadius1 padding15"-->
            <div v-show="isPrint" style="margin-top: 10px"></div>
            <h3 class="EvalTableTitle" :class="h3PrintClass()"> DRU Evaluation {{selectedDRU}} </h3>
            <dataTable
            :options="DRUEvalTableOptions"
            :datavalues="DRUEvalDataSets"
            :casetype="'eval'"
            />

            <div v-show="isPrint" style="margin-top: 10px; min-height: 10px;"></div>
            <hr v-show="!isPrint" style="margin:30px 0 20px;"/>

            <div class="flexRow justifySpace width100">
              <h3 class="EvalTableTitle" :class="h3PrintClass()"> Surveillance Evaluation {{selectedDRU}} </h3>
              <div class="flexRow">
                  <select
                    v-model="DRUsurveillanceMonth"
                    class="marginLeft10"
                  >
                    <option v-for="(month, i) in monthsList" :key=i :value="i">{{month}}</option>
                  </select>
                  <select
                    v-model="DRUsurveillanceYear"
                    class="marginLeft10"
                  >
                    <option v-for="(year, i) in yearList" :key=i :value="year">{{year}}</option>
                  </select>
              </div>
            </div>
            <dataTable
            :options="SurveillanceEvalTableOptions"
            :datavalues="SurveillanceEvalDataSets"
            :casetype="'eval'"
            />
        </div>

        <div v-show="isPrint && DRUselected" style="margin-top: 40px"></div>
        <hr v-show="isPrint && DRUselected" style="border-top: 2px solid black; margin: 20px 0"/>

        <div v-show="caseTab === 'healthprog' || isPrint" >
          <div class="flexRow width100 justifyRight">
            <select
              v-model="HealthProgEvalMonth"
              class="marginLeft10"
            >
              <option v-for="(month, i) in monthsList" :key=i :value="i">{{month}}</option>
            </select>
            <select
              v-model="HealthProgEvalYear"
              class="marginLeft10"
            >
              <option v-for="(year, i) in yearList" :key=i :value="year">{{year}}</option>
            </select>
          </div>

            <div v-show="isPrint" style="margin-top: 10px"></div>
            <h3 class="EvalTableTitle" :class="h3PrintClass()"> Health Program Evaluation </h3>
            <dataTable
            :options="HealthProgEvalTableOptions"
            :datavalues="HealthProgEvalDataSets"
            :casetype="'eval'"
            />

            <hr v-show="!isPrint" style="margin:30px 0 20px;"/>
            <div v-show="isPrint" style="margin-top: 10px"></div>
            <h3 class="EvalTableTitle" :class="h3PrintClass()"> Risk Factor </h3>
            <dataTable
            :options="OddsRatioTableOptions"
            :datavalues="OddsRatioDataSets"
            :casetype="'eval'"
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
    title: 'Evaluation',
  },
  head() {
    return {
      title: 'Evaluation'
    }
  },
  compute: {},
  data() {
    return {
      caseTab: 'dru',
      isPrint: false,
      DRUsurveillanceMonth: 0,
      DRUsurveillanceYear: '2022',
      HealthProgEvalMonth: 0,
      HealthProgEvalYear: '2022',
      DRUs: [],
      DRUResult: [],
      selectedDRU: '(dont forget to add () ehhe)',
      DRUselected: false,
      showDRUchoices: true,
      monthsList: ['-', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      yearList: ['2018', '2019', '2020', '2021', '2022'],
      DRUEvalTableOptions: {
        tableName: 'SurveillanceEval',
        sortKey: 'weekNo',
        columns: [
          {
            title: 'Year-Week No',
            key: 'weekNo',
            sortable: true,
          },
          {
            title: 'Num of Cases',
            key: 'caseCount',
            sortable: true,
          },
          {
            title: 'CIF Submission', // (yes/no)
            key: 'CIFSubmission',
          },
          {
            title: 'CRF Submission', // (zero report submitted/late cases submitted/cases submitted)
            key: 'CRFSubmission',
          },
        ],
        search: true,
      },
      DRUEvalDataSets: [
        {
          weekNo: '2022 01',
          caseCount: '1',
          CIFSubmission: 'yes',
          CRFSubmission: 'zero report submitted',
        },
        {
          weekNo: '2022 02',
          caseCount: '2',
          CIFSubmission: 'no',
          CRFSubmission: 'late cases submitted',
        },
        {
          weekNo: '2022 03',
          caseCount: '3',
          CIFSubmission: 'yes',
          CRFSubmission: 'cases submitted',
        },
      ],
      SurveillanceEvalTableOptions: {
        tableName: 'SurveillanceEval',
        sortKey: 'DRU',
        columns: [
          {
            title: 'Total Cases',
            key: 'totalCases',
            sortable: true,
          },
          {
            title: 'Timeliness',
            key: 'timeliness',
            sortable: true,
          },
          {
            title: 'Completeness',
            key: 'completeness',
            sortable: true,
          },
        ],
        search: true,
      },
      SurveillanceEvalDataSets: [
        {
          DRU: 'a',
          totalCases: 'a',
          timeliness: 'a',
          completeness: 'a',
        },
      ],
      HealthProgEvalTableOptions: {
        tableName: 'HealthProgEval',
        sortKey: 'disease',
        columns: [
          {
            title: 'Disease',
            key: 'disease',
            sortable: true,
          },
          {
            title: 'Health Program',
            key: 'healthProg',
          },
          {
            title: 'Number of Cases',
            key: 'cases',
            sortable: true,
          },
          {
            title: 'Number of Vaccinated / Treated',
            key: 'treated',
            sortable: true,
          },
          {
            title: 'Odds Ratio',
            key: 'oddsRatio',
            sortable: true,
          },
        ],
        search: false,
      },
      HealthProgEvalDataSets: [
          {
              disease: 'a',
              healthProg: 'a',
              cases: 'a',
              treated: 'a',
              oddsRatio: 'a',
          },
          {
              disease: 'a',
              healthProg: 'a',
              cases: 'a',
              treated: 'a',
              oddsRatio: 'a',
          }
      ],
      OddsRatioTableOptions: {
        tableName: 'OddsRatio',
        sortKey: 'disease',
        columns: [
          {
            title: 'Disease',
            key: 'disease',
            sortable: true,
          },
          {
            title: 'Lifestyle Factors',
            key: 'risk1',
            sortable: true,
          },
          {
            title: 'Health Conditions',
            key: 'risk2',
            sortable: true,
          },
          {
            title: 'Historical Heath Information',
            key: 'risk3',
            sortable: true,
          },
          {
            title: 'Other Factors',
            key: 'risk4',
            sortable: true,
          },
        ],
        search: false,
      },
      OddsRatioDataSets: [
          {
              disease: 'a',
              risk1: 'a',
              risk2: 'a',
              risk3: 'a',
              risk4: 'a',
          },
          {
              disease: 'a',
              risk1: 'a',
              risk2: 'a',
              risk3: 'a',
              risk4: 'a',
          }
      ],
    }
  },
  async fetch() {
    let rows = (await axios.get('http://localhost:8080/api/getAllDRUs')).data;
    this.DRUs = rows;
  },
  methods: {
    clickTab(caseTab) {
      this.caseTab = caseTab;
    },
    formListClass(caseTab) {
      if (caseTab === this.caseTab) return 'formSummaryItems selected';
      else return 'formSummaryItems';
    },
    containerPrintClass() {
      if (!this.isPrint) return 'allCases-viewcasesComponent';
    },
    h3PrintClass() {
      if (this.isPrint) return 'colorGreen';
      else return 'greenbg';
    },
    downloadPDF() {
      this.isPrint = !this.isPrint;
      setTimeout(() => (window.print()), 200);
      setTimeout(() => (this.isPrint = !this.isPrint), 200);

      // let pWidth = 595.28 // 595.28 is the width of a4
      // let srcWidth = this.$refs.content.scrollWidth
      // let margin = 12 // narrow margin - 1.27 cm (36);
      // let scale = (pWidth - margin * 2) / srcWidth

      // var doc = new jsPDF('p', 'pt', 'A4')
      // window.html2canvas = html2canvas

      // doc.html(this.$refs.content, {
      //   x: margin,
      //   y: margin,
      //   html2canvas: {
      //     scale: scale,
      //   },
      //   callback: function () {
      //     window.open(doc.output('bloburl'))
      //   },
      // })

      // // doc.save('test.pdf')
      // console.log(this.$refs.content)
      // setTimeout(() => (this.isPrint = !this.isPrint), 3000)
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
    searchDRU(event) {
      this.showDRUchoices = true
      this.DRUResult = [];
      if (event.target.value !== '') {
        let ctr = 0;
        for (let i = 0; i < this.DRUs.length && ctr < 5; i++) {
          // eslint-disable-next-line no-useless-escape
          const reg = new RegExp('^' + event.target.value + 'w*', 'i');
          if ((this.DRUs[i].druName).match(reg)) {
            this.DRUResult.push(this.DRUs[i]);
            ctr++;
          }
        }
      }
    },
    async selectDRU(dru) {
      this.showDRUchoices = false;
      this.DRUselected = true;
      // code to retrieve numberz
      let rows = (await axios.get('http://localhost:8080/api/getDRUEvals', { params: {
        druName: dru.druName
      }})).data;
      console.log(rows);
    }
  },
}
</script>

<style>

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

.EvaluationBody {
  font-family: 'Work Sans', sans-serif;
  font-weight: 300;
  padding: 0px;
  margin: 0px;
  background-image: none;
}

.fWeight {font-weight: 800;}
.fSize32 {font-size: 32px;}

.width100 {width: 100%;}

.margin0 {margin: 0px;}
.margin10 {margin: 10px;}
.margin15 {margin: 15px;}
.marginLeft10 { margin-left: 10px;}
.padding5 {padding: 5px;}
.padding15 {padding: 15px;}

.borderRadius1 {border-radius: 10px;}

.alignCenter {align-items: center;}
.alignRight {align-items: flex-end;}
.justifyRight {justify-content: right;}

.colorBlue {color: #346083;}
.bgColorWhite {background-color: #f2f2f2;}
.colorGreen {color: #008d41}
.greenbg {
    background-color: #008d41;
    color: transparent;
    text-shadow: 1px 1px, -1px -1px rgb(0 0 0 / 25%);
    -webkit-background-clip: text;}

.flexRow {
    display: inline-flex;
    flex-direction: row;
}

.justifySpace {
  justify-content: space-between;
}

.evalView {
  padding: 80px 20px 5px 20px;
}

.evalViewComponent {
  height: fit-content;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.25));
  padding-bottom: 20px;
  margin: 25px 0;
}
@media only screen and (max-width: 800px) {
  .evalViewComponent {
    position: relative;
    top: 0px;
    min-height: fit-content;
  }
}

.EvalActionButton {
    list-style: none;
    margin: 0;
    padding: 0;
    margin-top: 5px;
}

.EvalActionButtons {
    display: inline-flex;
    flex-direction: row;
    cursor: pointer;
}

.EvalPrint {
  width: 30px;
  height: 30px;
  /* margin: 0 5px; */
  margin: -5px 5px 5px;
}

.EvalExport {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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

.EvalTableTitle {
    font-weight: 600;
    font-size: 22px;
}

/* tabs */

.allCasesHeader {
  font-weight: 800;
  font-size: 32px;
  color: #346083;
}

.allCases-viewcasesContainer {
  padding: 80px 20px 5px 20px;
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .allCases-viewcasesContainer {
    width: 100%;
    align-items: center;
    margin: 0px;
  }
}

.allCases-viewcasesComponent {
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
  min-height: calc(100vh - 220px);
}
@media only screen and (max-width: 800px) {
  .allCases-viewcasesComponent {
    position: relative;
    top: 0px;
    min-height: fit-content;
  }
}

.allCases-summaryContainer {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  overflow-y: hidden;
  z-index: 1;
  margin-left: 5px;
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

/* search */

.searchDRUword {
  font-weight: 500;
  white-space: nowrap;
  align-self: center;
  margin-right: 15px;
}

.searchbar {
  background: #ffffff;
  border: 1px solid #a3a3a3;
  box-sizing: border-box;
  border-radius: 40px;
  width: 100%;
  height: 40px;
  padding: 10px 20px 10px 40px;

  height: 45px;
  border: none;
  font-size: 16px;
  outline: none;
  margin-top: -1px;

  /* background-image: url(../assets/img/search.svg); */
  background-image: url(https://cdn1.iconfinder.com/data/icons/hawcons/32/698956-icon-111-search-512.png);
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: 15px 12.5px;
}

.bar {
  margin: 0 auto;
  width: 100%;
  height: 45px;
  border-radius: 40px;
  /* border: 1px solid #dcdcdc; */

  position: relative;
}
.bar:hover {
  box-shadow: 1px 1px 8px 1px #dcdcdc;
}
.bar:focus-within {
  box-shadow: 1px 1px 8px 1px #dcdcdc;
  outline: none;
}

.EvalContainer {
  /* background: white; */
  border-radius: 40px;
  width: 60%;
  margin: 0 auto;
  display: flex;
}

#input_img {
  position: absolute;
  bottom: 8px;
  left: 10px;
  width: 30px;
  height: 30px;
}

.searchDRUValues {
  background: white;
  height: fit-content;
  border-radius: 0 0 25px 25px;
  margin-top: -15px;
  padding: 10px;
  display: grid;
  width: 100%;
  position: absolute;
}

.searchResult {
  padding: 5px 10px;
  border-top: 1px solid lightgray;
  display: inline-flex;
  flex-direction: row;
  cursor: pointer;
}

.searchResult:hover {
  background: #eeeeee;
}

.searchResultInfo {
  display: inline-flex;
  flex-direction: column;
  width: 100%;
}

.searchPerson {
  font-size: 16px;
  margin-bottom: -5px;
  font-weight: 400;
}

.searchAddress {
  font-size: 12px;
  font-weight: 200;
}

.searchPersonIcon {
  content: url('~/assets/img/personIcon.png');
  height: 25px;
  width: 25px;
  margin: auto 5px auto 0;
}

</style>

