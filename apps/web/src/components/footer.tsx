// import { BrutalBox, BrutalGrid, BrutalHeadline, BrutalSection, BrutalText } from '@valkyrie/ui';

export default function Footer() {
  return (
    <footer className="border-t-4 border-black dark:border-white bg-white dark:bg-black">
      <div className="py-16">
        <div className="gap-8 max-w-7xl mx-auto text-center grid grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center justify-center bg-white dark:bg-black">
            <h3 className="text-lg mb-6 text-black dark:text-white font-bold">VALKYRIE FINANCE</h3>
            <p className="text-black dark:text-white text-sm">
              THE MOST AGGRESSIVE YIELD FARMING PLATFORM IN DEFI. MAXIMUM RETURNS. ZERO COMPROMISE.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center bg-white dark:bg-black">
            <h3 className="text-md mb-6 text-black dark:text-white font-bold">PLATFORM</h3>
            <div className="space-y-3">
              <p className="text-black dark:text-white block hover:underline cursor-pointer text-sm">
                VAULT
              </p>
              <p className="text-black dark:text-white block hover:underline cursor-pointer text-sm">
                DASHBOARD
              </p>
              <p className="text-black dark:text-white block hover:underline cursor-pointer text-sm">
                AI ANALYTICS
              </p>
              <p className="text-black dark:text-white block hover:underline cursor-pointer text-sm">
                STAKING
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-white dark:bg-black">
            <h3 className="text-md mb-6 text-black dark:text-white font-bold">RESOURCES</h3>
            <div className="space-y-3">
              <p className="text-black dark:text-white block hover:underline cursor-pointer text-sm">
                DOCUMENTATION
              </p>
              <p className="text-black dark:text-white block hover:underline cursor-pointer text-sm">
                WHITEPAPER
              </p>
              <p className="text-black dark:text-white block hover:underline cursor-pointer text-sm">
                AUDIT REPORTS
              </p>
              <p className="text-black dark:text-white block hover:underline cursor-pointer text-sm">
                GITHUB
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-white dark:bg-black">
            <h3 className="text-md mb-6 text-black dark:text-white font-bold">COMMUNITY</h3>
            <div className="space-y-3">
              <p className="text-black dark:text-white block hover:underline cursor-pointer text-sm">
                DISCORD
              </p>
              <p className="text-black dark:text-white block hover:underline cursor-pointer text-sm">
                TWITTER
              </p>
              <p className="text-black dark:text-white block hover:underline cursor-pointer text-sm">
                TELEGRAM
              </p>
              <p className="text-black dark:text-white block hover:underline cursor-pointer text-sm">
                MEDIUM
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t-4 border-black dark:border-white bg-white dark:bg-black py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-black dark:text-white text-center md:text-left">
              © 2024 VALKYRIE FINANCE. ALL RIGHTS RESERVED.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <p className="text-black dark:text-white hover:underline cursor-pointer text-center">
                PRIVACY POLICY
              </p>
              <p className="text-black dark:text-white hover:underline cursor-pointer text-center">
                TERMS OF SERVICE
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
