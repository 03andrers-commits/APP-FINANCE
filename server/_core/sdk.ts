import type { Request } from "express";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface SessionPayload {
  userId: string;
  email?: string;
  name?: string;
  iat?: number;
  exp?: number;
}

class AuthService {
  /**
   * Verify JWT token from request
   */
  async authenticateRequest(req: Request): Promise<{ id: string; email?: string; name?: string } | null> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return null;
      }

      const token = authHeader.slice(7);
      const decoded = jwt.verify(token, JWT_SECRET) as SessionPayload;

      return {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name,
      };
    } catch (err) {
      return null;
    }
  }

  /**
   * Generate JWT token
   */
  generateToken(userId: string, email?: string, name?: string): string {
    const payload: SessionPayload = {
      userId,
      email,
      name,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  }

  /**
   * Verify token
   */
  verifyToken(token: string): SessionPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as SessionPayload;
    } catch (err) {
      return null;
    }
  }
}

export const sdk = new AuthService();
