<template>
	<div>
		<div class="table-responsive">
			<table class="table table-bordered table-hover">
				<thead>
					<tr>
						<th>Invoice Number</th>
						<th>PO Order Number</th>
						<th>Total Cost</th>
						<th>Customer Name</th>
						<th>Customer Email</th>
						<th>Status</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody v-if="list.length" >
					<tr v-for="item in list" :key="item._id">
                        <td>{{ item.invoice_number }}</td>
                        <td>{{ item.po_order_number }}</td>
                        <td>{{currencySymbol}}{{ item.total_cost }}</td>
                        <td>{{ item.user_info.first_name }} {{ item.user_info.last_name }}</td>
                        <td>{{ item.user_info.email }}</td>
                        <td>{{getLabelStr('classSignupStatusType', item.status)}}</td>
						<td class="action_column">
                            <button class="btn btn-primary btn-sm" @click="showChangeStatusModal(item)">Change Status</button>
						</td>
					</tr>
				</tbody>
				<tbody v-else>
					<tr>
						<td colspan="10" class="text-center">
                            <div class="py-5">
                                <img src="/img/no-result.svg" alt="" class="img-empty"> 
                                <p class="h5 mt-4 d-block fw-normal">
                                    No Item found
                                </p>
                              </div>
                            </td>
					</tr>
				</tbody>
			</table>
		</div>
        <CModal :visible="visibleChangeStatusModal" @close="closeChangeStatusModal">
            <CModalHeader>
                <CModalTitle>Change Status</CModalTitle>
            </CModalHeader>
            <form id="change-signup-status" @submit.prevent="changeStatus">
                <CModalBody>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label class="control-label"><b>Status</b></label>
                                <v-select 
                                    v-model="status" label="label" :options="classSignupStatusType"
                                    :clearable="false" 
                                    :reduce="st => st.value"
                                >
                                    <template v-slot:no-options>
                                        Type to search ...
                                    </template>
                                    <template v-slot:option="option" >
                                        <div class="d-center">
                                        {{ option.label }}
                                        </div>
                                    </template>
                                    <template v-slot:selected-option="option" >
                                        <div class="selected d-center">
                                        {{ option.label }}
                                        </div>
                                    </template>
                                </v-select>
                                <!-- <p class="error-msg" v-if="v$.status.$dirty && v$.status.required.$invalid">This field must not be empty.</p> -->
                            </div>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" @click="closeChangeStatusModal">
                        Cancel
                    </CButton>
                    <CButton color="primary" type="submit">Update</CButton>
                </CModalFooter>
            </form>
        </CModal>
	</div>
</template>

<script>

import staticListMixin from '@/mixins/static-list';

export default {
    name: "ClassSignupsList",
    mixins: [staticListMixin],
    created() {
        this.getClassSignupsList();
    },
    data() {
        return ({
            list: [],
            visibleChangeStatusModal: false,
            status: null,
            class_signup_id: null
        });
    },
    computed: {
        currencySymbol() {
            return this.$store.state.business_settings.business_currency_symbol
        },
    },
    methods: {
        getClassSignupsList() {
            let classId = this.$route.params.id;
            let courseId = this.$route.params.course_id;
            let that = this;
            if (classId) {
                this.$schedsdk.get_class_signups(courseId, classId).then((result) => {
                    that.list = result.data.filter(s => !s.is_deleted);
                }).catch((error) => {
                    console.log(error);
                });
            }
        },
        showChangeStatusModal(item) {
            this.status = item.status;
            this.class_signup_id = item._id;
            this.visibleChangeStatusModal = true;
        },
        closeChangeStatusModal() {
            this.status = null;
            this.class_signup_id = null;
            this.visibleChangeStatusModal = false;
        },
        changeStatus() {
            let classId = this.$route.params.id;
            let courseId = this.$route.params.course_id;
            let classSignupId = this.class_signup_id;
            let that = this;

            this.$schedsdk.update_class_signup(courseId, classId, classSignupId, {class_signup_status: this.status}).then((result) => {
                console.log(result);
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                that.closeChangeStatusModal();
                that.getClassSignupsList();
            });
        }        
    }
}
</script>

<style scoped>
.action_column button {
    margin: 3px
}
.controls-div {
    float: left;
    width: 100%;
    border: 1px solid #d8dbe0;
    padding: 15px 4px;
    margin: 0 0 1rem 0!important;
    padding-top: 20px;
    position: relative;
}
.settings-text {
    position: absolute;
    background: #fff;
    padding: 3px 6px;
    top: -15px;
    left: 15px;
    font-size: 16px;
    font-weight: bold;
}
</style>