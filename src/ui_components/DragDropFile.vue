<template>
  <div class="main mb-2">
    <div :class="{'uploaded': initialFile || preview}"
      class="dropzone-container text-center"
      @dragover="dragover"
      @dragleave="dragleave"
      @drop="drop"
    >
      <div>
        <Icon icon="tabler:drag-drop" :height="24" class="mb-3" /> 
      <input
        type="file"
        :name="name"
        :id="name"
        class="hidden-input"
        @change="onFileChange"
        ref="file"
        accept=".jpg,.jpeg,.png"
      />
      <span v-if="initialFile && !preview">
        <img :src="initialFile" :alt="title" class="img-preview">
      </span>
      <span v-show="preview">
        <img ref="logo_preview" :alt="title + ' preview'" class="img-preview">
      </span>
      <div>
        <span v-if="!initialFile && !preview">Drag and drop a file</span>
      </div>
      </div>
    </div>
    <div class="d-flex justify-content-between mt-1">
      <div v-if="initialFile || preview">
        <span @click="remove" class="text-danger fw-bold cursor-pointer">Remove</span> or <span @click="browseFiles" class="class-date fw-bold cursor-pointer">Change</span> {{fileCategory}}
      </div>
      <div v-else @click="browseFiles" class="class-date fw-bold cursor-pointer">
        Browse files
      </div>
    </div>
  </div>
</template>

<script>
import {Icon} from '@/common/Icon'
export default {
  name: "DragDropFile",
  emits: ['initialFileRemove', 'fileChange', 'fileRemove'],
  props: {
    fileCategory: {
      default: "picture",
      type: String
    },
    name: {
      default: "file",
      type: String
    },
    title: {
      default: "File",
      type: String
    },
    initialFile: {
      default: null,
      type: String
    }
  },
  components: {
    Icon
  },
  data() {
    return {
      file: null,
      preview: null,
      isDragging: false
    };
  },
  methods: {
    browseFiles() {
      this.$refs.file.click();
      this.$refs.file.value = null;
    },
    onFileChange(e) {
      let file = this.$refs.file.files[0];
      if (file) {
        this.setFileAndPreview(file);
      } else {
        this.remove();
      }
    },
    dragover(e) {
      e.preventDefault();
      this.isDragging = true;
    },

    dragleave() {
      this.isDragging = false;
    },
    drop(e) {
      e.preventDefault();
      let file = e.dataTransfer.files[0];
      this.setFileAndPreview(file);
    },

    setFileAndPreview(file) {
      this.file = file;
      this.$emit('fileChange', file);
      this.generatePreviewOfFile(file);
    },

    generatePreviewOfFile(file) {
      if (file) {
        let fileSrc = URL.createObjectURL(file);
        this.preview = fileSrc;
        this.$refs.logo_preview.src = fileSrc;
        setTimeout(() => {
          URL.revokeObjectURL(fileSrc);
        }, 1000);
      }
    },

    makeName(name) {
      return (
        name.split(".")[0].substring(0, 3) +
        "..." +
        name.split(".")[name.split(".").length - 1]
      );
    },

    remove() {
      if (this.initialFile) {
        this.$emit('initialFileRemove');  
      } else {
        this.$emit('fileRemove')
      }
      this.file = null;
      this.preview = null;
      this.$refs.file.value = null;
    }
  },
};
</script>

<style scoped>
.hidden-input {
  opacity: 0;
  overflow: hidden;
  position: absolute;
  width: 1px;
  height: 1px;
}
.uploaded.dropzone-container {
  border: 2px dashed #eeeeee;
  display: flex;
  width: 100%; 
  padding: 20px;
  background: transparent;
  justify-content: center;
}
.uploaded.dropzone-container svg {
  display: none;
}
.img-preview {
  max-height: calc(250px - 30px);
  max-width: 300px;
}
.dropzone-container {
  padding: 20px;
  background: #fbfbfb;
  border: 2px dashed #dbdbdb;
  max-width: 400px;
  width: 100%;
  border-radius: 5px;
  color: #a2a2a2;
}
.hidden-input {
  opacity: 0;
  overflow: hidden;
  position: absolute;
  width: 1px;
  height: 1px;
}
.file-label {
  font-size: 16px;
  display: block;
  cursor: pointer;
}
.file-label u {
  color: #321fdb;
}
.preview-container {
  display: flex;
  margin-top: 2rem;
}
.preview-card {
    display: flex;
    border: 1px solid #f0f0f0;
    padding: 15px;
    margin-left: 5px;
    margin-bottom: 15px;
    width: 100%;
    align-items: center;
    gap: 13px;
    justify-content: space-between;
}
.preview-img {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  border: 1px solid #a2a2a2;
  background-color: #a2a2a2;
}
.btn-thumbnail-close button {
  border: 1px solid #ddd;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
