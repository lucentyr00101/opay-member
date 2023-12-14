import type { FC } from 'react';
import { useEffect, useState } from 'react';
import styles from './index.less';

interface Props {
  createdTime: string;
  expiryTime: string;
  action?: () => void;
}

const Timer: FC<Props> = ({ expiryTime, action }) => {
  const [timer, setTimer] = useState<string>('00:00:00');
  // Set the date we're counting down to
  const countDownDate = new Date(expiryTime).getTime();

  useEffect(() => {
    // Update the count down every 1 second
    const x = setInterval(() => {
      // Get today's date and time
      const now = new Date().getTime();

      // Find the distance between now and the count down date
      const distance = countDownDate - now;

      let hours: string | number = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      let minutes: string | number = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds: string | number = Math.floor((distance % (1000 * 60)) / 1000);

      hours = hours.toString().length === 2 ? hours : `0${hours}`;
      minutes = minutes.toString().length === 2 ? minutes : `0${minutes}`;
      seconds = seconds.toString().length === 2 ? seconds : `0${seconds}`;

      // Display the result in the element with id="demo"
      setTimer(`${hours}:${minutes}:${seconds}`);

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        setTimer('00:00:00');
        if (action) action();
      }
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <span className={styles.timer}>{timer}</span>
    </>
  );
};

export default Timer;
