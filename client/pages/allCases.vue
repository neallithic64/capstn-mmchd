<template>
  <div id="viewCases">
    <!--Top Bar of the screen-->
    <TopNav />
    <div class="viewcases-container">
      <div class="viewcases-component">
        <div id="vue-root">
          <vuejs-simple-datatable
            :options="tableOptions"
            :datavalues="rowData"
          />
        </div>
      </div>
    </div>
  </div>
</template>

// <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.4.2/vue.js" defer></script> 
<script src="~/plugin/vuejs-datatable.js" defer></script>

<script>
export default {
  header: {
    title: 'Add Case',
  },
  compute: {},
  data() {
    return {
      tableOptions: {
        tableName: 'cases',
        columns: [
          {
            title: 'Case ID',
            key: 'caseID',
            type: 'clickable',
            source: 'cases',
            uniqueField: 'id',
            sortable: true,
          },
          {
            title: 'Disease',
            key: 'disease',
            type: 'text',
            source: 'cases',
          },
          {
            title: 'City',
            key: 'city',
            type: 'text',
            source: 'cases',
          },
          {
            title: 'Patient',
            key: 'patientNo',
            type: 'text',
            source: 'cases',
          },
          {
            title: 'Submitted on',
            key: 'submittedDate',
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
            key: 'status',
            type: 'text',
            source: 'cases',
            sortable: true,
          },
        ],
        // source: 'http://demo.datatable/api/users',
        search: true,
      },
      rowData: [
        {
          caseID: 1234,
          disease: 'Measles',
          city: 'Manila',
          patientNo: '123',
          submittedDate: '2020-10-10',
          updatedDate: '2020-10-10',
          status: 'IDK',
        },
        {
          caseID: 3456,
          disease: 'Dengue',
          city: 'PH',
          patientNo: '223',
          submittedDate: '2020-11-10',
          updatedDate: '2020-11-10',
          status: 'IDK',
        },
      ],
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
  methods: {},
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
  border-radius: 15px;
  padding: 15px;
  padding-bottom: 75px;
}
@media only screen and (max-width: 800px) {
  .viewcases-component {
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

