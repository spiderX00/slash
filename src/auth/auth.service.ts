import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginResponse } from './dto/login-response';
import { RegisterResponse } from './dto/register-response';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async signup(loginUserInput: CreateUserInput): Promise<RegisterResponse> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(loginUserInput.password, salt);
        loginUserInput.password = hashedPassword;
        return this.usersService.create(loginUserInput);
    }

    async signin(user: User): Promise<LoginResponse> {
        const username = user.username;
        const accessToken = await this.jwtService.sign({
            username,
            sub: user.id,
        });
        if (!accessToken) {
            throw new InternalServerErrorException();
        }
        return {
            accessToken,
            username,
        };
    }

    async validateUser(username: string, password: string): Promise<User> {
        const user = await this.usersService.getUser(username);
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        throw new UnauthorizedException();
    }
}