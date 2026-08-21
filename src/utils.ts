export const getStorageKey = (baseKey: string) => {
  const email = localStorage.getItem('current_user_email');
  return email ? `${baseKey}_${email}` : baseKey;
};
