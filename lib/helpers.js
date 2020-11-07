const nodemailer = require('nodemailer')
const fs = require('fs')
const nanoid = require('nanoid')





const sendMailReport = async (page, to, subject, content) => {



  let transporter = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 465,
    secure: true, //ssl
    auth: {
            user:process.env.CITA_EMAIL,
            pass:process.env.CITA_EMAIL_PASS
    }
});


  const id = nanoid.nanoid(5)

  const screenshotPath = `./.screenshots/${id}.png`

  const mailOptions = {
     from: '"Me"', to, subject, html: content || subject
  }

  if(page) {
    await page.screenshot({path: screenshotPath})
    const content = await page.content()
    mailOptions.attachments = [
      { filename: 'screenshot.png', path: screenshotPath },
      { filename: 'page.html', content }
    ]
  }

   // send mail with defined transport object
   let info = await transporter.sendMail(mailOptions);
   console.log(info)

  if(!page) {
    return Promise.resolve()
  } else {
    return new Promise((resolve, reject) => {
      fs.unlink(screenshotPath, (err) => {
        err ? reject(err) : resolve()
      })
    })
  }
}

const selectOptionByLabel = async (page, selector, value) => {
  await page.waitForSelector(selector)
  return page.evaluate((selector, value) => {
    let select = document.querySelectorAll(selector)[0]
    let options = select.options
    let filteredOptions = Array
      .from(options)
      .filter(option => option.innerText.includes(value))
    select.selectedIndex = filteredOptions[0].index
  }, selector, value)
}

const hackReCaptcha = async page => page.evaluate(() => {
  window.validaCapturador = () => true
})

module.exports = {
  selectOptionByLabel,
  hackReCaptcha,
  sendMailReport
}
