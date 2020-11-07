const puppeteer = require('puppeteer');
const config = require('./config');
const {
  selectOptionByLabel,
  hackReCaptcha,
  sendMailReport
} = require('./helpers');
const {selectors: sel, messages: msg} = config;
const {log} = console;
const REPORT_INTERVAL = 60 // Send report every {REPORT_INTERVAL} failures
let failureReports = []

let uniqueBrowserInstance
const getBrowser = async (config) => {
  if(!uniqueBrowserInstance) {
    uniqueBrowserInstance = puppeteer.launch(config.puppeteer)
  }
  return uniqueBrowserInstance
}

const executeTask = async ({provinceValue, requestValue, person}) => {
  const browser = await getBrowser(config)
  const page = await browser.newPage();
  await page.setDefaultTimeout(5000);
  await page.goto(config.url);
  await page.setViewport({ width: 1920, height: 1080});

  log('Choose province and click "accept"')
  await selectOptionByLabel(page, sel.PROVINCE, provinceValue)
  await page.click(sel.ACCEPT)

  log('Choose request type and click "accept"')
  await selectOptionByLabel(page, sel.REQUEST, requestValue)
  await page.click(sel.ACCEPT)

  log('Click "enter"')
  await page.waitForSelector(sel.CONFIRM_REQUEST)
  await page.click(sel.CONFIRM_REQUEST)

  log('Fill in person\'s info and click "accept"')
  await page.waitForSelector(sel.DOCUMENT)

  await page.waitFor(500)
  await page.click(sel.DOCUMENT)
  await page.focus(sel.DOCUMENT_NUMBER)
  await page.keyboard.type(person.documentNumber)
  await page.focus(sel.NAME)
  await page.keyboard.type(person.name)
  await selectOptionByLabel(page, sel.NATIONALITY, sel.NATIONALITY_VALUE)
  //await hackReCaptcha(page)
  log('Click send button')
  await page.click(sel.SEND)
  await page.click(sel.SEND)
  await page.click(sel.SEND)

  let noAppointments
  try {
    await page.waitForSelector(sel.MESSAGE_TABLE, {timeout: 5000})
    const content = await page.content()
    if (!content.includes(msg.NO_APPOINTMENTS_MSG)) {
      throw new Error(`Missing message "${msg.NO_APPOINTMENTS_MSG}"`)
    } else {
      noAppointments = true
    }
  } catch (err) {
    noAppointments = false
  }

  if(noAppointments) {
    log( 'FAILURE: No appointments available')
  } else {
    log(`Missing message "${msg.NO_APPOINTMENTS_MSG}"`)
    log( 'SUCCESS: Appointments available')
    await sendMailReport(page, person.email, 'SUCCESS: Appointments available')
  }

  await page.close()
}

module.exports = executeTask
