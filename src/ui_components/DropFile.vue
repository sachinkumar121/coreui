<template>
  <div class="main mb-3">
    <div
      class="dropzone-container"
      @dragover="dragover"
      @dragleave="dragleave"
      @drop="drop"
    >
      <div>
        <input
        type="file"
        :name="name"
        :multiple="multiple"
        :id="name"
        class="hidden-input"
        @change="onChange"
        ref="file"
        accept=".jpg,.jpeg,.png"
      />

      <div class="preview-container mt-4" v-if="files.length">
        <div v-for="file in files" :key="file.name" class="preview-card">
          <div class="d-flex align-items-center">
            <img class="preview-img" :src="generateThumbnail(file)" />
            <p :title="file.name" class="mb-0 ps-2">
              {{ makeName(file.name) }}
            </p>
          </div>
          <div class="btn-thumbnail-close">
            <button
              class="ml-2"
              type="button"
              @click="remove(files.indexOf(file))"
              title="Remove file"
            >
              <b>&times;</b>
            </button>
          </div>
        </div>
      </div>
      </div>
      <label :for="name" class="file-label">
        <div v-if="isDragging">Release to drop file here.</div>
        <div v-else>Drop file here or <u>click here</u> to upload.</div>
      </label>
    </div>
  </div>
</template>

<script>

export default {
  name: "DropFile",
  emits: ['fileChange', 'fileRemove'],
  props: {
    multiple: {
      default: false,
      type: Boolean
    },
    name: {
      default: "file",
      type: String
    }
  },
  data() {
    return {
      isDragging: false,
      files: [],
    };
  },
  methods: {
    onChange() {
      this.$emit('fileChange', ...this.$refs.file.files);
      this.files = [...this.$refs.file.files];
    },

    generateThumbnail(file) {
      let fileSrc = URL.createObjectURL(file);
      setTimeout(() => {
        URL.revokeObjectURL(fileSrc);
      }, 1000);
      return fileSrc;
    },

    makeName(name) {
      return (
        name.split(".")[0].substring(0, 3) +
        "..." +
        name.split(".")[name.split(".").length - 1]
      );
    },

    remove(i) {
      this.$emit('fileRemove');
      this.files.splice(i, 1);
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
      this.$refs.file.files = e.dataTransfer.files;
      this.onChange();
      this.isDragging = false;
    },
  },
};
</script>

