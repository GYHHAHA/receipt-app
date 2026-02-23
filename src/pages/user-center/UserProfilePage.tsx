import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Users,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface UserRecord {
  id: number;
  avatar: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone: string;
  mobile: string;
  lastLogin: string;
  status: "active" | "inactive";
}

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  status: "active" | "inactive";
}

const emptyForm: UserFormData = {
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  phone: "",
  mobile: "",
  password: "",
  confirmPassword: "",
  status: "active",
};

const demoUsers: UserRecord[] = [];

const inputClass =
  "w-full rounded-xl border border-card-border bg-content-bg px-4 py-2.5 text-sm text-content-text placeholder-sidebar-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all";

const selectClass =
  "w-full rounded-xl border border-card-border bg-content-bg px-4 py-2.5 text-sm text-content-text appearance-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all cursor-pointer";

const labelClass = "block text-xs font-medium text-sidebar-text mb-1.5";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export default function UserProfilePage() {
  const { t } = useTranslation();

  const [users] = useState<UserRecord[]>(demoUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [form, setForm] = useState<UserFormData>(emptyForm);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q)
    );
  }, [searchQuery, users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const openAddModal = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (user: UserRecord) => {
    setEditingUser(user);
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      mobile: user.mobile,
      password: "",
      confirmPassword: "",
      status: user.status,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingUser(null);
    setForm(emptyForm);
  };

  const columns = [
    { key: "colIndex", width: "w-12" },
    { key: "colAvatar", width: "w-16" },
    { key: "colEmail", width: "w-auto" },
    { key: "colFirstName", width: "w-auto" },
    { key: "colLastName", width: "w-auto" },
    { key: "colRole", width: "w-auto" },
    { key: "colPhone", width: "w-auto" },
    { key: "colMobile", width: "w-auto" },
    { key: "colLastLogin", width: "w-auto" },
    { key: "colStatus", width: "w-20" },
    { key: "colEdit", width: "w-16" },
    { key: "colDelete", width: "w-16" },
  ];

  return (
    <div className="min-h-full p-6 md:p-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-content-text">
              {t("userProfile.pageTitle")}
            </h1>
            <p className="text-sidebar-text text-sm">
              {t("userProfile.pageSubtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 pb-4 flex flex-col md:flex-row items-start md:items-center gap-4">
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary-hover transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {t("userProfile.addNewUser")}
          </button>

          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sidebar-text pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t("userProfile.searchPlaceholder")}
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        {/* Table */}
        <div className="px-6 pb-2 overflow-x-auto">
          <div className="rounded-xl border border-card-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-content-bg">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`${col.width} px-3 py-3 text-left text-xs font-semibold text-sidebar-text uppercase tracking-wider whitespace-nowrap`}
                    >
                      {t(`userProfile.${col.key}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-12 text-center text-sidebar-text text-sm"
                    >
                      {t("userProfile.noRecords")}
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user, idx) => (
                    <tr
                      key={user.id}
                      className="hover:bg-sidebar-hover/50 transition-colors"
                    >
                      <td className="px-3 py-3 text-content-text">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="px-3 py-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-content-text">
                        {user.email}
                      </td>
                      <td className="px-3 py-3 text-content-text">
                        {user.firstName}
                      </td>
                      <td className="px-3 py-3 text-content-text">
                        {user.lastName}
                      </td>
                      <td className="px-3 py-3 text-content-text">
                        {user.role}
                      </td>
                      <td className="px-3 py-3 text-content-text">
                        {user.phone}
                      </td>
                      <td className="px-3 py-3 text-content-text">
                        {user.mobile}
                      </td>
                      <td className="px-3 py-3 text-content-text whitespace-nowrap">
                        {user.lastLogin}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            user.status === "active"
                              ? "bg-emerald-400/15 text-emerald-500"
                              : "bg-gray-400/15 text-gray-500"
                          }`}
                        >
                          {user.status === "active"
                            ? t("userProfile.statusActive")
                            : t("userProfile.statusInactive")}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <button
                          onClick={() => openEditModal(user)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="px-3 py-3">
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="px-6 pb-6 pt-3 flex items-center justify-end gap-4 text-sm text-sidebar-text">
          <div className="flex items-center gap-2">
            <span>{t("userProfile.itemsPerPage")}</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-card-border bg-content-bg px-2 py-1 text-sm text-content-text appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <span className="text-content-text">
            {filteredUsers.length === 0
              ? `0 ${t("userProfile.of")} 0`
              : `${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, filteredUsers.length)} ${t("userProfile.of")} ${filteredUsers.length}`}
          </span>

          <div className="flex items-center gap-1">
            <PagBtn
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </PagBtn>
            <PagBtn
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </PagBtn>
          </div>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {modalOpen && (
        <UserModal
          editingUser={editingUser}
          form={form}
          setForm={setForm}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

function UserModal({
  editingUser,
  form,
  setForm,
  onClose,
}: {
  editingUser: UserRecord | null;
  form: UserFormData;
  setForm: React.Dispatch<React.SetStateAction<UserFormData>>;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const panelRef = useRef<HTMLDivElement>(null);
  const isEdit = !!editingUser;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const updateField = (field: keyof UserFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={panelRef}
        className="w-full max-w-lg bg-card-bg border border-card-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-primary to-primary-light px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">
              {isEdit
                ? t("userProfile.editUserTitle")
                : t("userProfile.addUserTitle")}
            </h2>
            <p className="text-white/70 text-xs mt-0.5">
              {isEdit
                ? t("userProfile.editUserSubtitle")
                : t("userProfile.addUserSubtitle")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4">
          {/* First Name / Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                {t("userProfile.firstName")}
                <span className="text-red-400 ml-0.5">*</span>
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                {t("userProfile.lastName")}
                <span className="text-red-400 ml-0.5">*</span>
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>
              {t("userProfile.email")}
              <span className="text-red-400 ml-0.5">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Role / Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t("userProfile.role")}</label>
              <select
                value={form.role}
                onChange={(e) => updateField("role", e.target.value)}
                className={selectClass}
              >
                <option value="">{t("userProfile.pleaseSelectOne")}</option>
                <option value="admin">{t("userProfile.roleAdmin")}</option>
                <option value="user">{t("userProfile.roleUser")}</option>
                <option value="viewer">{t("userProfile.roleViewer")}</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>{t("userProfile.status")}</label>
              <select
                value={form.status}
                onChange={(e) =>
                  updateField("status", e.target.value)
                }
                className={selectClass}
              >
                <option value="active">
                  {t("userProfile.statusActive")}
                </option>
                <option value="inactive">
                  {t("userProfile.statusInactive")}
                </option>
              </select>
            </div>
          </div>

          {/* Phone / Mobile */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t("userProfile.phone")}</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t("userProfile.mobile")}</label>
              <input
                type="tel"
                value={form.mobile}
                onChange={(e) => updateField("mobile", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Password / Confirm */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t("userProfile.password")}</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                {t("userProfile.confirmPassword")}
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-card-border flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-sidebar-text bg-content-bg border border-card-border hover:bg-sidebar-hover transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
            {t("userProfile.cancel")}
          </button>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary-hover transition-colors cursor-pointer">
            <Save className="w-4 h-4" />
            {t("userProfile.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

function PagBtn({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 rounded-lg flex items-center justify-center border border-card-border text-sidebar-text hover:bg-sidebar-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
    >
      {children}
    </button>
  );
}
