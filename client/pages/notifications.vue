<template>
  <div>
    <TopNav/>
    <div class="notif-container">
      <ul>
        <li class="each-notif">
          <!-- image here -->
          hihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihihi
        </li>
        <li class="each-notif">
          
        </li>
      </ul>
      
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'is-auth',
  data() {
    return {
      notifs: {}

    }
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

  .notif-container {
    width: 600px;
    height: fit-content;
    margin: auto;
    margin-top: 70px;
    margin-bottom: 10px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  }

  .each-notif {
    max-width: 600px;
    overflow-wrap: break-word;
    height: 100px;
    background-color: white;
    border-radius: 10px;
    border: 0 0 0 1px black;
    padding: 10px;
  }

  .each-notif:hover {
    background-color: #f2f2f2;
  }
</style>