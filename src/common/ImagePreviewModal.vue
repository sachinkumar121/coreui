<template>
    <CModal 
        :visible="show"
        aria-labelledby="ImagePreviewModal"
        @close="onModalClose"
        :unmount-on-close="true"
        class="image-preview"
    >
        <CModalHeader>
            <CModalTitle id="ImagePreviewModal">{{ title || "Preview Image" }}</CModalTitle>
        </CModalHeader>
        <CModalBody class="text-center">
            <DragDropFile 
                class="dropzone-modal"
                name="customer_profile_pic"
                title="Customer Profile Pic"
                :initialFile="image_url"
                @initial-file-remove="onInitialFileRemove"
                @file-change="onFileChange"
                @file-remove="onFileRemove"
            />
            <!-- <img :src="url" :alt="title"> -->
        </CModalBody>
        <CModalFooter>
            <CButton color="primary" @click="updateOrRemoveImage" :disabled="uploading">
                Save
            </CButton>
            <CButton color="secondary" @click="onModalClose">
                Close
            </CButton>
        </CModalFooter>
    </CModal>
</template>

<script>
import DragDropFile from "@/ui_components/DragDropFile.vue";

export default {
    name: 'ImagePreviewModal',
    components: {
        DragDropFile
    },
    emits: ['onClose', 'onUpdateImage', 'onRemoveImage'],
    props: {
        url: {
            required: true,
            type: [String, null]
        },
        title: {
            default: "image",
            type: String
        }
    },
    data() {
        return ({
            show: this.visible,
            image_url: this.url,
            file: null,
            uploading: false
        })
    },
    watch: {
        visible: function(newVal) {
            this.show = newVal;
        },
        url: {
            immediate: true,
            handler (newVal) {
                this.image_url = newVal;
                this.uploading = false;
                this.file = null;
            }
        },
    },
    methods: {
        onModalClose() {
            this.$emit('onClose');
        },
        onFileRemove() {
            this.file = null;
        },
        onInitialFileRemove() {
            this.image_url = null; 
            this.file = null;
        },
        onFileChange(file, key) {
            this.file = file;
        },
        updateOrRemoveImage() {
            this.uploading = true;
            if (this.file) {
                this.$emit('onUpdateImage', this.file)
            } else if (!this.image_url && !this.file) {
                this.$emit('onRemoveImage')
            } else {
                this.$emit('onClose');
            }
        }
    }
}
</script>
<style scoped>
.image-preview .modal-body img {
  max-width: 250px;
  width: 100%;
  max-height: 250px;
}
</style>