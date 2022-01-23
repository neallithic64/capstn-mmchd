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
                    <Countdown deadline="January 22, 2022 23:39:00"></Countdown>
                  </client-only>
                </div>
              </div>
            </a>
          </div>
          <div id="latest-case-container">
            <span class="dboard-right-titles" style="background-image: linear-gradient(to bottom right, #1e3b70, #29539b);"> Latest Case </span>
            <div class="dboard-right-content" style="border-left-color: #346083;">
              <span style="padding-top: 5px; font-weight: 900"> Measles, <span :class="caseStatusClass(status)"> {{ status }} </span> </span>
              <span> Pasay City, BARANGAY 171 </span>
            </div>
          </div>
          <div id="tracker-container">
            <span class="dboard-right-titles" style="background-image: linear-gradient(to bottom right, #008d41, #74d680);"> Reporting Status Week {{ weekNo }} </span>
            <div class="dboard-right-content" style="border-left-color: #008d41;">
              <p> City </p>
              <p> Caloocan </p>
              <p> Las Piñas </p>
              <p> Makati </p>
              <p> Malabon </p>
              <p> Mandaluyong </p>
              <p> Manila </p>
              <p> Marikina </p>
              <p> Muntinlupa </p>
              <p> Navotas </p>
              <p> Parañaque </p>
              <p> Pasay </p>
              <p> Pasig </p>
              <p> Quezon City </p>
              <p> San Juan </p>
              <p> Taguig </p>
              <p> Valenzuela </p>
            </div>
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
      weekNo: '3'
    }
  },
  head() {
    return {
      title: 'Dashboard'
    }
  },
  mounted() {
    setInterval(this.getToday, 1000);
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
  }
  ,
  methods: {
    caseStatusClass(c) {
      if (c.toString().includes('Suspect')) return 'caseStatus suspectedCase';
      else if (c.toString().includes('Suspected')) return 'caseStatus suspectedCase';
      else if (c.toString().includes('Probable')) return 'caseStatus probableCase';
      else if (c.toString().includes('Confirmed')) return 'caseStatus confirmedCase';
      else if (c.toString().includes('Compatible')) return 'caseStatus confirmedCase';
      else if (c.toString().includes('Discarded')) return 'caseStatus discardedCase';
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

</style>
