<template>
  <form id="PatientInfo" type="submit">
    <div id="case-investigation-form" class="center">
      <h2 id="form-header">Clinical Data</h2>

      <div class="field-row" style="display: inline-flex; margin-bottom: -1 px">
        <div class="field">
          <label class="required">
            Select the following symptoms shown by patient
          </label>

          <div>
            <div>
              <div class="checkbox-options">
                <input
                  id="fever"
                  value="fever"
                  class="input-radio"
                  name="fever"
                  type="checkbox"
                />
                <div class="checkbox-options">
                  Fever
                  <input
                    id="fever"
                    v-model="formData.symptoms.fever"
                    class="input-form-field"
                    type="date"
                    style="width: 150px; height: 20px; margin: 0 2px"
                  />
                </div>
              </div>

              <div class="checkbox-options">
                <input
                  id="rash"
                  value="rash"
                  class="input-radio"
                  name="rash"
                  type="checkbox"
                />
                <div class="checkbox-options">
                  Rash
                  <input
                    id="rash"
                    v-model="formData.symptoms.rash"
                    class="input-form-field"
                    type="date"
                    style="width: 150px; height: 20px; margin: 0 2px"
                  />
                </div>
              </div>

              <div class="checkbox-options">
                <input
                  id="Not Pregnant"
                  v-model="formData.pregnancy"
                  value="Not Pregnant"
                  class="input-radio"
                  name="pregnancy"
                  type="checkbox"
                />
                <label for="Not Pregnant">
                  Swollen lymphatic nodules (specify location)
                </label>
              </div>
            </div>

            <div style="display: no-wrap">
              <div class="checkbox-options">
                <input
                  id="cough"
                  v-model="formData.symptoms.cough"
                  value="cough"
                  class="input-radio"
                  name="cough"
                  type="checkbox"
                />
                <label for="cough"> Cough </label>
              </div>

              <div class="checkbox-options">
                <input
                  id="koplik"
                  v-model="formData.symptoms.koplik"
                  value="koplik"
                  class="input-radio"
                  name="koplik"
                  type="checkbox"
                />
                <label for="Not Pregnant"> Koplik Sign </label>
              </div>

              <div class="checkbox-options">
                <input
                  id="runnynose"
                  v-model="formData.pregnancy"
                  value="runnynose"
                  class="input-radio"
                  name="runnynose"
                  type="checkbox"
                />
                <label for="runnynose"> Runny Nose </label>
              </div>

              <div class="checkbox-options">
                <input
                  id="redeye"
                  v-model="formData.redeye"
                  value="redeye"
                  class="input-radio"
                  name="redeye"
                  type="checkbox"
                />
                <label for="redeye"> Red eye/conjunctivitis </label>
              </div>

              <div class="checkbox-options">
                <input
                  id="arthritis"
                  v-model="formData.arthritis"
                  value="arthritis"
                  class="input-radio"
                  name="arthritis"
                  type="checkbox"
                />
                <label for="arthritis"> Arthralgia/arthritis </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="field-row">
        <div class="field">
          <label for="complications">
            Are there any complications? Please specify.
          </label>
          <input
            id="complications"
            v-model="formData.complications"
            class="input-form-field"
            type="text"
          />
        </div>
      </div>

      <div class="field-row">
        <div class="field">
          <label for="otherSymptoms"> Other symptoms </label>
          <input
            id="otherSymptoms"
            v-model="formData.otherSymptoms"
            class="input-form-field"
            type="text"
          />
        </div>
      </div>

      <div class="field-row">
        <div class="field">
          <label for="diagnosis"> Working/Final Diagnosis </label>
          <input
            id="diagnosis"
            v-model="formData.diagnosis"
            class="input-form-field"
            type="text"
          />
        </div>
      </div>
    </div>
    <!--Next back button-->
    <div style="margin: -10px 0 5px; float: right">
      <button class="back-button" type="button" @click="back">Cancel</button>

      <button class="next-button" type="button" @click="next">Next</button>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      pageAction: '',
      formData: {
        symptoms: {
          fever: '',
          rash: '',
          lymph: '',
          cough: '',
          koplik: '',
          runnynose: '',
          redeye: '',
          arthrisis: '',
        },
        complications: '',
        otherSymptoms: '',
        diagnosis: '',
      },
    }
  },
  methods: {
    back() {
      this.$emit('update', [-1, this.formData])
    },
    next() {
      this.$emit('update', [1, this.formData])
    },
    update() {
      this.$emit('update', [this.pageAction, this.formData])
    },
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

.field-row-straight {
  width: 100%;
  display: flex;
  flex-direction: row;
  margin: 0 7px 6px 5px;
}

@media only screen and (max-width: 950px) {
  .field-row-straight {
    /* flex-direction: column; */
    margin: 0;
    width: 98%;
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

.half-half1 {
  width: 45%;
}

.half-half2 {
  width: 55%;
}

@media only screen and (max-width: 950px) {
  .half-half,
  .half-half1,
  .half-half2 {
    width: 100%;
  }
}

.checkbox-options {
  display: inline-flex;
  align-items: center;
  font-size: 16px;
}

.required:after {
  content: '*';
  color: red;
}
</style>