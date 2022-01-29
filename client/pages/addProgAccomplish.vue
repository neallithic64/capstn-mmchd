<template>
  <div id="addCase">
    <!--Top Bar of the screen-->
    <TopNav />

    <!--Everything below = main screen-->
    <div class="cases-container">
      <div class="cases-section-container">
        <!--Name of form-->
        <div class="page-name">
          <h1 class="formHeader">Program Accomplishment</h1>
          <p style="margin: -5px 5px 10px; font-size: 16px">
            Select the disease of the program:
          </p>
        </div>

        <!--Form itself-->
        <div class="addcases-component">
          <div id="CIF" class="center formTypeDiv">
            <div
              v-for="(value, name, i) in diseases.cif"
              :key="i"
              style="width: 100%; align-content: center"
            >
              <!-- <a :href="'/progAccomplishDisease'+value" style="margin: auto"> -->
              <a :href="'/viewProgAccomplish' + value" style="margin: auto">
                <div class="cases-disease-name">{{ name }}</div>
              </a>
            </div>
          </div>

          <div id="CRF" class="center formTypeDiv">
            <div
              v-for="(value, name, i) in diseases.crf"
              :key="i"
              style="width: 100%; align-content: center"
            >
              <!-- <a :href="'/progAccomplishDisease' + value" style="margin: auto"> -->
              <a :href="'/viewProgAccomplishMalaria'" style="margin: auto">
                <div class="cases-disease-name">{{ name }}</div>
              </a>
            </div>
          </div>
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
      diseases: {
        cif: {
          Malaria: 'Malaria',
          Measles: 'Measles',
          Tetanus: 'Tetanus',
          Pertussis: 'Pertussis',
          Meningococcal: 'Meningococcal',
        },
        crf: {
          Dengue: 'Dengue',
          Cholera: 'Cholera',
          Leptospirosis: 'Leptospirosis',
          Chikungunya: 'Chikungunya',
          Typhoid: 'Typhoid',
        },
      },
    }
  },
  head() {
    return {
      title: 'Choose Disease'
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
  background-image: none;
}

h3 {
  font-size: 15px;
  font-weight: 600;
}

.formHeader {
  margin: -5px 0;
  font-weight: 800;
  font-size: 32px;
  color: #346083;
}

.cases-container {
  padding: 70px 20px 5px 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .cases-ontainer {
    width: 100%;
    flex-direction: column;
    align-items: center;
    margin: 0px;
  }
}

.cases-section-container {
  /* left: 275px; */
  position: relative;
  /* width: calc(100vw - 320px); */
  /* margin: 5px; */
  width: 100%;
  padding: 5px;
  margin: 10px;
}

@media only screen and (max-width: 800px) {
  .cases-section-container {
    left: 0px;
    width: 95%;
  }
}

.addcases-component {
  position: relative;
  display: inline-flex;
  flex-direction: row;
  height: max-content;
  width: 100%;
  top: -3px;

  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.25));
  background-color: #f2f2f2;
  border-radius: 15px;
  padding: 15px;
  z-index: 2;
  min-height: calc(100vh - 220px);
}
@media only screen and (max-width: 800px) {
  .addcases-component {
    flex-direction: column;
    position: relative;
    top: 0px;
    min-height: fit-content;
  }
}

.formTypeDiv {
  flex-direction: column;
  width: 50%;
  padding: 10px;
}

#CIF {
  border: none;
  border-right: #b8b7b7 0.5px solid;
}

#CRF {
  border: none;
  border-left: #b8b7b7 0.5px solid;
}

@media only screen and (max-width: 800px) {
  .formTypeDiv {
    width: 100%;
    padding: 30px;
  }

  #CIF {
    border: none;
    border-bottom: black 0.5px solid;
  }

  #CRF {
    border: none;
    border-top: black 0.5px solid;
  }
}

h3 {
  font-size: 15px;
  font-weight: 600;
}

.cases-disease-name {
  text-align: center;
  width: fit-content;
  max-width: 100%;
  font-size: 18px;
  margin: 15px auto 5px;
  padding: 5px;
  font-family: 'Work Sans', sans-serif;
  font-weight: 500;
  color: #346083;
  cursor: pointer;
}

.cases-disease-name:hover {
  border: #346083 solid 1px;
  transform: translateY(-5px);
  transition: 0.3s;
  font-weight: 800;
}

.cases-disease-name:active {
  border: #346083 solid 1px;
  background: #346083;
  color: #f2f2f2;
  transition: 0.3s;
  font-weight: 800;
}

hr {
  margin: 20px 0;
}
</style>

