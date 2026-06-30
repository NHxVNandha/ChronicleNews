import { apiClient } from './apiClient';

export type PublicSiteSettings = {
  brandName: string;
  aboutHeadline: string;
  aboutSummary: string;
  missionTitle: string;
  missionBody: string;
  missionBodySecondary: string;
  editorialDeskSummary: string;
  contactHeading: string;
  contactSummary: string;
  editorialEmail: string;
  secureTipLine: string;
  headquartersAddress: string;
};

export async function getPublicSiteSettings() {
  return apiClient<PublicSiteSettings>('/api/public-site/settings');
}
