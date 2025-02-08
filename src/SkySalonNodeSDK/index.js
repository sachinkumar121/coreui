"use strict"
import axios from "axios";
import querystring from "querystring";

class SkySchedNodeSDK
{

    init_obj(  client_id, 
               client_secret,
               app_url_base = '',
               is_debug = false,
               proxy_host =  null, //'localhost', //-- when debugging with fiddler
               proxy_port = null//'8888',
               )
    {
        this.client_id           = client_id;
        this.client_secret       = client_secret;
        this.app_url_base        = app_url_base;
        this.ext_url_base        = app_url_base;
        this.api_url_base        = app_url_base+'v1/';
        this.login_data          = null;
        this.auth_token_var_name = 'token';
        this.debug               = is_debug;
        this.business_timezone   = null;
        this.in_refresh_request  = false;        
        if (this.client_id == null)
        {
            //temporarily disable throwing error to handle sso
           // throw new Error('SkySchedNodeSDK: client ID is empty');
            
        }
        // console.log("***** In Init Object ----- client_id:" + client_id);

    }
    constructor(client_id, 
                client_secret,
                app_url_base = '',
                is_debug = false,
                proxy_host =  null, //'localhost', //-- when debugging with fiddler
                proxy_port = null//'8888',
                )
    {
        this.init_obj(
            client_id, 
            client_secret,
            app_url_base,
            proxy_host, 
            proxy_port,
            is_debug)  
    }
    async update_base_url(url) {
        this.app_url_base = url;
        this.ext_url_base = url;
        this.api_url_base = url + 'v1/';
    }
    async business_destroy(data)
    {

        let url = this.api_url_base + "testing_routes/deletebusinessidrecs";
        return this.httpRequest(this, "POST", {url: url, skip_auth: true }, data)
    }

    async business_signup(signup_data)
    {

        let url = this.api_url_base + "signup";
        return this.httpRequest(this, "POST", {url: url, skip_auth: true }, signup_data )
    }
    
    async business_signup_verify(signup_verify_url)
    {

        let url = signup_verify_url;
        return this.httpRequest(this, "GET", {url: url, skip_auth: true }, null )
    }

    
    async business_signup_with_merchant_account(signup_data)
    {

        let url = this.api_url_base + "register_business/register_with_merchant_account";
        return this.httpRequest(this, "POST", {url: url, skip_auth: true }, signup_data )
    }
        
    async check_signup_status(data)
    {

        let url = this.api_url_base + "register_business/get_business_signup_status";
        return this.httpRequest(this, "POST", {url: url, skip_auth: true }, data )
    }
    async get_public_app_settings()
    {
        let url = this.api_url_base + "public_app_settings/get_public_app_admin_settings";
        return this.httpRequest(this, "GET", {url: url, skip_auth: true }, null )
    }
    
    async verify_code(data)
    {

        let url = this.api_url_base + "verification_codes/verify";
        return this.httpRequest(this, "POST", {url: url, skip_auth: true }, data )
    }
    async resend_verification_code(data)
    {

        let url = this.api_url_base + "verification_codes/resend";
        return this.httpRequest(this, "POST", {url: url, skip_auth: true }, data )
    }
    async get_resource_groups(data)
    {
        let url = this.api_url_base + "resource_groups";
        return this.httpRequest(this, "POST", {url: url }, data )
    }

    async get_resource_group(id)
    {
        let url = this.api_url_base + "resource_groups/" + id;
        return this.httpRequest(this, "GET", { url })
    }

    async add_resource_groups(data)
    {
        let url = this.api_url_base + "resource_groups/add";
        return this.httpRequest(this, "POST", {url: url }, data )
    }

    async edit_resource_groups(data)
    {
        let url = this.api_url_base + "resource_groups/edit";
        return this.httpRequest(this, "POST", {url: url }, data )
    }

    async delete_resource_groups(data)
    {
        let url = this.api_url_base + "resource_groups/delete";
        return this.httpRequest(this, "POST", {url: url }, data)
    }

    async check_or_update_g_user_name(data)
    {
        let url = this.api_url_base + "user_management/check_or_update_g_user_name";
        return this.httpRequest(this, "POST", { url }, data)
    }
    async update_g_user_name(data)
    {
        let url = this.api_url_base + "user_management/update_g_user_name";
        return this.httpRequest(this, "POST", { url }, data)
    }
    async list_resources(data)
    {
        let url = this.api_url_base + "user_management/list_resources";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async get_resources_in_group(data)
    {
        let url = this.api_url_base + "user_management/get_resources_in_group";
        return this.httpRequest(this, "POST", {url: url }, data )
    }

    
    async deactivate_resource(data)
    {
        let url = this.api_url_base + "user_management/deactivate_resource";
        return this.httpRequest(this, "POST", { url }, data)
    }

    async activate_resource(data)
    {
        let url = this.api_url_base + "user_management/activate_resource";
        return this.httpRequest(this, "POST", { url }, data)
    }

    async esp_get_config(data)
    {
        let url = this.api_url_base + "extsupportplugins/crispchat/get_config";
        return this.httpRequest(this, "POST", { url }, data)
    }
    
    async esp_save_config(data)
    {
        let url = this.api_url_base + "extsupportplugins/crispchat/save_config";
        return this.httpRequest(this, "POST", { url }, data)
    }

    async get_service_detail(data)
    {
        let url = this.api_url_base + "services/"+data.service_id;
        return this.httpRequest(this, "GET", {url: url } )
    }
    async get_service_categories(data)
    {

        let url = this.api_url_base + "service_category";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async add_service_category(data)
    {

        let url = this.api_url_base + "service_category/add";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async get_service_category_detail(data)
    {

        let url = this.api_url_base + "service_category/"+data.cat_id;
        return this.httpRequest(this, "GET", {url: url } )
    }
    async edit_service_category(data)
    {

        let url = this.api_url_base + "service_category/edit";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async delete_service_category(data)
    {
        let url = this.api_url_base + "service_category/delete";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async add_service(data)
    {
        let url = this.api_url_base + "services/add";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async bulk_add_services(data)
    {
        let url = this.api_url_base + "services/bulkadd";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async bulk_set_flex_times(data)
    {
        let url = this.api_url_base + "services/bulk_set_flex_times";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    
    async inventorySetting(data)
    {

        let url = this.api_url_base + "inventory/settings/status";
        return this.httpRequest(this, "PUT", {url: url }, data )
    }
    async get_product_category_detail(data)
    {

        let url = this.api_url_base + "product_category/"+data.cat_id;
        return this.httpRequest(this, "GET", {url: url } )
    }
    async getFile(path)
    {

        let url = this.ext_url_base + path;
        return this.httpRequest(this, "GET", {url: url } )
    }
    async get_product_category(data)
    {

        let url = this.api_url_base + "product_category";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async add_product_category(data)
    {

        let url = this.api_url_base + "product_category/add";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async edit_product_category(data)
    {

        let url = this.api_url_base + "product_category/edit";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async delete_product_category(data)
    {
        let url = this.api_url_base + "product_category/delete";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async get_products_list(data)
    {
        let url = this.api_url_base + "products";
        return this.httpRequest(this, "POST", {url: url },data )
    }
    async add_product(data)
    {
        let url = this.api_url_base + "products/add";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async edit_product(data)
    {
        let url = this.api_url_base + "products/edit";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async delete_product(data)
    {
        let url = this.api_url_base + "products/delete";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async set_default_inventory_data(data)
    {
        let url = this.api_url_base + "products/set_default_inventory_data";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async get_product_detail(data)
    {
        let url = this.api_url_base + "products/"+data.product_id;
        if (data.get_stock_data !== undefined)
        {
            url += "?get_stock_data="+data.get_stock_data;
        }
        return this.httpRequest(this, "GET", {url: url } )
    }
    async list_services(data)
    {
        let url = this.api_url_base + "services";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async edit_service(data)
    {
        let url = this.api_url_base + "services/edit";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async delete_service(data)
    {
        let url = this.api_url_base + "services/delete";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async add_employee(data)
    {
        let url = this.api_url_base + "stylist/add";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async get_packages_list(data)
    {
        let url = this.api_url_base + "packages";
        return this.httpRequest(this, "POST", {url: url },data )
    }
    async add_package(data)
    {
        let url = this.api_url_base + "packages/add";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async edit_package(data)
    {
        let url = this.api_url_base + "packages/update";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async get_package_detail(data)
    {
        let url = this.api_url_base + "packages/"+data.package_id;
        return this.httpRequest(this, "GET", {url: url } )
    }
    async get_purchased_packages(data)
    {
        let url = this.api_url_base + "packages/purchased";
        return this.httpRequest(this, "POST", {url: url }, data )
    } 
    async cancel_purchased_packages(data)
    {
        let url = this.api_url_base + "packages/purchased/cancel";
        return this.httpRequest(this, "DELETE", {url: url }, data )
    } 

    async send_package_codes_to_ff(data)
    {
        let url = this.api_url_base + "packages/send_package_codes_to_recipients";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    
    async get_package_usage_data(data){
        let url = this.api_url_base + "packages/get_package_usage_data";
        return this.httpRequest(this, "POST", {url: url },data );
    }
   
    async create_purchase_order(data){
        let url = this.api_url_base + "purchase_order/create";
        return this.httpRequest(this, "POST", {url: url },data );
    }

    async add_soap_notes(data)
    {
        let url = this.api_url_base + "soap_notes/add";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async edit_soap_notes(data)
    {
        let url = this.api_url_base + "soap_notes/edit";
        return this.httpRequest(this, "PUT", {url: url }, data )
    }
    async get_products_services()
    {
        let url = this.api_url_base + "get_products_services";
        return this.httpRequest(this, "POST", {url: url }, {} )
    }
    async get_availability(data)
    {
        let url = this.api_url_base + "availability?user_id="+data.user_id+"&date="+data.date;
        return this.httpRequest(this, "GET", {url: url } )
    }
    async update_availability(data)
    {
        let url = this.api_url_base + "availability";
        return this.httpRequest(this, "PUT", {url: url }, data )
    }
    async preview_availability(data)
    {
        let url = this.api_url_base + "preview_availability";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async tax_percentage()
    {
        let url = this.api_url_base + "tax_percentage";
        return this.httpRequest(this, "GET", {url: url } )
    }
    async get_tax_data()
    {
        let url = this.api_url_base + "settings/tax_data";
        return this.httpRequest(this, "GET", {url: url } )
    }
    async update_tax_data(data)
    {
        let url = this.api_url_base + "settings/tax_data";
        return this.httpRequest(this, "PUT", {url: url },data )
    }
    async get_business_user_id(data)
    {
        let url = this.api_url_base + "stylist/get_business_user_id";
        return this.httpRequest(this, "POST", {url: url },data )
    }
    async dashboard_analytics(data)
    {
        let url = this.api_url_base + "analytics/earnings";
        return this.httpRequest(this, "POST", { url: url, 
                                                cache_key: 'dashboard_analytics',
                                                cache_ttl:  200},
                                                data )
    }
    async getReportsList()
    {
        let url = this.api_url_base + "report_meta_data";
        return this.httpRequest(this, "GET", {url: url } )
    }
    async performance_bonus_report(data)
    {
        let url = this.api_url_base + "request_reports/performance_bonus_report";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async valuation_report(data)
    {
        let url = this.api_url_base + "request_reports/valuation_report";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async revenue_report(data)
    {
        let url = this.api_url_base + "request_reports/revenue_report";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async top_item_report(data)
    {
        let url = this.api_url_base + "request_reports/top_selling_services";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async inventory_report(data)
    {
        let url = this.api_url_base + "request_reports/inventory_report";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async sales_summary_report(data)
    {
        let url = this.api_url_base + "request_reports/sales_summary_report";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async clover_and_app_reconcilination_report(data)
    {
        let url = this.api_url_base + "request_reports/clover_register_sched_app_tax_reconcilination_report";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async invoice_customer_payment_transactions_raw(data)
    {
        let url = this.api_url_base + "request_reports/invoice_customer_payment_transactions_raw";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async messaging_all_credits_usage_raw(data)
    {
        let url = this.api_url_base + "request_reports/messaging_all_credits_usage_raw";
        return this.httpRequest(this, "POST", {url: url }, data )
    }

    async booking_report(data)
    {
        let url = this.api_url_base + "request_reports/booking_report";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async all_booking_report(data)
    {
        let url = this.api_url_base + "request_reports/all_booking_report";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async customer_report(data)
    {
        let url = this.api_url_base + "request_reports/customer_report";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async report_csv(data)
    {
        let url = this.api_url_base + "request_reports/csv";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async add_referral_plans(data)
    {
        let url = this.api_url_base + "referral_plans";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async get_referral_plans_list(data)
    {
        let url = this.api_url_base + 'referral_plans?search='+data.search+'&page_no='+data.page;
        return this.httpRequest(this, "GET", {url: url } )
    }
    async get_referral_plan_detail(plan_id)
    {
        let url = this.api_url_base + "referral_plans/"+plan_id;
        return this.httpRequest(this, "GET", {url: url } )
    }
    async update_referral_plan_detail(plan_id,data)
    {
        let url = this.api_url_base + "referral_plans/"+plan_id;
        return this.httpRequest(this, "PUT", {url: url },data )
    }
    async add_referral_register(data)
    {
        let url = this.api_url_base + "referral_register";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async get_referral_register_list(data)
    {
        let url = this.api_url_base + 'referral_register?search='+data.search+'&page_no='+data.page;
        return this.httpRequest(this, "GET", {url: url } )
    }
    async calculate_vestReferral(data)
    {
        let url = this.api_url_base + 'referral_register/vestReferral';
        return this.httpRequest(this, "PUT", {url: url },data )
    }
    async get_referral_register_detail(id)
    {
        let url = this.api_url_base + "referral_register/"+id;
        return this.httpRequest(this, "GET", {url: url } )
    }
    async update_referral_register_detail(id,data)
    {
        let url = this.api_url_base + "referral_register/"+id;
        return this.httpRequest(this, "PUT", {url: url },data )
    }
    async getBookingList(data){
        let url = this.api_url_base + "get_all_bookings/search";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async getBookingDetail(data){
        let url = this.api_url_base + "booking_detail";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async createBooking(data){
        let url = this.api_url_base + "booking/create";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async cancelBooking(data){
        let url = this.api_url_base + "booking/cancel_booking";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async updateBooking(data){
        let url = this.api_url_base + "booking/update";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    
    async settleReleasePayments(data){
        let url = this.api_url_base + "booking/settle_release_payments";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async addRemoveCancellationCharges(data){
        let url = this.api_url_base + "booking/modify_cancellation_charges";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async takePaymentForBookingWithCardOnFile(data){
        let url = this.api_url_base + "booking/take_payment_with_card_on_file";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async getAvailableResourcesForBooking(data){
        let url = this.api_url_base + "booking/get_available_resources_for_booking";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async changeResourceForBooking(data){
        let url = this.api_url_base + "booking/change_resource_for_booking";
        return this.httpRequest(this, "POST", {url: url },data );
    }
   
    async takePaymentForPOWithCardOnFile(data){
        let url = this.api_url_base + "purchase_order/take_payment_with_card_on_file";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async POEditCoupons(data){
        let url = this.api_url_base + "purchase_order/edit_coupons";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async get_profile(data){
        let url = this.api_url_base + "profile/"+data.type;
        return this.httpRequest(this, "GET", {url: url } );
    }
    async update_profile(type, data)
    {
        let url = this.api_url_base + "profile/"+type;
        let options = {url: url }
        if(type == 1)
        {
            options.content_type_header = "multipart/form-data"
        }
        return this.httpRequest(this, "PUT", options,data );
    }
    async update_profile_pic(data)
    {
        let url = this.api_url_base + "profile/upload_image";
        let options = {url: url }
        options.content_type_header = "multipart/form-data"
        return this.httpRequest(this, "POST", options,data );
    }
    async update_profile_picv2(business_id, user_id, data)
    {
        //update_profile_picv2 has separate fields because we don't want to send
        //in form data since multipart forms are handled for upload only in this api
        let url = this.api_url_base + "user_management/upload_image/" +
                     user_id.toString() + "/" +
                     business_id.toString();
        let options = {url: url }
        options.content_type_header = "multipart/form-data"
        return this.httpRequest(this, "POST", options,data );
    }
    async file_import_csv(data){
        let url = this.api_url_base + "file_import_export/import_csv";
        let options = {url: url }
            options.content_type_header = "multipart/form-data"
        return this.httpRequest(this, "POST", options,data );
    }
    async get_column_headers(file_usage) {
        let url = this.api_url_base + "file_import_export/import/column_headers/"+file_usage;
        return this.httpRequest(this, "GET", { url });
    }
    
    async forgot_password(data){
        let url = this.api_url_base + "forgot_password";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async change_password(data){
        let url = this.api_url_base + "change_password";
        return this.httpRequest(this, "PUT", {url: url },data );
    }
    async get_customer_list(data){
        let url = this.api_url_base + "user_management/list_customers";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async get_customer_detail(id){
        let url = this.api_url_base + "customers/"+id;
        return this.httpRequest(this, "GET", {url: url } );
    }
    async add_customer(data){
        let url = this.api_url_base + "user_management/add_user";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async update_customer(data){
        let url = this.api_url_base + "user_management/update_user";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async get_users_list(data){
        let url = this.api_url_base + "user_management/list_employees";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async get_colleagues(data){
        let url = this.api_url_base + "department_teams/get_colleagues";
        return this.httpRequest(this, "POST", { url }, data);
    }
    async get_user_teams(data){
        let url = this.api_url_base + "department_teams/user_teams";
        return this.httpRequest(this, "POST", { url }, data);
    }
    async list_user_cards_on_file(data){
        let url = this.api_url_base + "user_management/list_user_cof";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async delete_user_cards_on_file(data){
        let url = this.api_url_base + "user_management/delete_cof";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    
    async delete_user(data){
        let url = this.api_url_base + "user_management/delete_user";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async get_user_ui_preferences(id){
        let url = this.api_url_base + "user_management/preferences/ui_prefs/"+id;
        return this.httpRequest(this, "GET", {url: url } );
    }
    async update_user_ui_preferences(data){
        let url = this.api_url_base + "user_management/preferences/ui_prefs";
        return this.httpRequest(this, "PUT", {url: url },data);
    }
   
    async add_user(data){
        let url = this.api_url_base + "stylist/add";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async get_user_detail(data){
        let url = this.api_url_base + "stylist/detail";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async edit_user(data){
        let url = this.api_url_base + "stylist/edit";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async get_scheduled_timeoff_list(data){
        let url = this.api_url_base + "availability/get_scheduled_time_off";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async create_edit_scheduled_timeoff(data){
        let url = this.api_url_base + "availability/create_edit_scheduled_time_off";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async delete_scheduled_timeoff(data){
        let url = this.api_url_base + "availability/delete_scheduled_time_off";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async getNonBookingProviderOccupancyList(data){
        let url = this.api_url_base + "availability/get_non_booking_provider_occupancy";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async get_invoices_list(data){
        let url = this.api_url_base + "invoices/list";
        return this.httpRequest(this, "POST", {url: url },data );
    }

    async get_standalonepurchase_list(data){
        let url = this.api_url_base + "standalonepurchase/list";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async get_standalonepurchase_cards_on_file(data){
        let url = this.api_url_base + "standalonepurchase/get_cards_on_file";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async delete_standalonepurchase_cards_on_file(data){
        let url = this.api_url_base + "standalonepurchase/delete_cards_on_file";
        return this.httpRequest(this, "POST", {url: url },data );
    }

    async get_automatic_purchase_setup_list(data){
        let url = this.api_url_base + "standalonepurchase/get_automatic_purchase_setup_list";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    
    async cancel_automatic_purchase_setup(data){
        let url = this.api_url_base + "standalonepurchase/cancel_automatic_purchase_setup";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async pause_unpause_automatic_purchase_setup(data){
        let url = this.api_url_base + "standalonepurchase/pause_unpause_automatic_purchase_setup";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async one_time_purchase_automatic_setup(data){
        let url = this.api_url_base + "standalonepurchase/one_time_purchase_automatic_setup";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async get_automatic_purchase_billing_history(data){
        let url = this.api_url_base + "standalonepurchase/get_automatic_purchase_billing_history";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async make_standalonepurchase_cart(data){
        let url = this.api_url_base + "standalonepurchase/make_purchase_order";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async get_purchase_orders(data){
        let url = this.api_url_base + "standalonepurchase/get_purchase_orders";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async cancel_purchase_orders(data){
        let url = this.api_url_base + "standalonepurchase/cancel_purchase_order";
        return this.httpRequest(this, "POST", {url: url },data );
    }

    async standalone_list_purchased_packages(data){
        let url = this.api_url_base + "standalonepurchase/list_purchased_packages";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async standalone_consume_purchased_package(data){
        let url = this.api_url_base + "standalonepurchase/consume_purchased_packages";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    
    
    
    
    async get_invoices_payments_list(data){
        let url = this.api_url_base + "invoices/payments/list";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async get_invoices_audit_logs(data){
        let url = this.api_url_base + "invoices/logs";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async get_invoice_detail(data){
        let url = this.api_url_base + "invoices/detail";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async get_invoice_csv_data(){
        let url = this.api_url_base + "invoices/csv_data";
        return this.httpRequest(this, "GET", {url: url } );
    }
    async get_invoice_payment_provider_rec_details(id){
        let url = this.api_url_base + "invoices/lookup_transaction_data/" + id;
        return this.httpRequest(this, "GET", {url: url } );
    }
    async manage_invoice_refund_payment(data){
        let url = this.api_url_base + "manage_invoice/payment_refund";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async getBusinessList(search_string,page_no=1){
        let url = this.api_url_base + "business?search="+search_string+"&page_no="+page_no;
        return this.httpRequest(this, "GET", {url: url });
    }
    async getBusinessListAdvanced(search_owner_name,search_business_name,search_email_phone,page_no=1, 
                                sort_by_signup_date_first=false,
                                include_last_business_activity=false,
                                text_messaging_disabled_days=0){
        let query = "";
        query += "search_owner_name=" + search_owner_name
        query += "&search_business_name=" + search_business_name
        query += "&search_email_phone=" + search_email_phone
        query += "&page_no="+page_no
        query += "&sort_by_signup_date_first="+(sort_by_signup_date_first == true?1:0)
        query += "&include_last_business_activity="+(include_last_business_activity == true?1:0)
        query += "&text_messaging_disabled_days="+text_messaging_disabled_days
     
        
        let url = this.api_url_base + "business?" + query;
        return this.httpRequest(this, "GET", {url: url });
    }
    async getMultiLocationList(search_owner_name, search_business_name,search_email_phone,page_no=1, 
                                sort_by_signup_date_first=false,
                                include_last_business_activity=false,
                                text_messaging_disabled_days=0)
    {
        let query = "";
        query += "search_owner_name=" + search_owner_name
        query += "&search_business_name=" + search_business_name
        query += "&search_email_phone=" + search_email_phone
        query += "&page_no="+page_no
        query += "&sort_by_signup_date_first="+(sort_by_signup_date_first == true?1:0)
        query += "&include_last_business_activity="+(include_last_business_activity == true?1:0)
        query += "&text_messaging_disabled_days="+text_messaging_disabled_days
     
        
        let url = this.api_url_base + "manage_multi_locations?" + query;
        return this.httpRequest(this, "GET", {url: url });
    }
    async getMultiLocationListShort()
    {
      
        let url = this.api_url_base + "manage_multi_locations?minimal=1";
        return this.httpRequest(this, "GET", {url: url });
    }
    async multi_location_add_location(signup_data)
    {

        let url = this.api_url_base + "manage_multi_locations/add";
        //Do not skip auth as we need auth data to be sent
        return this.httpRequest(this, "POST", {url: url}, signup_data )
    }
    async multi_location_switch_location(data)
    {

        let url = this.api_url_base + "manage_multi_locations/switch_location";
        //Do not skip auth as we need auth data to be sent
        return this.httpRequest(this, "POST", {url: url}, data )
    }

    async perform_multi_location_link(data){
        let url = this.api_url_base + "manage_multi_locations/link_businesses";
        return this.httpRequest(this, "POST", {url: url },data);
    }
    
    async exitLocationImpersonate()
    {

        let url = this.api_url_base + "manage_multi_locations/exit_location_switch";
        return this.httpRequest(this, "POST", {url: url } )
    }
    async multi_location_copy_items_from_business(data)
    {

        let url = this.api_url_base + "manage_multi_locations/copy_items_from_business";
        //Do not skip auth as we need auth data to be sent
        return this.httpRequest(this, "POST", {url: url}, data )
    }
  
    async get_business_detail(business_id){
        let url = this.api_url_base + "business/"+business_id;
        return this.httpRequest(this, "GET", {url: url });
    }
    async get_business_last_activity(business_id){
        let url = this.api_url_base + "business/last_activitity/"+business_id;
        return this.httpRequest(this, "GET", {url: url });
    }
    async update_business_detail(data){
        let url = this.api_url_base + "business";
        return this.httpRequest(this, "PUT", {url: url },data);
    }
    async get_business_users(data){
        let url = this.api_url_base + "business/users";
        return this.httpRequest(this, "POST", {url: url },data);
    }
    async getCustomerList(data){
        let url = this.api_url_base + "booking/customers";
        return this.httpRequest(this, "POST", {url: url },data);
    }

    async toggle_booking_confirmation(data) {
        let url = this.api_url_base + "booking/mark_booking_confirm";
        return this.httpRequest(this, "POST", { url }, data);
    }
    
    
    async get_paperwork_definitions_list(data){
        let url = this.api_url_base + "paperwork_definitions/";
        return this.httpRequest(this, "POST", {url: url },data);
    }
    async get_paperwork_definition(paperwork_id){
        let url = this.api_url_base + "paperwork_definitions/"+paperwork_id;
        return this.httpRequest(this, "GET", {url: url });
    }
    async add_paperwork_definition(data){
        let url = this.api_url_base + "paperwork_definitions/add";
        return this.httpRequest(this, "POST", {url: url },data);
    }
    async edit_paperwork_definition(data){
        let url = this.api_url_base + "paperwork_definitions/edit";
        return this.httpRequest(this, "POST", {url: url },data);
    }
    async delete_paperwork_definition(data){
        let url = this.api_url_base + "paperwork_definitions/delete";
        return this.httpRequest(this, "POST", {url: url },data);
    }
    async generate_agreement_pdf(data){
        let url = this.api_url_base + "customer_paperwork/generate-agreement-pdf";
        return this.httpRequest(this, "POST", { url },data);
    }
    async get_customer_paperwork_list(data){
        let url = this.api_url_base + "customer_paperwork/get";
        return this.httpRequest(this, "POST", {url: url },data);
    }
    async get_paperwork_log_entries(data){
        let url = this.api_url_base + "customer_paperwork/get_paperwork_log_entries";
        return this.httpRequest(this, "POST", {url: url },data);
    }
    async delete_customer_paperwork(data){
        let url = this.api_url_base + "customer_paperwork/delete";
        return this.httpRequest(this, "POST", {url: url },data);
    }
    async get_legal_agreements_waivers(data){
        let url = this.api_url_base + "legal_ag_waivers/listlaw";
        return this.httpRequest(this, "POST", {url: url },data);
    }
    
    async delete_all_business_recs(data){
        let url = this.api_url_base + "adminops/delete_all_business_records";
        return this.httpRequest(this, "DELETE", {url: url },data);
    }
   
    async delete_all_products_and_services(data){
        let url = this.api_url_base + "adminops/delete_all_products_and_services";
        return this.httpRequest(this, "DELETE", {url: url },data);
    }
    async delete_all_customers(data){
        let url = this.api_url_base + "adminops/delete_all_customers";
        return this.httpRequest(this, "DELETE", {url: url },data);
    }
    
    async getrecordsData(token){
        let url = this.api_url_base + "privacymgmt/verify_user/"+token;
        return this.httpRequest(this, "GET", {url: url });
    }
    async action_recordsData(data){
        let url = this.api_url_base + "privacymgmt/records_action";
        return this.httpRequest(this, "POST", {url: url },data);
    }
    async getBusinessDetail(accesskey){
        let url = this.api_url_base + "privacymgmt/"+accesskey;
        return this.httpRequest(this, "GET", {url: url });
    }
    async getBusinessRecords(data){
        let url = this.api_url_base + "privacymgmt/records";
        return this.httpRequest(this, "POST", {url: url },data);
    }
    // async addMessage(data){
    //     let url = this.api_url_base + "messages";
    //     return this.httpRequest(this, "POST", {url: url },data);
    // }
    // async getMessageList(){
    //     let url = this.api_url_base + "messages";
    //     return this.httpRequest(this, "GET", {url: url });
    // }
    async addMessageCustomer(data){
        let url = this.api_url_base + "messaging_transactions/cust_int/receive";
        return this.httpRequest(this, "POST", {url: url },data);
    }
    async addMessage(data){
        let url = this.api_url_base + "messaging_transactions/cust_int/send";
        return this.httpRequest(this, "POST", {url: url },data);
    }
    async getMessageList(customer_id,data, conversation_id = null){
        let url = this.api_url_base + "messaging_transactions/cust_int?customer_id="+customer_id;
        if (conversation_id) {
            url += `&conversation_id=${conversation_id}`;
        }
        return this.httpRequest(this, "POST", {url: url },data);
    }
    async getMessageCreditsPurchaseHistory(customer_id,data){
        let url = this.api_url_base + "messaging_transactions/credits/get_purchase_history";
        return this.httpRequest(this, "POST", {url: url },data);
    }

    async getBusinessMessageCenterMessages(data){
        let url = this.api_url_base + "messaging_transactions/business_message_center";
        return this.httpRequest(this, "POST", {url: url },data);
    }
    async getBusinessMessagesWeeklyStats(data){
        let url = this.api_url_base + "messaging_transactions/message_credit_usage_stats_weekly";
        return this.httpRequest(this, "POST", {url: url },data);
    }
    async getMessagingRateTable(data){
        let url = this.api_url_base + "messaging_transactions/get_messaging_rate_table";
        return this.httpRequest(this, "GET", {url: url },data);
    }
    
    async setEnableSimpleBusinesshoursFlag(data){
        let url = this.api_url_base + "settings/use_simple_business_hours";
        return this.httpRequest(this, "PUT", {url: url },data );
    }
    async get_additional_settings(){
        let url = this.api_url_base + "settings/additional";
        return this.httpRequest(this, "GET", {url: url } );
    }
    async get_business_messaging(data){
        let url = this.api_url_base + "settings/business_messaging";
        let obj = { url };
        if (data && 
            data.cache_but_remote_first !== undefined &&
            data.cache_but_remote_first)
        {
            obj.cache_but_remote_first = data.cache_but_remote_first;
        }
        if(data)
        {
            let cacheTtl = 8 * 60 * 60; // 8 hour.
            obj.cache_key = 'business_messaging';
            obj.cache_ttl = cacheTtl;
        }
        
       
        return this.httpRequest(this, "GET", obj );
    }
    async get_booking_settings(){
        let url = this.api_url_base + "settings/booking_settings";
        return this.httpRequest(this, "GET", {url: url } );
    }
    async get_receipt_print_settings(){
        let url = this.api_url_base + "settings/receipt_printer_settings";
        return this.httpRequest(this, "GET", {url: url } );
    }
    async update_receipt_print_settings(data){
        let url = this.api_url_base + "settings/receipt_printer_settings";
        return this.httpRequest(this, "PUT", {url: url },data );
    }

    async update_online_booking_settings(data){
        let url = this.api_url_base + "settings/online_commerce_settings";
        return this.httpRequest(this, "PUT", {url: url },data );
    }
    async update_web_widget_settings(data){
        let url = this.api_url_base + "settings/web_widget_setting";
        return this.httpRequest(this, "PUT", {url: url },data );
    }
    async update_business_messaging(data){
        let url = this.api_url_base + "settings/business_messaging";
        return this.httpRequest(this, "PUT", {url: url },data );
    }
    async update_booking_reminder_settings(data){
        let url = this.api_url_base + "settings/booking_reminder_settings";
        return this.httpRequest(this, "PUT", {url: url },data );
    }
   
    async update_booking_settings(data){
        let url = this.api_url_base + "settings/booking_settings";
        return this.httpRequest(this, "PUT", {url: url },data );
    }
    async update_standard_resource_settings(data){
        let url = this.api_url_base + "settings/update_standard_resource_settings";
        return this.httpRequest(this, "PUT", {url: url },data );
    }

    async rescheduleBooking(data){
        let url = this.api_url_base + "reschedule_booking/resched_by_employee";
        return this.httpRequest(this, "PUT", {url: url },data );
    }
    async addSimpleBusinesshours(data){
        let url = this.api_url_base + "user_management/save_simple_business_hours";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async addAdvancedBusinesshours(data){
        let url = this.api_url_base + "user_management/save_advanced_business_hours";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async convertSimpleBHToAdvancedBH(data){
        let url = this.api_url_base + "user_management/convert_sbh_to_abh";
        return this.httpRequest(this, "POST", { url: url },data);
    }
    async delete_soap_notes(data)
    {
        let url = this.api_url_base + "soap_notes/delete";
        return this.httpRequest(this, "PUT", {url: url }, data )
    }
    async list_soap_notes(data)
    {
        let url = this.api_url_base + "soap_notes/list";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async get_job_process_status(rec_id)
    {
        let url = this.api_url_base + "job_process_status/" +rec_id;
        return this.httpRequest(this, "GET", {url: url } )
    }
    async get_sso_token_for_ak(access_key)
    {
        let url = this.api_url_base + "ext/single_sign_on_unauth/get_token_for_key/" +access_key;
        return this.httpRequest(this, "GET", {url: url, skip_auth:true } )
    }
    async get_short_ak_for_token(state_data)
    {
        let url = this.api_url_base + "single_sign_on/get_short_access_key_for_token/";
        if (state_data !=null)
        {
            url += state_data //addrioton
        }
        return this.httpRequest(this, "POST", {url: url } )
    }
    
    async adminImpersonate(data)
    {
        let url = this.api_url_base + "adminops/impersonate";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async exitImpersonate()
    {
        let url = this.api_url_base + "adminops/exit_impersonate";
        return this.httpRequest(this, "POST", {url: url } )
    }
    async resetPassword(data)
    {
        let url = this.api_url_base + "user_management/admin_reset_password";
        return this.httpRequest(this, "POST", {url: url },data )
    }
    async undeleteUser(data)
    {
        let url = this.api_url_base + "user_management/undelete_user";
        return this.httpRequest(this, "POST", {url: url },data )
    }

    async addBulkUser(data)
    {
        let url = this.api_url_base + "user_management/bulkaddusers";
        return this.httpRequest(this, "POST", {url: url }, data);
    }
    
    async copyOrgEmpUsersToSuperOrg(data)
    {
        let url = this.api_url_base + "adminops/copy_org_emp_users_to_super_org";
        return this.httpRequest(this, "POST", {url: url },data )
    }
    async disableAndReleaseTextMessaging(data)
    {
        let url = this.api_url_base + "adminops/disable_and_release_text_messaging";
        return this.httpRequest(this, "POST", {url: url },data )
    }
    async getSuperOrgCustomerId(business_user_id)
    {
        let url = this.api_url_base + "adminops/get_super_org_customer_id/"+business_user_id;
        return this.httpRequest(this, "GET", {url: url });
    }
    async makeBusinessAsPartner(data)
    {
        let url = this.api_url_base + "adminops/make_business_as_partner";
        return this.httpRequest(this, "POST", { url }, data);
    }
    async makeRegularBusiness(data)
    {
        let url = this.api_url_base + "adminops/make_partner_as_regular_business";
        return this.httpRequest(this, "POST", { url }, data);
    }
    async get_available_subscription_plans(data)
    {
        let url = this.api_url_base + "subscription_info/minimized_fetch_subscriptions";
        return this.httpRequest(this, "POST", {url: url },data )
    }
    async changeAppPlanLevel(data)
    {
        let url = this.api_url_base + "adminops/change_plan_level";
        return this.httpRequest(this, "POST", {url: url },data )
    } 
    async get_app_system_logs(data)
    {
        let url = this.api_url_base + "adminops/get_app_system_logs";
        return this.httpRequest(this, "POST", {url: url },data )
    } 
    async get_app_admin_settings(data)
    {
        let url = this.api_url_base + "adminops/get_app_admin_settings";
        return this.httpRequest(this, "GET", {url: url },data )
    } 
    async update_app_admin_settings(data)
    {
        let url = this.api_url_base + "adminops/update_app_admin_settings";
        return this.httpRequest(this, "PUT", {url: url },data )
    }
    async get_app_logs(data)
    {
        let url = this.api_url_base + "app_logs/view";
        return this.httpRequest(this, "POST", {url: url },data )
    }
    async get_booking_logs(data)
    {
        let url = this.api_url_base + "app_logs/view_booking_log";
        return this.httpRequest(this, "POST", {url: url },data )
    }
    async getIntegrationProviderStatus(feature_name,data){
        let url = this.api_url_base + "authintegration/get_integration_status/"+feature_name;
        return this.httpRequest(this, "POST", {url: url },data);
    }

    
    async getCouponsList(data)
    {
        let url = this.api_url_base + "coupons";
        return this.httpRequest(this, "POST", {url: url },data);
    }
    
    async getCouponDetail(data)
    {
        let url = this.api_url_base + "coupons";
        return this.httpRequest(this, "POST", {url: url },data);
    }
    async addCoupon(data)
    {
        let url = this.api_url_base + "coupons/add";
        return this.httpRequest(this, "POST", {url: url },data);
    }
    async editCoupon(data)
    {
        let url = this.api_url_base + "coupons/edit";
        return this.httpRequest(this, "POST", {url: url },data);
    }
    async deleteCoupon(data)
    {
        let url = this.api_url_base + "coupons/delete";
        return this.httpRequest(this, "POST", {url: url },data);
    }
   
    async addGraceMessageCredits(data)
    {
        let url = this.api_url_base + "adminops/add_grace_message_credits";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async reExecuteBusinessVerify(data)
    {
        let url = this.api_url_base + "adminops/reexecute_verify_business";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async disableBusinessSetupWizard(data)
    {
        let url = this.api_url_base + "adminops/disable_setupwizard_business";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    async toggleBookingLogs(data)
    {
        let url = this.api_url_base + "adminops/toggle_booking_logs";
        return this.httpRequest(this, "POST", {url: url }, data )
    }
    
    async sendMsgTakePaymentForInvoiceOnDevice(data){
        let url = this.api_url_base + "invoices/take_payment_on_device";
        return this.httpRequest(this, "POST", {url: url },data );
    }

    async sendMsgPrintInvoiceOnDevice(data){
        let url = this.api_url_base + "invoices/print_invoice_on_device";

        return this.httpRequest(this, "POST", {url: url },data );
    }
    async sendMsgRefundInvoiceOnDevice(data){
        let url = this.api_url_base + "invoices/refund_invoice_on_device";
        
        return this.httpRequest(this, "POST", {url: url },data );
    }
    
    async get_departments_list(data){
        let url = this.api_url_base + "department_teams/list";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async add_edit_department(data){
        let url = this.api_url_base + "department_teams/add_edit";
        return this.httpRequest(this, "POST", {url: url },data);
    }
    async delete_department(data){
        let url = this.api_url_base + "department_teams/delete";
        return this.httpRequest(this, "POST", {url: url },data);
    }

    async list_marketing_campaigns(data){
        let url = this.api_url_base + "manage_marketing_campaigns/list";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async get_marketing_campaign_detail(data){
        let url = this.api_url_base + "manage_marketing_campaigns/detail";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async add_edit_marketing_campaign(data){
        let url = this.api_url_base + "manage_marketing_campaigns/add_edit";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async delete_marketing_campaign(data){
        let url = this.api_url_base + "manage_marketing_campaigns/delete";
        return this.httpRequest(this, "DELETE", {url: url },data );
    }
    async run_once_manual_marketing_campaign(data){
        let url = this.api_url_base + "manage_marketing_campaigns/run_manual_now";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async send_single_test_message_marketing_campaign(data){
        let url = this.api_url_base + "manage_marketing_campaigns/send_single_test_message";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async marketing_request_cancel_campaign_run(data){
        let url = this.api_url_base + "manage_marketing_campaigns/request_campaign_run_cancel";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async marketing_deactivate_campaign(data){
        let url = this.api_url_base + "manage_marketing_campaigns/deactivate_campaign";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async marketing_activate_campaign(data){
        let url = this.api_url_base + "manage_marketing_campaigns/activate_campaign";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    async marketing_get_performance_data(data){
        let url = this.api_url_base + "manage_marketing_campaigns/get_marketing_campaign_performance";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    
    async list_marketing_templates(data){
        let url = this.api_url_base + "manage_marketing_templates/listtemplates";
        return this.httpRequest(this, "POST", {url: url },data );
    }
    
    
    // ****************************** Infrastructure ******************************
    // ****************************** Infrastructure ******************************
    // ****************************** Infrastructure ******************************
    async testpost(data)
    {

        let url = this.api_url_base + "testing_routes/testpost";
        return this.httpRequest(this, "POST", {url: url, skip_auth: true }, data )
    }
    async testget(data)
    {
        let qs = data? querystring.stringify(data) : null;
        let url = this.api_url_base + "testing_routes/testget";
        if (qs)
        {
            url += "?"+qs;
        }
        return this.httpRequest(this, "GET", {url: url, skip_auth: true }, null );
    }
    async authtestpost(data, skip_auto_auth = false)
    {

        let url = this.api_url_base + "testing_r3/authtestpost";
        return this.httpRequest(this, "POST", {url: url,skip_auth: skip_auto_auth }, data )
    }
    async authtestget(data, skip_auto_auth = false)
    {
        let qs = data? querystring.stringify(data) : null;
        let url = this.api_url_base + "testing_r3/authtestget";
        if (qs)
        {
            url += "?"+qs;
        }
        
        return this.httpRequest(this, "GET", {url: url, skip_auth: skip_auto_auth  }, null );
    }
    async apply_identity_token(ret, client_details)
    {
        if (this.debug)
        {
            console.log("SDK Login apply_identity_token : ");
            console.log(ret);
        }
        
        let was_successful = (ret && ret.status == 1)? true: false;

        if(was_successful)
        {
            this.logout();
            //Going forward, don't store client_id & secret
            //this.client_id     = client_details.client_id;
            //this.client_secret = client_details.client_secret;
            //console.log("IN APPLY: saving state.... ");
            //console.log(ret)
            this.login_data    = ret;
            this.doSaveState();
        }
        return was_successful;
    }

    async get_subscriptions_list(data)
    {
        let url = this.api_url_base + "subscriptions/list";
        return this.httpRequest(this, "POST", { url }, data);
    }
    async add_subscription(data)
    {
        let url = this.api_url_base + "subscriptions/create";
        return this.httpRequest(this, "POST", { url }, data);
    }
    async get_subscription_detail(subscription_id)
    {
        let url = this.api_url_base + "subscriptions/" + subscription_id;
        return this.httpRequest(this, "GET", { url });
    }
    async edit_subscription(data)
    {
        let url = this.api_url_base + "subscriptions/" + data._id;
        return this.httpRequest(this, "PUT", { url }, data);
    }
    async delete_subscription(subscription_id)
    {
        let url = this.api_url_base + "subscriptions/" + subscription_id;
        return this.httpRequest(this, "DELETE", { url });
    }

    async get_quotes_list(data)
    {
        let url = this.api_url_base + "quotes/list";
        return this.httpRequest(this, "GET", { url }, data);
    }
    async add_quote(data)
    {
        let url = this.api_url_base + "quotes/create";
        return this.httpRequest(this, "POST", { url }, data);
    }
    async get_quote_detail(quote_id)
    {
        let url = this.api_url_base + "quotes/" + quote_id;
        return this.httpRequest(this, "GET", { url });
    }
    async edit_quote(data)
    {
        let url = this.api_url_base + "quotes/" + data._id;
        return this.httpRequest(this, "PUT", { url }, data);
    }
    async delete_quote(quote_id)
    {
        let url = this.api_url_base + "quotes/" + quote_id;
        return this.httpRequest(this, "DELETE", { url });
    }

    async get_quote_category_list(data)
    {
        let url = this.api_url_base + "quote_categories/list";
        return this.httpRequest(this, "POST", { url }, data);
    }
    async get_upcoming_quote_categories(data)
    {
        let url = this.api_url_base + "quote_categories/upcoming";
        return this.httpRequest(this, "GET", { url }, data);
    }
    async add_quote_category(data)
    {
        let url = this.api_url_base + "quote_categories/create";
        return this.httpRequest(this, "POST", { url }, data);
    }
    async get_quote_category_detail(quote_category_id)
    {
        let url = this.api_url_base + "quote_categories/" + quote_category_id;
        return this.httpRequest(this, "GET", { url });
    }
    async edit_quote_category(data)
    {
        let url = this.api_url_base + "quote_categories/" + data._id;
        return this.httpRequest(this, "PUT", { url }, data);
    }
    async delete_quote_category(quote_category_id)
    {
        let url = this.api_url_base + "quote_categories/" + quote_category_id;
        return this.httpRequest(this, "DELETE", { url });
    }

    set_business_time_zone(time_zone)
    {
        this.business_time_zone = time_zone;
    }

    setupBusinessInfo(data) {
        let url = this.api_url_base + "select_wizard/new_business/process_finish_data";
        return this.httpRequest(this, "POST", { url }, data);
    }

    async get_donation_campaigns_list(data)
    {
        let url = this.api_url_base + "donation_campaigns/list";
        return this.httpRequest(this, "GET", { url }, data);
    }
    async add_donation_campaign(data)
    {
        let url = this.api_url_base + "donation_campaigns/create";
        return this.httpRequest(this, "POST", { url }, data);
    }
    async get_donation_campaign_detail(donation_campaign_id)
    {
        let url = this.api_url_base + "donation_campaigns/" + donation_campaign_id;
        return this.httpRequest(this, "GET", { url });
    }
    async edit_donation_campaign(data)
    {
        let url = this.api_url_base + "donation_campaigns/" + data._id;
        return this.httpRequest(this, "PUT", { url }, data);
    }
    async delete_donation_campaign(donation_campaign_id)
    {
        let url = this.api_url_base + "donation_campaigns/" + donation_campaign_id;
        return this.httpRequest(this, "DELETE", { url });
    }

    async get_donation_campaign(business_access_key, campaign_id)
    {
        let url = this.api_url_base + "extpages/donations/" + business_access_key;
        if (campaign_id) {
            url += '/' + campaign_id;
        }
        return this.httpRequest(this, "GET", { url });
    }

    async get_aas_apps_list()
    {
        let url = this.api_url_base + "adminops/aasadmin/apps";
        return this.httpRequest(this, "GET", { url });
    }
    async get_aas_provider_credentials_list()
    {
        let url = this.api_url_base + "adminops/aasadmin/provider_credentials";
        return this.httpRequest(this, "GET", { url });
    }
    async get_aas_oauth_accounts_list()
    {
        let url = this.api_url_base + "adminops/aasadmin/oauth_accounts";
        return this.httpRequest(this, "GET", { url });
    }

    async delete_aas_provider_credentials_list(id)
    {
        let url = this.api_url_base + "adminops/aasadmin/provider_credentials/" + id;
        return this.httpRequest(this, "DELETE", { url });
    }
    async delete_aas_oauth_accounts_list(id)
    {
        let url = this.api_url_base + "adminops/aasadmin/oauth_accounts/" + id;
        return this.httpRequest(this, "DELETE", { url });
    }

    async login(creds = null, refresh_login_data = null)
    {

        let url = this.api_url_base + "auth/login";
        
        let data = {};
        let  client_details ={};
        let debugd  = Date.now();
        if (creds != null && creds.email && creds.password)
        {
                //sdfsdf
                data = creds;
                if (creds.source_login)
                {
                    this.source_login = creds.source_login;
                }   
                client_details.client_id     =  creds.email;
                client_details.client_secret =  creds.password;
        }
        else
        {
            //Going forward, don't store client id & secret. Instead use refresh token
            let thisLoginData = refresh_login_data;
            url = this.api_url_base + "getnewtoken";
            /*console.log("thisLoginData === " );
            console.log(thisLoginData );
            console.log(thisLoginData.token_expiry);
            console.log(thisLoginData.refresh_token);
            console.log(thisLoginData.refresh_token_expiry);
            console.log(thisLoginData.data.business_id);*/
            
            if (thisLoginData && 
                thisLoginData.data.business_id && 
                thisLoginData.token_expiry &&
                thisLoginData.refresh_token  &&
                thisLoginData.refresh_token_expiry)
            {
                //Try refresh
                data.business_id   = thisLoginData.data.business_id;
                data.refresh_token = thisLoginData.refresh_token;
            }
            if (this.source_login)
            {
                data.source_login = this.source_login;
            }     
            //console.log("asdasdasd-- ABOUT TO POST  (REFERSH) " + debugd)          
        }
        
        //call do Http Request as this is login request
        let ret =  null;
       
        
        await this.doHttpRequest(this, "POST", {url: url, skip_auth: true }, data )
                            .then((res) => {
                                 ret =res
                            })
                            .catch((err) => {
                                //print_http_exception_details(err);
                                if (this.debug)
                                {
                                    console.log("SDK Login err");
                                    console.log(err);
                                }
                                
                            });
        this.in_refresh_request =false;
        //console.log("done post -- T (about to apply identity " + debugd)
        return await this.apply_identity_token(ret, client_details);
    }
    doSaveState(save_empty = false)
    {
       if( this.stateSave !== null)
       {
           if (save_empty === true)
           {
            this.stateSave('');
           }
           else
           {
            this.stateSave(JSON.stringify(this));
           }
           
       }
       else{
       // console.log("doSaveState SDK - no function ");
       }
    }
    doStateRestore(state_json)
    {
        let state = JSON.parse(state_json);

        this.init_obj(
            state.client_id,
            state.client_secret,
            state.app_url_base,
            state.is_debug,
            state.proxy_host,
            state.proxy_port
        )
        if (state.login_data != null)
        {
            this.login_data = state.login_data;
        }
        this.doSaveState();
    }
    getLoggedInUserData()
    {
       if (this.login_data && this.login_data.data)
       {
        return this.login_data.data;
       }
       return null
    }
    
    async checkUpdateOAuthToken(context, options)
    {
        //let expired = false; //check login data 
        //console.log("in checkUpdate OAuth Token--");
        //console.log(context.login_data);
        //console.log(context.client_id);
        //console.log(context.client_secret);
        
        if (options.skip_auth)
        {
            return true;
        }
        var timeInMs = Date.now();
         
        if (context.login_data == null ||  (timeInMs > context.login_data.token_expiry))
        {
            let refdata = JSON.parse(JSON.stringify(context.login_data)) ;
            context.logout(); //Logout as we don't want to try again
            return await context.login(null,refdata );
            
        }
        return true;
    }
    logout()
    {
        this.login_data = null;
        let save_empty = true;
        this.client_id = null;
        this.client_secret = null;
        
        this.doSaveState(save_empty);
    }
    isLoggedIn()
    {
        return (this.login_data != null && this.login_data.status ==1)
    }

    async get_stock_list(data)
    {
        let url = this.api_url_base + "inventory/stock/list";
        return this.httpRequest(this, "POST", { url }, data);
    }

    async add_stock(data)
    {
        let url = this.api_url_base + "inventory/stock/add";
        return this.httpRequest(this, "POST", { url }, data);
    }

    async adjust_stock(data)
    {
        let url = this.api_url_base + "inventory/stock/adjust";
        return this.httpRequest(this, "POST", { url }, data);
    }

    async adjust_stock(data)
    {
        let url = this.api_url_base + "inventory/stock/adjust";
        return this.httpRequest(this, "PUT", { url }, data);
    }

    async list_inventory_count(data)
    {
        let url = this.api_url_base + "inventory/count/list";
        return this.httpRequest(this, "POST", { url }, data);
    }

    async create_inventory_count(data)
    {
        let url = this.api_url_base + "inventory/count/create";
        return this.httpRequest(this, "POST", { url }, data);
    }

    async cancel_inventory_count(data)
    {
        let url = this.api_url_base + "inventory/count/cancel";
        return this.httpRequest(this, "PUT", { url }, data);
    }

    async delete_inventory_count(data)
    {
        let url = this.api_url_base + "inventory/count/delete";
        return this.httpRequest(this, "DELETE", { url }, data);
    }

    async complete_inventory_count(data)
    {
        let url = this.api_url_base + "inventory/count/complete";
        return this.httpRequest(this, "PUT", { url }, data);
    }

    async list_items_inventory_count(data)
    {
        let url = this.api_url_base + "inventory/count/list_items";
        return this.httpRequest(this, "POST", { url }, data);
    }

    async update_item_inventory_count(data)
    {
        let url = this.api_url_base + "inventory/count/count_item";
        return this.httpRequest(this, "POST", { url }, data);
    }

    async get_uom_arr()
    {
        let url = this.api_url_base + "global_data_public/units_of_measure_arr";
        return this.httpRequest(this, "GET", { url });
    }

    async get_subjects()
    {
        let url = this.api_url_base + "subjects";
        return this.httpRequest(this, "GET", { url });
    }
    
    async search_subjects(data)
    {
        let url = this.api_url_base + "subjects/search";
        return this.httpRequest(this, "POST", { url }, data);
    }

    async add_subject(data)
    {
        let url = this.api_url_base + "subjects";
        return this.httpRequest(this, "POST", { url }, data);
    }

    async get_subject_detail(id)
    {
        let url = this.api_url_base + "subjects/" + id;
        return this.httpRequest(this, "GET", { url });
    }

    async update_subject(id, data)
    {
        let url = this.api_url_base + "subjects/" + id;
        return this.httpRequest(this, "PUT", { url }, data);
    }

    async delete_subject(id)
    {
        let url = this.api_url_base + "subjects/" + id;
        return this.httpRequest(this, "DELETE", { url });
    }
    
    async get_courses()
    {
        let url = this.api_url_base + "courses";
        return this.httpRequest(this, "GET", { url });
    }

    async add_course(data)
    {
        let url = this.api_url_base + "courses";
        return this.httpRequest(this, "POST", { url }, data);
    }

    async update_course(id, data)
    {
        let url = this.api_url_base + "courses/" + id;
        return this.httpRequest(this, "PUT", { url }, data);
    }
    
    async get_course_detail(id)
    {
        let url = this.api_url_base + "courses/" + id;
        return this.httpRequest(this, "GET", { url });
    }

    async delete_course(id)
    {
        let url = this.api_url_base + "courses/" + id;
        return this.httpRequest(this, "DELETE", { url });
    }

    async get_class_instances(courseId, classId)
    {
        let url = `${this.api_url_base}classes/${courseId}/${classId}/class_instances`;
        return this.httpRequest(this, "GET", { url });
    }

    async search_class_instances(courseId, classId, data)
    {
        let url = `${this.api_url_base}classes/${courseId}/${classId}/class_instances/filters`;
        return this.httpRequest(this, "POST", { url }, data);
    }

    async update_class_instance(courseId, classId, instanceId, data)
    {
        let url = `${this.api_url_base}classes/${courseId}/${classId}/class_instances/${instanceId}`;
        return this.httpRequest(this, "PUT", { url }, data);
    }

    async add_class_signups(accesskey, data)
    {
        let url = `${this.api_url_base}classes/signup-old`;
        return this.httpRequest(this, "POST", { url, skip_auth: true, accesskey}, data);
    }
    
    async create_gift_card(data)
    {
        let url = `${this.api_url_base}gift-cards`;
        return this.httpRequest(this, "POST", { url }, data);
    }

    async update_class_signup(course_id, class_id, class_signup_id, data)
    {
        let url = `${this.api_url_base}classes/${course_id}/${class_id}/signups/${class_signup_id}`;
        return this.httpRequest(this, "POST", { url }, data);
    }

    // async add_class_course_signups(accesskey, data)
    // {
    //     let url = `${this.api_url_base}classes/signup-old`;
    //     return this.httpRequest(this, "POST", { url, skip_auth: true, accesskey }, data);
    // }

    async get_class_instance_trackers(classId, data)
    {
        let url = `${this.api_url_base}classes/${classId}/class-trackers`;
        return this.httpRequest(this, "POST", { url }, data);
    }

    async search_class_instance_trackers(classId, data)
    {
        let url = `${this.api_url_base}classes/${classId}/class-trackers`;
        return this.httpRequest(this, "POST", { url }, data);
    }

    async add_or_update_class_instance_trackers(classId, customerId, data)
    {
        let url = `${this.api_url_base}classes/${classId}/${customerId}/tracker`;
        return this.httpRequest(this, "POST", { url }, data);
    }

    async get_class_signups(courseId, classId)
    {
        let url = `${this.api_url_base}classes/${courseId}/${classId}/signups?limit=100`;
        return this.httpRequest(this, "GET", { url });
    }

    async get_classes(data)
    {
        let url = this.api_url_base + "classes/all";
        return this.httpRequest(this, "POST", { url }, data);
    }

    async get_public_classes(accesskey, data)
    {
        let url = this.api_url_base + "classes/all";
        return this.httpRequest(this, "POST", { url, skip_auth: true, accesskey}, data);
    }

    async add_class(course_id, data)
    {
        let url = this.api_url_base + "classes/" + course_id;
        return this.httpRequest(this, "POST", { url }, data);
    }

    async msg_conversations(data)
    {
        let url = this.api_url_base + "messaging_conversations/list";
        return this.httpRequest(this, "POST", { url }, data);
    }

    async msg_conversation_user_info(user_id)
    {
        let url = this.api_url_base + "messaging_conversations/user_panel_info/" + user_id;
        return this.httpRequest(this, "GET", { url });
    }

    async update_class(courseId, id, data)
    {
        let url = this.api_url_base + "classes/" + courseId + "/" + id;
        return this.httpRequest(this, "PUT", { url }, data);
    }

    async delete_class(id)
    {
        let url = this.api_url_base + "classes/" + id;
        return this.httpRequest(this, "DELETE", { url });
    }

    async get_class_detail(courseId, id)
    {
        let url = this.api_url_base + "classes/" + courseId + "/" + id;
        return this.httpRequest(this, "GET", { url });
    }

    async activate_class(classId)
    {
        let url = `${this.api_url_base}classes/${classId}/active`;
        return this.httpRequest(this, "PUT", { url });
    }

    async get_uom_arr_version()
    {
        let url = this.api_url_base + "global_data_public/units_of_measure_arr_version";
        return this.httpRequest(this, "GET", { url });
    }

    async stock_get_transactions(data)
    {
        let url = this.api_url_base + "inventory/stock/get_transactions";
        return this.httpRequest(this, "POST", { url }, data);
    }

    async class_signups_by_po(accesskey, po_order_number)
    {
        let url = `${this.api_url_base}public_classes/${accesskey}/signups_by_po/${po_order_number}`;
        return this.httpRequest(this, "GET", { url, skip_auth: true });
    }

    async drop_class_signup(accesskey, signup_id, class_id, customer_id, data)
    {
        let url = `${this.api_url_base}public_classes/${accesskey}/${class_id}/${customer_id}/${signup_id}/class-signup/drop`;
        return this.httpRequest(this, "POST", { url, skip_auth: true }, data);
    }

    async createOnlineMeeting(data) {
        let url = `${this.api_url_base}booking/${data._id}/onlinemeetings/add`;
        return this.httpRequest(this, "POST", { url }, data);
    }

    async deleteOnlineMeeting(booking_id) {
        let url = `${this.api_url_base}booking/${booking_id}/onlinemeetings/delete`;
        return this.httpRequest(this, "POST", { url });
    }

    async refreshOnlineMeetingInfo(booking_id) {
        let url = `${this.api_url_base}booking/${booking_id}/onlinemeetings/refresh`;
        return this.httpRequest(this, "POST", { url });
    }

    async searchCheckins(accesskey, data) {
        let url = this.api_url_base + "extbookingops/search_for_checkin";
        return this.httpRequest(this, "POST", { url, skip_auth: true, accesskey }, data);
    }
    async customerCheckin(accesskey, data) {
        let url = this.api_url_base + "extbookingops/customer_checkin";
        return this.httpRequest(this, "POST", { url, skip_auth: true, accesskey }, data);
    }

    async get_public_business_info(access_key)
    {
        let url = this.api_url_base + "public_app_settings/get_public_business_info/" + access_key;
        return this.httpRequest(this, "GET", { url: url, skip_auth: true }, null )
    }
    
    getAuthorizationString(oauth_token_str = null)
    {
        let auth_str = (oauth_token_str == null && this.login_data !=null ) ? 
                        this.login_data.token : oauth_token_str;
                      

        if (auth_str != null)
        {
              return auth_str; //Bearer in other cases.
        }
        
        return auth_str;
        // 'Bearer ' + token.access_token
        //TLog::Log(TLog::INFO,
        //      "setAuthorizationHeader:   -- " . json_encode(  $this->request_headers));
        
        
    }

    async attemptHttpAccess(context, verb, options, entity)
    {
        
        return this.checkUpdateOAuthToken(context, options)
        .then( (res) => {
              return this.doHttpRequest(context, verb, options, entity);
        });
           
    }
    
    async httpRequest( context, verb, options, entity, do_not_retry = false)
    {
        var pret = null;
        var was_error = false;
        var err_obj = null;
        
        //Check if caching was requested
        let cdata = null;
        let do_cache = false;
        if (options.cache_key !== undefined && 
            options.cache_key != null )
        {
            
            do_cache = true;
            if (options.cache_but_remote_first !== true)
            {
                cdata = await this.asyncfetchcached({key: options.cache_key});
            }
            
            if (cdata != null) 
            {
                cdata.from_cache = true;
                console.log("Returning from cache the data for " + options.url)
                return cdata;
            }
        }
        
        
        await this.attemptHttpAccess(context, verb, options, entity)
                    .then(  (ret) => {
                        pret = ret;
                        })
                    .catch((err) => {
                        was_error = true;
                        
                        err_obj = err;
                    });
        if (was_error)
        {
            let retry = false;
            if (err_obj && err_obj.status &&
                err_obj.status == 401 && 
                context.isLoggedIn == false && 
                do_not_retry == false &&
                (options.skip_auth !== undefined &&  options.skip_auth == false)
                )
            {
                if(this.debug)
                {
                    console.log("Status was unauth and not logged in. Retry after login");
                }
                retry = true;
            }
            //console.log("asd-a-sd-as-d-asd-as-d-sa- ------");
            //console.log(err_obj.status);
            
            if (err_obj && err_obj.status && 
                err_obj.status == 419 && do_not_retry == false)
            {
                //Session expired, retry;
                if(this.debug)
                {
                    console.log("Status was token expired. Retry after login");
                }
                retry = true;  
            }
            if (retry == true)
            {
                if(this.debug)
                {
                    console.log("retrying after login....");
                }
                //let debugd  = Date.now();
                   
                if(this.in_refresh_request != true)
                {
                    this.in_refresh_request = true;
                    let refdata = JSON.parse(JSON.stringify(context.login_data)) ;
                    context.logout(); //Logout as we don't want to try again
                    //console.log("retrying for TOKEN after login...." + debugd);
                    var lret = await this.login(null, refdata);
                    //console.log("===DONE lret for TOKEN " + lret + "  -- " + debugd);
                    
                    if (lret == true)
                    {
                        await this.attemptHttpAccess(context, verb, options, entity)
                        .then(  (ret) => {
                            pret = ret;
                            })
                        .catch((err) => {
                            was_error = true;
                            err_obj = err;
                        });                    
                    }                    
                }
              
                    
            }
        } //end was_error
        
        if (pret !== null)
        {
            pret.from_cache = false;
            if (do_cache)
            {
                //no await here
                this.asyncsavetocache({key: options.cache_key, value: pret, ttl: options.cache_ttl?options.cache_ttl:(2 * 60) })
            }
            return Promise.resolve(pret);
        }
        else
        {
            return Promise.reject(err_obj);
        }
    }
    async doHttpRequest( context, verb, options, entity) 
    {
        let axoptions = {};
        axoptions.headers  = {
                            'Content-Type': 'application/x-www-form-urlencoded'/*,
                            'Authorization': auth_basic*/
                            };
        // + version
        if (typeof window === 'undefined') 
        {
            //Not running in a browser, so set user agent
            axoptions.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
        }
        if (this.business_time_zone != null)
        {
            axoptions.headers['hds_tz'] = this.business_time_zone;
        }
        let skip_auth = options.skip_auth || false;
        if (context &&  skip_auth == false)
        {
            let auth_var_name = context.auth_token_var_name || 'Authorization';
            let auth_string = context.getAuthorizationString();
            
            if (auth_string)
            {
                axoptions.headers[auth_var_name] = context.getAuthorizationString();
            }
            
        }
        
        axoptions.headers['accept'] =  'application/json'
        //console.log("do Http Request: .axoptions....");
        if(skip_auth && options.accesskey !== undefined && options.accesskey.length>3)
        {
            axoptions.headers['accesskey'] = options.accesskey;
        }
        try
        {
          let req_data      = {};   
          
          if(options.content_type_header && options.content_type_header !== "")
          {
            req_data =null;
            req_data = entity; //unchanged
            axoptions.headers['Content-Type'] = options.content_type_header
          }
          else if (entity !== null) 
          {
            req_data = JSON.stringify(entity)
            axoptions.headers['Content-Type'] = 'application/json'
          }
          let url = options.url;
        //   let params = verb == "GET" ? entity : {};
          let response = await axios({
                            method: verb,
                            url: url,
                            data: req_data,
                            // params,
                            headers: axoptions.headers
                            }).catch((err) => {
                                       
                                        /* console.log("SDK: error in generic axios  Operation");
                                        console.log( req_data);
                                        console.log(url);
                                        console.log(err.message);
                                        console.log(err);  
                                        console.log("SDK: ---err resps---");
                                        console.log(err.response);  
                                        console.log(err.Error); 
                                        */ 
                                      if (err.response === undefined)
                                      {
                                        return Promise.reject(err.Error || err.message);  
                                      }
                                      else
                                      {
                                        return Promise.reject(err.response);  
                                      }
                                      
                                    });
            if(!response.error && 
                response.data)
            {
                //console.log("RETTT:  ");
                //console.log(response.data);
                return Promise.resolve(response.data);
            }
            //Else error
            return Promise.reject(response.error);  
        }
        catch (err) 
        {
            return Promise.reject(err);
        }
       
      }
    
    setStateSaveFunction(fn)
    {
        this.stateSave = fn;
    }

    setCachingFunctions(getFn, setFn)
    {
        this.getCachedData = getFn;
        this.setCachedData = setFn;
    }
    //Data: {key: "analytics"}
    async asyncfetchcached(data)
    {
        if (this.getCachedData == null)
        {
            return null;
        }
        return this.getCachedData(data);
    }
    //Data: 
    //{key:'analytics', 
    // value: this.dashboard_data, 
    // ttl: 25}
    async asyncsavetocache(data)
    {
        if (this.setCachedData == null)
        {
            return null ;
        }
        return this.setCachedData(data);
    }
    async getBonusSettings(){
      let url = this.api_url_base + "settings/performance_bonus_setting";
      return this.httpRequest(this,"GET",{url:url});
    }
    async updateBonusSettings(data){
        let url = this.api_url_base + "settings/performance_bonus_setting";
        return this.httpRequest(this,"PUT",{url:url},data);
    }
    async updateSimplifiedInventorySettings(data) {
        let url = this.api_url_base + "settings/update_simplified_inventory_settings";
        return this.httpRequest(this, "PUT", { url }, data);
    }
    async getLoyalty(){
      let url = this.api_url_base + "loyalty";
      return this.httpRequest(this,"GET",{url:url})
    }
    async postLoyalty(data){
      let url = this.api_url_base + "loyalty/update";
      return this.httpRequest(this,"POST",{url:url},data)
    }
    async getLoyaltyRedemption(){
      let url = this.api_url_base + "loyalty/redemption";
      return this.httpRequest(this,"GET",{url:url})
    }
    async postLoyaltyRedemption(data){
      let url = this.api_url_base + "loyalty/redemption";
      return this.httpRequest(this,"POST",{url:url},data)
    }
  async getWaitListSettings(){
    let url = this.api_url_base + "manage_wait_list/settings ";
    return this.httpRequest(this,"GET",{url:url})
  }
  async updateWaitListSettings(data){
    let url = this.api_url_base + "manage_wait_list/settings ";
    return this.httpRequest(this,"PUT",{url:url},data)
  }
  async getWaitList(data){
    let url = this.api_url_base + "manage_wait_list/list";
    return this.httpRequest(this,"POST",{url:url},data)
  }
  async addWaitList(data){
    let url = this.api_url_base + "manage_wait_list/create";
    return this.httpRequest(this,"POST",{url:url},data)
  }
  async getOneWaitList(id){
      let url = this.api_url_base + "manage_wait_list/list";
      return this.httpRequest(this,"POST",{url:url},{_id:id});
  }
  async editWaitList(data){
    let url = this.api_url_base + "manage_wait_list/edit";
    return this.httpRequest(this,"POST",{url:url},data)
  }
  async cancelWaitList(data){
    let url = this.api_url_base + "manage_wait_list/cancel_wait";
    return this.httpRequest(this,"POST",{url:url},data)
  }
  async convertWaitList(data){
    let url = this.api_url_base + "manage_wait_list/convert";
    return this.httpRequest(this,"POST",{url:url},data)
  }
  async convertASpecificSlot(data)
  {
    let url = this.api_url_base + "manage_wait_list/convert_selected_slot";
    return this.httpRequest(this,"POST",{url:url},data)
    
  }
  async findSlotsForWaitList(data){
    let url = this.api_url_base + "manage_wait_list/manual_find_and_save_slots";
    return this.httpRequest(this,"POST",{url:url},data)
  }
  async notifyUserofSlots(data){
    let url = this.api_url_base + "manage_wait_list/notify_of_slots";
    return this.httpRequest(this,"POST",{url:url},data)
  }
  async getPurchaseOrderDetails(purchase_order_id){
    let url = this.api_url_base + "purchase_order/details/" + purchase_order_id;
    return this.httpRequest(this, "GET", { url });
  }

  async getCustomerMessageOfTheDay(){
    let url = this.api_url_base + "cmotd";
    return this.httpRequest(this, "GET", { url });
  }

  async upload_media(type, data, resource_id) {
    let url = `${this.api_url_base}media_management/upload/${type}/${resource_id ? resource_id : ''}`;
    let options = { url }
    options.content_type_header = "multipart/form-data"
    return this.httpRequest(this, "POST", options,data);
  }
  async remove_media(data) {
    let url = this.api_url_base + "media_management/remove";
    let options = { url }
    return this.httpRequest(this, "POST", options,data);
  }
  async upload_multiple_media(type, data, resource_id) {
    let url = `${this.api_url_base}media_management/upload-multiple/${type}/${resource_id ? resource_id : ''}`;
    let options = { url }
    options.content_type_header = "multipart/form-data"
    return this.httpRequest(this, "POST", options,data);
  }
  async albums_list(data) {
    let url = this.api_url_base + "albums/list";
    let options = { url }
    return this.httpRequest(this, "POST", options, data);
  }
  async create_update_album(data) {
    let url = this.api_url_base + "albums/create_or_update";
    let options = { url }
    return this.httpRequest(this, "POST", options, data);
  }
  async delete_album(album_id) {
    let url = this.api_url_base + "albums/" + album_id;
    let options = { url }
    return this.httpRequest(this, "DELETE", options);
  }
  async get_album(album_id) {
    let url = this.api_url_base + "albums/" + album_id;
    let options = { url }
    return this.httpRequest(this, "GET", options);
  }
  async create_update_picture(data) {
    let url = this.api_url_base + "user_pictures/create_update";
    let options = { url }
    return this.httpRequest(this, "POST", options, data);
  }
  async delete_user_picture() {
    let url = this.api_url_base + "user_pictures/delete";
    let options = { url }
    return this.httpRequest(this, "POST", options, data);
  }
  async send_po_for_pay_email(data){
    let url = this.api_url_base + "purchase_order/email_po_for_pay";
    return this.httpRequest(this, "POST", { url: url },data );
  }
  async send_email_to_sign_paperwork(data){
    let url = this.api_url_base + "customer_paperwork/email_to_sign_paperwork";
    return this.httpRequest(this, "POST", { url: url },data );
  }
}


export default SkySchedNodeSDK;
export const install = function (app, options)
{
    if(app.$schedsdk === undefined)
    {
        // console.log("schedsdk was undefined.. creating new");
        app.$schedsdk = new SkySchedNodeSDK('none', 'none', options.BaseURL);
        // console.log("schedsdk .. creating new");
    
        if (options.dataSaveFn != null)
        {
            app.$schedsdk.setStateSaveFunction(options.dataSaveFn);
        }
        
        if (options.savedState && options.savedState!= '')
        {
            app.$schedsdk.doStateRestore(options.savedState);
        }
        if (options.cachedStateGetFun != null)
        {
            app.$schedsdk.setCachingFunctions(options.cachedStateGetFun, options.cachedStateSetFun);
        }

        // console.log( app.$schedsdk)
        //Expose this varioable using provide to be used in inject
        app.config.globalProperties.$schedsdk =  
                 app.$schedsdk
              
             
        app.provide('$schedsdk',  app.config.globalProperties.$schedsdk )
        
    }
    
}
