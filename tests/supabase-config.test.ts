import { describe, it, expect } from 'vitest';

describe('Supabase Configuration', () => {
  it('should have required environment variables set', () => {
    expect(process.env.SUPABASE_URL).toBeDefined();
    expect(process.env.SUPABASE_ANON_KEY).toBeDefined();
    expect(process.env.SUPABASE_SERVICE_ROLE_KEY).toBeDefined();
    expect(process.env.EXPO_PUBLIC_API_URL).toBeDefined();
  });

  it('should have valid Supabase URL format', () => {
    const url = process.env.SUPABASE_URL;
    expect(url).toMatch(/^https:\/\/.*\.supabase\.co$/);
  });

  it('should have non-empty API keys', () => {
    expect(process.env.SUPABASE_ANON_KEY).toBeTruthy();
    expect(process.env.SUPABASE_SERVICE_ROLE_KEY).toBeTruthy();
  });

  it('should have valid API URL or Supabase key', () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;
    expect(apiUrl || supabaseKey).toBeDefined();
  });
});
