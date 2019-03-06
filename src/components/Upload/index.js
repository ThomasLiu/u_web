import React, { PureComponent, Fragment } from 'react';
import { string } from 'util_react_web';
import intl from "react-intl-universal";
import { Upload, Icon, message } from 'antd';
import styles from './index.less';

const { getIntl } = string;

const { Dragger } = Upload;
const defaultFileType = 'doc|jpeg|png|jpg';
const defaultSize = 10;

class UploadDiv extends PureComponent {
  state = {
    fileList: []
  }

  beforeUpload = file => {
    const { beforeUpload } = this.props;

    if (beforeUpload) {
      return beforeUpload(file)
    }

    const { maxSize = defaultSize, fileType = defaultFileType } = this.props;

    const reg = new RegExp(`${fileType.toLowerCase()}`);
    
    const isPass = reg.test(file.name.toLowerCase())
    if (!isPass) {
      message.error(getIntl(intl, 'base.you.can.only.upload.file', `You can only upload ${fileType} file!`, { type: fileType }));
    }

    const isLtM = file.size / 1024 / 1024 < maxSize;
    if (!isLtM) {
      message.error(getIntl(intl, 'base.file.must.smaller.than.num.mb', `File must smaller than ${maxSize}MB!`, { num: maxSize }));
    }
   
    this.setState({ loading: true });

    // console.log('beforeUpload', file);

    // console.log('beforeUpload isPass', isPass, isLtM, isPass && isLtM);
    return isPass && isLtM;
  };

  onChange = (info) => {
    const { status, response, name, uid  } = info.file;
    // console.log(status, info.file, info);

    let { fileList } = info;
    const { origin, onSuccessAfter } = this.props;

    // console.log(status, 'fileList:', fileList);
    fileList = fileList.filter((file) => {
      if (file.status) {
        return true
      }
      return false;
    });

    // console.log(status, 'fileList:', fileList);

    fileList = fileList.map((file) => {
      if (file.response) {
        const url = `${origin}/${file.response.key}`
        file.url = `${url}?attname=${file.name}`;
      }
      return file;
    });

    // console.log(status, 'fileList:', fileList);
    if (status === 'done') {
      if (onSuccessAfter) {
        onSuccessAfter({
          uuid: uid,
          title: name,
          ret: response,
        })
      }
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
    this.setState({ fileList });
  }

  render() {
    const { fileList } = this.state;
    const { maxSize = defaultSize, fileType = defaultFileType } = this.props;
    const fileTypeText = fileType.split('|').join(', ')
    const { extra = (
      <Fragment>
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">{getIntl(intl, 'base.upload.tips1', 'Click or drag file to this area to upload')}</p>
        <p className="ant-upload-hint">{getIntl(intl, 'base.upload.tips2', `You can upload ${fileTypeText} • ${maxSize}MB file limit .`, {maxSize, fileType: fileTypeText})}</p>
      </Fragment>
    ) } = this.props;
    const props = {
      name: 'file',
      multiple: true,
      action: 'https://upload-z2.qiniup.com',
      beforeUpload: this.beforeUpload,
      onChange: this.onChange
    };

    return (
      <div className={styles.normal}>
        <Dragger 
          {...props} 
          {...this.props}
          fileList={fileList}
        >
          {extra}
        </Dragger>
      </div>
    )
  }
}



export default UploadDiv;