// import { Keccak } from "keccak";
const keccak = require("keccak");

export function getAddress(publicKey: string): string {
  const formatedPublicKey = publicKey.slice(2);
  const publicKeyBytes = Buffer.from(formatedPublicKey, "hex");

  const hash = keccak("keccak256").update(publicKeyBytes).digest("hex");
  const address = hash.slice(-40);

  const hashAddress = keccak("keccak256").update(address).digest("hex");

  let checksumAddress = "0x";

  for (let i = 0; i < address.length; i++) {
    if (parseInt(hashAddress[i], 16) >= 8) {
      checksumAddress += address[i].toUpperCase();
    } else {
      checksumAddress += address[i];
    }
  }

  return checksumAddress;
}
