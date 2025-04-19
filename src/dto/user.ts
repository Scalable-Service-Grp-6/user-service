export interface UserDto {
    name: string,
    email: string,
    password: string,        // bcrypt/scrypt/argon2 hash
    role: string,
    createdAt: Date,
    updatedAt: Date
}
