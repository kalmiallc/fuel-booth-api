/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.82.0
  Forc version: 0.49.3
  Fuel-Core version: 0.22.1
*/

import type {
  BigNumberish,
  BN,
  Bytes,
  BytesLike,
  Contract,
  DecodedValue,
  FunctionFragment,
  Interface,
  InvokeFunction,
  StdString,
} from 'fuels';

import type { Option, Enum, Vec } from "./common";

export enum GetErrorInput { UsernameDoesNotExists = 'UsernameDoesNotExists', IndexIsOverMax = 'IndexIsOverMax' };
export enum GetErrorOutput { UsernameDoesNotExists = 'UsernameDoesNotExists', IndexIsOverMax = 'IndexIsOverMax' };
export enum SetErrorInput { ValueAlreadySet = 'ValueAlreadySet', UsernameExists = 'UsernameExists', UsernameAlreadyUsedEmail = 'UsernameAlreadyUsedEmail' };
export enum SetErrorOutput { ValueAlreadySet = 'ValueAlreadySet', UsernameExists = 'UsernameExists', UsernameAlreadyUsedEmail = 'UsernameAlreadyUsedEmail' };

export type PlayerProfileInput = { high_score: BigNumberish, username_hash: string, usernames_vector_index: BigNumberish, username_and_email_hash: string, has_email_set: boolean };
export type PlayerProfileOutput = { high_score: BN, username_hash: string, usernames_vector_index: BN, username_and_email_hash: string, has_email_set: boolean };
export type RawBytesInput = { ptr: BigNumberish, cap: BigNumberish };
export type RawBytesOutput = { ptr: BN, cap: BN };
export type ScoreInput = { time: BigNumberish, status: BigNumberish, distance: BigNumberish };
export type ScoreOutput = { time: BN, status: BN, distance: BN };
export type ScoreEventInput = { score: ScoreInput, username_hash: string };
export type ScoreEventOutput = { score: ScoreOutput, username_hash: string };

interface GameScoreContractAbiInterface extends Interface {
  functions: {
    player: FunctionFragment;
    players: FunctionFragment;
    register: FunctionFragment;
    scores: FunctionFragment;
    submit_score: FunctionFragment;
    total_players: FunctionFragment;
    username: FunctionFragment;
  };

  encodeFunctionData(functionFragment: 'player', values: [string]): Uint8Array;
  encodeFunctionData(functionFragment: 'players', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'register', values: [StdString, string]): Uint8Array;
  encodeFunctionData(functionFragment: 'scores', values: [string]): Uint8Array;
  encodeFunctionData(functionFragment: 'submit_score', values: [StdString, BigNumberish, BigNumberish, BigNumberish]): Uint8Array;
  encodeFunctionData(functionFragment: 'total_players', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'username', values: [BigNumberish]): Uint8Array;

  decodeFunctionData(functionFragment: 'player', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'players', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'register', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'scores', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'submit_score', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'total_players', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'username', data: BytesLike): DecodedValue;
}

export class GameScoreContractAbi extends Contract {
  interface: GameScoreContractAbiInterface;
  functions: {
    player: InvokeFunction<[username_hash: string], Option<PlayerProfileOutput>>;
    players: InvokeFunction<[], Vec<PlayerProfileOutput>>;
    register: InvokeFunction<[username: StdString, username_email_hash: string], PlayerProfileOutput>;
    scores: InvokeFunction<[username_hash: string], Vec<ScoreOutput>>;
    submit_score: InvokeFunction<[username: StdString, distance: BigNumberish, time: BigNumberish, status: BigNumberish], BN>;
    total_players: InvokeFunction<[], BN>;
    username: InvokeFunction<[vector_index: BigNumberish], StdString>;
  };
}
