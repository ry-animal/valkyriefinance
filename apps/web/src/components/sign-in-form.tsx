import { BrutalText, BrutalHeadline, BrutalBox } from "./brutalist/layout";
import UserMenu from "./user-menu";

export default function SignInForm() {

  return (
    <div className="mx-auto w-full mt-10 max-w-lg">
      <BrutalBox className="text-center p-12" border>
        <BrutalHeadline size="huge" className="mb-6">
          CONNECT
          <br />
          WALLET
        </BrutalHeadline>
        
        <BrutalText variant="mono" className="mb-8 text-lg">
          DECENTRALIZED AUTHENTICATION.
          <br />
          NO PASSWORDS. NO BULLSHIT.
          <br />
          MAXIMUM SECURITY.
        </BrutalText>
        
        <div className="mb-8">
          <UserMenu />
        </div>
        
        <BrutalText variant="brutal" className="text-sm">
          WALLET = IDENTITY
        </BrutalText>
        
        <div className="mt-6 pt-6 border-t-4 border-black">
          <BrutalText variant="mono" className="text-xs opacity-75">
            SUPPORTED: METAMASK, WALLETCONNECT, COINBASE WALLET, RAINBOW
          </BrutalText>
        </div>
      </BrutalBox>
    </div>
  );
}
