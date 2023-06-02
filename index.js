const bip39 = require('bip39');
const ecc = require('tiny-secp256k1');
const { BIP32Factory } = require('bip32');
const bitcoin = require('bitcoinjs-lib');


const bip32 = BIP32Factory(ecc);
let seedPhrase = bip39.generateMnemonic();

const seedBuffer = bip39.mnemonicToSeedSync(seedPhrase);
const root = bip32.fromSeed(seedBuffer);

const account = root.derivePath("m/44'/0'/0'");
const node = account.derivePath("0");
const child = node.derive(0);

const publicKey = child.publicKey;

const wallet = bitcoin.payments.p2wpkh({ pubkey: publicKey });
const privateKey = child.toWIF()
const address = wallet.address

console.log(`Address : ${address}\nPrivate Key : ${privateKey}`)