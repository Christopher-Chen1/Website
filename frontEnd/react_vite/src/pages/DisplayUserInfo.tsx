import { useNavigate } from 'react-router-dom';
import './DisplayUserInfo.css';
export const DisplayUserInfo = ({userInfo}: {userInfo: {[key: string]: string}}) => {
  const naviagte = useNavigate();

  const logout = () => {
    // logout is simply navigating to Home component which will clear sessionStorage
    naviagte('/login');
  };

  return (
    <>
      <div className="dds__d-flex dds__justify-content-between dds__mb-3">
        <p>
          You are now logged in. The <i>/userInfo</i> endpoint was called with
          the access token.
        </p>
        <div>
          <button className="dds__button dds__button--md" onClick={logout}>
            Logout{' '}
            <span className="dds__ml-2 dds__icon dds__icon--log-out"></span>
          </button>
        </div>
      </div>
      <table className="dds__table dds__table--sticky-header">
        <thead className="dds__thead">
          <tr className="dds__tr">
            <th className="dds__th">Property</th>
            <th className="dds__th">Value</th>
          </tr>
        </thead>
        <tbody className="dds__tbody">
        {Object.keys(userInfo as { [key: string]: string }).map((k) => {
  return (
    <tr key={k} className="dds__tr">  {/* 使用 k 作为唯一的 key */}
      <td className="dds__td">
        {k}
      </td>
      <td className="dds__td">
        {userInfo && userInfo[k]}
      </td>
    </tr>
  );
})}

        </tbody>
      </table>
    </>
  );
};
