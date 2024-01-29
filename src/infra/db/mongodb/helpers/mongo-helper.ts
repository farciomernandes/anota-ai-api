import { Collection, MongoClient } from 'mongodb';

interface MongoHelper {
  client: MongoClient | null;
  url: string;

  connect(url: string): Promise<void>;

  disconnect(): Promise<void>;

  getCollection(name: string): Promise<Collection>;

  map(collection: any): any;
}

export const MongoHelper: MongoHelper = {
  client: null,
  url: '',

  async connect(url: string): Promise<void> {
    this.url = url;
    this.client = await MongoClient.connect(url);
  },

  async disconnect(): Promise<void> {
    try {
      if (this.client) {
        await this.client.close();
        this.client = null;
      }
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
    }
  },

  async getCollection(name: string): Promise<Collection> {
    try {
      if (!this.client) {
        await this.connect(this.url);
      }
      return this.client.db().collection(name);
    } catch (error) {
      console.error(`Error getting collection '${name}':`, error);
      throw error;
    }
  },

  map(collection: any): any {
    const { _id, ...collectionWithoutId } = collection;
    return Object.assign({}, collectionWithoutId, { id: _id });
  },
};
