<template>
  <div class="caseDefsBody">
    <TopNav/>
    <!--Everything below = main screen-->
    <div class="caseDefs-caseContainer">
      <!--SUMMARY: left side-->
      <div class="caseDefs-formSummary-container">
        <div class="caseDefs-formSummary">
          <button id="login-submit" type="submit" style="width: 210px; text-align: left" @click="instruct()">
            <h2 style="font-weight: 600">Diseases</h2>
          </button>

          <div v-if="isOpen" class="form-contents">
            <div v-for="(value, name, i) in formSection.diseaseNames" :key="i">
              <!-- <div v-if="i > 1" :id="name" :class="formColor(i - 1)"> -->
              <button :id="name" style="text-align: left" :class="formColor(i)" @click="move(i, value)">
                {{ i+1 }}. {{ value }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!--Everything in the right-->
      <div class="caseDefs-sectionContainer">
        <div class="caseDefs-formComponent" style="margin-top: 8px;">
          <!-- Instructions -->
          <form v-if="pageNum === -1" id="instructEdit" type="submit">
            <div id="new-user-form" class="center">
                <h2 id="form-header"> Instructions </h2>
              <div v-if="$auth.user.userType === 'lhsdChief' || $auth.user.userType === 'resuHead' || $auth.user.userType === 'chdDirector' || $auth.user.userType === 'techStaff'">
                <ul v-for="(value, name, i) in instructions" :key="i" style="displayLinline-flex">
                    <li>
                      <label :for="name" class="defsLabel caseDefsLabel">
                        {{ name }}
                      </label>
                    </li>
                     <ul>
                        <li>
                          {{ value }}
                        </li>
                     </ul>
                </ul>
              </div>
              <div v-if="$auth.user.userType !== 'lhsdChief' || $auth.user.userType !== 'resuHead' || $auth.user.userType !== 'chdDirector'">
                <ul style="displayLinline-flex">
                    <li>
                      <label class="defsLabel caseDefsLabel">
                        To see case definitions:
                      </label>
                    </li>
                     <ul>
                        <li>
                          Please click the disease name from the list seen at the left side of the screen.
                        </li>
                     </ul>
                </ul>
              </div>
            </div>
          </form>
          <!-- Form for CaseDefs -->
          <form v-if="pageNum >= 0" id="editCaseDefs" type="submit">
            <div id="edit-casedefs-form" class="center">
              <div style="display: flex; flex-direction: row; justify-content:space-between;">
                <h2 id="form-header"> {{ Object.values(formSection.diseaseNames)[pageNum] }} </h2>
                <div v-show="!isEdit" v-if="$auth.user.userType === 'lhsdChief' || $auth.user.userType === 'resuHead'
                  || $auth.user.userType === 'chdDirector' || $auth.user.userType === 'techStaff'"> 
                  <button id="instructButton" class="instruct-button" type="button" @click="instruct()">
                    Instructions
                  </button>
                  <button id="editButton" class="defsButton" type="button" @click="editable()">
                    Edit
                  </button>
                </div>
              </div>
              <div>
                <div>
                  <ul v-for="(value, name, i) in diseaseDefs" :key="i" style="displayLinline-flex">
                    <li>
                      <label :for="name" class="defsLabel caseDefsLabel">
                        {{ name }}
                      </label>
                      <ul>
                        <li>
                          <textarea
                          :id="name"
                          v-model="diseaseDefs[name]"
                          class="defsTextArea"
                          name="newDefs"
                          type="text"
                          rows="4" cols="200"
                          wrap="soft"
                          :disabled="!isEdit">
                          </textarea>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
              <div v-show="isEdit" id="forSaveButton" style="margin-top: 10px; display: flex; justify-content: flex-end;">
                <button id="saveButton" class="instruct-button" type="button" @click="update('Cancel')">
                    Cancel
                </button>
                <button id="saveButton" class="defsButton" type="button" @click="update('Save')">
                    Save
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>

    <div class="caseDefs-statusHistory">
      <h2 style="border-bottom: gray solid; width: fit-content; padding: 0 7px 0 5px;">Case Definition History</h2>
      <dataTable
        :options="tableOptions"
        :datavalues="defsHistory"
        :casetype="'patient'"
      />
    </div>

  </div>
</template>

<script>
import dataTable from './dataTable.vue'
const axios = require('axios');

export default {
  components: {
    dataTable,
  },
  middleware: 'is-auth',
  data() {
    return {
      isOpen: true,
      isEdit: false,
      pageNum: -1,
      formSection: {
        diseaseNames: {},
        diseaseIDs: {}
      },
      allCaseDefs: {},
      diseaseDefs: {},
      OldDiseaseDefs: [],
      instructions: {
        'Step 1': 'Click on a disease in the list on the left side to see its case definitions.',
        'Step 2': 'Click on the "Edit" button if you wish to edit the case definitions of the disease.',
        'Step 3': 'Click on a case definition to start editing it.',
        'Step 4': 'Lastly, click "Save" to save your changes.',
        'Step 5': 'In case there are issues, please contact the IT Staff.'
      },
      tableOptions: {
        tableName: 'defs',
        columns: [
          {
            title: 'Date',
            key: 'changeDate',
            type: 'text',
            dateFormat: true,
            currentFormat: 'YYYY-MM-DD',
            expectFormat: 'DD MMM YYYY',
            // sortable: true,
          },
          {
            title: 'Disease',
            key: 'disease',
            type: 'text',
            source: 'defs',
            uniqueField: 'id',
          },
          {
            title: 'Case Level',
            key: 'caseLevel',
            type: 'text',
            source: 'defs',
            uniqueField: 'id',
          },
          {
            title: 'From',
            key: 'from',
            type: 'text',
            source: 'defs',
            uniqueField: 'id',
          },
          {
            title: 'To',
            key: 'to',
            type: 'text',
            source: 'defs',
            uniqueField: 'id',
          },
          {
            title: 'Modified By',
            key: 'modifiedBy',
            type: 'text',
            source: 'defs',
            uniqueField: 'id',
          },
        ],
        // source: 'http://demo.datatable/api/users',
        search: true,
      },
      defsHistory: [
        {
          changeDate: '2020-10-10',
          disease: 'Dengue',
          caseLevel: 'Suspected',
          from: 'a',
          to: 'a',
          modifiedBy: 'a',
        },
        {
          changeDate: '2020-10-10',
          disease: 'Measles',
          caseLevel: 'Clinically Compatible Measles',
          from: 'a',
          to: 'a',
          modifiedBy: 'a',
        },
      ],
    }
  },
  async fetch() {
    // getting all diseases to print in left side
    const diseases = (await axios.get('http://localhost:8080/api/getAllDiseases')).data;
    
    // setting diseaseNames
    const tempA = {};
      const tempB = {};
    for (let i = 0; i < diseases.length; i++) {
      tempA[i] = diseases[i].diseaseName;
      tempB[i] = diseases[i].diseaseID;
    }
    this.formSection.diseaseNames = tempA;
    this.formSection.diseaseIDs = tempB;

    // putting all caseDefs in one object
    let defs;
    for (let i = 0; i < diseases.length; i++) {
      defs = (await axios.get('http://localhost:8080/api/getCaseDefs?diseaseID=' + diseases[i].diseaseID)).data;
      this.allCaseDefs[this.formSection.diseaseNames[i]] = defs;
    }

    // setting initial disease (first disease)
    for (let i = 0; i < this.allCaseDefs[this.formSection.diseaseNames[0]].length; i++) {
      this.diseaseDefs[this.allCaseDefs[this.formSection.diseaseNames[0]][i].class] = this.allCaseDefs[this.formSection.diseaseNames[0]][i].definition;
    }

    // getting all case defs history
    // const history = (await axios.get('http://localhost:8080/api/getAllDiseases')).data;

  },
  head() {
    return {
      title: 'Case Definitions'
    }
  },
  methods: {
    formColor(index) {
      if (this.isOpen) {
        if (index === this.pageNum) return 'formnum formnumcurr';
        else return 'formnum';
      }
    },
    move(page, value) {
      if (!this.isEdit) {
        this.pageNum = page;

        // getting the caseDefs of clicked disease
        const tempo = this.allCaseDefs[value];
        
        // deleting values of initial diseaseDefs
        for (const m in this.diseaseDefs) delete this.diseaseDefs[m];
        
        // re-populating diseaseDefs with newly clicked disease
        for (let j = 0; j < tempo.length; j++) {
          this.diseaseDefs[tempo[j].class] = tempo[j].definition;
        }

        // eslint-disable-next-line no-console
        // console.log(this.diseaseDefs);
        // this.NewDiseaseDefs = this.diseaseDefs;
        for (let i=0; i<Object.values(this.diseaseDefs).length ; i++) {
          this.OldDiseaseDefs[i] = this.diseaseDefs[Object.keys(this.diseaseDefs)[i]];
        }
      }
    },
    editable() {
      this.isEdit = true;
      /*
      const elements = document.getElementsByClassName('defsTextArea');
      for (let i = 0; i < elements.length; i++) {
        elements[i].readOnly = false;
        elements[i].style.border = "3px solid #c4c4c4";
      }
      document.getElementById("editButton").style.visibility = "hidden";
      document.getElementById("forSaveButton").style.visibility = "visible";
      const leftButtons = document.getElementsByClassName('formnum');
      for (let i = 0; i < leftButtons.length; i++) {
        leftButtons[i].disabled = true;
      }
      */
    },
    update(action) {
      if (action === 'Cancel') {
        for (let i=0; i<Object.values(this.diseaseDefs).length ; i++) {
          this.diseaseDefs[Object.keys(this.diseaseDefs)[i]] = this.OldDiseaseDefs[i];
        }
        this.isEdit = false;
      }
      else if (action==='Save') {
        for (let i=0; i<Object.values(this.diseaseDefs).length ; i++) {
          this.OldDiseaseDefs[i] = this.diseaseDefs[Object.keys(this.diseaseDefs)[i]];
        }
        this.save();
        this.isEdit = false;
      }
    },
    async save() {
      /*
      const elements = document.getElementsByClassName('defsTextArea');
      for (let i = 0; i < elements.length; i++) {
        elements[i].readOnly = true;
        elements[i].style.border = "none";
      }
      document.getElementById("editButton").style.visibility = "visible";
      document.getElementById("forSaveButton").style.visibility = "hidden";
      const leftButtons = document.getElementsByClassName('formnum');
      for (let i = 0; i < leftButtons.length; i++) {
        leftButtons[i].disabled = false;
      }
      */

      const result = await axios.post('http://localhost:8080/api/editDiseaseDef', {
          diseaseDefs: this.diseaseDefs,
          diseaseID: this.formSection.diseaseIDs[this.pageNum],
          userID: this.$auth.user.userID
      });
      
      // eslint-disable-next-line no-console
      console.log(result);

      if (result.status === 200) {
        // alert('Health event submitted!');
        this.$toast.success('Edit successful!', {duration: 4000, icon: 'check_circle'});
      } else {
        // eslint-disable-next-line no-console
        console.log(result);
        this.$toast.error('Something went wrong!', {duration: 4000, icon: 'error'});
      }


      // TODO: add notif send to all drus that a case definition was edited
      // notif message: The case definitions of <disease> have been updated.
      // notif type: updateNotif
      // receiver: all DRUs
      // redirectTo: addCIF/CRF url of the disease that was updated

    },
    instruct() {
      this.pageNum = -1;
    }
  }
}
</script>

<style>
  h2 {
    color: #346083;
    font-size: 25px;
    font-weight: 600;
  }

  .caseDefsBody {
    font-family: 'Work Sans', sans-serif;
    font-weight: 300;
    padding: 0px;
    margin: 0px;
    background-image: none;
    display: flex;
    flex-direction: column;
  }

  .caseDefs-caseContainer {
    margin: 70px 20px 5px 20px;
    display: flex;
    flex-direction: row;
    /* flex-wrap: nowrap; */
    width: max-content;
  }

  @media only screen and (max-width: 800px) {
    .caseDefs-caseContainer {
      width: 100%;
      flex-direction: column;
      align-items: center;
      margin: 0px;
      margin-top: 85px;
    }
  }

  .caseDefs-formSummary {
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
    .caseDefs-formSummary {
      width: 100%;
      position: unset;
      height: fit-content;
      z-index: 3;
    }
  }

  .caseDefs-formSummary-container {
    position: sticky;
    width: fit-content;
    margin: 5px;
    padding: 5px;
  }

  @media only screen and (max-width: 800px) {
    .caseDefs-formSummary-container {
      width: 95%;
      position: sticky;
      margin: 0px;
    }
  }

  .defsTextArea {
    max-width: 100%;
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
    margin-bottom: 6px;
    /* display: flex; */
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

  .caseDefs-sectionContainer {
    left: 275px;
    /* position: relative; */
    width: calc(100vw - 320px);
    /* margin: 5px; */
    padding: 5px;
  }

  @media only screen and (max-width: 800px) {
    .caseDefs-sectionContainer {
      left: 0px;
      width: 95%;
    }
  }

  .caseDefs-formComponent {
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
    .caseDefs-formComponent {
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

  .caseDefsLabel {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
  }

  .required:after {
    content: '*';
    color: red;
  }

  .caseDefs-statusHistory {
    margin-top:10px;
    margin-bottom:30px;
  }

  .defsButton {
    width: 100px;
    height: 30px;
    max-width: 100%;
    font-size: 14px;
    margin-top: 0px;
    font-family: 'Work Sans', sans-serif;
    font-weight: 600;
    background-color: #346083;
    color: white;
    border: #346083 solid 0.75px;
  }

  .next-button:hover {
    background-color: #346083;
  }

  .instruct-button {
    width: 100px;
    height: 30px;
    max-width: 100%;
    font-size: 14px;
    margin-top: 0px;
    font-family: 'Work Sans', sans-serif;
    font-weight: 600;
    background-color: #f2f2f2;
    color: #346083;
  }

  .instruct-button:hover {
    border: #346083 solid 1px;
  }

  input:disabled,
  select:disabled {
    background: #dddddd;
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

  .defsLabel {
    display: block;
    /* cursor: pointer; */
    padding: 10px;
    /* border: 1px solid #fff; */
    border-bottom: none;
    font-weight: 400;
    margin-top: 5px;
    background: #346083;
    opacity: 0.85;
    color: white;
    font-weight: 600;
  }

  .defsLabel.last {
    border-bottom: 1px solid #fff;
  }

  ul ul li {
    padding: 10px;
    background: white;
  }

</style>