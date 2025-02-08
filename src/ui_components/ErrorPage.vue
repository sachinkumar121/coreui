<template>
    <div class="py-5 text-center error-prompt-div">
        <img src="/img/no-result.svg" alt="" class="img-empty"> 
        <p class="h5 mt-4 d-block fw-normal text-capitalize mb-5">
            <span v-if="displayError !== ''">{{ displayError }}</span>
        </p>
        <button v-for="(errorMsg, index) in errorMsgs" :key="index" @click="showError(index)">{{ errorMsg }}</button>
    </div>
</template>
<script>
export default {
    name: 'ErrorPage',
    data() {
        return {
            errorMsgs: ['500 Internal Server Error', '401 Unauthorised', '400 Bad Request', '403 Forbidden', '404 Not Found', '501 Not Implemented', '502 Service Temporarily Overloaded', '503 Service Unavailable', 'Connection Refused by Host', 'File Contains No Data', 'Cannot Add Form Submission Result to Bookmark List', 'Helper Application Not Found', 'TCP Error Encountered While Sending Request to Server', 'Failed DNS Look-Up', '408 – Request Time-Out'],
            displayError: '404 Not found'
        }
    },
    methods: {
        showError(index) {
            this.displayError = this.errorMsgs[index];
        }
    }
}
</script>
<style>
</style>
