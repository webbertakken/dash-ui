import accessUrl from '../logos/access.svg';
import connectUrl from '../logos/connect.svg';
import driveUrl from '../logos/drive.svg';
import networkUrl from '../logos/network.svg';
import protectUrl from '../logos/protect.svg';
import sitemanagerUrl from '../logos/sitemanager.svg';
import talkUrl from '../logos/talk.svg';
import dash-uiMarkUrl from '../logos/dash-ui-mark.svg';
import dash-uiWordmarkUrl from '../logos/dash-ui-wordmark.svg';

export const appLogos = {
  access: accessUrl,
  connect: connectUrl,
  drive: driveUrl,
  network: networkUrl,
  protect: protectUrl,
  sitemanager: sitemanagerUrl,
  talk: talkUrl,
} as const;

export const brand = {
  mark: dash-uiMarkUrl,
  wordmark: dash-uiWordmarkUrl,
} as const;

export type AppLogo = keyof typeof appLogos;
