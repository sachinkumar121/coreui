<template>
 <CContainer class="content-left" v-if=switchComponent>
    <form id='customer_form' class="lookup_form">
    <h1 class="form-title">{{business_data.business_name}}</h1>		
    <h3 class="form-title">Lookup records</h3>		
    <input class="form-control" type="hidden" name="accesskey" v-model="business_data.accesskey"/>
     <div>
         <p>Use this form to lookup if your personal information may be present with this business.</p>
         <p>If records are found, a link will be sent to your email with options to download or permanently delete your data</p>
     </div>
     <div class="form-group">
        <label class="control-label"><b>Phone Number</b></label>

        <input class="form-control" type="text"  v-model="phone" placeholder="Phone Number" 
            name="phone"/>
    </div> 
    
    <div class="form-group"><center>
            <label class="control-label"><b>Or</b></label>
        </center>
    </div>
    <div class="form-group">
        <label class="control-label"><b>Email</b></label>

        <input class="form-control" type="text" placeholder="Email" name="email" v-model="email" />
    </div> 
    <div>
         <p>Tip: You may want to enter email or phone but not both to be through.</p>
     </div>

    <div class="md-checkbox has-success">
        <input type="checkbox"  v-model="i_agree" 
                        :checked = i_agree>
        <label v-if="business_data.privacy_policy && business_data.privacy_policy.length>2">&nbsp; 
            <b> By continuing, I agree to the <a :href="business_data.privacy_policy"  target="_blank">privacy policy</a> and agree to use of cookies</b> </label>
        <label v-else>&nbsp; <b> By continuing, I agree to the privacy policy and agree to use of cookies</b> </label>
    </div>  
     <div><Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />  
     </div>
    <div class="form-actions">
        <input type="button" class="btn btn-success uppercase" @click="getRecords" value="Continue">
        <!-- <a class="btn default" deleteLink="/external_access/">Cancel</a><br><br> -->
    </div> 

</form>
</CContainer>
<Records :recordsData='recordsData' @back='backAction' v-else>   </Records> 
</template>
<script>
import Alerts from '../Alerts'
import Records from './Records'
export default {
    name: 'RecordsLookup',
    components: {
        Records, Alerts
    },
    data(){
        return {
            show: false,
            alert:false,
            switchComponent:true,
            recordsData:'',
            email:'',
            phone:'',
            business_data:{},
            i_agree: false
        }
    },
    created(){
        this.getBusinessDetail();
    },
    methods:{
        getBusinessDetail() {
            this.$schedsdk.getBusinessDetail(this.$route.params.accesskey).then((result)=>{
                 console.log(result.data)
                 console.log(result)
                this.business_data = result.data
            })
        },
        getRecords() 
        {
            if (this.i_agree == true)
            {
                this.$schedsdk.getBusinessRecords({accesskey:this.$route.params.accesskey,email:this.email,phone:this.phone}).then((result)=>{
                    this.switchComponent = false
                    this.recordsData = result
                })
            }
            else
            {
              
               this.alertData = {
                        message:"Please select I agree to continue",
                        type:'danger'
                    }
               this.alert = true;
               this.show=10;
            }
            
        },
        backAction(){
            this.switchComponent = true
        },
        alertClosedFn() {
            this.show = 0;
        }
    }
}
</script>