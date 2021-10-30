<template>
  <form id="Disease2" type="submit">
    <div id="login-form" class="center">
      <h2 id="login-header">Patient Information</h2>

      <div>
        <div class="name-field">
          <label> Last Name </label>
          <input
            id="lastname"
            v-model="lastname"
            class="three-form-field"
            type="text"
          />
        </div>
        <div class="name-field">
          <label> First Name </label>
          <input
            id="firstname"
            v-model="firstname"
            class="three-form-field"
            type="text"
          />
        </div>
        <div class="name-field">
          <label> Middle Name </label>
          <input
            id="middlename"
            v-model="middlename"
            class="three-form-field"
            type="text"
          />
        </div>
      </div>

      <div class="login-field">
        <label> Email </label>
        <input
          id="username"
          v-model="email"
          class="login-form-field"
          type="email"
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
      firstname: '',
      lastname: '',
      middlename: '',
      email: '',
    }
  },
}
</script>

<style scoped>
.name-field {
  font-size: 14px;
  display: flex;
  flex-direction: column;
  padding-right: 5%;
  padding-left: 5%;
  padding-bottom: 2%;
}

.three-form-field {
  height: 30px;
  font-size: 16px;
  font-family: 'Work Sans', sans-serif;
  padding-right: 5px;
  padding-left: 5px;
  border: 1px solid rgba(0, 0, 0, 0.25);
}
</style>