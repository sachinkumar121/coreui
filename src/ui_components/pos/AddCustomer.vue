<template>
    <div>
        <button class="btn btn-primary me-2" @click="() => { showAddCustomerModal = true }" :disabled="disabled">
            <Icon icon="tabler:user-plus" :height="20"/> <span class="ms-1">Customer</span>
        </button>
        <CModal
            size="lg"
            alignment="center"
            :visible="showAddCustomerModal"
            @close="() => { showAddCustomerModal = false }"
            aria-labelledby="AddCustomerLabel"
        >
            <CModalHeader
                class="text-center justify-content-center modal-filter-header"
            >
                <CModalTitle>Add Customers Details</CModalTitle>
            </CModalHeader>
            <CModalBody class="modal-filter-body">
                <CRow>
                    <CCol class="mb-3">
                        <input type="checkbox" id="purchase" class="md-check" v-model="book_without_email_phone"> <label for="purchase" class="ms-2">Purchase without phone/email</label> 
                    </CCol>
                </CRow>
                <CRow class="mb-3">
                    <CCol md="6">
                        <div class="form-group">
                            <label class="control-label"><b>First Name</b></label>
                            <v-select taggable  
                                v-model="customer" 
                                @search="onCustomerSearch" 
                                label="first_name"
                                :options="customer_option" 
                                :disabled="book_without_email_phone"
                                :create-option="opt => ({ is_new: true, first_name: opt, last_name: '' })"
                                @update:modelValue="fillCustomerDetail"
                            >
                                <template v-slot:no-options>
                                    Type to search ...
                                </template>
                                <template v-slot:option="option" >
                                    <div class="d-center">
                                    {{ getDisplayName(option) }}  
                                    </div>
                                </template>
                                <template v-slot:selected-option="option" >
                                    <div class="selected d-center">
                                    {{ option.first_name }}  
                                    </div>
                                </template>
                            </v-select>
                        </div>
                    </CCol>
                    <CCol md="6">
                        <div class="form-group">
                            <label class="control-label"><b>Last Name</b></label>
                            <input class="form-control placeholder-no-fix" type="text" v-model="customer.last_name" :disabled="book_without_email_phone">
                        </div>
                    </CCol>
                </CRow>
                <CRow class="mb-3">
                    <CCol md="6">
                        <div class="form-group">
                            <label class="control-label"><b>Email</b></label>
                            <input class="form-control placeholder-no-fix" type="email" v-model="customer.email" :disabled="book_without_email_phone">
                        </div>
                    </CCol>
                    <CCol md="6">
                        <div class="form-group">
                            <label class="control-label"><b>Phone</b></label>
                            <input class="form-control placeholder-no-fix" type="text" v-model="customer.phone" :disabled="book_without_email_phone">
                        </div>
                    </CCol>
                </CRow>
            </CModalBody>
            <CModalFooter class="d-flex justify-content-end">
                <CButton
                    type="button"
                    class="dark-link cursor-pointer fs-14" @click="() => { showAddCustomerModal = false }">
                    Cancel
                </CButton>
                <CButton class="btn btn-dark-new justify-content-center" @click="submit">Add</CButton
                >
            </CModalFooter>
        </CModal>
    </div>
</template>
<script>
import { Icon } from '@/common/Icon'
import { debounce as lodash_debounce } from 'lodash'

export default {
    name: 'AddCustomer',
    components: {
        Icon
    },
    props: {
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            showAddCustomerModal: false,
            book_without_email_phone: false,
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            customer: '',
            customer_option: [],
            debounce_time_ms: 350
        }
    },
    emits: ['onCustomerDetailsAdded'],
    methods: {
        setDebounceTime(search)
        {
            if (search.length < 5)
            {
                this.debounce_time_ms = 600; // wait longer
            }
            else
            {
                this.debounce_time_ms = 350; // Shorter wait for longer
            }
        },
        onCustomerSearch(search, loading) 
        {
            if (this.book_without_email_phone)
            {
                return;
            }
            if (search == null || search == "")
            {
                loading(false);
                return;
            }
            this.setDebounceTime(search);
            loading(true);
            this.search(loading, search, null, this);
        },
        search: lodash_debounce((loading, search_fn, search_ph, vm) => 
        {
            let qry  = {};

            if (search_ph != null)
            {
                qry.phone = search_ph;
            }

            if (search_fn != null)
            {
                qry.fl_name = search_fn;
            }

            vm.$schedsdk.getCustomerList(qry).then(res => 
            {
                if(res.status == 1)
                {
                    vm.customer_option = res.data;
                }
                else
                {
                    vm.customer_option = [{first_name: '', last_name:''}];
                }
                
                loading(false);
            }).catch((err) => {
                loading(false);
            });
        }, 400),
        getDisplayName(option)
        {
            let display_name = "";
            display_name = option.is_new ? option.first_name + " (NEW) ": option.first_name + " " + option.last_name;

            if (option.phone)
            {
                display_name += " Ph: " + option.phone
            }
            return display_name;                  
        },

        fillCustomerDetail()
        {
            if (this.book_without_email_phone)
            {
                return;
            }
            if(this.customer && typeof this.customer != "string")
            {
                this.first_name = this.customer.first_name
                this.last_name = this.customer.last_name
                this.email = this.customer.email
                this.phone = this.customer.phone;
                this.existing_customer_id = this.customer._id;
                this.getCardsOnFile(this.existing_customer_id);
            }
            if (this.customer == null)
            {
                this.customer_option = []
                this.customer = ""
            }
            
        },
        getCardsOnFile(customer_id)
        {
            if(!customer_id)
            {
                return
            }
            this.$schedsdk.list_user_cards_on_file({user_id: customer_id}).then((result)=>
            {
                if(result.status ==1)
                {
                    this.cards_on_file_list = result.data
                }
                else
                {
                    this.pm_error_message = "Error getting Cards on File: " + result.message
                }
                    
                //this.show_pay_modal = true
            }).catch((Ex) => {
                    this.pm_error_message = "Error contacting server"
                
                //this.show_pay_modal = true
            })                
        },
        submit() {
            if (!this.book_without_email_phone) {
                this.$emit('onCustomerDetailsAdded', this.customer);
            } else {
                this.$emit('onCustomerDetailsAdded', null);
            }
            this.showAddCustomerModal = false;
        }
    }
}
</script>
<style lang="scss" scoped>
.btn {
    height: 44px;
    align-items: center;
    &.btn-primary {
        background-color: var(--link-color);
        border-color: var(--link-color);
    }
}
.modal-filter-body, .modal-filter-body label {
    font-size: 16px;
}
</style>