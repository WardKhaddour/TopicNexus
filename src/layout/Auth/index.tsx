import { useRoutes } from 'react-router-dom';
import routes from '../../modules/auth/routes';
import logo from '../../assets/img/logo.svg';

const AuthModuleLayout = () => {
  const element = useRoutes(routes);

  return (
    <section className="auth-layout">
      <div className="auth-layout__logo">
        <img src={logo} className="App-logo" alt="logo" />{' '}
      </div>
      <div className="auth-layout__content auth-content">{element}</div>
    </section>
  );
};

export default AuthModuleLayout;
