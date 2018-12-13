
import { xxxPhoneList, bindPhone, unbindPhone } from '@/services/api';
import { message} from 'antd';
import intl from 'react-intl-universal';

export default {
  namespace: 'phoneBind',

  state: {
    list: [],
    visible: false,
  },

  reducers: {
    fetchList(state, { payload: { list, visible = false }}) {
      return { ...state, list, visible };
    },
   
    fetchVisible(state, { payload: { visible }}) {
      return { ...state, visible };
    }
  },

  effects: {
    *change({ payload }, { put }) {
      yield put({ type: 'fetchVisible', payload: { visible: payload } });
    },
    
    *fetch({ payload: { visible } }, { call, put }) {
      const { data: list } = yield call(xxxPhoneList, {});
      yield put({ type: 'fetchList', payload: { list, visible } });
    },

    *bind({ payload: { sendMobile: phone, captcha } }, { call, put }){
      const { data: { errSms = '', succeed } } = yield call(bindPhone, { phone, captcha } );
      if (succeed) {
        message.success(intl.get('succeed'));
      } else if (errSms) {
        message.error(intl.get(errSms));
      }
      yield put({ type: 'fetch', payload: {} });
    },

    *unbind({ payload: { phone } }, { call, put }){
      const { data: { succeed, errSms }}  = JSON.parse(yield call(unbindPhone, phone));
      if (succeed) {
        message.success(intl.get('succeed'));
      } else if (errSms) {
        message.error(intl.get(errSms));
      }
      yield put({ type: 'fetch', payload: { visible: !succeed } });
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname }) => {
        if (pathname === '/setting') {
          dispatch({ type: 'fetch', payload: {} })
        }
      });
    },
  },

}