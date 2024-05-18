import { env } from "../config/env";
import { BN, Provider, Wallet, WalletUnlocked, Fuel , FUEL_BETA_5_NETWORK_URL, FUEL_NETWORK_URL} from "fuels";
import { arrayify, hexlify, getRandomB256, Bytes, randomBytes } from 'fuels';
import { GameScoreContractAbi__factory  } from "../sway-api";
import type { GameScoreContractAbi} from "../sway-api";


const CONTRACT_ID = env.CONTRACT_ID;
const privateKey = env.SIGNER_PRIVATE_KEY;

export async function submit_final_score(username: string, time_seconds: number, damage: number) {
  const provider = await Provider.create(FUEL_BETA_5_NETWORK_URL);
  const myWallet: WalletUnlocked = Wallet.fromPrivateKey(privateKey, provider);
  const counterContract = GameScoreContractAbi__factory.connect(CONTRACT_ID, myWallet);

  try {
    const callResult = await counterContract.functions
    .hash_and_submit_score(username, 0, damage, time_seconds, 0, 1)
    .call();
    return callResult.value;

} catch (error) {
    if (error instanceof Error && error.message.includes("UsernameDoesNotExists")) {
      throw new Error("UsernameDoesNotExists error: Username does not exists On Chain");
    } else {
      throw error;
    }
  }

}

export async function submit_track_score(username: string, time_seconds: number, damage: number, distance: number, speed: number) {
    const provider = await Provider.create(FUEL_BETA_5_NETWORK_URL);
    const myWallet: WalletUnlocked = Wallet.fromPrivateKey(privateKey, provider);
    const counterContract = GameScoreContractAbi__factory.connect(CONTRACT_ID, myWallet);
  
    try {
        const callResult = await counterContract.functions
        .hash_and_submit_score(username, distance, damage, time_seconds, speed, 0)
        .call();
        return callResult.value;
  
  } catch (error) {
      if (error instanceof Error && error.message.includes("UsernameDoesNotExists")) {
        throw new Error("UsernameDoesNotExists error: Username does not exists On Chain");
      } else {
        throw error;
      }
    }
  
  }