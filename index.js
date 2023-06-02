const bip39 = require('bip39');
const ecc = require('tiny-secp256k1');
const { BIP32Factory } = require('bip32');
const bitcoin = require('bitcoinjs-lib');
const {createWriteStream, existsSync} = require('node:fs')
const rl = require('readline-sync');

let filename = 'generated.csv';
let i = 2;

while(existsSync(filename)) {
  filename = `generated_${i}.csv`;
  i++;
}

let writeStream = createWriteStream(`./${filename}`);

const main = async () => {

    console.log(`
    +-----------------------------------------+
    |
    | 	BTC Segwit Wallet Generator
    |   
    |	
    +-----------------------------------------+
            `)

    const numberToGenerate = rl.question('[?] How Many Wallet: ')
    console.log('Generating keys...');

    writeStream.write('Address,Private Key\n');

    for(let i = 0; i < numberToGenerate; i++) {
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

        writeStream.write(`${address},${privateKey}${i + 1 == numberToGenerate ? '' : '\n'}`)
    }

    writeStream.end();
    console.log(`Wallets generated and saved in ${filename}!`);
}

main()