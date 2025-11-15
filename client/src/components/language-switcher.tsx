import { useTranslation } from 'react-i18next';
import type { ChangeEvent } from 'react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const languageCode = e.target.value;
    i18n.changeLanguage(languageCode);
  };

  return (
    <select
      value={i18n.language}
      onChange={handleLanguageChange}
      className="language-selector"
      data-testid="select-language"
    >
      <option value="en">English</option>
      <option value="ha">Hausa</option>
      <option value="yo">Yoruba</option>
      <option value="ig">Igbo</option>
    </select>
  );
}
