<template>
    <CContainer class="content-left">
            <h3>{{data.message}}</h3>
            <br>
            <div v-if="data.record_found">
                <input type="hidden" name="records_action_verification_token" :value ="data.data.records_action_verification_token"/>
                <input type="hidden" name="accesskey" :value ="data.data.accesskey"/>
                <input type="hidden" name="verify_token" :value ="verify_token"/>
                <button name = "action" @click= "DownloadData" class="btn btn-primary">Download data</button> &nbsp; &nbsp;
                <button name = "action" @click= "RemoveData" class="btn btn-danger">Remove data</button>
                <br>
                <label style="color:red;font-size: 12px;margin-top: 16px;background: #ffd5d5;padding: 10px 20px;width: 100%">Removing data is permanent</label>
            </div>  
            
            <!-- <div v-else> -->
            
            <div class="form-group"> 
            
            <button @click="$emit('back')" class="btn btn-success" >Back to lookup page</button>
                 
            </div>
             
            <!-- </div> -->
    </CContainer>
</template>
<script>
export default {
    name:"Records",
    props: ['recordsData'],
    data(){
        return{
            data:this.recordsData,
            verify_token: ""
        }
    },
    created(){
        this.verify_token = this.$route.params.token || "";
        this.getrecordsData();
    },
    methods:{
        getrecordsData(){
            // console.log("data",this.data)
            // console.log('recordData',this.recordsData)
           
           
            if(this.data == undefined)
            {
                this.data = {};
                this.data.message ="";
                this.data.data = {};
                this.data.data.records_action_verification_token ="";
                this.data.data.accesskey = "";
                if (this.verify_token != "")
                {
                    this.data.record_found = true;
                }
                
            }
        },
        DownloadData()
        {
            let sendData = this.data.data;
            // console.log(this.data)
            sendData.action = "Download data"
            sendData.verify_token = this.verify_token
            this.$schedsdk.action_recordsData(sendData).then((result)=>{
                if(result.status == 1){
                    this.data = result
                }
                else if(result.status == 2){
                    for(let f = 0;f<result.files.length; f++){
                        // console.log(import.meta.env.VITE_LOOKUP_RECORDS_BASE_URL+result.data.files[f].name)
                        let link = document.createElement('a')
                        link.href = import.meta.env.VITE_LOOKUP_RECORDS_BASE_URL+result.data.files[f].name
                        link.download = result.files[0].name
                        link.click()
                    }
                }
            });
        },
        RemoveData(){
             let sendData = this.data.data;
            sendData.action = "Remove data"
            this.$schedsdk.action_recordsData(sendData).then((result)=>{
                // console.log(result);
                if(result.status == 1){
                    this.data = result
                }
            });
        }
    }
}
</script>