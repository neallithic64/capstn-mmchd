<template>
  <div class="datatable">
    <div class="search">
      <input
        id="search"
        v-model="requestParams.search"
        type="text"
        style="float: right"
        placeholder="Search here"
        @keyup="search()"
      />
      Show
      <select
        id="rows"
        v-model="showDataAmount"
        class="form-control"
        @change="selectedDataAmount"
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="500">500</option>
      </select>
      rows
    </div>
    <table id="datatable">
      <thead>
        <th
          v-for="(column, columnIndex) in options.columns"
          :key="columnIndex"
          :style="{ 'text-align': column.textAlign }"
        >
          <span>{{ column.title }}</span>
          <span
            v-if="
              requestParams.sortedKey === column.key &&
              requestParams.sortedType === 'asc'
            "
            style="float: right"
          >
            <a
              href="javascript:"
              @click="sortedKeyValue(column.key, 'desc')"
            >
              <img src="~/assets/img/sortup.png" alt="up.png" /> </a
          ></span>
          <span
            v-else-if="
              requestParams.sortedKey === column.key &&
              requestParams.sortedType === 'desc'
            "
            style="float: right"
          >
            <a
              href="javascript:"
              @click="sortedKeyValue(column.key, 'asc')"
            >
              <img src="~/assets/img/sortdown.png" alt="down.png" /> </a
          ></span>
          <span v-else-if="column.sortable" style="float: right">
            <a
              href="javascript:"
              @click="sortedKeyValue(column.key, 'asc')"
            >
              <img src="~/assets/img/sort.png" alt="sort.png" />
            </a>
          </span>
        </th>
      </thead>
      <tbody>
        <template v-if="dataSets.length > 0">
          <tr
            v-for="(data, dataIndex) in dataSets"
            v-show="dataIndex >= showstart && dataIndex <= showend"
            :key="dataIndex"
          >
            <td
              v-for="(column, columnIndex) in options.columns"
              :key="columnIndex"
              style="text-align: center"
            >
              <span v-if="column.type === 'component'">
                <component :is="column.name" :row="data"></component>
              </span>
              <span v-else-if="column.type === 'clickable'">
                <a
                  style="color: #346083; text-decoration-line: underline"
                  href="/viewCIF"
                  >{{ data[column.key] }}</a
                >
                <!-- 
                    <a
                  style="text-decoration: none"
                  v-bind:href="column.source + '/' + data[column.key]"
                  >{{ data[column.key] }}</a
                >
                 -->
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
      <a
        href="javascript:"
        :class="{ isDisabled: currentPage == 1 }"
        @click="newPage(currentPage - 1)"
        >&laquo;</a
      >
      <a
        v-for="(page, pageIndex) in pages"
        v-show="pageIndex > 0"
        :key="pageIndex"
        href="javascript:"
        :class="[
          { active: currentPage === pageIndex },
          {
            isDisabled: currentPage === pageIndex || page === '...',
          },
        ]"
        @click="newPage(pageIndex)"
        >{{ pageIndex }}</a
      >
      <a
        :class="{ isDisabled: currentPage == totalPage }"
        href="javascript:"
        @click="newPage(currentPage + 1)"
        >&raquo;</a
      >
    </div>
  </div>
</template>

<script>
const axios = require('axios')
// import moment from 'moment'

export default {
  props: ['options', 'datavalues'],
  data() {
    return {
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
    // this.requestParams.sortedKey = this.options.columns[0].key
    this.dataSets = this.datavalues
    this.sortedKeyValue(
      this.requestParams.sortedKey,
      this.requestParams.sortedType
    )
    this.totalCount = Object.keys(this.dataSets).length
    this.getPages()
    this.getStartEnd()
    this.readData()
  },
  methods: {
    getStartEnd() {
      this.showstart = this.pages[this.currentPage][1]
      this.showend = this.pages[this.currentPage][2]
    },
    getPages() {
      this.pages = []
      this.totalPage = Math.floor(this.totalCount / this.showDataAmount) + 1
      let start = 0
      for (let i = 1; i <= this.totalPage; i++) {
        let end = start + this.showDataAmount - 1
        if (end === this.totalCount - 1) end = this.totalCount - 1
        this.pages[i] = [i, start, end]
        start = end + 1
      }
    },
    sortedKeyValue(key, type) {
      if (
        this.requestParams.sortedKey === key &&
        this.requestParams.sortedType === type
      );
      else {
        // this.requestParams.sortedType = !this.requestParams.sortedType
        this.requestParams.sortedKey = key
        this.requestParams.sortedType = type
      }

      if (typeof this.dataSets[0][key] === 'number') {
        if (type === 'asc') return this.dataSets.sort((a, b) => a[key] - b[key])
        else return this.dataSets.sort((a, b) => b[key] - a[key])
      } else {
        this.dataSets.sort(function (a, b) {
          if (type === 'asc') return ('' + a[key]).localeCompare(b[key])
          else return ('' + b[key]).localeCompare(a[key])
        })
      }
    },
    readData() {
      const instance = this
      axios
        .post(this.options.source, this.requestParams)
        .then(function (response) {
          instance.dataSets = response.data.data
          instance.totalCount = response.data.count
          instance.totalPage = Math.ceil(
            instance.totalCount / instance.requestParams.take
          )
          instance.pages = instance.pagination(
            instance.currentPage,
            instance.totalPage
          )
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    search() {
      this.currentPage = 1
      this.readData()
    },
    selectedDataAmount() {
      this.readData()
      this.currentPage = 1
      this.getPages()
      this.getStartEnd()
    },
    newPage(page) {
      if (page !== 0 && page <= this.totalPage) {
        this.requestParams.skip = (page - 1) * this.requestParams.take
        this.currentPage = page
        this.readData()
      }
      this.currentPage = page
      this.getStartEnd()
    },
    pagination(c, m) {
      const delta = 2
      const range = []
      const rangeWithDots = []
      let l

      range.push(1)
      for (let i = c - delta; i <= c + delta; i++) {
        if (i < m && i > 1) {
          range.push(i)
        }
      }
      range.push(m)

      for (const i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1)
          } else if (i - l !== 1) {
            rangeWithDots.push('...')
          }
        }
        rangeWithDots.push(i)
        l = i
      }

      return rangeWithDots
    },
  },
}
</script>
<style>
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
