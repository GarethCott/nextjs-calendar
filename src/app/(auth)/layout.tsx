import { Metadata } from 'next';
import Image from 'next/image';
import * as React from 'react';

import '@/styles/globals.css';

import { siteConfig } from '@/constant/config';

export const metadata: Metadata = {
  title: {
    default: `Authentication - ${siteConfig.title}`,
    template: `%s | Authentication - ${siteConfig.title}`,
  },
  description: siteConfig.description,
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-background'>
      <div className='container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
          <div className='absolute inset-0 bg-zinc-900/90' />
          <div className='relative z-20 flex items-center text-lg font-medium'>
            <Image
              src='/images/logo.svg'
              alt='Logo'
              className='mr-2'
              width={24}
              height={24}
            />
            {siteConfig.title}
          </div>
          <div className='relative z-20 mt-auto'>
            <blockquote className='space-y-2'>
              <p className='text-lg'>
                &ldquo;This starter template has saved me countless hours of
                work and helped me deliver stunning applications to my clients
                faster than ever before.&rdquo;
              </p>
              <footer className='text-sm'>Sofia Davis - Web Developer</footer>
            </blockquote>
          </div>
        </div>
        <div className='p-4 lg:p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] lg:w-[400px]'>
            {children}
            <p className='px-8 text-center text-sm text-muted-foreground'>
              By clicking continue, you agree to our{' '}
              <a
                href='/terms'
                className='underline underline-offset-4 hover:text-primary'
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href='/privacy'
                className='underline underline-offset-4 hover:text-primary'
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
