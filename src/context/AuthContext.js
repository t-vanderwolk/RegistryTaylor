import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext({
  authorized: false,
  setAuthorized: () => {},
  memberName: "",
  setMemberName: () => {},
  dueDate: "",
  setDueDate: () => {},
  monthsPregnant: null,
  setMonthsPregnant: () => {},
  originalDueDate: "",
  setOriginalDueDate: () => {},
  gender: "",
  setGender: () => {},
  babyName: "",
  setBabyName: () => {},
  username: "",
  setUsername: () => {},
  passwordHash: "",
  setPasswordHash: () => {},
});

export const AuthProvider = ({ children }) => {
  const [authorized, setAuthorized] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [dueDate, setDueDate] = useState(""); // ISO string
  const [monthsPregnant, setMonthsPregnant] = useState(null);
  const [originalDueDate, setOriginalDueDate] = useState("");
  const [gender, setGender] = useState(""); // "girl" | "boy" | ""
  const [babyName, setBabyName] = useState("");
  const [username, setUsername] = useState("");
  const [passwordHash, setPasswordHash] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("tm_authorized");
    if (stored === "true") setAuthorized(true);
    const storedName = localStorage.getItem("tm_member_name");
    if (storedName) setMemberName(storedName);
    const storedDue = localStorage.getItem("tm_due_date");
    if (storedDue) setDueDate(storedDue);
    const storedMonths = localStorage.getItem("tm_months_pregnant");
    if (storedMonths) setMonthsPregnant(Number(storedMonths));
    const storedOriginalDue = localStorage.getItem("tm_original_due_date");
    if (storedOriginalDue) setOriginalDueDate(storedOriginalDue);
    const storedGender = localStorage.getItem("tm_gender");
    if (storedGender) setGender(storedGender);
    const storedBaby = localStorage.getItem("tm_baby_name");
    if (storedBaby) setBabyName(storedBaby);
    const storedUsername = localStorage.getItem("tm_username");
    if (storedUsername) setUsername(storedUsername);
    const storedPwd = localStorage.getItem("tm_password_hash");
    if (storedPwd) setPasswordHash(storedPwd);
  }, []);

  useEffect(() => {
    localStorage.setItem("tm_authorized", authorized ? "true" : "false");
  }, [authorized]);

  useEffect(() => {
    if (memberName) localStorage.setItem("tm_member_name", memberName);
    else localStorage.removeItem("tm_member_name");
  }, [memberName]);

  useEffect(() => {
    if (dueDate) localStorage.setItem("tm_due_date", dueDate);
    else localStorage.removeItem("tm_due_date");
  }, [dueDate]);

  useEffect(() => {
    if (monthsPregnant != null) localStorage.setItem("tm_months_pregnant", String(monthsPregnant));
    else localStorage.removeItem("tm_months_pregnant");
  }, [monthsPregnant]);

  useEffect(() => {
    if (originalDueDate) localStorage.setItem("tm_original_due_date", originalDueDate);
    else localStorage.removeItem("tm_original_due_date");
  }, [originalDueDate]);

  useEffect(() => {
    if (gender) localStorage.setItem("tm_gender", gender);
    else localStorage.removeItem("tm_gender");
  }, [gender]);

  useEffect(() => {
    if (babyName) localStorage.setItem("tm_baby_name", babyName);
    else localStorage.removeItem("tm_baby_name");
  }, [babyName]);

  useEffect(() => {
    if (username) localStorage.setItem("tm_username", username);
    else localStorage.removeItem("tm_username");
  }, [username]);

  useEffect(() => {
    if (passwordHash) localStorage.setItem("tm_password_hash", passwordHash);
    else localStorage.removeItem("tm_password_hash");
  }, [passwordHash]);

  const value = useMemo(
    () => ({
      authorized,
      setAuthorized,
      memberName,
      setMemberName,
      dueDate,
      setDueDate,
      monthsPregnant,
      setMonthsPregnant,
      originalDueDate,
      setOriginalDueDate,
      gender,
      setGender,
      babyName,
      setBabyName,
      username,
      setUsername,
      passwordHash,
      setPasswordHash,
    }),
    [authorized, memberName, dueDate, monthsPregnant, originalDueDate, gender, babyName, username, passwordHash]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
