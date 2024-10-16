import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const ago = (dbstring: string) => dayjs(dbstring).fromNow()

export { ago }
