
import React, { Component } from 'react';
import BaseForm from '@/components/BaseForm'
import { getSupports } from '@/services/agent';
import { Form, Button, message } from 'antd'

import intl from 'react-intl-universal';
import { string } from 'util_react_web';
import { uploadToken } from '@/services/api';

import styles from './index.less'


const { getIntl } = string;

const option = [
  { value: "alternate", titleKey: 'manageapi.menu.alternate', label: 'alternate 文档的可选版本（例如打印页、翻译页或镜像）' },
  { value: "stylesheet", titleKey: 'manageapi.menu.stylesheet', label: 'stylesheet 文档的外部样式表' },
]

const keyArr = [ 
  {
    label: getIntl(intl, 'Footer type'),
    field: 'footertype',
    placeholder: getIntl(intl, 'plz select one'),
  },
  {
    label: getIntl(intl, 'Icon'),
    field: 'icon',
    type: 'textarea',
    autosize: { minRows: 2, maxRows: 6 },
    rows: 4
  },
  {
    label: getIntl(intl, 'Index'),
    field: 'index',
    help: getIntl(intl, '"0" is the top footer')
  },
  {
    label: getIntl(intl, 'Rel'),
    field: 'rel',
    type: 'select',
    option,
  },
  {
    label: getIntl(intl, 'Is blank target'),
    field: 'blankTarget',
    type: 'switch'
  },
  {
    label: getIntl(intl, 'Test support'),
    field: 'support',
    type: 'support',
    getSupports,
    typeName: 'role',
    placeholder: getIntl(intl, 'plz select one'),
    allowClear: true
  },
  {
    label: getIntl(intl, 'Authority'),
    field: 'authorityIds',
    type: 'multiple',
    getSupports,
    typeName: 'role',
  },
  {
    label: getIntl(intl, 'multiple tags'),
    field: 'authorityIds2',
    type: 'select',
    mode: "tags",
    option
  },
  {
    label: getIntl(intl, 'Img'),
    field: 'img',
    type: 'img',
    uploadToken,
    aspectRatio: 1/1,
    avatarClassName: styles.imgUploader,
  }
]

class TestPage extends Component {
  onSubmit = (values) => {
    console.log('onSubmit values', values)
  }
  render() {
    return (
      <BaseForm
        record={{support: 57, authorityIds: [{ key: 242}, { key: 86}]}}
        onSubmit={this.onSubmit} 
        keyArr={keyArr}
      >
        <Button type="primary" htmlType="submit">{getIntl(intl, 'base.create', 'Create')}</Button>
      </BaseForm>
    )
  }
}


export default TestPage;



