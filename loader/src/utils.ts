/**
 * Utils code
 */
export const sleep = (secs: number) => new Promise(resolve => setTimeout(resolve, secs * 1000))