<template>
  <div class="datatable">
    <div v-if="pageType !== 'patient'" class="search">
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
    </div>
    <table id="datatable">
      <thead>
        <th v-for="(column, columnIndex) in options.columns" :key="columnIndex" :style="{ 'text-align': column.textAlign }">
          <span v-if="column.filter" style="float: left">
            <div v-if="column.key === 'disease'">
              <a class="filterButton">
                <img
                  src="~/assets/img/filter.png"
                  alt="filter.png"
                  style="width: 16px; height: 16px"
                  @click="diseaseOpen = !diseaseOpen"
                />
              </a>
              <div v-if="diseaseOpen" style="position: absolute">
                <div class="arrow-up"></div>
                <div class="filterDropdown">
                  <b>Select Disease:</b>
                  <div v-for="(value, i) in diseaseFilters.options" :key="i" style="padding-left: 7px">
                    <input
                      :id="value"
                      v-model="diseaseFilters.selected"
                      :value="value"
                      name="filter"
                      type="checkbox"
                      @change="filter()"
                    />
                    <label :for="value">{{ value }}</label>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="column.key === 'city'">
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
            </div>
            <div v-if="column.title==='Case Status'">
              <a class="filterButton">
                <img
                  src="~/assets/img/filter.png"
                  alt="filter.png"
                  style="width: 16px; height: 16px"
                  @click="caseStatusOpen = !caseStatusOpen"
                />
              </a>
              <div v-if="caseStatusOpen" style="position: absolute">
                <div class="arrow-up"></div>
                <div class="filterDropdown">
                  <b>Select Status:</b>
                  <div v-for="(value, i) in caseStatusFilters.options" :key="i" style="padding-left: 7px">
                    <input
                      :id="value"
                      v-model="caseStatusFilters.selected"
                      :value="value"
                      name="filter"
                      type="checkbox"
                      @change="filter()"
                    />
                    <label :for="value">{{ value }}</label>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="column.title==='Submit Status'">
              <a class="filterButton">
                <img
                  src="~/assets/img/filter.png"
                  alt="filter.png"
                  style="width: 16px; height: 16px"
                  @click="submitStatusOpen = !submitStatusOpen"
                />
              </a>
              <div v-if="submitStatusOpen" style="position: absolute">
                <div class="arrow-up"></div>
                <div class="filterDropdown">
                  <b>Select Status:</b>
                  <div v-for="(value, i) in submitStatusFilters.options" :key="i" style="padding-left: 7px">
                    <input
                      :id="value"
                      v-model="submitStatusFilters.selected"
                      :value="value"
                      name="filter"
                      type="checkbox"
                      @change="filter()"
                    />
                    <label :for="value">{{ value }}</label>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="column.title==='Report Status'">
              <a class="filterButton">
                <img
                  src="~/assets/img/filter.png"
                  alt="filter.png"
                  style="width: 16px; height: 16px"
                  @click="reportStatusOpen = !reportStatusOpen"
                />
              </a>
              <div v-if="reportStatusOpen" style="position: absolute">
                <div class="arrow-up"></div>
                <div class="filterDropdown">
                  <b>Select Status:</b>
                  <div v-for="(value, i) in reportStatusFilters.options" :key="i" style="padding-left: 7px">
                    <input
                      :id="value"
                      v-model="reportStatusFilters.selected"
                      :value="value"
                      name="filter"
                      type="checkbox"
                      @change="filter()"
                    />
                    <label :for="value">{{ value }}</label>
                  </div>
                </div>
              </div>
            </div>
          </span>
          <span>{{ column.title }}</span>
          <span v-if="requestParams.sortedKey === column.key && requestParams.sortedType === 'asc'" style="float: right">
            <a href="javascript:" @click="sortedKeyValue(column.key, 'desc')">
              <img src="~/assets/img/sortup.png" alt="up.png" />
            </a>
          </span>
          <span v-else-if="requestParams.sortedKey === column.key && requestParams.sortedType === 'desc'" style="float: right">
            <a href="javascript:" @click="sortedKeyValue(column.key, 'asc')">
              <img src="~/assets/img/sortdown.png" alt="down.png" />
            </a>
          </span>
          <span v-else-if="column.sortable" style="float: right">
            <a href="javascript:" @click="sortedKeyValue(column.key, 'asc')">
              <img src="~/assets/img/sort.png" alt="sort.png" />
            </a>
          </span>
        </th>
      </thead>
      <tbody>
        <template v-if="dataSets.length > 0">
          <tr v-for="(data, dataIndex) in dataSets" v-show="dataIndex >= showstart && dataIndex <= showend" :key="dataIndex">
            <td v-for="(column, columnIndex) in options.columns" :key="columnIndex" style="text-align: center">
              <span v-if="column.type === 'component'">
                <component :is="column.name" :row="data"></component>
              </span>
              <span v-else-if="column.key === 'action'">
                <div class="actionButtons">
                  <ul v-if="data[column.key]==='add submit' || data[column.key]==='add'" class="CRFActionButton">
                    <a :href="'/add' + 'CRF' + data['disease'] + 'Case'"> Add Case
                      <!-- <img src="~/assets/img/add.png" class="button"/> -->
                    </a>
                  </ul>
                  <ul v-if="data[column.key]==='add submit'">&nbsp;|&nbsp;</ul>
                  <ul v-if="data[column.key]==='add submit' || data[column.key]==='submit'" class="CRFActionButton">
                    <!-- <img src="~/assets/img/upload.png" class="button" @click="submit()"/> --> Submit
                  </ul>
                </div>
              </span>
              <span v-else-if="column.type === 'clickable'">
                <a v-if="data['disease'] === 'Measles/Rubella'"
                  style="color: #346083; text-decoration-line: underline"
                  :href="'/view' + 'CIFMeasles?caseID=' + data[column.key] ">
                  {{ data[column.key] }}
                </a>
                <a v-else-if="(pageType === 'patients')"
                  style="color: #346083; text-decoration-line: underline"
                  :href="'/patient'">
                  {{ data[column.key] }}
                </a>
                <a v-else-if="(pageType === 'all' || pageType === 'patient') && data['type'] === 'CIF'"
                  style="color: #346083; text-decoration-line: underline"
                  :href="'/view' + data['type'] + data['disease']">
                  {{ data[column.key] }}
                </a>
                <a v-else-if="((pageType === 'all' || pageType === 'patient') && data['type'] !== 'CIF') || pageType === 'crfCase'"
                  style="color: #346083; text-decoration-line: underline"
                  :href="'/view' + 'CRF' + data['disease'] + 'Case?caseID=' + data[column.key]">
                  {{ data[column.key] }}
                </a>
                <a v-else-if="pageType === 'cif'"
                  style="color: #346083; text-decoration-line: underline"
                  :href="'/view' + 'CIFMeasles?caseID=' + data[column.key] ">
                  {{ data[column.key] }}
                </a>
                <a v-else-if="pageType === 'crfDRU' || pageType === 'crfCHD'"
                  style="color: #346083; text-decoration-line: underline"
                  :href="'/view' + 'CRF' + data['disease']">
                  {{ data[column.key] }}
                </a>
                <a v-else-if="pageType === 'addcrfID'"
                  style="color: #346083; text-decoration-line: underline"
                  :href="'/add' + 'CRF' + data['disease'] + 'Case'">
                  {{ data[column.key] }}
                </a>
                <a v-else-if="pageType === 'viewcrfID'"
                  style="color: #346083; text-decoration-line: underline"
                  :href="'/view' + 'CRF' + data['disease'] + 'Case?caseID=' + data[column.key] ">
                  {{ data[column.key] }}
                </a>
                <!-- <a
                  style="text-decoration: none"
                  v-bind:href="column.source + '/' + data[column.key]"
                  >{{ data[column.key] }}
                </a> -->
              </span>
              <span v-else-if="column.title==='Case Status'" :class="caseStatusClass(data[column.key])">
                {{ data[column.key] }}
              </span>
              <span v-else>
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

    <div v-if="totalCount > requestParams.take" class="pagination">
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
    </div>
  </div>
</template>

<script>
// import moment from 'moment'
// const axios = require('axios');

export default {
  props: ['options', 'datavalues', 'casetype'],
  data() {
    return {
      pageType: '',
      diseaseOpen: false,
      cityOpen: false,
      caseStatusOpen: false,
      submitStatusOpen: false,
      reportStatusOpen: false,
      diseaseFilters: {
        options: ['Measles/Rubella','Malaria','Pertussis','Dengue','Leptospirosis','Acute Viral Hepatitis',
        ],
        selected: [],
      },
      cityFilters: {
        options: ['Caloocan City',
        'Las Piñas City',
        'Makati City',
        'Malabon City',
        'Mandaluyong City',
        'Manila City',
        'Marikina City',
        'Muntinlupa City',
        'Navotas City',
        'Parañaque City',
        'Pasay City',
        'Pasig City',
        'Quezon City',
        'San Juan City',
        'Taguig City',
        'Valenzuela City',],
        selected: [],
      },
      caseStatusFilters: {
        options: ['Suspected', 'Probable', 'Confirmed'],
        selected: [],
      },
      submitStatusFilters: {
        options: ['Ongoing', 'Pushed', 'Submitted'],
        selected: [],
      },
      reportStatusFilters: {
        options: ['None', 'Zero Report', 'Case Submitted'],
        selected: [],
      },
      dataFiltered: [],
      dataSearched: [],
      dataSets: [],
      requestParams: {
        take: 10,
        skip: 0,
        search: '',
        sortedKey: 'caseID',
        sortedType: 'asc',
      },
      currentPage: 1,
      pages: [],
      showDataAmount: 10,
      totalPage: 1,
      totalCount: 0,
      showstart: 0,
      showend: 1,
    }
  },
  watch: {},
  mounted() {
    this.pageType = this.casetype;
    // this.requestParams.sortedKey = this.options.columns[0].key;
    this.filterOff();
    this.dataFiltered = this.datavalues;
    this.dataSearched = this.datavalues;
    this.dataSets = this.datavalues;
	console.log(this.datavalues);
    this.sortedKeyValue(this.requestParams.sortedKey, this.requestParams.sortedType);
    this.totalCount = Object.keys(this.dataSets).length;
    this.getPages();
    this.getStartEnd();
    // this.readData();
  },
  methods: {
    caseStatusClass(c) {
      if (c) {
        if (c.toString().includes('Suspected')) return 'caseStatus suspectedCase';
        else if (c.toString().includes('Probable')) return 'caseStatus probableCase';
        else if (c.toString().includes('Confirmed')) return 'caseStatus confirmedCase';
        return 'none';
      }
    },
    getStartEnd() {
      this.showstart = this.pages[this.currentPage][1];
      this.showend = this.pages[this.currentPage][2];
    },
    getPages() {
      this.pages = [];
      this.totalPage = Math.floor(this.totalCount / this.showDataAmount) + 1;
      let start = 0;
      for (let i = 1; i <= this.totalPage; i++) {
        let end = start + this.showDataAmount - 1;
        if (end === this.totalCount - 1) end = this.totalCount - 1;
        this.pages[i] = [i, start, end];
        start = end + 1;
      }
    },
    sortedKeyValue(key, type) {
      if (this.requestParams.sortedKey === key && this.requestParams.sortedType === type);
      else {
        // this.requestParams.sortedType = !this.requestParams.sortedType;
        this.requestParams.sortedKey = key;
        this.requestParams.sortedType = type;
      }

      if (this.dataSets.length && typeof this.dataSets[0][key] === 'number') {
        if (type === 'asc') return this.dataSets.sort((a, b) => a[key] - b[key]);
        else return this.dataSets.sort((a, b) => b[key] - a[key]);
      } else {
        this.dataSets.sort(function (a, b) {
          if (type === 'asc') return ('' + a[key]).localeCompare(b[key]);
          else return ('' + b[key]).localeCompare(a[key]);
        })
      }
    },
    readData() {
	  // this.dataSets = response.data.data;
	  // this.totalCount = response.data.count;
	  // this.totalPage = Math.ceil(instance.totalCount / instance.requestParams.take);
	  // this.pages = instance.pagination(instance.currentPage, instance.totalPage);
      // axios.post(this.options.source, this.requestParams).then(function (response) {}).catch(function (err) {console.log(err);});
    },
    search() {
      // this.readData();
      this.dataSearched = [];
      // IF NO FILTERS
      for (let i = 0; i < Object.keys(this.datavalues).length; i++)
        for (let j = 0; j < this.options.columns.length; j++) {
          const key = this.options.columns[j].key;
          let value = this.datavalues[i][key];
          if (typeof value !== 'undefined') {
            value = value.toString();
            if (value.includes(this.requestParams.search)) {
              this.dataSearched.push(this.datavalues[i]);
              break;
            }
          }
        }
      this.getDataSet();
    },
    filter() {
      // this.readData();
      this.dataFiltered = [];

      if (this.diseaseFilters.selected.length === 0 && this.cityFilters.selected.length === 0 && this.caseStatusFilters.selected.length === 0
        && this.submitStatusFilters.selected.length === 0 && this.reportStatusFilters.selected.length === 0)
        this.dataFiltered = this.datavalues;

      else if (this.pageType === 'crfCase' || this.pageType === 'addcrfID') {
        for (let i = 0; i < Object.keys(this.datavalues).length; i++)
          if ((this.cityFilters.selected.length === 0 || this.cityFilters.selected.includes(this.datavalues[i].city)) &&
            (this.caseStatusFilters.selected.length === 0 || this.caseStatusFilters.selected.includes(this.datavalues[i].status))) {
            this.dataFiltered.push(this.datavalues[i]);
          }
      }
      
      else if (this.pageType === 'crfDRU') {
        for (let i = 0; i < Object.keys(this.datavalues).length; i++)
          if ((this.diseaseFilters.selected.length === 0 || this.diseaseFilters.selected.includes(this.datavalues[i].disease)) &&
            (this.submitStatusFilters.selected.length === 0 || this.submitStatusFilters.selected.includes(this.datavalues[i].submitStatus)) &&
            (this.reportStatusFilters.selected.length === 0 || this.reportStatusFilters.selected.includes(this.datavalues[i].reportStatus))) {
            this.dataFiltered.push(this.datavalues[i]);
          }
      }

      else if (this.pageType === 'crfCHD') {
        for (let i = 0; i < Object.keys(this.datavalues).length; i++)
          if ((this.diseaseFilters.selected.length === 0 || this.diseaseFilters.selected.includes(this.datavalues[i].disease)) &&
            (this.cityFilters.selected.length === 0 || this.cityFilters.selected.includes(this.datavalues[i].city)) &&
            (this.submitStatusFilters.selected.length === 0 || this.submitStatusFilters.selected.includes(this.datavalues[i].submitStatus)) &&
            (this.reportStatusFilters.selected.length === 0 || this.reportStatusFilters.selected.includes(this.datavalues[i].reportStatus))) {
            this.dataFiltered.push(this.datavalues[i]);
          }
      }

      else 
        for (let i = 0; i < Object.keys(this.datavalues).length; i++)
          if ((this.diseaseFilters.selected.length === 0 || this.diseaseFilters.selected.includes(this.datavalues[i].disease)) &&
            (this.cityFilters.selected.length === 0 || this.cityFilters.selected.includes(this.datavalues[i].city)) &&
            (this.caseStatusFilters.selected.length === 0 || this.caseStatusFilters.selected.includes(this.datavalues[i].caseLevel))) {
            this.dataFiltered.push(this.datavalues[i]);
          }

      this.getDataSet();
    },
    getDataSet() {
      this.dataSets = [];

      if (Object.keys(this.datavalues).length === Object.keys(this.dataSearched).length && 
          Object.keys(this.datavalues).length === Object.keys(this.dataFiltered).length)
          this.dataSets = this.datavalues;

      else if (Object.keys(this.datavalues).length === Object.keys(this.dataFiltered).length)
          this.dataSets = this.dataSearched;

      else if (Object.keys(this.datavalues).length === Object.keys(this.dataSearched).length)
          this.dataSets = this.dataFiltered;
      
      else if (this.pageType.includes('crf')) {
        for (let i=0; i< Object.keys(this.dataFiltered).length; i++)
          for (let j=0; j< Object.keys(this.dataSearched).length; j++)
            if (this.dataFiltered[i].crfNo === this.dataSearched[j].crfNo)
              this.dataSets.push(this.dataFiltered[i]);
      }

      else {
        for (let i=0; i< Object.keys(this.dataFiltered).length; i++)
          for (let j=0; j< Object.keys(this.dataSearched).length; j++)
            if (this.dataFiltered[i].caseID === this.dataSearched[j].caseID)
              this.dataSets.push(this.dataFiltered[i]);
      }

      // else this.dataSets = this.dataFiltered.concat(this.dataSearched)

      this.currentPage = 1;
      this.totalCount = Object.keys(this.dataSets).length;
      console.log('DATA:' + this.dataSets)
    },
    filterOff() {
      this.filters = [];
      for (let i = 0; i < this.options.columns.length; i++)
        // if (this.options.columns[i].filter)
        //   this.filters.push({
        //     filterKey: this.options.columns[i].key,
        //     filterOpen: false,
        //     filterOptions: ['ABC', 'ABCD'],
        //     filterSelected: [],
        //   })
        if (this.options.columns[i].filter) this.filters[0] = false;
      // console.log(this.filters)
      // for (let j = 0; j < this.filters.length; j++) {
      //   this.filters[j].filterOptions = ['Measles', 'Dengue']
      // if (this.filterKey[j].key === 'disease') {
      //   this.filterKey[j].filterOptions = ['Measles', 'Dengue']
      // } else if (this.filterKey[j].key === 'city') {
      //   this.filterKey[j].filterOptions = ['Manila', 'Makati']
      // }
      // }
    },
    selectedDataAmount() {
      this.readData();
      this.currentPage = 1;
      this.getPages();
      this.getStartEnd();
    },
    newPage(page) {
      if (page !== 0 && page <= this.totalPage) {
        this.requestParams.skip = (page - 1) * this.requestParams.take;
        this.currentPage = page;
        this.readData();
      }
      this.currentPage = page;
      this.getStartEnd();
    },
    pagination(c, m) {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];
      let l;

      range.push(1);
      for (let i = c - delta; i <= c + delta; i++) {
        if (i < m && i > 1) {
          range.push(i);
        }
      }
      range.push(m);

      for (const i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push('...');
          }
        }
        rangeWithDots.push(i);
        l = i;
      }

      return rangeWithDots;
    },
    submit () {
      // TO DO: Submit CRF
    }
  },
}
</script>
<style>
.actionButtons {
  vertical-align:middle;
  text-align: center;
  display: inline-flex;
  flex-direction: row;
}

.CRFActionButton {
  cursor: pointer;
}

.CRFActionButton:hover {
  color:#346083;
  font-weight: 600;
}

.button {
  width: 15px;
  height: 15px;
  /* margin: 0 5px; */
  margin: -5px 5px 5px;
  cursor: pointer;
}

.caseStatus {
  color:white;
  padding:2px 10px;
  border-radius: 10px;
  font-weight: 500;
}
.confirmedCase {
  background: red;
}
.suspectedCase {
  background: #FC8F00;
}
.probableCase {
  background: #FDCE00;
}

.filterButton {
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

.filterDropdown {
  background: white;
  position: absolute;
  display: block;
  border: white solid 0.5px;
  padding: 12px;
  padding-right:15px;
  /* margin-top: 5px; */
  /* width: 150px; */
  text-align: left;
  font-weight: 400;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.25));
}

input[type='checkbox'] {
  filter: hue-rotate(240deg);
}

.arrow-up {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid white;
  margin-left: 3px;
}

table {
  /* display: block; */
  display: table;
  overflow-x: auto;
  white-space: nowrap;
}

@media only screen and (max-width: 950px) {
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
</style>
