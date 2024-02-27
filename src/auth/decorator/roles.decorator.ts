import { Reflector } from '@nestjs/core';
import { Role } from '../dto/Role.enum';

export const Roles = Reflector.createDecorator<Role[]>();
