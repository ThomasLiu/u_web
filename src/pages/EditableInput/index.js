
import React, { Component } from 'react';
import EditableInput from '@/components/EditableInput';
import EditableSelect from '@/components/EditableSelect';
import { getSupports } from '@/services/agent';
import { Form, Button, Icon, Select } from 'antd'


class TestPage extends Component {
  state = {
    data: {}
  }

  saveHandler = (value, field) => {
    const { data } = this.state
    data[field] = value
    console.log('saveHandler', value)
    this.setState({
      data
    })
  }

  render() {
    const { data } = this.state
    return (
      <div>
        <EditableInput
          value={data.name}
          handleSave={v => this.saveHandler(v, 'name')}
          size="default"
          width='100%'
        />

        <EditableInput
          value={data.cnName}
          handleSave={v => this.saveHandler(v, 'cnName')}
          size="default"
          width='100%'
        />

        <EditableSelect
          value={data.postId}
          handleSave={v => this.saveHandler(v, 'postId')}
          getSupports={getSupports}
          size="default"
          width='100%'
        />

        <EditableSelect
          value={data.postId2}
          handleSave={v => this.saveHandler(v, 'postId2')}
          getSupports={getSupports}
          size="default"
          width='100%'
          showSearch
          mode='multiple'
        />

        <EditableSelect
          value={data.emails}
          handleSave={v => this.saveHandler(v, 'emails')}
          size="default"
          width='100%'
          options={[
            { value: 'thomas1@qq.com', titleKey: 'thomas1@qq.com' },
            { value: 'thomas2@qq.com', titleKey: 'thomas2@qq.com' },
            { value: 'thomas3@qq.com', titleKey: 'thomas3@qq.com' },
          ]}
          showSearch
          mode='tags'
        />

      </div>
      
    )
  }
}


export default TestPage;



