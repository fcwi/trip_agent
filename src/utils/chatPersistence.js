// Flush the visible conversation before changing modes; a debounce alone can
// lose the last question/reply when the user immediately switches tabs.
export async function persistAiConversation(mode, messages) {
  const { aiChatDB } = await import("./indexedDBManager.js");
  await aiChatDB.init();
  const stored = await Promise.all(
    messages.map(async (msg) => {
      if (msg.image?.data) {
        const id =
          msg.image.id ||
          (await aiChatDB.saveImage(
            msg.id,
            msg.image.data,
            msg.image.filename,
          ));
        return { ...msg, image: { id, filename: msg.image.filename } };
      }
      return {
        ...msg,
        image: msg.image
          ? { id: msg.image.id, filename: msg.image.filename }
          : null,
      };
    }),
  );
  await aiChatDB.saveMessages(mode, stored);
}
