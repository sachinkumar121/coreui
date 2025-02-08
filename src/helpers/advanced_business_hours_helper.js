import moment from 'moment-timezone';

function slotsDoNotOverlap(slots) {
  // Sort slots by their beginning hours
  slots.sort((a, b) => a.begin_hours - b.begin_hours);

  for (let i = 0; i < slots.length - 1; i++) {
    // Check if the current slot's end overlaps with the next slot's begin
    if (slots[i].end_hours > slots[i + 1].begin_hours) {
      return false; // Overlap found
    }
  }
  return true; // No overlap
}

const slotsDoNotIncludesInvalid = (slots) =>
  slots.every((slot) => slot.begin_hours < slot.end_hours);

// this function is convert the day slots into day_name: slots in am/pm
const formatDaySlot = (day, timezone = moment.tz.guess()) =>
  `${moment()
    .day(day.day_num - 1)
    .format("ddd")}: ${
    dayHasSlots(day) ? formatSlotsTimes(day.slots, timezone) : "Unavailable"
  }`;

// this function will convert the entire week_days hours to am/pm format.
const formatWeekDaysAvailibility = (
  week_day_hours,
  timezone = moment.tz.guess()
) => week_day_hours.map((week) => week.map((w) => formatDaySlot(w, timezone)));

// this function will convert the unix timestamp into am/pm as beginTime to endTime
const formatSlotsTimes = (daySlots, timezone = moment.tz.guess()) => {
  return daySlots && daySlots.length > 0
    ? daySlots
        .map((slot) => {
          const beginTime = moment.tz(slot.begin_hours, timezone);
          const endTime = moment.tz(slot.end_hours, timezone);

          return `${beginTime.format("h:mmA")} to ${endTime.format("h:mmA")}`;
        })
        .join(", ")
    : "Unavailable";
};

const dayHasValidSlots = (day) =>
  day.slots.every((s) => !s.invalid_hours && !s.is_overlap);

const indexOfAllInvalidSlots = (slots) =>
  slots.reduce(function (a, e, i) {
    if (e.invalid_hours) a.push(i);
    return a;
  }, []);

const indexOfAllOverlappedSlots = (slots) =>
  slots.reduce(function (a, e, i) {
    if (e.is_overlap) a.push(i);
    return a;
  }, []);

const attachInvalidSlotsIndex = (week_day_hours) => {
  week_day_hours.forEach((week) => {
    week.forEach((day) => {
      if (!day.is_closed) {
        if (dayHasSlots(day)) {
          if (!dayHasValidSlots(day)) {
            day.invalid_slots_index = indexOfAllInvalidSlots(day.slots);
            day.overlapped_slots_index = indexOfAllOverlappedSlots(day.slots);
          }
          day.slots_valid =
            slotsDoNotIncludesInvalid(day.slots) && slotsDoNotOverlap(day.slots);
        } else {
          day.slots_valid = false;
        }

      }
    });
  });
};

const attachInvalidHoursProperty = (week_day_hours) => {
  week_day_hours.forEach((week) => {
    week.forEach((day) => {
      if (!day.is_closed && dayHasSlots(day)) {
        day.slots.forEach((slot) => {
          slot.invalid_hours = slot.begin_hours > slot.end_hours;
        });
      }
    });
  });
};

const dayHasSlots = (day) => day.slots && day.slots.length > 0;

const attachIsOverlapProperty = (week_day_hours) => {
  week_day_hours.forEach((week) => {
    week.forEach((day) => {
      day.slots = dayHasSlots(day)
        ? attachIsOverlapPropertyToSlots(day.slots)
        : day.slots;
    });
  });
};

const attachIsOverlapPropertyToSlots = (slots) => {
  // Sort slots by begin_hours
  slots.sort((a, b) => a.begin_hours - b.begin_hours);

  // Check for overlaps and add the overlaps property
  for (let i = 0; i < slots.length - 1; i++) {
    if (slots[i].end_hours > slots[i + 1].begin_hours) {
      slots[i].is_overlap = true;
      slots[i + 1].is_overlap = true;
    } else {
      slots[i].is_overlap = slots[i].is_overlap || false;
    }
  }

  // Ensure the last slot has the overlaps property
  slots[slots.length - 1].is_overlap =
    slots[slots.length - 1].is_overlap || false;
  return slots;
};

const isWeekHoursDataValid = (week_day_hours) => {
  return week_day_hours
    .map((w) =>
      w.filter((d) => !d.is_closed).every((d) => d.slots_valid == true)
    )
    .every((w) => w);
};

const getInvalidSlotsData = (week_day_hours) =>
  week_day_hours.map((week) =>
    week
      .filter((day) => day.hasOwnProperty("slots_valid") && !day.slots_valid)
      .map((day) => {
        day.slots = day.slots.filter(
          (slot) => slot.is_overlap || slot.invalid_hours
        );
        return day;
      })
  );

/*
 * This function is used to convert the simple business hours day obj
 * to advanced business hours day object.
 * @param {object} sbhDayObj simple business hour object
 * @return {object} advanced business hour day object
 */
const convertSbhDayObjToAbhDayObj = (sbhDayObj) => {
  const { 
    is_closed, by_appointment_only, day_num,
    begin_hours, end_hours,
    break_begin_hours, break_end_hours
  } =
    sbhDayObj;
  return {
    is_closed,
    by_appointment_only,
    day_num,
    slots: [
      {
        begin_hours,
        end_hours: break_begin_hours,
      },
      {
        begin_hours: break_end_hours,
        end_hours
      }
    ],
  };
};

/*
 * This function is used to convert the simple business hours
 * to advanced business hours.
 * @param {object} sbh simple business hours of user/business
 * @return {object} advanced business hours object
 */
const convertSbhToAbh = (sbh) => {
  const advanced_business_hours = {
    is_valid: true,
    use_same_as_businesss_abs_hours: false,
    sbh_equal: true,
  };
  const weekSchedule = sbh.day_hours.map(convertSbhDayObjToAbhDayObj);
  advanced_business_hours.week_day_hours = new Array(5)
    .fill([])
    .map(() => weekSchedule);
  return advanced_business_hours;
};

export {
  attachInvalidSlotsIndex,
  formatSlotsTimes,
  formatWeekDaysAvailibility,
  formatDaySlot,
  attachIsOverlapProperty,
  attachInvalidHoursProperty,
  isWeekHoursDataValid,
  getInvalidSlotsData,
  convertSbhToAbh
};
