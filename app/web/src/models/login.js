
import { logout, getSystemPath } from '@/services/base';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { routerRedux } from 'dva/router';
import { LS, getPageQuery } from '@/utils';
import { stringify } from 'qs';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  reducers: {
    changeLoginStatus(state, { payload: { currentAuthority, status, type} }) {
      setAuthority(currentAuthority);
      return { ...state, status, type };
    },
  },

  effects: {
    *login({ payload }, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload,
      });
      LS.setItem('U_token', payload.token)
      reloadAuthorized();

      let { redirect } = payload
      if (!redirect){
        const params = getPageQuery();
        const { redirect: url } = params
        redirect = url;
      } 
      
      if (redirect) {
        redirect = decodeURIComponent(redirect);
        try {
          const urlParams = new URL(window.location.href);
          const redirectUrlParams = new URL(redirect);
          // 判断是否同域
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            if (redirect.indexOf('?') > 0) {
              if (redirect.indexOf('utoken=') < 0) {
                redirect = `${redirect}&utoken=${payload.token}`
              }
            } else {
              redirect = `${redirect}?utoken=${payload.token}`
            }
            window.location.href = redirect;
            return;
          }
        } catch (error) {
          console.error('login model effects login', error)
        }
        
      }
      yield put({
        type: 'user/fetchCurrent',
      });
      yield put(routerRedux.replace(redirect || '/'));
    },

    *logout(_, { put, call }) {
      yield call(logout);

      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      yield put({
        type: 'user/saveCurrentUser',
        payload: {},
      });
      LS.removeItem('U_token');
      reloadAuthorized();

      const { data } = yield call(getSystemPath, 'loginweb');
      window.location.href = `${data}/user/login?${stringify({redirect: window.location.href})}`
    },

  },

  // subscriptions: {
  //   setup({ dispatch, history }) {
  //     return history.listen(({ pathname, query }) => {
  //       console.log('setup', pathname, query, pathname === '/user/login', dispatch)
  //       if (pathname === '/user/login') {
  //         const { code, state } = query;
  //         console.log('code, state', code, state, state === 'webapp')
  //         if (code && state && state === 'webapp') {
  //           console.log('dispatch: wechatLogin/webappLogin')
  //           // 微信扫码登录
  //           dispatch({
  //             type: 'wechatLogin/webappLogin',
  //             payload: { code }
  //           })
  //         } else if (code){
  //           console.log('dispatch: wechatLogin/login')
  //           // 微信内的点击登录
  //           dispatch({
  //             type: 'wechatLogin/login',
  //             payload: { code }
  //           })
  //         }
  //       }
  //     });
  //   }
  // }


}