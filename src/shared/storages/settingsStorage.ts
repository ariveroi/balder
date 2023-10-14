import {
  BaseStorage,
  createStorage,
  StorageType,
} from "@src/shared/storages/base";

type Settings = {
  language: Language;
  quipId: string;
  quipToken: string;
};

type Language = {
  label: string;
  value: string;
};

type SettingsStorage = BaseStorage<Settings> & {
  setStorage: (options: Settings) => void;
};

const storage = createStorage<Settings>(
  "settings",
  {
    language: {
      label: "Español",
      value: "es",
    },
    quipId: "",
    quipToken: "",
  },
  { storageType: StorageType.Local }
);

const settingsStorage: SettingsStorage = {
  ...storage,
  setStorage: (options) => {
    storage.set((currentSettings) => {
      return {
        language: options.language || currentSettings.language,
        quipId: options.quipId || currentSettings.quipId,
        quipToken: options.quipToken || currentSettings.quipToken,
      };
    });
  },
};

export default settingsStorage;
