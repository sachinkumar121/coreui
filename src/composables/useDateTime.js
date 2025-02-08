import moment from 'moment-timezone';

export default function useDateTime() {
    const isMilliseconds = (timestamp) => {
        return timestamp.toString().length > 10;
    }
    const convertMillisecondsToSeconds = (ms) => {
        return ms / 1000
    }
    const convertTimestampToDateTime = (timestamp, format, timezone) => {
        return isMilliseconds(timestamp) ? moment.unix(convertMillisecondsToSeconds(timestamp)).tz(timezone).format(format) : moment.unix(timestamp).tz(timezone).format(format);
    }

    const convertTimeToFormat = (timezone, format = 'h:ma') => moment().tz(timezone).format(format)

    return {
        convertTimestampToDateTime,
        convertTimeToFormat
    }
}