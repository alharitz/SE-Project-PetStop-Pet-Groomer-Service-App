import '@testing-library/jest-native/extend-expect';

import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-firebase/auth', () => {
  return {
    auth: jest.fn(() => ({
      signInWithEmailAndPassword: jest.fn(),
    })),
  };
});

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
