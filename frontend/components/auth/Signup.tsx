import { Spectral } from 'next/font/google'
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import { theme, getButtonStyles, getInputStyles, getLinkStyles } from '@/lib/theme';
import { config } from '@/lib/config';

const spectral = Spectral({
  weight: ['400'],
  style: ['italic'],
});

export default function Signup() {

  return (
    <section className={theme.layout.section}>
      <div className="flex flex-col justify-center w-full h-full items-center">
        {config.features.showBrandName && (
          <div className="w-full justify-center hidden md:flex md:justify-start md:ml-10">
            <p className={`block ${theme.typography.brand.logo} ${spectral.className}`}>
              {config.app.name}
            </p>
          </div>
        )}
        <div className="flex justify-center items-center w-full h-full px-4 md:px-10">
          <div className={theme.layout.container}>
            <div className="flex justify-center md:justify-start mb-8">
              <Image
                src={config.app.logo}
                width={100}
                height={100}
                alt={`${config.app.name} Logo`}
              />
            </div>
            <div className='text-center md:text-start space-y-2 mb-10'>
              <p className={theme.typography.heading.primary}>{config.forms.signup.title}</p>
              <p className={theme.typography.heading.secondary}>{config.forms.signup.description}</p>
            </div>
            <hr
              className="mb-5 md:mb-10 h-0.5 border-t-0"
              style={{ background: theme.colors.ui.border }}
            />

            <form className={theme.components.form.spacing}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={theme.components.form.fieldSpacing}>
                  <Label htmlFor="firstName" className={theme.typography.label}>
                    {config.forms.signup.fields.firstName.label}
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder={config.forms.signup.fields.firstName.placeholder}
                    className={getInputStyles()}
                    required
                  />
                </div>

                <div className={theme.components.form.fieldSpacing}>
                  <Label htmlFor="lastName" className={theme.typography.label}>
                    {config.forms.signup.fields.lastName.label}
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder={config.forms.signup.fields.lastName.placeholder}
                    className={getInputStyles()}
                    required
                  />
                </div>
              </div>

              <div className={theme.components.form.fieldSpacing}>
                <Label htmlFor="email" className={theme.typography.label}>
                  {config.forms.signup.fields.email.label}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={config.forms.signup.fields.email.placeholder}
                  className={getInputStyles()}
                  required
                />
              </div>

              <div className={theme.components.form.fieldSpacing}>
                <Label htmlFor="password" className={theme.typography.label}>
                  {config.forms.signup.fields.password.label}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={config.forms.signup.fields.password.placeholder}
                  className={getInputStyles()}
                  required
                />
              </div>

              <div className={theme.components.form.fieldSpacing}>
                <Label htmlFor="confirmPassword" className={theme.typography.label}>
                  {config.forms.signup.fields.confirmPassword.label}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={config.forms.signup.fields.confirmPassword.placeholder}
                  className={getInputStyles()}
                  required
                />
              </div>

              <Button
                type="submit"
                className={`w-full h-12 ${getButtonStyles('primary')} font-medium tracking-tight`}
              >
                {config.forms.signup.submitButtonText}
              </Button>

              <div className="text-center">
                <span className={`${theme.colors.ui.text.secondary} tracking-tight`}>
                  {config.forms.signup.signInPrompt}{' '}
                </span>
                <Link href="/" className={getLinkStyles()}>
                  {config.forms.signup.signInText}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
