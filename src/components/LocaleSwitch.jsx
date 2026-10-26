import React from 'react';
import { useLocale } from '../context/LocaleContext';

export function LocaleSwitch() {
  const { locale, toggleLocale } = useLocale();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={locale === 'en'}
      aria-label="Toggle Language"
      title="Toggle Language"
      className="toggle-locale locale-switch"
      data-locale={locale}
      onClick={toggleLocale}
    >
      <span className="locale-switch__thumb" aria-hidden="true" />
      <span className={`locale-switch__opt${locale === 'id' ? ' is-active' : ''}`}>ID</span>
      <span className={`locale-switch__opt${locale === 'en' ? ' is-active' : ''}`}>EN</span>
    </button>
  );
}
