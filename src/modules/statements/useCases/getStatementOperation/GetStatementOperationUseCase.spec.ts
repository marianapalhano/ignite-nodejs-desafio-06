import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement Operation", () => {
    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        getStatementOperationUseCase = new GetStatementOperationUseCase(
            inMemoryUsersRepository,
            inMemoryStatementsRepository
        );
    });

    it("should be able to get a statement operation", async () => {
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

        const operation = await getStatementOperationUseCase.execute({
          user_id: user.id || "",
          statement_id: statement.id || ""
        });
        expect(operation).toEqual(statement);
    });
});
