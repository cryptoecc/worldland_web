const LOCAL_STORAGE_TOKEN_KEY_NAME = 'token';

export default class TokenService {
  private static _token: string | undefined;

  public static get(): string | undefined {
    return this._token;
  }

  public static set(token: string): void {
    this._token = token;
  }

  public static remove(): void {
    console.log('remove');
    this._token = undefined;
  }
}

// export default class TokenService {
//   public static get(): string | null {
//     return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY_NAME);
//   }

//   public static set(token: string): void {
//     localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY_NAME, token);
//   }

//   public static remove(): void {
//     localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY_NAME);
//   }
// }
