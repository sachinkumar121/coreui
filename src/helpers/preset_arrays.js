export default {
    get_pre_defined_segment_names()
    {
        return [
            {
                name: "New Customers in last 4 weeks",
                segment_name: 'new_last_4w'
            },
            {
                name: "Customers with no appointments in last 8 weeks",
                segment_name: 'customer_no_appoint_8w'
            },
            {
                name: "All customers",
                segment_name: 'all_customers'
            },
        ]    
    },


};