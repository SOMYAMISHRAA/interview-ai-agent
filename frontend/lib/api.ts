/**
 * lib/api.ts
 *
 * Generic HTTP request wrapper.
 *
 * Components should never import this directly.
 * API calls should go through services/interview.ts.
 */

import { ApiError } from "@/types/interview";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    signal,
  } = options;

  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
      signal,
    });
  } catch {
    throw new ApiError(
      "We couldn't reach the interview service. Check that the backend is running and reachable."
    );
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;

    try {
      const data = await response.json();

      if (typeof data?.detail === "string") {
        message = data.detail;
      } else if (typeof data?.message === "string") {
        message = data.message;
      }
    } catch {
      // Response body wasn't JSON.
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError(
      "The interview service returned an unexpected response."
    );
  }
}