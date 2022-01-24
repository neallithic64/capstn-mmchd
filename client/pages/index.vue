<template>
  <div>
    <TopNav/>
    <div id="dashboard-container">
      <div id="dashboard-bottom">
          <iframe id="dashboard-powerbi-iframe" src="https://app.powerbi.com/view?r=eyJrIjoiODdiNTM2N2YtMTA3YS00NzA2LTg5YjItMDBlZDllMTQ2ZDY0IiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D&pageName=ReportSection">
          </iframe>
        <div id="dashboard-right">

          <!-- Ongoing Outbreak -->
          <div id="outbreak-container">
            <span class="dboard-right-titles" style="background-image: linear-gradient(to bottom right, #b02e0c, #eb4511);"> Ongoing Outbreak </span>
            <!-- v-if w/ ongoing outbreak show this -->
            <a :href="'/viewOutbreak?outbreakID='">
              <div id="outbreak-content" class="dboard-right-content" style="border-left-color: #c70000;">
                <div id="outbreak-text">
                  <span style="padding-top: 5px; font-weight: 900"> {{ ongoingOutbreak.obDisease }} </span>
                  <span> <span style="color: red; font-size: 16px; font-weight: 600"> {{ ongoingOutbreak.obActive }} </span> Active Cases </span>
                </div>
                <div id="outbreak-countdown" style="color: red;">
                  <client-only>
                    <Countdown deadline="January 22, 2022 22:41:00"></Countdown>
                  </client-only>
                </div>
              </div>
            </a>

            <!-- v-if no ongoing outbreak show this -->
            <!-- <div id="outbreak-content" class="dboard-right-content" style="border-left-color: #c70000;">
              <div id="outbreak-text">
                <span style="padding-top: 5px; font-weight: 900"> No ongoing outbreak. </span>
              </div>
            </div> -->
          </div>

          <!-- Report Status for FHSIS -->
          <!-- for FHSIS -->
          <div v-if="$auth.user.userType === 'fhsisStaff' || $auth.user.userType === 'techStaff' || 
                $auth.user.userType === 'lhsdChief' || $auth.user.userType === 'aehmdChief' || $auth.user.userType === 'resuHead' || 
                $auth.user.userType === 'chdDirector' || $auth.user.userType === 'idpcStaff' || $auth.user.userType === 'eohStaff' || $auth.user.userType === 'hemStaff'" id="tracker-container">
            <span class="dboard-right-titles" style="background-image: linear-gradient(to bottom right, #008d41, #74d680);"> Accomplishment Reporting Status </span>
            <a :href="'/allCases'">
              <div class="dboard-right-content" style="border-left-color: #008d41; padding-left: 0px;">
                <div id="tracker-headers">
                  <span style="width: 30%;"> City </span>
                  <span style="width: 70%;"> Accomplishment Forms </span>
                </div>

                <div id="tracker-content">
                  <ul v-for="(value, name, i) in progStatus" :key="i">
                    <li>
                      <div id="tracker-content-row">
                        <div style="width: 30%;">
                          {{ name }}
                        </div>
                        <div class="crfBar" style="width: 70%">
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

          <!-- Latest Health Event -->
          <div id="latest-event-container">
            <span class="dboard-right-titles" style="background-image: linear-gradient(to bottom right, #e09922, #edbb24);"> Latest Health Event </span>
            <a :href="'/allCases'">
              <div class="dboard-right-content" style="border-left-color: #e09922;">
                <span style="padding-top: 5px; font-weight: 900"> {{ latestEvent.leCity }}, {{ latestEvent.leSource }} Source, <span :class="caseStatusClass(latestEvent.leStatus)"> {{ latestEvent.leStatus }} </span> </span>
                <span style="color: red; font-size: 16px; font-weight: 600"> {{ latestEvent.leNoCases }} cases, {{ latestEvent.leNoDeaths }} deaths </span>
              </div>
            </a>
          </div>

          <!-- Latest Disease Case -->
          <div id="latest-case-container">
            <span class="dboard-right-titles" style="background-image: linear-gradient(to bottom right, #1e3b70, #29539b);"> Latest Disease Case </span>
            <a :href="'/allCases'">
              <div class="dboard-right-content" style="border-left-color: #346083;">
                <span style="padding-top: 5px; font-weight: 900"> {{ latestCase.lcDisease }}, <span :class="caseStatusClass(latestCase.lcStatus)"> {{ latestCase.lcStatus }} </span> </span>
                <span> {{ latestCase.lcCity }}, {{ latestCase.lcBrgy }} </span>
              </div>
            </a>
          </div>

          <!-- Report Status for CHD and DRU -->
          <!-- for CHD -->
          <div v-if="$auth.user.userType === 'pidsrStaff' || $auth.user.userType === 'techStaff' || 
                $auth.user.userType === 'lhsdChief' || $auth.user.userType === 'aehmdChief' || $auth.user.userType === 'resuHead' || 
                $auth.user.userType === 'chdDirector' || $auth.user.userType === 'idpcStaff' || $auth.user.userType === 'eohStaff' || $auth.user.userType === 'hemStaff'" id="tracker-container">
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
                      <div class="crfBar" style="width: 40%;">
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

          <!-- for DRU -->
          <div v-if="$auth.user.userType === 'BHS' || $auth.user.userType === 'RHU' || $auth.user.userType === 'CHO' ||
              $auth.user.userType === 'govtHosp' || $auth.user.userType === 'privHosp' || $auth.user.userType === 'clinic' ||
              $auth.user.userType === 'govtLab' || $auth.user.userType === 'privLab' || $auth.user.userType === 'airseaPort'" id="tracker-container">
            <span class="dboard-right-titles" style="background-image: linear-gradient(to bottom right, #008d41, #74d680);"> Case Report Forms Week {{ weekNo }} </span>
            <a :href="'/allCases'">
              <div class="dboard-right-content" style="border-left-color: #008d41; padding-left: 0px;">
                <div id="tracker-headers">
                  <span style="width: 30%;"> Disease </span>
                  <span style="width: 28%;"> Submit Status </span>
                  <span style="width: 32%;"> Report Status </span>
                </div>

                <div id="tracker-content">
                  <ul v-for="(value, name, i) in crfStatus" :key="i">
                    <li>
                      <div id="tracker-content-row">
                        <div style="width: 30%; font-weight: 600;">
                          {{ name }}
                        </div>

                        <!-- Submit Status -->
                        <div v-if="crfStatus[name][0] == 0" style="width: 28%;">
                          <div style="display: flex; flex-direction: row;">
                            <div class="crfOngoing"> </div> <span style="margin-left: 5px;"> Ongoing </span>
                          </div>
                        </div>
                        <div v-if="crfStatus[name][0] == 1" style="width: 28%;">
                          <div style="display: flex; flex-direction: row;">
                            <div class="crfSubmitted"> </div> <span style="margin-left: 5px;"> Submitted </span>
                          </div>
                        </div>
                        <div v-if="crfStatus[name][0] == 2" style="width: 28%;">
                          <div style="display: flex; flex-direction: row;">
                            <div class="crfPushed"> </div> <span style="margin-left: 5px;"> Pushed </span>
                          </div>
                        </div>

                        <!-- Report Status -->
                        <div v-if="crfStatus[name][1] == 0" style="width: 32%;">
                          <div style="display: flex; flex-direction: row;">
                            <div class="crfOngoing"> </div> <span style="margin-left: 5px;"> Ongoing </span>
                          </div>
                        </div>
                        <div v-if="crfStatus[name][1] == 1" style="width: 32%;">
                          <div style="display: flex; flex-direction: row;">
                            <div class="crfZero"> </div> <span style="margin-left: 5px;"> Zero Cases </span>
                          </div>
                        </div>
                        <div v-if="crfStatus[name][1] == 2" style="width: 32%;">
                          <div style="display: flex; flex-direction: row;">
                            <div class="crfCases"> </div> <span style="margin-left: 5px;"> With Cases </span>
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
      ongoingOutbreak: {
        obDisease: 'Measles',
        obActive: '1826'
      },
      latestEvent: {
        leCity: 'Malabon',
        leSource: 'Internet',
        leStatus: 'For Verification',
        leNoCases: '5',
        leNoDeaths: '2'
      },
      latestCase: {
        lcDisease: 'Measles',
        lcStatus: 'Suspected',
        lcCity: 'Pasay',
        lcBrgy: 'BARANGAY 171'
      },
      weekNo: '3',
      reportStatus: {
        // CIF only 1 or 0 (1 if submitted at least 1 CIF, 0 if no CIF at all)
        // CRF count should be count of all CRFs in the city (total = 5 per DRU * number of DRUs in the city)
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
      cities: ['Caloocan', 'Las Piñas', 'Makati', 'Malabon', 'Mandaluyong', 'Manila', 'Marikina', 'Muntinlupa', 'Navotas', 'Parañaque', 'Pasay', 'Pasig', 'Quezon City', 'San Juan', 'Taguig', 'Valenzuela'],
      crfDiseases: ['Dengue', 'Cholera', 'Leptospirosis', 'Chikungunya', 'Typhoid'],
      crfStatus: {
        // Submit Status: Ongoing = 0, Submitted = 1, Pushed = 2; Report Status: Ongoing = 0, Zero Report = 1, Cases Submitted = 2
        'Dengue': [1, 2],
        'Cholera': [0, 0],
        'Leptospirosis': [2, 2],
        'Chikungunya': [1, 1],
        'Typhoid': [2, 1]
      },
      progStatus: {
        // out of 12 TCLs, and 12 PAFs so total 24 per BHS
        'Caloocan': 6,
        'Las Piñas': 8,
        'Makati': 7,
        'Malabon': 2,
        'Mandaluyong': 8,
        'Manila': 4,
        'Marikina': 7,
        'Muntinlupa': 2,
        'Navotas': 24,
        'Parañaque': 8,
        'Pasay': 9,
        'Pasig': 4,
        'Quezon City': 2,
        'San Juan': 5,
        'Taguig': 7,
        'Valenzuela': 5
      }
    }
  },
  head() {
    return {
      title: 'Dashboard'
    }
  },
  mounted() {
    const userTypes = ["fhsisStaff", "techStaff", "lhsdChief", "aehmdChief",
            "resuHead", "chdDirector", "idpcStaff", "eohStaff", "hemStaff"];
    setInterval(this.getToday, 1000);
    if (userTypes.includes(this.$auth.user.userType)) {
      this.moveProgress();
      this.moveTCLProgress();
    }
  },
  methods: {
    caseStatusClass(c) {
      if (c.toString().includes('Suspect')) return 'caseStatus suspectedCase';
      else if (c.toString().includes('Suspected')) return 'caseStatus suspectedCase';
      else if (c.toString().includes('Probable')) return 'caseStatus probableCase';
      else if (c.toString().includes('Confirmed')) return 'caseStatus confirmedCase';
      else if (c.toString().includes('Compatible')) return 'caseStatus confirmedCase';
      else if (c.toString().includes('Discarded')) return 'caseStatus discardedCase';
      else if (c.toString().includes('For Verification')) return 'caseStatus discardedCase';
      else if (c.toString().includes('Ongoing')) return 'caseStatus confirmedCase';
      else if (c.toString().includes('Controlled')) return 'caseStatus suspectedCase';
      else if (c.toString().includes('Closed')) return 'caseStatus closedCase';
    },
    moveProgress() {
      for (let i = 0; i < this.cities.length; i++) {
        const bar = document.getElementById(this.cities[i]);
        // computation for % = total no of CRFs submitted in the city / (5 per DRU * number of DRUs in the city) * 100)
        bar.style.width = ((this.reportStatus[this.cities[i]][1]/5)*100) + "%";
      }
    },
    moveTCLProgress() {
      for (let i = 0; i < this.cities.length; i++) {
        const bar = document.getElementById(this.cities[i]);
        // computation for % = total no of CRFs submitted in the city / (24 per BHS * number of BHSs in the city) * 100)
        bar.style.width = ((this.progStatus[this.cities[i]]/24)*100) + "%";
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

#latest-event-container {
  width: 350px;
  display: flex;
  flex-direction: column;
  padding: 5px 5px 5px 5px;
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
  margin-top: 0px;
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
.closedCase {
  background: #008d41;
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
  margin-top: 5px; 
  height: 10px;
}

.crfProgress {
  background-color: #0dad58;
  width: 20%;
  height: 10px;
}

.crfOngoing {
  height: 10px;
  width: 10px;
  background-color: #bbb;
  border-radius: 50%;
  margin-top: 5px;
}

.crfSubmitted {
  height: 10px;
  width: 10px;
  background-color: #0dad58;
  border-radius: 50%;
  margin-top: 5px;
}

.crfCases {
  height: 10px;
  width: 10px;
  background-color: #0dad58;
  border-radius: 50%;
  margin-top: 5px;
}

.crfPushed {
  height: 10px;
  width: 10px;
  background-color: #f0c126;
  border-radius: 50%;
  margin-top: 5px;
}

.crfZero {
  height: 10px;
  width: 10px;
  background-color: #f02626;
  border-radius: 50%;
  margin-top: 5px;
}
</style>
