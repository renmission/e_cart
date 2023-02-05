import React, { createContext, Component } from 'react';

export const LocaleContext = createContext({
  locale: 'en',
  toggleLocale: () => {
    console.error('Please wrap LocaleProvider to use this functionality');
  },
});

export default class LocaleProvider extends Component {
  state = {
    locale: 'fr',
  };

  toggleLocale = () => {
    this.setState(({ locale }) => ({
      locale: locale === 'fr' ? 'en' : 'fr',
    }));
  };

  render() {
    const { children } = this.props;
    const { locale } = this.state;

    return (
      <LocaleContext.Provider
        value={{
          locale,
          toggleLocale: this.toggleLocale,
        }}
      >
        {children}
      </LocaleContext.Provider>
    );
  }
}
