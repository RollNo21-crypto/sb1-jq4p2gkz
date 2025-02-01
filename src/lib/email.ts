import emailjs from '@emailjs/browser'

const SERVICE_ID = 'service_z450tvm'
const TEMPLATE_ID = 'template_lvotr5c'
const PUBLIC_KEY = 'o6RjUf7Hdwd0pKKF0'

// Initialize EmailJS with the public key
emailjs.init(PUBLIC_KEY)

interface EmailParams {
  to_email: string
  to_name: string
  subject: string
  message: string
}

export async function sendEmail(params: EmailParams) {
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: params.to_email,
        to_name: params.to_name,
        subject: params.subject,
        message: params.message,
        from_name: 'POSSPOLE Team',
        reply_to: 'support@posspole.com'
      }
    )

    if (response.status !== 200) {
      throw new Error(`Failed to send email: ${response.text}`)
    }

    return response
  } catch (error) {
    console.error('Email error:', error)
    throw error
  }
}