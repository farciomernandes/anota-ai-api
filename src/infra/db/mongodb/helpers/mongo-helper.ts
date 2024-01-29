import { Collection, MongoClient, ObjectId } from 'mongodb';

interface MongoHelper {
  client: MongoClient | null;
  url: string;

  connect(url: string): Promise<void>;

  disconnect(): Promise<void>;

  getCollection(name: string): Promise<Collection>;

  findItemById(collectionName: string, itemId: any): Promise<any>;

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

  async findItemById(collectionName: string, itemId: any): Promise<any> {
    try {
      const collection = await this.getCollection(collectionName);
      const insertedDocument = await collection.findOne({
        _id: new ObjectId(itemId),
      });
      return insertedDocument;
    } catch (error) {
      console.error(`Error finding item by id in '${collectionName}':`, error);
      throw error;
    }
  },

  map(collection: any): any {
    const { _id, ...collectionWithoutId } = collection;
    return Object.assign({}, collectionWithoutId, { id: _id });
  },
};
