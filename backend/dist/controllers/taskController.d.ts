import type { Request, Response, NextFunction } from "express";
type AuthenticatedRequest = Request & {
    user: {
        id: string;
    };
};
export declare const listTasks: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const createTask: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getTask: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateTask: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteTask: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const toggleTask: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export {};
//# sourceMappingURL=taskController.d.ts.map