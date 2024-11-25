import { query } from "../utils/db";
import { getAccount } from "./accountHandler";

export const withdrawal = async (accountID: string, amount: number) => {
  if (amount > 200) {
    throw new Error("Widthdrawl amount too large")
  }
  if (amount % 5 !== 0) {
    throw new Error("Widthdrawl amount may only be in increments of 5")
  }

  const account = await getAccount(accountID);
  if (amount + account.todays_widthdrawals > 400) {
    throw new Error("Daily Widthdrawal limit reached")
  }


  if (amount > account.amount && account.type !== 'credit') {
    throw new Error("Insufficient Funds")
  }

  if (account.type === 'credit' && -(account.amount - amount) > account.credit_limit) {
    throw new Error("Insufficient Credit")
  }

  account.amount -= amount;
  account.todays_widthdrawals += amount;

  const res = await query(`
    UPDATE accounts
    SET amount = $1,
        todays_widthdrawals = $2
    WHERE account_number = $3`,
    [account.amount, account.todays_widthdrawals, accountID]
  );

  if (res.rowCount === 0) {
    throw new Error("Transaction failed");
  }

  return account;
}

export const deposit = async (accountID: string, amount: number) => {
  if (amount > 1000) {
    throw new Error("Deposit amount too large")
  }

  const account = await getAccount(accountID);

  if (account.type === 'credit' &&  account.amount + amount > 0) {
    throw new Error("Deposit amount greater than owed")
  }

  account.amount += amount;
  const res = await query(`
    UPDATE accounts
    SET amount = $1 
    WHERE account_number = $2`,
    [account.amount, accountID]
  );

  if (res.rowCount === 0) {
    throw new Error("Transaction failed");
  }

  return account;
}