module.exports = {
  url: 'https://sede.administracionespublicas.gob.es/icpplus/index.html',
  selectors: {
    PROVINCE: '#divProvincias select',
    ACCEPT: '#btnAceptar',
    REQUEST: '#tramiteGrupo\\[1\\]',
    CONFIRM_REQUEST: '#btnEntrar',
    DOCUMENT: '#rdbTipoDocNie',
    DOCUMENT_NUMBER: '#txtIdCitado',
    NAME: '#txtDesCitado',
    NATIONALITY: '#txtPaisNac',
    NATIONALITY_VALUE: process.env.CITA_NATIONALITY,
    SEND: '#btnEnviar',
    MESSAGE_TABLE: '.mf-msg__info',
    REQUEST_APPOINTMENT: 'input[value="Solicitar Cita"]'
  },
  messages: {
    NO_APPOINTMENTS_MSG: 'En este momento no hay citas disponibles.'
  },
  puppeteer: {
    ignoreHTTPSErrors: true,
    headless: false,
    slowMo: 50, // slow down by 250ms
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized'
    ],
    timeout: 5000
  }
}
