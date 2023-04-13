import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(
            inMemoryUsersRepository
        );
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    });

    it("should be able to access a user's profile", async () => {
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

        await showUserProfileUseCase.execute(result.user.id || "");
    });

    it("should not be able to access a nonexistent user's profile", () => {
        expect(async () => {
            await showUserProfileUseCase.execute("mock1234id");
        }).rejects.toBeInstanceOf(ShowUserProfileError);
    });
});
