import React, { Component } from 'react';
import { Input, Tooltip } from 'antd';
import intl from 'react-intl-universal';
import { string } from 'util_react_web';
import _ from 'lodash';
import styles from './index.less';

const { TextArea } = Input

const { getIntl } = string
class EditableTextArea extends Component {
  state = {
    inputVisible: false,
    inputValue: '',
  };

  showTextArea = () => {
    const { value, handleShow } = this.props;
    this.setState({ inputVisible: true, inputValue: value || '' }, () => this.input.focus());
    if (handleShow) {
      handleShow(this)
    }
  };

  handleTextAreaChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleTextAreaConfirm = e => {
    const { inputValue } = this.state;
    const { handleSave } = this.props;
    if (e.shiftKey && e.keyCode === 13) {
      return
    } 
    if(e.keyCode === 13){
      const value = _.trim(inputValue)
      
      if (value) {
        let isOk = true
        if (handleSave) {
          isOk = handleSave(inputValue);
        }
        if (isOk) {
          this.setState({
            inputVisible: false,
            inputValue: '',
          });
        }
        
      }
      e.preventDefault()
    }
  };

  render() {
    const { inputVisible, inputValue } = this.state;
    const { value, size, tips, placement = 'top', canModify = true, ...ohterProps } = this.props;
    const text = tips || getIntl(intl, 'base.click.on.to.modify', 'Click on to modify')
    return (
      inputVisible ? (
      <TextArea
        ref={node => {
          this.input = node;
        }}
        type="text"
        size={size || 'small'}
        value={inputValue}
        onChange={this.handleTextAreaChange}
        onBlur={this.handleTextAreaConfirm}
        onKeyDown={this.handleTextAreaConfirm}
        {...ohterProps}
      />
      ) : (
        canModify ? (
          <Tooltip placement={placement} title={text}>
            <span style={{ cursor: 'pointer', whiteSpace: 'pre-wrap' }} onClick={this.showTextArea}>
              {value ? <span className={styles.value}>{value}</span>  : <span className={styles.tips}>{text}</span>}
            </span>
          </Tooltip>
        ) : (
          <span style={{ whiteSpace: 'pre-wrap' }}>{value || ''}</span>
        )
       
      )
    );
  }
}

export default EditableTextArea;
