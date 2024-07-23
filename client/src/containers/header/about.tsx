import Image from 'next/image';

import { Dialog, DialogContentHome, DialogTrigger } from '@/components/ui/dialog';

const About = () => {
  return (
    <Dialog>
      <DialogTrigger className="text-sm font-bold uppercase tracking-widest">About</DialogTrigger>
      <DialogContentHome>
        <div className="space-y-4 p-10">
          <div className="font-notes items-start justify-start text-2xl font-bold leading-9 text-white">
            About the Impact Sphere
          </div>
          <div className="font-open-sans self-stretch text-base font-normal leading-normal text-white">
            Lorem ipsum dolor sit amet consectetur. Commodo nulla interdum felis semper augue
            adipiscing. Massa elementum id venenatis viverra. Non lectus aliquam turpis at. Gravida
            enim suscipit aliquet erat imperdiet luctus gravida pellentesque. Diam urna amet
            habitasse sed eget semper pellentesque malesuada. Turpis.
          </div>
          <div className="inline-flex items-start justify-center gap-2 self-stretch">
            <div className="inline-flex w-[418px] flex-col items-start justify-start gap-1">
              <div className="inline-flex items-center justify-start gap-1">
                <div className="font-notes text-sm font-bold uppercase leading-[21px] tracking-wide text-slate-400">
                  contatcs
                </div>
              </div>
              <div>
                <a
                  className="font-open-sans self-stretch text-base font-normal leading-normal text-white underline"
                  href="mailto:gda@esa.int"
                >
                  gda@esa.int
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-3">
            <a href="https://gda.esa.int/" target="_blank" rel="noreferrer">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/logos/GDA-logo.png`}
                alt="Impact Sphere"
                width={50}
                height={50}
              />
            </a>
            <a href="https://www.esa.int/" target="_blank" rel="noreferrer">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH}/images/logos/esa-logo.png`}
                alt="Impact Sphere"
                width={69}
                height={32}
              />
            </a>
          </div>
        </div>
      </DialogContentHome>
    </Dialog>
  );
};

export default About;
