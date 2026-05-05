import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.programmingtools.suite',
  appName: 'Programming Tools Suite',
  webDir: '.',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#667eea',
      androidSplashResourceName: 'splash',
      iosSplashResourceName: 'splash'
    }
  },
  android: {
    path: 'android',
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: 'APK'
    }
  },
  ios: {
    path: 'ios',
    scheme: 'Programming Tools Suite'
  }
};

export default config;
