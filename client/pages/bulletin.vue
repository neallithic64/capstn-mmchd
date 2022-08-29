<template>
  <div>
    <TopNav/>
    <div class="bulletin-page">

      <div class="bulletin-filters">
        <select v-model="diseaseFilter" class="filter" @change="filter()">
            <option v-for="(name, i) in diseases" :key="i" :value="name"> {{ name }} </option>
        </select>
        <select v-model="typeFilter" class="filter" @change="filter()">
            <option v-for="(name, i) in reportTypes" :key="i" :value="name"> {{ name }} </option>
        </select>
      </div>

      <ul>
        <li v-for="(report, i) in filteredReports" :key="i">
          <div class="bulletin-container">
            <div class="each-bulletin">
              <div class="bulletin-header">
                <img class="display-pic" src="~/assets/img/doh-logo.png">
                <div class="bulletin-header-text">
                  <div class="bulletin-header-top">
                    <span class="display-name"> Metro Manila Center for Health Development </span> 
                    <span class="post-desc"> posted a feedback report. </span>
                  </div>
                  <div class="bulletin-header-bottom">
                    <span :class="reportTypeClass(report.reportType)"> {{ report.reportType }} Report </span>  
                    <span class="report-disease"> • {{ report.reportDisease }}</span>
                  </div>
                </div>
              </div>

              <div class="bulletin-body">
                <div class="bulletin-caption">
                  <span> The <b class="content-bold"> {{ report.reportType }} Feedback Report </b> for <b class="content-bold"> {{ report.reportDisease }} </b> for
                    <b class="content-bold"> {{ report.reportDate }} </b> is now available for viewing.
                    <span v-if="report.dateApproved !== 'N/A'">The report was approved on <b class="content-bold">{{ report.dateApproved }}</b>.</span>
                    <br>
                    Click the link below to view the report.
                  </span>
                </div>

                <a :href="'/viewReport?reportID=' + report.reportID">
                  <div class="bulletin-link">
                    <img class="link-pic" src="~/assets/img/hyperlink.png">
                    <div class="bulletin-link-text">
                      <span class="feedback-title"> {{ report.reportTitle }} </span>
                      <span class="feedback-date"> {{ report.reportDate }} </span>
                      <span class="feedback-date"> {{ report.reportYear }} </span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  middleware: 'is-auth',
  data() {
    return {
      allFeedReports: [],
	  filteredReports: [],
      diseases: ['Disease', 'MALARIA', 'MEASLES/RUBELLA', 'TETANUS', 'PERTUSSIS', 'MENINGOCOCCAL', 'DENGUE', 'CHOLERA', 'LEPTOSPIROSIS', 'CHIKUNGUNYA', 'TYPHOID'],
      reportTypes: ['Report Type', 'Weekly', 'Monthly', 'Annual', 'Adhoc', 'Outbreak'],
      diseaseFilter: 'Disease',
      typeFilter: 'Report Type',
    }
  },
  head() {
    return {
      title: 'Bulletin'
    }
  },
  async mounted() {
    const feedreports = (await axios.get('http://localhost:8080/api/getReportBulletin')).data;
    this.allFeedReports = feedreports;
	this.filteredReports = feedreports;
  },
  methods: {
    reportTypeClass(type) {
      if (type) {
        if (type.toString().includes('Weekly')) return 'report-status green';
        else if (type.toString().includes('Monthly')) return 'report-status yellow1';
        else if (type.toString().includes('Annual')) return 'report-status orange';
        else if (type.toString().includes('Adhoc')) return 'report-status gray';
        else if (type.toString().includes('Outbreak')) return 'report-status red';
      }
    },
    filter() {
      // filter by type & disease
	  if (this.typeFilter === "Report Type" && this.diseaseFilter === "Disease") {
	    this.filteredReports = this.allFeedReports;
	  } else if (this.typeFilter === "Report Type") {
	    this.filteredReports = this.allFeedReports.filter(e => e.reportDisease === this.diseaseFilter);
	  } else if (this.diseaseFilter === "Disease") {
	    this.filteredReports = this.allFeedReports.filter(e => e.reportType === this.typeFilter);
	  } else {
	    this.filteredReports = this.allFeedReports.filter(e => e.reportDisease === this.diseaseFilter && e.reportType === this.typeFilter);
	  }
    },
  }
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

.bulletin-page {
  display: flex;
  flex-direction: column;
  margin-top: 70px;
}

.content-bold {
  font-weight: 400;
  font-size: 14px;
}

.bulletin-filters {
  width: 600px;
  height: fit-content;
  margin: auto;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
}

.filter {
  width: 50%;
  height: 30px;
  font-size: 16px;
  border-style: solid;
  border-width: 1px;
  border-radius: 10px;
  border-color:lightgray;
  padding-left: 5px;
  text-align: center;
}

.bulletin-container {
  width: 600px;
  height: fit-content;
  margin: auto;
  margin-bottom: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
}

.each-bulletin {
  width: 600px;
  height: fit-content;
  background-color: white;
  border-radius: 10px;
  border: 0 0 0 1px black;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.bulletin-header {
  display: flex;
  flex-direction: row;
}

.bulletin-header-text {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  margin-top: 2px;
}

.bulletin-header-top {
  display: flex;
  flex-direction: row;
}

.bulletin-header-bottom {
  display: flex;
  flex-direction: row;
}

.display-pic {
  width: 50px;
  height: 50px;
}

.display-name {
  font-weight: 500;
  font-size: 14px;
}

.post-desc {
  font-size: 14px;
  font-weight: 300px;
  margin-left: 5px;
}

.report-status {
  color: white;
  border-radius: 50px;
  font-weight: 600;
  font-size: 12px;
  width: fit-content;
  height: fit-content;
  padding-left: 10px;
  padding-right: 10px;
}
.red {
  background: red;
}
.orange {
  background: #FC8F00;
}
.yellow1 {
  background: #ccaa14;
}
.green {
  background: #008d41;
}
.gray {
  background: gray;
}

.post-time {
  font-size: 12px;
}

.report-disease {
  font-size: 12px;
  font-weight: 600;
  margin-right: 5px;
  margin-left: 5px;
}

.bulletin-body {
  display: flex;
  flex-direction: column;
}

.bulletin-caption {
  width: 560px;
  overflow-wrap: break-word;
  margin-top: 10px;
  margin-left: 5px;
  font-size: 14px;
}

.bulletin-link {
  background: #f3f3f3;
  color: #6d6d6d;
  height: fit-content;
  margin-top: 20px;
  padding-top: 10px;
  padding-left: 5px;
  display: flex;
  flex-direction: row;
}

.bulletin-link:hover {
  background-color: #7ea1bd;
  color: white;
  cursor: pointer;
}

.bulletin-link-text {
  display: flex;
  height: fit-content;
  flex-direction: column;
  padding-top: 5px;
  padding-bottom: 10px;
  padding-left: 10px;
  margin-bottom: 15px;
  margin-top: 5px;
  border-left-color: #6d6d6d;
  border-left-width: 2px;
  border-left-style: solid;
  width: 480px;
  overflow-wrap: break-word;
}

.feedback-title {
  font-size: 15px;
  font-weight: 600;
}

.feedback-date {
  font-size: 14px;
  font-weight: 400;
}

.link-pic {
  width: 50px;
  height: 50px;
  margin-top: 5px;
  margin-right: 10px;
  margin-left: 10px;
}

.bulletin-views {
  width: 500;
  text-align: end;
  font-size: 12px;
  margin-top: 5px;
}

#move-to-top {
  background-image: url('~/assets/img/up-arrow.png');
  display: hidden; /* Hidden by default */
  position: fixed; /* Fixed/sticky position */
  bottom: 20px; /* Place the button at the bottom of the page */
  right: 30px; /* Place the button 30px from the right */
  z-index: 99; /* Make sure it does not overlap */
  border: none; /* Remove borders */
  outline: none; /* Remove outline */
  background-color: red; /* Set a background color */
  color: white; /* Text color */
  cursor: pointer; /* Add a mouse pointer on hover */
  padding: 15px; /* Some padding */
  border-radius: 10px; /* Rounded corners */
  font-size: 18px; /* Increase font size */
}
</style>