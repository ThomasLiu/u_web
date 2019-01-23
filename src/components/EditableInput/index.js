import React, { Component } from 'react';
import { Input, Tooltip } from 'antd';
import intl from 'react-intl-universal';
import { string } from 'util_react_web';
import styles from './index.less';

const { getIntl } = string
class EditableInput extends Component {
  state = {
    inputVisible: false,
    inputValue: '',
  };

  showInput = () => {
    const { value } = this.props;
    this.setState({ inputVisible: true, inputValue: value || '' }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    const { handleSave } = this.props;
    if (handleSave) {
      handleSave(inputValue);
    }
    this.setState({
      inputVisible: false,
      inputValue: '',
    });
  };

  render() {
    const { inputVisible, inputValue } = this.state;
    const { value, size, width, tips, ...ohterProps } = this.props;
    const text = tips || getIntl(intl, 'base.click.on.to.modify', 'Click on to modify')
    return (
      inputVisible ? (
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
      ) : (
        <Tooltip placement="bottom" title={text}>
          <span style={{ cursor: 'pointer' }} onClick={this.showInput}>
            {value || <span className={styles.tips}>{text}</span>}
          </span>
        </Tooltip>
      )
    );
  }
}

export default EditableInput;
