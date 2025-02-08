<template>
    <CContainer>
        <div class="row">
            <div class="col-md-12">
                <!-- BEGIN BORDERED TABLE PORTLET-->
                <div class="portlet box green">
                    <div class="portlet-title">
                        <div class="caption">
                            <i class="fa fa-rocket"></i>CSV Response
                        </div>
                    </div>
                    <div class="portlet-body">
                        <div class="row"><br/></div>                   
                        <div class="row"><br/></div>
                        <h4><b>Records Summary of CSV: </b></h4>
                        <div class="table">
                            <table class="table table-bordered table-hover">
                                <thead >
                                    <tr>
                                        <th>Number of records seen</th>
                                        <th>Items added</th>
                                        <th>Categories created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>							
                                        <td>{{data.items_count}}</td>	
                                        <td>{{data.items_added}}</td>
                                        <td>{{data.categories_created_count}}</td>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <h4><b>Skipped records : </b></h4>

                        <div class="table">
                            <table class="table table-bordered table-hover">
                                <!-- {% if data.skipped_records.length != 0 %} -->
                                <thead >
                                    <tr>
                                        <th>Item name</th>
                                        <th>Item category</th>
                                        <th>Skipped_reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if='data.skipped_records.length'>
                                        <template v-for="(records, index) in data.skipped_records" :key="index">
                                            <td>{{records.item_name}}</td>	                                 
                                            <td>{{records.item_category}}</td>	                                 
                                            <td>{{records.skipped_reason}}</td>
                                        </template>
                                    </tr>
                                    <tr v-else>
                                    <td style="text-align: center;"> No record skipped</td>
                                </tr>
                                </tbody>
                                <!-- {% else %} -->
                                
                                <!-- {% endif %} -->
                            </table>
                        </div>
                        <div class="row"><br/></div>                   
                        <div class="row"><br/></div>
                        <div class="form-actions csv_div">
                            <button @click="$emit('back')" class="btn btn-primary">Back</button>
                        </div>  
                    </div>
                </div>
            </div>
        </div>
    </CContainer>
</template>
<script>
export default {
    name:'UploadDetail',
    props: ['uploadData'],
    data(){
        return{
            data:this.uploadData
        }
    }
 
}
</script>
<style scoped>
.csv_div{
        text-align: center;
        display: block; 
        margin: 0 auto;
    }
</style>