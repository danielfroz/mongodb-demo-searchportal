export const AccountStatusValues = [
  'Activated',
  'Invite pending',
  'Not invited'
] as const

export type AccountStatus = typeof AccountStatusValues[number]