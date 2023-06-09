import { useSelector } from 'react-redux';
import { RootState } from 'store';
import LoadingSpinner from 'components/LoadingSpinner';
import ConfirmEmail from '../components/ConfirmEmail';

import UpdateUserData from '../components/UpdateUserData';
import UpdatePassword from '../components/UpdatePassword';
import DeleteUser from '../components/DeleteUser';
import UpdatePhoto from '../components/UpdatePhoto';
import './Settings.scss';

const Settings = () => {
  const { isLoading } = useSelector((state: RootState) => state.user);

  const { emailIsConfirmed } = useSelector(
    (state: RootState) => state.user.user
  );

  return (
    <div className="settings">
      <LoadingSpinner loading={isLoading} />
      <section className="sections-data">
        {!emailIsConfirmed && <ConfirmEmail />}
        {!emailIsConfirmed && (
          <div className="settings__separator settings__separator--photo"></div>
        )}

        <UpdateUserData />
        <div className="settings__separator"></div>
        <UpdatePassword />
        <div className="settings__separator"></div>
        <DeleteUser />
      </section>

      <section className="section-photo">
        <UpdatePhoto />
        <div className="settings__separator"></div>
      </section>
    </div>
  );
};

export default Settings;
