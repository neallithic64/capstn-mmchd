<template>
  <div id="viewCases">
    <!--Top Bar of the screen-->
    <TopNav />
    <div ref="content" class="viewcases-container">
      <div class="exportButtons">
        <h1 class="pageHeader"> MALARIA Program Accomplishment Report</h1>
        <div v-show="!isPrint & !isEdit" class="actionButtons" style="display: flex;margin-top: 5px;">
          <ul v-show="year==='2022' || year===2022" class="actionButton">
          <img
            src="~/assets/img/pen.png"
            class="printButton"
            @click="isEdit=true"
          />
          </ul>
          <ul class="actionButton">
          <img
            src="~/assets/img/pdf.png"
            class="printButton"
            @click="downloadPDF"
          />
          </ul>
          <ul class="actionButton">
            <img src="~/assets/img/csv.png" 
            class="printButton"
            @click="csvExport(yearData)"
          />
          </ul>
        </div>
        <div v-show="isEdit" style="margin: -10px 10 5px; margin-left: auto;text-align: -webkit-right;">
          <button class="cancel-button" type="button" @click="edit('Cancel')">
            Cancel </button>
          <button class="save-button" type="button" @click="edit('Save')">
            Save </button>
        </div>
      </div>
      <div class="viewcases-component">
      <div class="datatable">
        <div style="display: flex; justify-content: space-between; margin-top:-5px;">
          <h3 id="form-header" style="padding: 10px 0;">DRU: ABC</h3>
          <select v-model="year" class="input-year" style="float: right;" @change="countMonth()">
            <option value=2022>2022</option>
            <option value=2021>2021</option>
            <option value=2020>2020</option>
            <option value=2019>2019</option>
            <option value=2018>2018</option>
          </select>
        </div>
        <table id="datatable">
          <thead style="background: lightgray;">
            <th style="width: 250px;">
              <span> </span>
            </th>
            <th v-for="column in columns" :key="column" style="padding:1px; text-align: -webkit-center; background: center;">
              <tr style="display:table-caption; border: none; background: lightgray;">
                <td style="text-align: center; border: none;">{{ column }}</td>
              </tr>
              <tr style="border: none; background: lightgray;">
                  <td style="border-bottom: none; border-left: none;">M</td>
                  <td style="border-bottom: none; border-right: none;">F</td>
              </tr>
            </th>
          </thead>
          <tbody>
            <template v-if="yearData.length > 0">
              <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
                <td>
                  <span v-if="rows[rowIndex].space"> &nbsp;&nbsp; </span>
                  <span style="text-align: center">
                    {{ rows[rowIndex].title }}
                  </span>
                </td>
                <td v-for="(cols, colIndex) in columns" :key="colIndex" style="text-align: -webkit-center; padding:0px">
                  <span v-if=" (rows[rowIndex].key==='populationTotal') && (year===2022 || year==='2022') && month===colIndex+1">
                    <input v-model="totalPop" class="input-edit" type="number" :class="editInput()" :disabled="!isEdit"/>
                  </span>
                  <span v-else-if=" (rows[rowIndex].key==='populationRisk') && (year===2022 || year==='2022') && month===colIndex+1">
                    <input v-model="totalPopRisk" class="input-edit" type="number" :class="editInput()" :disabled="!isEdit"/>
                  </span>
                  <span v-else-if=" (rows[rowIndex].key==='populationTotal' || rows[rowIndex].key==='populationRisk') && month>colIndex">
                    {{yearData[colIndex][rows[rowIndex].key]}}
                  </span>
                  <tr v-else-if="month>colIndex" style="border: none;">
                    <td v-for="(val, index) in yearData[colIndex][rows[rowIndex].key]" :key="index"
                    style="border-bottom: none; border-top: none;" :style="borderSide(index)">{{val}}</td>
                  </tr>
                </td>
              </tr>
            </template>
            <template v-else>
              <div style="text-align: center">No data found.</div>
            </template>
          </tbody>
        </table>
        <div style="margin-top:5px;">
          Last updated: <b> {{dayTime}}</b>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script src="https://code.jquery.com/jquery-1.12.3.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/0.9.0rc1/jspdf.min.js"></script>

<script>
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
const axios = require('axios');

export default {
  middleware: 'is-auth',
  header: {
    title: 'Disease Program Accomplishment',
  },
  compute: {},
  data() {
    return {
      month: '',
      totalPop:'',
      totalPopRisk:'',
      isEdit: false,
      isPrint: false,
      dayTime: '',
      year: 2022,
      // columns: ['1','2','3','4','5','6','7','8','9','10','11','12'],
      columns: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      rows: [
        {
          title: 'Total Population',
          key: 'populationTotal',
          space: false,
        },
        {
          title: 'Total Population at Risk',
          key: 'populationRisk',
          space: false,
        },
        {
          title: 'Total Confirmed Cases',
          key: 'confimedCasesTotal',
          space: false,
        },
        {
          title: 'Total Confimed Cases (>=5)',
          key: 'confimedCases5above',
          space: true,
        },
        {
          title: 'Total Confimed Cases (<5)',
          key: 'confimedCases5below',
          space: true,
        },
        {
          title: 'Total Confimed Cases (Pregnant)',
          key: 'confimedCasesPregnant',
          space: true,
        },
        {
          title: 'Malaria Lab Confirmed',
          key: 'MalariaLabConfirmed',
          space: false,
        },
        {
          title: '   Falciparum',
          key: 'MalariaLabConfirmedFalciparum',
          space: true,
        },
        {
          title: '   Vivax',
          key: 'MalariaLabConfirmedVivax',
          space: true,
        },
        {
          title: '   Ovale',
          key: 'MalariaLabConfirmedOvale',
          space: true,
        },
        {
          title: '   Malariae',
          key: 'MalariaLabConfirmedMalariae',
          space: true,
        },
        {
          title: 'Confirmed Cases Method',
          key: 'confirmedCasesMethod',
          space: false,
        },
        {
          title: '   Slide',
          key: 'confirmedCasesMethodSlide',
          space: true,
        },
        {
          title: '   RDT',
          key: 'confirmedCasesMethodRDT',
          space: true,
        },
        {
          title: 'Total LLIN given',
          key: 'totalLLIN',
          space: false,
        },
        {
          title: 'Total Malaria Deaths',
          key: 'totalMalariaDeaths',
          space: false,
        },
      ],
      yearData: [],
      dataSets: {
        y2022:[
          {
            populationTotal: 122,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
        ],
        y2021:[
          {
            populationTotal: 121,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
        ],
        y2020:[
          {
            populationTotal: 120,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
        ],
        y2019:[
          {
            populationTotal: 109,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
        ],
        y2018:[
          {
            populationTotal: 118,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
          {
            populationTotal: 123,
            populationRisk: 43,
            confimedCasesTotal: [4,3],
              confimedCases5above: [0,3],
              confimedCases5below: [0,3],
              confimedCasesPregnant: [0,3],
            MalariaLabConfirmed: [0,3],
              MalariaLabConfirmedFalciparum: [0,3],
              MalariaLabConfirmedVivax: [0,3],
              MalariaLabConfirmedOvale: [0,3],
              MalariaLabConfirmedMalariae: [0,3],
            confirmedCasesMethod: [0,3],
              confirmedCasesMethodSlide: [0,3],
              confirmedCasesMethodRDT: [0,3],
            totalLLIN: [1,3],
            totalMalariaDeaths: [2,3],
          },
        ],
      },
    }
  },
  head() {
    return {
      title: 'Malaria Accomplishment Report'
    }
  },
  mounted() {
    const today = new Date();
    const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Aug', 'Oct', 'Nov', 'Dec'];
    const hour = today.getHours()>9 ? today.getHours() : '0'+today.getHours()
    const mins = today.getMinutes()>9 ? today.getMinutes() : '0'+today.getMinutes()
    this.dayTime = monthsList[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear()
                     + ' ' + hour + ':' + mins;
    
    this.countMonth();

    this.totalPop = this.dataSets.y2022[this.month][this.rows[0].key] * 1;
    this.totalPopRisk = this.dataSets.y2022[this.month][this.rows[1].key] * 1;

  },
  methods: {
    countMonth() {
      if (this.year=== 2022 || this.year=== '2022') this.month = new Date().getMonth()+1;
      else this.month = 12;

      const ytext = 'y'+this.year.toString();
      switch(ytext) {
        case 'y2022': this.yearData = this.dataSets.y2022; break;
        case 'y2021': this.yearData = this.dataSets.y2021; break;
        case 'y2020': this.yearData = this.dataSets.y2020; break;
        case 'y2019': this.yearData = this.dataSets.y2019; break;
        case 'y2018': this.yearData = this.dataSets.y2018; break;
      }
    },
    borderSide(val) {
      if(val) return 'border-right: none;';
      else return 'border-left: none;';
    },
    editInput() {
      if (this.isEdit) return 'editable';
    },
    edit(action) {
      if (action==='Cancel') {
        this.totalPop = this.dataSets.y2022[this.month][this.rows[0].key];
        this.totalPopRisk = this.dataSets.y2022[this.month][this.rows[1].key];
        this.isEdit = false;
      }
      if (action === 'Save') {
        //
        this.dataSets.y2022[this.month][this.rows[0].key] = this.totalPop;
        this.dataSets.y2022[this.month][this.rows[1].key] = this.totalPopRisk;
        this.isEdit = false;
      }
    },
    downloadPDF() {
      // this.isPrint = !this.isPrint

      let pWidth = 595.28 // 595.28 is the width of a4
      let srcWidth = this.$refs.content.scrollWidth
      let margin = 12 // narrow margin - 1.27 cm (36);
      let scale = (pWidth - margin * 2) / srcWidth

      var doc = new jsPDF('p', 'pt', 'A4')
      window.html2canvas = html2canvas

      doc.html(this.$refs.content, {
        x: margin,
        y: margin,
        html2canvas: {
          scale: scale,
        },
        callback: function () {
          window.open(doc.output('bloburl'))
        },
      })

      // doc.save('test.pdf')
      console.log(this.$refs.content)
      setTimeout(() => (this.isPrint = !this.isPrint), 3000)
    },
    csvExport(arrData) {
      let csvContent = "data:text/csv;charset=utf-8,";
      // let header = this.getCols();
      let header = Object.keys(arrData[0]).join(",");
      csvContent += [
        header,
        ...arrData.map(item => Object.values(item).join(","))
      ]
        .join("\n")
        .replace(/(^\[)|(\]$)/gm, "");

      const data = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", data);
      link.setAttribute("download", this.caseTab.toUpperCase()+".csv");
      link.click();
    },
  },
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

.pageHeader {
  font-weight: 800;
  font-size: 32px;
  color: #346083;
}

.viewcases-container {
  padding: 80px 20px 5px 20px;
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .viewcases-ontainer {
    width: 100%;
    align-items: center;
    margin: 0px;
  }
}

.viewcases-section-container {
  /* left: 275px; */
  /* position: relative; */
  /* width: calc(100vw - 320px); */
  /* margin: 5px; */
  width: 100%;
  padding: 5px;
  margin: 10px;
}

@media only screen and (max-width: 800px) {
  .viewcases-section-container {
    width: 95%;
  }
}

.viewcases-component {
  /* position: relative;
  display: inline-flex;
  flex-direction: row; */
  height: fit-content;
  width: 100%;

  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.25));
  background-color: #f2f2f2;
  border-radius: 10px;
  padding: 15px;
  padding-bottom: 20px;
  margin-bottom: 40px;
}
@media only screen and (max-width: 800px) {
  .viewcases-component {
    position: relative;
    top: 0px;
    min-height: fit-content;
  }
}

#form-header {
    text-align: left;
    padding-left: 5px;
    margin-bottom: 5px;
    font-weight: 600;
    font-size: 20px;
    background-color: #008d41;
    color: transparent;
    text-shadow: 1px 1px, -1px -1px rgb(0 0 0 / 25%);
    -webkit-background-clip: text;
}

table {
  /* display: block; */
  display: table;
  overflow-x: auto;
  white-space: nowrap;
}

.allDisplay {
  display: block;
}

@media only screen and (max-width: 1000px) {
  table {
    display: block;
  }
}

.printButton {
  width: 30px;
  height: 30px;
  /* margin: 0 5px; */
  margin: -5px 5px 5px;
}

.exportButtons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.save-button {
  width: 150px;
  height: 38px;
  max-width: 100%;
  font-size: 16px;
  font-family: 'Work Sans', sans-serif;
  font-weight: 600;
  background-color: #346083;
  color: white;
  border: #346083 solid 0.75px;
}

.save-button:hover {
  background-color: #346083;
}

.cancel-button {
  width: 150px;
  height: 38px;
  max-width: 100%;
  font-size: 16px;
  font-family: 'Work Sans', sans-serif;
  font-weight: 600;
  background-color: white;
  color: #346083;
}

.cancel-button:hover {
  border: #346083 solid 1px;
}

.input-year,
select {
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

.actionButton {
    list-style: none;
    margin: 0;
    padding: 0;
    margin-top: 5px;
}

.input-edit {
  text-align: center;
  background: none;
  max-width: 75px;
}

.editable {
  background: white;
}

</style>

