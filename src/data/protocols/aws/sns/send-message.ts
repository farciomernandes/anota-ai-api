export abstract class ProxySendMessage {
  abstract sendSnsMessage(payload: any, type: string): Promise<string>;
}
