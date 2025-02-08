import moment from 'moment-timezone'
import store from '../store';

export default {
    get_online_booking_url(url, settings_data)
    {
        let booking_link = url +
            "extpages/onlinebooking/" +
            settings_data.api_access_account_id;
        return booking_link;
    },
    isRoleAdmin(storeref)
    {
        return (storeref.user_data.type == 1)
    },
    isRoleReception(storeref)
    {
        return (storeref.user_data.type == 3)
    },
    isRoleOwnerOrReception(storeref)
    {
        return (storeref.user_data.type == 2 || storeref.user_data.type  == 3)
    },
    isRoleOwner(storeref)
    {
        return (storeref.user_data.type == 2)
    },

    getTimestampFromDate(date, timezone, format = 'YYYY-MM-DD') {
        return moment.tz(moment(date).format(format), timezone).valueOf();
    },

    convertTimeToAmPm(time) {
        return moment(time, 'hh:mm:ii').format('hh:mm A');
    },
    getDateOrTimeFromTimestamp(timestamp, timezone, format = 'YYYY-MM-DD') {
        return moment(timestamp).tz(timezone).format(format)
    },
    getUserRoles()
    {
        return [
            {type:1,name:"Administrator"},
            {type:2,name:"Business Owner"},
            {type:3,name:"Receptionist"},
            {type:4,name:"Provider"},
            {type:5,name:"Customer"},
            {type:6,name:"Business"},
            {type:7,name:"NA7"},
            {type:8,name:"NA8"},
            {type:9,name:"Resource"},
        ]
    },
    getRoleName(role_type_num)
    {
        let rolearr = this.getUserRoles();
        if (!role_type_num || role_type_num == 0 || role_type_num > rolearr.length)
        {
            return "ROLE_NA"
        }
        return rolearr[role_type_num-1].name
    },
    getDayLabel(day_num) {
        let days = [
            { display:'Sun', label:'Sunday', day_num:1 },
            { display:'Mon', label:'Monday', day_num:2 },
            { display:'Tue', label:'Tuesday', day_num:3 },
            { display:'Wed', label:'Wednesday', day_num:4 },
            { display:'Thu', label:'Thursday', day_num:5 },
            { display:'Fri', label:'Friday', day_num:6 },
            { display:'Sat', label:'Saturday', day_num:7 }
        ];
        return days.find(d => d.day_num == day_num) || null;
    },
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    titleCase(str) {
        return str.toLowerCase().split(' ').map(function(word) {
          return word.replace(word[0], word[0].toUpperCase());
        }).join(' ');
    },
    getDuplicateElements(array) {
        return array.filter((item, index) => array.indexOf(item) !== index);
    },
    allEleExistInAnotherArray(array1, array2) {
        return array1.every(element => array2.includes(element));
    },
    async updateApiServerUrl(schedsdk, url) {
        await store.commit('update_api_server_url', url);
        await schedsdk.update_base_url(url);
    }
}