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
          yes: string;
          no: string;
          play: string;
          pause: string;
          voice: {
            activate: string;
          };
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
          errors: {
            unexpected: string;
            notFound: string;
            invalid: string;
            googleFailed: string;
            appleFailed: string;
            emptyInput: string;
            invalidEmail: string;
            invalidPhone: string;
            invalidInput: string;
          };
        };
        language: {
          select: string;
          english: string;
          yoruba: string;
          change: string;
        };
        userDetails: {
          title: string;
          subtitle: string;
          description: string;
          name: string;
          state: string;
          selectState: string;
          town: string;
          family: string;
          errors: {
            saveFailed: string;
            invalidInput: string;
          };
        };
        states: {
          osun: string;
          ondo: string;
          kwara: string;
          kogi: string;
          oyo: string;
          lagos: string;
          ogun: string;
          edo: string;
          diaspora: string;
        };
        validation: {
          required: string;
          invalid: string;
          tooShort: string;
          tooLong: string;
        };
      };
    };
  }
}
