<template>
    <div>
        <Alerts 
        :alertData="alertData" 
        :show="show"
        @alertClosed="alertClosedFn"
        v-if="alert" />
        <form  class="profile-form">
            <input type="text" id="remove_image" :value="0" name="remove_image"  hidden>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-body">
                        <div class="form-group">
                            <label class="control-label"><b>First Name</b></label>
                            <span class="star">*</span>
                            <input class="form-control placeholder-no-fix" type="text" maxlength="50" v-model="user.first_name" name="first_name"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label"><b>Last Name</b></label>
                            <span class="star">*</span>
                            <input class="form-control placeholder-no-fix" type="text" maxlength="50" v-model="user.last_name" name="last_name"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label"><b>E-Mail</b></label>
                            <input class="form-control placeholder-no-fix" type="text" maxlength="50" v-model="user.email" name="email"/>
                            <label id="sub_error_email" class="error"></label>
                        </div>
                        <div class="form-group">
                            <label class="control-label"><b>Phone</b></label>
                            <input class="form-control placeholder-no-fix" type="text" maxlength="50" v-model="user.phone" name="phone"/>
                            <label id="sub_error_phone" class="error"></label>
                        </div>
                        <br>
                        <div class="form-group">
                             <div id="uploaded_image" class="image" style="float: right!important;">
                                <!-- <a class="single_image" title="Click to view" :href="images/upload/user.profile_pic"> -->
                                    <img class="img-circle" style="height: 60px;width:60px;border-radius: 50%;" alt="no-image" :src="user.profile_pic" >
                                <!-- </a> -->
                            </div>
                            <div id="uploadFile_div" class="" style="overflow: hidden;" >
                                <input id="pic" ref="file" class="form-group upload_pic" type="file" name="photo" @change='openFile($event);'>

                            </div>
                            <div class="" style="overflow: hidden;" >
                                <a class="email_color" href="javascript:void(0);" @click="clearFileInputField('uploadFile_div')">Clear</a> 
                            </div>
                        </div>
                        <div class="form-actions">
                            <button @click.prevent="$router.push('/settings/set_business_hours/user/' + user._id)" class="btn btn-info">My Schedule</button>
                            &nbsp; 
                            <button @click="submitProfileDetail($event)" class="btn btn-success">Update Profile</button>
                            &nbsp; 
                            <!-- <a id="register-back-btn" :href="dashboard" class="btn btn-default">Cancel</a> -->
                        </div>
                        <div class="form-actions">
                            <!-- <a id="register-back-btn" :href="dashboard" class="btn btn-default">Cancel</a> -->
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>
<script>
import Alerts from '../Alerts'
import login_helper from '../../helpers/login_helper';
export default {
    name:'Profile',
    components:{
        Alerts
    },
    data(){
        return{
            user:{},
            old_pic: '',
            alert:false,
            show:0,
            alertData:{
                message:'',
                type:''
            },
        }
    },
    created(){

        //this.getProfileDetail();
    },
    mounted(){
             this.$router.push('/users/detail/' + this.$store.state.user_data._id)
    },

    methods:{
        openFile(event) {
            var input = event.target;
            // Instantiate FileReader
            var reader = new FileReader();
            reader.onload = () => {
                let TheFileContents = reader.result;
                this.user.profile_pic = TheFileContents;
            };
            // Produce a data URL (base64 encoded string of the data in the file)
            // We are retrieving the first file from the FileList object
            reader.readAsDataURL(input.files[0]);
        },
        clearFileInputField(tagId) {
            this.user.profile_pic= this.old_pic;
        },
        getProfileDetail(){
            this.$schedsdk.get_profile({type:1}).then((result)=>{
                this.user = result.data;
                this.old_pic = this.user.profile_pic;
            })
        },
        submitProfileDetail(e){
            e.preventDefault();
            this.alert = false;
            this.show=4;
            let formData = {}
            let data_type =2;
                
            formData = this.user;
            data_type =3; // 3 is for selecting non business profile
            this.$schedsdk.update_profile(data_type ,formData).then((result)=>{
                if(result.status == 1)
                {
                    this.old_pic = this.user.profile_pic;
                    this.user = result.data;
                    
                    this.alertData = {
                        message:result.message,
                        type:'success'
                    }
                    let thisRef = this;
                    if(this.$refs.file.files.length)
                    {
                         this.alertData = {
                             message: "Data update complete. Uploading picture...",
                             type:'success'
                        }
                        this.alert = true;
                        formData =  new FormData();
                        formData.append('profile_pic', this.$refs.file.files[0]);
                        this.$schedsdk.update_profile_pic(formData).then((result)=>
                        {
                            this.alertData = {
                                 message: "Picture update complete",
                                type:'success'
                                }
                            this.user.profile_pic = result.profile_pic
                            login_helper.apply_new_user_data(thisRef.$schedsdk,thisRef.$store, this.user)
                            this.alert = true;
                        }).catch((ex)=>{

                            this.alertData = {
                                message:ex.data.message || "Upload Error",
                                type:'danger'
                            }
                            this.alert = true;
                        });
                    } //end if files
                    else
                    {
                        login_helper.apply_new_user_data(thisRef.$schedsdk,thisRef.$store, result.data)
                        this.alert = true;
                    }

                    
                }
                else
                {
                    this.alertData = {
                        message:result.message,
                        type:'danger'
                    }
                    this.alert = true;
                }
            }).catch((ex)=>{
                let message  = "Error: ";
                if (ex.data && ex.data.message)
                {
                    message += ex.data.message;
                }
                else if (ex.statusText)
                {
                    message += ex.statusText;
                }else
                {
                    message += "uploading";
                }
                this.alertData = {
                    message:message,
                    type:'danger'
                }
                this.alert = true;
            });
        },
        alertClosedFn() {
            this.show = 0;
        }
    }
}
</script>
<style scoped>
.upload_pic{
        display: inline !important;
    }
    
</style>