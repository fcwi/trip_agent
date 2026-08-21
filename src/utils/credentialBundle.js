const CREDENTIAL_DEFINITIONS = [
  {
    key: "apiKey",
    payloadKey: "apiKey",
    required: true,
    isValid: (value) => value.length > 10,
  },
  {
    key: "mapsApiKey",
    payloadKey: "mapsApiKey",
    isValid: (value) => value.length > 5,
  },
  {
    key: "gasUrl",
    payloadKey: "gasUrl",
    isValid: (value) => /^https?:\/\//i.test(value),
  },
  {
    key: "gasToken",
    payloadKey: "gasToken",
    isValid: (value) => value.length > 0,
  },
  {
    key: "maptilerKey",
    payloadKey: "maptilerKey",
    isValid: (value) => value.length > 0,
  },
];

export const EMPTY_CREDENTIALS = Object.freeze(
  Object.fromEntries(CREDENTIAL_DEFINITIONS.map(({ key }) => [key, ""])),
);

export const decryptCredentialBundle = async ({
  payloads,
  password,
  decrypt,
}) => {
  const credentialEntries = await Promise.all(
    CREDENTIAL_DEFINITIONS.map(
      async ({ key, payloadKey, required = false, isValid }) => {
        const payload = payloads[payloadKey];
        if (!payload) return [key, ""];

        try {
          const decryptedValue = String(await decrypt(payload, password));
          if (!isValid(decryptedValue)) {
            throw new Error(`${key} 格式不合法`);
          }
          return [key, decryptedValue];
        } catch (error) {
          if (required) throw error;
          return [key, ""];
        }
      },
    ),
  );

  return Object.fromEntries(credentialEntries);
};
