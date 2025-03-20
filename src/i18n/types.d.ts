import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: {
        common: {
          continue: string;
          or: string;
          error: string;
          appName: string;
          loading: string;
          cancel: string;
          save: string;
          delete: string;
          edit: string;
          confirm: string;
          from: string;
        };
        home: {
          title: string;
          family: {
            title: string;
            description: string;
          };
          popular: {
            title: string;
            subtitle: string;
          };
          recent: {
            title: string;
          };
          categories: {
            title: string;
          };
          common: {
            exploreAll: string;
          };
        };
      };
    };
  }
}
