<template>
  <div>
    <TopNav/>
    <div id="dashboard-container">
      <div id="dashboard-bottom">
        <div id="dashboard-powerbi">
          PowerBI here
        </div>
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
import * as pbi from "powerbi-client";
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
    const permission = pbi.models.Permissions.Read
    const config = {
      
      type: 'report',
      tokenType: pbi.models.TokenType.Embed,
      accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1yNS1BVWliZkJpaTdOZDFqQmViYXhib1hXMCIsImtpZCI6Ik1yNS1BVWliZkJpaTdOZDFqQmViYXhib1hXMCJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZjM0YTM1YmQtYTY1ZC00NjA1LWIwZmEtZDI1NzFmODMxZjVlLyIsImlhdCI6MTY0MjkzOTIxOCwibmJmIjoxNjQyOTM5MjE4LCJleHAiOjE2NDI5NDM1NjksImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84VEFBQUFCUGt4TitWcmNoa3NPRkpHK2xlYmlzdE1kTE9aOHJGL0RTYm1MeE1LMmlsVTRrK2dnOCtwWEp4TFZPRzNPaWNwIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6IjIzZDhmNmJkLTFlYjAtNGNjMi1hMDhjLTdiZjUyNWM2N2JjZCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiR2FyY2lhIiwiZ2l2ZW5fbmFtZSI6IkFuZHJlIEVtbWFudWVsIiwiaXBhZGRyIjoiMTgwLjE5NS4yMS4yNDgiLCJuYW1lIjoiQW5kcmUgRW1tYW51ZWwgIFMuIEdhcmNpYSIsIm9pZCI6ImUxNzE5OGM3LTBlOTYtNDZhNy04OTBmLWJjM2I0NWQ3MTViYSIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0xMTU0NzQ2MDY5LTQwNTQzMDI1OTktMzU1Mjk0MDM1OS0xNDMxNzgiLCJwdWlkIjoiMTAwMzNGRkZBRERDRkZGNyIsInJoIjoiMC5BVDBBdlRWSzgxMm1CVWF3LXRKWEg0TWZYcjMyMkNPd0hzSk1vSXg3OVNYR2U4MDlBTm8uIiwic2NwIjoiQXBwLlJlYWQuQWxsIENhcGFjaXR5LlJlYWQuQWxsIENhcGFjaXR5LlJlYWRXcml0ZS5BbGwgQ29udGVudC5DcmVhdGUgRGFzaGJvYXJkLlJlYWQuQWxsIERhc2hib2FyZC5SZWFkV3JpdGUuQWxsIERhdGFmbG93LlJlYWQuQWxsIERhdGFmbG93LlJlYWRXcml0ZS5BbGwgRGF0YXNldC5SZWFkLkFsbCBEYXRhc2V0LlJlYWRXcml0ZS5BbGwgR2F0ZXdheS5SZWFkLkFsbCBHYXRld2F5LlJlYWRXcml0ZS5BbGwgUGlwZWxpbmUuRGVwbG95IFBpcGVsaW5lLlJlYWQuQWxsIFBpcGVsaW5lLlJlYWRXcml0ZS5BbGwgUmVwb3J0LlJlYWQuQWxsIFJlcG9ydC5SZWFkV3JpdGUuQWxsIFN0b3JhZ2VBY2NvdW50LlJlYWQuQWxsIFN0b3JhZ2VBY2NvdW50LlJlYWRXcml0ZS5BbGwgVGVuYW50LlJlYWQuQWxsIFRlbmFudC5SZWFkV3JpdGUuQWxsIFVzZXJTdGF0ZS5SZWFkV3JpdGUuQWxsIFdvcmtzcGFjZS5SZWFkLkFsbCBXb3Jrc3BhY2UuUmVhZFdyaXRlLkFsbCIsInN1YiI6IlhWUUFGbDJWNGx4bG04ekU5S3M4c1BYNDBrbno2SmprYUo3YUcxUWN3S28iLCJ0aWQiOiJmMzRhMzViZC1hNjVkLTQ2MDUtYjBmYS1kMjU3MWY4MzFmNWUiLCJ1bmlxdWVfbmFtZSI6ImFuZHJlX2dhcmNpYUBkbHN1LmVkdS5waCIsInVwbiI6ImFuZHJlX2dhcmNpYUBkbHN1LmVkdS5waCIsInV0aSI6IkdPZHFuQnFrYkVLR2JITzJDZWNDQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdfQ.GpRb0vX4SWwJouvUx0PWTfjHxEk66bL2kmzyGTxrPb4lWGlzpuQb0aoJEx6Q0aQsP7d1MykBllKIzVTwjUdKwFClJ4QTiDHPIg9zwSsDLvQkcwH47ioVjhqMh4vjvy7cbl-hmW0pG5iXru8-p-ksgtYFxH7sDCjNb2TU-ylRZWlBOWHcRyhI7x9fjDY7likwMrIf2HQEOI-200WIY6NmUHiSdpYm6UuesyK-5eSHm7dbHtKr1ko1qTl6UQ5dmOqzJ0wUadxs4P3ybo6HygEereoAM0jtxSn6I9Q72AiCoT3GokQR4S0sTmu8X4rJbZbwzajb_iAoabMkNc5dNB04Ig',
      embedUrl: 'https://app.powerbi.com/view?r=eyJrIjoiODdiNTM2N2YtMTA3YS00NzA2LTg5YjItMDBlZDllMTQ2ZDY0IiwidCI6ImYzNGEzNWJkLWE2NWQtNDYwNS1iMGZhLWQyNTcxZjgzMWY1ZSIsImMiOjEwfQ%3D%3D',
      id: '493129f0-86b2-40fa-9036-8c269b8fe9cc',
      pageView: 'fitToWidth',
      permissions: permission,
    };

    const powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);
    const dashboardContainer = document.getElementById('dashboard-powerbi');
    const dashboard = powerbi.embed(dashboardContainer, config);

    dashboard.off("loaded");
    dashboard.off("rendered");
    dashboard.on("error", function () {
      this.dashboard.off("error");
   });
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
