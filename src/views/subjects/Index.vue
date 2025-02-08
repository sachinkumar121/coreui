<template>
	<div class="pt-2">
        <FilterSection>
            <template v-slot:search-input>
                <label class="control-label"><b>Search Name</b></label>
				<input 
					v-model="search"
					class="form-control placeholder-no-fix" 
					type="text"
                    @keyup="searchSubject()"
				/>
            </template>
            <template v-slot:actions>
                <button class="btn btn-success float-end" @click="$router.push('/subjects/add')">Create a Subject</button>
            </template>
        </FilterSection>
		<div class="table-responsive">
			<table class="table table-bordered table-hover">
				<thead>
					<tr>
						<th>Name</th>
						<th>Code</th>
						<th>Description</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody v-if="list.length" >
					<tr v-for="item in list" :key="item._id">
                        <td>{{item.name}}</td>
                        <td>{{item.code}}</td>
                        <td>{{item.description}}</td>
						<td class="action_column">
                            <button class="btn btn-primary btn-sm" @click="$router.push(`/subjects/${item._id}/edit`)">Edit</button>
                            <button type="button" 
                            @click="deleteHandler(item)" 
                            class="btn btn-danger btn-sm">Delete</button>
						</td>
					</tr>
				</tbody>
				<tbody v-else>
					<tr>
						<td colspan="10" class="text-center">
                            <div class="py-5">
                                <img src="/img/no-result.svg" alt="" class="img-empty"> 
                                <p class="h5 mt-4 d-block fw-normal">
                                    No Item found
                                </p>
                            </div>
                        </td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
import { debounce } from 'lodash';
import FilterSection from '@/ui_components/FilterSection'
export default {
    async created() {
        this.getSubjectsList();
    },
    data() {
        return ({
            search: '',
            list: [],
            page: 1,
            pageCount: 1,
        });
    },
    components: {
        FilterSection
    },
    methods: {
        searchSubject: debounce(function() {
            this.searchSubjects();
        }, 750),
        searchSubjects() {
            this.$schedsdk.search_subjects({
                searchValue: this.search,
            }).then((result) => {
                this.list = result.data.filter(s => !s.is_deleted);
            }).catch((error) => {
                console.log(error);
            });
        },
        getSubjectsList() {
            this.$schedsdk.get_subjects({
                name: this.search,
                page_no: this.page
            }).then((result) => {
                this.list = result.data.filter(s => !s.is_deleted);
            }).catch((error) => {
                console.log(error);
            });
        },
        deleteHandler(item)
        {
            let confirmed = confirm("Are you sure to delete this item: " + item.name);
            if (confirmed) {
                this.$schedsdk.delete_subject(item._id).then((result)=>{
                    this.getSubjectsList();
                }).catch(console.error);
            }
        }
    }
}
</script>

<style scoped>
.action_column button {
    margin: 3px
}
.controls-div {
    float: left;
    width: 100%;
    border: 1px solid #d8dbe0;
    padding: 15px 4px;
    margin: 0 0 1rem 0!important;
    padding-top: 20px;
    position: relative;
}
.settings-text {
    position: absolute;
    background: #fff;
    padding: 3px 6px;
    top: -15px;
    left: 15px;
    font-size: 16px;
    font-weight: bold;
}
</style>