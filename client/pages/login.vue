<template>
  <div id="login">
    <img id="login-logo" class="center" src="~/assets/img/logo.png" />
    <form id="user-login" type="submit">
      <div id="login-form" class="center">
        <h2 id="login-header">Login</h2>
        <div class="login-field">
          <label> Email </label>
          <input
            id="username"
            v-model="email"
            class="login-form-field"
            type="email"
          />
          <!-- TODO: v-if -->
          <p class="error-message">
            Invalid email.
          </p>
        </div>
        <div class="login-field">
          <label> Password </label>
          <input
            id="password"
            v-model="password"
            class="login-form-field"
            type="password"
          />
          <!-- TODO: v-if -->
          <p class="error-message">
            Email or password is incorrect.
          </p>
          <!-- to do -->
          <button id="forgot-pass" type="submit">
            Forgot password?
          </button>
        </div>
        <!-- to do -->
        <button
          id="login-submit"
          class="positive-button center"
          type="submit"
        >
          Login
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  header: {
      title: 'Login'
  },
  data() {
      return {
          email: '',
          password: ''
      }
  },
  methods: {
    /* to do: form validation here */
    /* to do: submit func here */
    /* to do: forgot pass func here */
  },
}
</script>

<style>
    body {
        background-image: url('~/assets/img/login-vector.png');
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-size: cover;
        font-family: 'Work Sans', sans-serif;
    }

    #login-logo {
        height: auto;
        width: 565px;
        max-width: 100%;
        margin-top: 5%;
    }

    #login-form {
        filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.25));
        background-color: white;
        border-radius: 15px;
        width: 50%;
        height: auto;
        max-width: 100%;
        margin-top: 2%;
        padding-bottom: 30px;
    }


    @media only screen and (max-width: 600px) {
    #login-form {
        margin-top: 25%;
        width: 80%;
    }
    }

    #login-header {
        padding-top: 30px;
        text-align: center;
        font-weight: 600;
        font-size: 20px;
        background-color: #008D41;
        color: transparent;
        text-shadow: 1px 1px, -1px -1px rgba(0, 0, 0, 0.25);
        -webkit-background-clip: text;
            -moz-background-clip: text;
                background-clip: text;
    }

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

    .positive-button {
        width: 174px;
        height: 38px;
        max-width: 100%;
        font-size: 16px;
        margin-top: 20px;
        font-family: 'Work Sans', sans-serif;
        font-weight: 600;
        background-color: #346083;
        color: white;
    }

    #forgot-pass {
        text-align: end;
        font-family: 'Work Sans', sans-serif;
        font-weight: 500;
        color: #346083;
        border: none;
        background-color: transparent;
    }

    .error-message {
        color: #da4944;
        font-weight: 500;
        font-size: 12px;
    }

    .center {
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
    
</style>
