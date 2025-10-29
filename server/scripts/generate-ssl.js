const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const sslDir = path.join(__dirname, '../ssl');

// Create SSL directory if it doesn't exist
if (!fs.existsSync(sslDir)) {
  fs.mkdirSync(sslDir, { recursive: true });
}

console.log('Generating development SSL certificates...');

try {
  // Generate private key
  execSync(`openssl genrsa -out ${path.join(sslDir, 'dev-private-key.pem')} 2048`, { stdio: 'inherit' });
  
  // Generate certificate
  execSync(`openssl req -new -x509 -key ${path.join(sslDir, 'dev-private-key.pem')} -out ${path.join(sslDir, 'dev-certificate.pem')} -days 365 -subj "/C=ZA/ST=Gauteng/L=Johannesburg/O=International Payments Portal/OU=Development/CN=localhost"`, { stdio: 'inherit' });
  
  console.log('✅ Development SSL certificates generated successfully!');
  console.log('📁 Certificates saved in:', sslDir);
  console.log('🔒 You can now run the server with HTTPS support');
  
} catch (error) {
  console.error('❌ Error generating SSL certificates:', error.message);
  console.log('💡 Make sure OpenSSL is installed on your system');
  console.log('   Windows: Download from https://slproweb.com/products/Win32OpenSSL.html');
  console.log('   macOS: brew install openssl');
  console.log('   Linux: sudo apt-get install openssl');
}