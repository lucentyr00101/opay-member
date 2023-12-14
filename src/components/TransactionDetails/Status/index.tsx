import React from 'react';
import styles from './index.less';
import underReview from '@/assets/statuses/underReview.svg';
import timedOut from '@/assets/statuses/timedOut.svg';
import completed from '@/assets/statuses/successful.svg';
import failed from '@/assets/statuses/failed.svg';
import inProgress from '@/assets/statuses/inProgress.svg';
import { useIntl } from 'umi';

export interface StatusProps {
  status: string;
  hasIcon?: boolean;
  className?: string;
}

const statusMapping = {
  'In Progress': 'inProgress',
  'Under Review': 'underReview',
  Completed: 'completed',
  Failed: 'failed',
  Cancelled: 'cancelled',
  'Timed Out': 'timedOut',
  Rejected: 'cancelled',
};
const iconMapping = {
  inProgress: inProgress,
  underReview: underReview,
  completed,
  failed: failed,
  cancelled: failed,
  timedOut: timedOut,
  rejected: failed,
};

const Statuses: React.FC<StatusProps> = ({ status, hasIcon = true, className }) => {
  const t = useIntl();
  const statusClass = statusMapping[status];

  return (
    <div className={styles.detailsValue}>
      {hasIcon && <img src={iconMapping[statusClass]} alt="" />}

      <span
        className={`${styles[statusClass]} ${!hasIcon && styles.noMargin} ${
          className && className
        }`}
      >
        {status? t.formatMessage({id: status}) : ''}
      </span>
    </div>
  );
};

export default Statuses;
