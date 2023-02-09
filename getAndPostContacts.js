// const { google } = require('googleapis')
// import { google } from 'googleapis'

// const sheets = google.sheets({
//   version: 'v4',
//   auth: process.env.GOOGLE_API_KEY
// })

// async function getSheetValues (spreadsheetId, range) {
//   try {
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range
//     })

//     return response.data.values
//   } catch (err) {
//     console.error(err)
//   }
// }

// function parseSheetValues (values) {
//   const [headers] = values

//   return values
//     .slice(1)
//     .map((value) =>
//       headers.reduce(
//         (acc, header, index) => ({ ...acc, [header]: value[index] }),
//         {}
//       )
//     )
// }

// async function run () {
//   const sheetValues = await getSheetValues(
//     '1VTKNYBaxfuhEiydAUt7F64fAXMGlDVAMdxQu4sO1J3U',
//     'data'
//   )

//   const contacts = parseSheetValues(sheetValues)

//   console.log(contacts)
// }

// run()

// import { google } from 'googleapis'
// import hubspot from '@hubspot/api-client'
// const sheetId = '1lWfM4N7EXb6wyZ6IR0bsXftS_iv3fqA18Ea0dEcrHDg'
// const sheets = google.sheets({
//   version: 'v4',
//   auth: process.env.GOOGLE_API_KEY
// })
// const HUBSPOT_API_KEY = 'pat-na1-6977c199-c7be-4141-a1f1-a7b1ba27090f'
// const hubspotClient = new hubspot.Client({ accessToken: HUBSPOT_API_KEY })

// async function listContactsFromGoogleSheets (spreadsheetId) {
//   const request = {
//     spreadsheetId: sheetId,
//     ranges: ['customers'],
//     includeGridData: true
//   }

//   try {
//     const response = (await sheets.spreadsheets.get(request)).data
//     const dataRows = (response.sheets[0].data[0].rowData).map((row) => row.values)
//     const contactProperties = ['company', 'name', 'email', 'phone', 'website']
//     const sheetValues = []
//     dataRows.forEach((row) => {
//       const contact = {}
//       row.forEach((column, columnIndex) => {
//         const property = contactProperties[columnIndex]
//         contact[property] = column.formattedValue
//       })
//       sheetValues.push(contact)
//       console.log('sheet values:', sheetValues)
//     })
//     return sheetValues
//   } catch (err) {
//     console.error(err)
//   }
// }

// function parseSheetValues (values) {
//   const headers = values.shift()

//   return values.map((value) =>
//     headers.reduce(
//       (acc, header, index) => ({ ...acc, [header]: value[index] }),
//       {}
//     )
//   )
// }

// async function postContactsFromGoogleSheets (contacts) {
//   // console.log('CONTACTS:', contacts)
//   contacts.forEach((contact) => {
//     console.log('contact.email:', contact.email)
//     const index = contact.email.indexOf('@')
//     const emailDomain = contact.email.slice(index + 1, contact.email.length).split('.')[0]
//     const commercialDomains = ['yahoo', 'hotmail', 'gmail', 'apple', 'outlook']
//     const isCommercial = commercialDomains.some((domain) => domain === emailDomain)
//     if (isCommercial) {
//       throw new Error('Email must be corporate')
//     }
//   })

//   try {
//     const inputs = contacts.map((contact) => ({
//       properties: contact
//     }))
//     await hubspotClient.crm.contacts.batchApi.create({ inputs })
//   } catch (e) {
//     e.message === 'HTTP request failed'
//       ? console.error(JSON.stringify(e.response, null, 2))
//       : console.error(e)
//   }
// }

// async function run () {
//   const contacts = await listContactsFromGoogleSheets()
//   // const parsedContacts = parseSheetValues(contacts)
//   await postContactsFromGoogleSheets(contacts)
// }

// run()

import { google } from 'googleapis'
import hubspot from '@hubspot/api-client'

const sheets = google.sheets({
  version: 'v4',
  auth: process.env.GOOGLE_API_KEY
})

const HUBSPOT_API_KEY = 'pat-na1-6977c199-c7be-4141-a1f1-a7b1ba27090f'
const hubspotClient = new hubspot.Client({ accessToken: HUBSPOT_API_KEY })
// const sheetId = '1lWfM4N7EXb6wyZ6IR0bsXftS_iv3fqA18Ea0dEcrHDg'

async function listContactsFromGoogleSheets (spreadsheetId) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: ['customers']
    })

    return response.data.values
  } catch (err) {
    console.error(err)
  }
}

// async function listContactsFromGoogleSheets (spreadsheetId) {
//   const request = {
//     spreadsheetId: sheetId,
//     ranges: ['customers'],
//     includeGridData: true
//   }

//   try {
//     const response = (await sheets.spreadsheets.get(request)).data
//     const dataRows = (response.sheets[0].data[0].rowData).map((row) => row.values)
//     const contactProperties = ['company', 'name', 'email', 'phone', 'website']
//     const sheetValues = []
//     dataRows.forEach((row) => {
//       const contact = {}
//       row.forEach((column, columnIndex) => {
//         const property = contactProperties[columnIndex]
//         contact[property] = column.formattedValue
//       })
//       sheetValues.push(contact)
//     })
//     console.log('sheet values:', sheetValues)
//     return sheetValues
//   } catch (err) {
//     console.error(err)
//   }
// }

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
  console.log('CONTACTS:', contacts)
  contacts.forEach((contact) => {
    console.log('contact:', contact)
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
    console.log('INPUTS:', inputs)
    await hubspotClient.crm.contacts.batchApi.create({ inputs })
  } catch (e) {
    e.message === 'HTTP request failed'
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e)
  }
}

async function run () {
  const contacts = await listContactsFromGoogleSheets(
    '1lWfM4N7EXb6wyZ6IR0bsXftS_iv3fqA18Ea0dEcrHDg'
  )
  // console.log('CONTACTS:', contacts)
  const parsedContacts = parseSheetValues(contacts)

  // console.log('parsedContacts', JSON.stringify(parsedContacts, null, 2))

  await postContactsFromGoogleSheets(parsedContacts)
}

run()
