import { Spectral } from 'next/font/google'
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const spectral = Spectral({
  weight: ['400'],
  style: ['italic'],
});

export default function Login() {

  return (
    <section className="flex-3 flex h-full w-full justify-center items-center">
      <div className="flex flex-col justify-center w-full h-full items-center">
        <div className="w-full justify-center hidden md:flex md:justify-start md:ml-10">
          <p className={`block text-4xl text-[#d5dcd9] tracking-tighter ${spectral.className}`}>MediaVault</p>
        </div>
        <div className="flex justify-center items-center w-full h-full px-4 md:px-10">
          <div className="w-full max-w-none md:max-w-lg md:mx-auto">
            <div className="flex justify-center md:justify-start mb-8">
              <Image
                src="/icon.png"
                width={100}
                height={100}
                alt="MediaVault Logo"
              />
            </div>
            <div className='text-center md:text-start space-y-2 mb-10'>
              <p className='text-3xl text-black tracking-tighter font-bold'>Access Vault</p>
              <p className='text-xl text-[#a4a09d] tracking-tight font-semibold'>Welcome to MediaVault - Login to your account</p>
            </div>
            <hr className="mb-5 md:mb-10 h-0.5 border-t-0 bg-[#e4e5e4]" />

            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium text-black tracking-tight">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 border-[#e4e5e4]"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className='flex items-center justify-between'>
                  <Label htmlFor="password" className="text-base font-medium text-black tracking-tight">
                    Password
                  </Label>
                  <a href="#" className="text-base font-medium text-black hover:text-[#5f947cab] transition-colors tracking-tight">
                    Forgot?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-12 border-[#e4e5e4]"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#0a1d12] via-[#15412e] to-[#247050] hover:from-[#0f251a] hover:via-[#1a4d37] hover:to-[#2a8460] text-white font-medium tracking-tight transition-all duration-300"
              >
                Sign In
              </Button>

              <div className="text-center">
                <span className="text-[#a4a09d] tracking-tight">Don't have an account? </span>
                <a href="#" className="text-base font-medium text-black hover:text-[#5f947cab] transition-colors tracking-tight">
                  Sign up
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
