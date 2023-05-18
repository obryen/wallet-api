import { Account } from "src/account/schemas/account.schema";
import { AccountBalance } from "../schemas/account-balance.schema";

export interface IValidateTransferResult {
    senderAccount: Account;
    senderBalance: AccountBalance;
    recipientAccount: Account;
    recipientBalance: AccountBalance;
};