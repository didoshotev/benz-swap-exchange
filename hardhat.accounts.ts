import { config as dotenvConfig } from 'dotenv'
import { resolve } from 'path';
dotenvConfig({ path: resolve(__dirname, './.env') })

type NamedAccounts<AccountName extends string = string, NetworkName extends string = string> = Record<
    AccountName,
    string | number | Record<NetworkName, null | number | string>
>;

const balance = "100000000000000000000000";

const accounts = [
    {
        privateKey: process.env.DEPLOYER_PRIVATE_KEY || "",
        balance,
    },
    {
        privateKey: process.env.USER1_PRIVATE_KEY || "",
        balance
    }
];


const namedAccountsCollection: NamedAccounts = {
    deployer: 0,
    user1: 1
}


if (Object.values(accounts).length < 1) {
    throw new Error("Please check you've set all six different private keys in the .env file");
}

export { NamedAccounts, accounts, namedAccountsCollection }
