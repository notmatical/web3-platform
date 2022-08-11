// eslint-disable-next-line import/no-named-default
import { default as ReactCountdown } from 'react-countdown';

const Countdown = ({ endDateTime, update, renderer }: any) => (
    <ReactCountdown date={endDateTime} onComplete={() => update && update()} renderer={renderer} />
);

export default Countdown;
