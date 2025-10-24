import React, { createContext, useState, useEffect, useContext } from 'react';

const LocaleContext = createContext();

const translations = {
  id: {
    // Header
    appTitle: 'Aplikasi Catatan',
    active: 'Aktif',
    archived: 'Arsip',
    logout: 'Keluar',
    
    // Search
    searchPlaceholder: 'Cari catatan...',
    
    // Notes List
    noNotes: 'Tidak ada catatan',
    addNote: 'Tambah Catatan',
    
    // Note Detail
    archive: 'Arsipkan',
    unarchive: 'Aktifkan',
    delete: 'Hapus',
    back: 'Kembali',
    
    // Forms
    title: 'Judul',
    body: 'Isi Catatan',
    titlePlaceholder: 'Masukkan judul catatan...',
    bodyPlaceholder: 'Tuliskan isi catatan di sini...',
    titleRequired: 'Judul harus diisi',
    save: 'Simpan',
    
    // Auth
    login: 'Masuk',
    register: 'Daftar',
    name: 'Nama',
    email: 'Email',
    password: 'Kata Sandi',
    confirmPassword: 'Konfirmasi Kata Sandi',
    noAccount: 'Belum punya akun?',
    haveAccount: 'Sudah punya akun?',
    registerHere: 'Daftar di sini',
    loginHere: 'Masuk di sini',
    
    // Messages
    loading: 'Memuat...',
    loginSuccess: 'Login berhasil!',
    loginFailed: 'Login gagal. Periksa email dan password Anda.',
    registerSuccess: 'Registrasi berhasil! Silakan login.',
    registerFailed: 'Registrasi gagal.',
    noteAdded: 'Catatan berhasil ditambahkan!',
    noteArchived: 'Catatan berhasil diarsipkan!',
    noteUnarchived: 'Catatan berhasil diaktifkan!',
    noteDeleted: 'Catatan berhasil dihapus!',
    
    // 404
    notFound: 'Halaman tidak ditemukan',
    notFoundMessage: 'Halaman yang Anda cari tidak ditemukan.',
    backToHome: 'Kembali ke Beranda',
  },
  en: {
    // Header
    appTitle: 'Notes App',
    active: 'Active',
    archived: 'Archived',
    logout: 'Logout',
    
    // Search
    searchPlaceholder: 'Search notes...',
    
    // Notes List
    noNotes: 'No notes',
    addNote: 'Add Note',
    
    // Note Detail
    archive: 'Archive',
    unarchive: 'Unarchive',
    delete: 'Delete',
    back: 'Back',
    
    // Forms
    title: 'Title',
    body: 'Note Content',
    titlePlaceholder: 'Enter note title...',
    bodyPlaceholder: 'Write your note here...',
    titleRequired: 'Title is required',
    save: 'Save',
    
    // Auth
    login: 'Login',
    register: 'Register',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    registerHere: 'Register here',
    loginHere: 'Login here',
    
    // Messages
    loading: 'Loading...',
    loginSuccess: 'Login successful!',
    loginFailed: 'Login failed. Check your email and password.',
    registerSuccess: 'Registration successful! Please login.',
    registerFailed: 'Registration failed.',
    noteAdded: 'Note added successfully!',
    noteArchived: 'Note archived successfully!',
    noteUnarchived: 'Note unarchived successfully!',
    noteDeleted: 'Note deleted successfully!',
    
    // 404
    notFound: 'Page Not Found',
    notFoundMessage: 'The page you are looking for does not exist.',
    backToHome: 'Back to Home',
  }
};

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem('locale') || 'id';
  });

  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  const toggleLocale = () => {
    setLocale(prevLocale => prevLocale === 'id' ? 'en' : 'id');
  };

  const t = (key) => {
    return translations[locale][key] || key;
  };

  return (
    <LocaleContext.Provider value={{ locale, toggleLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}