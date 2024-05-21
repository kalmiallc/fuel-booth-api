import { env } from "../config/env";
import { BN, Provider, Wallet, WalletUnlocked, Fuel , FUEL_BETA_5_NETWORK_URL, FUEL_NETWORK_URL} from "fuels";
import { arrayify, hexlify, getRandomB256, Bytes, randomBytes } from 'fuels';
import { GameScoreContractAbi__factory  } from "../sway-api";
import type { GameScoreContractAbi} from "../sway-api";


const CONTRACT_ID = env.CONTRACT_ID;
const privateKey = env.SIGNER_PRIVATE_KEY;

export async function register_player_profile(username: string, email: string) {
  const provider = await Provider.create(FUEL_BETA_5_NETWORK_URL);
  const myWallet: WalletUnlocked = Wallet.fromPrivateKey(privateKey, provider);
  const counterContract = GameScoreContractAbi__factory.connect(CONTRACT_ID, myWallet);



  const bytes32: Bytes = randomBytes(32);
  const bytes32String: string = hexlify(bytes32);

  let username_email_hash = bytes32String;
  try {
    const callResult = await counterContract.functions
    .hash_and_register(username, username_email_hash)
    .call();

    if (callResult.value){
        let decoded_value = {
            email: email,
            register_transaction_id: callResult.transactionId,
            username: username,
            high_score: parseInt(callResult.value.high_score.toString()).toFixed(),
            player_id: parseInt(callResult.value.usernames_vector_index.toString()),
            username_and_email_hash: callResult.value.username_and_email_hash,
            username_hash: callResult.value.username_hash,        
            };
        return decoded_value;
    }
    return {
      email: "",
      register_transaction_id: "",
      username: "",
      high_score: 0,
      player_id: 0,
      username_and_email_hash: "",
      username_hash: ""
    }

} catch (error) {
    if (error instanceof Error && error.message.includes("UsernameExists")) {
      throw new Error("UsernameExists error: Username already exists On Chain");
    } else {
      throw error;
    }
  }

}
