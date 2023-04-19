import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { ReactComponent as IconSettings } from 'assets/icons/settings.svg';
import { ReactComponent as IconHome } from 'assets/icons/home.svg';
import { ReactComponent as IconSaved } from 'assets/icons/saved.svg';

import './Sidebar.scss';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import SideBarLink from './SidebarLink';

const Sidebar = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.user);
  const [sideBarShown, setSideBarShown] = useState(false);

  const toggleSideBar = () => {
    setSideBarShown(prevState => !prevState);
  };

  const sideBarLinks = [
    {
      id: 1,
      label: t('label.home'),
      icon: IconHome,
      toPage: '/',
    },
    {
      id: 2,
      label: t('label.settings'),
      icon: IconSettings,
      toPage: '/settings',
    },
    {
      id: 3,
      label: t('label.saved'),
      icon: IconSaved,
      toPage: '/saved',
    },
  ];

  const sideBarClasses = `sidebar ${
    user.isAuthenticated ? '' : 'sidebar--hidden'
  } ${sideBarShown ? 'sidebar--hover__effect' : ''}`;

  return (
    <section className={sideBarClasses} onClick={toggleSideBar}>
      <ul className="sidebar__list">
        {sideBarLinks.map(link => (
          <SideBarLink key={link.id} {...link} />
        ))}
      </ul>
    </section>
  );
};

export default Sidebar;