export abstract class Decrypter {
  abstract decrypt: (ciphertext: string) => Promise<string>;
}
