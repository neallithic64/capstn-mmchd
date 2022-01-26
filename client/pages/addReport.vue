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
      title: 'New Report'
    }
  },
  methods: {
    
  }
}
</script>

<style>

</style>