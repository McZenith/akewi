import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../../store';
import { View, ActivityIndicator } from 'react-native';

const LoadingComponent = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#C73D10" />
  </View>
);

// Redux store provider component with persist gate
const StoreProvider: React.FC<PropsWithChildren> = ({ children }) => {
  if (!store || !persistor) {
    return <LoadingComponent />;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingComponent />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default StoreProvider;
