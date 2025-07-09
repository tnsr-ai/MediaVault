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
