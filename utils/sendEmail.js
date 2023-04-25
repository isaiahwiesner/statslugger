require('dotenv').config()
const path = require('path')
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  }
})
const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve('./views/'),
    defaultLayout: false
  },
  viewPath: path.resolve('./views/')
}
transporter.use('compile', hbs(handlebarOptions))

// Addresses
const addresses = {
  NOREPLY: `"Stat Slugger" <${process.env.NODEMAILER_USER}>`,
  SUPPORT: `"Stat Slugger Support" <${process.env.NODEMAILER_USER}>`,
}

// Email confirmation
const sendConfirmationEmail = async ({email, displayName, link}) => {
  return transporter.sendMail({
    from: addresses.NOREPLY,
    to: email,
    subject: 'Stat Slugger Email Confirmation',
    template: 'emailConfirmation',
    context: {
      displayName,
      link,
      websiteURL: process.env.WEBSITE_URL,
    }
  })
}

// Password reset
const sendPasswordResetEmail = async ({email, displayName, link}) => {
  return transporter.sendMail({
    from: addresses.NOREPLY,
    to: email,
    subject: 'Stat Slugger Password Reset',
    template: 'passwordReset',
    context: {
      displayName,
      link,
      websiteURL: process.env.WEBSITE_URL,
    }
  })
} 

// Password reset
const sendPasswordChangedEmail = async ({email, displayName }) => {
  return transporter.sendMail({
    from: addresses.NOREPLY,
    to: email,
    subject: 'Password Changed',
    template: 'passwordChanged',
    context: {
      displayName,
      websiteURL: process.env.WEBSITE_URL,
      date: new Date().toUTCString()
    }
  })
} 

// Custom email
const sendEmail = async (from, to, subject, html, text) => {
  return await transporter.sendMail({
    from, to, subject, html, text
  })
}

// Export
module.exports = {
  sendConfirmationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendEmail
}