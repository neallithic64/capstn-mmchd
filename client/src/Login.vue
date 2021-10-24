<template>
    <div id="login">
        <img class="center" id="login-logo" src="./assets/logo.png">
        <form>
            <div class="center" id="login-form">
                <h2 id="login-header"> Login </h2>
                <div class="login-field">
                    <label> Username or Email </label>
                    <input v-model="username" id="username" class="login-form-field">
                </div>
                <div class="login-field">
                    <label> Password </label>
                    <input v-model="password" id="password" class="login-form-field" type="password">
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: 'login',
        components: {

        }
    }
</script>

<style>
    body {
        background-image: url('./assets/login-vector.png');
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
        height: 50vh;
        max-width: 100%;
        margin-top: 2%;
    }

    #login-header {
        padding-top: 3%;
        text-align: center;
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
        padding-bottom: 3%
    }

    .login-form-field {
        height: 30px;
        font-size: 16px;
        font-family: 'Work Sans', sans-serif;
        padding-right: 5px;
        padding-left: 5px;
    }

    .center {
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
    
</style>