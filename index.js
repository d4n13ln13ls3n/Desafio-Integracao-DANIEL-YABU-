import { google } from 'googleapis'
import hubspot from '@hubspot/api-client'

const sheets = google.sheets({
  version: 'v4',
  auth: process.env.GOOGLE_API_KEY
})

const hubspotClient = new hubspot.Client({ accessToken: process.env.HUBSPOT_API_KEY })

async function listContactsFromGoogleSheets (spreadsheetId, sheetName) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: [sheetName]
    })

    return response.data.values
  } catch (err) {
    console.error(err)
  }
}

function parseSheetValues (values) {
  const headers = ['company', 'firstname', 'email', 'phone', 'website']
  const valuesWithoutHeaders = values.slice(1)
  return valuesWithoutHeaders.map((value) =>
    headers.reduce(
      (acc, header, index) => ({ ...acc, [header]: value[index] }),
      {}
    )
  )
}

async function postContactsFromGoogleSheets (contacts) {
  contacts.forEach((contact) => {
    const index = contact.email.indexOf('@')
    const emailDomain = contact.email
      .slice(index + 1, contact.email.length)
      .split('.')[0]
    const commercialDomains = ['yahoo', 'hotmail', 'gmail', 'apple', 'outlook']
    const isCommercial = commercialDomains.some(
      (domain) => domain === emailDomain
    )
    if (isCommercial) {
      throw new Error('Email must be corporate')
    }
  })

  try {
    const inputs = contacts.map((contact) => ({ properties: contact }))
    await hubspotClient.crm.contacts.batchApi.create({ inputs })
  } catch (e) {
    e.message === 'HTTP request failed'
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e)
  }
}

async function run () {
  const [spreadsheetId, sheetName] = process.argv.slice(2)
  if (!spreadsheetId) {
    throw new Error('Missing required argument spreadsheetId')
  }
  if (!sheetName) {
    throw new Error('Missing required argument sheetname')
  }
  const contacts = await listContactsFromGoogleSheets(
    spreadsheetId, sheetName
  )
  const parsedContacts = parseSheetValues(contacts)

  await postContactsFromGoogleSheets(parsedContacts)
}

run()
