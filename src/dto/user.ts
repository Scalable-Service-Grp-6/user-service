export interface UserDto {
    name: String,
    email: String,
    password: String,        // bcrypt/scrypt/argon2 hash
    role: String,
    createdAt: Date,
    updatedAt: Date
}
