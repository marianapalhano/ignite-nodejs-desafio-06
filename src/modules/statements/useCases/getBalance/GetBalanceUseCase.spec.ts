import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("List Statement Operations and Balance", () => {
    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        getBalanceUseCase = new GetBalanceUseCase(
            inMemoryStatementsRepository,
            inMemoryUsersRepository
        );
    });

    it("should be able to list all statement operations of a user and balance", async () => {
        const user = await inMemoryUsersRepository.create({
            name: "Mock User",
            email: "mock@email.com",
            password: "Password",
        });

        const statement = await inMemoryStatementsRepository.create({
          user_id: user.id || "",
          type: OperationType.WITHDRAW,
          amount: 99,
          description: "Mock withdraw"
        });

        const operations = await getBalanceUseCase.execute({
          user_id: user.id || ""
        });
        expect(operations).toHaveProperty("balance");
        expect(operations.statement).toEqual([statement]);
    });
});
