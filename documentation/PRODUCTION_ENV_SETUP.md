# Production Environment Variables Setup Guide

This document provides instructions for configuring the Valkyrie Finance platform's environment variables for production deployment on Vercel.

## Required Environment Variables

The following environment variables must be configured in the Vercel project settings for proper production deployment:

### Server Configuration
```
NEXT_PUBLIC_SERVER_URL=https://api.valkyriefinance.com
CORS_ORIGIN=https://valkyriefinance.com
```

### Database Configuration
```
DATABASE_URL=postgresql://username:password@production-db-host:5432/valkyrie_db
```

### Authentication
```
NEXTAUTH_SECRET=your-secure-auth-secret-at-least-32-chars
NEXTAUTH_URL=https://valkyriefinance.com
```

### Web3 Configuration
```
NEXT_PUBLIC_ENABLE_TESTNETS=false
NEXT_PUBLIC_DEFAULT_CHAIN=1
NEXT_PUBLIC_REOWN_PROJECT_ID=your-reown-project-id
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id
NEXT_PUBLIC_ALCHEMY_API_KEY=your-alchemy-api-key
```

### AI Services
```
GOOGLE_AI_API_KEY=your-google-ai-api-key
```

### Analytics
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=your-ga-measurement-id
```

### External APIs
```
COINGECKO_API_KEY=your-coingecko-api-key
DEFILLAMA_API_KEY=your-defillama-api-key
```

### Smart Contract Addresses (Mainnet)
```
PLATFORM_TOKEN_ADDRESS=0x...
VAULT_CONTRACT_ADDRESS=0x...
GOVERNANCE_CONTRACT_ADDRESS=0x...
```

## Setting Up Environment Variables in Vercel

1. Log in to your Vercel account
2. Navigate to your project
3. Click on "Settings" > "Environment Variables"
4. Add each environment variable with its corresponding value
5. Ensure that variables are added to the Production environment
6. Click "Save" to apply the changes

## Security Considerations

- Never commit environment variable values to the repository
- Use strong, unique values for secrets
- Rotate API keys and secrets regularly
- Limit access to the Vercel project settings
- Consider using Vercel's integration with secret management services for sensitive values

## Testing Environment Variables

To verify that environment variables are correctly configured:

1. Deploy a preview version with the environment variables
2. Use the test script to validate the configuration:

```bash
node scripts/test-production-deployment.js
```

3. Check the logs for any missing or misconfigured variables

## Troubleshooting

If you encounter issues with environment variables:

1. Verify that all required variables are set in the Vercel dashboard
2. Check for typos in variable names
3. Ensure that the values are correctly formatted
4. Redeploy the application after making changes to environment variables
5. Check the build logs for any environment-related errors
