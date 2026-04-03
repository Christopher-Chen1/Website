import { useEffect, useState } from 'react';
import {
  AuthorizationRequest,
  AuthorizationServiceConfiguration,
  RedirectRequestHandler,
  FetchRequestor,
  DefaultCrypto,
  LocalStorageBackend,
} from '@openid/appauth';
import { environment } from '../environment';
import { NoHashQueryStringUtils } from '../noHashQueryUtil';
import './Login.css';

export const Login = () => {
  const [error, setError] = useState(null);

  const redirect = () => {
    AuthorizationServiceConfiguration.fetchFromIssuer(environment.OPServer, new FetchRequestor())
      .then((response) => {
        const authRequest = new AuthorizationRequest({
          client_id: environment.clientId,
          redirect_uri: environment.redirectURL,
          scope: environment.scope,
          response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
          state: undefined,
        });
        const handler = new RedirectRequestHandler(
          new LocalStorageBackend(),
          new NoHashQueryStringUtils(),
          window.location,
          new DefaultCrypto()
        );
        handler.performAuthorizationRequest(response, authRequest);
      })
      .catch((error) => {
        setError(error);
      });
  };

  
  useEffect(() => {
    redirect();
  }, []);

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <p>Redirecting to login...</p> 
      )}
    </div>
  );
};