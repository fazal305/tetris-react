import { useCallback, useEffect, useState } from 'react';
import { loadSettings, saveSettings, resetSettings as resetStoredSettings } from '../services/storage';
import { applyTheme } from '../data/themes';
import { setSoundEnabled } from '../services/audio';

export function useGameSettings() {
  const [settings, setSettings] = useState(() => loadSettings());

  useEffect(() => {
    applyTheme(settings.theme);
    setSoundEnabled(settings.soundOn);
  }, [settings.theme, settings.soundOn]);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      saveSettings(next);
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    const defaults = resetStoredSettings();
    setSettings(defaults);
  }, []);

  return { settings, updateSetting, resetSettings };
}
