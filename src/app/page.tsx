'use client';

import Head from 'next/head';
import Link from 'next/link';
import * as React from 'react';
import '@/lib/env';

import { buttonVariants } from '@/components/ui/button';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
import Logo from '~/svg/Logo.svg';

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  return (
    <main>
      <Head>
        <title>Hi</title>z
      </Head>
      <section>
        <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
          <Logo className='w-16' />
          <h1 className='mt-4'>Next.js + Tailwind CSS + TypeScript Starter</h1>
          <p className='mt-2 text-sm text-gray-800'>
            A starter for Next.js, Tailwind CSS, and TypeScript with Absolute
            Import, Seo, Link component, pre-configured with Husky{' '}
          </p>
          <p className='mt-2 text-sm text-gray-700'></p>

          <Link
            className={buttonVariants({ variant: 'outline' })}
            href='/components'
          >
            See all components
          </Link>

          <footer className='absolute bottom-2 text-gray-700'>
            © {new Date().getFullYear()} By{' '}
          </footer>
        </div>
      </section>
    </main>
  );
}
