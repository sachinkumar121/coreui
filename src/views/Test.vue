<template>
	<div class="my-3 p-5">
		<!-- <SearchBar /> -->
		<div class="row">
			<div class="col-md-12">
				<div class="d-inline-flex">
					<Icon icon="tabler:chevron-left" :height="22" />
					<span class="fw-medium mb-3 d-block ms-1">Back</span>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12">
				<div class="d-inline-flex">
					<Icon icon="tabler:album-grid" :height="26" />
					<div class="d-inline-flex ms-2">
						<a href="">
							<u>Related to XSKXM7375</u>
						</a>
						<span class="d-block text-sm ms-2">last updated: 22 April 2024 11:00 PM</span>
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12">
				<div class="d-inline-flex">
					<Icon icon="tabler:album-grid" :height="26" />
					<span class="h5 mb-3 d-block ms-2">Albums</span>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-4 col-lg-3">
				<div class="card position-relative">
					<span class="badge label-badge badge-before position-absolute">before</span>
					<button @click="removeRow(index)" type="button" class="border border-0 position-absolute btn-float-trash">
						<Icon icon="tabler:trash" :height="20" class="mb-0 text-danger" />
					</button>
					<img src="https://placehold.co/600x400" class="mb-2 card-img-top" alt="">
					<div class="d-flex justify-content-between pt-1 pb-2 px-3 align-items-center">
						<div>
							<a href=""><u>General</u></a>
							<p class="mb-0">22 April 2024 11:00 PM</p>
						</div>
						<a href="" class="">
							<Icon icon="tabler:dots-vertical" :height="20" />
						</a>
					</div>
				</div>
			</div>
			<div class="col-md-4 col-lg-3">
				<div class="card position-relative">
					<span class="badge label-badge badge-after position-absolute">After</span>
					<img src="https://placehold.co/600x400" class="mb-2 card-img-top" alt="">
					<div class="d-flex justify-content-between pt-1 pb-2 px-3 align-items-center">
						<div>
							<a href=""><u>General</u></a>
							<p class="mb-0">22 April 2024 11:00 PM</p>
						</div>
						<a href="" class="">
							<Icon icon="tabler:dots-vertical" :height="20" />
						</a>
					</div>
				</div>
			</div>
			<div class="col-md-4 col-lg-3">
				<div class="card position-relative">
					<span class="badge label-badge badge-after position-absolute">After</span>
					<img src="https://placehold.co/600x400" class="mb-2 card-img-top" alt="">
					<div class="d-flex justify-content-between pt-1 pb-2 px-3 align-items-center">
						<div>
							<a href=""><u>Related to XSKXM7375</u></a>
							<p class="mb-0">22 April 2024 11:00 PM</p>
						</div>
						<a href="" class="">
							<Icon icon="tabler:dots-vertical" :height="20" />
						</a>
					</div>
				</div>
			</div>
			<div class="col-md-4 col-lg-3">
				<div class="card position-relative">
					<span class="badge label-badge badge-before position-absolute">before</span>
					<img src="https://placehold.co/600x400" class="mb-2 card-img-top" alt="">
					<div class="d-flex justify-content-between pt-1 pb-2 px-3 align-items-center">
						<div>
							<a href=""><u>General</u></a>
							<p class="mb-0">22 April 2024 11:00 PM</p>
						</div>
						<a href="" class="">
							<Icon icon="tabler:dots-vertical" :height="20" />
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
// import SearchBar from '@/ui_components/SearchBar.vue'
// import TimezoneSelect from '../ui_components/TimezoneSelect.vue';
//import SignupForm from "./classes/SignupForm.vue";
import { Icon } from '@/common/Icon'

export default {
    name: 'Test',
    components:{
		//TimezoneSelect,
		Icon
	},
	
  
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
</style>