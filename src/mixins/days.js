export default {
    data() {
        return {
            time_picker_config: {
                altInput: true,
                altFormat: "G:i K",
                dateFormat: "G:i K",
                noCalendar: true,
                enableTime: true,
                monthSelectorType: "static"
            },
            days: [
                { display: 'Sun', label: 'Sunday', day_num: 1, begin_hours: null, end_hours: null, by_appointment_only: false, is_closed: false, break_begin_hours:  null, break_end_hours:  null },
                { display: 'Mon', label: 'Monday', day_num: 2, begin_hours: null, end_hours: null, by_appointment_only: false, is_closed: true, break_begin_hours:  null, break_end_hours:  null },
                { display: 'Tue', label: 'Tuesday', day_num: 3, begin_hours: null, end_hours: null, by_appointment_only: false, is_closed: true, break_begin_hours:  null, break_end_hours:  null },
                { display: 'Wed', label: 'Wednesday', day_num: 4, begin_hours: null, end_hours: null, by_appointment_only: false, is_closed: true, break_begin_hours:  null, break_end_hours:  null },
                { display: 'Thu', label: 'Thursday', day_num: 5, begin_hours: null, end_hours: null, by_appointment_only: false, is_closed: true, break_begin_hours:  null, break_end_hours:  null },
                { display: 'Fri', label: 'Friday', day_num: 6, begin_hours: null, end_hours: null, by_appointment_only: false, is_closed: true, break_begin_hours:  null, break_end_hours:  null },
                { display: 'Sat', label: 'Saturday', day_num: 7, begin_hours: null, end_hours: null, by_appointment_only: false, is_closed: true, break_begin_hours:  null, break_end_hours:  null}
            ]
        }
    }
}