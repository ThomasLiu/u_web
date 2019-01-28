import React, { Component, Fragment } from 'react';
import { DatePicker, Tooltip } from 'antd';
import moment from 'moment';
import intl from 'react-intl-universal';
import { string } from 'util_react_web';
import _ from 'lodash';
import styles from './index.less';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker

const { getIntl } = string
class EditableDatePicker extends Component {
  

  constructor(props) {
    super(props)

    let defaultFormat = 'YYYY-MM-DD';
    if (props.showTime) {
      defaultFormat = 'YYYY-MM-DD HH:mm:ss'
    }
    const {format = defaultFormat} = props;

    this.state = {
      inputVisible: false,
      inputValue: '',
      defaultFormat: format
    };
  }

  showInput = () => {
    const { value } = this.props;
    this.setState({ inputVisible: true, inputValue: value || '' });
  };

  handleInputChange = (date, dateString) => {
    if (!this.props.showTime) { 
      if (dateString) { 
        const { handleSave } = this.props;
        let isOk = true
        if (handleSave) {
          isOk = handleSave(dateString);
        }
        if (isOk) {
          this.setState({
            inputVisible: false,
          });
        }
      }
    }
  };

  handleOk = date => {
    const { defaultFormat } = this.state;
    if (date) { 
      const { handleSave, mode } = this.props;
      let isOk = true
      if (handleSave) {
        let value 
        if (mode === 'range') {
          value = [moment(date[0]).format(defaultFormat), moment(date[1]).format(defaultFormat)]
        } else {
          value = moment(date).format(defaultFormat)
        }
        isOk = handleSave(value);
      }
      if (isOk) {
        this.setState({
          inputVisible: false,
        });
      }
    }
  };

  render() {
    const { inputVisible, defaultFormat } = this.state;
    const { value, size, tips, placement = 'top', canModify = true, mode, between, ...ohterProps } = this.props;
    const text = tips || getIntl(intl, 'base.click.on.to.modify', 'Click on to modify')
    const datePickerObj = {
      onChange: this.handleInputChange,
      open: true,
      format: defaultFormat,
      size: size || 'small',
    }
    let showValue = value
    if (ohterProps.showTime) {
      ohterProps.onOk = this.handleOk
    }
    if (value) {
      if (mode === 'range' && value.length === 2) {
        datePickerObj.defaultValue = [moment(value[0], defaultFormat), moment(value[1], defaultFormat)]
        showValue = (
          <Fragment>
            <span>{value[0]}</span>
            {between || ' , '}
            <span>{value[1]}</span>
          </Fragment>
        )
      } else {
        datePickerObj.defaultValue = moment(value, defaultFormat)
      }
    }

    let picker = (<DatePicker 
      {...datePickerObj}
      {...ohterProps}
    />)
    
    switch (mode) {
      case 'month':
        picker = (
          <MonthPicker 
            {...datePickerObj}
            {...ohterProps}
          />
        )
        break;
      case 'week':
        picker = (
          <WeekPicker 
            {...datePickerObj}
            {...ohterProps}
          />
        )
        break;
      case 'range':
        picker = (
          <RangePicker 
            {...datePickerObj}
            {...ohterProps}
          />
        )
        break;
    
      default:
        break;
    }

    return (
      inputVisible ? picker : (
        canModify ? (
          <Tooltip placement={placement} title={text}>
            <span style={{ cursor: 'pointer' }} onClick={this.showInput}>
              {showValue || <span className={styles.tips}>{text}</span>}
            </span>
          </Tooltip>
        ) : (
          <span>{showValue || ''}</span>
        )
        
      )
    );
  }
}

export default EditableDatePicker;
