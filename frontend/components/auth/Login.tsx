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
    <section className="flex-3 justify-center items-center flex h-full w-full">
      <div className="flex flex-col justify-center items-center w-full h-full">
        <div className="w-full justify-start ml-10 hidden md:block">
          <p className={`block text-4xl text-[#d5dcd9] tracking-tighter ${spectral.className}`}>MediaVault</p>
        </div>
        <div className="flex justify-center items-center w-full h-full px-10">
          <div className="w-full max-w-lg mx-auto">
            <div className="flex justify-start mb-8">
              <Image
                src="/icon.png"
                width={100}
                height={100}
                alt="MediaVault Logo"
              />
            </div>
            <div className='text-start space-y-2 mb-10'>
              <p className='text-3xl text-black tracking-tighter font-bold'>Get Started</p>
              <p className='text-xl text-[#a4a09d] tracking-tight font-semibold'>Welcome to MediaVault - Login to your account</p>
            </div>
            <hr className="mb-10 h-0.5 border-t-0 bg-[#e4e5e4]" />

            {/* Login Form */}
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
