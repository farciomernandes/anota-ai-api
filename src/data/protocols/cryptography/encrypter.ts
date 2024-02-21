export abstract class Encrypter {
  abstract encrypt(payload: any): Promise<string>;
}
