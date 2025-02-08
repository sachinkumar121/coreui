<template>
    <div>
        <label class="control-label"><b>{{ label }}</b></label>
        <v-select
            multiple
            v-model="services"
            label="name"
            :options="services_option"
            @update:modelValue="onModelValueUpdate"
            @option:selecting="handleSelecting"
            @option:selected="onServicesChange"
            @option:deselected="onServicesChange"
        >
            <template
            v-slot:no-options>
                Type to search ..
            </template>
            <template v-slot:option="option" >
                <div class="d-center">
                {{ option.name + " (" + option.time + " mins) " + currency_symbol + "" +   option.price }}
                </div>
            </template>
            <template v-slot:selected-option="option" >
                <div class="selected d-center">
                {{ getSelectedServiceDisplay(option) }}
                </div>
            </template>
        </v-select>

        <CModal
            :visible="showSelectTime"
            :backdrop="true"
            @close="saveSelectTimeHandler"
            >
            <CModalBody>
                <div class="row">
                    <div class="col-md-12">
                        <label class="control-label"><b>Select time for service </b></label>
                        <v-select v-model="selected_flex_time_obj" 
                            label="time" 
                            :options="select_flex_time_options" 
                            >
                            <template v-slot:option="option" >
                                <div class="d-center">
                                    {{option.time + " mins " + currency_symbol + "" +   option.price + " " + option.note }}
                                </div>
                            </template>
                            <template v-slot:selected-option="option" >
                                <div class="selected d-center">
                                    {{option.time + " mins " + currency_symbol + "" +   option.price + " " + option.note }}
                                </div>
                            </template>
                        </v-select>
                    </div>
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton @click="saveSelectTimeHandler" color="success"  class="text-center">Save</CButton>
            </CModalFooter>
        </CModal>
    </div>
</template>
<script>

export default {
    props: {
        label: {
            type: String,
            default: "Select Services"
        },
        initialValues: {
            type: Array,
            default: []
        }
    },
    watch: { 
        initialValues: function(newVal, oldVal) { 
            this.services = newVal;
        }
    },
    name: 'SelectServices',
    emits: ['modelValueUpdate', 'serviceListChange'],
	data() {
        return {
            services: this.initialValues,
			services_option: [],
			currency_symbol: this.$store.state.business_settings.business_currency_symbol,
            showSelectTime: false,
            select_flex_time_options: [],
            service_id_for_flex_dialog: -1,
            selected_flex_time_obj: null
        }
    },
	mounted() {
        this.getServicesList();
	},
	methods: {
        onModelValueUpdate()
        {
            //console.log("Asdasd MODEL UPDAYE")
            this.$emit('modelValueUpdate', this.services);
        },
        onServicesChange() {
            //console.log("Asdasd MODEL UPDAYE2")
            this.$emit('serviceListChange', this.services);
        },
		getServicesList() {
			this.$schedsdk.list_services({ page_no: 1 }).then( (result) => {
				if (result.status == 1) {
					this.services_option = result.data
				}
			})
		},
		handleSelecting(e) {
            if (e.enable_flexible_time && e.selectable_times.length) {
                this.service_id_for_flex_dialog = e._id.toString()
                this.select_flex_time_options = e.selectable_times
                this.showSelectTime = true;
			}
		},
		getSelectedServiceDisplay(item) {
			return item.flex_service_name ? item.flex_service_name : item.name;
		},
        saveSelectTimeHandler() {
            for (let i = 0; i < this.services.length; i++) {
                let svci = this.services[i];
                if (svci._id.toString() == this.service_id_for_flex_dialog) {
                    this.services[i].user_selected_flex_time = JSON.parse(JSON.stringify(this.selected_flex_time_obj));
                    this.services[i].flex_service_name = svci.name + " " + this.services[i].user_selected_flex_time.time + " mins"
                    this.hint_flex_service_change = true;
                    this.onServicesChange()
                    break;
                }
            }
            
            this.service_id_for_flex_dialog = ""
            this.showSelectTime = false
        },
	}
}
</script>