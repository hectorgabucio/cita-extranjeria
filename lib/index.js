require('dotenv').config()
const task = require('./task');
const TIMEOUT = 30 * 1000 // 1 minute
const info = {
  provinceValue: process.env.CITA_PROVINCE,
  requestValue: 'POLICIA-TOMA DE HUELLAS (EXPEDICIÓN DE TARJETA) Y RENOVACIÓN DE TARJETA DE LARGA DURACIÓN',
  person: {
    name: process.env.CITA_NAME,
    email: process.env.CITA_EMAIL_TO,
    documentNumber: process.env.CITA_NIE
  }
}

const execute = () => task(info)
  .then(() => {
    console.log(`Next attempt in ${TIMEOUT}ms`)
    setTimeout(execute, TIMEOUT)
  })
  .catch((err) => {
    console.log('Error: ' + err.message)
    console.log(`Retry in 5 seconds`)
    setTimeout(execute, 5000)
  })

execute()
