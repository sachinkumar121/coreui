"use strict"

//export default CrispChatSDK;
export const install = function (app, options)
{
    let { websiteId, disabled } = options;
    if(app.$crisp === undefined)
    {
        // console.log("schedsdk was undefined.. creating new");
      //  app.$schedsdk = new SkySchedNodeSDK('none', 'none', options.BaseURL);
        ///---------
        if (!disabled && (!websiteId || websiteId.length === 0)) 
        {
            console.warn("Please provide a Crisp Chat Website ID");
        } 
        else 
        {
           window.CRISP_WEBSITE_ID = websiteId
        }
    
          const disabledLogger = function(method, ...args) {
            console.log("Crisp Chat is disabled, you called:", { method, args });
          };
    
          if (disabled) {
            window.$crisp = disabledLogger;
          }
    
          const root = new Object();
          root._script = document.createElement("script");
          root._script.type = "text/javascript";
          root._script.async = true;
          root._script.id = "crisp-chat";
          root._script.src = "https://client.crisp.chat/l.js";
    
          let isLoaded = false
    
          root.load = () => {
            if (isLoaded) {
              return;
            }
    
            delete window.$crisp;
    
            const first = document.getElementsByTagName("script")[0];
            first.parentNode.insertBefore(root._script, first);
    
            root._script.addEventListener("load", function() {
                // The script is loaded completely
                // Do something
                isLoaded = true
  
                //  root.$emit("loaded", event);
             
                     
                //console.log("asdasd---------------------", window.$crisp)
                root.reset = () => window.$crisp.reset();
                root.do = (...args) => window.$crisp.do(...args);
                root.is = (...args) => window.$crisp.is(...args);
                root.get = (...args) => window.$crisp.get(...args);
                root.set = (...args) => window.$crisp.set(...args);
                root.config = (...args) => window.$crisp.config(...args);
                root.on = (...args) => window.$crisp.on(...args);
                root.off = (...args) => window.$crisp.off(...args);
                root.push = (...args) => {window.$crisp.push(...args) ; };
                //root.push(["do", "session:reset"])
      
            });
            
            
          
       
    
          };
    
          if (!disabled) {
            root.load(websiteId);
          }
          
           
  //        Vue.prototype.$crisp = root;
 
        app.$appchatobj = root;



        ///----------


        // console.log( app.$schedsdk)
        //Expose this varioable using provide to be used in inject
        app.config.globalProperties.$appchatobj =  
        app.$appchatobj 
              
       
        app.provide('$appchatobj',  app.config.globalProperties.$appchatobj )
        //
    }
   

}
