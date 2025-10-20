'use client';

import { useState } from 'react';

import { LucideAlertTriangle } from 'lucide-react';

import Providers from '@/app/(landing)/layout-providers';

import Banners from '@/containers/banners';
import Map from '@/containers/map';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContentHome } from '@/components/ui/dialog';

export default function WarningBanner() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Dialog defaultOpen={true} open={isOpen}>
      <DialogContentHome defaultClose={false}>
        <div className="space-y-4 p-6 sm:p-10">
          <div className="items-center justify-start space-x-4 text-xl font-bold leading-9 text-white">
            <LucideAlertTriangle className="inline-block h-6 w-6 stroke-white" />
            <span className="font-notes">We’re experiencing some issues</span>
          </div>
          <div className="font-notes space-y-4 self-stretch text-base font-normal leading-normal text-white">
            <p>
              We’re currently experiencing some technical issues affecting some parts of the site.
              Our team is working to resolve them as quickly as possible.
            </p>
            <p>Thank you for your patience.</p>
          </div>

          <div className="flex w-full items-center justify-center">
            <Button
              variant="secondary"
              className="font-open-sans rounded-3xl"
              onClick={() => setIsOpen(false)}
            >
              Ok
            </Button>
          </div>
        </div>
      </DialogContentHome>
    </Dialog>
  );
}
