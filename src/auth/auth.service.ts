// src/auth/auth.service.ts

import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserDocument } from '../user/schemas/user.schema'; // Ensure this import

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // Register a new user
  async register(createUserDto: CreateUserDto) {
    const user: UserDocument = await this.userService.create(createUserDto);
    const userObj = user.toObject();
    delete userObj.password; // Remove password field
    return userObj;
  }

  // Validate user credentials
  async validateUser(email: string, password: string): Promise<any> {
    const user: UserDocument | undefined =
      await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const userObj = user.toObject();
      delete userObj.password; // Remove password field
      return userObj;
    }
    return null;
  }

  // Login and generate JWT
  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
