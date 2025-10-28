/*
 * Minimal jwt-decode implementation vendored for offline environments.
 * Based on the MIT-licensed https://github.com/auth0/jwt-decode project.
 */

export interface JwtDecodeOptions {
  header?: boolean;
}

const decodeBase64 = (encoded: string): string => {
  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    return window.atob(encoded);
  }
  if (typeof globalThis.Buffer !== 'undefined') {
    return Buffer.from(encoded, 'base64').toString('binary');
  }
  throw new Error('Failed to determine base64 decoder.');
};

const decodeBase64Url = (input: string): string => {
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = base64.length % 4;
  if (padding === 2) {
    base64 += '==';
  } else if (padding === 3) {
    base64 += '=';
  } else if (padding !== 0) {
    throw new Error('Invalid base64 string.');
  }

  const binary = decodeBase64(base64);
  try {
    return decodeURIComponent(
      Array.from(binary)
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    );
  } catch {
    return binary;
  }
};

export function jwtDecode<T = unknown>(token: string, options: JwtDecodeOptions = {}): T {
  if (typeof token !== 'string') {
    throw new Error('Invalid token specified.');
  }

  const segments = token.replace(/=+$/, '').split('.');
  if (segments.length < 2) {
    throw new Error('Invalid token: missing payload segment.');
  }

  const segment = options.header ? segments[0] : segments[1];
  const decoded = decodeBase64Url(segment);

  try {
    return JSON.parse(decoded) as T;
  } catch {
    throw new Error('Failed to parse JWT payload.');
  }
}

export default jwtDecode;
