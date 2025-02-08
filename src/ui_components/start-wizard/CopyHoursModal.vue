<template>
    <CModal
        :visible="show"
        :size="size"
        :alignment="alignment"
        :backdrop="backdrop"
        @close="onClose"
        class="modal-dark modal-custom"
    >
        <CModalBody class="p-3 copy-modal-day">
            <p>Copy time slot to</p>
            <div class="form-group">
                <div class="form-check form-check-day">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        :id="'all-days'"
                        v-model="isAllDaysSelected"
                    />
                    <label class="form-check-label"><b>Select All</b></label>
                </div>
            </div>
            <div
                class="d-sm-flex form-group align-items-center"
                v-for="(day, index) in days"
                :key="index"
            >
                <div class="form-check form-check-day">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        :id="'copy-' + day.label"
                        :value="day.day_num"
                        :disabled="day.day_num == fromDayNum"
                        v-model="copyDays"
                    />
                    <label class="form-check-label" :for="'copy-' + day.label">{{
                        day.label
                    }}</label>
                </div>
            </div>
            <button class="btn btn-success w-100 justify-content-center" @click="applyCopyHoursToDays">
                Apply
            </button>
        </CModalBody>
    </CModal>
</template>
<script>
export default {
    name: 'CopyHoursModal',
    emits: ['copyHoursToDays', 'close'],
    props: {
        visible: {
            default: false,
            type: Boolean,
        },
        fromDayNum: {
            type: Number,
            required: true,
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
            type: String,
        },
        backdrop: {
            default: true,
        },
    },
    watch: {
        visible: function (newVal) {
            this.show = newVal
        },
        fromDayNum(newVal) {
            this.copyDays = [newVal]
        },
        isAllDaysSelected(newVal) {
            if (newVal) {
                this.copyDays = [1, 2, 3, 4, 5, 6, 7];
            } else {
                this.copyDays = [this.fromDayNum];
            }
        },
    },
    data() {
        return {
            show: this.visible,
            isAllDaysSelected: false,
            days: [
                {display: 'Mon', label: 'Monday', day_num: 2},
                {display: 'Tue', label: 'Tuesday', day_num: 3},
                {display: 'Wed', label: 'Wednesday', day_num: 4},
                {display: 'Thu', label: 'Thursday', day_num: 5},
                {display: 'Fri', label: 'Friday', day_num: 6},
                {display: 'Sat', label: 'Saturday', day_num: 7},
                {display: 'Sun', label: 'Sunday', day_num: 1},
            ],
            copyDays: [this.fromDayNum],
        }
    },
    methods: {
        onClose() {
            this.isAllDaysSelected = false
            this.show = false
            this.copyDays = []
            this.$emit('close')
        },
        applyCopyHoursToDays() {
            let i = this.copyDays.findIndex(c => c == this.fromDayNum)
            this.copyDays.splice(i, 1)
            this.$emit('copyHoursToDays', this.copyDays)
            this.isAllDaysSelected = false
        },
    },
}
</script>
<style lang="scss">
.form-check-day {
    padding-left: 0;
}
.float-select-day {
    background: #f1f1f1;
    right: 0;
    padding: 20px;
    border-radius: 15px;
    z-index: 99;
    .form-check-label {
        margin-bottom: 0;
    }
    .form-check-day {
        position: relative;
        padding-left: 0 !important;
        .form-check-input {
            position: absolute;
            right: 0;
        }
        .form-check-label {
            color: var(----text-primary-color);
        }
    }
}
.float-outer {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    width: 100%;
    height: 100vh;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 999999999;
}
.modal-custom {
    .modal-dialog {
        max-width: 280px;
    }
}
</style>