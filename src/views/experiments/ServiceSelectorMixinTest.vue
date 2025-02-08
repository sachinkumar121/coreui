<template>
	<div class="form-group">
        <label class="control-label"><b>Select Services</b></label>
        <v-select
            multiple
            v-model="services"
            label="name"
            :options="services_option"
            @update:modelValue="checkForAdditionalServiceProviders"
            @option:selecting="handleSelecting"
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
    </div>
</template>
<script>
import servicesSelector from '@/mixins/services-selector';

export default {
    name: 'ServiceSelectorMixinTest',
	mixins: [servicesSelector],
    data() {
        return {
			services: [],
        }
    },
	mounted() {
        console.log("call mounted fn for components.")
	},
    methods: {
        checkForAdditionalServiceProviders() {
            console.log("component's checkForAdditionalServiceProviders");
        }
    }
}
</script>