# Custom Domain and SSL Setup Guide

This document provides instructions for configuring a custom domain and SSL certificates for the Valkyrie Finance platform deployed on Vercel.

## Domain Setup

### 1. Purchase a Domain

If you don't already own a domain, purchase one from a reputable domain registrar such as:
- [Namecheap](https://www.namecheap.com/)
- [Google Domains](https://domains.google/)
- [GoDaddy](https://www.godaddy.com/)

### 2. Add Domain to Vercel Project

1. Log in to your Vercel account
2. Navigate to your project dashboard
3. Click on "Settings" > "Domains"
4. Enter your domain (e.g., `valkyriefinance.com`)
5. Click "Add"

### 3. Configure DNS Records

Vercel will provide you with instructions to configure your DNS records. You have two options:

#### Option A: Using Vercel as the nameserver (recommended)
1. In your domain registrar's dashboard, update the nameservers to Vercel's nameservers:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
2. Wait for DNS propagation (can take up to 48 hours, but usually much faster)

#### Option B: Adding DNS records to your current nameserver
1. Add the following records to your DNS configuration:
   - A record: `@` pointing to Vercel's IP
   - CNAME record: `www` pointing to `cname.vercel-dns.com`
2. Verify the domain in Vercel by following their instructions

## SSL Certificate Setup

Vercel automatically provisions and renews SSL certificates for all domains added to your project through [Let's Encrypt](https://letsencrypt.org/).

### Verify SSL Configuration

1. After domain setup is complete, visit your site using HTTPS (e.g., `https://valkyriefinance.com`)
2. Check that the connection is secure (look for the padlock icon in your browser)
3. You can also use tools like [SSL Labs](https://www.ssllabs.com/ssltest/) to verify your SSL configuration

### Custom SSL Certificates (Optional)

If you have a custom SSL certificate that you want to use instead of Let's Encrypt:

1. In your Vercel project, go to "Settings" > "Domains"
2. Find your domain and click on "Edit"
3. Select "Upload Certificate"
4. Provide your certificate, private key, and any intermediate certificates
5. Click "Save"

## Subdomain Configuration

### API Subdomain

For the API server, set up a subdomain:

1. In Vercel, add a new domain: `api.valkyriefinance.com`
2. Configure the appropriate DNS records as instructed by Vercel
3. Update your environment variables to use this subdomain:
   ```
   NEXT_PUBLIC_SERVER_URL=https://api.valkyriefinance.com
   ```

### Additional Subdomains (Optional)

For other services or environments, you can set up additional subdomains:

- `docs.valkyriefinance.com` - Documentation site
- `staging.valkyriefinance.com` - Staging environment
- `app.valkyriefinance.com` - Main application (if you want to separate landing page from app)

## Domain Security Best Practices

1. **Enable DNSSEC**: Adds an additional layer of security to your DNS records
2. **Domain Privacy**: Use domain privacy protection to hide your personal information from WHOIS lookups
3. **Domain Lock**: Enable domain locking to prevent unauthorized domain transfers
4. **Email Security**: Set up SPF, DKIM, and DMARC records to prevent email spoofing
5. **Regular Monitoring**: Regularly check your domain and SSL certificate status

## Troubleshooting

### Domain Verification Issues
- Ensure DNS records are correctly configured
- Check for typos in domain names or DNS records
- Allow sufficient time for DNS propagation

### SSL Certificate Issues
- Verify that your domain is correctly pointing to Vercel
- Check for mixed content warnings in your application
- Ensure all assets are served over HTTPS

### Custom Domain Not Working
- Verify that the domain is added to the correct Vercel project
- Check if there are conflicting DNS records
- Ensure that your domain registration is active and not expired

## Additional Resources

- [Vercel Domain Documentation](https://vercel.com/docs/concepts/projects/domains)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [DNS Propagation Checker](https://www.whatsmydns.net/)
- [SSL Server Test](https://www.ssllabs.com/ssltest/)
