import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';

export const IS_TESTNET = false;
export const NETWORK = IS_TESTNET ? STACKS_TESTNET : STACKS_MAINNET;

export const CONTRACT_ADDRESS = 'SP3BHPVZEKANVD62KDME41G0E02KGPMKRANWF5PQK';

export const HIRO_API = IS_TESTNET
  ? 'https://api.testnet.hiro.so'
  : 'https://api.hiro.so';

export const EXPLORER_CHAIN = IS_TESTNET ? '?chain=testnet' : '';

export function explorerTxUrl(txId: string) {
  return `https://explorer.hiro.so/txid/${txId}${EXPLORER_CHAIN}`;
}
export function explorerBlockUrl(blockHeight: number | string) {
  return `https://explorer.hiro.so/block/${blockHeight}${EXPLORER_CHAIN}`;
}
export function explorerAddressUrl(address: string) {
  return `https://explorer.hiro.so/address/${address}${EXPLORER_CHAIN}`;
}
