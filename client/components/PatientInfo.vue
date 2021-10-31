<template>
  <form id="PatientInfo" type="submit">
    <div id="case-investigation-form" class="center">
      <h2 id="form-header">Patient Information</h2>

      <div class="field-row">
        <div class="name-field">
          <label class="required"> Last Name </label>
          <input
            id="lastname"
            v-model="lastname"
            class="input-form-field"
            type="text"
          />
        </div>
        <div class="name-field">
          <label class="required"> First Name </label>
          <input
            id="firstname"
            v-model="firstname"
            class="input-form-field"
            type="text"
          />
        </div>
        <div class="name-field">
          <label class="required"> Middle Name </label>
          <input
            id="middlename"
            v-model="middlename"
            class="input-form-field"
            type="text"
          />
        </div>
      </div>

      <div class="field-row">
        <div class="name-field">
          <label class="required"> Date of Birth </label>
          <input
            id="birthdate"
            v-model="birthdate"
            class="input-form-field"
            type="date"
          />
        </div>
        <div class="name-field">
          <label class="required"> Age </label>
          <input
            id="age"
            v-model="age"
            class="input-form-field"
            type="number"
          />
        </div>
        <div class="name-field">
          <label class="required"> Sex </label>
          <div style="display: inline-flex">
            <input
              id="female"
              v-model="sex"
              value="female"
              class="input-radio"
              name="sex"
              type="radio"
            />
            Female
          </div>
          <div style="display: inline-flex">
            <input
              id="male"
              v-model="sex"
              value="male"
              class="input-radio"
              name="sex"
              type="radio"
            />
            Male
          </div>
        </div>
        <div class="name-field">
          <label class="required"> Pregnancy </label>
          <div style="display: inline-flex">
            <input
              id="Not Pregnant"
              v-model="pregnancy"
              value="Not Pregnant"
              class="input-radio"
              name="pregnancy"
              type="radio"
            />
            Not Pregnant
          </div>

          <div style="display: inline-flex">
            <input
              id="Pregnant"
              v-model="pregnancy"
              value="pregnant"
              class="input-radio"
              name="pregnancy"
              type="radio"
            />
            <input
              id="pregnancy"
              v-model="pregnancy"
              class="input-form-field"
              type="number"
            />
            Weeks Pregnant
          </div>
        </div>
      </div>

      All info: {{ lastname }}, {{ firstname }}, {{ middlename }}.
      {{ birthdate }}, {{ age }}, {{ sex }}, {{ pregnancy }}

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
      birthdate: '',
      age: '',
      sex: '',
      pregnancy: '',
    }
  },
}
</script>

<style scoped>
.case-investigation-form {
  margin-top: 5px;
  width: 100%;
}

#form-header {
  text-align: left;
  padding-left: 5px;
  font-weight: 600;
  font-size: 20px;
  background-color: #008d41;
  color: transparent;
  text-shadow: 1px 1px, -1px -1px rgba(0, 0, 0, 0.25);
  -webkit-background-clip: text;
  -moz-background-clip: text;
  background-clip: text;
}

@media only screen and (max-width: 950px) {
  #form-header {
    text-align: center;
  }
}

.field-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  margin: 0 7px 6px 5px;
}

@media only screen and (max-width: 950px) {
  .field-row {
    flex-direction: column;
    margin: 0;
  }
}

.name-field {
  width: 100%;
  padding: 0px 7px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  padding-bottom: 5px;
}

@media only screen and (max-width: 950px) {
  .name-field {
    width: 97%;
    margin: 0px 7.5px;
  }
}

.input-form-field {
  width: 100%;
  height: 30px;
  font-size: 16px;
  font-family: 'Work Sans', sans-serif;
  padding-right: 5px;
  padding-left: 5px;
  /* border: 1p x solid rgba(0, 0, 0, 0.25); */
  border: 1px solid #a3a3a3;
  box-sizing: border-box;
  border-radius: 9px;
}

.input-radio {
  /* width: 10%; */
  height: 10px;
  font-size: 16px;
  font-family: 'Work Sans', sans-serif;
  padding-right: 5px;
  padding-left: 5px;
  /* border: 1p x solid rgba(0, 0, 0, 0.25); */
  border: 1px solid #a3a3a3;
  box-sizing: border-box;
  border-radius: 9px;
}

.required:after {
  content: '*';
  color: red;
}
</style>