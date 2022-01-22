<template>
  <div id="viewCases">
    <!--Top Bar of the screen-->
    <!-- <TopNav /> -->
    <div ref="content" class="viewcases-container">
      <div class="exportButtons">
        <h1 class="pageHeader"> Immunization Program </h1>
        <div v-show="!isPrint" class="actionButtons" style="display: flex;margin-top: 5px;">
          <ul v-show="year==='2022' || year===2022" class="actionButton">
          <img
            src="~/assets/img/pen.png"
            class="printButton"
            @click="isEdit=true"
          />
          </ul>
          <ul class="actionButton">
          <img
            src="~/assets/img/pdf.png"
            class="printButton"
            @click="downloadPDF"
          />
          </ul>
          <ul class="actionButton">
            <img src="~/assets/img/csv.png" 
            class="printButton"
            @click="csvExport(dataSets)"
          />
          </ul>
        </div>
      </div>
      <div class="viewcases-component">
      <div class="datatable">
        <!-- <div class="search">
          Show
          <select id="rows" v-model="showDataAmount" class="form-control" @change="selectedDataAmount">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="500">500</option>
          </select>
          rows
          <input
            id="search"
            v-model="requestParams.search"
            type="text"
            style="float: right"
            placeholder="Search here"
            @keyup="search()"
          />
        </div> -->
        <table id="datatable">
          <thead>
            <th v-for="(column, columnIndex) in columns" :key="columnIndex" :style="{ 'text-align': column.textAlign }">
              <span v-if="column.filter" style="float: left">
                <!-- <div v-if="column.key === 'city'">
                  <a class="filterButton">
                    <img
                      src="~/assets/img/filter.png"
                      alt="filter.png"
                      style="width: 16px; height: 16px"
                      @click="cityOpen = !cityOpen"
                    />
                  </a>
                  <div v-if="cityOpen" style="position: absolute">
                    <div class="arrow-up"></div>
                    <div class="filterDropdown">
                      <b>Select City:</b>
                      <div v-for="(value, i) in cityFilters.options" :key="i" style="padding-left: 7px">
                        <input
                          :id="value"
                          v-model="cityFilters.selected"
                          :value="value"
                          name="filter"
                          type="checkbox"
                          @change="filter()"
                        />
                        <label :for="value">{{ value }}</label>
                      </div>
                    </div>
                  </div>
                </div> -->
              </span>
              <span>{{ column.title }}</span>
            </th>
          </thead>
          <tbody>
            <template v-if="dataSets.length > 0">
              <tr v-for="(data, dataIndex) in dataSets" :key="dataIndex">
              <!-- <tr v-for="(data, dataIndex) in dataSets" v-show="dataIndex >= showstart && dataIndex <= showend" :key="dataIndex"> -->
                <td v-for="(column, columnIndex) in columns" :key="columnIndex" style="text-align: center">
                  <span v-if="column.key==='button'">
                    pen icon
                  </span>
                  <span>
                    {{ data[column.key] }}
                  </span>
                </td>
              </tr>
            </template>
            <template v-else>
              <div style="text-align: center">No data found.</div>
            </template>
          </tbody>
        </table>

        <!-- <div v-if="totalCount > requestParams.take" class="pagination">
          <a href="javascript:"
            :class="{ isDisabled: currentPage == 1 }"
            @click="newPage(currentPage - 1)">
            &laquo;
          </a>
          <a v-for="(page, pageIndex) in pages"
            v-show="pageIndex > 0"
            :key="pageIndex"
            href="javascript:"
            :class="[{ active: currentPage === pageIndex }, { isDisabled: currentPage === pageIndex || page === '...', },]"
            @click="newPage(pageIndex)">
            {{ pageIndex }}
          </a>
          <a :class="{ isDisabled: currentPage == totalPage }"
            href="javascript:"
            @click="newPage(currentPage + 1)">
            &raquo;
          </a>
        </div> -->
        <div style="margin-top:5px;">
          Last updated: <b> {{dayTime}} </b>
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
const axios = require('axios');

export default {
  // middleware: 'is-auth',
  header: {
    title: 'Immunization Program',
  },
  compute: {},
  data() {
    return {
      isPrint: false,
      dayTime: '',
      columns: [
        {
          title: 'TCL No.',
          key: 'TCLNo',
        },
        {
          title: 'Patient',
          key: 'patient',
        },
        {
          title: 'City',
          key: 'city',
        },
        {
          title: 'Date Added',
          key: 'dateAdded',
        },
        {
          title: 'Status',
          key: 'status',
        },
        {
          title: '',
          key: 'button',
        },
      ],
      dataSets: [
        {
          TCLNo: '124',
          patient: 'ad',
          dateAdded: '',
          status: 'done',
        },
        {
          TCLNo: '123',
          patient: 'swlnjw',
          dateAdded: '',
          status: 'ongoing',
        },
        {
          TCLNo: '12',
          patient: 'ad',
          dateAdded: '',
          status: '',
        },
      ],
    }
  },
  mounted() {
    const today = new Date();
    const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Aug', 'Oct', 'Nov', 'Dec'];
    const hour = today.getHours()>9 ? today.getHours() : '0'+today.getHours()
    const mins = today.getMinutes()>9 ? today.getMinutes() : '0'+today.getMinutes()
    this.dayTime = monthsList[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear()
                     + ' ' + hour + ':' + mins;
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
      link.setAttribute("download", this.caseTab.toUpperCase()+".csv");
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

.viewcases-container {
  padding: 80px 20px 5px 20px;
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .viewcases-ontainer {
    width: 100%;
    align-items: center;
    margin: 0px;
  }
}

.viewcases-section-container {
  /* left: 275px; */
  /* position: relative; */
  /* width: calc(100vw - 320px); */
  /* margin: 5px; */
  width: 100%;
  padding: 5px;
  margin: 10px;
}

@media only screen and (max-width: 800px) {
  .viewcases-section-container {
    width: 95%;
  }
}

.viewcases-component {
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
  .viewcases-component {
    position: relative;
    top: 0px;
    min-height: fit-content;
  }
}

#form-header {
    text-align: left;
    padding-left: 5px;
    margin-bottom: 5px;
    font-weight: 600;
    font-size: 20px;
    background-color: #008d41;
    color: transparent;
    text-shadow: 1px 1px, -1px -1px rgb(0 0 0 / 25%);
    -webkit-background-clip: text;
}


table {
  /* display: block; */
  display: table;
  overflow-x: auto;
  white-space: nowrap;
}

.allDisplay {
  display: block;
}

@media only screen and (max-width: 1000px) {
  table {
    display: block;
  }
}

.datatable input[type='text'] {
  padding: 8px 12px;
  margin: 8px 0;
  border: 1px solid #f1f1f1;
  box-sizing: border-box;
}

.datatable select {
  padding: 5px 12px;
  margin: 8px 0;
  box-sizing: border-box;
  outline: none !important;
  border: 1px solid #dddddd;
  background: #fff;
  width: auto;
}

.datatable input:focus {
  border: 1px solid #dddddd !important;
  outline: none;
}

.datatable select:focus {
  outline: none !important;
  border: 1px solid #dddddd;
  background: #fff;
}

#datatable {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

#datatable td,
#datatable th {
  border: 1px solid #ddd;
  padding: 8px;
}

#datatable tr:hover {
  background-color: #ddd;
  border: 1px solid #f1f1f1;
}

#datatable th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: center;
  background: lightgray;
}

.datatable .pagination {
  display: inline-block;
  margin-top: 12px;
  /* float:right; */
}

.datatable .pagination a {
  color: black;
  float: left;
  padding: 8px 16px;
  text-decoration: none;
  transition: background-color 0.3s;
  border: 1px solid #ddd;
}

.datatable .pagination a.active {
  background-color: #346083;
  color: white;
  font-weight: 600;
  opacity: 1;
}

.datatable .pagination a:hover:not(.active) {
  background-color: #ddd;
}

.datatable .isDisabled {
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: none;
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

.actionButton {
    list-style: none;
    margin: 0;
    padding: 0;
    margin-top: 5px;
}

.input-edit {
  text-align: center;
  background: none;
  max-width: 75px;
}

.editable {
  background: white;
}

</style>

