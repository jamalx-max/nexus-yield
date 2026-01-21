import { AppConfig, UserSession } from '@stacks/connect';
import { APP_INFO, CHAIN_CONFIG } from './constants';

export const appConfig = new AppConfig(['store_write', 'publish_data']);

export const userSession = new UserSession({ appConfig });

export const stacksAuthOptions = {
  appDetails: {
    name: APP_INFO.name,
    icon: window.location.origin + APP_INFO.icon,
  },
  redirectTo: '/',
  onFinish: () => {
    window.location.reload();
  },
  userSession,
};

export const getStacksNetwork = () => {
  return CHAIN_CONFIG.stacks.network;
};
