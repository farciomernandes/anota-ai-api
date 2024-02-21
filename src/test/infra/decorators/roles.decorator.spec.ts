import { ROLES_KEY, Roles } from '@/infra/decorators/roles.decorator';
import { SetMetadata } from '@nestjs/common';

describe('Roles Decorator', () => {
  it('should set metadata with provided roles', () => {
    const rolesToSet = ['admin', 'user'];

    class TestClass {}

    Roles(...rolesToSet)(TestClass);

    const metadata = Reflect.getMetadata(ROLES_KEY, TestClass);
    expect(metadata).toEqual(rolesToSet);
  });
});
