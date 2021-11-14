<template>
  <div id="viewCases">
    <!--Top Bar of the screen-->
    <TopNav />

    <!--Everything below = main screen-->
    <div class="cases-container">
      <div class="cases-section-container">
        <!--Name of form-->
        <div class="page-name">
          <h1 style="margin: 0; font-weight: 600; font-size: 24px">All Case</h1>
        </div>

        <!--Table-->
        <div class="cases-component">
          <table class="table table-hover table-bordered results">
            <thead>
              <tr>
                <th class="col-md-5 col-xs-5">Name / Surname</th>
                <th class="col-md-4 col-xs-4">Job</th>
                <th class="col-md-3 col-xs-3">City</th>
              </tr>
              <tr class="warning no-result">
                <td colspan="4"><i class="fa fa-warning"></i> No result</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div id="accordion" class="accordion">
                    <div class="card">
                      <div id="headingTwo" class="card-header">
                        <h5 class="mb-0">
                          <button
                            class="btn btn-link collapsed"
                            type="button"
                            data-toggle="collapse"
                            data-target="#collapseTwo"
                            aria-expanded="false"
                            aria-controls="collapseTwo"
                          >
                            Collapsible Group Item #2
                          </button>
                        </h5>
                      </div>
                      <div
                        id="collapseTwo"
                        class="collapse"
                        aria-labelledby="headingTwo"
                        data-parent="#accordion"
                      >
                        <div class="card-body">
                          Anim pariatur cliche reprehenderit, enim eiusmod high
                          life accusamus terry richardson ad squid. 3 wolf moon
                          officia aute, non cupidatat skateboard dolor brunch.
                          Food truck quinoa nesciunt laborum eiusmod. Brunch 3
                          wolf moon tempor, sunt aliqua put a bird on it squid
                          single-origin coffee nulla assumenda shoreditch et.
                          Nihil anim keffiyeh helvetica, craft beer labore wes
                          anderson cred nesciunt sapiente ea proident. Ad vegan
                          excepteur butcher vice lomo. Leggings occaecat craft
                          beer farm-to-table, raw denim aesthetic synth nesciunt
                          you probably haven't heard of them accusamus labore
                          sustainable VHS.
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td>UI and UX</td>
                <td>Istanbul</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>
                  <div id="accordion" class="accordion">
                    <div class="card">
                      <div id="headingThree" class="card-header">
                        <h5 class="mb-0">
                          <button
                            class="btn btn-link collapsed"
                            type="button"
                            data-toggle="collapse"
                            data-target="#collapse3"
                            aria-expanded="false"
                            aria-controls="collapse3"
                          >
                            Collapsible Group Item #2
                          </button>
                        </h5>
                      </div>
                      <div
                        id="collapse3"
                        class="collapse"
                        aria-labelledby="heading3"
                        data-parent="#accordion"
                      >
                        <div class="card-body">
                          Anim pariatur cliche reprehenderit, enim eiusmod high
                          life accusamus terry richardson ad squid. 3 wolf moon
                          officia aute, non cupidatat skateboard dolor brunch.
                          Food truck quinoa nesciunt laborum eiusmod. Brunch 3
                          wolf moon tempor, sunt aliqua put a bird on it squid
                          single-origin coffee nulla assumenda shoreditch et.
                          Nihil anim keffiyeh helvetica, craft beer labore wes
                          anderson cred nesciunt sapiente ea proident. Ad vegan
                          excepteur butcher vice lomo. Leggings occaecat craft
                          beer farm-to-table, raw denim aesthetic synth nesciunt
                          you probably haven't heard of them accusamus labore
                          sustainable VHS.
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td>Software Developer</td>
                <td>Istanbul</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Egemen Özbeyli</td>
                <td>Purchasing</td>
                <td>Kocaeli</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Engin Kızıl</td>
                <td>Sales</td>
                <td>Bozuyük</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  header: {
    title: 'Add Case',
  },
  data() {
    return {
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
    function: {},
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

.cases-component {
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
  .cases-component {
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

.results tr[visible='false'],
.no-result {
  display: none;
}

.results tr[visible='true'] {
  display: table-row;
}

.counter {
  padding: 8px;
  color: #ccc;
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

/* 
a {
  background: rgba(255, 255, 255, 0);
  border-bottom: 1px solid;
  color: pink;
  line-height: 1.4;
  padding: 0.25em;
  text-decoration: none;
}
a:hover {
  background: rgba(255, 255, 255, 1);
  color: #346083;
}

.btn {
  color: #346083;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  line-height: 45px;
  margin: 0 0 2em;
  max-width: 160px;
  position: relative;
  text-decoration: none;
  width: 100%;
}
@media (min-width: 600px) {
  .btn {
    margin: 0 1em 2em;
  }
}
.btn:hover {
  text-decoration: none;
  text-transform: uppercase;
}

.btn-1 {
  background: transparent;
  font-weight: 100;
}
.btn-1 svg {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}
.btn-1 rect {
  fill: none;
  stroke: none;
  stroke-width: 2;
  stroke-dasharray: 422, 0;
  transition: all 0.35s linear;
}
.btn-1:hover {
  background: white;
  font-weight: 900;
  letter-spacing: 1px;
}
.btn-1:hover rect {
  stroke-width: 5;
  stroke-dasharray: 15, 310;
  stroke-dashoffset: 48;
  transition: all 1.35s cubic-bezier(0.19, 1, 0.22, 1);
} */
</style>

