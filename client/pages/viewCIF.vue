<template>
  <div id="viewCIF">
    <!--Top Bar of the screen-->
    <TopNav />
    <div class="viewCIF-container">
      <div class="CIF-SummaryContainer">
        <ul
          v-for="(value, name, i) in disease.formNames"
          :key="i"
          :class="formListClass(i)"
          @click="move(i)"
        >
          {{
            i + 1
          }}.{{
            value
          }}
        </ul>
      </div>
      <div class="viewCIF-component"></div>
    </div>
  </div>
</template>

<script>
export default {
  header: {
    title: 'View CIF',
  },
  compute: {},
  data() {
    return {
      pageNum: 1,
      disease: {
        idname: 'Measles',
        name: 'Measles/Rubella',
        formNames: {
          form1: 'Patient Record',
          form2: 'Patient Information',
          form3: 'Clinical Data',
          form4: 'Vaccination History',
          form5: 'Exposure History',
          form6: 'Laboratory Tests',
          form7: 'Final Classification',
          form8: 'Source of Information',
          form9: 'Outcome',
        },
      },
      rowData: {
        caseID: 1234,
        disease: 'Measles',
        city: 'Manila',
        patientNo: '123',
        submittedDate: '2020-10-10',
        updatedDate: '2020-10-10',
        status: 'IDK',
      },
      diseases: {
        cif: {
          Measles: '/cifMeasles',
          Diphtheria: '/cifDiphtheria',
          'Neonatal Tetanus': '/cifNeonatalTetanus',
          Pertussis: '/cifPertussis',
          'Meningococcal Disease': '/cifMeningococcal',
        },
        crf: {
          Dengue: 'crfDengue',
        },
      },
    }
  },
  methods: {
    formListClass(index) {
      if (index === this.pageNum) return 'formSummaryItems selected'
      else return 'formSummaryItems'
    },
    move(i) {
      this.pageNum = i
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
}

h3 {
  font-size: 15px;
  font-weight: 600;
}

.viewCIF-container {
  padding: 80px 20px 5px 20px;
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .viewCIF-ontainer {
    width: 100%;
    align-items: center;
    margin: 0px;
  }
}

.viewCIF-section-container {
  /* left: 275px; */
  /* position: relative; */
  /* width: calc(100vw - 320px); */
  /* margin: 5px; */
  width: 100%;
  padding: 5px;
  margin: 10px;
}

@media only screen and (max-width: 800px) {
  .viewCIF-section-container {
    width: 95%;
  }
}

.CIF-SummaryContainer {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  overflow-y: hidden;
}

.formSummaryItems {
  background: white;
  border: 1px #f2f2f2 solid;
  border-radius: 15px 15px 0 0;
  margin: 0 -1px -1px 0;
  padding: 5px 7px;
  cursor: pointer;
}

.formSummaryItems:hover {
  background: #f2f2f2;
}

.formSummaryItems.selected {
  background: #f2f2f2;
  font-weight: 400;
  pointer-events: none;
}

.viewCIF-component {
  /* position: relative;
  display: inline-flex;
  flex-direction: row; */
  height: fit-content;
  width: 100%;

  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.25));
  background-color: #f2f2f2;
  border-radius: 0 15px 15px 15px;
  padding: 15px;
  padding-bottom: 75px;
}
@media only screen and (max-width: 800px) {
  .viewCIF-component {
    position: relative;
    top: 0px;
    min-height: fit-content;
  }
}

#datatabale {
  width: -webkit-fill-available;
}

/* h2 {
  text-align: center;
  font-weight: 600;
  font-size: 20px;
  background-color: #008d41;
  color: transparent;
  text-shadow: 1px 1px, -1px -1px rgba(0, 0, 0, 0.25);
  -webkit-background-clip: text;
  -moz-background-clip: text;
  background-clip: text;
} */
</style>

