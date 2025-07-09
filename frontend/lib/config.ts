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
      title: 'Access Vault',
      submitButtonText: 'Sign In',
      forgotPasswordText: 'Forgot?',
      signUpPrompt: "Don't have an account?",
      signUpText: 'Sign up',
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
