import { BaseIntegrationConfig, IntegrationId, IntegrationType } from '../integrations'

export interface GoogleTemplateSheetSettings {
  documentId: string
  sheetTitle: string
}

export interface GoogleCredentials {
  keyFile: string
  
  scope?: string[]
}

export interface GoogleConfig extends BaseIntegrationConfig {
  id: IntegrationId.Google
  type: IntegrationType.Export

  credentials: GoogleCredentials
  documentId: string
  
  dateFormat?: string

  template?: GoogleTemplateSheetSettings
}

export const defaultGoogleConfig: GoogleConfig = {
  name: '',
  id: IntegrationId.Google,
  type: IntegrationType.Export,

  credentials: {
    keyFile: '',
    scope: ['https://www.googleapis.com/auth/spreadsheets'],
  },
  documentId: ''
}
