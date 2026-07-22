/**
 * Java backend ke raw SQL responses column names ko (jaise user_id, full_name,
 * payment_created_at) as-is snake_case me lauta dete hain kyunki DAO layer
 * (AliasToEntityMapResultTransformer) SQL alias ko exactly wahi rakhta hai.
 * Frontend ka baaki poora code camelCase (userId, fullName) expect karta hai,
 * isliye har HTTP response ko is util se camelCase me convert kar dete hain
 * (HttpInterceptor ke through) taaki components/templates ko badalna na pade.
 */

export function snakeToCamel(key: string): string {
  return key.replace(/_([a-zA-Z0-9])/g, (_match, chr: string) => chr.toUpperCase());
}

export function toCamelCase<T = any>(input: any): T {
  if (Array.isArray(input)) {
    return input.map((item) => toCamelCase(item)) as any;
  }

  if (input !== null && typeof input === 'object' && !(input instanceof Date) && !(input instanceof File) && !(input instanceof Blob)) {
    const output: any = {};
    for (const key of Object.keys(input)) {
      output[snakeToCamel(key)] = toCamelCase(input[key]);
    }
    return output;
  }

  return input;
}
