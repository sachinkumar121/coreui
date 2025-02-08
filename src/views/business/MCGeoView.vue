<template>
  <div style="height:70vh; width: 100%" class="pt-2">
    <div class="row controls-div mb-5">
      <div class="settings-text">Filter Options</div>
      <div class="col-md-8 col-lg-10 col-sm-12">
        <div class="row">
          
          <div class="col-sm-6 col-md-6">
            <div class="form-floating filter-status ps-2">  
              <!-- <select class="floating-select" id="state" name="state" v-model="state">
                <option value="">All</option>
                <optgroup v-for="(country, index) in countryWithStateData" :label="country.label" :key="index">
                  <option v-for="(state, index) in country.states" :value="state.value" :key="index">{{ state.label }}
                  </option>
                </optgroup>
              </select> -->
              <v-select 
              class="options-selected"
                :clearable="false"
                :options="countries" 
                label="name"
                id="select-country"
                v-model="country"
                :reduce="country => country.code"
                @option:selected="setCenterLocation"
              />
              
              <label class="label-select" for="select-country">Select Country</label>
            </div>
          </div>
          
          <div class="col-sm-6 mb-3 mb-sm-0">
            <div class="form-check form-check-day">
              <input class="form-check-input me-2" type="checkbox" 
                  :id="'hide-deactivated'" v-model="hideDeactivated" />
              <label class="form-check-label"><b>Hide deactivated</b></label>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    <GeoWorldMap
      v-if="centerLocation && locationInfo.length > 0"
      :locations="locationInfo"
      :center="centerLocation"
      ></GeoWorldMap>
  </div>
</template>
  
<script>
import GeoWorldMap from '@/new_ui_components/GeoWorldMap';
import useCountryData from '@/composables/useCountryData';

export default {
  name: 'MCGeoView',
  setup() {
    const { countries, getAddress } = useCountryData();
    return { countries, getAddress };
  },
  components: {
    GeoWorldMap
  },
  mounted() {
    this.setCenterLocation();
    this.$store.commit({
      type: 'updateSidebarVisible',
      value: false,
    });
    this.getBusinessList();
  },
  methods: {
    randomLatLong() {
      let items = [[32.025568, -88.094683], [33.105981, -86.921546], [64.216140, -154.526984], [54.968739, -116.638093], [54.9699, -2.102099]]
      let item = items[Math.floor(Math.random()*items.length)];
      return {
          latitude: item[0],
          longitude: item[1],
      }
    },
    setCenterLocation() {
      let country = this.countries.find(c => c.code == this.country) || this.country;
      this.centerLocation = {
        latitude: country.latitude,
        longitude: country.longitude
      }
    },
    getBusinessList() {
      this.$schedsdk.getBusinessList().then(res => {
        if (res.status == 1) {
          this.locations = res.data.map(b => {
            let v =  {
              name: b.business_name,
              address: this.getAddress(b, 'geo'),
              phone_number: b.business_phone,
              state: b.state,
              deactivated: b.status != 1,
              //...this.randomLatLong(),
              geoinfo_is_valid: false,
              latitude:  0,
              longitude: 0,
            }
            if (b.geoinfo_is_valid)
            {
              v.geoinfo_is_valid = true;
              v.latitude = b.geoinfo.latitude;
              v.longitude = b.geoinfo.longitude;
            }
            return v
          });
        }
      });
    }
  },
  data() {
    return {
      country: 'us',
      centerLocation: null,
      hideDeactivated: false,
      state: null,
      locations: [],
      zoom: 3,
    };
  },
  computed: {
    locationInfo() {
      let locations = this.locations;
      
      locations = locations.filter(l => l.geoinfo_is_valid == true);
      
      if (this.hideDeactivated) {
        locations = locations.filter(l => l.deactivated == false);
      }
      if (this.state) {
        locations = locations.filter(l => l.state == this.state);
      }
      return locations;
    }
  }
};
</script>
  
<style lang="scss">
.controls-div {
  float: left;
  width: 100%;
  border: 1px solid #d8dbe0;
  padding: 15px 4px;
  margin: 0;
  padding-top: 20px;
  position: relative;
}
.settings-text {
  position: absolute;
  padding: 3px 6px;
  top: -15px;
  left: 15px;
  font-size: 16px;
  font-weight: bold;
}
/****  floating-Lable style start ****/
.floating-label { 
  position:relative; 
  margin-bottom:20px; 
}
 .floating-select {
  font-size:14px;
  padding:16px 4px 4px 4px;
  display:block;
  width:100%;
  height: calc(2.7rem + 2px);
  background-color: transparent;
  border:none;
  min-height: 44px;
    border: 1px solid  #C9C9C9;
    border-radius: 6px;
}

.floating-select:focus {
  outline:none;
}

.floating-label label {
  color:#999; 
  font-size:14px;
  font-weight:normal;
  position:absolute;
  pointer-events:none;
  left:15px;
  top:13px;
  transition:0.2s ease all; 
  -moz-transition:0.2s ease all; 
  -webkit-transition:0.2s ease all;
}

.floating-select:focus ~ label , 
.floating-select:not([value=""]):valid ~ label {
  top: 3px;
  left: 6px;
  font-size:14px;
  transform: scale(.85);
  opacity: .65;
}

/* active state */
.floating-select:focus ~ .bar:before, .floating-select:focus ~ .bar:after {
  width:50%;
}
</style>