export declare const generateTokens: (userId: string) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare const revokeRefreshToken: (refreshToken: string) => Promise<void>;
export declare const rotateRefreshToken: (refreshToken: string) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
//# sourceMappingURL=tokenService.d.ts.map