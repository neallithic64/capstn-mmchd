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
            <span class="dboard-right-titles" style="background-color: #c70000;"> Ongoing Outbreak </span>
            <a :href="'/viewOutbreak?outbreakID='">
              <div id="outbreak-content" class="dboard-right-content" style="border-left-color: #c70000;">
                <div id="outbreak-text">
                  <p> Disease </p>
                  <p> Active Cases </p>
                </div>
                <div id="outbreak-countdown">
                  <p> Countdown here </p>
                </div>
              </div>
            </a>
          </div>
          <div id="latest-case-container">
            <span class="dboard-right-titles" style="background-color: #346083;"> Latest Case </span>
            <div class="dboard-right-content" style="border-left-color: #346083;">
              <p> Disease, Status </p>
              <p> City, Barangay </p>
            </div>
          </div>
          <div id="tracker-container">
            <span class="dboard-right-titles" style="background-color: #008d41;"> Reporting Status Week 3 </span>
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

export default {
  middleware: 'is-auth',
  data() {
    return {
      date: '',
      time: '',
      days: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
      months: ['January','February','March','April','May','June','July','August','September','October','November','December']
    }
  },
  head() {
    return {
      title: 'Dashboard'
    }
  },
  mounted() {
    setInterval(this.getToday, 1000);
  },
  methods: {
    getToday() {
      const today = new Date();
      const date = this.months[today.getMonth()]+' '+today.getDate()+', '+today.getFullYear()+', '+this.days[today.getDay()];
      let hours = today.getHours();
      let minutes = today.getMinutes().toString();
      let seconds = today.getSeconds().toString();

      const ampm = today.getHours() >= 12 ? ' PM' : ' AM';
      hours = hours % 12;
      // eslint-disable-next-line no-unneeded-ternary
      hours = hours ? hours : 12;
      hours = hours.toString().length === 1 ? 0+hours.toString() : hours;

      minutes = minutes.length===1 ? 0+minutes : minutes;
      seconds = seconds.length===1 ? 0+seconds : seconds;

      const time = hours + ":"  + minutes + ":" + seconds + " " + ampm;
      
      this.date = date;
      this.time = time;
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
  font-weight: 400;
  font-size: 12.5px;
}

#latest-case-container {
  width: 300px;
  display: flex;
  flex-direction: column;
  padding: 5px 5px 5px 5px;
}

#outbreak-container {
  width: 300px;
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  padding: 5px 5px 5px 5px;
}

#outbreak-content {
  display: flex;
  flex-direction: row;
}

#outbreak-text {
  display: flex;
  flex-direction: column;
}

#outbreak-countdown {
  margin-left: 20px;
}

#tracker-container {
  width: 300px;
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
}

.dboard-right-content:hover {
  background:rgba(245, 245, 245, 0.904);
}
</style>
