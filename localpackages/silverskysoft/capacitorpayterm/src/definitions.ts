export interface PaytermPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
