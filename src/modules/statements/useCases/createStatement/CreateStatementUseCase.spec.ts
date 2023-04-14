import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {
    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createStatementUseCase = new CreateStatementUseCase(
            inMemoryUsersRepository,
            inMemoryStatementsRepository
        );
    });

    it("should be able to make a deposit", async () => {
        const user = await inMemoryUsersRepository.create({
            name: "User name",
            email: "User email",
            password: "User password",
        });
        const statement = {
            user_id: user.id || "",
            type: OperationType.DEPOSIT,
            amount: 99,
            description: "Statement description Test",
        };
        const createdStatement = await createStatementUseCase.execute(statement);
        const savedStatement = await inMemoryStatementsRepository.findStatementOperation({
            statement_id: createdStatement.id || "",
            user_id: createdStatement.user_id
        });

        expect(savedStatement).toHaveProperty("id");
    });

    it("should be able to make a withdraw", async () => {
      const user = await inMemoryUsersRepository.create({
          name: "User name",
          email: "User email",
          password: "User password",
      });
      const depositStatement = {
        user_id: user.id || "",
        type: OperationType.DEPOSIT,
        amount: 200,
        description: "Deposit Test",
    };
      const statement = {
          user_id: user.id || "",
          type: OperationType.WITHDRAW,
          amount: 99,
          description: "Withdraw Test",
      };
      await createStatementUseCase.execute(depositStatement);
      const createdStatement = await createStatementUseCase.execute(statement);
      const savedStatement = await inMemoryStatementsRepository.findStatementOperation({
          statement_id: createdStatement.id || "",
          user_id: createdStatement.user_id
      });

      expect(savedStatement).toHaveProperty("id");
  });
});
