export const shouldSubmitTextInput = (event) =>
  event.key === "Enter" &&
  !event.shiftKey &&
  !event.isComposing &&
  !event.nativeEvent?.isComposing &&
  event.keyCode !== 229;
