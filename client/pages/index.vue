<template>
  <div>
    <TopNav/>
    <div id="dashboard-container">
      <div id="dashboard-bottom">
          <iframe v-if="$auth.user.userType === 'pidsrStaff' || $auth.user.userType === 'techStaff' || $auth.user.userType === 'lhsdChief' 
                  || $auth.user.userType === 'resuHead' || $auth.user.userType === 'chdDirector' || $auth.user.userType === 'idpcStaff'" 
            id="dashboard-powerbi-iframe"
            src="https://app.powerbi.com/view?r=eyJrIjoiZDY2MTc5NDYtY2Q3Yi00ZDA4LWI0MDUtMzEyZTA1ZDA1MDVjIiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D">
          </iframe>
          <iframe v-if="$auth.user.userType === 'fhsisStaff'" id="dashboard-powerbi-iframe" src="https://app.powerbi.com/view?r=eyJrIjoiNmM4MDZkMzEtZDM2Ny00ODhmLTlmYjItNzkyMzc3Mzk0ZmUxIiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D">
          </iframe>
          <iframe v-if="$auth.user.userType === 'BHS' || $auth.user.userType === 'privHosp' || $auth.user.userType === 'privLab' 
                  || $auth.user.userType === 'govtLab' || $auth.user.userType === 'govtHosp' || $auth.user.userType === 'CHO'" 
            id="dashboard-powerbi-iframe" 
            src="https://app.powerbi.com/view?r=eyJrIjoiNzk0NTk3NzMtMGEwNS00NGY1LWI1YTktMDZmNzE3NzdmZDk1IiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D">
          </iframe>
        <div id="dashboard-right">

          <!-- Ongoing Outbreak -->
          <div id="outbreak-container">
            <span class="dboard-right-titles" style="padding: 3px 3px 3px 5px; background-image: linear-gradient(to bottom right, #b02e0c, #eb4511);"> Ongoing Outbreak </span>
            <!-- v-if w/ ongoing outbreak show this -->
            <!-- if from CHD, view the outbreak page when clicked -->
            <a v-if="isOutbreak && ($auth.user.userType === 'pidsrStaff' || $auth.user.userType === 'lhsdChief' || $auth.user.userType === 'aehmdChief' || $auth.user.userType === 'resuHead' || 
                $auth.user.userType === 'chdDirector' || $auth.user.userType === 'idpcStaff' || $auth.user.userType === 'eohStaff' || $auth.user.userType === 'hemStaff')" 
                :href="'/viewOutbreak?outbreakID=' +  ongoingOutbreak.obID " > 
              <div id="outbreak-content" class="dboard-right-content" style="border-left-color: #c70000;">
                <div id="outbreak-text">
                  <span style="padding-top: 5px; font-weight: 900"> {{ ongoingOutbreak.obDisease }} </span>
                  <span> <span style="color: red; font-size: 16px; font-weight: 600"> {{ ongoingOutbreak.obActive }} </span> Active Cases </span>
                </div>
                <div v-if="$auth.user.userType === 'pidsrStaff' && obTimer !== ''" id="outbreak-countdown" style="color: red;">
                  <!-- <client-only> -->
                    <!-- test this one lol -->
                    <Countdown :end=obTimer></Countdown>
                  <!-- </client-only> -->
                </div>
              </div>
            </a>

            <!-- if not from CHD, view the all outbreaks page when clicked -->
            <a v-if="!($auth.user.userType === 'pidsrStaff' || $auth.user.userType === 'lhsdChief' || $auth.user.userType === 'aehmdChief' || $auth.user.userType === 'resuHead' || 
                $auth.user.userType === 'chdDirector' || $auth.user.userType === 'idpcStaff' || $auth.user.userType === 'eohStaff' || $auth.user.userType === 'hemStaff') && isOutbreak"
                :href="'/allOutbreaks'">
              <div id="outbreak-content" class="dboard-right-content" style="border-left-color: #c70000;">
                <div id="outbreak-text">
                  <span style="padding-top: 5px; font-weight: 900"> {{ ongoingOutbreak.obDisease }} </span>
                  <span> <span style="color: red; font-size: 16px; font-weight: 600"> {{ ongoingOutbreak.obActive }} </span> Active Cases </span>
                </div>
                <div v-if="$auth.user.userType === 'pidsrStaff' && obTimer !== ''" id="outbreak-countdown" style="color: red;">
                  <!-- <client-only> -->
                    <Countdown :end=obTimer></Countdown>
                  <!-- </client-only> -->
                </div>
              </div>
            </a>

            <!-- v-if no ongoing outbreak show this -->
            <div v-if="!isOutbreak" id="outbreak-content" class="dboard-right-content" style="border-left-color: #c70000;">
              <div id="outbreak-text">
                <span style="padding-top: 5px; font-weight: 900"> No ongoing outbreak. </span>
              </div>
            </div>
          </div>

          <!-- Latest Accomplishment Report -->
          <div v-if="$auth.user.userType === 'fhsisStaff'" id="latest-case-container">
            <div style="padding: 3px 5px 3px 5px; background-image: linear-gradient(to bottom right, #1e3b70, #29539b); display: flex; flex-direction: row; justify-content: space-between;">
              <span class="dboard-right-titles"> Latest Accomplishment Report </span>
              <a class="new-button new-button-case" href="/progAccomplish" > + Add </a>
            </div>

            <!-- v-if w/ latest accomplish rep show this -->
            <a :href="'/allProgAccomplish'">
              <div class="dboard-right-content" style="border-left-color: #346083;">
                <span style="padding-top: 5px; font-weight: 900"> {{ latestAccomplish.laDisease }} </span>
                <span> {{ latestAccomplish.laCity }}, {{ latestAccomplish.laBrgy }} </span>
              </div>
            </a>

            <!-- v-if no latest accomplish rep show this -->
            <!-- <div class="dboard-right-content" style="border-left-color: #346083;">
              <span style="padding-top: 5px; font-weight: 900"> No accomplishments report yet. </span>
            </div> -->
          </div>

          <!-- Report Status for FHSIS -->
          <!-- for FHSIS -->
          <!-- <div v-if="$auth.user.userType === 'fhsisStaff'" id="tracker-container">
            <span class="dboard-right-titles" style="padding: 3px 3px 3px 5px; background-image: linear-gradient(to bottom right, #008d41, #74d680);"> Accomplishment Reporting Status </span>
            <a :href="'/allProgAccomplish'">
              <div class="dboard-right-content" style="border-left-color: #008d41; padding-left: 0px;">
                <div id="tracker-headers">
                  <span style="width: 40%;"> City </span>
                  <span style="width: 60%;"> Accomplishment Forms </span>
                </div>

                <div id="tracker-content">
                  <ul v-for="(value, name, i) in progStatus" :key="i">
                    <li>
                      <div id="tracker-content-row">
                        <div style="width: 40%;">
                          {{ name }}
                        </div>
                        <div class="crfBar" style="width: 60%">
                          <div :id="name" class="crfProgress">
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </a>
          </div> -->

          <!-- Latest Health Event -->
          <div id="latest-event-container">
            <div style="padding: 3px 5px 3px 5px; background-image: linear-gradient(to bottom right, #e09922, #edbb24); display: flex; flex-direction: row; justify-content: space-between;">
              <span class="dboard-right-titles"> Latest Health Event </span>
              <a class="new-button new-button-event" href="/addHealthEvent" > + Add </a>
            </div>
            <!-- v-if w/ latest health event show this -->
            <a :href="'/allHealthEvents'">
              <div class="dboard-right-content" style="border-left-color: #e09922;">
                <span style="padding-top: 5px; font-weight: 900"> {{ latestEvent.leCity }}, <span style="font-weight: 200" :class="caseStatusClass(latestEvent.leStatus)">{{ latestEvent.leStatus }}</span>, <span style="font-weight: 900" :class="caseStatusClass(latestEvent.leAssess)"> {{ latestEvent.leAssess }} </span> </span>
                <span style="color: red; font-size: 16px; font-weight: 600"> {{ latestEvent.leNoCases }} cases, {{ latestEvent.leNoDeaths }} deaths </span>
              </div>
            </a>

            <!-- v-if no latest health event show this -->
            <!-- <div class="dboard-right-content" style="border-left-color: #e09922;">
              <span style="padding-top: 5px; font-weight: 900"> No health events yet. </span>
            </div> -->
          </div>

          <!-- Latest Disease Case -->
          <div v-if="!($auth.user.userType === 'fhsisStaff')" id="latest-case-container">
            <div style="padding: 3px 5px 3px 5px; background-image: linear-gradient(to bottom right, #1e3b70, #29539b); display: flex; flex-direction: row; justify-content: space-between;">
              <span class="dboard-right-titles"> Latest Disease Case </span>
              <a class="new-button new-button-case" href="/addCase" > + Add </a>
            </div>

            <!-- v-if w/ latest disease case show this -->
            <a :href="'/allCases'">
              <div class="dboard-right-content" style="border-left-color: #346083;">
                <span style="padding-top: 5px; font-weight: 900"> {{ latestCase.lcDisease }}, <span style="font-weight: 200" :class="caseStatusClass(latestCase.lcStatus)"> {{ latestCase.lcStatus }} </span> </span>
                <span> {{ latestCase.lcCity }}, {{ latestCase.lcBrgy }} </span>
              </div>
            </a>

            <!-- v-if no latest disease case show this -->
            <!-- <div class="dboard-right-content" style="border-left-color: #346083;">
              <span style="padding-top: 5px; font-weight: 900"> No disease cases yet. </span>
            </div> -->
          </div>

          <!-- Latest Feedback Report -->
          <div id="latest-feedback-container">
            <div style="padding: 3px 5px 3px 5px; background-image: linear-gradient(to bottom right, #FF4E00, #EC9F05); display: flex; flex-direction: row; justify-content: flex-start;">
              <span class="dboard-right-titles"> Latest Feedback Report </span>
            </div>

            <!-- v-if w/ latest feedback report show this -->
            <a :href="'/viewReport?reportID=' + latestReport.lrReportID">
              <div class="dboard-right-content" style="border-left-color: #FF4E00;">
                <!-- <div class="bulletin-caption-db">
                  <span> The <b class="content-bold-db"> {{ report.reportType }} Feedback Report </b> for <b class="content-bold-db"> {{ report.reportDisease }} </b> for
                    <b class="content-bold-db"> {{ report.reportDate }} </b> is now available for viewing.
                    <span v-if="report.dateApproved !== 'N/A'">The report was approved on <b class="content-bold-db">{{ report.dateApproved }}</b>. Click the link below to view the report. </span>
                  </span>
                </div> -->

                <div class="bulletin-caption-db">
                  <span> The <b class="content-bold-db"> {{ latestReport.lrType }} Feedback Report </b> for <b class="content-bold-db"> {{ latestReport.lrDisease }} </b> for
                    <b class="content-bold-db"> {{ monthNames[latestReport.lrDateCreated.getMonth()] }} {{ latestReport.lrDateCreated.getDate() }}, {{ latestReport.lrDateCreated.getFullYear() }}</b> is now available for viewing.
                    <!-- <b class="content-bold-db"> January 20, 2021 </b> is now available for viewing. -->
                    <span> The report was approved on <b class="content-bold-db"> {{latestReport.lrDateApproved.getFullYear()}}-{{String(latestReport.lrDateApproved.getMonth() + 1).padStart(2,"0")}}-{{String(latestReport.lrDateApproved.getDate() + 1).padStart(2,"0")}} {{ latestReport.lrDateApproved.toTimeString().substring(0,8)}}</b>. Click the link below to view the report. </span>
                    <!-- <span> The report was approved on <b class="content-bold-db"> 2022-04-24 19:16:44</b>. Click the link below to view the report. </span> -->
                  </span>
                </div>

                <!-- <a :href="'/viewReport?reportID=' + report.reportID">
                  <div class="bulletin-link-db">
                    <img class="link-pic-db" src="~/assets/img/hyperlink.png">
                    <div class="bulletin-link-text-db">
                      <span class="feedback-title-db"> {{ report.reportTitle }} </span>
                      <span class="feedback-date-db"> {{ report.reportDate }} </span>
                      <span class="feedback-date-db"> {{ report.reportYear }} </span>
                    </div>
                  </div>
                </a> -->

                <!-- <a :href="'/viewReport?reportID=' + report.reportID"> -->
                  <div class="bulletin-link-db">
                    <img class="link-pic-db" src="~/assets/img/hyperlink.png">
                    <div class="bulletin-link-text-db">
                      <span class="feedback-title-db"> {{ latestReport.lrTitle }} </span>
                      <span class="feedback-date-db"> {{ latestReport.lrDateCreated.getMonth() + 1 }} {{ latestReport.lrDateCreated.getDate() }} </span>
                      <span class="feedback-date-db"> {{ latestReport.lrDateCreated.getFullYear() }} </span>
                    </div>
                  </div>
                <!-- </a> -->
              </div>
            </a>

            <!-- v-if no latest disease case show this -->
            <!-- <div class="dboard-right-content" style="border-left-color: #346083;">
              <span style="padding-top: 5px; font-weight: 900"> No disease cases yet. </span>
            </div> -->
          </div>

          <!-- Report Status for CHD and DRU -->
          <!-- for CHD -->
          <!-- <div v-if="$auth.user.userType === 'pidsrStaff' || $auth.user.userType === 'techStaff' || $auth.user.userType === 'lhsdChief' || 
              $auth.user.userType === 'aehmdChief' || $auth.user.userType === 'resuHead' || $auth.user.userType === 'chdDirector' || 
              $auth.user.userType === 'idpcStaff' || $auth.user.userType === 'eohStaff' || $auth.user.userType === 'hemStaff'" 
              id="tracker-container">
            <span class="dboard-right-titles" style="padding: 3px 3px 3px 5px; background-image: linear-gradient(to bottom right, #008d41, #74d680);"> Reporting Status Week {{ weekNo }} </span>
            <a :href="'/allCases'">
              <div class="dboard-right-content" style="border-left-color: #008d41; padding-left: 0px;">
                <div id="tracker-headers">
                  <span style="width: 40%;"> City </span>
                  <span style="width: 20%;"> CIF </span>
                  <span style="width: 40%;"> CRF </span>
                </div>

                <div id="tracker-content">
                  <ul v-for="(value, name, i) in reportStatus" :key="i">
                    <li>
                      <div id="tracker-content-row">
                      <div style="width: 40%;">
                        {{ name }}
                      </div>
                      <div v-if="reportStatus[name][0] == 1" style="width: 20%; padding-left: 10px;">
                        <div class="cifYES"> </div>
                      </div>
                      <div v-if="reportStatus[name][0] == 0" style="width: 20%; padding-left: 10px;">
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
          </div> -->

          <!-- for DRU -->
          <!-- <div v-if="$auth.user.userType === 'BHS' || $auth.user.userType === 'RHU' || $auth.user.userType === 'CHO' ||
              $auth.user.userType === 'govtHosp' || $auth.user.userType === 'privHosp' || $auth.user.userType === 'clinic' ||
              $auth.user.userType === 'govtLab' || $auth.user.userType === 'privLab' || $auth.user.userType === 'airseaPort'" id="tracker-container">
            <span class="dboard-right-titles" style="padding: 3px 3px 3px 5px; background-image: linear-gradient(to bottom right, #008d41, #74d680);"> Case Report Forms Week {{ weekNo }} </span>
            <a :href="'/allCases'">
              <div class="dboard-right-content" style="border-left-color: #008d41; padding-left: 0px;">
                <div id="tracker-headers">
                  <span style="width: 30%;"> Disease </span>
                  <span style="width: 34%;"> Submit Status </span>
                  <span style="width: 32%;"> Report Status </span>
                </div>

                <div id="tracker-content">
                  <ul v-for="(value, name, i) in crfStatus" :key="i">
                    <li>
                      <div id="tracker-content-row">
                        <div style="width: 30%; font-weight: 600;">
                          {{ name }}
                        </div> -->

                        <!-- Submit Status -->
                        <!-- <div v-if="crfStatus[name][0] == 0" style="width: 34%;">
                          <div style="display: flex; flex-direction: row;">
                            <div class="crfOngoing"> </div> <span style="margin-left: 5px;"> Ongoing </span>
                          </div>
                        </div>
                        <div v-if="crfStatus[name][0] == 1" style="width: 34%;">
                          <div style="display: flex; flex-direction: row;">
                            <div class="crfSubmitted"> </div> <span style="margin-left: 5px;"> Submitted </span>
                          </div>
                        </div>
                        <div v-if="crfStatus[name][0] == 2" style="width: 34%;">
                          <div style="display: flex; flex-direction: row;">
                            <div class="crfPushed"> </div> <span style="margin-left: 5px;"> Pushed </span>
                          </div>
                        </div> -->

                        <!-- Report Status -->
                        <!-- <div v-if="crfStatus[name][1] == 0" style="width: 32%;">
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
                      </div> -->
                    <!-- </li> -->
                  <!-- </ul> -->
                <!-- </div> -->
              <!-- </div> -->
            <!-- </a> -->
          <!-- </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Countdown from 'vuejs-countdown'
// import * as pbi from "powerbi-client";
const axios = require('axios');
export default {
  components: { 
    Countdown
  },
  middleware: 'is-auth',
  data() {
    return {
      isOutbreak: true,
      obTimer:'',
      ongoingOutbreak: {
        obDisease: 'Measles',
        obActive: '1826',
        obID:'OU-0000000000000'
      },
      latestEvent: {
        leCity: 'Malabon',
        leStatus: 'Ongoing',
        leAssess: 'PHELC',
        leNoCases: '5',
        leNoDeaths: '2'
      },
      latestCase: {
        lcDisease: 'Measles',
        lcStatus: 'Suspected',
        lcCity: 'Pasay',
        lcBrgy: 'BARANGAY 171'
      },
      latestAccomplish: {
        laDisease: 'Malaria',
        laCity: 'Makati',
        laBrgy: 'WEST REMBO'
      }, 
      latestReport: {
        lrReportID: 'RE-0000000000000',
        lrDisease: 'Malaria',
        lrType: 'Adhoc',
        lrTitle: 'MALARIA REPORT',
        lrDateCreated: new Date('2022-01-19T21:00:39.000Z'),
        lrDateApproved: new Date('2022-01-19T21:00:39.000Z')
      },
      weekNo: '3',
      reportStatus: {
        // CIF only 1 or 0 (1 if submitted at least 1 CIF, 0 if no CIF at all)
        // CRF count should be count of all CRFs in the city (total = 5 per DRU * number of DRUs in the city)
        'Caloocan City': [1, 4],
        'Las Piñas City': [0, 2],
        'Makati City': [1, 5],
        'Malabon City': [1, 2],
        'Mandaluyong City': [0, 3],
        'Manila City': [0, 1],
        'Marikina City': [0, 3],
        'Muntinlupa City': [0, 5],
        'Navotas City': [1, 0],
        'Parañaque City': [0, 2],
        'Pasay City': [1, 3],
        'Pasig City': [1, 2],
        'Quezon City': [0, 1],
        'San Juan City': [0, 5],
        'Taguig City': [0, 0],
        'Valenzuela City': [1, 2],
      },
      cities: ['Caloocan City', 'Las Piñas City', 'Makati City', 'Malabon City', 'Mandaluyong City', 'Manila City', 'Marikina City', 'Muntinlupa City', 'Navotas City', 'Parañaque City', 'Pasay City', 'Pasig City', 'Quezon City', 'San Juan City', 'Taguig City', 'Valenzuela City'],
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
        'Caloocan City': 6,
        'Las Piñas City': 8,
        'Makati City': 7,
        'Malabon City': 2,
        'Mandaluyong City': 8,
        'Manila City': 4,
        'Marikina City': 7,
        'Muntinlupa City': 2,
        'Navotas City': 24,
        'Parañaque City': 8,
        'Pasay City': 9,
        'Pasig City': 4,
        'Quezon City': 2,
        'San Juan City': 5,
        'Taguig City': 7,
        'Valenzuela City': 5
      },
      monthNames :["January","February","March","April","May","June","July","August","September","October","November","December"]
    }
  },
  async fetch(){
    const data = (await axios.get('http://localhost:8080/api/dashboarddata')).data;

    this.latestEvent.leCity = data.latestEvent.city;
    this.latestEvent.leStatus = data.latestEvent.eventStatus;
    this.latestEvent.leAssess = data.latestEvent.assessment;
    this.latestEvent.leNoCases = data.latestEvent.numCases;
    this.latestEvent.leNoDeaths = data.latestEvent.numDeaths;

    this.latestCase.lcDisease = data.latestCase.diseaseName;
    this.latestCase.lcCity = data.latestCase.city;
    this.latestCase.lcStatus = data.latestCase.caseLevel;
    this.latestCase.lcBrgy = data.latestCase.brgy;

    this.latestAccomplish.laDisease = data.latestAccomp.diseaseName;
    this.latestAccomplish.laCity = data.latestAccomp.city;
    this.latestAccomplish.laBrgy = data.latestAccomp.brgy;

    this.latestReport.lrReportID = data.latestFeedback.reportID;
    this.latestReport.lrDisease = data.latestFeedback.diseaseName;
    this.latestReport.lrType = data.latestFeedback.reportType;
    this.latestReport.lrTitle = data.latestFeedback.title;
    this.latestReport.lrDateCreated = new Date(data.latestFeedback.dateCreated);
    this.latestReport.lrDateApproved = new Date(data.latestFeedback.approvedByDate);

    if(data.ongoingOutbreak.length === 0)
      this.isOutbreak = false;
    else {
      this.ongoingOutbreak.obDisease = data.ongoingOutbreak[0].diseaseName;
      this.ongoingOutbreak.obActive = data.activeCases;
      this.obTimer = data.ongoingOutbreak[0].timer;
    }
  },
  head() {
    return {
      title: 'Dashboard'
    }
  },
  mounted() {
    // eslint-disable-next-line no-unused-vars
    const userTypes = ["fhsisStaff", "techStaff", "lhsdChief", "aehmdChief",
            "resuHead", "chdDirector", "idpcStaff", "eohStaff", "hemStaff"];
    setInterval(this.getToday, 1000);
    
    // if (this.$auth.user.userType === 'pidsrStaff' || this.$auth.user.userType === 'techStaff' || this.$auth.user.userType === 'lhsdChief' || 
    //     this.$auth.user.userType === 'aehmdChief' || this.$auth.user.userType === 'resuHead' || this.$auth.user.userType === 'chdDirector' || 
    //     this.$auth.user.userType === 'idpcStaff' || this.$auth.user.userType === 'eohStaff' || this.$auth.user.userType === 'hemStaff')
    //   this.moveProgress();
    // if (this.$auth.user.userType === 'fhsisStaff' || this.$auth.user.userType === 'techStaff')
    //   this.moveTCLProgress();
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
      else if (c.toString().includes('PHELC')) return 'caseStatus confirmedCase';
      else if (c.toString().includes('PHERC')) return 'caseStatus confirmedCase';
      else if (c.toString().includes('PHENC')) return 'caseStatus confirmedCase';
      else if (c.toString().includes('PHEIC')) return 'caseStatus confirmedCase';
      else if (c.toString().includes('forValidation')) return 'For Validation';
    },
    // moveProgress() {
    //   for (let i = 0; i < this.cities.length; i++) {
    //     const bar = document.getElementById(this.cities[i]);
    //     // computation for % = total no of CRFs submitted in the city / (5 per DRU * number of DRUs in the city) * 100)
    //     bar.style.width = ((this.reportStatus[this.cities[i]][1]/5)*100) + "%";
    //   }
    // },
    // moveTCLProgress() {
    //   for (let i = 0; i < this.cities.length; i++) {
    //     const bar = document.getElementById(this.cities[i]);
    //     // computation for % = total no of CRFs submitted in the city / (24 per BHS * number of BHSs in the city) * 100)
    //     bar.style.width = ((this.progStatus[this.cities[i]]/24)*100) + "%";
    //   }
    // }
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
  max-height: 87vh;
  background-color: gray;
  width: 70%;
  margin-left: 5px;
  margin-top: 5px;
  overflow: auto;
}

#dashboard-powerbi-iframe {
  height: 87vh;
  background-color: gray;
  width: 70%;
  border-radius: 10px;
  margin-left: 5px;
  margin-top: 5px;
}

#dashboard-right {
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin-right: 5px;
  margin-left: 5px;
  font-weight: 500;
  font-size: 14px;
  width: 30%;
  height: 85vh
}

#latest-event-container {
  /* width: 350px; */
  display: flex;
  flex-direction: column;
  padding: 5px 5px 5px 5px;
}

#latest-case-container {
  /* width: 350px; */
  display: flex;
  flex-direction: column;
  padding: 5px 5px 5px 5px;
}

#latest-feedback-container {
  /* width: 350px; */
  display: flex;
  flex-direction: column;
  padding: 5px 5px 5px 5px;
}

#outbreak-container {
  /* width: 350px; */
  display: flex;
  flex-direction: column;
  /* margin-top: 5px; */
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
  /* width: 350px; */
  display: flex;
  flex-direction: column;
  margin-top: 0px;
  padding: 5px 5px 5px 5px;
  
}

.dboard-right-titles {
  color: white;
  /* padding: 3px 3px 3px 5px; */
  font-weight: 600;
}

.new-button {
  color: white;
  font-weight: 600;
}

.new-button-event:hover {
  background-color: white;
  color: #e09922;
}

.new-button-case:hover {
  background-color: white;
  color: #1e3b70;
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

.bulletin-caption-db {
  width: 350px;
  overflow-wrap: break-word;
  margin-top: 10px;
  margin-left: 5px;
  font-size: 12px;
}

.bulletin-link-db {
  background: #f3f3f3;
  color: #6d6d6d;
  height: fit-content;
  margin-top: 10px;
  padding-top: 5px;
  padding-left: 5px;
  display: flex;
  flex-direction: row;
}

.link-pic-db {
  width: 25px;
  height: 25px;
  margin-top: 5px;
  margin-right: 10px;
  margin-left: 10px;
}

.feedback-title-db {
  font-size: 12px;
  font-weight: 600;
}

.feedback-date-db {
  font-size: 11px;
  font-weight: 400;
}

.bulletin-link-text-db {
  display: flex;
  height: fit-content;
  flex-direction: column;
  /* padding-top: 5px; */
  padding-bottom: 5px;
  padding-left: 10px;
  margin-bottom: 5px;
  border-left-color: #6d6d6d;
  border-left-width: 2px;
  border-left-style: solid;
  width: 480px;
  overflow-wrap: break-word;
}

.content-bold-db {
  font-weight: 400;
  font-size: 12px;
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
  max-height: 150px;
  overflow: auto;
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