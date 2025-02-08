<template>
    <div>
        <Alerts 
            :alertData="alertData" 
            :show="show"
            @alertClosed="show = 0"
            v-if="alert" 
        />
        <div class="col-md-6 col-lg-4">
            <template v-if="!isEditOperation">
                <div class="mb-4">
                    <label class="mb-2">Group by</label>
                    <div class="d-flex gap-3 check-custom">
                        <div class="d-flex gap-2 align-items-center mb-2">
                            <input type="radio" id="group_tag_before" value="1" v-model="group_tag" />
                            <label for="group_tag_before" class="mb-0 mt-1 text-lg">Before</label>
                        </div>
                        <div class="d-flex gap-2 align-items-center mb-2">
                            <input type="radio" id="group_tag_after" value="2" v-model="group_tag" />
                            <label for="group_tag_after" class="mb-0 mt-1 text-lg">After</label>
                        </div>
                    </div>
                </div>
                <label for="booking">Select booking</label>
                <v-select 
                    v-model="booking_id" 
                    label="name" 
                    :options="bookings"
                    :reduce="b => b._id"
                >
                    <template v-slot:no-options>
                        Type to search..
                    </template>
                    <template v-slot:option="option" >
                        <div class="d-center">
                            {{ option.first_name }} {{option.last_name}} | {{option.services.map(s => s.name + ' ' + s.time + ' mins').join(',')}}
                        </div>
                    </template>
                    <template v-slot:selected-option="option" >
                        <div class="selected d-center">
                            {{ option.first_name }} {{option.last_name}} | {{option.services.map(s => s.name + ' ' + s.time + ' mins').join(',')}}
                        </div>
                    </template>
                </v-select>
            </template>
            <div class="dropzone-container text-center mb-3 mt-3"
                @dragover.prevent="null" 
                @dragleave.prevent="null" 
                @drop="(e) => onFileChange(e)"
            >
                <Icon icon="tabler:drag-drop" :height="24" class="mb-2" /> <br>
                <input
                    type="file"
                    :name="'pictures'"
                    :id="'pictures'"
                    class="hidden-input"
                    @change="onFileChange"
                    multiple
                    ref="file"
                    accept=".jpg,.jpeg,.png"
                />
                <label for="pictures" class="">
                    <span class="text-decoration-underline">Click to upload</span>
                </label>
                <span>
                    or drag & drop
                </span>
            </div>
        </div>
        <div>
            <div class="row mb-0 align-items-center">
                <div class="col-md-4 col-lg-3 mb-3" v-bind:key="index" v-for="(photoObj, index) in photo_data">
                    <div class="card position-relative">
                        <div class="grid-cover animate mb-0">
                            <img :src="photoObj.preview" class="card-img-top">
                        </div> 
                        <div class="card-body card-custom">
                            <div class="mb-2">
                                <label for="caption" class="mb-0">Caption</label>
                                <input id="caption" type="text" v-model="photoObj.caption" class="form-control">
                            </div>
                            <div>
                                <label for="description" class="mb-0">Description</label>
                                <textarea id="description" type="text" v-model="photoObj.description" class="form-control"></textarea>
                            </div>
                            <button @click="removeRow(index)" type="button" class="border border-0 position-absolute btn-float-trash">
                                <Icon icon="tabler:trash" :height="20" class="mb-0 text-danger" />
                            </button>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        <div class="d-flex gap-3 w-full justify-content-end">
        <button type="button" @click="$router.push('/customer/pictures/' + album_user_id)" class="btn btn-secondary">Cancel</button>
        <button type="button" :disabled="formSubmit" @click="addEditUserPicture" class="btn btn-success float-end">{{ isEditOperation ? 'Update': 'Save'}}</button>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Icon } from '@/common/Icon'
import { inject } from 'vue';
import { useRoute } from "vue-router";
import Alerts from '@/views/Alerts'

export default {
    setup() {
        const group_tag = ref(1);
        const files = ref([]);
        const bookings = ref([]);
        const photo_data = ref([]);
        const delete_pic_array = ref([]);
        const formSubmit = ref(false);
        const isEditOperation = ref(false);
        const booking_id = ref(null);
        const album_user_id = ref(null);
        const alert = ref(false);
        const show = ref(0);
        const alertData = ref({
            message: '',
            type: ''
        });
        const $schedsdk = inject("$schedsdk");
        const route = useRoute()
        const { id: album_id, user_id = null } = route.params;
        album_user_id.value = user_id;
        onMounted(async () => {
            const res = await $schedsdk.getBookingList();
            bookings.value = res.data;
            isEditOperation.value = Boolean(album_id);
            if (Boolean(album_id)) {
                const albumRes = await $schedsdk.get_album(album_id);
                if (albumRes.status) {
                    album_user_id.value = albumRes.data.user_id;
                    const { pic_array } = albumRes.data;
                    pic_array.map((p) => {
                        p.preview = p.url;
                        return p;
                    })
                    photo_data.value = pic_array;
                }
            }
        });

        return {
            group_tag,
            files,
            photo_data,
            formSubmit,
            bookings,
            booking_id,
            delete_pic_array,
            isEditOperation,
            album_user_id,
            alert,
            show,
            alertData
        }
    },
     components: {
        Icon,
        Alerts
    },
    methods: {
        removeRow(index) {
            let picObj = this.photo_data[index];
            if (this.isEditOperation && picObj._id) {
                this.delete_pic_array.push(picObj)
            }
            this.photo_data.splice(index, 1);
        },
        async uploadImage(file) {
            if (file) {
                let imageUploadData = new FormData;
                imageUploadData.append('file', file);
    
                try {
                    const fileUploadRes = await this.$schedsdk.upload_media('user_pictures', imageUploadData);
                    if (fileUploadRes.status) {
                        return {
                            location: fileUploadRes.location
                        }
                    }
                } catch(error) {
                    return {
                        error
                    }
                }
            }
        },
        async uploadImages(files) {
            let data = [];
            for (const file of files) {
                const response = await this.uploadImage(file)
                if (response.location) {
                    data.push({
                        url: response.location,
                        caption: "caption",
                        description: "description"
                    })
                }
            }
            return data;
        },
        async addEditUserPicture() {
            if (this.photo_data.length == 0) {
                this.alert = true;
                this.show = 1;
                this.alertData = {
                    type: 'danger',
                    message: "Please upload atleast one image."
                }
                return false;
            }
            this.formSubmit = true;
            try {
                let that = this;
                let imageUploadData = new FormData();
                let upload_images = false;
                let pic_array = [];
                let imageUploadResponse = null;

                for(let i = 0; i < this.photo_data.length; i++) {
                    if (this.photo_data[i].file) {
                        upload_images = true;
                        imageUploadData.append('files', this.photo_data[i].file);
                    }
                }
                if (upload_images) {
                    imageUploadResponse = await this.$schedsdk.upload_multiple_media('user_pictures', imageUploadData);

                }
                
                if (imageUploadResponse?.status) {
                    pic_array = imageUploadResponse.data.map(function(d, i) {
                        return {
                            url: d.location,
                            caption: that.photo_data[i].caption,
                            description: that.photo_data[i].description
                        }
                    })
                }

                const response = await this.$schedsdk.create_update_album({
                    user_id: this.album_user_id,
                    group_tag: this.group_tag,
                    booking_id: this.booking_id,
                    pic_array,
                    delete_pic_array: this.delete_pic_array
                });

                if (response.status) {
                    this.$router.push('/customer/pictures/' + this.album_user_id)
                }
                
            } catch (error) {
                console.log(error)
            } finally {
                this.formSubmit = false;
            }
        },
        onFileChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length)
                return;
            this.files = files;
            this.populateImageData();
        },
        populateImageData() {
            for(let i = 0; i < this.files.length; i++) {
                let obj = {
                    file: "",
                    preview: "",
                    caption: "",
                    description: ""
                };
                obj.file = this.files[i];
                obj.preview = this.generatePreviewOfFile(this.files[i]);
                this.photo_data.push(obj);
            }
        },
        generatePreviewOfFile(file) {
            if (file) {
                let fileSrc = URL.createObjectURL(file);
                return fileSrc;
            }
        },
    },
}
</script>
<style scoped>
.hidden-input {
  opacity: 0;
  overflow: hidden;
  position: absolute;
  width: 1px;
  height: 1px;
}
.dropzone-container label {
    color: #a2a2a2;
}
.dropzone-container {
    padding: 2rem 3rem;
    background: #fbfbfb;
    border: 2px dashed #dbdbdb;
    max-width: 100%;
    width: 100%;
    border-radius: 5px;
    color: #a2a2a2;
}
.btn-float-trash {
    right: 10px;
    top: 10px;
    display: inline-flex;
    align-items: center;
    width: 34px;
    height: 34px;
    background: rgb(245 245 245 / 100%);
    border-radius: 20px;
    padding: 8px;
}
</style>