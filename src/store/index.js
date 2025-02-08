import {
	createStore
} from 'vuex'
import axios from 'axios'
import schedsdkstore from '../store_modules/schedsdk-store-module'
import inMemoryDbState from '../store_modules/in-memory-db-module'
import posModule from '../store_modules/pos-module'

const state = {
	token: '',
	user_data: {},
	location_list: [],
	business_settings: {},
	sidebarShow: false,
	sidebarMinimize: false,
	sidebarVisible: true,
	sidebarUnfoldable: false,
	sidebarNarrow: false,
	sb_nav_items: [{
		_name: 'CSidebarNav',
		_children: [{
			_name: 'CSidebarNavItem',
			name: 'Dashboard',
			to: '/dashboard',
			icon: 'cil-speedometer',
			utype: [2, 3, 4]
		}]
	}],
	skysdkdata: '',

	scheduler_view_preferences: {},
	booking_view_preferences: null,
	provider_list: {
		data: null,
		timestamp: 0
	},
	provider_availabilty: {
		data: new Map(),
		timestamp: 0
	},
	uom_data: [],
	uom_arr_version: null,
	message_credit_notification: {},
	ui: {
		max_credit_toast: {
			below_2: 2,
			below_p5: 2
		},
        message_credit_last_shown_time: 0,
		animation_component: null,
		show_acked_toastr: false
	},
    inventory_count_list: [],
	employee_list: [],
	slice_ttl: {
		employee_list: 2 * 60000, // i.e 3 minutes
	},
	slice_last_fetched_timestamp: {
		employee_list: null,
	},
	cart: [],
	search_preferences: {
		manage_business: null
	},
	quote_visibility: {},
	skysched_global_api_base_url: import.meta.env.VITE_EXT_BASE_URL
}
const mutations = {
	setSearchPreference(state, data) {
		state.search_preferences[data.key] = data.value;
	},
	resetSearchPreference(state) {
		state.search_preferences = {
			manage_business: null
		}
	},
	setLastFetchedTimestamp(state, key) {
		let value = +new Date();
		state.slice_last_fetched_timestamp[key] = value;
	},
	resetLastFetchedTimestamp(state, key) {
		state.slice_last_fetched_timestamp[key] = null;
	},
	updateMaxCreditToast(state, data) {
		state.ui.max_credit_toast[data.key] = data.value;
	},
    updateMessageCreditsLastShownTime(state, data)
    {
        state.ui.max_credit_toast.message_credit_last_shown_time = +new Date();
    },

    updateMessageCreditsTracking(state, data)
    {
        if (data.notification !== undefined && data.notification)
        {
            state.message_credit_notification = data.notification;
        }
        if (data.tracking_data && data.tracking_data.length >0)
        {
            //let that = this;
            data.tracking_data.forEach(d => {
                state.ui.max_credit_toast[d.key] = d.value;
            });
        }
    },
	toggleSidebarDesktop(state) {
		const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
		state.sidebarShow = sidebarOpened ? false : 'responsive'
	},
	toggleSidebarMobile(state) {
		const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
		state.sidebarShow = sidebarClosed ? true : 'responsive'
	},
	toggleSidebar(state) {
		console.log("toggleSidebar")
		 state.sidebarVisible = !state.sidebarVisible

	},
	toggleUnfoldable(state) {
		state.sidebarUnfoldable = !state.sidebarUnfoldable
	},
	toggleSidebarNarrow(state) {
		console.log("toggleSidebarNarrow")
		state.sidebarNarrow = !state.sidebarNarrow
	},
	updateSidebarVisible(state, payload) {
		console.log("updateSidebarVisible")
		state.sidebarVisible = payload.value
	},
	set(state, [variable, value]) {
		state[variable] = value
	},

	USER_DATA(state, data) {
		state.user_data = data
	},
	UPDATE_USER_DATA(state, data) {
		state.user_data[data.key] = data.value;
	},
	LOCATION_LIST(state, data) {
		state.location_list = data
	},
	BUSINESS_DATA(state, data) {
		state.business_settings = data
	},
	SIDE_BAR_NAV_ITEMS(state, data) {
		state.sb_nav_items = data
	},
	SET_UOM_DATA(state, data) {
		state.uom_data = data
	},
	UPDATE_BUSINESS_DATA(state, data) {
		state.business_settings[data.key] = data.value;
	},

	SET_UOM_ARR_VERSION(state, data) {
		state.uom_arr_version = data
	},

	SET_SCHEDULER_VIEW_PREFS(state, data) {
		state.scheduler_view_preferences = data
	},
	SET_BOOKINGS_VIEW_PREFS(state, data) {
		state.booking_view_preferences = data
	},
	SET_PROVIDER_AVAIL(state, key, data) {
		state.provider_availabilty.data.set(key, data)
	},

	BOOKING_LIST(state, list_data) {
		// console.log("set booking data in local")
		// console.log(list_data)
		state.booking_list.page_no = list_data.page_no;
		state.booking_list.data = list_data.data;
	},
	SET_SKYSDKDATA(state, data) {
		state.skysdkdata = data;
	},

	CLEAR_TOKEN(state, data) {
		state.token = '';
	},
	setMessageCreditNotification(state, notification) {
		state.message_credit_notification = notification;
	},

    SET_INVENTORY_COUNT_LIST(state, data) {
		state.inventory_count_list = data
	},
    SET_EMPLOYEE_LIST(state, data) {
		state.employee_list = data
	},
    addToCart(state, item) {
		let itemIndex = state.cart.findIndex(i => i._id == item._id);
		if (itemIndex < 0) {
			state.cart.push(item);
		}
	},
	removeFromCart(state, item) {
		let itemIndex = state.cart.findIndex(i => i._id == item._id);
		if (itemIndex >= 0) {
			state.cart.splice(itemIndex, 1);
		}
	},
	resetCart(state) {
		state.cart = [];
	},
	update_user_ui_preferences(state, data) {
		state.user_data.ui_preferences[data.key] = data.value;
	},
	set_ui_data(state, data) {
		state.ui[data.key] = data.value;
	},
	setQuoteVisibility(state, data) {
		state.quote_visibility[data.key] = data.value;
	},
	update_api_server_url(state, url) {
		state.skysched_global_api_base_url = url;
	}
}
const actions = {
	getBusinessData({
		commit
	}) {
		axios.get('/tax_percentage').then((result) => {
			if (result.data.status == 1) {
				commit('BUSINESS_DATA', result.data.business_setting)
			}
		})
	},
	LOGOUT({
		commit
	}) {
		//commit('SET_TOKEN', '')

		this.$schedsdk.logout();
		commit('CLEAR_TOKEN', '');
		//Flush all cacheed keys
		commit('schedsdkstore/flushAllKeys', {
			key: ""
		});
	}
}

const getters = {
	getQuoteVisibilityForBusiness: (state) => (id) => {
		return state.quote_visibility[id];
	}
}

import VuexPersistence from 'vuex-persist';
const vuexLocal = new VuexPersistence({
	storage: window.localStorage
})

export default createStore({
	state: state,
	mutations: mutations,
	plugins: [vuexLocal.plugin],
	actions: actions,
	getters,
	modules: {
		schedsdkstore,
		in_memory_db_state: inMemoryDbState,
		pos: posModule
	},
})
