<template>
	<div class="pt-2">
        <div class="row controls-div">
			<div class="settings-text">Filter Options</div>
			<div class="col-md-4">
				<label class="control-label"><b>Search Customer</b></label>
				<input 
					v-model="customer_search_value"
					class="form-control placeholder-no-fix" 
					type="text"
                    @keyup="searchClassInstanceTrackerList()"
				/>
			</div>
        </div>
		<div class="table-responsive">
			<table class="table table-bordered table-hover">
				<thead>
					<tr>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Email</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody v-if="list.length" >
					<tr v-for="item in list" :key="item._id">
                        <td>{{ item.first_name }}</td>
                        <td>{{ item.last_name }}</td>
                        <td>{{ item.email }}</td>
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
            <form id="change-tracker-status" @submit.prevent="changeStatus">
                <CModalBody>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label class="control-label"><b>Status</b></label>
                                <v-select 
                                    v-model="status" label="label" :options="classInstanceTrackerStatusType"
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
import { debounce } from 'lodash';

export default {
    name: "ClassInstanceTrackerList",
    mixins: [staticListMixin],
    created() {
        this.getClassInstanceTrackerList();
    },
    data() {
        return ({
            list: [],
            visibleChangeStatusModal: false,
            status: null,
            class_instance_tracker_id: null,
            customer_id: null
        });
    },
    methods: {
        searchClassInstanceTrackerList: debounce(function() {
            this.getClassInstanceTrackerList(true);
        }, 750),
        getClassInstanceTrackerList(search = false) {
            let classId = this.$route.params.id;
            let class_instance_id = this.$route.params.class_instance_id;
            let payload = {
                class_instance_id,
                filter_config: {
                    customer_search_value: this.customer_search_value,
                }
            }
            let that = this;
            if (classId) {
                let opName = search ? 'search_class_instance_trackers' : 'get_class_instance_trackers';
                this.$schedsdk[opName](classId, payload).then((result) => {
                    that.list = result.data.class_instance_trackers;
                }).catch((error) => {
                    console.log(error);
                });
            }
        },
        showChangeStatusModal(item) {
            this.status = item.status || 'present';
            this.class_instance_tracker_id = item._id;
            this.customer_id = item.customer_id;
            this.visibleChangeStatusModal = true;
        },
        closeChangeStatusModal() {
            this.status = null;
            this.class_instance_tracker_id = null;
            this.customer_id = null;
            this.visibleChangeStatusModal = false;
        },
        changeStatus() {
            let classId = this.$route.params.id;
            let class_instance_id = this.$route.params.class_instance_id;
            let customer_id = this.customer_id;
            let that = this;

            this.$schedsdk.add_or_update_class_instance_trackers(classId, customer_id, {class_instance_id, status: this.status}).then((result) => {
                that.getClassInstanceTrackerList();
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                that.closeChangeStatusModal();
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