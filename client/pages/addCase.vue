<template>
  <div id="addCase" class="addCaseBody">
    <!--Top Bar of the screen-->
    <TopNav />

    <!--Everything below = main screen-->
    <div class="addCase-casesContainer">
      <div class="addCase-caseSectionContainer">
        <!--Name of form-->
        <div class="page-name">
          <h1 class="addCaseFormHeader">Add a Case</h1>
          <p style="margin: -5px 5px 10px; font-size: 16px">
            Select the disease of the reported case:
          </p>
        </div>

        <!--Form itself-->
        <div class="addcases-component">
          <div id="addCaseCIF" class="center addCaseFormDiv">
            <!-- CASE DEFINITION -->
            <h2 class="addCase-formTypeH">Category I</h2>

            <div
              v-for="(value, name, i) in diseases.cif"
              :key="i"
              style="width: 100%; align-content: center"
            >
              <!-- <div v-if="i > 1" :id="name" :class="formColor(i - 1)"> -->
              <a :href="'/addCIF'+value" style="margin: auto">
              <!-- <a :href="'/addCIFMeasles'" style="margin: auto"> -->
                <div class="addCases-disease-name">{{ name }}</div>
              </a>
            </div>

            <!-- <a href="/"><div class="disease-name">Measles</div></a>
            <div class="disease-name">Measles</div>
            <a href="https://twitter.com/Dave_Conner" class="btn btn-1">
              <svg>
                <rect x="0" y="0" fill="none" width="100%" height="100%" />
              </svg>
              Measles
            </a> -->
          </div>

          <div id="addCaseCRF" class="center addCaseFormDiv">
            <!-- CASE DEFINITION -->
            <h2 class="addCase-formTypeH">Category II</h2>

            <div
              v-for="(value, name, i) in diseases.crf"
              :key="i"
              style="width: 100%; align-content: center"
            >
              <!-- <div v-if="i > 1" :id="name" :class="formColor(i - 1)"> -->
              <a :href="'/addCRF'+value" style="margin: auto">
              <!-- <a :href="'/addCRFDengue'" style="margin: auto"> -->
                <div class="addCases-disease-name">{{ name }}</div>
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
          Measles: 'Measles',
          Rabies: 'Rabies',
          Pertussis: 'Pertussis',
          // Tetanus: 'Tetanus',
          // Meningococcal: 'Meningococcal',
        },
        crf: {
          Dengue: 'Dengue',
          Cholera: 'Cholera',
          Leptospirosis: 'Leptospirosis',
          // Chikungunya: 'Chikungunya',
          // Typhoid: 'Typhoid',
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
.addCaseBody {
  font-family: 'Work Sans', sans-serif;
  font-weight: 300;
  padding: 0px;
  margin: 0px;
  background-image: none;
}

.addCaseFormHeader {
  margin: -5px 0;
  font-weight: 800;
  font-size: 32px;
  color: #346083;
}

.addCase-casesContainer {
  padding: 70px 20px 5px 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .addCase-casesContainer {
    width: 100%;
    flex-direction: column;
    align-items: center;
    margin: 0px;
  }
}

.addCase-caseSectionContainer {
  /* left: 275px; */
  position: relative;
  /* width: calc(100vw - 320px); */
  /* margin: 5px; */
  width: 100%;
  padding: 5px;
  margin: 10px;
}

@media only screen and (max-width: 800px) {
  .addCase-caseSectionContainer {
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

.addCaseFormDiv {
  flex-direction: column;
  width: 50%;
  padding: 10px;
}

.addCase-formTypeH {
  text-align: center;
  font-weight: 600;
  font-size: 28px;
  background-color: #008d41;
  color: transparent;
  text-shadow: 1px 1px, -1px -1px rgba(0, 0, 0, 0.25);
  -webkit-background-clip: text;
  -moz-background-clip: text;
  background-clip: text;
}

#addCaseCIF {
  border: none;
  border-right: #b8b7b7 0.5px solid;
}

#addCaseCRF {
  border: none;
  border-left: #b8b7b7 0.5px solid;
}

@media only screen and (max-width: 800px) {
  .addCaseFormDiv {
    width: 100%;
    padding: 30px;
  }

  #addCaseCIF {
    border: none;
    border-bottom: black 0.5px solid;
  }

  #addCaseCRF {
    border: none;
    border-top: black 0.5px solid;
  }
}

.addCases-disease-name {
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

.addCases-disease-name:hover {
  border: #346083 solid 1px;
  transform: translateY(-5px);
  transition: 0.3s;
  font-weight: 800;
}

.addCases-disease-name:active {
  border: #346083 solid 1px;
  background: #346083;
  color: #f2f2f2;
  transition: 0.3s;
  font-weight: 800;
}

</style>

