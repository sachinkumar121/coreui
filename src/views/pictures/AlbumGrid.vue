<template>
    <div class="col-md-4 col-lg-3">
        <a @click="$router.push('/albums/' +album._id)">
            <div class="card position-relative">
                <span class="badge label-badge  position-absolute" :class="[album.group_tag == 1 ? 'badge-before' : 'badge-after']">{{album.group_tag == 1 ? 'Before' : 'After'}}</span>
                <button @click.stop="$emit('delete', album)" type="button" class="border border-0 position-absolute btn-float-trash">
                    <Icon icon="tabler:trash" :height="20" class="mb-0 text-danger" />
                </button>
                <div class="grid-cover animate">
                    <img :src="album.images[0].thumbnailURL">
                </div>
                <div class="d-flex justify-content-between pt-3 pb-3 px-3 align-items-center border-detail">
                    <div class="card-detail">
                        <a v-if="album.booking_id" target="_blank" class="ms-0 me-1 ms-xl02 me-xl-2 cursor-pointer btn-link c-sub-text" @click.stop="$router.push('/bookings/detail/' +album.booking_id._id)"><u>Related to {{album.booking_id.service_order_id}}</u></a>
                        <span v-else>General</span>
                        <!-- <p class="mb-0">{{formattedUpdatedAt}}</p> -->
                    </div>
                    <div class="action_column">
                        <CDropdown class="dropstart" @click.stop="null">
                            <CDropdownToggle color="primary">
                                <Icon
                                    icon="tabler:dots-vertical"
                                    :height="20"
                                />
                            </CDropdownToggle>
                        <CDropdownMenu>
                            <CDropdownItem
                                href="javascript:void(0)"
                                @click="$router.push('/albums/' + album._id + '/edit')"
                            >
                                <div>
                                    <Icon
                                        icon="tabler:edit"
                                        :height="20"
                                    />
                                    <span>Edit Album</span>
                                </div>
                            </CDropdownItem>
                            <CDropdownItem
                                href="javascript:void(0)"
                                @click="$emit('delete', album)"
                            >
                                <div>
                                    <Icon
                                        icon="tabler:trash"
                                        :height="20"
                                    />
                                    <span>Delete Album</span>
                                </div>
                            </CDropdownItem>
                        </CDropdownMenu>
                    </CDropdown>
                    </div>
                    
                    <!-- <span>
                        <Icon icon="tabler:dots-vertical" :height="20" />
                    </span> -->
                </div>
            </div>
        </a>
    </div>
</template>

<script>
import { Icon } from '@/common/Icon'
import moment from 'moment';

export default {
    name: 'AlbumGrid',
    emits: ['delete'],
    components: {
        Icon
    },
    props: {
        album: [Object, null]
    },
    computed: {
        formattedUpdatedAt() {
            return moment(this.album.updated_at).format('MMMM Do YYYY, hh:mm a');
        }
    }
}
</script>

<style scoped>
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
.dropstart .dropdown-toggle:focus {
    outline: 0;
    box-shadow: none;
}
.dropstart .btn {
    padding: 0;
}
.dropstart .dropdown-toggle::before {
    display: none;
}
.action_column .btn.btn-primary {
    color: var(--text-primary-color);
    background: transparent;
    border: 0;
}
.action_column .btn svg {
    fill: transparent;
    width: 24px;
    height: 20px;
    vertical-align: middle;
}
.action_column .dropdown-menu .dropdown-item {
    padding: .4rem 1rem;
}
.dropdown-menu .dropdown-item:hover {
    color: #6d57e4;
    text-decoration: none;
    background: #f9f8ff;
}
.dropdown-menu a {
    font-size: 14px;
    color: #000;
}
.dropdown-menu a svg {
    margin-right: 5px;
}
.card-detail {
    color: var(--text-primary-color);
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    text-wrap: nowrap;
}
.border-detail {
    border-top: 1px solid #d8dbe0;
}

</style>