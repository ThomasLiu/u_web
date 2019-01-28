
import React, { Component } from 'react';
import { string } from 'util_react_web';
import intl from "react-intl-universal";
import Upload from '@/components/Upload'
import { uploadAttachment, uploadToken } from '@/services/api';
import { message, Icon } from 'antd'

const { getIntl } = string;

class TestPage extends Component {
  state = {
    initDone: false,
    data: {}
  }

  componentDidMount() {
    uploadToken().then(res => {
      const {
        data: { token, errSms, origin },
      } = res;
      if (errSms) {
        message.error(getIntl(intl, errSms));
      } else {
        this.setState({
          initDone: true,
          token,
          origin,
        });
      }
    });
  }

  onSuccess = (data) => {
    console.log('onSuccess', data)
  }
  
  render() {
    const { data, initDone, token, origin } = this.state

    return (
      initDone && 
      <div>
        <Upload 
          data={ { token} }
          origin={origin}
          onSuccessAfter={this.onSuccess}
          // extra={
          //   <p className="ant-upload-drag-icon">
          //     <Icon type="inbox" />
          //   </p>
          // }
        />
      </div>
      
    )
  }
}


export default TestPage;



