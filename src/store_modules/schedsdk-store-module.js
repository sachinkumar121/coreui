import Datastore from '@seald-io/nedb';

export function getdb(state, db_collection) {
	
	let scoped_coll_id = state.store_id + "_" + db_collection;
	// let db = new Datastore({
	// 	filename: scoped_coll_id,
	// 	autoload: true
	// });
	// db.setAutocompactionInterval(60000);
	// return db;

	if (state.nedbstore[scoped_coll_id] == undefined) {
		state.nedbstore[scoped_coll_id] = new Datastore({
			filename: scoped_coll_id,
			autoload: true
		});
		state.nedbstore[scoped_coll_id].setAutocompactionInterval(60000);
	}
	let db = state.nedbstore[scoped_coll_id];
	return db;
}
export default {
	namespaced: true,
	default_expiry_ms: (2 * 60 * 1000), // 2 minutes

	state: {
		store_id: "default_dsid",
		internalmap: [],
		// test: '',
		nedbstore: [],
	},
	getters: {
	// 	fullname: state => `${state.firstname} ${state.lastname}`,

		getData: (state) => (data) => {
			/*console.log("GET  data:");
			console.log(data);
			console.log(state.internalmap);
			console.log(state.store_id);
			*/
			let storeobj = state.internalmap[state.store_id];

			if (storeobj == null) {
				//console.log("Store OBJ was null (cache miss)");
				//console.log("GET  data:");
				//console.log(data);
				//console.log(state.store_id);
				return null;
			}
			let valObj = storeobj[data.key];
			let curr_time_millis = Date.now();
			if (valObj == null ||
				curr_time_millis >= valObj.expiry_date) {
				//Expired
				//console.log("Expired .... curr_time_millis: " + curr_time_millis + " valObj.expiry_date " + valObj.expiry_date)
				storeobj[data.key] = null;
				return null;
			}

			return valObj.val;
		}
	},
	mutations: {
		setDefaultStoreID(state, data) {
			state.store_id = data.data;
		},

		setData(state, data) {
			if (state.internalmap == null) {
				state.internalmap = [];
			}

			let storeobj = state.internalmap[state.store_id];
			if (storeobj == null) {
				state.internalmap[state.store_id] = [];
			}

			if (state.internalmap[state.store_id][data.key] == null) {
				state.internalmap[state.store_id][data.key] = {};
			}
			//console.log("SET data:");
			//console.log(state.store_id);
			//console.log(data.key);
			//console.log(data);
			if (!data.ttl) {
				data.ttl_ms = state.default_expiry_ms;
			} else {
				data.ttl_ms = data.ttl * 1000;
			}

			let expiry_date_millis = Date.now() + data.ttl_ms;

			state.internalmap[state.store_id][data.key] = {
				expiry_date: expiry_date_millis,
				val: data.value
			}

			//console.log(state.internalmap[data.key]);
		},

		clearNedbStoreData(state) {
			state.nedbstore = [];
		}
		/*flushAllKeys(state, data) {
			state.internalmap[state.store_id] = null;
		},

		saveBookingData(state, data) {
			//console.log("asdasdas SAVING DATADA---");
			//state.internalmap[state.store_id] = null;
			let db_collection = 'skysalon.bookings';

			let db = getdb(state, db_collection);
			db.insertAsync(data.data).catch((res) => {
				console.log("CAUTGHT ERROR R  ***** **** ");
				console.log(res);
				return res;
			});

		} */
	},
	/* actions: {
		// emailupdate(context, email) {
		// 	context.commit('updatemail', email);
		// },
		// async fetchLocalDbBookings(context, data) {

		// 	let db_collection = 'skysalon.bookings';

		// 	let db = getdb(context.state, db_collection);
		// 	let queryretdata = db.findAsync(data.query);
		// 	return queryretdata;
		// },
		// async saveBookingsToDb(context, data) {
		// 	context.commit('saveBookingData', data);
		// },
		// async flushAllBookingData(context, data) {
		// 	let db_collection = 'skysalon.bookings';
		// 	let db = getdb(context.state, db_collection);
		// 	await db.removeAsync({}, {
		// 		multi: true
		// 	});
		// },
		// async getBonus() {}
	} */
};