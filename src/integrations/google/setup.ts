import { GoogleConfig, defaultGoogleConfig } from '../../types/integrations/google'
import { updateConfig, getConfig } from '../../common/config'
import prompts from 'prompts'
import { IntegrationId } from '../../types/integrations'
import open from 'open'
import { GoogleIntegration } from './googleIntegration'
import { logInfo, logError } from '../../common/logging'

export default async () => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(
                '\nThis script will walk you through setting up the Google Sheets integration. Follow these steps:'
            )
            console.log('\n\t1. Create a new Google Sheet (https://sheets.new)')
            console.log('\t2. Follow the guide here: https://developers.google.com/workspace/guides/create-credentials#desktop-app')
            console.log(`\t3. Make sure your app's Publishing Status is 'Testing', and add your Gmail account you wish to use as a Test User here: https://console.cloud.google.com/apis/credentials/consent`)
            console.log('\t4. Answer the following questions:\n')

            const credentials = await prompts([
                {
                    type: 'text',
                    name: 'name',
                    message: 'What would you like to call this integration?',
                    initial: 'Google Sheets',
                    validate: (s: string) =>
                        0 < s.length && s.length <= 64 ? true : 'Must be between 0 and 64 characters in length.'
                },
                {
                    type: 'text',
                    name: 'keyFile',
                    message: 'keyFile JSON Path'
                },
                {
                    type: 'text',
                    name: 'documentId',
                    message:
                        'Document ID (From the sheet you just created: https://docs.google.com/spreadsheets/d/DOCUMENT_ID/edit)',
                    validate: (s: string) => (s.length >= 8 ? true : 'Must be at least 8 characters in length.')
                }
            ])

            updateConfig(config => {
                let googleConfig = (config.integrations[IntegrationId.Google] as GoogleConfig) || defaultGoogleConfig

                googleConfig.name = credentials.name
                googleConfig.documentId = credentials.documentId
                googleConfig.credentials.keyFile = credentials.keyFile

                config.integrations[IntegrationId.Google] = googleConfig

                config.transactions.integration = IntegrationId.Google
                config.balances.integration = IntegrationId.Google

                return config
            })

            /*const google = new GoogleIntegration(getConfig())*/

            logInfo('Successfully set up Google Integration.')
            return resolve()
        } catch (e) {
            logError('Unable to set up Google Integration.', e)
            return reject()
        }
    })
}
