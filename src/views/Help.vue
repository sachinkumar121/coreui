<template>
    <div>
        <CRow>
            <CCol sm="12">
                    <iframe
                        id="iframe"
                        :src="iframe.src"
                        style="min-width: 100%; border: none; min-height: 330vh;"
                        @load="iframeLoaded"
                    />
            </CCol>
        </CRow>
    </div>
</template>
<script>
import iFrameResize from 'iframe-resizer/js/iframeResizer';

export default {
    name: 'Help',
    data() {
        return { 
            loaded: false,
            iframe: {
                src: "",
                style: null,
                wrapperStyle: null, 
                iframeresizer : null
            }
        }
    },
    mounted() {
        this.iframe.src = "https://skysched.silverskysoft.com/hc/";
        this.iframe.style = {
            position: 'absolute',
            width: window.innerWidth,
            height: window.innerHeight,
        }    
        this.iframe.wrapperStyle = {
            overflow: 'hidden',
        } 
        this.loaded = true;
    },
    methods: {
        iframeLoaded() {
            this.iframe.iframeresizeObj = iFrameResize({log:  false, checkOrigin: false}, '#iframe');
        }
    }
}
</script>
