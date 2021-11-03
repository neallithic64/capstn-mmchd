<template>
  <div id="login">
    <img id="login-logo" class="center" src="~/assets/img/logo.png" />
    <form id="user-login" type="submit" novalidate="true" method="post" @submit="submitForm">
      <div id="login-form" class="center">
        <h2 id="login-header">Login</h2>
        <div class="login-field">
          <label> Email or Username </label>
          <input
            id="username"
            v-model="email"
            class="login-form-field"
          />
          <p id="email-error" class="error-message" >
            {{ emailError }}
            {{ genError }}
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
          <p id="password-error" class="error-message">
            {{ passError }}
            {{ genError }}
          </p>
          <!-- to do -->
          <button id="forgot-pass" type="button">
            <nuxt-link to="/forgotpassword"> Forgot password? </nuxt-link>
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

const axios = require('axios');

export default {
  header: {
      title: 'Login'
  },
  data() {
      return {
          email: '',
          password: '', 
          genError: '',
          emailError: '',
          passError: ''
      }
  },
  methods: {
    checkForm(e) {
      let error = false;
      if (this.email === "") {
        this.emailError = "Email or Username is required.";
        error = true;
      }
      else if (this.email.includes("@")) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(this.email) === false) {
          this.emailError = "Invalid email.";
          error = true;
        }
        else this.emailError = "";
      }
      else this.emailError = "";

      if (this.password === "") {
        this.passError = "Password is required.";
        error = true;
      }
      else this.passError = "";

      return error;
      
      // e.preventDefault();
    },
    submitForm(e) {
      if (!this.checkForm()) {
        axios.post('http://localhost:8080/login', {
          email: this.email,
          password: this.password
        })
        .then((response) => {
          // eslint-disable-next-line no-console
          console.log(response);
          // this.$router.push({name: 'login'})
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
      }
      e.preventDefault();
    }

      // e.preventDefault();

      // this.axios.post('https://localhost:3000/login', this.input).then((result) => {
      //   // eslint-disable-next-line no-console
      //   console.log(result.data)
      //   this.$indexRouter.push({name: 'login'})
      // }).catch((error)=> {
      //   // eslint-disable-next-line no-console
      //   console.log(error)
      //   this.genError = "User not found."
      // })
    /* TODO: submit func here */
    /* TODO: forgot pass func here */
  }
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

    @media only screen and (max-width: 300px) {
    #login-header {
      font-size: 15px;
    }
    }

    .login-field {
        font-size: 14px;
        display: flex;
        flex-direction: column;
        padding-right: 5%;
        padding-left: 5%;
        padding-bottom: 2%;
    }

    @media only screen and (max-width: 300px) {
    .login-field {
      font-size: 10px;
    }
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

    @media only screen and (max-width: 600px) {
    .positive-button {
        width: 70%;
        font-size: 14px;
    }
    }

    #forgot-pass {
      position: relative;
      align-self: flex-end;
      text-align: end;
      font-family: 'Work Sans', sans-serif;
      font-weight: 500;
      color: #346083;
      border: none;
      background-color: transparent;
      width: 130px;
      max-width: 100%;
    }

    @media only screen and (max-width: 300px) {
    #forgot-pass {
      font-size: 10px;
    }
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
