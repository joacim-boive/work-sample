module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            // Defines the Content Security Policy to restrict the sources of content that can be loaded
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; img-src *; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
          },
          {
            // Ensures secure (HTTP over SSL/TLS) connections
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            // Prevents browsers from MIME-sniffing a response away from the declared content-type
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Controls how much referrer information should be included with requests
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
