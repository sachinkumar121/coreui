<template>
    <div class="float-select-day">
        <p>Copy times to</p>   
        <div
            class="d-sm-flex form-group align-items-center"
            v-for="(day, index) in days" :key="index"
        >
            <div class="form-check form-check-day">
                <input
                    class="form-check-input"
                    type="checkbox"
                    :id="day.label"
                    :value="day.day_num"
                    :disabled="day.day_num == fromDayNum"
                    v-model="copyDays"
                />
                <label class="form-check-label" :for="day.label">{{
                    day.label
                }}</label>
            </div>
        </div>
        <button class="btn btn-success w-100" @click="applyCopyHoursToDays">Apply</button>
    </div>
</template>
<script>
export default {
    name: 'CopyHours',
    props: {
        fromDayNum: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            days: [
                {display: 'Sun', label: 'Sunday', day_num: 1},
                {display: 'Mon', label: 'Monday', day_num: 2},
                {display: 'Tue', label: 'Tuesday', day_num: 3},
                {display: 'Wed', label: 'Wednesday', day_num: 4},
                {display: 'Thu', label: 'Thursday', day_num: 5},
                {display: 'Fri', label: 'Friday', day_num: 6},
                {display: 'Sat', label: 'Saturday', day_num: 7},
            ],
            copyDays: [this.fromDayNum]
        }
    },
    watch: {
        fromDayNum(newVal) {
            this.copyDays = [newVal];
        }
    },
    methods: {
        applyCopyHoursToDays() {
            let i = this.copyDays.findIndex(c => this.fromDayNum);
            this.copyDays.splice(i, 1);
            this.$emit('copyHoursToDays', this.copyDays);
        }
    }
}
</script>
<style lang="scss">
.form-check-day {
    padding-left :0;
}
.float-select-day {
    position: absolute;
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
        padding-left:0 !important;
        .form-check-input {
            position: absolute;
            right: 0;
        }
        .form-check-label {
            color: var(----text-primary-color);
        }
    }
}

</style>