import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(
            inMemoryUsersRepository
        );
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to authenticate a user", async () => {
        const user: ICreateUserDTO = {
            email: "user@test.com",
            name: "Mock User",
            password: "1234",
        };

        await createUserUseCase.execute(user);
        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
        });
        expect(result).toHaveProperty("token");
    });

    it("should not be able to authenticate a nonexistent user", () => {
        void expect(async () => {
            await authenticateUserUseCase.execute({
                email: "mock@email.com",
                password: "1234",
            });
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to authenticate a user with an incorrect password", () => {
        void expect(async () => {
            const user: ICreateUserDTO = {
                email: "user@test.com",
                name: "Mock User",
                password: "1234",
            };
            await createUserUseCase.execute(user);
            await authenticateUserUseCase.execute({
                email: user.email,
                password: "IncorrectPassword",
            });
        }).rejects.toBeInstanceOf(AppError);
    });
});
