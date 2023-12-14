import { Button } from 'antd';
import styles from './index.less';
import SupportIcon from '@/assets/support.svg';
// import { DefaultFooter } from '@ant-design/pro-layout';
import { useModel } from 'umi';
import Cookies from 'universal-cookie';

const Footer: React.FC = () => {
  const cookies = new Cookies();
  const icon = <img className={styles.supportIcon} src={SupportIcon} />;
  const { initialState } = useModel('@@initialState');
  const { currentUser } = (initialState as any) || {};
  const validMerchant = cookies.get('validMerchant');

  const handleCSRClick = () => {
    let url =
      currentUser?.merchant?.customerServiceUrl || cookies.get('customerServiceUrl') || '/404';
    if (url) {
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      window.open(url, '_blank');
    } else {
      window.location.href = '/error/404';
    }
  };

  return (
    <div className={styles.footerWrapper}>
      {validMerchant && (
        <Button
          className={styles.fab}
          type="primary"
          shape="circle"
          icon={icon}
          size="large"
          onClick={() => handleCSRClick()}
        />
      )}
    </div>
  );
};

export default Footer;
