export abstract class IHasher {
  abstract hash(payload: string): Promise<string>;
}
