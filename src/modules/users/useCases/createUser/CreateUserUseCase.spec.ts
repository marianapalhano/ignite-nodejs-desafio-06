import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
});
describe("Create User", () => {
    it("should be able to create a user", async () => {
        await createUserUseCase.execute({
            name: "User name",
            email: "User email",
            password: "User password",
        });
    });

    it("should not be able to create a user with an email that is already registered", async () => {
        await createUserUseCase.execute({
            name: "User1 name",
            email: "User email",
            password: "User password",
        });

        await expect(
            createUserUseCase.execute({
                name: "User2 name",
                email: "User email",
                password: "User password",
            })
        ).rejects.toEqual(new AppError("User already exists"));
    });
});
