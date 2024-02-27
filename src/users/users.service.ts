import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  async create(createUserInput: CreateUserInput) {
    return User.create({
      ...createUserInput
    });
  }

  async findAll(): Promise<Array<User>> {
    return User.findAll();
  }

  async findOne(id: number): Promise<User> {
    return User.findByPk(id);
  }

  async getUser(username: string): Promise<User> {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User ${username} not found.`);
    }
    return user;
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('not found');
    }
    return user.update(updateUserInput);
  }

  async remove(id: number) {
    const deletedUserCount = await User.destroy({
      where: { id }
    })
    return !!deletedUserCount;
  }
}
