<template>
	<div class="form-group">
        <services-selector
            @modelValueUpdate="checkForAdditionalServiceProviders"
            @serviceListChange="onServiceListChange"
        />
		<button @click="saveServices">Save</button>
    </div>
</template>
<script>
import servicesSelector from '@/common/ServicesSelector';

export default {
    name: 'ServiceSelectorCompTest',
    components: {
		servicesSelector
    },
	data() {
        return {
			services: [],
			need_2nd_service_provider: false,
        }
    },
	methods: {
		saveServices() {
			console.log(JSON.stringify(this.services));
		},
		onServiceListChange(services) {
			this.services = services;
		},
		isSvcMultiProvider(svci) {
        	return svci.requires_multi_providers !== undefined &&  svci.requires_multi_providers == true && svci.multi_providers_count > 1;
        },
		checkForAdditionalServiceProviders(d) {
			for (let i = 0; i < this.services.length; i++) {
				let svci = this.services[i];
				if (this.isSvcMultiProvider(svci)) {
					this.need_2nd_service_provider = true;
					return;
				}
			}  
			this.need_2nd_service_provider = false; 
		}
	}
}
</script>