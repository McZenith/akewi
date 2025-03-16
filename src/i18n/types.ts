import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: {
        common: {
          continue: string;
          or: string;
        };
        auth: {
          description: string;
          input: {
            placeholder: {
              default: string;
              email: string;
              phone: string;
            };
          };
          social: {
            google: string;
            apple: string;
          };
        };
        language: {
          select: string;
          english: string;
          yoruba: string;
        };
      };
    };
  }
}
