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

export default function Forgot() {
  return (
    <section className={`${theme.layout.section} my-5 md:my-0`}>
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
              <p className={theme.typography.heading.primary}>{config.forms.forgotPassword.title}</p>
              <p className={theme.typography.heading.secondary}>{config.forms.forgotPassword.description}</p>
            </div>
            <hr
              className="mb-5 md:mb-10 h-0.5 border-t-0"
              style={{ background: theme.colors.ui.border }}
            />

            <form className={theme.components.form.spacing}>
              <div className={theme.components.form.fieldSpacing}>
                <Label htmlFor="email" className={theme.typography.label}>
                  {config.forms.forgotPassword.fields.email.label}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={config.forms.forgotPassword.fields.email.placeholder}
                  className={getInputStyles()}
                  required
                />
              </div>

              <Button
                type="submit"
                className={`w-full h-12 ${getButtonStyles('primary')} font-medium tracking-tight`}
              >
                {config.forms.forgotPassword.submitButtonText}
              </Button>

              <div className="text-center">
                <span className={`${theme.colors.ui.text.secondary} tracking-tight`}>
                  {config.forms.forgotPassword.signInPrompt}{' '}
                </span>
                <Link href="/" className={getLinkStyles()}>
                  {config.forms.forgotPassword.signInText}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
