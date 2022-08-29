<template>
  <div id="view-analytics">
    <TopNav/>
    <div id="analytics-main-container">
      <div style="display: flex; flex-direction: row; justify-content: space-between;">
        <h2 id="page-title"> Reports and Analytics </h2>
        <a href="/addReport"> <button class="make-report-button"> + New Report </button> </a>
      </div>

      <!-- Tabs -->
      <div v-show="!isPrint" class="analytics-tabs-container">
        <ul
          v-for="(value, name, i) in analyticsList"
          :key="i"
          :class="formListClass(i)"
          @click="move(i)">
          {{ value }}
        </ul>
      </div>

      <!-- Reports -->
      <div class="analytics-report-container">
        <!-- Prevalence -->
        <div v-if="pageNum == 0">
          <iframe id="analytics-powerbi-iframe" src="https://app.powerbi.com/view?r=eyJrIjoiNmFjODgxOWQtYTIxNy00ZmEyLThjZWYtM2NmZmU4ODFlNjY2IiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D&pageName=ReportSectionb372a2e5e820c31d344e">
          </iframe>
        </div>

        <!-- Fatality -->
        <div v-if="pageNum == 1">
          <iframe id="analytics-powerbi-iframe" src="https://app.powerbi.com/view?r=eyJrIjoiMWQwZTgyNTUtY2VmYi00M2E0LWFkNjYtMmY2ZWRhOGIwZDA0IiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D&pageName=ReportSectionf93cf5abbb7bc1ca4347">
          </iframe>
        </div>

        <!-- Person -->
        <div v-if="pageNum == 2">
          <iframe id="analytics-powerbi-iframe" src="https://app.powerbi.com/view?r=eyJrIjoiYzQ0NDBkYzAtNGE2Yi00MDMzLTgyM2MtNmYyNDNiNTExMjEwIiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D">
          </iframe>
        </div>

        <!-- Time -->
        <div v-if="pageNum == 3">
          <iframe id="analytics-powerbi-iframe" src="https://app.powerbi.com/view?r=eyJrIjoiNDZjMWZkYTktZmZkMC00YWVlLTliYWQtNDcwZDY0NGMzMjNjIiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D">
          </iframe>
        </div>

        <!-- Place -->
        <div v-if="pageNum == 4">
          <iframe id="analytics-powerbi-iframe" src="https://app.powerbi.com/view?r=eyJrIjoiNDE2OTkxMDUtNzM4MC00OTc2LTk1MTEtZTk3MjU5MTA2NzE2IiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D">
          </iframe>
        </div>

        <!-- Risks -->
        <div v-if="pageNum == 5">
          <iframe id="analytics-powerbi-iframe" src="https://app.powerbi.com/view?r=eyJrIjoiNjVkMmE1ZGItYTZlZC00OWY4LThjNDItYjZjYmViZmNmZGNjIiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D&pageName=ReportSectionc71739df181472ac0d6b">
          </iframe>
        </div>

        <!-- Accomplishments -->
        <div v-if="pageNum == 6">
          <iframe id="analytics-powerbi-iframe" src="https://app.powerbi.com/view?r=eyJrIjoiMWEwNmU3NTMtOTEwMi00MTE5LWFmOTYtODg5MjY3YTk1MTk1IiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D">
          </iframe>
        </div>

        <!-- Health Events -->
        <div v-if="pageNum == 7">
          <iframe id="analytics-powerbi-iframe" src="https://app.powerbi.com/view?r=eyJrIjoiZjJjZDVhZDAtYjljZi00NzQzLWI4ZGMtN2Q0OTRhYWUxMGU3IiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D">
          </iframe>
        </div>

        <!-- Comparative -->
        <div v-if="pageNum == 8">
          <iframe id="analytics-powerbi-iframe" src="https://app.powerbi.com/view?r=eyJrIjoiYjc3M2Q3NDQtM2VkNC00YmU1LThjNDAtZWRhN2U3NDg2YzNmIiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D&pageName=ReportSection69394e97e405328dc90e">
          </iframe>
        </div>

        <!-- Correlation -->
        <div v-if="pageNum == 9">
          <iframe id="analytics-powerbi-iframe" src="https://app.powerbi.com/view?r=eyJrIjoiY2ZiOTE3YTktYmY1YS00ODI2LTkzMDgtZjFjNmVjOTk1NWEwIiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D&pageName=ReportSectionbcc16fefb0fb46804a3b">
          </iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'is-auth',
  data() {
    return {
      isPrint: false, 
      pageNum: 0,
      analyticsList: {
        'A1': 'Prevalence',
        'A2': 'Fatality',
        'A3': 'Person',
        'A4': 'Time',
        'A5': 'Place',
        'A6': 'Risks',
        'A7': 'Accomplishments',
        'A8': 'Health Events',
        'A9': 'Comparative',
        'A10': 'Correlation'
      } 
    }
  },
  head() {
    return {
      title: 'Analytics'
    }
  },
  methods: {
    formListClass(index) {
      if (index === this.pageNum) return 'tabs-items selected'
      else return 'tabs-items'
    },
    move(i) {
      this.pageNum = i
    },
  }
}
</script>

<style>
body {
  background-image: none;
  background-color: white;
  font-family: 'Work Sans', sans-serif;
}

#page-title {
  font-weight: 800;
  font-size: 32px;
  color: #346083;
  margin-bottom: 10px;
}

#analytics-main-container {
  margin: 70px 10px 10px 10px;
  padding: 5px 10px 0px 10px;
  height: 100vh;
}

#analytics-powerbi-iframe {
  height: 87vh;
  background-color: gray;
  width: 70%;
  border-radius: 10px;
  margin: auto;
}

.analytics-tabs-container {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  overflow-y: hidden;
  z-index: 1;
  font-family: 'Work Sans', sans-serif;
}

.tabs-items {
  background: white;
  border: 1px #f2f2f2 solid;
  border-radius: 10px 10px 0 0;
  margin: 0 -1px -1px 0;
  padding: 5px 7px;
  cursor: pointer;
}

.tabs-items:hover {
  background: #f2f2f2;
}

.tabs-items.selected {
  background: #f2f2f2;
  font-weight: 400;
  pointer-events: none;
}

.analytics-report-container {
  height: fit-content;
  width: 100%;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.25));
  background-color: #f2f2f2;
  border-radius: 0 10px 10px 10px;
  padding: 15px;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.make-report-button {
  width: 150px;
  height: 30px;
  font-size: 16px;
  font-family: 'Work Sans', sans-serif;
  font-weight: 600;
  background-color: #008d41;
  color: white;
  margin-top: 10px;
}

.make-report-button:hover {
  background-color: #346083;
}

</style>