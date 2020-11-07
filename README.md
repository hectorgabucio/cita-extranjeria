# cita-extranjeria

Bot that automatically checks for appointments for "TOMA HUELLAS" and notifies you. Heavily based in https://github.com/davidbarna/cita-extranjeria

## Prerrequisites
You need to have installed node and npm.

## How to use

1. Create a zoho email. https://www.zoho.com/es-xl/mail/
2. Run npm install
3. Rename .env.example to .env
4. Change values of variables in .env file (your name, your zoho email to send messages, your email to receive those messages, your NIE, province, nationality...)
5. Pay attention to uppercase, for example nationality value must be in uppercase (because in the government page you find the nationalities selector all in uppercase).
6. Run npm start
