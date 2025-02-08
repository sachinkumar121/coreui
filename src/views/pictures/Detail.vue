<template>
	 <div class="bg-phone">
        <div class="row">
            <div class="col-md-12 d-inline-flex align-items-center mb-3">
                <div class="d-inline-flex cursor-pointer" @click="$router.go(-1)">
                    <Icon icon="tabler:chevron-left" :height="22" />
                    <span class="fw-medium mb-0 d-block ms-1 position-relative back-text">Back</span>
                </div>
            </div>
        </div>
        <div class="row" v-if="album">
            <div class="col-md-12">
                <div class="d-inline-flex head-picture-book">
                    <Icon icon="tabler:album-grid" :height="26" />
                    <div class="d-inline-flex ms-2">
                        <a v-if="album.booking_id" target="_blank" @click="$router.push('/bookings/detail/' +album.booking_id._id)">
                            <u>Related to {{album.booking_id.service_order_id}}</u>
                        </a>
                        <span v-else>General</span>
                        <span class="d-block text-sm ms-2">last updated: {{formattedUpdatedAt}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="gallery-phone-book bg-phone">
            <Gallery 
                :galleryID="'album-'+album._id"
                :images="photo_data" 
            />
            <!-- <div class="col-md-4 col-lg-3"
                v-for="(image) in photo_data" 
                v-bind:key="image._id"
            >
                <div class="card position-relative">
                    <span class="badge label-badge  position-absolute" :class="[album.group_tag == 1 ? 'badge-before' : 'badge-after']">{{album.group_tag == 1 ? 'Before' : 'After'}}</span>
                    <img :src="image.url">
                </div>
            </div> -->
        </div>
     </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Icon } from '@/common/Icon'
import { inject } from 'vue';
import { useRoute } from "vue-router";
import moment from 'moment';
import Gallery from './Gallery';

export default {
    setup() {
        const photo_data = ref([]);
        const album = ref({});
        const $schedsdk = inject("$schedsdk");
        const route = useRoute()
        const { id: album_id } = route.params;
        onMounted(async () => {
            if (Boolean(album_id)) {
                const albumRes = await $schedsdk.get_album(album_id);
                if (albumRes.status) {
                    album.value = albumRes.data;
                    let { pic_array } = albumRes.data;
                    pic_array = pic_array.map((p) => {
                        // p.preview = p.url;
                        // return p;
                        let img = {
                            _id: p._id,
                            url: p.url,
                            width: 1669,
                            height: 2500,
                            thumbnailURL: p.url,
                            largeURL: p.url,
                            caption: p.caption,
                            description: p.description
                        }
                        return img;
                    })
                    photo_data.value = pic_array;
                }
            }
        });

        return {
            photo_data,
            album
        }
    },
    components: {
        Icon,
        Gallery
    },
    computed: {
        formattedUpdatedAt() {
            return moment(this.album.updated_at).format('MMMM Do YYYY, hh:mm a');
        }
    }
}
</script>