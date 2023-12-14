import React from 'react';
import styles from './index.less';
import noData from '@/assets/noData.svg';
import Cookies from 'universal-cookie';

export type AmountsProp = {
  amounts: (string | number)[];
  selectedAmount: any;
  selectAmount: any;
};

const Amounts: React.FC<AmountsProp> = ({ amounts, selectAmount, selectedAmount }) => {
  const cookies = new Cookies();
  const setAmount = (value: string | number) => {
    selectAmount(value);
  };

  const isCrypto = cookies.get('paymentType').groupType.toLowerCase() === 'crypto';

  const conversionRate = (isCrypto && cookies.get('paymentType').exchangeRate) || 1;

  return (
    <div className={amounts.length ? styles.amountsContainer : null}>
      {!amounts.length ? (
        <img src={noData} style={{ width: '100%' }} alt="" />
      ) : (
        amounts.map((amountData: any) => (
          <button
            onClick={() => setAmount(amountData)}
            className={
              selectedAmount?.id === amountData.id
                ? `${styles.amountBtn} ${styles.selected}`
                : styles.amountBtn
            }
            key={Math.floor(Math.random() * 10000000)}
          >
            {amountData.amount.toFixed(2)}
            {isCrypto && (
              <p style={{ marginBottom: '0', fontSize: '18px' }}>
                {' '}
                = {(conversionRate * amountData.amount).toFixed(2)} USDT
              </p>
            )}
          </button>
        ))
      )}
      {/* {amounts.length ? (
        <button onClick={moreAmounts} className={styles.amountBtn}>
          More
        </button>
      ) : null} */}
    </div>
  );
};

export default Amounts;
