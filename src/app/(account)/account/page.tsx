"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/auth/AuthProvider";
import styles from "./account.module.scss";

export default function AccountPage() {
  const { accessToken, user, isBootstrapping, logout, fetchMe } = useAuth();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!isBootstrapping && !accessToken) {
      router.push("/login");
    }
  }, [accessToken, isBootstrapping, router]);

  if (isBootstrapping) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!accessToken) {
    return null;
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchMe();
    } catch {
      // Error handled by fetchMe
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p>Failed to load user data.</p>
          <button onClick={handleRefresh} className={styles.refreshButton} disabled={isRefreshing}>
            {isRefreshing ? "Retrying..." : "Retry"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Account</h1>
        <button onClick={logout} className={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>User Information</h2>
          <button onClick={handleRefresh} className={styles.refreshButton} disabled={isRefreshing}>
            {isRefreshing ? "Refreshing..." : "Refresh My Info"}
          </button>
        </div>
        <pre className={styles.userInfo}>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  );
}
