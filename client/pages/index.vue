<template>
  <div>
    <TopNav/>
    
  </div>
</template>

<script>
export default {
  middleware: 'is-auth',
}
</script>

<style>
body {
  background-image: none;
  background-color: white;
}
</style>
