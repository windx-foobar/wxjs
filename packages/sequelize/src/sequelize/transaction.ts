import { type Transaction, type Sequelize } from 'sequelize';

export async function useTransaction(
  sequelize: Sequelize,
  fn: (transaction: Transaction) => any | Promise<any>
): Promise<ReturnType<typeof fn>> {
  let transaction: Transaction | null = null;

  try {
    transaction = await sequelize.transaction();

    const result = fn(transaction);
    if (result instanceof Promise) {
      await result;
    }

    await transaction.commit();
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw error;
  }
}
