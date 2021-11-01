<template>
  <form id="PatientInfo" type="submit">
    <div id="case-investigation-form" class="center">
      <h2 id="form-header">Patient Information</h2>

      <div class="field-row">
        <div class="name-field">
          <label for="lastname" class="required"> Last Name </label>
          <input
            id="lastname"
            v-model="lastname"
            class="input-form-field"
            type="text"
          />
        </div>
        <div class="name-field">
          <label for="firstname" class="required"> First Name </label>
          <input
            id="firstname"
            v-model="firstname"
            class="input-form-field"
            type="text"
          />
        </div>
        <div class="name-field">
          <label for="middlename" class="required"> Middle Name </label>
          <input
            id="middlename"
            v-model="middlename"
            class="input-form-field"
            type="text"
          />
        </div>
      </div>

      <div class="field-row" style="display: inline-flex">
        <div class="half-half" style="width: 45%">
          <div class="birthday-field field">
            <label for="birthdate" class="required"> Date of Birth </label>
            <input
              id="birthdate"
              v-model="birthdate"
              class="input-form-field"
              type="date"
            />
          </div>
          <div class="age-field field">
            <label for="age" class="required"> Age </label>
            <input
              id="age"
              v-model="age"
              class="input-form-field"
              type="number"
            />
          </div>
        </div>

        <div class="half-half" style="width: 55%">
          <div class="sex-field field">
            <label class="required"> Sex </label>
            <div style="display: inline-flex; align-items: center">
              <input
                id="female"
                v-model="sex"
                value="female"
                class="input-radio"
                name="sex"
                type="radio"
              />
              <label for="female"> Female </label>
            </div>
            <div style="display: inline-flex; align-items: center">
              <input
                id="male"
                v-model="sex"
                value="male"
                class="input-radio"
                name="sex"
                type="radio"
              />
              <label for="male"> Male </label>
            </div>
          </div>
          <div class="pregnancy-field field">
            <label class="required"> Pregnancy </label>
            <div style="display: inline-flex; align-items: center">
              <input
                id="Not Pregnant"
                v-model="pregnancy"
                value="Not Pregnant"
                class="input-radio"
                name="pregnancy"
                type="radio"
              />
              <label for="Not Pregnant"> Not Pregnant </label>
            </div>

            <div style="display: inline-flex; align-items: center">
              <input
                id="Pregnant"
                value="pregnant"
                class="input-radio"
                name="pregnancy"
                type="radio"
              />
              <div style="display: inline-flex">
                <input
                  id="pregnancy"
                  v-model="pregnancy"
                  class="input-form-field"
                  type="number"
                  style="width: 50px; height: 20px; margin: 0 2px"
                />
                Weeks Pregnant
              </div>
            </div>
          </div>
        </div>

        <!-- to do -->
      </div>
    </div>
    All info: {{ lastname }}, {{ firstname }}, {{ middlename }}.
    {{ birthdate }}, {{ age }}, {{ sex }}, {{ pregnancy }}
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
    margin: 0 0 10px;
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

.field {
  width: 100%;
  padding: 0px 7px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  padding-bottom: 5px;
}

@media only screen and (max-width: 950px) {
  .name-field {
    width: 98%;
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

.half-half {
  display: inline-flex;
}

.birthday-field {
  /* width: 30%; */
  width: 66.67%;
}
.age-field {
  /* width: 15%; */
  width: 33.33%;
}
.sex-field {
  /* width: 15%; */
  width: 27.27%;
}
.pregnancy-field {
  /* width: 40%; */
  width: 72.73%;
}

@media only screen and (max-width: 950px) {
  .half-half {
    width: 100;
  }

  .birthday-field {
    width: 59%;
  }
  .age-field {
    width: 39%;
  }
  .sex-field {
    width: 39%;
  }
  .pregnancy-field {
    width: 59%;
  }
}

.required:after {
  content: '*';
  color: red;
}
</style>