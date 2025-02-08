<template>
    <template v-if="albums.length > 0">
        <div class="row">
            <div class="col-md-12 d-inline-flex align-items-center mb-3">
                <div class="d-inline-flex">
                    <Icon icon="tabler:album-grid" :height="26" class="position-relative album-icon" />
                    <span class="h5 mb-0 d-block ms-2">{{customer.first_name}} {{customer.last_name}}'s pictures</span>
                </div>
                <button
                    class="btn btn-success ms-3"
                    @click="$router.push('/customer/pictures/'+user_id+'/add')"
                >
                    Add Pictures
                </button>
            </div>
        </div>
        <div class="row">
            <album-grid 
                v-for="(album) in albums" 
                v-bind:key="album._id"
                :album="album"
                @delete="deleteHandler"
            />
        </div>
    </template>
    <div class="row text-center" v-else>
        <NoResult>
            <p class="h5 mt-4 d-block fw-normal text-capitalize mb-5">No albums found!</p>
            <div>
                <button
                    class="btn btn-success"
                    @click="$router.push('/customer/pictures/'+user_id+'/add')"
                >
                    Add Pictures
                </button>
            </div>
        </NoResult>
    </div>
</template>

<script>
import Gallery from './Gallery.vue';
import AlbumGrid from './AlbumGrid.vue';
import NoResult from '@/ui_components/NoResult.vue'
import { Icon } from '@/common/Icon'

export default {
    components: {
        Gallery,
        AlbumGrid,
        NoResult,
        Icon
    },
    data() {
        return ({
            user_id: null,
            albums: [],
            customer: {}
        })
    },
    async mounted() {
        const { user_id } = this.$route.params;
        this.user_id = user_id;
        await this.populateAlbums();
    },
    methods: {
        async populateAlbums() {
            const user_id = this.user_id;
            const { business_id } = this.$store.state.user_data;
            const pictures_list_res = await this.$schedsdk.albums_list({
                user_id,
                business_id
            });
            if (pictures_list_res.status) {
                this.albums = pictures_list_res.data;
                this.customer = pictures_list_res.user;
                this.albums.forEach((album) => {
                    album.images = album.pic_array.map((p) => {
                        let img = {
                            width: 1669,
                            height: 2500,
                            thumbnailURL: p.url,
                            largeURL: p.url,
                            caption: p.caption,
                            description: p.description
                        }
                        return img;
                    })
                })
            }
        },
        deleteHandler(item) {
            let confirmed = confirm("Are you sure to delete this album?");
            if (confirmed) {
                this.$schedsdk.delete_album(item._id).then(async (result)=>{
                    await this.populateAlbums();
                }).catch(console.error);
            }
        }
    }
}
</script>
<style scoped>
    .btn {
        line-height: 20px;
        padding-top: 8px;
    }
    .pic-description {
        color: var(--text-primary-color);
    }
    .card-outer {
        overflow: hidden;
    }
    .card-outer .card {
        position: relative;
        padding: 5px;
    }
    .card-outer .card::before {
        position: absolute;
        top: 0;
        left: -75%;
        z-index: 2;
        display: block;
        content: '';
        width: 50%;
        height: 100%;
        background: -webkit-linear-gradient(left, rgba(255,255,255,0) 0%, rgba(255,255,255,.3) 100%);
        background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,.3) 100%);
        -webkit-transform: skewX(-25deg);
        transform: skewX(-25deg);
    }
    .card-outer .card:hover::before {
        -webkit-animation: shine .75s;
        animation: shine .75s;
    }
    @-webkit-keyframes shine {
        100% {
            left: 125%;
        }
    }
    @keyframes shine {
        100% {
            left: 125%;
        }
    }
    .card-outer .card .caption {
        cursor: pointer;
        position: absolute;
        opacity: 0;
        top: 300px;
        -webkit-transition: all 0.15s ease-in-out;
        -moz-transition: all 0.15s ease-in-out;
        -o-transition: all 0.15s ease-in-out;
        -ms-transition: all 0.15s ease-in-out;
        transition: all 0.15s ease-in-out;
    }
	.card-outer .card:hover .caption {
		opacity: 1;
		transform: translateY(-100px);
		-webkit-transform:translateY(-100px);
		-moz-transform:translateY(-100px);
		-ms-transform:translateY(-100px);
		-o-transform:translateY(-100px);
	}
	.caption {
		cursor: pointer;
		position: absolute;
		opacity: 0;
        left: 0;
        /* padding: 5px; */
        width: 100%;
        top:300px;
		-webkit-transition:all 0.15s ease-in-out;
		-moz-transition:all 0.15s ease-in-out;
		-o-transition:all 0.15s ease-in-out;
		-ms-transition:all 0.15s ease-in-out;
		transition:all 0.15s ease-in-out;
	}
	.caption-text{
		z-index: 10;
		color: #fff;
        background: rgba(0, 0, 0, .8);
		width: 100%;
		height: 100px;
		text-align: left;
        padding: 15px;
	}
    .album-icon {
        top: -2px;
    }
</style>