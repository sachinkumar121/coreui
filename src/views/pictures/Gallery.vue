<template>
  <div :id="galleryID" class="pswp-gallery">
    <div class="pswp-gallery__item col-12 col-sm-6 col-md-4 col-lg-3" v-for="(image, key) in images" :key="key">
        <a  
        :href="image.largeURL"
        :data-pswp-width="image.width"
        :data-pswp-height="image.height"
        target="_blank"
        rel="noreferrer"
        :alt="image.caption"
        >
          <img :src="image.thumbnailURL" />
        </a>
        <span class="pswp-caption-content"><b>{{image.caption}}</b><br>{{image.description}}</span>
    </div>
  </div>
</template>

<script>
import 'photoswipe/style.css';
import 'photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.css';

import PhotoSwipeLightbox from 'photoswipe/lightbox';
import PhotoSwipeDynamicCaption from 'photoswipe-dynamic-caption-plugin';

export default {
  name: 'Gallery',
  props: {
    galleryID: String,
    images: Array,
  },
  setup(props) {
    return {
      imagesData: props.images,
    };
  },
  mounted() {
    const smallScreenPadding = {
      top: 0, bottom: 0, left: 0, right: 0
    };
    const largeScreenPadding = {
      top: 30, bottom: 30, left: 0, right: 0
    };
    if (!this.lightbox) {
      const lightbox = new PhotoSwipeLightbox({
        gallerySelector: '#' + this.$props.galleryID,
        childSelector: '.pswp-gallery__item',
        
        // optionaly adjust viewport
        paddingFn: (viewportSize) => {
          return viewportSize.x < 700 ? smallScreenPadding : largeScreenPadding
        },
        pswpModule: () => import('photoswipe')
      });
  
      const captionPlugin = new PhotoSwipeDynamicCaption(lightbox, {
        mobileLayoutBreakpoint: 700,
        type: 'auto',
        mobileCaptionOverlapRatio: 1
      });
  
      lightbox.init();
      this.lightbox = lightbox;
    }
  },
  mountedOld() {
    if (!this.lightbox) {
      this.lightbox = new PhotoSwipeLightbox({
        gallery: '#' + this.$props.galleryID,
        children: 'a',
        pswpModule: () => import('https://cdn.jsdelivr.net/npm/photoswipe@5.3.0/dist/photoswipe.esm.js')
      });
      const captionPlugin = new PhotoSwipeDynamicCaption(this.lightbox, {
        captionContent: '.pswp-caption-content',
        type: 'below',
      });
      this.lightbox.init();
    }
  },
  unmounted() {
    if (this.lightbox) {
      this.lightbox.destroy();
      this.lightbox = null;
    }
  },
  methods: {},
};
</script>

<style scoped>
.pswp__dynamic-caption--aside {
  max-width: 300px;
  padding: 20px 15px 20px 20px;
  margin-top: 70px;
}
.pswp__dynamic-caption--below {
  max-width: 700px;
  padding: 15px 0 0;
}
.pswp__dynamic-caption--mobile {
  background: rgba(0, 0, 0, 0.5);
  padding: 10px 15px;
}
.pswp__custom-caption {
  background: rgba(75, 150, 75, 0.75);
  font-size: 16px;
  color: #fff;
  width: calc(100% - 32px);
  max-width: 400px;
  padding: 2px 8px;
  border-radius: 4px;
  position: absolute;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
}
.pswp__custom-caption a {
  color: #fff;
  text-decoration: underline;
}
/* .hidden-caption-content {
  display: none;
} */
  .pswp-gallery__item {
    margin: 0 4px 4px 0;
  }
  .pswp-gallery__item img {
    display: block;
  }
  .pswp-gallery {
    max-width: 650px;
    padding: 0 50px 50px;
    background: #eee;
    position: relative;
    display: flex;
    flex-wrap: wrap;
  }
  .pswp__dynamic-caption {
    color: #fff;
    width: 100%;
  }
  .pswp__dynamic-caption a {
    color: #fff;
    text-decoration: underline;
  }
</style>