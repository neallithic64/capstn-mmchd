<template>
  <div>
    <TopNav/>
    
  </div>
</template>

<script>
export default {
  middleware: 'is-auth',
  data() {
    return {

    }
  },
  head() {
    return {
      title: 'Dashboard'
    }
  },
}
</script>

<style>
body {
  background-image: none;
  background-color: white;
}
</style>
