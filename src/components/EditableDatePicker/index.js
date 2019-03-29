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
    const {format = defaultFormat, mode} = props;

    this.state = {
      inputVisible: false,
      inputValue: '',
      defaultFormat: format,
      mode: mode
    };
  }

  showInput = () => {
    const { value, handleShow } = this.props;
    this.setState({ inputVisible: true, inputValue: value || '' });
    if (handleShow) {
      handleShow(this)
    }
  };

  handleInputChange = (date, dateString) => {
    // console.log('handleInputChange', date, dateString)
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
    // console.log('handleOk', date)
    const { defaultFormat } = this.state;
    if (date) { 
      const { handleSave, type } = this.props;
      let isOk = true
      if (handleSave) {
        let value 
        if (type === 'range') {
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

  handlePanelChange = (value, mode) => {
    // console.log('handlePanelChange', value, mode)
    const { type } = this.props;
    const setObj = {}
    const isMonth = this.checkMode('month')
    if (isMonth) {
      setObj.inputvalue = value
    }
    if (type === 'range') {
      setObj.mode = [
        mode[0] === 'date' ? 'month' : mode[0],
        mode[1] === 'date' ? 'month' : mode[1],
      ]
    } else {
      setObj.mode = mode
    }

    this.setState(setObj);
  }

  blur = () => {
    const { defaultFormat, inputvalue } = this.state;
    console.log('blur', defaultFormat, inputvalue)
    if(inputvalue) {
      const { handleSave, type } = this.props;
      let isOk = true
      if (handleSave) {
        let value 
        if (type === 'range') {
          value = [moment(inputvalue[0]).format(defaultFormat), moment(inputvalue[1]).format(defaultFormat)]
        } else {
          value = moment(inputvalue).format(defaultFormat)
        }
        isOk = handleSave(value);
      }
      if (isOk) {
        this.setState({
          inputVisible: false,
        });
      }
    }
  }

  checkMode = (checkType) => {
    const { mode } = this.props;
    const type = typeof mode
    let isMonth = false
    if (type === 'object') {
      isMonth = mode.length === 2
      && mode[0] === checkType
      && mode[1] === checkType
    }
    if (type === 'string') {
      isMonth = mode === checkType
    }
    return isMonth
  }

  handleOpenChange = (open) => {
    if (open) {
      this.setState({ mode: 'time' });
    }
  }

  renderExtraFooter = () => {
    const { renderExtraFooter } = this.props;

    return renderExtraFooter(this)
  }

  render() {
    const { inputVisible, defaultFormat, inputvalue } = this.state;
    const { value, size, tips, placement = 'top', canModify = true, type, between, showOk, renderExtraFooter, ...ohterProps } = this.props;
    const text = tips || getIntl(intl, 'base.click.on.to.modify', 'Click on to modify')
    const datePickerObj = {
      onChange: this.handleInputChange,
      open: true,
      format: defaultFormat,
      size: size || 'small',
    }
    let showValue = value
    if (ohterProps.showTime || showOk) {
      datePickerObj.onOk = this.handleOk
    }
    if (ohterProps.mode) {
      datePickerObj.onPanelChange = this.handlePanelChange
      const isMonth = this.checkMode('month')
      if (isMonth) {
        datePickerObj.onBlur = this.blur
      }
    }

    if (inputvalue) {
      datePickerObj.value = inputvalue
    }

    if (renderExtraFooter) {
      ohterProps.renderExtraFooter = this.renderExtraFooter
    }

    // console.log('ohterProps', ohterProps)

    if (value) {
      if (type === 'range' && value.length === 2) {
        let start = moment(value[0], defaultFormat)
        let end = moment(value[1], defaultFormat)
        if (!start.isValid()) {
          start = moment()
        }
        if (!end.isValid()) {
          end = moment()
        }

        datePickerObj.defaultValue = [start, end]

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
    
    switch (type) {
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
