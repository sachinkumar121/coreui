<template>
    <CModal class="quote-modal" :visible="visible" alignment="center" @close="$emit('onClose')">
        <CModalHeader>
            <CModalTitle>Message of the Day</CModalTitle>
        </CModalHeader>
        <CModalBody class="py-5 pb-4">
            <div class="d-flex align-items-center min-vh-50 w-100">
                <div class="mx-auto col-md-10 px-3 text-start" v-if="text">
                    <h2 class="mb-5"><i>{{text}}</i></h2>
                    <p>- {{author}}</p>
                </div>
            </div>
        </CModalBody>
        <CModalFooter>
            <span class="text-gray-close">Closes in {{countdown}} seconds</span>
        </CModalFooter>
    </CModal>
</template>

<script>
export default {
    mounted() {
        this.startCountdown();
    },
    name: 'QuoteModal',
    emits: ['onClose'],
    data() {
        return {
            countdown: this.hideSeconds,
            interval: null
        }
    },
    props: {
        visible: {
            default: false,
            type: Boolean
        },
        text: {
            required: true,
            type: [String, null]
        },
        author: {
            default: "Anonymous",
            type: [String, null]
        },
        hideSeconds: {
            default: 10,
            type: Number
        }
    },
    methods: {
        startCountdown() {
            this.interval = setInterval(() => {
                if (this.countdown > 0) {
                    this.countdown--;
                } else {
                    clearInterval(this.interval);
                }
            }, 1000);
        },
    },
    beforeDestroy() {
        clearInterval(this.interval);
    }
}
</script>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Urbanist:ital@0;1&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@500&family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Urbanist:ital@0;1&display=swap');
    .quote-modal h2 {
        font-family: "Urbanist", sans-serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
    }
    .quote-modal p {
        font-family: "Comfortaa", sans-serif;
        font-optical-sizing: auto;
        font-weight: 500;
        font-style: normal;
    }
    .quote-modal.fade {
        transition: opacity .7s ease-in;
    }
    .quote-modal.modal.fade .modal-dialog {
        transition: transform .3s ease-out;
        transform: translate(0, 0);
    }
    .quote-modal.modal .modal-dialog {
        transition: none !important; 
    }
    .quote-modal.modal.fade.show .modal-dialog {
        transform: none !important; 
    }
    .quote-modal .modal-dialog .modal-footer {
        justify-content: flex-start;
    }

</style>