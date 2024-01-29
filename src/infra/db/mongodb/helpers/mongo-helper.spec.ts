import { MongoHelper as sut } from './mongo-helper';

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  test('Should reconnect if mongodb is down', async () => {
    let categoryConnection = await sut.getCollection('categories');
    expect(categoryConnection).toBeTruthy();
    await sut.disconnect();
    categoryConnection = await sut.getCollection('categories');
    expect(categoryConnection).toBeTruthy();
  });
});
