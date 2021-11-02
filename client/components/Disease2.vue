<template>
  <form id="Disease2" type="submit">
    <div id="login-form" class="center">
      <h2 id="login-header">Login</h2>
      <div class="login-field">
        <label> Email 22222222 </label>
        <input
          id="username"
          v-model="email"
          class="login-form-field"
          type="email"
        />
      </div>
      <div class="login-field">
        <label> Password </label>
        <input
          id="password"
          v-model="password"
          class="login-form-field"
          type="password"
        />
      </div>
      <!-- to do -->
    </div>
  </form>
</template>


<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      isOpen: true,
    }
  },
}
</script>

<style scoped>
.login-field {
  font-size: 14px;
  display: flex;
  flex-direction: column;
  padding-right: 5%;
  padding-left: 5%;
  padding-bottom: 2%;
}

.login-form-field {
  height: 30px;
  font-size: 16px;
  font-family: 'Work Sans', sans-serif;
  padding-right: 5px;
  padding-left: 5px;
  border: 1px solid rgba(0, 0, 0, 0.25);
}
</style>