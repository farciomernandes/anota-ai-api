import { StoreModel } from '@/core/domain/models/store';
import { makeFakeProduct } from './db-mock-helper-product';
import { makeFakeCategory } from './db-mock-helper-category';
import { StoreMongoRepository } from '@/infra/db/mongodb/store/store-mongo-repository';
import { CreatedStore } from '@/presentation/dtos/store/created-store';
import { makeFakeRoles } from './db-mock-helper-role';
import { AddStoreModel } from '@/presentation/dtos/store/add-store.dto';
import { WeekModel } from '@/core/domain/models/week';
import { DaysEnum } from '@/shared/enums/days.enum';
import { PaymentModel } from '@/core/domain/models/payment';

export const makeFakeWeek = (): WeekModel[] => [
  {
    short_name: DaysEnum.MONDAY,
    start: '17:00',
    end: '23:00',
    opened: true,
  },
  {
    short_name: DaysEnum.TUESDAY,
    start: '17:00',
    end: '23:00',
    opened: true,
  },
  {
    short_name: DaysEnum.WEDNESDAY,
    start: '17:00',
    end: '23:00',
    opened: true,
  },
  {
    short_name: DaysEnum.THURSDAY,
    start: '17:00',
    end: '23:00',
    opened: true,
  },
  {
    short_name: DaysEnum.FRIDAY,
    start: '17:00',
    end: '23:00',
    opened: true,
  },
  {
    short_name: DaysEnum.SATURDAY,
    start: '17:00',
    end: '23:00',
    opened: true,
  },
  {
    short_name: DaysEnum.SUNDAY,
    start: '17:00',
    end: '23:00',
    opened: true,
  },
];

export const makeFakePaymentMethod = (): PaymentModel => ({
  creditcard: false,
  money: true,
  pix: true,
});

export const makeStoreMongoRepository = (): StoreMongoRepository => {
  class StoreRepositoryStub implements StoreMongoRepository {
    update(
      id: string,
      payload: Omit<AddStoreModel, 'ownerId'>,
    ): Promise<StoreModel> {
      return Promise.resolve({
        ...makeFakeStore(),
        ...makeFakeUpdateStore(),
      });
    }
    findById(id: string): Promise<StoreModel> {
      return Promise.resolve(makeFakeStore());
    }
    delete(id: string): Promise<StoreModel> {
      return Promise.resolve(makeFakeStore());
    }
    async getAll(): Promise<StoreModel[]> {
      return Promise.resolve([makeFakeStore()]);
    }
    async findByEmail(email: string): Promise<StoreModel> {
      return Promise.resolve({} as StoreModel);
    }
    async create(payload: AddStoreModel): Promise<CreatedStore> {
      return Promise.resolve(makeFakeStore());
    }
  }

  return new StoreRepositoryStub();
};

export const makeStoreFakeRequest = (): AddStoreModel => ({
  email: 'any_email@mail.com',
  name: 'John Doe',
  password: 'new_password',
  roleId: '65b9a4cd77e2de47acb5db37',
  neighborhood: 'Bairro Saboroso',
  street: 'Rua das Pizzas',
  number: 353,
  city: 'Aurora',
  state: 'CE',
  cep: '12345-678',
  phone: '(11) 9876-5432',
  week: makeFakeWeek(),
  payment_method: makeFakePaymentMethod(),
});

export const makeFakeUpdateStore = (): AddStoreModel => ({
  email: 'invalid_mail@mail.com',
  name: 'new_name',
  password: 'new_password',
  roleId: 'valid_role_id',
  neighborhood: 'Bairro Saboroso',
  street: 'Rua das Pizzas',
  number: 353,
  city: 'Aurora',
  state: 'CE',
  cep: '12345-678',
  phone: '(11) 9876-5432',
  file: 'https://example.com/new_profile.jpg',
  week: makeFakeWeek(),
  payment_method: makeFakePaymentMethod(),
});

export const makeFakeStore = (): StoreModel => {
  const store = new StoreModel();
  store.id = '65bd52691a0f4c3b57819a4b';
  store.email = 'any_email@mail.com';
  store.name = 'John Doe';
  store.password = 'hashed_password';
  store.neighborhood = 'Bairro Saboroso';
  store.street = 'Rua das Pizzas';
  store.number = 353;
  store.city = 'Aurora';
  store.state = 'CE';
  store.cep = '12345-678';
  store.phone = '(11) 9876-5432';
  store.categories = [makeFakeCategory()];
  store.products = [makeFakeProduct()];
  store.file = 'https://example.com/profile.jpg';
  store.role = makeFakeRoles();
  store.week = makeFakeWeek();
  store.payment_method = makeFakePaymentMethod();

  return store;
};

export const makeRequestAddStore = (): AddStoreModel => {
  const store = new AddStoreModel();
  store.email = 'any_email@mail.com';
  store.name = 'John Doe';
  store.password = 'hashed_password';
  store.neighborhood = 'Bairro Saboroso';
  store.street = 'Rua das Pizzas';
  store.number = 353;
  store.city = 'Aurora';
  store.state = 'CE';
  store.cep = '12345-678';
  store.phone = '(11) 9876-5432';
  store.file = 'https://example.com/profile.jpg';
  store.roleId = makeFakeRoles().id;
  store.payment_method = makeFakePaymentMethod();
  store.week = makeFakeWeek();

  return store;
};
