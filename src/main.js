import { createApp, defineAsyncComponent } from 'vue';
import vSelect from 'vue-select';
import App from './App.vue'
import router from './router'
import store from './store'
import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'
import * as SkySDK from "./SkySalonNodeSDK";
import * as CrispSDK from "./CrispChatSDK";
import { createHead } from '@unhead/vue'
import skyEventListener from '@/plugins/sky-event-listener';

import browsee from '@browsee/web-sdk';
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(createPinia())
app.use(store)
app.use(router)
app.use(CoreuiVue)

app.use(skyEventListener);

app.component('v-select', vSelect);
const hvead = createHead()
app.use(hvead)

let skysched_global_api_base_url = store.state.skysched_global_api_base_url || import.meta.env.VITE_EXT_BASE_URL;

app.use(SkySDK, {
    BaseURL: skysched_global_api_base_url,
    dataSaveFn: function(data) {
        store.commit('SET_SKYSDKDATA', data);
    },
    savedState: store.state.skysdkdata,
    cachedStateGetFun: function(data){
        return store.getters['schedsdkstore/getData'](data) ;
    },
    cachedStateSetFun: function(data){
        store.commit('schedsdkstore/setData', data); // commit a mutation
    }
});

browsee.init({ apiKey: '85f5c6034d8bcd81b68340475643f59756fa753b3ccde267' });
app.provide('icons', icons)
app.component('CIcon', CIcon)

app.config.warnHandler = function (warn, vm, info) {
    console.warn(warn)
    console.log(info)
}

setTimeout(() => {
    app.config.globalProperties.$globalSkyAppSettings = {}
    app.$schedsdk.get_public_app_settings().then((result) => {  
            if (result.status == 1 && result.data.enable_crisp_chat_for_support==true) {
                app.use(CrispSDK, {
                    BaseURL: skysched_global_api_base_url,
                    websiteId: 'e8df310a-fc03-470f-b4cf-b8e7ac44b5a5',
                    disabled: false
                });
            }
            
            if (result.status == 1) {
                app.config.globalProperties.$globalSkyAppSettings = result.data
            }

            if (app.config.globalProperties.$skyEventListener && app.config.globalProperties.$skyEventListener.useUpdatedGlobalProps) {
                app.config.globalProperties.$skyEventListener.useUpdatedGlobalProps(app.config.globalProperties.$globalSkyAppSettings)
            }
           
    }).catch(ex => {
        console.log("error settings not obtained ", ex);
    }).finally(ex=>{
        app.mount('#app');
    });
}, 500);
/* Generally no need to reset
setTimeout(() => {
    app.$appchatobj.push(["do", "session:reset"])
}, 1000)
*/

