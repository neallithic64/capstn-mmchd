<template>
  <div>
    <TopNav/>
    <!--Everything below = main screen-->
    <div class="case-container">
      <!--SUMMARY: left side-->
      <div class="form-summary-container">
        <div class="form-summary">
          <button id="login-submit" type="submit" style="width: 210px; text-align: left" @click="isOpen = !isOpen">
            <h2 style="font-weight: 600">New User Progress</h2>
          </button>

          <div v-if="isOpen" class="form-contents">
            <div v-for="(value, name, i) in formSection.formNames" :key="i">
              <!-- <div v-if="i > 1" :id="name" :class="formColor(i - 1)"> -->
              <button :id="name" :class="formColor(i)" @click="move(i)">
                {{ i+1 }}. {{ value }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!--Everything in the right-->
      <div class="form-section-container">
        <!--Name of form-->
        <div class="disease-name">
          <h1 style="margin: 0; font-weight: 600; font-size: 24px">
            Add New User
          </h1>
          <p style="margin: 0 5px 5px 0px; font-size: 16px">
            Please fill up the form with complete and correct information.
          </p>
        </div>

        <!--Form itself-->
        <div class="form-component">
          <!-- User Type (Form 1) -->
          <form v-if="pageNum == 0 || pageNum == Object.keys(formSection.formNames).length" id="newUserType" type="submit">
            <div id="new-user-form" class="center">
              <h2 id="form-header"> {{ Object.values(formSection.formNames)[0] }} </h2>
              <div class="userType-field field">
                <label class="required" style="margin-bottom: 3px;"> Please select the correct user type </label>
                <hr>

                <div class="field-row-straight">
                  <!-- CHD User Types -->
                  <div class="usertype-column">
                    <h2 id="form-header" style="margin-bottom: 3px;"> MMCHD </h2>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="pidsrStaff"
                        v-model="user.userType"
                        value="pidsrStaff"
                        class="input-radio"
                        name="userType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="pidsrStaff"> PIDSR Staff </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="fhsisStaff"
                        v-model="user.userType"
                        value="fhsisStaff"
                        class="input-radio"
                        name="userType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="fhsisStaff"> FHSIS Staff </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="idpcStaff"
                        v-model="user.userType"
                        value="idpcStaff"
                        class="input-radio"
                        name="userType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="idpcStaff"> IDPC Staff </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="eohStaff"
                        v-model="user.userType"
                        value="eohStaff"
                        class="input-radio"
                        name="userType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="eohStaff"> EOH Staff </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="hemStaff"
                        v-model="user.userType"
                        value="hemStaff"
                        class="input-radio"
                        name="userType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="hemStaff"> HEM Staff </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="lhsdChief"
                        v-model="user.userType"
                        value="lhsdChief"
                        class="input-radio"
                        name="userType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="lhsdChief"> LHSD Chief </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="aehmdChief"
                        v-model="user.userType"
                        value="aehmdChief"
                        class="input-radio"
                        name="userType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="aehmdChief"> AEHMD Chief </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="resuHead"
                        v-model="user.userType"
                        value="resuHead"
                        class="input-radio"
                        name="userType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="resuHead"> RESU Head </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="chdDirector"
                        v-model="user.userType"
                        value="chdDirector"
                        class="input-radio"
                        name="userType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="chdDirector"> CHD Director </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="techStaff"
                        v-model="user.userType"
                        value="techStaff"
                        class="input-radio"
                        name="userType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="techStaff"> IT Service Staff </label>
                    </div>
                  </div>

                  <!-- DRU User Types -->
                  <div class="usertype-column">
                    <h2 id="form-header" style="margin-bottom: 3px;"> DRU/PRU </h2>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="BHS"
                        v-model="user.userType"
                        value="BHS"
                        class="input-radio"
                        name="userType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="BHS"> BHS </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="RHU"
                        v-model="user.userType"
                        value="RHU"
                        class="input-radio"
                        name="userType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="RHU"> RHU </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="CHO"
                        v-model="user.userType"
                        value="CHO"
                        class="input-radio"
                        name="userType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="CHO"> CHO </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="govtHosp"
                        v-model="user.userType"
                        value="govtHosp"
                        class="input-radio"
                        name="userType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="govtHosp"> Government Hospital </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="privHosp"
                        v-model="user.userType"
                        value="privHosp"
                        class="input-radio"
                        name="userType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="privHosp"> Private Hospital </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="clinic"
                        v-model="user.userType"
                        value="clinic"
                        class="input-radio"
                        name="userType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="clinic"> Clinic </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="govtLab"
                        v-model="user.userType"
                        value="govtLab"
                        class="input-radio"
                        name="userType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="govtLab"> Government Laboratory </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="privLab"
                        v-model="user.userType"
                        value="privLab"
                        class="input-radio"
                        name="userType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="privLab"> Private Laboratory </label>
                    </div>
                    <div style="display: inline-flex; align-items: center">
                      <input
                        id="airseaPort"
                        v-model="user.userType"
                        value="airseaPort"
                        class="input-radio"
                        name="userType"
                        type="radio"
                        :disabled="inputEdit()"
                      />
                      <label for="airseaPort"> Airport/Seaport </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <hr v-if="pageNum == Object.keys(formSection.formNames).length" />

          <!-- User Details (Form 2) -->  
          <form v-if="pageNum == 1 || pageNum == Object.keys(formSection.formNames).length" id="newuser1" type="submit">
            <div id="new-user-form" class="center">
              <h2 id="form-header"> {{ Object.values(formSection.formNames)[1] }} </h2>

              <div v-if="user.userType === 'BHS' || user.userType === 'RHU' || user.userType === 'CHO' || user.userType === 'govtHosp' || user.userType === 'privHosp' || user.userType === 'clinic' || user.userType === 'govtLab' || user.userType === 'privLab' || user.userType === 'airseaPort'">
                <div class="name-field">
                  <label for="druName" class="required">
                    Unit Name
                  </label>
                  <input
                    id="druName"
                    v-model="user.druName"
                    class="input-form-field"
                    type="text"
                    :disabled="inputEdit()"
                  />
                </div>

                <h2 id="form-header"> Address </h2>
                <div class="field-row" style="margin-left: 0px">
                  <div class="field">
                    <label for="userHouseStreet" class="required">
                      Street / House No.
                    </label>
                    <input
                      id="userHouseStreet"
                      v-model="user.userHouseStreet"
                      class="input-form-field"
                      type="text"
                      :disabled="inputEdit()"
                    />
                  </div>
                </div>

                <div class="field-row-straight">
                  <div class="name-field">
                    <label for="userCity" class="required"> City </label>
                    <select id="userCity" v-model="user.userCity" name="userCity" class="addUserSelect" :disabled="inputEdit()" @change="getBrgyList()">
                      <option value="Caloocan City">Caloocan</option>
                      <option value="Las Piñas City">Las Piñas</option>
                      <option value="Makati City">Makati</option>
                      <option value="Malabon City">Malabon</option>
                      <option value="Mandaluyong City">Mandaluyong</option>
                      <option value="Manila City">Manila</option>
                      <option value="Marikina City">Marikina</option>
                      <option value="Muntinlupa City">Muntinlupa</option>
                      <option value="Navotas City">Navotas</option>
                      <option value="Parañaque City">Parañaque</option>
                      <option value="Pasay City">Pasay</option>
                      <option value="Pasig City">Pasig</option>
                      <option value="Quezon City">Quezon City</option>
                      <option value="San Juan City">San Juan</option>
                      <option value="Taguig City">Taguig</option>
                      <option value="Valenzuela City">Valenzuela</option>
                    </select>
                  </div>

                  <div class="field">
                    <label for="userBrgy" class="required"> Barangay </label>
                    <select v-if="true" id="userBrgy" v-model="user.userBrgy" name="userBrgy" :disabled="inputEdit()" class="addUserSelect">
                      <!-- <option v-for="(brgy, i) in brgyList" :key = "i" :value="brgy"> 
                        {{ brgy }} 
                      </option> -->
                    </select>
                  </div>
                </div>

                <h2 id="form-header"> Unit Contact Number </h2>
                <div class="name-field">
                  <label for="userContactNo1"> Line 1 Contact No. (11-digit Mobile Number or 8-digit Tel Number) </label>
                  <input
                    id="userContactNo1"
                    v-model="user.userContactNo1"
                    class="input-form-field"
                    type="tel"
                    minlength="8"
                    maxlength="11"
                    :disabled="inputEdit()"
                  />
                </div>
                <div class="name-field">
                  <label for="userContactNo2"> Line 2 Contact No. (11-digit Mobile Number or 8-digit Tel Number) </label>
                  <input
                    id="userContactNo2"
                    v-model="user.userContactNo2"
                    class="input-form-field"
                    type="tel"
                    minlength="8"
                    maxlength="11"
                    :disabled="inputEdit()"
                  />
                </div>

                <h2 id="form-header"> Contact Person </h2>
              </div>
              
              <div class="field-row-straight">
                <div class="name-field">
                  <label for="lastName" class="required"> Last Name </label>
                  <input
                    id="lastName"
                    v-model="user.lastName"
                    class="input-form-field"
                    type="text"
                    :disabled="inputEdit()"
                  />
                </div>
                <div class="name-field">
                  <label for="firstName" class="required"> First Name </label>
                  <input
                    id="firstName"
                    v-model="user.firstName"
                    class="input-form-field"
                    type="text"
                    :disabled="inputEdit()"
                  />
                </div>
                <div class="name-field">
                  <label for="midName" class="required"> Middle Name </label>
                  <input
                    id="midName"
                    v-model="user.midName"
                    class="input-form-field"
                    type="text"
                    :disabled="inputEdit()"
                  />
                </div>
              </div>

              <div v-if="user.userType === 'pidsrStaff' || user.userType === 'fhsisStaff' || user.userType === 'idpcStaff' || user.userType === 'eohStaff' || user.userType === 'hemStaff' || user.userType === 'lhsdChief' || user.userType === 'aehmdChief' || user.userType === 'resuHead' || user.userType === 'chdDirector' || user.userType === 'techStaff'" class="name-field">
                <label for="userContactNo1" class="required"> Contact No. (11-digit Mobile Number) </label>
                <input
                  id="userContactNo1"
                  v-model="user.userContactNo1"
                  class="input-form-field"
                  type="tel"
                  minlength="11"
                  maxlength="11"
                  :disabled="inputEdit()"
                />
              </div>
            </div>
          </form>

          <hr v-if="pageNum == Object.keys(formSection.formNames).length" />

          <!-- Login Details (Form 3) -->
          <form v-if="pageNum == 2 || pageNum == Object.keys(formSection.formNames).length" id="newuser1" type="submit">
            <div id="new-user-form" class="center">
              <h2 id="form-header"> {{ Object.values(formSection.formNames)[2] }} </h2>

              <div class="name-field">
                <label for="userEmail" class="required">
                  Email
                </label>
                <input
                  id="userEmail"
                  v-model="user.userEmail"
                  class="input-form-field"
                  type="email"
                  :disabled="inputEdit()"
                />
              </div>

              <div class="name-field">
                <label for="userName" class="required">
                  Username
                </label>
                <input
                  id="userName"
                  v-model="user.userName"
                  class="input-form-field"
                  type="text"
                  :disabled="inputEdit()"
                />
              </div>

              <div class="field-row-straight">
                <div class="field">
                  <label for="userPassword" class="required"> Password </label>
                  <input
                    id="userPassword"
                    v-model="user.userPassword"
                    class="input-form-field"
                    type="password"
                    :disabled="inputEdit()"
                  />
                </div>
                <div class="name-field">
                  <label for="userRePassword" class="required"> Re-type Password </label>
                  <input
                    id="userRePassword"
                    v-model="user.userRePassword"
                    class="input-form-field"
                    type="password"
                    :disabled="inputEdit()"
                  />
                </div>
              </div>
            </div>
          </form>

        </div>
        
        <!-- Buttons -->
        <div style="margin: -10px 0 5px; float: right">
          <button v-if="pageNum == 0" class="back-button" type="button">
            <nuxt-link to="/allUsers"> Cancel </nuxt-link>
          </button>
          <button v-if="pageNum != 0" class="back-button" type="button" @click="move(pageNum - 1)">
            Back
          </button>
          <button v-if="pageNum < Object.keys(formSection.formNames).length - 1" class="next-button" type="button" @click="move(pageNum + 1)">
            Next
          </button>
          <button v-if="pageNum == Object.keys(formSection.formNames).length - 1" class="next-button" type="button" @click="move(pageNum + 1)">
            Review
          </button>
          <button v-if="pageNum == Object.keys(formSection.formNames).length" class="next-button" type="button" @click="submit()">
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  middleware: 'is-auth',
  data() {
    return {
      isOpen: true,
      pageNum: 0,
      brgyList: [],
      errors: [],
      user: {
        userID: '',
        userType: '',
        druName: '',
        lastName: '',
        firstName: '',
        midName: '',
        userHouseStreet: '',
        userBrgy: '',
        userCity: '',
        userContactNo1: '',
        userContactNo2: '',
        userEmail: '',
        userName: '',
        userPassword: '',
        userRePassword: ''
      },
      formSection: {
        formNames: {
          form1: 'User Type',
          form2: 'User Details',
          form3: 'Login Details'
        }
      }
    }
  },
  head() {
    return {
      title: 'New User'
    }
  },
  methods: {
    formColor(index) {
      if (this.isOpen) {
        if (index === this.pageNum) return 'formnum formnumcurr';
        else if (index < this.pageNum) return 'formnum formnumdone';
        else if (index > this.pageNum) return 'formnum';
      }
    },
    async submit() {
      try {
        const result = await axios.post('http://localhost:8080/api/newUser', {user: this.user});
        // eslint-disable-next-line no-console
        // console.log(result);
        // this.$router.push('/');

        if (result.status === 200) {
          // alert('Health event submitted!');
          this.$toast.success('User added!', {duration: 4000, icon: 'check_circle'});
          window.location.href = '/';
        } else {
          // eslint-disable-next-line no-console
          console.log(result);
          this.$toast.error('Something went wrong!', {duration: 4000, icon: 'error'});
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    },
    move(page) {
      this.pageNum = page;
      this.$nextTick(() => {
        if ((page === 1 || page === 3) && this.user.userBrgy != null) {
          for (let i = 0; i < this.brgyList.length; i++) {
            const option = document.createElement('option');
            option.text = this.brgyList[i];
            option.value = this.brgyList[i];
            document.getElementById('userBrgy').add(option);
            if (this.user.userBrgy === this.brgyList[i])
              document.getElementById('userBrgy').selectedIndex = i;
          }
        }
      })
    },
    inputEdit() {
      if (this.pageNum === Object.keys(this.formSection.formNames).length) {
        return true;
      } else return false;
    },
    getBrgyList() {
      const dropdown = document.getElementById('userBrgy');
      while (dropdown.firstChild) dropdown.removeChild(dropdown.firstChild);

      const defaultOption = document.createElement('option');
      defaultOption.text = 'Choose Barangay';

      dropdown.add(defaultOption);
      dropdown.selectedIndex = 0;

      axios.get('barangays.json').then(res => {
          let option;

          this.brgyList = res.data[this.user.userCity].barangay_list;

          for (let i = 0; i < this.brgyList.length; i++) {
            option = document.createElement('option');
            option.text = this.brgyList[i];
            option.value = this.brgyList[i];
            dropdown.add(option);
          }
        })
        // eslint-disable-next-line no-console
        .catch(err => console.log(err))
    },
  }
}
</script>

<style>
  body {
    font-family: 'Work Sans', sans-serif;
    font-weight: 300;
    padding: 0px;
    margin: 0px;
    background-image: none;
  }

  .case-container {
    margin: 70px 20px 5px 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: max-content;
  }

  @media only screen and (max-width: 800px) {
    .case-container {
      width: 100%;
      flex-direction: column;
      align-items: center;
      margin: 0px;
      margin-top: 85px;
    }
  }

  .form-summary {
    width: fit-content;
    height: fit-content;
    left: 23px;
    top: 97px;
    padding: 20px;
    z-index: -1;

    background: #f2f2f2;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
  }
  @media only screen and (max-width: 800px) {
    .form-summary {
      width: 100%;
      position: unset;
      height: fit-content;
      z-index: 3;
    }
  }

  .form-summary-container {
    position: fixed;
    width: fit-content;
    margin: 5px;
    padding: 5px;
  }

  @media only screen and (max-width: 800px) {
    .form-summary-container {
      width: 95%;
      position: sticky;
      margin: 0px;
    }
  }

  .disease {
    font-family: Work Sans;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 33px;
    margin: 0;
    color: #000000;
    text-align: center;
  }

  .error-message {
        color: #da4944;
        font-weight: 500;
        font-size: 12px;
  }

  .formnum {
    width: 200px;
    height: fit-content;
    margin: 5px;
    background: #ffffff;
    border: 1px solid #c4c4c4;
    box-sizing: border-box;
    border-radius: 10px;
    line-height: 30px;
    color: rgba(49, 49, 49, 0.5);
    padding: 2px;
    padding-left: 15px;
    font-family: 'Roboto', 'Open Sans', 'Helvetica Neue', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    display: flex;
  }

  /* .formnum:hover {
    color: #000000;
    font-weight: 800;
  } */

  @media only screen and (max-width: 800px) {
    .formnum {
      width: 98%;
      min-width: 200px;
    }
  }

  .formnumdone {
    background-color: #346083;
    color: white;
  }

  .formnumcurr {
    background-color: #53a262;
    color: white;
  }

  .form-section-container {
    left: 275px;
    position: relative;
    width: calc(100vw - 320px);
    /* margin: 5px; */
    padding: 5px;
  }

  @media only screen and (max-width: 800px) {
    .form-section-container {
      left: 0px;
      width: 95%;
    }
  }

  .disease-name {
    position: relative;
    top: -3px;
    z-index: 3;
  }
  @media only screen and (max-width: 800px) {
    .disease-name {
      position: relative;
      top: 0px;
    }
  }

  .form-component {
    position: relative;
    height: fit-content;
    width: 100%;
    top: -3px;

    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.25));
    background-color: #f2f2f2;
    border-radius: 15px;
    padding: 15px;
    z-index: 2;
    min-height: calc(100vh - 220px);
  }
  @media only screen and (max-width: 800px) {
    .form-component {
      position: relative;
      top: 0px;
      min-height: fit-content;
    }
  }

  .new-user-form {
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
    margin: 0 7px 6px 0px;
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

  .usertype-column {
    display: flex; 
    flex-direction: column; 
    margin-right: 50px;
  }

  @media only screen and (max-width: 950px) {
    .usertype-column {
      display: flex; 
      flex-direction: column; 
      margin-right: 0px;
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

  .halffield {
    width: 50%;
    padding: 0px 7px;
    font-size: 14px;
    display: flex;
    padding-bottom: 5px;
  }

  @media only screen and (max-width: 950px) {
    .name-field {
      width: 98%;
    }

    .halffield {
      width: 100%;
      flex-direction: column;
    }
  }

  .input-form-field,
  .addUserSelect {
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
    height: 15px;
    font-size: 16px;
    font-family: 'Work Sans', sans-serif;
    padding-right: 5px;
    padding-left: 5px;
    /* border: 1p x solid rgba(0, 0, 0, 0.25); */
    border: 1px solid #a3a3a3;
    box-sizing: border-box;
    border-radius: 9px;
    margin: 0 5px;
  }

  .input-checkbox {
    /* width: 10%; */
    height: 15px;
    font-size: 16px;
    font-family: 'Work Sans', sans-serif;
    padding-right: 5px;
    padding-left: 5px;
    /* border: 1p x solid rgba(0, 0, 0, 0.25); */
    border: 1px solid #a3a3a3;
    box-sizing: border-box;
    border-radius: 9px;
    margin: 0 5px;
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

  .userType-field {
    /* width: 15%; */
    width: 100%;
  }

  @media only screen and (max-width: 950px) {
    .half-half,
    .half-half1,
    .half-half2 {
      width: 100%;
    }
    .userType-field {
      width: 50%;
    }
  }

  .info-icon-img {
    width: 10px;
    height: 10px;
    margin: 0 5px;
  }

  .tooltip {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 40px;
    cursor: pointer;
  }

  .tooltipText {
    background-color: #fff;
    position: absolute;
    bottom: 130%;
    padding: 10px 15px;
    border-radius: 5px;
    font-size: 14px;
    opacity: 0;
    transition: all 0.5s;
  }

  .tooltip:hover .tooltipText {
    opacity: 1;
    transform: translateY(-10px);
  }

  .tooltipText::after {
    content: '';
    border-width: 5px;
    border-style: solid;
    border-color: #fff transparent transparent transparent;
    position: absolute;
    top: 100%;
    left: 40%;
    margin-left: 5%;
  }

  img:hover + .info-desc {
    display: block;
  }

  .info-desc {
    display: none;
    background-color: #fff;
    position: absolute;
    bottom: 130%;
    padding: 10px 15px;
    border-radius: 5px;
    font-size: 14px;
    opacity: 0;
    transition: all 0.5s;
  }

  .infodesc-outside {
    position: relative;
    background: #adadad;
    color: white;
    border-radius: 10px;
    font-size: 11px;
    padding: 2px 7px;
    top: -20px;
    left: -20px;
  }

  label {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
  }

  .required:after {
    content: '*';
    color: red;
  }

  h3 {
    font-size: 15px;
    font-weight: 600;
  }

  .next-button {
    width: 150px;
    height: 38px;
    max-width: 100%;
    font-size: 16px;
    margin-top: 30px;
    font-family: 'Work Sans', sans-serif;
    font-weight: 600;
    background-color: #346083;
    color: white;
    border: #346083 solid 0.75px;
  }

  .next-button:hover {
    background-color: #346083;
  }

  .back-button {
    width: 150px;
    height: 38px;
    max-width: 100%;
    font-size: 16px;
    margin-top: 30px;
    font-family: 'Work Sans', sans-serif;
    font-weight: 600;
    background-color: white;
    color: #346083;
  }

  .back-button:hover {
    border: #346083 solid 1px;
  }

  input:disabled,
  select:disabled {
    background: #dddddd;
  }

  hr {
    margin: 20px 0;
  }

  .center-center {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
  }

  .show {
    display: unset;
  }

  .hide {
    display: none;
  }

  /* COLLAPSE EME BELOW */

  .collpaseWrapper {
    margin: 15px 0;
    padding: 15px auto;
    width: 100%;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .collapseLabel {
    display: block;
    cursor: pointer;
    padding: 10px;
    /* border: 1px solid #fff; */
    border-bottom: none;
    font-weight: 400;
  }

  .collapseLabel:hover {
    background: #346083;
    opacity: 0.85;
    color: white;
    font-weight: 600;
  }

  .collapseLabel.last {
    border-bottom: 1px solid #fff;
  }

  ul ul li {
    padding: 10px;
    background: white;
  }

  .collapseInput[type='checkbox'] {
    position: absolute;
    left: -9999px;
  }

  .collapseInput[type='checkbox'] ~ ul {
    height: 0;
    transform: scaleY(0);
  }

  .collapseInput[type='checkbox']:checked ~ ul {
    height: 100%;
    transform-origin: top;
    transition: transform 0.2s ease-out;
    transform: scaleY(1);
  }

  .collapseInput[type='checkbox']:checked + label {
    background: #346083;
    opacity: 0.85;
    color: white;
    font-weight: 500;
    border-bottom: 1px solid #fff;
  }

  /* SEARCH BAR ALL BELOW */

  .searchbar {
    background: #ffffff;
    border: 1px solid #a3a3a3;
    box-sizing: border-box;
    border-radius: 40px;
    width: 100%;
    height: 40px;
    padding: 10px 20px 10px 40px;

    height: 45px;
    border: none;
    font-size: 16px;
    outline: none;
    margin-top: -1px;

    /* background-image: url(../assets/img/search.svg); */
    background-image: url(https://cdn1.iconfinder.com/data/icons/hawcons/32/698956-icon-111-search-512.png);
    background-size: 20px;
    background-repeat: no-repeat;
    background-position: 15px 12.5px;
  }

  .bar {
    margin: 0 auto;
    width: 100%;
    height: 45px;
    border-radius: 40px;
    /* border: 1px solid #dcdcdc; */

    position: relative;
  }
  .bar:hover {
    box-shadow: 1px 1px 8px 1px #dcdcdc;
  }
  .bar:focus-within {
    box-shadow: 1px 1px 8px 1px #dcdcdc;
    outline: none;
  }

  .container {
    background: white;
    border-radius: 40px;
    width: 60%;
    margin: 0 auto;
  }

  #input_img {
    position: absolute;
    bottom: 8px;
    left: 10px;
    width: 30px;
    height: 30px;
  }

  .searchResult {
    padding: 5px 10px;
    border-bottom: 1px solid lightgray;
    display: inline-flex;
    flex-direction: row;
  }

  .searchResult:hover {
    background: #eeeeee;
  }

  .searchResultInfo {
    display: inline-flex;
    flex-direction: column;
  }

  .searchPerson {
    font-size: 16px;
    margin-bottom: -5px;
    font-weight: 400;
  }

  .searchAddress {
    font-size: 12px;
    font-weight: 200;
  }

  .searchPersonIcon {
    content: url('~/assets/img/personIcon.png');
    height: 25px;
    width: 25px;
    margin: auto 5px auto 0;
  }
</style>