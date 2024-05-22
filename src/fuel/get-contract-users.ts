import { env } from "../config/env";
import { BN, Provider, Wallet, WalletUnlocked, Fuel , FUEL_BETA_5_NETWORK_URL, FUEL_NETWORK_URL} from "fuels";

import { GameScoreContractAbi__factory  } from "../sway-api";
import type { GameScoreContractAbi} from "../sway-api";


const CONTRACT_ID = env.CONTRACT_ID;
const privateKey = env.SIGNER_PRIVATE_KEY;

export async function get_sorted_players_profiles() {
  const provider = await Provider.create(FUEL_BETA_5_NETWORK_URL);
  const myWallet: WalletUnlocked = Wallet.fromPrivateKey(privateKey, provider);
  const counterContract = GameScoreContractAbi__factory.connect(CONTRACT_ID, myWallet);

  let list_players_raw;
  let decoded_users;

  const  players  = await counterContract.functions.players().get();
    list_players_raw = players.value.valueOf(); 
    decoded_users = list_players_raw.map(user => {
      return {
        username: "",
        highScore: parseInt(user.high_score.toString()).toFixed(2),
        playerId: parseInt(user.usernames_vector_index.toString()),
        username_and_email_hash: user.username_and_email_hash,
        username_hash: user.username_hash,        
        };
      }).sort((a, b) => b.highScore - a.highScore);
    

  // Loop to update username
  for (let i = 0; i < decoded_users.length; i++) {
    //decoded_users[i].username = String(decoded_users[i].playerId);
    let user_obj = await counterContract.functions.username(decoded_users[i].playerId).get();
    let user_name = user_obj.value.valueOf();
    decoded_users[i].username = user_name;
  }

  return decoded_users;
}

