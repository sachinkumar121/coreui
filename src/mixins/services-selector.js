export default {
    data() {
        return {
			services_option: [],
			need_2nd_service_provider: false,
			currency_symbol: this.$store.state.business_settings.business_currency_symbol,
			showSelectTime : false,
			select_flex_time_options: [],
			service_id_for_flex_dialog: -1
        }
    },
	mounted() {
        this.getServicesList();
	},
	methods: {
		getServicesList() {
			this.$schedsdk.list_services({ page_no: 1 }).then( (result) => {
				if (result.status == 1) {
					this.services_option = result.data
				}
			})
		},
		isSvcMultiProvider(svci) {
        	return svci.requires_multi_providers !== undefined &&  svci.requires_multi_providers == true && svci.multi_providers_count > 1;
        },
		checkForAdditionalServiceProviders() {
            console.log("mixin's checkForAdditionalServiceProviders");
			for (let i = 0; i < this.services.length; i++) {
				let svci = this.services[i];
				if (this.isSvcMultiProvider(svci)) {
					this.need_2nd_service_provider = true;
					return;
				}
			}  
			this.need_2nd_service_provider = false; 
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
		}
	}
}