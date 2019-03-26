import React, { PureComponent } from 'react';
import { stringify } from 'qs';
import { getSystemPath } from '@/services/base';

import { url } from 'util_react_web';
import { Spin } from 'antd';

class ToLogin extends PureComponent {
 

  componentDidMount() {
    getSystemPath('loginweb').then( ({ data: loginUrl }) => {
      let path = window.location.href
      let lan = 'en-US'
      if (path.indexOf('setting') > 0) {
        const { addQuery } = url
        path = addQuery(path, 'lan', 'zh-CN')
        lan = 'zh-CN'
      }
      const redirect = `${loginUrl}/user/login?${stringify({ redirect: encodeURIComponent(path) })}`

      window.location.href = redirect
    })
  }
  
  render() {
    return (
      <Spin spinning />
    )
  }
}

export default ToLogin;
