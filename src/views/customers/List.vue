<template>
    <div class="pt-2">
        <FilterSection>
            <template v-slot:search-input>
                <label class="control-label"><b>Search Name/Phone </b></label>
                <input
                    v-model="search_email_phone"
                    class="form-control placeholder-no-fix"
                    @keyup="getCustomersList()"
                    type="text"
                />
            </template>
            <template v-slot:actions>
                <div class="mt-3 mt-md-0">
                    <button
                        class="btn btn-success float-end mt-sm-0 mt-3"
                        @click="$router.push('/customers/add')"
                        >
                        Add One Customer
                    </button>
                   
                    <button
                        class="btn btn-primary float-end mt-sm-0 mt-3 me-lg-2 me-2"
                        @click="$router.push('/customers/bulk-add')"
                    >
                        Add Multiple Customers
                    </button>
                </div>
            </template>
        </FilterSection>
        <div class="row">
            <div class="col-md-2">
                <label class="control-label"><b></b></label>
            </div>
        </div>

        <div class="">
            <table class="table table-customer-list table-bordered">
                <thead>
                    <tr>
                        <th width="100px">Picture</th>
                        <th>Name</th>
                        <th>Organization</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody v-if="list.length">
                    <tr v-for="item in list" :key="item._id">
                        <td data-label="Picture">
                            <div class="image cursor-pointer position-relative" style="float: left !important" @dragover.prevent="null" @dragleave.prevent="null" @drop="(e) => updateCustomerImage(e, item)"
                            @click="showCustomerImage(item)"
                            >
                                <Loading 
                                 v-if="uploading && item._id == customer._id"   
                                    :width="45"
                                    :height="45"
                                    class="position-absolute image-loader"
                                />
                                <img v-if="item.profile_pic" class="img-circle" style="height: 60px;width: 60px;border-radius: 50%;" :src="item.profile_pic" />
                                <img v-else class="img-circle" style="height: 60px;width: 60px;border-radius: 50%;" src="/img/abstract-user-flat-4.svg" />
                            </div>
                        </td>
                        <td data-label="Name">
                            <div>{{ item.first_name }} {{ item.last_name }}</div>
                            <div>{{ item.email }}</div>
                            <div>{{ getPhoneFormatted(item.phone, country_code)}}</div>
                            <div v-if="item.online_booking_is_blocked">
                                <a href="" @click.prevent="showBlockedMessage()"
                                    >Online Blocked</a>
                            </div>
                            <div v-if="checkUserNotes(item)">
                                <a
                                    href=""
                                    @click.prevent="showInternalNote(item)"
                                    >User Notes</a
                                ></div>

                            <div v-if="item.prefers_text_messages == 2">
                                
                                <a
                                    href=""
                                    @click.prevent="showSMSBlockedMessage(item)"
                                >
                                    SMS Blocked</a
                                >
                            </div>
                        </td>
                        <td data-label="Organization">
                            {{ item.source_business_name }}<br />{{
                                getUsertype(item.source_user_type)
                            }}
                        </td>

                        <td data-label="Action" class="action_column">
                            <button
                                type="button"
                                @click="
                                    $router.push(
                                        '/customers/detail/' + item._id,
                                    )
                                "
                                class="btn btn-primary btn-sm"
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                @click="
                                    $router.push(
                                        '/customers/messages/' + item._id,
                                    )
                                "
                                class="btn btn-info btn-sm"
                            >
                                Messages
                            </button>
                            <!-- <button type="button"
                         @click="$router.push('/customers/plain_messages/' + item._id)"
                         class="btn btn-success btn-sm" >Plain Messages</button>  -->
                            <button
                                type="button"
                                @click="
                                    $router.push(
                                        '/invoices/customer/' + item._id,
                                    )
                                "
                                class="btn btn-success btn-sm"
                            >
                                Invoices
                            </button>
                            <button
                                type="button"
                                @click="$router.push('/customer/pictures/' + item._id)"
                                class="btn btn-success btn-sm"
                            >
                                Picture Book
                            </button>
                            <button
                                v-if="hint_has_required_paperworks == true"
                                type="button"
                                @click="
                                    $router.push(
                                        '/customers/list_paperwork/' + item._id,
                                    )
                                "
                                class="btn btn-secondary btn-sm"
                            >
                                Paperwork
                            </button>
                            <button
                                type="button"
                                @click="resetPassword(item._id)"
                                class="btn btn-secondary btn-sm"
                            >
                                Reset Password
                            </button>

                            <button
                                type="button"
                                @click="
                                    $router.push(
                                        '/customers/purchased_packages/' +
                                            item._id,
                                    )
                                "
                                class="btn btn-warning btn-sm"
                            >
                                Purchased Packages
                            </button>
                            <button
                                type="button"
                                @click="
                                    $router.push(
                                        '/customer_purchase/create/' + item._id,
                                    )
                                "
                                class="btn btn-success btn-sm"
                            >
                                Quick Sale
                            </button>
                            <button
                                type="button"
                                @click="showManageCof(item)"
                                class="btn btn-success btn-sm"
                            >
                                Payment Methods On file
                            </button>
                            <button
                                type="button"
                                @click="deleteUser(item)"
                                class="btn btn-danger btn-sm"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="10" class="text-center empty_resul">
                            <div class="py-5">
                                <img
                                    src="/img/no-result.svg"
                                    alt=""
                                    class="img-empty"
                                />
                                <p class="h5 mt-4 d-block fw-normal">
                                    No Records found
                                </p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <Pagination
            class="mt-2"
            v-if="list.length"
            :size="'sm'"
            :ariaLabel="'Customers results pages'"
            :activePage.sync="page"
            :pages="pageCount"
            @update:activePage="setPage"
        />
        <ManageCof
            :key="cof_key"
            v-if="show_manage_cof"
            :customer_id="cof_user_id"
        ></ManageCof>
        <CModal :visible="resetPwdModal">
            <CModalHeader>
                <CModalTitle>Reset Password</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div class="row">
                    <div class="col-md-4">New Password</div>
                    <div class="col-md-4">
                        <input
                            class="form-control placeholder-no-fix"
                            type="text"
                            v-model="random_string"
                        />
                    </div>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton @click="resetPwdModal = false" color="danger"
                    >Cancel</CButton
                >
                <CButton
                    @click="changePassword(user_id, random_string)"
                    color="success"
                    >Confirm</CButton
                >
            </CModalFooter>
        </CModal>
        <CModal :visible="showDone">
            <CModalHeader>
                <CModalTitle>Done Reset Password</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div class="row">
                    <div class="col-md-8">
                        {{ done_response }}
                    </div>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton @click="showDone = false" color="info">Ok</CButton>
            </CModalFooter>
        </CModal>
        <ImagePreviewModal 
            :title="`${customer?.first_name} ${customer?.last_name}`"
            :visible="showImagePreview"
            @on-update-image="(file) => uploadCustomerImage(file)"
            @on-remove-image="removeCustomerImage"
            @on-close="resetImgPreviewModal"
            :url="customer_image_url"
            :resource="customer"
        />
    </div>
</template>

<script>
import FilterSection from '@/ui_components/FilterSection'
import {Icon} from '@/common/Icon'
import Pagination from '@/common/Pagination'
import PhoneNumber from 'awesome-phonenumber'
import {debounce as lodash_debounce} from 'lodash'
import ManageCof from '../customers/ManageCof.vue'
import '../../assets/css/common.css'
import ImagePreviewModal from '@/common/ImagePreviewModal.vue';
import Loading from '@/common/svg/Loading'
import {Payterm} from '@silverskysoft/capacitorpayterm';

export default {
    name: 'List',
    components: {Pagination, ManageCof, FilterSection, ImagePreviewModal, Loading, Icon},
    data() {
        return {
            customer: null,
            uploading: false,
            showImagePreview: false,
            customer_image_url: null,
            search_email_phone: '',
            list: [],
            page: 1,
            pageCount: 1,
            country_code: 'US',
            hint_has_required_paperworks:
                this.$store.state.business_settings
                    .hint_has_required_paperworks,
            done_response: '',
            showDone: false,
            show_manage_cof: false,
            cof_user_id: '',
            cof_key: '',
            resetPwdModal: false,
            random_string: '',
            user_id: '',
        }
    },
    created() {
        ;(this.country_code = 'US'), //this.$store.state.business_settings.business_time_zone
            this.getCustomersList()
    },
    methods: {
        resetImgPreviewModal() {
            this.showImagePreview = false;
            this.customer_image_url = null;
            this.customer = null;
        },
        showCustomerImage(customer) {
            this.customer = customer;
            this.showImagePreview = true;
            this.customer_image_url = customer.profile_pic || "/img/abstract-user-flat-4.svg";
        },
        async uploadCustomerImage(file) {
            let customer = this.customer;
            if (file) {
                let imageUploadData = new FormData;
                imageUploadData.append('file', file);
    
                try {
                    const fileUploadRes = await this.$schedsdk.upload_media('customer_photo', imageUploadData, customer._id);
                    if (fileUploadRes.status) {
                        delete customer.updated_at;
                        customer.profile_pic = fileUploadRes.location;
                        await this.$schedsdk.update_customer(customer);
                        this.resetImgPreviewModal();
                    }
                } catch(error) {
                    console.log(error)
                } finally {
                    this.uploading = false;
                    this.customer = null;
                }
            }
        },
        async removeCustomerImage() {
            let customer = this.customer;
            let url = customer.profile_pic;
            if (customer && url) {
                try {
                    const fileRemoveRes = await this.$schedsdk.remove_media({
                        url
                    });
                    if (fileRemoveRes.status) {
                        delete customer.updated_at;
                        customer.profile_pic = null;
                        await this.$schedsdk.update_customer(customer);
                        this.resetImgPreviewModal();
                    }
                } catch(error) {
                    console.log(error)
                }
            } else {
                this.resetImgPreviewModal();
            }
        },
        async updateCustomerImage(e, customer) {
            this.uploading = true;
            this.customer = customer;
            e.preventDefault();
            let file = e.dataTransfer.files[0];
            this.uploadCustomerImage(file);
        },
        getCustomersList() {
            this.debGetList(this)
            console.log(Payterm.echo({value: "abcdefghijklmnopqr"}), "=====")
        },
        debGetList: lodash_debounce((context) => {
            context.$schedsdk
                .get_customer_list({
                    get_profile_info_only: 1,
                    count_per_page: 25,
                    name: context.search_email_phone,
                    page_no: context.page,
                    skip_user_statistics: true,
                })
                .then((result) => {
                    context.list = result.data
                    context.pageCount = result.total_pages
                })
        }, 400),

        setPage(pageNo) {
            this.page = pageNo
            this.getCustomersList()
        },
        getPhoneFormatted(phone, country_code = 'US') {
            if (phone == null) {
                return null
            }
            var pn = new PhoneNumber(phone, {regionCode: country_code})
            if (pn.isValid()) {
                return pn.getNumber('national')
            }
            return phone
        },
        getUsertype(type) {
            switch (type) {
                case 5:
                    return 'Customer'
                case 2:
                    return 'Owner'
                case 3:
                    return 'Front desk'
                case 4:
                    return 'Employee'
            }
            return type
        },
        showBlockedMessage() {
            confirm(
                'User is blocked from making online booking. Edit user to change that status',
            )
        },
        showSMSBlockedMessage(item) {
            if (
                !item.text_sms_contact_disallow_reason ||
                item.text_sms_contact_disallow_reason == ''
            ) {
                confirm('No reason specified')
            } else {
                confirm(item.text_sms_contact_disallow_reason)
            }
        },
        checkUserNotes(item) {
            if (item.service_notes_1 && item.service_notes_1.length > 0) {
                return true
            }
            item.service_notes_1 = ''
            if (item.service_notes_2 && item.service_notes_2.length > 0) {
                return true
            }
            item.service_notes_2 = ''
            if (item.internal_notes && item.internal_notes.length > 0) {
                return true
            }
            return false
        },
        showInternalNote(item) {
            confirm(
                'Service Notes: ' +
                    item.service_notes_1 +
                    '\n' +
                    item.service_notes_2 +
                    '\n' +
                    'Internal: ' +
                    (item.internal_notes !== undefined
                        ? item.internal_notes
                        : ''),
            )
        },
        showManageCof(item) {
            this.cof_user_id = item._id
            this.cof_key = this.cof_user_id
            this.show_manage_cof = true
        },
        deleteUser(item) {
            if (item.type == 2) {
                let cr = confirm(
                    'Owner user cannot be deleted. Edit and user role before deleting',
                )
                return
            }
            let cr = confirm(
                'Are you sure to delete ' +
                    item.first_name +
                    '? All attached bookings will be canceled. This operation is irreversible.',
            )
            if (cr) {
                this.$schedsdk
                    .delete_user({_id: item._id})
                    .then((result) => {
                        this.showDone = true
                        if (result.status == 1) {
                            this.done_response = result.message
                            this.getCustomersList()
                        } else {
                            this.done_response = result.message || 'Error'
                        }
                    })
                    .catch((err) => {
                        this.showDone = true
                        console.log(err)
                        this.done_response =
                            err.data && err.data.message
                                ? err.data.message
                                : 'Error'
                    })
            }
        },
        rndStr(len) {
            let text = ' '
            let chars = 'abcdefghijklmnopqrstuvwxyz'

            for (let i = 0; i < len; i++) {
                text += chars.charAt(Math.floor(Math.random() * chars.length))
            }

            return text
        },
        resetPassword(user_id) {
            this.user_id = user_id
            this.random_string = this.rndStr(8)
            this.resetPwdModal = true
        },
        changePassword(user_id, random_string) {
            // console.log(user_id)
            // console.log(random_string.trim());
            let data = {
                user_id: user_id,
                password: random_string.trim(),
            }
            this.resetPwdModal = false
            this.$schedsdk
                .resetPassword(data)
                .then((result) => {
                    this.showDone = true
                    if (result.status == 1) {
                        this.done_response = result.message
                    } else {
                        this.done_response = result.message || 'Error'
                    }
                })
                .catch((err) => {
                    this.showDone = true
                    console.log(err)
                    this.done_response =
                        err.data && err.data.message
                            ? err.data.message
                            : 'Error'
                })
        },
    },
}
</script>
<style scoped>
.action_column button {
    margin: 3px;
}
.image-loader {
    top: 15px;
    left: 15px;
    z-index: 2;
}
.image-loader + img {
  opacity: .1;
}
</style>
<style lang="scss" scoped>
.dropstart {
    .dropdown-toggle::before  {
        display: none;
    }
}
.action_column {
    .btn-group {
        position: static;
    }
    // .btn.btn-primary {
    //     color: var(--text-primary-color);
    //     background: transparent;
    //     border: 0;
    // }
    // .btn:focus {
    //     box-shadow: none;
    // }
    // .dropdown-toggle::after {
    //     display: none;
    // }
    // .dropdown-menu {
    //     border: 1px solid #f0f0f0;
    //     box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1);
    //     border-radius: 8px;
    //     z-index: 9999;
    //     max-width: 175px;
    //     .dropdown-item {
    //         padding: 0.4rem 1rem;
    //     }
    // }
}
.dropdown-menu a {
    font-size: 14px;
    color: #000;
    white-space: normal;
}
.dropdown-menu {
    a {
        &:hover {
            color: #6d57e4;
            text-decoration: none;
            background: #f9f8ff;
        }
        svg {
            margin-right: 5px;
        }
    }
    &.show {
        max-height: 254px;
        overflow-y: auto;
    }
}
.dropdown-item {
    div {
        position: relative;
        padding-left: 33px;
        svg {
            position: absolute;
            left: 0;
            top: 0;
        }
    }
}

table.table-customer-list td {
   vertical-align: middle;
}
table.table-customer-list td[data-label="Name"] div {
    width :100%;
}
@media (min-width: 1024px) and (max-width: 1199.98px) {
    .table-customer-list {
        &.loading {
            td {
                padding-left: 0;
            }
        }
        tbody:not(.loading) {
            td {
                &.service-td {
                    width: 148px;
                }
                &:nth-child(1) {
                    svg {
                        width: 16px;
                    }
                }
            }
        }
    }
}
@media screen and (min-width: 1200px) {
    .wrap-body {
        padding: 0 !important;
    }
}
@media screen and (max-width: 991.98px) {
    table.table-customer-list {
        border-color: #c9c9c9;
        caption {
            font-size: 1.3em;
        }
        thead {
            border: none;
            clip: rect(0 0 0 0);
            height: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
        }
        tr {
            border-bottom: 3px solid #ddd;
            display: block;
            margin-bottom: 0.625em;
        }
        td {
            border-bottom: 1px solid #ddd;
            flex-wrap: wrap;
            width: 100%;
            font-size: 15px;
            text-align: left;
            padding-left: 160px;
            position: relative;
            display: flex;
            gap: 5px;
            .ml-mobile {
                margin-left: 2px;
            }
        }
        .c-sub-text {
            display: inline-flex;
            align-items: center;
            font-size: 14px;
            u, span {
                font-size: 14px;
            }
        }
    }
    
    table tbody:not(.no-result-tbody) td::before {
        content: attr(data-label);
        float: left;
        font-weight: bold;
        position: absolute;
        left: 0;
        //background: #F9F8FF;
        min-width: 147px;
        top: 0;
        padding: 9px 15px;
        height: 100%;
        border-color: #e7e7e7;
        border-collapse: collapse;
        border-style: solid;
        border-width: 0 1px;
    }

    table td:last-child {
        border-bottom: 0;
    }
}
@media(max-width:500px) {
    tbody.no-result-tbody td.empty_resul {
        padding-left:0px;
    }
}
</style>
