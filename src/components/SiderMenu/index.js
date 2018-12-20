import React from 'react';
import { Drawer } from 'antd';
import SiderMenu from './SiderMenu';
import { getFlatMenuKeys } from './SiderMenuUtils';

const SiderMenuWrapper = React.memo(props => {
  const { isMobile, allMenu, collapsed, onCollapse } = props;
  const flatMenuKeys = getFlatMenuKeys(allMenu);
  console.log('SiderMenuWrapper', props)
  return isMobile ? (
    <Drawer
      visible={!collapsed}
      placement="left"
      onClose={() => onCollapse(true)}
      style={{
        padding: 0,
        height: '100vh',
      }}
    >
      <SiderMenu {...props} flatMenuKeys={flatMenuKeys} collapsed={isMobile ? false : collapsed} />
    </Drawer>
  ) : (
    <SiderMenu {...props} flatMenuKeys={flatMenuKeys} />
  );
});

export default SiderMenuWrapper;
