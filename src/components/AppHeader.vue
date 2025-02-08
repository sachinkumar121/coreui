<script>
import login_helper from '@/helpers/login_helper'
import { logo } from '@/assets/brand/logo'
import { Icon } from '@/common/Icon'
import AppRouteName from '@/ui_components/AppRouteName'
import useMenuSearch from '@/composables/useMenuSearch';
import ThemeSwitcher from '@/ui_components/ThemeSwitcher.vue';

import { ref, watchEffect } from 'vue';
import SearchBox from '@/views/manage_business/SearchBox.vue';
import SearchResults from '@/views/manage_business/SearchResults.vue';
import Alerts from '@/views/Alerts'

import '@mobiscroll/vue/dist/css/mobiscroll.vue.min.css'
import { MbscPage, MbscSelect, setOptions } from '@mobiscroll/vue'
import { useSidebarStore } from '@/stores/sidebar.js'
import { useColorModes } from '@coreui/vue'

export default {
	name: 'AppHeader',
	setup() {
		const { pageSections,
			searchTerm,
			originalPageData,
			populatePageSections,
			searchMenus, showAll, setSearchTerm, resetSearchTerm } = useMenuSearch();
		const sidebar = useSidebarStore()
		const { colorMode, setColorMode } = useColorModes('coreui-free-vue-admin-template-theme')

		const isSearchVisible = ref(false);
		const setFocusOnSearch = ref(false);
		const headerClassNames = ref('mb-4 p-0');

		const showSearch = () => {
			isSearchVisible.value = true;
			setFocusOnSearch.value = true;
		};

		const hideSearch = () => {
			isSearchVisible.value = false;
			setFocusOnSearch.value = false;
		};

		const handleKeyPress = (event) => {
			if (event.keyCode === 27) {
				hideSearch();
			}
			if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
				event.preventDefault();
				if (setFocusOnSearch.value) {
					hideSearch();
				} else {
					showSearch();
				}
			}
		};

		// Register event listener
		watchEffect(() => {
			window.addEventListener('keydown', handleKeyPress);
			window.addEventListener('click', hideSearch);
			return () => {
				window.removeEventListener('keydown', handleKeyPress);
				window.removeEventListener('click', hideSearch);
			};
		});

		return {
			isSearchVisible,
			setFocusOnSearch,
			showSearch,
			hideSearch,
			pageSections,
			searchTerm,
			originalPageData,
			populatePageSections,
			searchMenus,
			showAll,
			setSearchTerm,
			resetSearchTerm,
			logo,
			sidebar,
			colorMode,
			setColorMode,
			headerClassNames
		};
	},
	components: {
		Icon,
		AppRouteName,
		SearchBox,
		SearchResults,
		ThemeSwitcher,
		Alerts,
		MbscPage,
		MbscSelect,
		setOptions
	},
	computed: {
		searchedMenu() {
			return this.$store.state.search_preferences.manage_business
		},
		business_name() {
			if (
				this.$store.state &&
				this.$store.state.business_settings &&
				this.$store.state.business_settings.business_info &&
				this.$store.state.business_settings.business_info.business_name
			) {
				return this.$store.state.business_settings.business_info
					.business_name
			}
			return ''
		},
		location_name_short() {
			if (
				this.$store.state &&
				this.$store.state.business_settings &&
				this.$store.state.business_settings.business_info
			) {
				if (
					this.$store.state.business_settings.business_info
						.ml_location_short_name &&
					this.$store.state.business_settings.business_info
						.ml_location_short_name.length > 0
				) {
					return this.$store.state.business_settings.business_info
						.ml_location_short_name
				}
				if (
					this.$store.state.business_settings.business_info
						.business_name
				) {
					return this.$store.state.business_settings.business_info.business_name.substring(
						0,
						20,
					)
				}
			}
			return ''
		},
		has_multi_location() {
			if (
				this.$store.state &&
				this.$store.state.business_settings &&
				this.$store.state.business_settings.business_info &&
				this.$store.state.business_settings.business_info
					.ml_business_group_code
			) {
				return (
					this.$store.state.business_settings.business_info
						.ml_business_group_code.length > 2
				)
			}
			return false
		},
		user_name() {
			return (
				this.$store.state.user_data.first_name +
				' ' +
				this.$store.state.user_data.last_name
			)
		},
		business_id: {
			get() {
				return this.$store.state.user_data.business_id
			}
		},
		profile_pic() {
			return this.$store.state.user_data.profile_pic
		},
		show_business_profile() {
			return this.$store.state.user_data.type == 2
		},
		exit_impersonate() {
			return (
				this.$store.state.user_data.is_imper &&
				this.$store.state.user_data.is_imper == true &&
				this.$store.state.user_data.impersonate_type != 2
			)
		},
		exit_location() {
			return (
				this.$store.state.user_data.is_imper &&
				this.$store.state.user_data.impersonate_type == 2
			)
		},
	},
	mounted() {
		this.populatePageSections();
		document.addEventListener('scroll', () => {
			if (document.documentElement.scrollTop > 0) {
				this.headerClassNames = 'mb-4 p-0 shadow-sm'
			} else {
				this.headerClassNames = 'mb-4 p-0'
			}
		})
		if (this.searchedMenu) {
			this.searchTerm = this.searchedMenu;
			this.searchMenus();
		}
		if (this.has_multi_location) {
			this.showMLSelectOptions();
		}
	},
	data() {
		return {
			ml_locations: [],
			selected_switch_to_id: null,
			pm_error_message: '',
			show_location_switcher: false,
			switching: false,
			alert: false,
			show: 0,
			alertData: {
				message: '',
				type: ''
			},
			selected_location: this.$store.state.user_data.business_id
		}
	},
	created() {
		//this.setBusinessName();
	},

	methods: {
		changeLocation(MbscSelectChangeEvent) {
			let location = this.ml_locations.find(l => l._id == MbscSelectChangeEvent.value);
			if (location) {
				this.switchLocation(location)
			}
		},
		switchLocation(location) {
			if (location._id == this.business_id) {
				return;
			}
			this.selected_switch_to_id = location._id;
			this.doSwitch(location);
		},
		performSearchOnFocus() {
			if (this.searchedMenu) {
				this.searchTerm = this.searchedMenu;
				this.searchMenus();
			}
			this.showSearch();
		},
		setBodyClass() {
			var body = document.body
			body.classList.add('no-scroll')
		},
		sidebarToggle() {
			this.$store.commit('toggleSidebar')
		},
		openHelp() {
			window.open('https://skysched.silverskysoft.com/hc/', '_blank')
		},
		logout() {
			// e.preventDefault();
			setTimeout(() => {
				localStorage.removeItem('_expiredTime')
			}, 500)
			this.$store.commit('updateMaxCreditToast', {
				key: 'below_2',
				value: 2,
			})
			this.$store.commit('updateMaxCreditToast', {
				key: 'below_p5',
				value: 2,
			})
			this.$store.commit('updateMessageCreditsLastShownTime', {})
			this.$store.commit('USER_DATA', {})
			this.$store.commit('BUSINESS_DATA', {})
			// this.$store.commit('set_ui_data', { key: "animation_component", value: null });
			this.$skyEventListener.emit('CLEAR_ANIMATION')
			this.$store.commit('set_ui_data', {
				key: 'show_acked_toastr',
				value: false,
			})
			this.$store.commit('resetSearchPreference');
			this.$store.commit('pos/clearCart');
			this.$store.commit('pos/removeCustomer');

			this.$schedsdk.logout()
			this.$router.push('/login')
		},
		OpenProfile() {
			// this.$store.commit('SET_TOKEN', '');
		},
		ExitImpersonation() {
			// this.$store.commit('SET_TOKEN', '');
			let thisRef = this
			thisRef.$schedsdk.exitImpersonate().then((result) => {
				//   console.log(result)
				//   console.log(result.data)

				if (result.status == 1) {
					thisRef.$schedsdk
						.apply_identity_token(result, { email: '', password: '' })
						.then(async (response) => {
							await login_helper.complete_new_login(
								thisRef.$schedsdk,
								result.data,
								thisRef.$store,
							)
							//        thisRef.$router.push("/dashboard");
							this.$router.go()
							// window.history.pushState("", "", "/dashboard");
						})
				}
			})
		},
		ExitLocation() {
			let thisRef = this
			thisRef.$schedsdk.exitLocationImpersonate().then((result) => {
				//   console.log(result)
				//   console.log(result.data)

				if (result.status == 1) {
					thisRef.$schedsdk
						.apply_identity_token(result, { email: '', password: '' })
						.then(async (response) => {
							await login_helper.complete_new_login(
								thisRef.$schedsdk,
								result.data,
								thisRef.$store,
							)
							//        thisRef.$router.push("/dashboard");
							this.$router.go()
							// window.history.pushState("", "", "/dashboard");
						})
				}
			})
		},

		getLocationDisplayString() {
			return this.location_name_short
		},
		showMLSelectOptions() {
			let context = this
			this.selected_switch_to_id = null
			let localll = this.$store.state.location_list
			if (localll && localll.length > 0) {
				console.log('Local cachesa.d.as.d.asd.....')
				localll.map((l) => {
					l.text = l.business_name;
					l.value = l._id;
					return l;
				})
				context.ml_locations = localll
			}
			context.$schedsdk
				.getMultiLocationListShort()
				.then((result) => {
					if (result.status == 1 && result.data) {
						this.$store.commit('LOCATION_LIST', result.data)
						if (
							localll == null ||
							result.data.length != localll.length
						) {
							context.ml_locations = result.data
						}
						//
					} else {
						this.$store.commit('LOCATION_LIST', [])

						this.pm_error_message = 'No valid list found'
					}
				})
				.catch((Ex) => {
					console.log(Ex)
					console.log('THEheadererr')
				})
		},
		doSwitch(location) {
			//Switch and then close.
			let thisRef = this
			let data = {
				new_business_id: this.selected_switch_to_id,
			}
			this.$schedsdk
				.multi_location_switch_location(data)
				.then((result) => {
					if (result.status == 1) {
						this.alert = true;
						this.show = 1;
						this.alertData = {
							message: `Switch location to ${location.business_name} is complete. Redirecting to dashboard`,
							type: 'success'
						}
						this.switching = true;
						setTimeout(() => {
							thisRef.$schedsdk
								.apply_identity_token(result, {
									email: '',
									password: '',
								})
								.then((response) => {
									login_helper
										.complete_new_login(
											thisRef.$schedsdk,
											result.data,
											thisRef.$store,
											thisRef.$appchatobj,
										)
										.then((res) => {
											thisRef.$router.push('/dashboard')
											thisRef.$router.go()
										})
									//
								})
						}, 3000);
					} else {
						console.log('Errorr deleteing...')
						console.log(result)
						thisRef.pm_error_message = result.message
					}
				}).catch((error) => {
					this.alertData = {
						message: error?.data?.message || "Something went wrong while switching location.",
						type: 'danger'
					}
					this.alert = true;
					this.show = 1;
					this.switching = false;
				}).finally(() => {
					this.show_location_switcher = false;
				})
		},
	},
}
</script>

<template>
	<CHeader position="sticky" :class="headerClassNames">
		<CContainer class="border-bottom px-4" fluid>
			<CRow class="w-100">
				<CCol>
					<CHeaderToggler @click="sidebar.toggleVisible()" class="d-block d-lg-none"
						style="margin-inline-start: -14px">
						<CIcon icon="cil-menu" size="lg" />
					</CHeaderToggler>
					<CHeaderToggler @click="sidebar.toggleNarrow()" class="d-none d-lg-block"
						style="margin-inline-start: -14px">
						<CIcon icon="cil-menu" size="lg" />
					</CHeaderToggler>
				</CCol>
				<CCol class="d-none d-md-inline-block"
					v-if="$store.state.user_data.type != '5' && $route.name != 'Manage Business'">
					<div>
						<SearchBox showShortcutKeys @click.stop="null" :initialFocus="setFocusOnSearch"
							:initial-term="searchedMenu" @input="setSearchTerm" @clear-search="resetSearchTerm"
							@on-blur="hideSearch" @on-focus="performSearchOnFocus" style="top:2px;" />
					</div>
					<div v-if="isSearchVisible">
						<SearchResults :term="searchTerm" :pageSections="pageSections" @show-all="showAll" />
					</div>
				</CCol>
				<CCol class="avatar-wrapper">
					<div class="d-flex align-items-center justify-content-end">
						<div class="parent-select-mbs d-none d-md-inline-block"
							v-if="ml_locations.length > 1 && $store.state.user_data.type != '5'">
							<MbscSelect :data='ml_locations' v-model="selected_location"
								:default-selection="business_id" @change="(e) => changeLocation(e)" :filter="true"
								display="anchored" label="" labelStyle="" inputStyle="box"
								placeholder="Switch Location" />
						</div>

						<CDropdown variant="nav-item" inNav class="c-header-nav-items pr-0" placement="bottom-end"
							add-menu-classes="pt-0">
							<CDropdownToggle placement="bottom-end"
								class="py-0 pe-0 ps-0 ps-sm-3 d-flex align-items-center" :caret="false">
								<CAvatar :src="profile_pic" size="lg" class="me-2 me-sm-0" />
								<Icon icon="ion:chevron-down" :height="24" class="ms-1" />
							</CDropdownToggle>
							<CDropdownMenu class="pt-0 custom-dropdown">
								<CDropdownItem href="javascript:void(0)" class="py-3">
									<h4>{{ business_name }}</h4>
									<div class="d-flex align-items-center justify-content-between">
										<p class="mb-0">{{ user_name }}</p>
										<ThemeSwitcher class="inner-switch" />
									</div>
								</CDropdownItem>
								<CDropdownDivider class="my-0" />
								<CDropdownItem href="javascript:void(0)" @click="$router.push('/profile')">
									<Icon icon="tabler:user" :height="26" /> My
									Profile
								</CDropdownItem>
								<CDropdownItem v-if="$store.state.user_data.type != '5'" href="javascript:void(0)"
									@click="$router.push('/business')">
									<Icon icon="tabler:building" :height="26" />
									Business Profile
								</CDropdownItem>
								<CDropdownItem href="javascript:void(0)" @click="ExitImpersonation()"
									v-if="exit_impersonate == true">
									<Icon icon="tabler:user" :height="26" /> Exit
									Impersonation
								</CDropdownItem>
								<CDropdownItem href="javascript:void(0)" @click="ExitLocation()"
									v-if="exit_location == true">
									<Icon icon="tabler:user" :height="26" /> Exit
									Location
								</CDropdownItem>
								<CDropdownItem href="javascript:void(0)" @click="$router.push('/change_password')">
									<Icon icon="tabler:shield-lock" :height="26" />
									Change password
								</CDropdownItem>
								<CDropdownItem href="javascript:void(0)" @click="openHelp">
									<Icon icon="tabler:info-circle" :height="26" />
									Help
								</CDropdownItem>
								<CDropdownItem href="javascript:void(0)" @click="logout">
									<Icon icon="tabler:logout" :height="26" />
									Logout
								</CDropdownItem>
							</CDropdownMenu>
						</CDropdown>
					</div>
				</CCol>
			</CRow>
			<!-- <CHeaderNav class="d-none d-md-flex">
        <CNavItem>
          <CNavLink href="/dashboard"> Dashboard </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#">Users</CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#">Settings</CNavLink>
        </CNavItem>
      </CHeaderNav>
      <CHeaderNav class="ms-auto">
        <CNavItem>
          <CNavLink href="#">
            <CIcon icon="cil-bell" size="lg" />
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#">
            <CIcon icon="cil-list" size="lg" />
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#">
            <CIcon icon="cil-envelope-open" size="lg" />
          </CNavLink>
        </CNavItem>
      </CHeaderNav>
      <CHeaderNav>
        <li class="nav-item py-1">
          <div class="vr h-100 mx-2 text-body text-opacity-75"></div>
        </li>
        <CDropdown variant="nav-item" placement="bottom-end">
          <CDropdownToggle :caret="false">
            <CIcon v-if="colorMode === 'dark'" icon="cil-moon" size="lg" />
            <CIcon v-else-if="colorMode === 'light'" icon="cil-sun" size="lg" />
            <CIcon v-else icon="cil-contrast" size="lg" />
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem
              :active="colorMode === 'light'"
              class="d-flex align-items-center"
              component="button"
              type="button"
              @click="setColorMode('light')"
            >
              <CIcon class="me-2" icon="cil-sun" size="lg" /> Light
            </CDropdownItem>
            <CDropdownItem
              :active="colorMode === 'dark'"
              class="d-flex align-items-center"
              component="button"
              type="button"
              @click="setColorMode('dark')"
            >
              <CIcon class="me-2" icon="cil-moon" size="lg" /> Dark
            </CDropdownItem>
            <CDropdownItem
              :active="colorMode === 'auto'"
              class="d-flex align-items-center"
              component="button"
              type="button"
              @click="setColorMode('auto')"
            >
              <CIcon class="me-2" icon="cil-contrast" size="lg" /> Auto
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
        <li class="nav-item py-1">
          <div class="vr h-100 mx-2 text-body text-opacity-75"></div>
        </li>
        <AppHeaderDropdownAccnt />
      </CHeaderNav> -->
		</CContainer>
		<!-- <CContainer class="px-4" fluid>
      <AppBreadcrumb />
    </CContainer> -->
	</CHeader>
</template>

<style scoped lang="scss">
@media (max-width: 767.98px) {
    .avatar-wrapper {
        max-width: 100px;
    }
}
.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.custom-dropdown {
    background: #fff;
    border: 1px solid #f0f0f0;
    box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    min-width: 265px;
    color: #000;
    h4 {
        font-size: 1.1rem;
    }
    a {
        color: #000 !important;
    }
    .dropdown-item {
        font-family: Overpass;

        svg {
            width: 24px;
            margin-right: 10px;
            &.theme-icon {
                margin-right: 0;
            }
        }
        &:hover {
            background-color: #f9f8ff;
        }
    }
}

// theme dark/light
:root {
    --background-color-primary: #ebebeb;
    --accent-color: #cacaca;
}
:root.dark-theme {
    --background-color-primary: #1e1e1e;
    --accent-color: #3f3f3f;
}

.header {
    background: var(--background-color-primary);
    color: var(--text-primary-color);
    margin-top: env(safe-area-inset-top);
}
/* media start */
@media (screen) and (min-width: 1200px) {
    .title-page {
        margin-left: 2rem;
    }
}

@media screen and (max-width: 575.98px) {
    div.sidebar-new {
        &.collapse-custom {
            width: 39px !important;
            --cui-sidebar-width: 39px;
        }
        .sidebar-brand {
            padding: 0 5px;
            img {
                width: 27px !important;
                height: auto;
            }
        }
    }
}

.location-dropdown {
    position: relative;
    padding-left: 0;
    .icon-location {
        position: absolute;
        left: 15px;
        top: 6px;
    }
    .dropdown-item {
        padding-left: 43px;
        font-size: 0.875rem;
        padding-top: 8px;
        padding-bottom: 8px;
        position: relative;
        &:first-child {
            border-radius: 5px 5px 0 0;
        }
    }
}
.location-btn {
    &.btn {
        min-width: 150px;
        border-width: 1px;
        &:not(.btn-link):focus {
          color: var(--text-primary-color)  
        }
        &:hover {
            background-color: transparent;
            color: var(--text-primary-color)  
        }
        &:focus {
            border: 1px solid #C9C9C9;
            background-color: transparent;
        }
        &.show {
            background-color: transparent;
        }
    }
}
</style>
