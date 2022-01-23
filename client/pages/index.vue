<template>
  <div>
    <TopNav/>
    <div id="dashboard-container">
      <div id="dashboard-bottom">
          <iframe id="dashboard-powerbi-iframe" src="https://app.powerbi.com/view?r=eyJrIjoiODdiNTM2N2YtMTA3YS00NzA2LTg5YjItMDBlZDllMTQ2ZDY0IiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D&pageName=ReportSection">
          </iframe>
        <div id="dashboard-right">
          <div id="outbreak-container">
            <span class="dboard-right-titles" style="background-image: linear-gradient(to bottom right, #b02e0c, #eb4511);"> Ongoing Outbreak </span>
            <a :href="'/viewOutbreak?outbreakID='">
              <div id="outbreak-content" class="dboard-right-content" style="border-left-color: #c70000;">
                <div id="outbreak-text">
                  <span style="padding-top: 5px; font-weight: 900"> Measles </span>
                  <span> <span style="color: red; font-size: 16px; font-weight: 600"> 1826 </span> Active Cases </span>
                </div>
                <div id="outbreak-countdown" style="color: red;">
                  <client-only>
                    <Countdown deadline="January 22, 2022 22:41:00"></Countdown>
                  </client-only>
                </div>
              </div>
            </a>
          </div>
          <div id="latest-case-container">
            <span class="dboard-right-titles" style="background-image: linear-gradient(to bottom right, #1e3b70, #29539b);"> Latest Case </span>
            <a :href="'/allCases'">
              <div class="dboard-right-content" style="border-left-color: #346083;">
                <span style="padding-top: 5px; font-weight: 900"> Measles, <span :class="caseStatusClass(status)"> {{ status }} </span> </span>
                <span> Pasay City, BARANGAY 171 </span>
              </div>
            </a>
          </div>
          <div id="tracker-container">
            <span class="dboard-right-titles" style="background-image: linear-gradient(to bottom right, #008d41, #74d680);"> Reporting Status Week {{ weekNo }} </span>
            <a :href="'/allCases'">
              <div class="dboard-right-content" style="border-left-color: #008d41; padding-left: 0px;">
                <div id="tracker-headers">
                <span style="width: 33.33%;"> City </span>
                <span style="width: 20%;"> CIF </span>
                <span style="width: 40%;"> CRF </span>
                </div>

                <div id="tracker-content">
                  <ul v-for="(value, name, i) in reportStatus" :key="i">
                    <li>
                      <div id="tracker-content-row">
                      <div style="width: 33.33%;">
                        {{ name }}
                      </div>
                      <div v-if="reportStatus[name][0] == 1" style="width: 20%;">
                        <div class="cifYES"> </div>
                      </div>
                      <div v-if="reportStatus[name][0] == 0" style="width: 20%;">
                        <div class="cifNO"> </div>
                      </div>
                      <div class="crfBar">
                        <div :id="name" class="crfProgress">
                        </div>
                      </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Countdown from 'vuejs-countdown'
// import * as pbi from "powerbi-client";
export default {
  components: { 
    Countdown
  },
  middleware: 'is-auth',
  data() {
    return {
      status: 'Suspected',
      weekNo: '3',
      reportStatus: {
        'Caloocan': [1, 4],
        'Las Piñas': [0, 2],
        'Makati': [1, 5],
        'Malabon': [1, 2],
        'Mandaluyong': [0, 3],
        'Manila': [0, 1],
        'Marikina': [0, 3],
        'Muntinlupa': [0, 5],
        'Navotas': [1, 0],
        'Parañaque': [0, 2],
        'Pasay': [1, 3],
        'Pasig': [1, 2],
        'Quezon City': [0, 1],
        'San Juan': [0, 5],
        'Taguig': [0, 0],
        'Valenzuela': [1, 2],
      },
      cities: ['Caloocan', 'Las Piñas', 'Makati', 'Malabon', 'Mandaluyong', 'Manila', 'Marikina', 'Muntinlupa', 'Navotas', 'Parañaque', 'Pasay', 'Pasig', 'Quezon City', 'San Juan', 'Taguig', 'Valenzuela']
    }
  },
  head() {
    return {
      title: 'Dashboard'
    }
  },
  mounted() {
    setInterval(this.getToday, 1000);
    this.moveProgress();
  },
  methods: {
    caseStatusClass(c) {
      if (c.toString().includes('Suspect')) return 'caseStatus suspectedCase';
      else if (c.toString().includes('Suspected')) return 'caseStatus suspectedCase';
      else if (c.toString().includes('Probable')) return 'caseStatus probableCase';
      else if (c.toString().includes('Confirmed')) return 'caseStatus confirmedCase';
      else if (c.toString().includes('Compatible')) return 'caseStatus confirmedCase';
      else if (c.toString().includes('Discarded')) return 'caseStatus discardedCase';
    },
    moveProgress() {
      for (let i = 0; i < this.cities.length; i++) {
        const bar = document.getElementById(this.cities[i]);
        bar.style.width = ((this.reportStatus[this.cities[i]][1]/5)*100) + "%";
      }

      
    }
  }
}
</script>

<style>
body {
  background-image: none;
  background-color: white;
  font-family: 'Work Sans', sans-serif;
}

#dashboard-container {
  display: flex;
  flex-direction: column;
}

#dashboard-bottom {
  margin-top: 65px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

#dashboard-datetime {
  display: flex;
  flex-direction: column;
  font-weight: 700;
  font-size: 12px;
  padding-left: 20px;
  border-left-style: solid;
  border-left-width: 2px;
  border-left-color: white;
}

#main-title {
  padding-right: 20px;
  font-size: 25px;
  font-weight: 700;
}

#dashboard-powerbi {
  height: 100vh;
  background-color: gray;
  width: 100%;
  border-radius: 10px;
  margin-left: 5px;
  margin-top: 5px;
}

#dashboard-powerbi-iframe {
  height: 100vh;
  background-color: gray;
  width: 100%;
  border-radius: 10px;
  margin-left: 5px;
  margin-top: 5px;
}

#dashboard-right {
  display: flex;
  flex-direction: column;
  margin-right: 5px;
  margin-left: 5px;
  margin-top: 5px;
  font-weight: 500;
  font-size: 13px;
}

#latest-case-container {
  width: 350px;
  display: flex;
  flex-direction: column;
  padding: 5px 5px 5px 5px;
}

#outbreak-container {
  width: 350px;
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  padding: 5px 5px 5px 5px;
}

#outbreak-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

#outbreak-text {
  display: flex;
  flex-direction: column;
}

#outbreak-countdown {
  margin-left: 20px;
}

#tracker-container {
  width: 350px;
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  padding: 5px 5px 5px 5px;
}

.dboard-right-titles {
  color: white;
  padding: 3px 3px 3px 5px;
  font-weight: 600;
}

.dboard-right-content {
  border-left-style: solid;
  border-left-width: 2px;
  padding-left: 5px;
  padding-bottom: 5px;
  display: flex;
  flex-direction: column;
}

.dboard-right-content:hover {
  background:rgba(245, 245, 245, 0.904);
}

#outbreak-countdown {
  padding-left: 20px;
}

.caseStatus {
  color: white;
  padding: 2px 10px;
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
.discardedCase {
  background: gray;
}

#tracker-headers {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-image: linear-gradient(to bottom right, #bbdbbe, #deebdd);
  padding-left: 5px;
  /* padding-right: 80px; */
  font-weight: 900;
}

#tracker-content {
  padding-left: 5px;
}

#tracker-content-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.cifYES {
  height: 10px;
  width: 10px;
  background-color: #0dad58;
  border-radius: 50%;
  margin-top: 5px;
}

.cifNO {
  height: 10px;
  width: 10px;
  background-color: #bbb;
  border-radius: 50%;
  margin-top: 5px;
}

.crfBar {
  background-color: #bbb;
  width: 40%; 
  margin-top: 5px; 
  height: 10px;
}

.crfProgress {
  background-color: #0dad58;
  width: 20%;
  height: 10px;
}
</style>
