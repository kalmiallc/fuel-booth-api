import { env } from "../config/env";
import {
  BN,
  Provider,
  Wallet,
  WalletUnlocked,
  Fuel,
  FUEL_BETA_5_NETWORK_URL,
  FUEL_NETWORK_URL,
} from "fuels";
import { arrayify, hexlify, getRandomB256, Bytes, randomBytes } from "fuels";
import { GameScoreContractAbi__factory } from "../sway-api";
import { ScoreType } from "../config/values";

const CONTRACT_ID = env.CONTRACT_ID;
const privateKey = env.SIGNER_PRIVATE_KEY;

// onDestroy in Game has to call this
export async function submitRaceScore(
  scoreType: ScoreType,
  username: string,
  time_seconds: number,
  distance: number
) {
  const provider = await Provider.create(FUEL_BETA_5_NETWORK_URL);
  const myWallet: WalletUnlocked = Wallet.fromPrivateKey(privateKey, provider);
  const counterContract = GameScoreContractAbi__factory.connect(
    CONTRACT_ID,
    myWallet
  );
  
  let numericScoreType: number;
  if (typeof scoreType === 'string') {
    numericScoreType = ScoreType[scoreType as keyof typeof ScoreType];
  } else {
    numericScoreType = scoreType;
  }
  console.log("numericScoreType-------------------- ");
  console.log(numericScoreType);
  try {
    const callResult = await counterContract.functions
      .submit_score(
        username,
        distance,
        time_seconds,
        numericScoreType
      )
      .call();
    const high_score = callResult.value.valueOf();
    console.log("callResult.value high_score-------------------- ");
    console.log(high_score);
    return {
      transactionId: callResult.transactionId,
      high_score: callResult.value.valueOf(),
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("UsernameDoesNotExists")
    ) {
      throw new Error(
        "UsernameDoesNotExists error: Username does not exists On Chain"
      );
    } else {
      throw error;
    }
  }
}
