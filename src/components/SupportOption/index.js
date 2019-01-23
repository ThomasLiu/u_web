import intl from 'react-intl-universal';
import React, { Component } from 'react';
import { Select } from 'antd';
import { string } from 'util_react_web';

const { getIntl } = string;

const { Option } = Select;

class Support extends Component {

  constructor(props) {
    super(props);
    this.state = {
      initDone: false, 
      list: [],
    };
  }

  componentDidMount() {
    const { typeName, getSupports } = this.props;
    getSupports({ typeName }).then(res => {
      const { data } = res;
      const { list } = data;
      this.setState({ initDone: true, list });
    });
  }

  render() {
    const { initDone, list } = this.state;
    const optionList = list.map(item => {
      const text = getIntl(intl, item.titleKey)
      return (
        <Option key={item.titleKey} value={item.value}>
          {text}
        </Option>
      )
    })
    
    return (
      initDone &&
      optionList
    );
  }
}

export default Support;
