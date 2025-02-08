<template>
    <div class="card">
        <div class="card-body pt-4 px-2 px-sm-3">
            <div class="form-field-height">
                <h4 class="mb-4">Results</h4>
            
                    <p class="mb-0" v-for="(item, index) in successArray" :key="index">
                                    {{ item }}
                                </p>
                                <p class="mb-0" v-for="(nextStep, index) in nextSteps" :key="index">
                                    <strong>Next Steps</strong>
                                    {{ nextStep.text }}
                    </p>
                               
                 
                       
                       
                    <div class="d-flex align-items-center">
                        <img
                            src="@/assets/images/qr.png"
                            alt="qr"
                        /><br>
                        
                    </div>
                    <p class="mb-0">
                                    Scan code with camera to visit our help pages:
                                    <a href="javascript:void(0)"
                                        >https://skysched.silverskysoft.com/hc/</a
                                    >
                                </p>
                               
                                    <p class="mb-0">
                                    For support, please send an email to
                                    <a href="javascript:void(0)">support@silverskysoft.com</a>
                                </p>
                    
                 
            </div>
            <div class="row">
                <div class="col-md-12 mt-5 pt-2">
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-light" type="button">
                            Previous
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'StartWizardFinish',
    props: {
        successArray: {
            default: [],
            type: Array
        },
        nextSteps: {
            default: [],
            type: Array
        }
    }

}
</script>
