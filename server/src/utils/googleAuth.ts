import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.CORS_ORIGIN || 'http://localhost:5173' // This should match your frontend URL
)

export interface GoogleUserInfo {
  id: string
  email: string
  name: string
  picture?: string
  email_verified: boolean
}

export const verifyGoogleToken = async (token: string): Promise<GoogleUserInfo> => {
  try {
    console.log('Verifying Google token...')
    console.log('Client ID:', process.env.GOOGLE_CLIENT_ID)
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()
    
    if (!payload) {
      throw new Error('Invalid Google token payload')
    }

    console.log('Google token verified successfully for user:', payload.email)

    return {
      id: payload.sub,
      email: payload.email!,
      name: payload.name!,
      picture: payload.picture,
      email_verified: payload.email_verified || false
    }
  } catch (error) {
    console.error('Google token verification error:', error)
    throw new Error('Invalid Google token')
  }
}

export const generateGoogleAuthUrl = (state?: string): string => {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ]

  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state: state || 'default'
  })

  return authUrl
}