import moment from 'moment-timezone'
export default {
    debug_display_date(start, end, time_zone)
    {
    console.log( "* Start raw       : " + start);
    console.log( "* Start (system)  : " + moment(start).format("YYYY-MM-DD HH:mm:ss") +  " " + moment(start).format("hh:mm A"));
    console.log( "* Start (biz)     : " + moment(start).tz(time_zone).format("YYYY-MM-DD HH:mm:ss" ) + " " + moment(start).tz(time_zone).format("hh:mm A"));
    console.log( "* End raw         : " + end);
    console.log( "* End   (system)  : " + moment(end).format("YYYY-MM-DD HH:mm:ss") +  " " + moment(end).format("hh:mm A"));
    console.log( "* End   (biz)     : " + moment(end).tz(time_zone).format("YYYY-MM-DD HH:mm:ss") +  " " + moment(end).tz(time_zone).format("hh:mm A"));
    },

    booking_to_bryn_event_record(business_context, booking)
    {
        try{
        let timezone = business_context.business_settings.business_time_zone;
        let serviceslist = "";
        if (booking.services && 
            booking.services.length > 0) 
        {
            serviceslist = booking.services[0].name
        }
        return({
            "id"                 : booking._id,
            "resourceId"         : booking.service_provider._id,
            "name"               : booking.customer.first_name + " " + booking.customer.last_name,
            "desc"               : serviceslist,
            "type"               : booking.type,
            "service_order_id"   : booking.service_order_id,
            "services"           : booking.services,
            "selected_service_id": booking.services[0]._id,  //TODO: make it multiple services
            "startDate"          : moment.tz(booking.service_start_date,timezone).toDate(), //start / end in Date is better as its more acceptable
            "endDate"            : moment.tz(booking.service_end_date,timezone).toDate(),
            "service_time_mins"  : (booking.service_end_date-booking.service_start_date)/(1000*60),
            "first_name"         : booking.customer.first_name,
            "last_name"          : booking.customer.last_name,
            "email"              : booking.customer.email,
            "phone"              : booking.customer.phone,
            "customer"           : booking.customer,
            "eventType"          : "Booking",
            "eventColor"         : "blue",
            "iconCls"            : "b-fa b-fa-calendar"
        })
    }
    catch(err){
        console.log(err)
    }
    },
    


    
    booking_to_mobiscroll_event_record(business_context, booking)
    {
        try{
        let timezone = business_context.business_settings.business_time_zone;
        let serviceslist = "";
        if (booking.services && 
            booking.services.length > 0) 
        {
            serviceslist = booking.services[0].name
        }
        //console.log("asdasdsa SERVICE LIST " + serviceslist)
        return({
            "id"                 : booking._id,
            "resource"           : booking.service_provider._id,
            "title"               : booking.customer.first_name + " " + booking.customer.last_name + 
                                        " for <br>" + serviceslist,
            "desc"               : serviceslist,
            "type"               : booking.type,
            "service_order_id"   : booking.service_order_id,
            "services"           : booking.services,
            "selected_service_id": booking.services[0]._id,  //TODO: make it multiple services
            "start"          : moment.tz(booking.service_start_date,timezone).toDate(), //start / end in Date is better as its more acceptable
            "end"            : moment.tz(booking.service_end_date,timezone).toDate(),
            "service_start_date": booking.service_start_date,
            "service_end_date": booking.service_end_date,
            "service_time_mins"  : (booking.service_end_date-booking.service_start_date)/(1000*60),
            "first_name"         : booking.customer.first_name,
            "last_name"          : booking.customer.last_name,
            "email"              : booking.customer.email,
            "phone"              : booking.customer.phone,
            "customer"           : booking.customer,
            "eventType"          : "Booking",
            "color"         : "blue"
        })
    }
    catch(err){
        console.log(err)
    }
    },
    
    provider_occupied_record_to_mobiscroll(business_context, pocrec)
    {
        let timezone = business_context.business_settings.business_time_zone;
        //console.log("asdasdsa SERVICE LIST " + serviceslist)
        let name = "";
        let color = "grey";
        if(pocrec.type == 7708)
        {
            name = "Buffer time"
        }
        if(pocrec.type == 7701)
        {
            name = "Personal time off"
        }
        if(pocrec.type == 7702)
        {
            name = "Business time off"
        }
        return({
            "id"                 : pocrec._id,
            "resource"           : pocrec.service_provider_id,
            "title"              : name,
            "desc"               : name,
            "type"               : pocrec.type,
            "service_order_id"   : pocrec.booking_id,
            "selected_service_id": pocrec.service_id,  //TODO: make it multiple services
            "start"          : moment.tz(pocrec.service_start_date,timezone).toDate(), //start / end in Date is better as its more acceptable
            "end"            : moment.tz(pocrec.service_end_date,timezone).toDate(),
            "service_start_date": pocrec.service_start_date,
            "service_end_date": pocrec.service_end_date,
            "service_time_mins"  : (pocrec.service_end_date-pocrec.service_start_date)/(1000*60),
            "eventType"          : "Block",
            "color"               : color,
            "editable": false, 
            "resize": false, 
            "cssClass": "disabled-calendar-event" 
        })
 
    }
}