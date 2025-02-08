<template>
  <div>
    
    <div class="row">
      
      <div v-if="showToggler" class="col-md-12 mb-4">
          <button
            class="header-toggler round-btn d-lg-inline-block rotate-btn toggle-sidebar"
            type="button"
            aria-label="Toggle navigation"
            style="transform: rotate(-90deg);"
            @click="$store.commit('toggleSidebar')"
          >
            <Icon icon="tabler:antenna-bars-5" :height="24" />
          </button>
        </div>
        <div class="col-md-12">
          <scheduler-tab :key="schedTabKey"
            @toggle-filter="(v) => showToggler = v"
          ></scheduler-tab>
          
        </div>
    </div>
     
  </div>
</template>
<script>
import SchedulerTab from './scheduler-tab/SchedulerTab4.vue';
import AppHelper from '../../helpers/app_helper'
import { Icon } from '@/common/Icon';

export default {
  name: 'Dashboard',
  components : {
    SchedulerTab,
    Icon
  },
  data () {
    return {
      dashboard_data:{},
      internal_svprefs: {},
      schedTabKey: 0,
      windowWidth: window.innerWidth,
      showToggler: false
    }
  },
  mounted() {
    window.addEventListener('resize', this.onResize);
  },
  //
  created(){
      this.showToggler = !this.$store.state.scheduler_view_preferences.hide_filter;
      //console.log("Created....  DASH V2")
      this.internal_svprefs = this.viewoptions
      if (AppHelper.isRoleOwner( this.$store.state) &&
          this.$store.state.business_settings.has_completed_business_setup_wizard !== undefined &&
          (this.$store.state.business_settings.has_completed_business_setup_wizard == false && 
           this.$store.state.business_settings.business_setup_wizard_skipped == false ))
      {
          if(this.$route.query.no_redirect=="1")
          {
            return;
          }
          this.$router.push({ name: 'Start Wizard' }) 
          return;
      }
      this.getAnalytices();
  },
  methods: {
    getAnalytices(){
    this.$schedsdk.dashboard_analytics({type:1}).then((result)=>{
        // console.log(result.data)
        if(result.status == 1){
          this.dashboard_data = result.data
        }
        
      })
    },
    save_viewprefs_to_store()
        {
               this.$store.commit('SET_SCHEDULER_VIEW_PREFS', this.internal_svprefs);
        },
       async switch_scheduler_view_mode(e)
        {
            //Since the mode is horizontal_mode, its already changed.
            //this.internal_svprefs.horizontal_mode = e.target.checked? true: false;
            await this.do_switch_scheduler_view_mode(this.internal_svprefs.horizontal_mode )
                //Do a full refresh as there is an error in scheduler
            console.log("asdasdasd full refreshAAAA")
            this.save_viewprefs_to_store()
            this.forceSchedRerender()
        },
         forceSchedRerender() {
            this.schedTabKey += 1;
        }, 
        async do_switch_scheduler_view_mode(is_horizontal)
        {
            
            if (is_horizontal)
            {
                this.internal_svprefs.mode = 'horizontal';
                this.internal_svprefs.auto_height= true;
                this.internal_svprefs.scheduler_height=null
                
            }
            else
            {
                this.internal_svprefs.mode = 'vertical';
                this.internal_svprefs.auto_height= false;
                this.internal_svprefs.scheduler_height=484
            }
           
        },
        onResize() {
          this.windowWidth = window.innerWidth
        }
        
  },
  computed:{
        
         viewoptions (){
                    let svp = this.$store.state.scheduler_view_preferences
                    
                    return ({
                            horizontal_mode         : svp.horizontal_mode || false,
                            mode                    : svp.mode || 'vertical',
                            auto_height             : svp.auto_height || false,
                            scheduler_height        : svp.scheduler_height || 884
                        })
              
        }  // end view options
    },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  }
}
</script>
<style scoped>
.card{
height: 120px;
}
#b-scheduler-15{
  width:1300px;
}
.sidebar-outer.sidebar-collapse {
  width: 67px;
}
</style>
