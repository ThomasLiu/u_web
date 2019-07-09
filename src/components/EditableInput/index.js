import React, { Component, Fragment } from 'react';
import { Input, Tooltip } from 'antd';
import intl from 'react-intl-universal';
import { string } from 'util_react_web';
import _ from 'lodash';
import styles from './index.less';

const { getIntl } = string
class EditableInput extends Component {
  state = {
    inputVisible: false,
    inputValue: '',
    errorMsg: '',
  };

  showInput = () => {
    const { value, handleShow } = this.props;
    this.setState({ errorMsg: '', inputVisible: true, inputValue: value || '' }, () => this.input.focus());
    if (handleShow) {
      handleShow(this)
    }
  };

  handleInputChange = e => {
    const { maxTextLength = 3 } = this.props;
    if (maxTextLength) {
      if (parseInt(maxTextLength) < e.target.value.length ) {
        this.setState({
          errorMsg: getIntl(intl, 'base.max.text.length', `Up to ${maxTextLength} characters`, { num: maxTextLength })
        })
        return 
      }
    } 
    this.setState({ inputValue: e.target.value, errorMsg: '' });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    const { handleSave } = this.props;
    const value = _.trim(inputValue);
      
    if (value) { 
      let isOk = true
      if (handleSave) {
        isOk = handleSave(inputValue);
      }
      if (isOk) {
        this.setState({
          inputVisible: false,
          inputValue: '',
          errorMsg: ''
        });
      }
    }
    
  };

  render() {
    const { inputVisible, inputValue, errorMsg } = this.state;
    const { value, size, width, tips, placement = 'top', canModify = true, ...ohterProps } = this.props;
    const text = tips || getIntl(intl, 'base.click.on.to.modify', 'Click on to modify')
    return (
      inputVisible ? (
      <Fragment>
        <Input
          ref={node => {
            this.input = node;
          }}
          type="text"
          size={size || 'small'}
          style={{ width: width || 78 }}
          value={inputValue}
          onChange={this.handleInputChange}
          onBlur={this.handleInputConfirm}
          onPressEnter={this.handleInputConfirm}
          {...ohterProps}
        />
        {
          errorMsg && (<span className={styles.errorMsg}>{errorMsg}</span>)
        }
      </Fragment>
      ) : (
        canModify ? (
          <Tooltip placement={placement} title={text}>
            <span style={{ cursor: 'pointer' }} onClick={this.showInput}>
              {value ? <span className={styles.value}>{value}</span> : <span className={styles.tips}>{text}</span>}
            </span>
          </Tooltip>
        ) : (
          <span>{value || ''}</span>
        )
        
      )
    );
  }
}

export default EditableInput;
