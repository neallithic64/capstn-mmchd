<template>
  <div>
    <div id="alert-container">
      <div id="alert-icon">
        <div id="alert-picture">
          <img class="blink" src="../assets/img/outbreak.png">
        </div>
      </div>
      <div id="alert-content">
        <span style="font-weight: 900; font-size: 40px; margin-top: 5px"> POTENTIAL OUTBREAK ALERT </span>
        <span style="font-weight: 200; font-size: 18px; max-width: 300;"> The <b style="font-weight: 900;"> {{ outbreak.outbreakType }} threshold </b> for <b style="font-weight: 900;"> {{ outbreak.diseaseName }} </b> has been reached. Response required! </span>
      </div>
      <button class="view-button"> View Outbreak Alert </button>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'is-auth',
  data() {
    return {
      outbreak: {
        outbreakType: 'alert',
        diseaseName: 'Acute Viral Hepatitis'
      }
    }
  },
  head() {
    return {
      title: '!!! Potential Outbreak Alert !!!'
    }
  },
  methods: {
    
  }
}
</script>

<style>
  body {
    font-family: 'Work Sans', sans-serif;
    font-weight: 300;
    padding: 0px;
    margin: 0px;
    background-color:#EED202;
  }

  #alert-icon {
    border-radius: 50%;
    background: white;
    width: 120px;
    height: 120px;
    margin: auto;
    margin-top: -60px;
  }

  #alert-picture {
    width: 80px;
    height: 80px;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -55%);
  }

  #alert-content {
    display: flex;
    flex-direction: column;
    word-wrap: break-word;
  }

  #alert-container {
    color: white;
    width: 700px;
    height: fit-content;
    background-color: #a1911d;
  /* Center vertically and horizontally */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    border-radius: 10px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    padding-bottom: 30px;
    padding-right: 20px;
    padding-left: 20px;
  }

  .blink {
    animation: blink 1s steps(1, end) infinite;
  }

  @keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .view-button {
    width: 200px;
    height: 30px;
    max-width: 100%;
    font-size: 14px;
    margin-top: 30px;
    font-family: 'Work Sans', sans-serif;
    font-weight: 600;
    background-color: #a1911d;
    color: white;
    border: white solid 1px;
  }

  .view-button:hover {
    background-color: white;
    color: #a1911d;
    border: #a1911d solid 1px;
  }


</style>