import React, { Component } from 'react';
import { Select, Tooltip } from 'antd';
import intl from 'react-intl-universal';
import { string } from 'util_react_web';
import styles from './index.less';

const { getIntl } = string
const { Option } = Select;

class EditableSelect extends Component {
  state = {
    inputVisible: false,
    inputValue: '',
    list: [],
    initDone: false,
  };

  componentDidMount() {
    const { typeName, getSupports, options } = this.props;
    if (options) {
      this.setState({ initDone: true, list: options });
    } else if (getSupports) {
      getSupports({ typeName }).then(res => {
        const { data } = res;
        const { list } = data;
        this.setState({ initDone: true, list });
      });
    } else {
      this.setState({ initDone: true });
    }
  }

  showInput = () => {
    const { value, handleShow } = this.props;
    this.setState({ inputVisible: true, inputValue: value || '' }, () => this.select.focus());
    if (handleShow) {
      handleShow(this)
    }
  };

  handleInputChange = value => {
    this.setState({ inputValue: value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    const { handleSave } = this.props;
    if (inputValue) {
      if (handleSave) {
        handleSave(inputValue);
      }
      this.setState({
        inputVisible: false,
        inputValue: '',
      });
    }
  };

  getText = () => {
    const { value, tips, mode, canModify = true } = this.props;
    let text = null
    if (canModify) {
      text = (
        <span className={styles.tips}>{tips || getIntl(intl, 'base.click.on.to.modify', 'Click on to modify')}</span>
      )
    }
    const { list } = this.state;
    
    if (list && value) {
      if (mode === 'multiple') {
        const thisValues = list.filter( item => value.includes(item.value) )
        if (thisValues && thisValues.length > 0) {
          text = thisValues.map( item => getIntl(intl, item.titleKey) ).join(', ')
        }
      } else if (mode === 'tags') {
        text = value.join(', ')
      } else {
        const thisValue = list.filter( item => item.value === value )
        if (thisValue && thisValue.length > 0) {
          text = getIntl(intl, thisValue[0].titleKey) 
        }
      }

      text = (<span className={styles.value}>{text}</span>)
    }
    return text
  }

  render() {
    const { inputVisible, list } = this.state;
    const { value, size, width, tips, placement = 'top', canModify = true, ...ohterProps } = this.props;
    const text = this.getText()

    const optionList = list.map(item => {
      const optionText = getIntl(intl, item.titleKey)
      return (
        <Option key={item.titleKey} value={item.value}>
          {optionText}
        </Option>
      )
    })

    return (
      inputVisible ? (
        <Select 
          ref={node => {
            this.select = node;
          }}
          size={size || 'small'}
          style={{ width: width || 78 }}
          defaultValue={value}
          onChange={this.handleInputChange}
          onBlur={this.handleInputConfirm}
          onPressEnter={this.handleInputConfirm}
          defaultOpen
          {...ohterProps}  
        >
          {optionList}
        </Select> 
      ) : (
        canModify ? (
          <Tooltip placement={placement} title={tips || getIntl(intl, 'base.click.on.to.modify', 'Click on to modify')}>
            <span style={{ cursor: 'pointer' }} onClick={this.showInput}>
              {text}
            </span>
          </Tooltip>
        ) : (
          <span>{text}</span>
        )
        
      )
    );
  }
}

export default EditableSelect;
