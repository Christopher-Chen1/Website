import {
  AuthorizationNotifier,
  AuthorizationServiceConfiguration,
  BaseTokenRequestHandler,
  DefaultCrypto,
  FetchRequestor,
  GRANT_TYPE_AUTHORIZATION_CODE,
  GRANT_TYPE_REFRESH_TOKEN,
  LocalStorageBackend,
  RedirectRequestHandler,
  StringMap,
  TokenRequest,
} from '@openid/appauth';
import { useEffect, useState } from 'react';
import { environment } from '../environment';
import { NoHashQueryStringUtils } from '../noHashQueryUtil';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserStore } from '../store/userStore'; // 导入 Zustand store
import { authorizedUsers } from '../config/permissions';

export const Callback = () => {
  const [error, setError] = useState<any>(null);
  const [code, setCode] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUserInfo } = useUserStore(); // 使用 Zustand store 更新用户信息

  useEffect(() => {
    const tokenHandler = new BaseTokenRequestHandler(new FetchRequestor());
    const authorizationHandler = new RedirectRequestHandler(
      new LocalStorageBackend(),
      new NoHashQueryStringUtils(),
      window.location,
      new DefaultCrypto()
    );

    // Setup notifier which will trigger when authorization is complete
    const notifier = new AuthorizationNotifier();
    authorizationHandler.setAuthorizationNotifier(notifier);

    notifier.setAuthorizationListener((request, response, error) => {
      if (response) {
        // Authorization is complete, now perform token request
        let extras: StringMap | undefined = undefined;
        if (request && request.internal) {
          extras = {};
          extras.code_verifier = request.internal.code_verifier;
        }
        let configuration: AuthorizationServiceConfiguration;

        // Prepare request for token
        const tokenRequest = new TokenRequest({
          client_id: environment.clientId,
          redirect_uri: environment.redirectURL,
          grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
          code: response.code,
          refresh_token: sessionStorage.getItem('refresh_token') ?? '',
          extras,
        });

        // Fetch configuration from the issuer and perform token request
        AuthorizationServiceConfiguration.fetchFromIssuer(
          environment.OPServer,
          new FetchRequestor()
        )
          .then((oResponse) => {
            configuration = oResponse;
            return tokenHandler.performTokenRequest(configuration, tokenRequest);
          })
          .then(({ accessToken, idToken, refreshToken, expiresIn }) => {
            // Save token and related data to sessionStorage
            saveTokenDataToStorage(
              accessToken,
              idToken,
              refreshToken,
              expiresIn
            );

            // Now that we have the token, fetch user info
            fetchUserInfo(accessToken);

            // Intercept API requests to manage access token expiry and refresh
            axios.interceptors.request.use(
              async (config) => {
                const refreshTokenRequest = new TokenRequest({
                  client_id: environment.clientId,
                  redirect_uri: environment.redirectURL,
                  grant_type: GRANT_TYPE_REFRESH_TOKEN,
                  refresh_token: sessionStorage.getItem('refresh_token') ?? '',
                  extras,
                });

                const accessTokenExpiryTime = Number(
                  sessionStorage.getItem('access_token_expiry')
                );
                const presentTime = Date.now();
                const twoMinutes = 120000;

                if (accessTokenExpiryTime - presentTime <= twoMinutes) {
                  const refreshTokenRes = await tokenHandler.performTokenRequest(
                    configuration,
                    refreshTokenRequest
                  );
                  saveTokenDataToStorage(
                    refreshTokenRes.accessToken,
                    refreshTokenRes.idToken,
                    refreshTokenRes.refreshToken,
                    refreshTokenRes.expiresIn
                  );
                }
                config.headers.Authorization = `Bearer ${sessionStorage.getItem(
                  'access_token'
                )}`;
                return config;
              },
              (error) => {
                alert(
                  'Your session has expired. Please refresh the page or navigate to http://localhost:3000'
                );
                return Promise.reject(error);
              }
            );
            navigate('/'); // Navigate to the main page (profile or home)
          })
          .catch((err) => {
            setError(err);
          });
      }
    });

    // Extract the authorization code from the URL
    const params = new URLSearchParams(window.location.search);
    setCode(params.get('code'));

    if (!code) {
      setError('Unable to get authorization code');
      return;
    }
    authorizationHandler.completeAuthorizationRequestIfPossible();
  }, [navigate, code]);

  // Function to save token data to sessionStorage
  const saveTokenDataToStorage = (
    accessToken: string,
    idToken = '',
    refreshToken = '',
    expiresIn = 0
  ) => {
    sessionStorage.setItem('access_token', accessToken);
    sessionStorage.setItem('id_token', idToken);
    sessionStorage.setItem('refresh_token', refreshToken);
    sessionStorage.setItem('access_token_expiry', `${Date.now() + expiresIn * 1000}`);
  };

  
  

  // Fetch user info based on the access token
  const fetchUserInfo = async (accessToken: string) => {
    try {
      const response = await axios.get(`${environment.OPServer}${environment.userInfoEndpoint}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const rawUserInfo = response.data;
  
      const userInfo = {
        ...rawUserInfo,
        username: rawUserInfo.account_alias_name?.toLowerCase(),
      };
  
      // console.log('🟡 Raw fetched userInfo:', rawUserInfo);
      // console.log('🟢 Normalized username:', userInfo.username);
      // console.log('🟣 Authorized users list:', authorizedUsers);

      
  
      setUserInfo(userInfo);
      // console.log('🔵 Zustand store userInfo:', useUserStore.getState().userInfo);
    } catch (error) {
      setError('Failed to fetch user info');
      // console.error('🔴 Fetch user info failed:', error);
    }
  };

  return code ? (
    <h5>Please wait while we authenticate you...</h5>
  ) : (
    <p>{error}</p>
  );
};
