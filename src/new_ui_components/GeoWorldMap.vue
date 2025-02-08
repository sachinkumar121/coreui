<template>
    <div id="map" ref="map"> test</div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Icon, getIconHtml } from '@/common/Icon';

import CircleWithTextSvg from '@/common/svg/CircleWithTextSvg';

export default {
    components: {
        Icon,
        CircleWithTextSvg
    },
    props: {
        locations: {
            type: Array,
            default: []
        },
        draggable: {
            type: Boolean,
            default: false
        },
        center: {
            type: Object,
            default: {}
        }
    },
    data: function() {
        return {
            map: null,
            markers: null,
            pLineGroup: null
        }
    },
    mounted() {
        if (this.locations.length) {
            this.generateMap('map');
        }
    },
    watch: {
        locations: {
            handler: function(newLocations) {
                if (this.$refs.map && this.map) {
                    this.map.removeLayer(this.markers);

                    this.updateCenterOfMap(this.map, this.center);
                    // let centerLocation = newLocations[0];
                    // if (centerLocation) {
                    // }

                    this.generateMarkers(this.map, this.locations);
                }
            },
            immediate: false
        },
        center: {
            handler: function(newCoordinates) {
                this.updateCenterOfMap(this.map, newCoordinates);
            }
        }
    },
    methods: {
        generateMap(element) {
            // let centerLocation = this.locations[0];
            this.map = L.map(element, {
                // Set latitude and longitude of the map center (required)
                center: [this.center.latitude, this.center.longitude],
                // Set the initial zoom level, values 0-18, where 0 is most zoomed-out (required)
                zoom: 4
            });
            // set up Leaflet            
            // Create a Tile Layer and add it to the map
            let tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                minZoom: 2,
                maxZoom: 19
            }).addTo(this.map);

            L.control.scale().addTo(this.map);

            this.generateMarkers(this.map, this.locations);
        },
        
        generateMarkers(map, locations) {
            this.markers = new L.FeatureGroup();

            for (let location of locations) {

                let icon = L.divIcon({
                    html: `${getIconHtml({"icon": "tabler:pinned-filled-icon", "width": 25, "height": 25})}`,
                    // html: `<span>${location.name}</span>`,
                    iconSize: "auto",
                    // iconSize: [10, 10],
                    // shadowSize:   [50, 64], // size of the shadow
                    // iconAnchor: [10, 10],
                    // shadowAnchor: [4, 62],  // the same for the shadow
                    // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
                });
                let marker = L.marker([location.latitude, location.longitude], {
                    icon,
                    draggable: this.draggable,
                    title: location.name,
                    opacity: 0.75
                }).bindPopup(`<p>
                        <span>${location.name}</span><br />
                        <span>${location.address}</span><br />
                        <span>${location.phone_number}</span><br />
                    </p>
                `).openPopup();

                // marker.on('dragend', (event) => {
                //     let marker = event.target;
                //     let position = marker.getLatLng();
                //     // console.log(position)
                //     marker.setLatLng(new L.LatLng(position.lat, position.lng), {
                //         draggable: 'true'
                //     });
                //     map.panTo(new L.LatLng(position.lat, position.lng))
                //     this.$emit("change:position", location, position);
                // });
                this.markers.addLayer(marker);
            }
            map.addLayer(this.markers);
        },

        updateCenterOfMap(map, centerLocation) {
            map.panTo(new L.LatLng(centerLocation.latitude, centerLocation.longitude));
        }
    }
};
</script>
<style lang="scss">
    /* .leaflet-popup-content-wrapper {
        width: 100%;
    }
    .leaflet-div-icon {
        background: none !important;
        border: none !important;
    } */
    #map {
        width: 100%;
        height: 100%;
    }

    #map .leaflet-div-icon {
        width:0;
        height:0;
        border: 0;
        padding: 0;
    }

    #map .leaflet-div-icon span {
        display:inline-block;
        padding: 3px;
        border: 1px solid #666;
        border-radius: 3px;
        background:#fff;
        transform:translate(-50%, -50%);
    }
    .leaflet-marker-icon {
        color: #000;  
    }
    
</style>