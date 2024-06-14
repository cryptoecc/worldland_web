export interface AuthPayLoad {
  token: string;
  userId?: string;
  userNo?: bigint | undefined;
  userName?: string | undefined;
  userEmail?: string | undefined;
  userMobile?: string | undefined;
  userLevel?: string | undefined;
}
