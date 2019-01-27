
import React, { Component } from 'react';
import EditableInput from '@/components/EditableInput';
import EditableSelect from '@/components/EditableSelect';
import EditableTextArea from '@/components/EditableTextArea'
import { getSupports } from '@/services/agent';
import { message } from 'antd'


const strIsInt = str => /^\+?[1-9][0-9]*$/.test(str)


class TestPage extends Component {
  state = {
    data: {}
  }

  saveIntHandler = (value, field) => {
    if (strIsInt(value)) {
      const { data } = this.state
      data[field] = value
      console.log('saveHandler', value)
      this.setState({
        data
      })
      return true
    }
    return false
  }


  saveHandler = (value, field) => {
    const { data } = this.state
    data[field] = value
    console.log('saveHandler', value)
    this.setState({
      data
    })
    return true
  }

  render() {
    const { data } = this.state
    return (
      <div>
        <EditableInput
          value={data.name || 'canModify'}
          handleSave={v => this.saveHandler(v, 'name')}
          size="default"
          canModify={false}
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

        <br />
        <label>can Modify EditableSelect multiple</label>
        <br />
        <EditableSelect
          value={data.postId2 || [86, 57, 54] }
          handleSave={v => this.saveHandler(v, 'postId2')}
          getSupports={getSupports}
          size="default"
          width='100%'
          showSearch
          mode='multiple'
        />

        <br />
        <label>cant Modify EditableSelect multiple</label>
        <br />
        <EditableSelect
          value={data.postId2 || [86, 57, 54] }
          handleSave={v => this.saveHandler(v, 'postId2')}
          getSupports={getSupports}
          size="default"
          width='100%'
          canModify={false}
          showSearch
          mode='multiple'
        />

        <br />
        <label>cant Modify EditableSelect multiple null</label>
        <br />
        <EditableSelect
          value={data.postId2 }
          handleSave={v => this.saveHandler(v, 'postId2')}
          getSupports={getSupports}
          size="default"
          width='100%'
          canModify={false}
          showSearch
          mode='multiple'
        />


        <br />
        <label>can Modify EditableSelect tags</label>
        <br />
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

        <br />
        <label>cant Modify EditableSelect tags null</label>
        <br />
        <EditableSelect
          value={data.emails || ['tt@qq.com', '11@121.com']}
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
          canModify={false}
        />

        <br />
        <label>cant Modify EditableSelect tags null</label>
        <br />
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
          canModify={false}
        />


        <br />
        <label>can Modify EditableTextArea</label>
        <br />
        <EditableTextArea
          value={data.info}
          handleSave={v => this.saveHandler(v, 'info')}
        />

        <br />
        <label>cant Modify EditableTextArea</label>
        <br />
        <EditableTextArea
          value={data.info2 || 'cantModify'}
          handleSave={v => this.saveHandler(v, 'info2')}
          canModify={false}
        />
        
        <br />
        <label>cant Modify EditableTextArea value null</label>
        <br />
        <EditableTextArea
          value={data.info2}
          handleSave={v => this.saveHandler(v, 'info2')}
          canModify={false}
        />

      </div>
      
    )
  }
}


export default TestPage;



