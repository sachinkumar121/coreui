<template>
  <div>
    <Alerts 
      :alertData="alertData" 
      :show="show"
      @alertClosed="show = 0"
      v-if="show_alert" 
    />
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <!-- <h5><slot name="heading" /></h5> -->
            <h5>{{heading}}</h5>
          </CCardHeader>
          <CCardBody>
            <CForm>
          
              <CRow>
                <CCol sm="4">
                  <label>Choose a file: </label>
                </CCol>
                <CCol sm="4">
                  <input type="file" id="file" ref="file" @change="handleFileUpload()"/>
                </CCol>
              </CRow>
              <CRow>
                <CCol sm="4">
                  <br>
                </CCol>
                <CCol sm="4">
                  <br>
                </CCol>
              </CRow>
              <CRow>
                <CCol sm="4">
                  <label>
                    Existing record handling 
                    <CIcon class="me-1" name="cil-CommentSquare"  
                      v-c-popover="{
                      header: 'Info',
                      trigger: 'click',
                      content: 'How to handle existing records in database that match the records being uploaded.<br>Update Existing = It will update existing record with one in the CSV<br>Do not change = It will leave existing record unchanged',
                      }"/>
                    : 
                  </label>
                </CCol>
                <CCol sm="8">
                  <CRow>
                    <CCol>
                      <input type="radio" id="update" name="conflict_resolution"
                        value="1" v-model="conflict_resolution">
                      <label for="update" class="ms-2"> Update existing with new one being imported</label> 
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <input type="radio" id="dontchange" name="conflict_resolution" 
                        value="2" v-model="conflict_resolution">
                      <label for="dontchange" class="ms-2"> Do not change existing record</label>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <CRow>
                <CCol sm="4">
                  <label>Instructions: </label>
                </CCol>
                <CCol sm="4">
                  Choose a CSV/Text file. 
                  In preview, map each column to a data field.
                   Click submit.
                  Wait for job to finish.
                </CCol>
                

                </CRow>
            </CForm>
          </CCardBody>
          <CCardFooter v-if="csvData.length">
            <div class="my-1">
             
              <div class="table-responsive">
                <table class="table table-bordered table-csv">
                  <thead>
                    <tr class="text-center"> 
                      <td :colspan="csvData[0].length">
                        <h6 class="my-1">Preview data & map file column to fields</h6>
                        <label class="control-label ml-2"><b>Does the file have headers?</b>
                  </label>      
                  <input  
                   type="checkbox"
                   class="form-check-input"
                   v-model="user_selected_header_in_first_row" /> <label>Yes</label>

                      </td>
                      
                
                 
               
                    </tr>
                    
                    <tr>
                      <th v-for="(header, index) in csvData[0]" :key="index">
                        <div class="d-flex align-items-center position-relative">
                          <select v-model="columnMappings[index]" class="form-control">
                            <option value="" selected="selected">Select field for column {{ index+1 }} </option>
                            <option v-for="column in column_headers" :value="column.column_name" :key="column.column_name">{{ column.label }} {{column.is_min_required ? "*" : null}}</option>
                            <option value="_do_not_include_column_">Do not include</option>
                          </select>
                          <CPopover v-if="showDescription(columnMappings[index])" title="Info" :content="showDescription(columnMappings[index])" placement="top">
                          <template #toggler="{ id, on }">
                            <Icon icon="tabler:info-circle" :height="22" :stroke-width="1.5" :aria-describedby="id" v-on="on" />
                          </template>
                        </CPopover>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>

                    <tr v-for="(row, rowIndex) in csvData" :key="rowIndex">
                      <td v-for="(cell, cellIndex) in row" :key="cellIndex" style="color:grey;">{{ cell }}</td>
                    </tr>
                    <tr class="text-center"> <td :colspan="csvData[0].length">
                      <h6 class="my-1">Above is sample preview of the CSV file</h6></td>
                    </tr>
                  </tbody>
                </table>
                <!-- <div class="d-flex justify-content-end mb-2">
                  <button @click="submitMappings" class="btn btn-undefined d-inline-flex align-items-center btn btn-success">Submit</button>
                </div> -->
              </div>
            </div>
          </CCardFooter>
          <CCardFooter class="d-flex justify-content-between">
             <div>&nbsp;</div>
              <ButtonLoader
                class="d-inline-flex align-items-center btn btn-success" :disabled="button_disabled"
                :class="{'active-svg': loading}"
                @click="submitMappings"
                color="primary"
            >
              <CIcon name="cil-check-circle" class="me-1" />
              Submit
            </ButtonLoader>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
    <CModal 
      :visible="visibleInvalidValuesModal"
      @close="() => { visibleInvalidValuesModal = false }"
      aria-labelledby="LiveDemoExampleLabel"
    >
      <CModalHeader>
        <CModalTitle id="LiveDemoExampleLabel">Some invalid values found in CSV</CModalTitle>
      </CModalHeader>
      <CModalBody>
        There are some invalid values for {{Array.from(this.invalid_values_columns).join(', ')}} field. 
        Please check your mapping selection. Do you still want to continue?
        <span v-if="!user_selected_header_in_first_row">Please check if file has headers</span>
      </CModalBody>
      <CModalFooter>
        <CButton color="success" @click="() => { visibleInvalidValuesModal = false }">
          No, I'll fix
        </CButton>
        <CButton color="primary" @click="() => { visibleInvalidValuesModal = false; uploadCSV(); }">Ignore Errors & Continue</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>
<script>
import appHelper from '@/helpers/app_helper'
import Papa from 'papaparse';
import { uniq, difference } from 'lodash'
import Alerts from '@/views/Alerts'
import {Icon} from '@/common/Icon'
import utils_lib from '@/helpers/utils_lib';
const valueChecker = {
  "string": val => typeof val == "string",
  "numeric": val => utils_lib.isNumeric(val),
  "email": val => utils_lib.ValidateEmail(val), 
  "phone": val => utils_lib.isValidPhoneNumber(val), 
  "date": val => utils_lib.isValidDate(val, 'M/D/YYYY H:mm')  
}
import Loading from '@/common/svg/Loading'
import ButtonLoader from '@/common/ButtonLoader.vue'

export default {
  name: 'CSVFileUploader',
  components: {
    Alerts,
    Icon,
    Loading,
    ButtonLoader
  },
  props: {
    sample_file_url: {
      type: String,
      required: true
    },
    heading: {
      type: String,
      required: true
    },
    file_usage: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      file: '',
      input_filename: '',
      conflict_resolution: '2',
      button_disabled: false,
      upload_completed: false,
      show_alert: false,
      show: 0,
      alertData: {message: '', type: ''},

      csvData: [],
      columnMappings: [],
      fields: [],
      hasHeader: false,
      column_headers: [],
      invalid_values_columns: new Set(),
      visibleInvalidValuesModal: false,
      user_selected_header_in_first_row: false,
      loading: false,
    };
  },
  async mounted() {
    const column_headers = await this.$schedsdk.get_column_headers(this.file_usage);
    this.column_headers = column_headers.data;
  },
  methods: {
    showDescription(mappedRow) {
      return this.column_headers.find(c => c.column_name == mappedRow)?.description || null;
    },
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
      if (this.file) {
        this.parseAndPreviewCSV();
      } else {
        this.csvData = [];
      }
    },
    validateValues() {
      let that = this
      let counter = 0
      const validValues = this.removeHeaderRow().map(row => {
        const mappedRow = {};
        counter++;      
        row.forEach((cell, index) => {
         
          if (this.columnMappings[index]) {
            let column_header = this.column_headers.find(ch => ch.column_name == this.columnMappings[index])
            if (column_header) {
              mappedRow[this.columnMappings[index]] = valueChecker[column_header.type](cell);
              if (!valueChecker[column_header.type](cell)) {
                this.invalid_values_columns.add(this.columnMappings[index])
              }
            }
          }
        });
        return mappedRow;
      });
    },
    parseAndPreviewCSV() {
      Papa.parse(this.file, {
        preview: 6,
        skipEmptyLines: true,
        complete: (result) => {
          this.csvData = result.data;
          this.hasHeader = this.checkForHeader(this.csvData);
          this.initializeColumnMappings();
          
        }
      });
    },
    checkForHeader(data) {
      if (data.length < 2) return false; // Not enough data to determine
      const firstRow = data[0];
      const secondRow = data[1];
      return firstRow.every((value, index) => {
        return isNaN(value) && !secondRow.includes(value);
      });

      // Check if the first row has more text-like entries and the second row has more structured data
      // const isFirstRowText = firstRow.every(cell => isNaN(cell));
      // const isSecondRowNumeric = secondRow.some(cell => !isNaN(cell));

      // return isFirstRowText && isSecondRowNumeric;
    },
    removeHeaderRow() {
      return ( this.user_selected_header_in_first_row )? this.csvData.slice(1) : this.csvData;
    },
    initializeColumnMappings() {
      if (this.hasHeader) {
        this.columnMappings = Object.values(this.csvData[0]).map(c => this.column_headers.map(c => c.column_name).includes(c) ? c : '');
      } else {
        this.columnMappings = this.csvData[0].map(() => '');
      }
    },
    submitMappings() {
      this.invalid_values_columns.clear();
      if (!this.file) {
        this.show_alert = true;
        this.show = 1;
        this.alertData = {
          message: "Please choose a file to upload.",
          type: 'danger'
        }
        return false;
      }
      if(this.validateMappings()) {
        this.validateValues();
        const isValuesValid = this.invalid_values_columns.size == 0;
        if (!isValuesValid) {
          this.visibleInvalidValuesModal = true;
          return false;
        }
        this.uploadCSV();
      }
    },
    validateMappings() {
      const mappingsArray = Object.values(this.columnMappings).filter(Boolean).filter(v => v != '_do_not_include_column_');
      const requiredColumns = this.column_headers.filter(c => c.is_min_required).map(c => c.column_name);
      const duplicateMappings = uniq(appHelper.getDuplicateElements(mappingsArray));
      const isAllElementMapped = appHelper.allEleExistInAnotherArray(requiredColumns, mappingsArray);
      let message = null;

      if (!mappingsArray.length && requiredColumns) {
        message = `${requiredColumns.map(e => utils_lib.toTitleCase(e)).join(', ')} are required fields. You will need one of the file's columns to these fields.`;
      } else if(duplicateMappings.length) {
        message = `You have duplicate mapping for ${duplicateMappings.map(e => utils_lib.toTitleCase(e)).join(', ')} fields.`;
      } else if(!isAllElementMapped) {
        const pendingMappings = difference(requiredColumns, mappingsArray)
        message = `${requiredColumns.map(e => utils_lib.toTitleCase(e)).join(', ')} are required fields. You will need one of the file's columns to these fields.`;
      }
      if (message) {
        this.show_alert = true;
        this.show = 1;
        this.alertData = {
          message,
          type: 'danger'
        }
        this.scrollToTop();
        return false;
      }
      this.resetAlert();
      return true;
    },
    scrollToTop() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    resetAlert() {
      this.show_alert = false;
      this.show = 0;
      this.alertData = {
        message: '',
        type: ''
      }
    },
    uploadCSV() {
      this.loading = true;
      this.button_disabled = true;
      let formData = new FormData();
      formData.append('file', this.file);
      formData.append('business_id', this.$store.state.user_data.business_id);
      formData.append('conflict_resolution', this.conflict_resolution);
      formData.append('file_usage', this.file_usage);
      formData.append('column_mapping', this.columnMappings);
      formData.append('user_selected_header_in_first_row', this.user_selected_header_in_first_row);

      this.$schedsdk.file_import_csv(formData).then((result) => {
        this.button_disabled = false;
        this.upload_completed = true;
        if (result.status == 1) {
          this.$router.push({
            name: 'Job Process Status',
            params: {
              rec_id: result.job_process_id
            }
          });
        } else {
          this.alertData = {
            message: result.message,
            type: 'danger'
          }
          this.show_alert = true;
          this.show = 1;
          this.scrollToTop();
          this.loading = false;
        }
      }).catch((err) => {
        this.button_disabled = false;
        this.upload_completed = true;
        this.alertData = {
          message: err.message,
          type: 'danger'
        }
        this.show_alert = true;
        this.show = 1;
        this.loading = false;
      });
    },
  }
}
</script>
<style lang="scss">
.table-csv {
  svg {
    color: var(--text-gray);
    &:focus {
      outline: 0;
    }
  }
}
</style>
