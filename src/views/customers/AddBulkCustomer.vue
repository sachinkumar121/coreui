<template>
    <div>
        <div class="row controls-div" v-if="true">
            <!-- <div class="settings-text">Field Options</div> 

            <br /> -->
            <br />
            <div class="col-md-6">
                <label class="control-label">
                    <b>Instructions</b> </label
                ><br />
                <ul>
                    <li>
                        If you don't need to fill all rows, leave the row empty
                    </li>
                    <li>First or Last name is required &amp; Phone or Email is required</li>
                    <li>
                        Internal notes is for your review later.
                    </li>
                </ul>
            </div>
        </div>
        <br />

        <div class="row">
            <div class="col-md-12">
                <div class="table-resposnive">
                    <table class="table table-bordered table-add-customer">
                        <thead>
                            <tr>
                                <th class="th-width">First Name</th>
                                <th class="th-width">Last Name</th>
                                <th class="th-width">Phone</th>
                                <th class="th-width">Email</th>
                                <th class="th-width">Internal Notes</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(item, index) in customers"
                                :key="index"
                            >
                                <td class="d-flex">
                                    
                                        <span>{{ index + 1 }}. &nbsp;</span><input
                                            type="text"
                                            size="15"
                                            class="form-control"
                                            v-model="item.first_name"
                                        />
                                    
                                    <p class="error-msg" v-if="show_server_error && item._message
                                    ">{{item._message}}</p>
                                    
                                    <p class="error-msg ps-3" v-if="formErrors[index]?.first_name"
                                        >{{ formErrors[index].first_name }}</p>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        size="15"
                                        v-model="item.last_name"
                                        class="form-control"
                                    />
                                    <p class="error-msg" v-if="formErrors[index]?.last_name"> 
                                        {{ formErrors[index].last_name }}
                                    </p>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        v-model="item.phone"
                                        class="form-control"
                                    />
                                    <p class="error-msg" v-if="formErrors[index]?.phone"> 
                                        {{ formErrors[index].phone }}
                                    </p>
                                </td>
                                <td>
                                    <input
                                        type="email"
                                        v-model="item.email"
                                        class="form-control"
                                    />
                                    <p class="error-msg" v-if="formErrors[index]?.email"> 
                                        {{ formErrors[index].email }}
                                    </p>
                                </td>

                                <td>
                                    <input
                                        type="text"
                                        v-model="item.internal_notes"
                                        class="form-control"
                                    />
                                </td>

                                <td align="right">
                                    <button
                                        @click.prevent="
                                            removeRowForSelectableTimes(index)
                                        "
                                        class="btn btn-danger"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                            <tr align="left">
                                <td colspan="12">
                                    <button style="float:left"
                                        @click.prevent="
                                            addRowForSelectableTimes(3)
                                        "
                                        class="btn btn-primary float-end"
                                    >
                                        Add 3 Rows
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-- end table of rows and prices -->

        <div class="row">
            <div class="col-6 col-md-6">
                <button class="btn btn-info" @click="$router.go(-1)">
                    Back
                </button>
            </div>
            <div class="col-6 col-md-6 d-flex justify-content-end">
                <button class="btn btn-success" @click="addBulkCustomers">
                    Submit
                </button>
            </div>
        </div>
        <div class="row" v-if="show_network_error">
            <div class="col-md-6">
                <Alerts
                    :alertData="errorData"
                    :show="show_network_error"
                    @alertClosed="show_network_error = false"
                />
            </div>
        </div>
        <BulkOperationPopup 
            :visible="show_bulk_operation_popup"
            :redirect_to="'/customers'"
            v-bind="bulk_operation_popup"
            @bulk-popup:close="onErrorPopupClose"
        />
    </div>
</template>
<script>
import { helpers, required, minValue, minLength, maxLength, email} from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import Alerts from '@/views/Alerts';
import BulkOperationPopup from '@/common/BulkOperationPopup';

export default {
    name: 'AddBulkCustomer',
    components: {
        Alerts,
        BulkOperationPopup
    },
    setup: () => ({v$: useVuelidate()}),
    data() {
        return ({
            customers: [],
            formErrors: [],
            isFormSubmit: false,
            show_bulk_operation_popup: false,
            show_server_error: false,
            bulk_operation_popup: {
                status: 'error',
                number_of_records: 0
            },

            show_network_error: false,
            errorData: {
                message: '',
                type: ''
            },
        })
    },
    /* validations: {
        customers: {
            $each: helpers.forEach({
                first_name: {
                    required,
                    minLength: minLength(3)
                },
                last_name: {
                    required,
                },
                email: {
                    required,
                    email
                },
                phone: {
                    required,
                }
            })
        }
    }, */
    created() {
        this.addRowForSelectableTimes(5);
    },
    methods: {
        validateField(fieldVal, rules = [], params = {}, messages = {}) {
            let msg = null;
            fieldVal = typeof(fieldVal) == 'string' ? fieldVal.trim() : fieldVal;
            const emailRegex = /^(?:[A-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]{2,}(?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
            if (rules.length) {
                if (rules.includes('email')) {
                    if (!emailRegex.test(fieldVal)) {
                        msg = messages['email'] || "Value is not a valid email address";
                    }
                }

                if (rules.includes('minLength')) {
                    if (fieldVal.length < params.min) {
                        msg = messages['minLength'] || `This field should be at least ${params.min} characters long`;
                    }
                }
                if (rules.includes('required')) {
                    if ((typeof(fieldVal) == 'string' && fieldVal.length == 0) || !fieldVal) {
                        msg = messages['required'] || `Value is required`;
                    }
                } 
            }
            return msg;
        },

        applyValidation(data) {
            let that = this;
            that.formErrors = [];
            data.forEach((d, index) => {
                if (d.first_name || d.last_name || d.email || d.phone) {
                    let formError = {};
                    for (const property in d) {
                        switch(property)
                        {
                            case 'first_name':
                            if (!d.last_name) {
                                        formError[property] = this.validateField(d[property],
                                                 ['required', 'minLength'], { min: 2 });
                        }
                                break;
                            case 'last_name':
                                if (!d.first_name) {
                                        formError[property] = this.validateField(d[property],
                                                 ['required', 'minLength'], { min: 2 });                    }
                                break;
                            case 'email':
                            if (!d.phone) {
                                formError[property] = this.validateField(d[property], ['required', 'email'], {},{'required': "Either the Phone or Email field is required."});
                            }
                                    break;
                            case 'phone':
                            if (!d.email) {
                                formError[property] = this.validateField(d[property], ['required'], {}, {'required': "Either the phone or Email field is required."});
                            }
                              break;
                        }
                        
                    }
                    that.formErrors.splice(index, 0, formError);
                }
            });
        },

        onErrorPopupClose() {
            this.show_bulk_operation_popup = false;
            this.show_server_error = true;
        },
        
        addRowForSelectableTimes(rows) {
            for (let i = 0; i < rows; i++) {
                this.customers.push({
                    _id: 0,
                    _message: null,
                    first_name: '',
                    last_name: '',
                    phone: '',
                    email: '',
                    internal_notes: '',
                    type: 5 // customer
                });
            }
        },

        removeRowForSelectableTimes(index) {
            if (index < this.customers.length) {
                let name = this.customers[index]?.first_name || this.customers[index]?.last_name;
                if (
                    name.length > 0
                ) {
                    let conf = confirm(
                        'Confirm row removal for ' +
                        name +
                            '?',
                    );
                    if (conf == false) {
                        return;
                    }
                }
            }
            this.customers.splice(index, 1);
            this.formErrors.splice(index, 1);
        },

        addBulkCustomers(e) {
            e.preventDefault();
            let that = this;

            that.show_server_error = false;
            that.isFormSubmit = true;
            that.show_network_error = false;
            that.errorData = {
                message: '',
                type: ''
            };

            let data = that.customers.filter(d => (d.first_name || d.last_name) && (d.email || d.phone));
            
            this.applyValidation(that.customers);

            let isFormCorrect = this.formErrors.every(o => Object.keys(o).every(x => !o[x]));

            if (!this.formErrors.length) {
                that.errorData.message = "Please add atleast one customer."
                that.errorData.type = 'danger';
                that.show_network_error = true;
                return false;
            }

            if (isFormCorrect) {
                this.$schedsdk
                    .addBulkUser({ data })
                    .then((result) => {
                        if (result.status == 1) {
                            this.bulk_operation_popup = {
                                status: 'success',
                                number_of_records: result.data.length,
                            };
                        } else {
                            result.data.forEach((d, index) => {
                                that.customers[index]._id = d.data ? d.data._id : 0;
                                that.customers[index]._message = !d.data ? d.msg : null;
                            });
                            that.customers = that.customers.filter(c => !c._id);
                            this.bulk_operation_popup = {
                                status: 'error',
                                number_of_records: result.data.filter(d => d.status === 1).length
                            };
                        }
                        this.show_bulk_operation_popup = true;
                    })
                    .catch((error) => {
                        that.errorData.message = 'Error from server: ' + error.data.message;
                        that.errorData.type = 'danger';
                        that.show_network_error = true;
                    });
            }
        },
    }
}
</script>
<style scoped>
.invalid {
    border: 1px solid red;
    /* background-color: lightcoral; */
    color: red;
}
.error-msg {
    margin-top:3px;
    color: red;
    font-size: 11px;
    margin-bottom:0;
    line-height:14px;
}
.table-add-customer td:not(:first-child) input {
    width:100%;
}
.table-add-customer tr td:first-child input {
    width: calc(100% - 24px);
}
.table-add-customer th:last-child,
.table-add-customer td:last-child {
    text-align: center;
}
.success-msg {
    color: green;
}
.th-width {
    width: 18%;
}

</style>