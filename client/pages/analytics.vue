<template>
  <div id="view-analytics">
    <TopNav/>
    <div id="analytics-main-container">
      <h2 id="page-title"> Reports and Analytics </h2>

      <div v-show="!isPrint" class="analytics-summary-container">
        <ul
          v-for="(value, name, i) in analyticsList"
          :key="i"
          :class="formListClass(i)"
          @click="move(i)">
          {{ value }}
        </ul>
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
        'A2': 'Time',
        'A3': 'Place',
        'A4': 'Person',
        'A5': 'Morbidity',
        'A6': 'Mortality',
        'A7': 'Risks',
      } 
    }
  },
  methods: {
    formListClass(index) {
      if (index === this.pageNum) return 'summary-items selected'
      else return 'summary-items'
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
  padding: 5px 0px 0px 10px;
  height: 100vh;
}

.analytics-summary-container {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  overflow-y: hidden;
  z-index: 1;
}

.summary-items {
  background: white;
  border: 1px #f2f2f2 solid;
  border-radius: 10px 10px 0 0;
  margin: 0 -1px -1px 0;
  padding: 5px 7px;
  cursor: pointer;
}

.summary-items:hover {
  background: #f2f2f2;
}

.summary-items.selected {
  background: #f2f2f2;
  font-weight: 400;
  pointer-events: none;
}

</style>