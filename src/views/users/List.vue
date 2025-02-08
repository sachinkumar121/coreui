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
                <button
                    class="btn btn-success float-end ms-2"
                    @click="$router.push('/users/add')"
                >
                    Add New User
                </button>
                &nbsp; &nbsp;
                <button
                    class="btn btn-primary float-end"
                    @click="$router.push('/users/bulk-add')"
                >
                    Add Multiple Users
                </button>
            </template>
        </FilterSection>
        <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Picture</th>
                        <th width="20%">Name</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody v-if="list.length">
                    <tr v-for="item in list" :key="item._id">
                        <td>
                            <div class="image cursor-pointer position-relative" style="float: left !important" @dragover.prevent="null" @dragleave.prevent="null" @drop="(e) => updateUserImage(e, item)"
                            @click="showUserImage(item)"
                            >
                                <Loading 
                                 v-if="uploading && item._id == user._id"   
                                    :width="45"
                                    :height="45"
                                    class="position-absolute image-loader"
                                />
                                <img v-if="item.profile_pic" class="img-circle" style="height: 80px;width: 80px;border-radius: 50%;" :src="item.profile_pic" />
                                <img v-else class="img-circle" style="height: 80px;width: 80px;border-radius: 50%;" src="/img/abstract-user-flat-4.svg" />
                            </div>
                        </td>

                        <td>
                            <b>{{ item.first_name }} {{ item.last_name }}</b
                            ><br />
                            {{item.user_bio}}
                            <!-- <small
                                >Display Order:
                                {{ item.provider_display_order }}</small
                            ><br /> -->
                            {{ item.email }}<br />
                            {{ getPhoneFormatted(item.phone, country_code)
                            }}<br />
                            <small
                                >Show in Calendar:
                                {{
                                    item.provider_show_in_internal_calendar ===
                                    false
                                        ? 'No'
                                        : 'Yes'
                                }}</small
                            ><br />
                        </td>
                        <td>{{ getRoleName(item.type) }}</td>
                        <td class="action_column">
                            <button
                                type="button"
                                @click="
                                    $router.push('/users/detail/' + item._id)
                                "
                                class="btn btn-primary btn-sm"
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                @click="
                                    $router.push(
                                        '/settings/set_business_hours/user/' +
                                            item._id,
                                    )
                                "
                                class="btn btn-success btn-sm"
                            >
                                Edit Schedule
                            </button>
                            <button
                                type="button"
                                @click="
                                    $router.push('/users/scheduled_time_off/' + item._id)
                                "
                                class="btn btn-primary btn-sm"
                            >
                                Time Off
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
                          

                            <button
                                type="button"
                                @click="resetPassword(item._id)"
                                class="btn btn-secondary btn-sm"
                            >
                                Reset Password
                            </button>
                            &nbsp;
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
                        <td colspan="10" class="text-center">
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
            :ariaLabel="'Users results pages'"
            :activePage.sync="page"
            :pages="pageCount"
            @update:activePage="setPage"
        />

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
                <CButton @click="closeShowdone" color="info">Ok</CButton>
            </CModalFooter>
        </CModal>
        <ImagePreviewModal 
            :title="`${user?.first_name} ${user?.last_name}`"
            :visible="showImagePreview"
            @on-update-image="(file) => uploadUserImage(file)"
            @on-remove-image="removeUserImage"
            @on-close="resetImgPreviewModal"
            :url="user_image_url"
            :resource="user"
        />
    </div>
</template>

<script>
import Pagination from '@/common/Pagination'
import PhoneNumber from 'awesome-phonenumber'
import {debounce as lodash_debounce} from 'lodash'
import '../../assets/css/common.css'
import AppHelper from '../../helpers/app_helper'
import FilterSection from '@/ui_components/FilterSection'
import ImagePreviewModal from '@/common/ImagePreviewModal.vue';
import Loading from '@/common/svg/Loading'

export default {
    name: 'List',
    components: {Pagination, FilterSection, ImagePreviewModal, Loading},
    data() {
        return {
            user: null,
            uploading: false,
            showImagePreview: false,
            user_image_url: null,
            search_email_phone: '',
            list: [],
            page: 1,
            pageCount: 1,
            country_code: 'US',
            hint_has_required_paperworks:
                this.$store.state.business_settings
                    .hint_has_required_paperworks,
            resetPwdModal: false,
            random_string: '',
            user_id: '',
            done_response: '',
            showDone: false,
        }
    },
    created() {
        this.country_code = 'US' //this.$store.state.business_settings.business_time_zone
        if (
            !AppHelper.isRoleOwnerOrReception(this.$store.state) &&
            !AppHelper.isRoleAdmin(this.$store.state)
        ) {
            this.$router.push({name: 'Dashboard'})
            return
        }
        this.getCustomersList()
        this.showDone = false
    },
    methods: {
        resetImgPreviewModal() {
            this.showImagePreview = false;
            this.user_image_url = null;
            this.user = null;
        },
        showUserImage(user) {
            this.user = user;
            this.showImagePreview = true;
            this.user_image_url = user.profile_pic || "/img/abstract-user-flat-4.svg";
        },
        async uploadUserImage(file) {
            let user = this.user;
            if (file) {
                let imageUploadData = new FormData;
                imageUploadData.append('file', file);
    
                try {
                    const fileUploadRes = await this.$schedsdk.upload_media('profile_photo', imageUploadData, user._id);
                    if (fileUploadRes.status) {
                        delete user.updated_at;
                        user.profile_pic = fileUploadRes.location;
                        const response = await this.$schedsdk.edit_user(user);

                        if (response.status == 1) {
                            if (this.$store.state.user_data._id == user._id) {
                                await this.$store.commit('UPDATE_USER_DATA', {key: 'profile_pic', value: response.data.profile_pic});
                            }
                        }
                        this.resetImgPreviewModal();
                    }
                } catch(error) {
                    console.log(error)
                } finally {
                    this.uploading = false;
                    this.user = null;
                }
            }
        },
        async removeUserImage() {
            let user = this.user;
            let url = user.profile_pic;
            if (user && url) {
                try {
                    const fileRemoveRes = await this.$schedsdk.remove_media({
                        url
                    });
                    if (fileRemoveRes.status) {
                        delete user.updated_at;
                        user.profile_pic = null;
                        const response = await this.$schedsdk.edit_user(user);

                        if (response.status == 1) {
                            if (this.$store.state.user_data._id == user._id) {
                                await this.$store.commit('UPDATE_USER_DATA', {key: 'profile_pic', value: response.data.profile_pic});
                            }
                        }
                        this.resetImgPreviewModal();
                    }
                } catch(error) {
                    console.log(error)
                }
            } else {
                this.resetImgPreviewModal();
            }
        },
        async updateUserImage(e, user) {
            this.uploading = true;
            this.user = user;
            e.preventDefault();
            let file = e.dataTransfer.files[0];
            this.uploadUserImage(file);
        },
        getRoleName(i) {
            return AppHelper.getRoleName(i)
        },
        getCustomersList() {
            this.debGetList(this)
        },
        debGetList: lodash_debounce((context) => {
            context.$schedsdk
                .get_users_list({
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
        deleteUser(item) {
            if (item.type <= 2) {
                let cr = confirm(
                    'This is a Business Owner user and cannot be deleted directly. Edit and change user role before deleting',
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
        closeShowdone() {
            this.showDone = false
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