import React, { Component } from 'react';
import { Form, Input, Switch, Select } from 'antd';
import intl from 'react-intl-universal';
import { string } from 'util_react_web';
import SelectHiddenOptions from '../SelectHiddenOptions';
import Cropper from '../Cropper';
import Support from '../Support';

const { getIntl } = string;

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

class BaseForm extends Component {
  
  onSubmit = (e) => {
    e.preventDefault();
    const { onSubmit, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onSubmit(values);
      }
    });
  }


  getInput = item => {
    const { type, option, field, rows, ...reProps} = item;
    const { origin, form, record = {} } = this.props;
    if (type) {
      switch (type.toLowerCase()) {
        case 'support': 
          return (
            <Support 
              key={field} 
              form={form}
              name={field}
              style={{ width: '100%' }}
              value={record[field]}
              {...reProps}
            />
          )
        case 'textarea': 
          return (
            <TextArea 
              key={field} 
              rows={rows || 4}
              {...reProps}
            />
          )
        case 'img':
          return (
            <Cropper
              imageUrl={form.getFieldValue(field)}
              onSuccess={data => {
                const { ret } = data;
                const url = `${origin}/${ret.key}`;
                form.setFieldsValue({[field]: url});
              }}
              {...reProps}
              {...this.props}
            />
          )
        case 'multiple':
          return (
            <SelectHiddenOptions
              key={field}
              intl={intl}
              {...item}
              {...this.props}
            /> 
          )
        case 'switch':
          return (
            <Switch 
              key={field} 
              {...reProps}
            /> 
          )
        case 'select':
          return (
            <Select 
              key={field} 
              style={{minWidth: 120}}
              {...reProps}
            >
              {
                option.map( optionItem => (
                  <Option key={optionItem.value} value={optionItem.value}>{getIntl(intl, optionItem.titleKey, optionItem.label) }</Option>
                ))
              }
            </Select>
          )
        default:
          return (
            <Input 
              key={field} 
              {...reProps}
            />
          )
      }
    }
    return (<Input />)
  }

  getFormItem = (item, formItemLayout ) => {
    const { form, record = {}, layout: formLayout } = this.props
    const { getFieldDecorator } = form;
    const { required, field, type, help } = item;
    let { label } =  item
    let layout = formItemLayout
    let afterLabel = null
    const rules = [];
    if (required) {
      rules.push({
        required: true,
        message: getIntl(intl, 'base.required', 'Required'),
      }) 
    }
    const fieldDecorator = {
      initialValue: record[field]
    }
    if (rules.length > 0) {
      fieldDecorator.rules = rules
    } 
    if (type && type.toLowerCase() === 'switch') {
      afterLabel = ( <span className="ml2">{label}</span> )
      label = null
      if (formLayout === 'horizontal') {
        layout = {
          wrapperCol: { 
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 15,
              offset: 6,
            },
          },
        }
      }
      
      fieldDecorator.valuePropName = 'checked'
    }

    return (
      <FormItem
        key={`formItem${field}`}
        {...layout}
        label={label}
        help={help}
      >
        { 
          (type && type.toLowerCase() === 'support') ? (
            this.getInput(item)
          ) : (
            getFieldDecorator(field, fieldDecorator)(this.getInput(item))
          )
        }
        { (type && type.toLowerCase() === 'switch') ? afterLabel : null }
      </FormItem>
    )
  }

  getFields() {
    const { layout, children, keyArr = [], formItemLayout } = this.props
    switch (layout) {
      case 'horizontal':
        return (
          <div>
            { keyArr.map( item => (
              this.getFormItem(item, formItemLayout || {
                labelCol: { span: 6 },
                wrapperCol: { span: 15 },
              })
            ))}
            { children }
          </div>
        )
      case 'vertical':
        return (
          <div>
            { keyArr.map( item => (
              this.getFormItem(item)
            ))}
            { children }
          </div>
        )
    
      default:
        return (
          <div>
            { keyArr.map( item => (
              this.getFormItem(item)
            ))}
            { children }
          </div>
        )
    }
  }

  render() {
    const { layout } = this.props;
    return (
      <Form layout={layout} onSubmit={this.onSubmit}>
        {
          this.getFields()
        }
      </Form>
    )
  }

}

export default Form.create({
  onValuesChange(props, changedValues, allValues) {
    const { onChangeSearch } = props;
    if (onChangeSearch) {
      onChangeSearch({ ...changedValues, ...allValues})
    }
  },
})(BaseForm);