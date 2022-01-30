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
        'A1': 'Summary',
        'A2': 'Prevalence',
        'A3': 'Fatality',
        'A4': 'Person',
        'A5': 'Time',
        'A6': 'Place',
        'A7': 'Risks',
        'A8': 'Accomplishments',
        'A9': 'Health Events'
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

.analytics-tabs-container {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  overflow-y: hidden;
  z-index: 1;
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