export abstract class ProxySendMessage {
  abstract sendSnsMessage(message: string): Promise<string>;
}
