
//import AllNav from '@/nav.js'

import browsee from '@browsee/web-sdk';
import AllNavOld from '@/nav_old.js'
import AllNavNew from '@/nav.js'
const  use_new_menu = 1;
export default {
    
    async setup_sidebar_nav(user_data, vuestore, vuestore_tag = "SIDE_BAR_NAV_ITEMS")
    {

        var newNav = [{
            _name: "defaultnav",
            _children: []
        }];
            //Here based on user type select the menu elements 
            //and push into the newNav object and store into store
        var user_type =  user_data.type;
        var user_id = user_data._id;
        let  AllNav = AllNavNew;
        let business_type =  vuestore?.state?.business_settings?.business_info.business_type || null;

        if (use_new_menu == 0)
        {
            AllNav =  AllNavOld
        }
        // console.log(AllNavNew, AllNavNew[0])
        newNav[0]._name = AllNav[0]._name;
        var is_dev_mode = false;
        if(import.meta.env.VITE_DEPLOY_MODE && 
            import.meta.env.VITE_DEPLOY_MODE!=null &&
            import.meta.env.VITE_DEPLOY_MODE.length > 0)
        {
            if (import.meta.env.VITE_DEPLOY_MODE == 'dev')
            {
                is_dev_mode = true;
            }
        }
        for(let i = 0;i<AllNav[0]._children.length; i++)
        {
            var ele =AllNav[0]._children[i];
            if (user_type == 1 || 
                ele.utype.includes(user_type) ||
                (business_type == 3 && ele.utype.includes(1)))
            {
                if (ele.to == "/tbd_myschedule")
                {
                    //Set the TO to include the user ID
                    ele.to = "/settings/set_business_hours/user/" +user_id
                }
                ele.name = ele.name.replace('*DEV', '');

                if (ele.feature_in_development === true )
                {
                    if(is_dev_mode !== true)
                    {
                        continue;
                    }
                    ele.name  = ele.name + " *DEV"
                    
                }
                newNav[0]._children.push(ele); 
            }
        }
        //this.$store.commit("SIDE_BAR_NAV_ITEMS", newNav);
        vuestore.commit(vuestore_tag, newNav);
    },
    async complete_new_login(sched_sdk, sdk_logged_user_data, vuestore, chat_obj = null)
    {
        //this.$store.commit("SET_TOKEN", this.$schedsdk.getAuthorizationString());
        //this.$store.commit("USER_DATA", this.$schedsdk.getLoggedInUserData());
        vuestore.commit("USER_DATA", sdk_logged_user_data);
        try
        {
            browsee.identify(sdk_logged_user_data.first_name + " " + sdk_logged_user_data.last_name, 
            {name: sdk_logged_user_data.first_name + " " + sdk_logged_user_data.last_name});
            
         
        }
        catch(ex)
        {
            //
        }
        
        vuestore.commit('schedsdkstore/setDefaultStoreID', {data: sdk_logged_user_data.business_id}); // dispatch an action
        //this.$store.commit("USER_DATA", this.$schedsdk.getLoggedInUserData());
        let tax_data = await this.get_and_save_business_settings(sched_sdk, vuestore);
        await this.setup_sidebar_nav(sdk_logged_user_data, vuestore);
        if(chat_obj)
        {
            this.setup_chatbox(chat_obj,sdk_logged_user_data,tax_data).catch(ex=>{
                console.log("Error setting up chat box", ex)
            })
        }
    
      //Hack for dev only//
      /*  await sched_sdk.updateSimplifiedInventorySettings({
            use_simplified_inventory: false
        }).then(async (res) => {
            await vuestore.commit('UPDATE_BUSINESS_DATA', {
                key: "use_simplified_inventory",
                value: true
            });
        }).catch(console.error);
        */
        await sched_sdk.get_uom_arr().then((res) => {
            let uomData = (vuestore.state?.business_settings?.use_simplified_inventory || false) ? res.data.uom_array_simple : res.data.uom_array;
            vuestore.commit('SET_UOM_DATA', uomData);
        }).catch(console.error);

        await sched_sdk.get_uom_arr_version().then((res) => {
            vuestore.commit('SET_UOM_ARR_VERSION', res.data.version);
        }).catch(console.error);
    },
    async get_and_save_business_settings(sched_sdk, vuestore, vuestore_tag = "BUSINESS_DATA")
    {
        return sched_sdk.tax_percentage().then((tax_data)=>{
            vuestore.commit(vuestore_tag, tax_data.business_setting);
            //this.$router.push({ name: 'Dashboard' }) 
            sched_sdk.set_business_time_zone( tax_data.business_setting.business_time_zone)
            return tax_data;
        }).catch(exp=>{
            console.log("get_and_save_business_settings: except")
            console.log(exp)
            //return {exception: 1, obj: exp};
            throw(exp)

        })
    },
    async apply_new_user_data(sched_sdk, vuestore, userdata)
    {
        vuestore.commit("USER_DATA", userdata);
      
    },
    async setup_chatbox(chat_obj, sdk_logged_user_data, tax_data)
    {
        if (false)
        {
            console.log("Chat box not being setup........");
            return;
        }
        if(chat_obj != null)
        {
            
            //console.log("SETTINg....X ", sdk_logged_user_data,tax_data)
            chat_obj.push(["set", "user:email", [sdk_logged_user_data.email]]);
            let e164ph = sdk_logged_user_data.e164phone || sdk_logged_user_data.phone || ""
            if(e164ph)
            {
                chat_obj.push(["set", "user:phone", [e164ph]]);
            }
            chat_obj.push(["set", "user:nickname", [sdk_logged_user_data.first_name + " " + sdk_logged_user_data.last_name]]);
            chat_obj.push(["set", "session:data", [[
                ["skysalon_business_id", sdk_logged_user_data.business_id],
                ["skysalon_user_id", sdk_logged_user_data._id]
              
            ]]]);
            if(tax_data && tax_data.business_setting &&  tax_data.business_setting.business_info )
            {
                let bi = tax_data.business_setting.business_info
                let bicdata =  [bi.business_name,
                    { geolocation: [bi.country_code, bi.city] }
                ];
                //console.log(bicdata, "asdasdsadasdas")
                chat_obj.push(["set",  "user:company", bicdata]);
                chat_obj.push(["set", "session:data", [[
                    ["skysalon_business_time_zone", tax_data.business_setting.business_time_zone],
                    ["skysalon_business_state", bi.state]
                ]]]);
               
            
            }
            

        }
    },
    checkSessionExpiryAndRedirectToLogin(result, sched_sdk, inrouter)
    {
        if (result && 
            (result.status == 419 || result.status == 401))
        { 
            if(sched_sdk)
            {  
                sched_sdk.logout()
            }
            inrouter.push("/login?sso_message=2");
        }
      
    },
}