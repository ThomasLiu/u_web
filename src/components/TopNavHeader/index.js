import React, { PureComponent } from 'react';
import Link from 'umi/link';
import RightContent from '../GlobalHeader/RightContent';
import BaseMenu from '../SiderMenu/BaseMenu';
import { getFlatMenuKeys } from '../SiderMenu/SiderMenuUtils';
import { url } from 'util_react_web';
import styles from './index.less';

export default class TopNavHeader extends PureComponent {
  state = {
    maxWidth: undefined,
  };

  static getDerivedStateFromProps(props) {
    return {
      maxWidth: (props.contentWidth === 'Fixed' ? 1200 : window.innerWidth) - 280 - 165 - 40,
    };
  }

  render() {
    const { theme, contentWidth, menuData, logo, title} = this.props;
    const { maxWidth } = this.state;
    const flatMenuKeys = getFlatMenuKeys(menuData.left || []);
    const { getPageQuery } = url
    let { redirect } = getPageQuery();
    if (redirect) {
      const redirectUrlParams = new URL(decodeURIComponent(redirect));
      redirect = redirectUrlParams.origin;
    }
    return (
      <div className={`${styles.head} ${theme === 'light' ? styles.light : ''}`}>
        <div
          ref={ref => {
            this.maim = ref;
          }}
          className={`${styles.main} ${contentWidth === 'Fixed' ? styles.wide : ''}`}
        >
          <div className={styles.left}>
            <div className={styles.logo} key="logo" id="logo">
              <Link to={redirect || '/'}>
                <img src={logo} alt="logo" />
                <h1>{title}</h1>
              </Link>
            </div>
            <div
              style={{
                maxWidth,
              }}
            > 
              <BaseMenu {...this.props} menuData={menuData.left} flatMenuKeys={flatMenuKeys} />
            </div>
          </div>
          <RightContent {...this.props} />
        </div>
      </div>
    );
  }
}
