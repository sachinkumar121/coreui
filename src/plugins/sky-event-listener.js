import mitt from 'mitt';

class SkyEventListener {
    constructor(emitter, app_global_props) {
        this.emitter = emitter;
        this.global_app_animations_enabled = false;
        this.useUpdatedGlobalProps(app_global_props)
        
    }
    useUpdatedGlobalProps(app_global_props)
    {
        //console.log(app_global_props,"used updated props Asdasd--s-s")
        
        // this.global_app_animations_enabled = true;
        this.global_app_animations_enabled = (app_global_props && app_global_props.enable_app_animations == true)?true:false
        //console.log(this.global_app_animations_enabled,"gloable enabll... Asdasd--s-s")
     
    }
    generateEvent(name, data) {
        console.log("Generate event AEV ....  enabled? ", name, this.global_app_animations_enabled);
            
        if(this.global_app_animations_enabled)
        {
            this.emit(name, data);
        }
        else
        {
            console.log("Animations not enabled globally")
        }
    }
    emit(event, data) {
        this.emitter.emit(event, data);
    }
    on(event, fn) {
        this.emitter.on(event, fn);
    }
    off(event, fn) {
        this.emitter.off(event, fn);
    }
}

export default {
    install: (app, options) => {
        const emitter = mitt();
        app.config.globalProperties.$skyEventListener = new SkyEventListener(emitter, app.config.globalProperties.$globalSkyAppSettings);
        app.provide('skyEventListener', options);
    }
}