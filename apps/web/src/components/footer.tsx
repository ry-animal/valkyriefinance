export default function Footer() {
    return (
        <footer className="border-t bg-muted/20">
            <div className="container mx-auto px-4 py-8">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-semibold mb-3">Valkyrie Finance</h3>
                        <p className="text-sm text-muted-foreground">
                            Next-generation DeFi platform with AI-powered yield optimization.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-medium mb-3">Platform</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-muted-foreground hover:text-foreground">Vaults</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-foreground">Strategies</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-foreground">Analytics</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-3">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-muted-foreground hover:text-foreground">Documentation</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-foreground">API</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-foreground">Support</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium mb-3">Community</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-muted-foreground hover:text-foreground">Discord</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-foreground">Twitter</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-foreground">GitHub</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    © 2024 Valkyrie Finance. All rights reserved.
                </div>
            </div>
        </footer>
    );
} 