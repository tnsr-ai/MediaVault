export const config = {
  // Application metadata
  app: {
    name: 'MediaVault',
    tagline: 'A media vault for your personal files',
    description: 'Welcome to MediaVault - Login to your account',
    logo: '/icon.png',
  },

  // Hero section content
  hero: {
    title: ['Start', 'storing what matters,'],
    subtitle: ['privately and', 'securely'],
  },

  // Form configuration
  forms: {
    login: {
      title: 'Sign in to MediaVault',
      submitButtonText: 'Sign In',
      forgotPasswordText: 'Forgot password?',
      signUpPrompt: "Don't have an account?",
      signUpText: 'Create one',
    },
    signup: {
      title: 'Create your MediaVault account',
      description: 'Sign up to securely store and manage your personal files.',
      submitButtonText: 'Create Account',
      signInPrompt: 'Already have an account?',
      signInText: 'Sign in',
      fields: {
        firstName: {
          label: 'First Name',
          placeholder: 'Enter your first name',
        },
        lastName: {
          label: 'Last Name',
          placeholder: 'Enter your last name',
        },
        email: {
          label: 'Email Address',
          placeholder: 'Enter your email address',
        },
        password: {
          label: 'Password',
          placeholder: 'Create a password',
        },
        confirmPassword: {
          label: 'Confirm Password',
          placeholder: 'Re-enter your password',
        },
      },
    },
    forgotPassword: {
      title: 'Forgot your password?',
      description: 'Enter your email to reset password.',
      submitButtonText: 'Send Reset Link',
      signInPrompt: 'Remembered your password?',
      signInText: 'Sign in',
      fields: {
        email: {
          label: 'Email Address',
          placeholder: 'Enter your email address',
        },
      },
    },
    twoFA: {
      title: 'Two-Factor Authentication',
      description: 'Enter the 6-digit code from your authenticator app.',
      submitButtonText: 'Verify',
      signInPrompt: 'Back to sign in?',
      signInText: 'Sign in',
      fields: {
        code: {
          label: 'Authentication Code',
          placeholder: 'Enter 6-digit code',
        },
      },
    },
    verifyEmail: {
      title: 'Verify Your Email',
      description: 'Please check your email for a verification code.',
      submitButtonText: 'Verify Email',
      signInPrompt: 'Already signed in?',
      signInText: 'Sign in',
      fields: {
        code: {
          label: 'Verification Code',
          placeholder: 'Enter the 6 digit code sent to your email',
        },
      },
    }
  },

  // Wave animation settings
  waveAnimation: {
    speed: 5,
    scale: 0.8,
    noiseIntensity: 1.0,
    rotation: 60,
  },

  // Features that can be toggled
  features: {
    showBrandName: true,
    showForgotPassword: true,
    showSignUpLink: true,
    enableAnimations: true,
  },
} as const;

export type AppConfig = typeof config;
