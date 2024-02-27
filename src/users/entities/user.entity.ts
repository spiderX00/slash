// user.model.ts
import { Column, DataType, Model, Table } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

@Table({
    tableName: 'users',
})
export class User extends Model<User> {
    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })
    public id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    username: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    email: string;

    private readonly SALT: number = 10;

    beforeSave(user: User) {
        if (user.changed('password')) {
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(this.SALT));
        }
    }

    async comparePassword(password: string) {
        return bcrypt.compare(password, this.password);
    }
}
