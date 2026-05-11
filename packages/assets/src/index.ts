import agentsUrl from '../logos/agents.svg';
import instancesUrl from '../logos/instances.svg';
import systemUrl from '../logos/system.svg';
import dashUiMarkUrl from '../logos/dash-ui-mark.svg';
import dashUiWordmarkUrl from '../logos/dash-ui-wordmark.svg';

export const appLogos = {
  agents: agentsUrl,
  instances: instancesUrl,
  system: systemUrl,
} as const;

export type AppLogoKey = keyof typeof appLogos;

export const logos = {
  mark: dashUiMarkUrl,
  wordmark: dashUiWordmarkUrl,
} as const;
