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
    const { value } = this.props;
    this.setState({ inputVisible: true, inputValue: value || '' }, () => this.input.focus());
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
        if (handleSave) {
          handleSave(inputValue);
        }
        this.setState({
          inputVisible: false,
          inputValue: '',
        });
      }
      e.preventDefault()
    }
  };

  render() {
    const { inputVisible, inputValue } = this.state;
    const { value, size, ...ohterProps } = this.props;
    const text = getIntl(intl, 'base.click.on.to.modify', 'Click on to modify')
    return (
      <div>
        {
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
            <Tooltip placement="bottom" title={text}>
              <span style={{ cursor: 'pointer', whiteSpace: 'pre-wrap' }} onClick={this.showTextArea}>
                {value || <span className={styles.tips}>{text}</span>}
              </span>
            </Tooltip>
          )
        }
      </div>
    );
  }
}

export default EditableTextArea;
