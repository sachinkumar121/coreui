export default {
    namespaced: true,
    state: {
        last_fetched_timestamp: {
            inventory_count: null,
        },
        ttl: {
            inventory_count: 3 * 60000, // i.e 3 minutes
            bookings: 5 * 60000, // i.e 5 minutes
        },
        should_cache_data: {
            bookings: true, //Temporarily disabled until caching is disabled
            user_panel_info: true
        }
    },
    getters: {},
    mutations: {
        setLastFetchedTimestamp(state, key) {
            let value = +new Date();
            state.last_fetched_timestamp[key] = value;
        },
        resetLastFetchedTimestamp(state, key) {
            state.last_fetched_timestamp[key] = null;
        },
    },
    actions: {}
}