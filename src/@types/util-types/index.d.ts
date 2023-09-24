// export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
//   T,
//   Exclude<keyof T, Keys>
// > & {
//   [K in Keys]-?: Required<Pick<T, K>> &
//     Partial<Record<Exclude<Keys, K>, undefined>>;
// };

export type OnlyOneProperty<T> = {
	[K in keyof T]: Pick<T, K> & Partial<Record<Exclude<keyof T, K>, never>>
}[keyof T]
