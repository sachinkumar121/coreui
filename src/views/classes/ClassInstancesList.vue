<template>
	<div class="pt-2"> 
        <div class="row controls-div">
			<div class="settings-text">Filter Options</div>
            <div class="col-md-4">
                <div class="form-group" >
                    <label class="control-label"><b>Select Date Range</b> <span @click="date_range = null">clear</span></label>
                    <flat-pickr 
                        v-model="date_range" 
                        :config="date_range_picker_config" 
                        placeholder="Date Range"
                        @input="searchClassInstance" />
                </div>
            </div>
            <div class="col-md-3">
                <input  
                    type="checkbox"
                    v-model="filter_config.today" 
                    @change="searchClassInstance"  
                    /> 
                <label class="control-label">
                    &nbsp;Only Today&nbsp; 
                </label>
            </div>
            
		</div>
		<div class="table-responsive">
			<table class="table table-bordered table-hover">
				<thead>
					<tr>
						<th>Start Time</th>
						<th>End Time</th>
						<th>Status</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody v-if="list.length" >
					<tr v-for="item in list" :key="item._id">
                        <td>{{getFormattedDateShort(item.class_start_time)}}</td>
                        <td>{{getFormattedDateShort(item.class_end_time)}}</td>
                        <td>{{item.status}}</td>
						<td class="action_column">
                            <button class="btn btn-primary btn-sm" @click="showEditInstanceModal('change_time', item)">Change Time</button>
                            <button class="btn btn-primary btn-sm" @click="showEditInstanceModal('change_instructors', item)">Change instructors</button>
                            <template v-if="item.status == 'active'">
                                <button class="btn btn-primary btn-sm" @click="$router.push(`/classes/${$route.params.id}/${item._id}/instance-tracker`)">Show Class Instance Tracker</button>
                            </template>
                            <button v-if="item.status != 'active'" type="button" 
                            @click="activateClassInstanceHandler(item)" 
                            class="btn btn-danger btn-sm">Activate Class Instance</button>
                            <button type="button" 
                            v-if="item.status != 'cancel'"
                            @click="cancelClassInstanceHandler(item)" 
                            class="btn btn-danger btn-sm">Cancel Class</button>
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
        <CModal :visible="visibleEditInstanceModal" @close="closeEditInstanceModal">
            <CModalHeader>
                <CModalTitle>{{editInstanceModalData.title}}</CModalTitle>
            </CModalHeader>
            <form id="edit-class-instance" @submit.prevent="updateClassInstace">
                <CModalBody>
                    <div class="row" v-if="editInstanceModalData.action == 'change_time'">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label"><b>Start date/time</b></label>
                                <flat-pickr 
                                    class="form-control placeholder-no-fix" 
                                    v-model="editInstanceModalData.class_start_time"
                                    :config="date_time_picker_config"
                                    placeholder="Class start date"
                                />
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label class="control-label"><b>End date/time</b></label>
                                <flat-pickr 
                                    class="form-control placeholder-no-fix" 
                                    v-model="editInstanceModalData.class_end_time"
                                    :config="date_time_picker_config"
                                    placeholder="Class start date"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row" v-if="editInstanceModalData.action == 'change_instructors'">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label class="control-label"><b>Instructors</b></label>

                                <v-select 
                                    multiple
                                    v-model="editInstanceModalData.instructors"
                                    label="first_name" :options="instructor_options"
                                >
                                <template v-slot:no-options>
                                    Type to search ...
                                </template>
                                <template v-slot:option="option" >
                                    <div class="d-center">
                                    {{ option.first_name }}
                                    </div>
                                </template>
                                <template v-slot:selected-option="option" >
                                    <div class="selected d-center">
                                    {{ option.first_name }}
                                    </div>
                                </template>
                            </v-select>
                            </div>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" @click="closeEditInstanceModal">
                        Cancel
                    </CButton>
                    <CButton color="primary" type="submit">Update</CButton>
                </CModalFooter>
            </form>
        </CModal>
	</div>
</template>

<script>
import { debounce } from 'lodash';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment-timezone'
import utils_lib from '../../helpers/utils_lib';

export default {
    name: "ClassInstancesList",
    components: {
        flatPickr,
    },
    created() {
        this.getClassInstancesList();
        this.getProvidersList();
    },
    data() {
        return ({
            instructor_options: [],
            list: [],
            visibleEditInstanceModal: false,
            editInstanceModalData: {
                'title': 'Change Time',
                'id': null
            },
            date_time_picker_config: {
				altFormat: "F j, Y H:i",
				dateFormat: "F j, Y H:i",
                altInput: true,
                noCalendar: true,
                enableTime: true,
                static: true,
			},
            date_range_picker_config: {
                altFormat: "F j, Y",
                altInput: true,
                mode: "range",
                disabled: true
            },
            date_range: null,
            filter_config: {
                today: false,
                date_range: true,
                start_date: null,
                end_date: null,
            }
        });
    },
    methods: {
        searchClassInstance: debounce(function() {
            this.searchClassInstances();
        }, 750),
        searchClassInstances() {
            let that = this;
            let dt_range = this.getDateRangeTimeStamps(this.date_range + "");
            let classId = this.$route.params.id;
            let courseId = this.$route.params.course_id;

            let start_date = dt_range.start_ts || null;
            let end_date = dt_range.end_ts || null;
            this.filter_config.date_range = this.filter_config.today ? false : Boolean((start_date || end_date));
            this.filter_config.start_date = start_date;
            this.filter_config.end_date = end_date;

            this.$schedsdk.search_class_instances(courseId, classId, { filter_config: this.filter_config }).then((result) => {
                that.list = result.filtered_class_instances.filter(s => !s.is_deleted);
            }).catch((error) => {
                console.log(error);
            });
        },
        getDateRangeTimeStamps(dt_range_string) {
            return utils_lib.getFPickDateRangeTimeStamps(dt_range_string, this.$store.state.business_settings.business_time_zone)
        },
        activateClassInstanceHandler(item)
        {
            let confirmed = confirm("Are you sure want to activate this class instance");
            if (confirmed) {
                this.updateClassInstaceStatus(item, 'active');
            }
        },
        showEditInstanceModal(action, classInstance) {
            if (action == "change_time") {
                this.editInstanceModalData = {
                    id: classInstance._id,
                    action,
                    'title': 'Change Time',
                    class_start_time: classInstance.class_start_time,
                    class_end_time: classInstance.class_end_time,
                }
            }
            if (action == "change_instructors") {
                this.editInstanceModalData = {
                    id: classInstance._id,
                    action,
                    'title': 'Change Instructors',
                    instructors: classInstance.instructors.map(function(l) {
                        return {
                            user_id: l.user_id,
                            first_name: l.first_name,
                            last_name: l.last_name
                        }
                    })
                }
            }
            this.visibleEditInstanceModal = true;
        },
        getProvidersList() {
            this.$schedsdk.get_users_list({}).then((result) => {
                this.instructor_options = result.data.map(function(l) {
                    return {
                        user_id: l._id,
                        first_name: l.first_name,
                        last_name: l.last_name
                    }
                });
            }).catch((error) => {
                console.log(error);
            });
        },
        closeEditInstanceModal() {
            this.visibleEditInstanceModal = false;
            this.editInstanceModalData = {
                'title': 'Change Time'
            };
        },
        getClassInstancesList() {
            let classId = this.$route.params.id;
            let courseId = this.$route.params.course_id;
            let that = this;
            if (classId) {
                this.$schedsdk.get_class_instances(courseId, classId).then((result) => {
                    that.list = result.data.filter(s => !s.is_deleted);
                }).catch((error) => {
                    console.log(error);
                });
            }
        },
        updateClassInstaceStatus(item, status) {
            let classId = this.$route.params.id;
            let courseId = this.$route.params.course_id;
            let instanceId = item._id
            this.$schedsdk.update_class_instance(courseId, classId, instanceId, { status }).then((result)=>{
                this.getClassInstancesList();
            }).catch(console.error);

        },
        cancelClassInstanceHandler(item) {
            let confirmed = confirm("Are you sure want to cancel this class instance");
            if (confirmed) {
                this.updateClassInstaceStatus(item, 'cancel');
            }
        },
        getTimestampFromDate(date) {
            let timezone = this.$store.state.business_settings.business_time_zone;
            return moment.tz(moment(date).format('YYYY-MM-DD HH:mm'), timezone).valueOf();
        },
        updateClassInstace() {
            let classId = this.$route.params.id;
            let courseId = this.$route.params.course_id;
            let instanceId = this.editInstanceModalData.id;
            let payload;
            if (this.editInstanceModalData.action == "change_time") {
                payload = {
                    class_start_time: +this.getTimestampFromDate(this.editInstanceModalData.class_start_time),
                    class_end_time: +this.getTimestampFromDate(this.editInstanceModalData.class_end_time)
                }
            }

            if (this.editInstanceModalData.action == "change_instructors") {
                payload = {
                    instructors: this.editInstanceModalData.instructors
                }
            }
            
            this.$schedsdk.update_class_instance(courseId, classId, instanceId, payload)
            .then((result) => {
                this.getClassInstancesList();
            }).catch(console.error).finally(() => {
                this.closeEditInstanceModal();
            });
        },
        getFormattedDateShort(dt_unix) {
            if (dt_unix == null || dt_unix == 0) {
                return dt_unix;
            }
            return moment(dt_unix).format("DD MMM YYYY hh:mma");
        },
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