import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from '@/infra/guards/roles.guard';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflectorMock: Reflector;

  beforeEach(() => {
    reflectorMock = {
      get: jest.fn(),
    } as any;

    rolesGuard = new RolesGuard(reflectorMock);
  });

  test('Should allow access if no roles are set', () => {
    const contextMock: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { roles: ['user'] },
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;

    const result = rolesGuard.canActivate(contextMock);

    expect(result).toBe(true);
  });

  test('Should allow access if user has required roles', () => {
    const contextMock: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { roles: ['admin', 'user'] },
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;

    const result = rolesGuard.canActivate(contextMock);

    expect(result).toBe(true);
  });

  test('Should deny access if user does not have required roles', () => {
    const rolesGuard = new RolesGuard(new Reflector());

    jest.spyOn(rolesGuard['reflector'], 'get').mockReturnValue(['admin']);

    const contextMock: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { roles: ['user'] },
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;

    const result = rolesGuard.canActivate(contextMock);

    expect(result).toBe(false);
  });

  test('Should deny access if no user roles are set', () => {
    const rolesGuard = new RolesGuard(new Reflector());

    jest.spyOn(rolesGuard['reflector'], 'get').mockReturnValue(['admin']);

    const contextMock: ExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: {},
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;

    const result = rolesGuard.canActivate(contextMock);

    expect(result).toBe(false);
  });
});
