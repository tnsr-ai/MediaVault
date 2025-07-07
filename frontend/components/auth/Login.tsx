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
        <div className="w-full flex justify-start ml-10">
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
              <p className='text-3xl text-black tracking-tighter font-semibold'>Get Started</p>
              <p className='text-xl text-[#a4a09d]'>Welcome to MediaVault - Login to your account</p>
            </div>
            <hr className="mb-10 h-0.5 border-t-0 bg-[#e4e5e4]" />

            {/* Login Form */}
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium text-black">
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
                <Label htmlFor="password" className="text-base font-medium text-black">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-12 border-[#e4e5e4]"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#e4e5e4] text-black focus:ring-black"
                  />
                  <Label htmlFor="remember" className="text-sm text-[#a4a09d]">
                    Remember me
                  </Label>
                </div>
                <a href="#" className="text-sm text-black hover:text-[#a4a09d] transition-colors">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-black hover:bg-[#333333] text-white font-medium tracking-tight transition-colors"
              >
                Sign In
              </Button>

              <div className="text-center">
                <span className="text-[#a4a09d]">Already have an account? </span>
                <a href="#" className="text-black hover:text-[#a4a09d] font-medium transition-colors">
                  Log in
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
