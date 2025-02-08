<template>
    <CModal
        :visible="show"
        :size="size"
        :alignment="alignment"
        :backdrop="backdrop"
        @close="onPopClose"
        class="modal-dark"
    >
        <CModalHeader>
            <CModalTitle>{{ title }}</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <p v-for="(line, index) in bodyLines" :key="index">
                {{ line }}
            </p>
        </CModalBody>
        <CModalFooter>
            <div class="mx-auto">
                <CButton
                    class="custom-setup-button"
                    color="primary"
                    @click="onPopClose"
                >
                    Ok
                </CButton>
            </div>
        </CModalFooter>
    </CModal>
</template>

<script>

export default {
    name: 'ErrorInfoModal',
    watch: {
        visible: function (newVal) {
            this.show = newVal
        },
    },
    data() {
        return {
            show: this.visible,
        }
    },
    props: {
        visible: {
            default: false,
            type: Boolean
        },
        size: {
            type: String,
            default: undefined,
            required: false,
            validator: (value) => {
                return ['sm', 'lg', 'xl'].includes(value)
            },
        },
        alignment: {
            default: 'center',
            type: String
        },
        backdrop: {
            default: true,
        },
        title: {
            required: true,
            type: String
        },
        bodyLines: {
            required: true,
            default: [],
            type: Object
        },
    },
    methods: {
        onPopClose() {
            this.show = false;
            this.$emit('modal:close');
        },
    },
}
</script>
<style lang="scss">
.modal-dark {
    .modal-content {
      background-color: var(--background-color-primary);
      box-shadow: 0px 0px 100px rgba(255, 255, 255, 0.2);
    }
  }
  :root.dark-theme {
    .custom-tab-body {
      div.form-check {
        .form-check-input {
          background-color: transparent;
          &:checked {
            border-color: var(--link-color);
            background-color: var(--link-color);
          }
        }
      }
    }
    .business-setup-modal, .modal-dark {
      .modal-title, p {
        color: var(--text-primary-color);
      }

    }
  }
</style>