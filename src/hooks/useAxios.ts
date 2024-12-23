import { useCallback } from "react";
import axios, { AxiosError, type AxiosInstance } from "axios";
import axiosRetry from "axios-retry";
import { auth } from "@libs/firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { useToast } from "./shadcn/useToast";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
function useAxios() {
  const { toast } = useToast();

  const createAxiosInstance = useCallback(
    (userController?: AbortController | undefined): AxiosInstance => {
      const controller =
        userController === undefined ? new AbortController() : userController;

      const axiosInstance = axios.create({
        signal: controller.signal,
        baseURL: VITE_BACKEND_URL,
        validateStatus: (status) => {
          return status >= 200 && status < 500;
        },
      });

      axiosRetry(axiosInstance, {
        retries: 3,
        retryDelay: axiosRetry.exponentialDelay,
        retryCondition: (error) => {
          if (error.response === undefined && error.request === undefined) {
            return false;
          } else if (error.response === undefined) {
            return true;
          } else {
            if (error.response.status === 401) {
              return true;
            } else if (error.response.status >= 500) {
              return true;
            } else {
              return false;
            }
          }
        },
        onRetry: (retryCount, error, req) => {
          if (
            retryCount === 1 &&
            error.response &&
            error.response.status === 401
          ) {
            onAuthStateChanged(auth, async (user) => {
              if (user !== null) {
                req.headers = {
                  ...req.headers,
                  Authorization: `Bearer ${await user.getIdToken()}`,
                };
              }
            });
          }

          if (
            retryCount === 2 &&
            error.response &&
            error.response.status === 401
          ) {
            controller.abort();
            throw error;
          }
        },
      });

      axiosInstance.interceptors.response.use(
        (response) => {
          return response;
        },
        (error: AxiosError) => {
          if (error.response === undefined && error.request === undefined) {
            toast({
              description:
                "Terjadi kesalahan yang tak terduga saat memproses permintaan Anda",
              variant: "destructive",
            });
          } else if (error.response === undefined) {
            toast({
              description:
                "Terjadi kesalahan jaringan saat memproses permintaan Anda. Periksa koneksi Anda dan coba lagi",
              variant: "destructive",
            });
          } else {
            if (error.response.status === 401) {
              toast({
                description:
                  "Sesi Anda Telah Berakhir. Anda akan dialihkan ke halaman login dalam 3 detik",
                variant: "destructive",
              });

              setTimeout(() => {
                auth.signOut();
              }, 3000);
            } else if (error.response.status >= 500) {
              toast({
                description:
                  "Terjadi kesalahan pada server saat memproses permintaan Anda. Silakan coba lagi nanti",
                variant: "destructive",
              });
            }

            return Promise.reject(error.response);
          }
        }
      );

      return axiosInstance;
    },
    [toast]
  );

  return createAxiosInstance;
}

export { useAxios };
