// Test token generation
import crypto from 'crypto';

function generateTokenAndCode() {
  const digits = '0123456789';
  let token20 = '';
  const bytes = crypto.randomBytes(20);
  for (let i = 0; i < 20; i++) {
    token20 += digits[bytes[i] % 10];
  }
  return {
    tokenNumber: token20,
    rechargeCode: `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  };
}

// Test 5 times
console.log('Testing token generation (should be 20 numeric digits):');
for (let i = 0; i < 5; i++) {
  const result = generateTokenAndCode();
  console.log(`\nTest ${i + 1}:`);
  console.log(`  Token Number: ${result.tokenNumber} (length: ${result.tokenNumber.length})`);
  console.log(`  Recharge Code: ${result.rechargeCode}`);
  console.log(`  Is 20 digits: ${/^\d{20}$/.test(result.tokenNumber)}`);
}
