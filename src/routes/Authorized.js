import React from 'react';
import Authorized from '@/components/Authorized';
import { getAuthority } from '@/utils/authority';
import Redirect from 'umi/redirect';
import { stringify } from 'qs';
import ToLogin from '@/pages/Exception/ToLogin'

const Authority = getAuthority();
const AuthorizedDiv = Authorized(Authority);

const getUrl = () =>
  `/Exception/403?${stringify({ redirect: encodeURIComponent(window.location.href) })}`;

const noMatch = (
  <AuthorizedDiv authority='logined' noMatch={<ToLogin />}>
    <Redirect to={getUrl()} />
  </AuthorizedDiv>
)

export default ({ children }) => (
  <AuthorizedDiv authority={children.props.route.authority} noMatch={noMatch}>
    {children}
  </AuthorizedDiv>
);
