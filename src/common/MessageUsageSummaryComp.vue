<template>
    <div>

      <CModal  size="xl" :visible="show_modal" @close="closeStatsModal()">
        <CModalHeader>
            <CModalTitle>Messaging Statistics over last 4 Weeks</CModalTitle>
        </CModalHeader>
        <CModalBody>
           
        <div  class="row">
            <div class="col-md-12" >
                Date Range:  {{getDateRangeString()}}
                <br>
                <table class="table table-bordered">
                    <thead>
                     
                        <tr>
                            <th>Channel</th>
                            <th>Avg. Credits / wk</th>
                            <th>Avg. Messages /wk</th>
                            <th>Avg. Segments /msg/wk</th>
                            <th>Total Credits 4 wks</th>
                            <th>Total Messages 4 wks</th>
                            <th>Total Segments 4 wks</th>
                        </tr>
                </thead>
                
                <tbody v-if="weeklystatsdata"> 
                <tr v-for="(chdata, index) in weeklystatsdata" :key="index">
                    <td>{{chdata.summary.field_name}} </td>        
                    <td>{{chdata.summary.avg_credits}} </td>
                    <td>{{chdata.summary.avg_items}} </td>
                    <td>{{chdata.summary.avg_message_units}} </td>
                    <td>{{chdata.summary.total_credits}} </td>
                    <td>{{chdata.summary.item_total}}  </td>
                    <td>{{chdata.summary.total_message_units}}</td>
                </tr>
                </tbody>
                <tbody v-else> 
                <tr>
                    <td> 
                        <div class="py-5">
                            <img src="/img/no-result.svg" alt="" class="img-empty"> 
                            <p class="h5 mt-4 d-block fw-normal">
                                No data found
                            </p>
                        </div>
                    </td>
                </tr>
                </tbody>
                </table>
            </div> <!-- end col 12 -->
        </div>
        <br>
        
         <div  class="row" >
            <div class="col-md-4" >
               Available Message Credits: {{messagestats.credits_available}}
            </div> <!-- end col 12 -->
            <div class="col-md-4" v-if="weeklystatsdata" >
               Estimated to last: {{getCreditsEstimatedToLast()}}
            </div> <!-- end col 12 -->
             <div class="col-md-4" >
                <button class="btn btn-warning" 
                         @click="openPurchaseCredits()"> Purchase Credits </button>
            </div> <!-- end col 12 -->
        </div>

        <div class="row">
             <div class="col-md-12" color="danger">
               <b> </b>
            </div>
         </div>
          <div  class="row" >
            <div class="col-sm-12" >
              <small><b>Message Credit</b>: When text/email/voice message is sent or received, it consumes some part of message credit. For ex. a text message may take up 0.015 credits.
                </small><br>
              <small><b>Message Unit or Segment</b>: Credit consumption is per segment. Segment is a standard unit based on type.
                         For ex. 160 characters of a Text message = 1 segment. 320 characters = 2 Segments.
                         For emails, 1 segment = 32,768 characters.
                </small><br>
                
            </div> <!-- end col 12 -->
             
        </div>

         </CModalBody>
        <CModalFooter>
            <CButton @click="showRateTable" color="primary">Show Rate Table</CButton>
            <CButton @click="closeStatsModal" color="success">OK</CButton>
        </CModalFooter>
      </CModal>




      <CModal  size="xl" :visible="show_rates_modal" @close="closeStatsModal()">
        <CModalHeader>
            <CModalTitle>Message Rates</CModalTitle>
        </CModalHeader>
        <CModalBody>
           
        <div  class="row">
            <div class="col-md-12" >
               1 Message Credit =  US $1.00 
               
                <br>
                <table class="table table-bordered">
                    
                    <!--
                     Disabling this as its not very useful (as per message rate is not much use)
                    <thead>
                     
                        <tr>
                            <th>Channel</th>
                            <th>Credits for 1 message unit</th>
                            <th>1 message unit</th>
                        </tr>
                    </thead>
                
                <tbody v-if="messagerates"> 
                <tr v-for="(chdata, index) in messagerates.channel" :key="index">
                    <td>{{chdata.name}} </td>        
                    <td>{{chdata.credits}}</td>
                     <td>{{chdata.unit_size}} characters</td>
                </tr>
                -->
                <tbody v-if="messagerates">    
                <tr v-for="(chdata, index) in messagerates.maintenance" :key="index">
                    <td colspan="3">{{chdata.name}}:  {{chdata.credits}} credit {{chdata.freq}}</td>        
                     
                </tr>
                <tr v-for="(chdata, index) in messagerates.examples" :key="index">
                    <td colspan="1">{{chdata.credits}} Credits </td>
                    <td colspan="2">{{chdata.example}}</td> 
                </tr>
                
                </tbody>
                <tbody v-else> 
                <tr>
                    <td>
                        <div class="py-5">
                            <img src="/img/no-result.svg" alt="" class="img-empty"> 
                            <p class="h5 mt-4 d-block fw-normal">
                                No data found
                            </p>
                        </div>
                    </td>
                </tr>
                </tbody>
                </table>

                <div  class="row" >
                    <div class="col-md-4" >
                    Your available credits: <strong>{{messagestats.credits_available}}</strong>
                    </div> <!-- end col 12 -->
                    <div class="col-md-4" v-if="weeklystatsdata" >
                    Your estimated use: {{getCreditsUseEstimatedPerMonth()}}
                    </div> <!-- end col 12 -->
                    <div class="col-md-4" >
                        <button class="btn btn-warning" 
                                @click="openPurchaseCredits()"> Purchase Credits </button>
                    </div> <!-- end col 12 -->
                </div>

            </div> <!-- end col 12 -->
        </div>
        <br>
        
         <div  class="row" >
            <div class="col-md-4" >
              Your Current Plan: <b> {{messagerates.current_plan_level_string}}</b>
            </div> <!-- end col 12 -->
         
        </div>

        <div class="row">
             <div class="col-md-12" color="danger">
               <b> </b>
            </div>
         </div>
          <div  class="row" >
            <div class="col-sm-12" >
             Estimated  <b>Free </b> Text Messages/Month for  <b> {{messagerates.current_plan_level_string}}</b> : {{getEstimatedFreeTextsForPlan()}}<br>
                
            </div> <!-- end col 12 -->
             
        </div>

         </CModalBody>
        <CModalFooter>
            <CButton @click="closeStatsModal" color="success">OK</CButton>
        </CModalFooter>
      </CModal>

    </div>
</template>
<script>
import utils_lib from '../helpers/utils_lib';
export default {
     inheritAttrs: false ,
    props: {

        show_statistics: {type: Boolean, default:false},
        show_rates_table: {type: Boolean, default:false},
        
    },
      watch: { 
        show_statistics: function(newVal, oldVal) { 
           
            if (newVal && this.weeklystatsdata == null)
            {
                  this.viewMessagingStatistics()
            }
            else if(newVal)
            {
                this.show_modal= true;
            }
        },
        show_rates_table:function(newVal, oldVal) { 
           
            console.log("asdasdasdasd---a S")
           if (newVal && this.weeklystatsdata == null)
           {
                 this.viewRatesModal()
           }
           else if(newVal)
           {
               this.show_rates_modal= true;
           }
       }, 
    },
    name: 'MessageUsageSummary',
    emits: ['close'],
	data() {
        return {
            // show_statistics : false,
             messagestats : null,
             weeklystatsdata : null,
             show_modal: false,
             show_rates_modal: false,
             messagerates: null
        }
    },
	mounted() {
           if(this.show_statistics)
           {
            if (this.messagestats == null)
            {
                this.viewMessagingStatistics()
            }
            else
            {
                this.show_modal = true
            }
           }
           if(this.show_rates_table)
           {
                this.viewRatesModal()
           }
         
	},
	methods: {
    openPurchaseCredits()
    {
        this.closeStatsModal()
        this.$router.push('/standalonepurchases')
    },
    getDateRangeString()
    {
        if( this.messagestats)
        {
            let v = ""
            v = utils_lib.getFormattedDate(this.messagestats.cached_weekly_stats_begin_ts,"MMM DD, YYYY")  + " to "
            + utils_lib.getFormattedDate(this.messagestats.cached_weekly_stats_end_ts,"MMM DD, YYYY")
            return v;  

        }
        return "NA"
         
    },
    getEstimatedFreeTextsForPlan()
    {
        if(this.messagerates && this.messagerates.text_messages_estimated )
        {
            return  this.messagerates.text_messages_estimated
        }
    },
    getCreditsEstimatedToLast()
    {
        if (! this.weeklystatsdata || !this.messagestats)
        {
            return "NA"
        }
        let credits =  this.messagestats.credits_available;
        let allchannels =  this.weeklystatsdata['all_channels'];
        if(allchannels && allchannels.summary && allchannels.summary.avg_credits>0)
        {
            let est = credits/allchannels.summary.avg_credits
            return  Math.round(est-0.5) + " weeks";
        }
    },
    getCreditsUseEstimatedPerMonth()
    {
        if (! this.weeklystatsdata || !this.messagestats)
        {
            return "NA"
        }
        let credits =  this.messagestats.credits_available;
        let allchannels =  this.weeklystatsdata['all_channels'];
        if(allchannels && allchannels.summary && allchannels.summary.avg_credits>0)
        {
            console.log(allchannels.summary, "asdasdsadas")
            let est = Math.round((allchannels.summary.avg_credits*4)+1.0) //4 weeks to a month, 1.0 for maintenance
            if (allchannels.summary.avg_items<6)
            {
                return "Not enough data"
            }
            return  est <= 1.00 ? est + "  credit / month" :    est + "  credits / month";
        }
    },
    viewMessagingStatistics(){
            this.$schedsdk.getMessagingRateTable().then(res=>{
                this.messagerates = res.data;
                
            })
            this.$schedsdk.getBusinessMessagesWeeklyStats().then(res=>{
                    this.messagestats = res.data;
                    this.show_modal = true;
                    //console.log( res.data.cached_weekly_stats_data.length )
                    //console.log( res.data.cached_weekly_stats_data[0] )
                    
                    if( res.data.cached_weekly_stats_data && 
                        res.data.cached_weekly_stats_data.length &&
                        res.data.cached_weekly_stats_data[0])
                    {
                        this.weeklystatsdata = res.data.cached_weekly_stats_data[0];
                    }
                    else
                    {
                         this.weeklystatsdata = null
                   
                    }
                   //  console.log("asdasdsa=d==", this.weeklystatsdata.all_channels)
            })
    },
    viewRatesModal(){
        
        this.$schedsdk.getMessagingRateTable().then(res=>{
                this.messagerates = res.data;
              
            })
            this.$schedsdk.getBusinessMessagesWeeklyStats().then(res=>{
                    this.messagestats = res.data;
                    this.show_rates_modal = true;
                    //console.log( res.data.cached_weekly_stats_data.length )
                    //console.log( res.data.cached_weekly_stats_data[0] )
                    
                    if( res.data.cached_weekly_stats_data && 
                        res.data.cached_weekly_stats_data.length &&
                        res.data.cached_weekly_stats_data[0])
                    {
                        this.weeklystatsdata = res.data.cached_weekly_stats_data[0];
                    }
                    else
                    {
                         this.weeklystatsdata = null
                   
                    }
                   //  console.log("asdasdsa=d==", this.weeklystatsdata.all_channels)
            })
         
    },
    closeStatsModal(){
        this.show_modal = false;
        this.show_rates_modal = false;
        this.$emit("close");
        
    },
    showRateTable()
    {
        this.show_modal = false;
        this.show_rates_modal = true;
    },
    
	}
}
</script>