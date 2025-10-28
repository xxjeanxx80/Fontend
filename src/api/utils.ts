import type { AxiosError } from 'axios';

type ErrorWithMessage = {
  message?: string;
  error?: string;
  response?: {
    data?: {
      message?: string | string[];
      error?: string;
    };
  };
};

export const extractErrorMessage = (error: unknown): string => {
  const defaultMessage = 'Something went wrong. Please try again.';
  const axiosError = error as AxiosError<ErrorWithMessage> | undefined;
  if (!axiosError) {
    return defaultMessage;
  }

  const responseMessage = axiosError.response?.data?.message;
  if (Array.isArray(responseMessage)) {
    return responseMessage.join(', ');
  }
  if (typeof responseMessage === 'string' && responseMessage.length > 0) {
    return responseMessage;
  }

  if (axiosError.response?.data?.error) {
    return axiosError.response.data.error;
  }

  if (axiosError.message) {
    return axiosError.message;
  }

  return defaultMessage;
};

export const formatCurrency = (value: number | undefined, currency = 'USD') => {
  if (value === undefined || Number.isNaN(value)) {
    return '—';
  }
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toFixed(0)} ${currency}`;
  }
};

export const formatDateTime = (value: string | Date | undefined) => {
  if (!value) {
    return '—';
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};
