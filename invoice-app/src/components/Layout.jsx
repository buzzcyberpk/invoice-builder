import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`layout layout-side fixed-header ${isMenuOpen ? 'aside-overlay' : ''}`} id="b1-LayoutWrapper">
      <a className="skip-nav" href="#b1-MainContentWrapper">Skip to Content</a>

      {/* Sidebar Navigation */}
      <aside role="complementary" className="aside-navigation">
        <div id="b1-Navigation">
          <nav className="app-menu-content display-flex" role="navigation">
            <div className="header-logo ph">
              <div>
                {/* Logo Placeholder */}
                <h2 style={{ padding: '16px', margin: 0, color: 'var(--color-primary)' }}>XS Invoice</h2>
              </div>
            </div>

            <div className="app-menu-links" role="menubar" id="b2-PageLinks">
              <NavLink to="/" className={({ isActive }) => `ThemeGrid_MarginGutter ${isActive ? 'active' : ''}`}>
                <i className="icon fa fa-file-text fa-1x" style={{ width: '20px', textAlign: 'center' }}></i>
                <span style={{ marginLeft: '12px' }}>Invoices</span>
              </NavLink>

              <NavLink to="/clients" className={({ isActive }) => `margin-left-s ThemeGrid_MarginGutter ${isActive ? 'active' : ''}`}>
                <i className="icon fa fa-users fa-1x" style={{ width: '20px', textAlign: 'center' }}></i>
                <span style={{ marginLeft: '12px' }}>Clients</span>
              </NavLink>

              <NavLink to="/settings" className={({ isActive }) => `ThemeGrid_MarginGutter ${isActive ? 'active' : ''}`}>
                <i className="icon fa fa-cog fa-1x" style={{ width: '20px', textAlign: 'center' }}></i>
                <span style={{ marginLeft: '12px' }}>My settings</span>
              </NavLink>

              <div className="padding-left-m padding-right-m">
                <div className="padding-top-base padding-bottom-base">
                  <div className="separator separator-horizontal background-neutral-7"></div>
                </div>
              </div>

              <a href="https://freeinvoicebuilder.com/international-payments/" target="_blank" rel="noreferrer" className="ThemeGrid_MarginGutter">
                <i className="icon fa fa-credit-card-alt fa-1x" style={{ width: '20px', textAlign: 'center' }}></i>
                <span style={{ marginLeft: '12px' }}>International payments</span>
              </a>

              <a href="mailto:contact@freeinvoicebuilder.com" className="ThemeGrid_MarginGutter">
                <i className="icon fa fa-envelope fa-1x" style={{ width: '20px', textAlign: 'center' }}></i>
                <span style={{ marginLeft: '12px' }}>Contact us</span>
              </a>
            </div>

            <div className="app-login-info ph" id="b2-LoginInfo">
              <div className="user-info">
                <div>
                  <img className="img-circle" src="https://ui-avatars.com/api/?name=Xtreme+IT&background=0D8ABC&color=fff" alt="User" style={{ width: '24px', height: '24px' }} />
                  <div className="margin-left-s username-color">
                    <span>Xtreme IT Solution (SMC Private Ltd)</span>
                  </div>
                </div>
                <div className="margin-left-s" style={{ cursor: 'pointer' }} title="Logout">
                  <i className="icon fa fa-sign-out fa-1x"></i>
                </div>
              </div>
            </div>
          </nav>

          <div className="app-menu-overlay" role="button" onClick={toggleMenu} aria-label="Close menu" style={{ cursor: 'pointer', ...isMenuOpen ? { opacity: 1, pointerEvents: 'auto' } : {} }}></div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main">
        {/* Header */}
        <header role="banner" className="header" id="b1-Header3">
          <div className="ThemeGrid_Container">
            <div className="header-content display-flex">
              <div className="menu-icon" aria-label="Toggle the Menu" role="button" tabIndex="0" onClick={toggleMenu} style={{ cursor: 'pointer' }}>
                <div className="menu-icon-line" aria-hidden="true"></div>
                <div className="menu-icon-line" aria-hidden="true"></div>
                <div className="menu-icon-line" aria-hidden="true"></div>
              </div>
              <div className="header-navigation OSInline" id="b1-Header"></div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="content" id="b1-Content">
          <div className="main-content ThemeGrid_Container" role="main" id="b1-MainContentWrapper">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
