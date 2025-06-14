import { BrutalHeadline, BrutalText, BrutalSection, BrutalGrid, BrutalBox } from "@/components/brutalist/layout"

export default function Footer() {
    return (
        <footer className="border-t-4 border-black dark:border-white bg-white dark:bg-black">
            <BrutalSection className="py-16">
                <BrutalGrid cols={1} className="gap-8 max-w-7xl mx-auto text-center grid-cols-2 lg:grid-cols-4">
                    <BrutalBox className="flex flex-col items-center justify center bg-white dark:bg-black" border={false}>
                        <BrutalHeadline size="lg" className="mb-6 text-black dark:text-white">
                            VALKYRIE FINANCE
                        </BrutalHeadline>
                        <BrutalText variant="mono" className="text-black dark:text-white">
                            THE MOST AGGRESSIVE YIELD FARMING PLATFORM IN DEFI. 
                            MAXIMUM RETURNS. ZERO COMPROMISE.
                        </BrutalText>
                    </BrutalBox>
                    
                    <BrutalBox className="flex flex-col items-center justify center bg-white dark:bg-black" border={false}>
                        <BrutalHeadline size="md" className="mb-6 text-black dark:text-white">
                            PLATFORM
                        </BrutalHeadline>
                        <div className="space-y-3">
                            <BrutalText variant="mono" className="text-black dark:text-white block hover:underline cursor-pointer">
                                VAULT
                            </BrutalText>
                            <BrutalText variant="mono" className="text-black dark:text-white block hover:underline cursor-pointer">
                                DASHBOARD
                            </BrutalText>
                            <BrutalText variant="mono" className="text-black dark:text-white block hover:underline cursor-pointer">
                                AI ANALYTICS
                            </BrutalText>
                            <BrutalText variant="mono" className="text-black dark:text-white block hover:underline cursor-pointer">
                                STAKING
                            </BrutalText>
                        </div>
                    </BrutalBox>
                    
                    <BrutalBox className="flex flex-col items-center justify center bg-white dark:bg-black" border={false}>
                        <BrutalHeadline size="md" className="mb-6 text-black dark:text-white">
                            RESOURCES
                        </BrutalHeadline>
                        <div className="space-y-3">
                            <BrutalText variant="mono" className="text-black dark:text-white block hover:underline cursor-pointer">
                                DOCUMENTATION
                            </BrutalText>
                            <BrutalText variant="mono" className="text-black dark:text-white block hover:underline cursor-pointer">
                                WHITEPAPER
                            </BrutalText>
                            <BrutalText variant="mono" className="text-black dark:text-white block hover:underline cursor-pointer">
                                AUDIT REPORTS
                            </BrutalText>
                            <BrutalText variant="mono" className="text-black dark:text-white block hover:underline cursor-pointer">
                                GITHUB
                            </BrutalText>
                        </div>
                    </BrutalBox>
                    
                    <BrutalBox className="flex flex-col items-center justify center bg-white dark:bg-black" border={false}>
                        <BrutalHeadline size="md" className="mb-6 text-black dark:text-white">
                            COMMUNITY
                        </BrutalHeadline>
                        <div className="space-y-3">
                            <BrutalText variant="mono" className="text-black dark:text-white block hover:underline cursor-pointer">
                                DISCORD
                            </BrutalText>
                            <BrutalText variant="mono" className="text-black dark:text-white block hover:underline cursor-pointer">
                                TWITTER
                            </BrutalText>
                            <BrutalText variant="mono" className="text-black dark:text-white block hover:underline cursor-pointer">
                                TELEGRAM
                            </BrutalText>
                            <BrutalText variant="mono" className="text-black dark:text-white block hover:underline cursor-pointer">
                                MEDIUM
                            </BrutalText>
                        </div>
                    </BrutalBox>
                </BrutalGrid>
            </BrutalSection>
            
            {/* Bottom Bar */}
            <div className="border-t-4 border-black dark:border-white bg-white dark:bg-black py-8">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <BrutalText variant="mono" className="text-black dark:text-white text-center md:text-left">
                            © 2024 VALKYRIE FINANCE. ALL RIGHTS RESERVED.
                        </BrutalText>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                            <BrutalText variant="mono" className="text-black dark:text-white hover:underline cursor-pointer text-center">
                                PRIVACY POLICY
                            </BrutalText>
                            <BrutalText variant="mono" className="text-black dark:text-white hover:underline cursor-pointer text-center">
                                TERMS OF SERVICE
                            </BrutalText>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
} 