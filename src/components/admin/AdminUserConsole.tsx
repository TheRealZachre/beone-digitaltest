"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Shield, UserPlus, Users } from "lucide-react";
import type { PublicUser, UserRole } from "@/lib/auth/types";

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/20";

export function AdminUserConsole({
  initialUsers,
  scope = "platform",
}: {
  initialUsers: PublicUser[];
  scope?: "platform" | "analytics";
}) {
  const [users, setUsers] = useState(initialUsers);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const createTitle =
    scope === "analytics"
      ? "Create analytics user account"
      : "Create user account";
  const createDescription =
    scope === "analytics"
      ? "Grant access to BeOne Analytics reports and data sync. These credentials are separate from the main platform."
      : "Set a username and password so someone can sign in immediately.";
  const usersTitle =
    scope === "analytics" ? "Analytics users" : "Existing users";
  const usersDescription =
    scope === "analytics"
      ? `${users.length} analytics account${users.length === 1 ? "" : "s"} — independent from platform logins.`
      : `${users.length} account${users.length === 1 ? "" : "s"} in the system.`;

  const refreshUsers = useCallback(async () => {
    const response = await fetch("/api/admin/users");
    if (!response.ok) return;
    const data = (await response.json()) as { users: PublicUser[] };
    setUsers(data.users);
  }, []);

  useEffect(() => {
    void refreshUsers();
  }, [refreshUsers]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, username, password, role }),
      });

      const data = (await response.json()) as {
        error?: string;
        username?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Could not create user.");
        setLoading(false);
        return;
      }

      setSuccess(`Created account for @${data.username ?? username}.`);
      setName("");
      setEmail("");
      setUsername("");
      setPassword("");
      setRole("user");
      await refreshUsers();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-indigo/10 text-brand-indigo">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {createTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{createDescription}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Full name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClassName}
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Username
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="off"
              placeholder="jane.doe"
              className={inputClassName}
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClassName}
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Temporary password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              className={inputClassName}
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 md:col-span-2">
            Role
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
              className={inputClassName}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          {error && (
            <p className="md:col-span-2 text-sm text-rose-600">{error}</p>
          )}
          {success && (
            <p className="md:col-span-2 text-sm text-emerald-700">{success}</p>
          )}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-indigo px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-indigo-bright disabled:opacity-60"
            >
              <UserPlus className="h-4 w-4" />
              {loading ? "Creating…" : "Create user"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {usersTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{usersDescription}</p>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Username</th>
                <th className="px-3 py-2 font-medium">Email</th>
                <th className="px-3 py-2 font-medium">Role</th>
                <th className="px-3 py-2 font-medium">Sign-in</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100">
                  <td className="px-3 py-3 font-medium text-slate-900">
                    {user.name}
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {user.username ? `@${user.username}` : "—"}
                  </td>
                  <td className="px-3 py-3 text-slate-700">{user.email}</td>
                  <td className="px-3 py-3">
                    <span
                      className={
                        user.role === "admin"
                          ? "inline-flex items-center gap-1 rounded-full bg-brand-indigo/10 px-2.5 py-1 text-xs font-medium text-brand-indigo"
                          : "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                      }
                    >
                      {user.role === "admin" && <Shield className="h-3 w-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-600">
                    {user.hasPassword ? "Password" : "Google only"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
