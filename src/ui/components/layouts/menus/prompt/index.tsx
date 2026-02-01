import { useEffect, useState } from "react";
import { useMenu } from "../provider";
import { resolvePrompt, usePromptState } from "./service";
import Overlay from "../overlay";

function PromptRoot() {
  const [, forceUpdate] = useState(0);
  const { open, close, isOpen } = useMenu();

  const config = usePromptState(() => {
    forceUpdate((v) => v + 1);
  });

  const menuOpen = isOpen("prompt");

  const [snapshot, setSnapshot] = useState(config);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (config) setSnapshot(config);
  }, [config]);

  useEffect(() => {
    setValue(config?.defaultValue ?? snapshot?.defaultValue ?? "");
  }, [config, snapshot]);

  useEffect(() => {
    if (config && !menuOpen) open("prompt");
    if (!config && menuOpen) close("prompt");
  }, [config]);

  useEffect(() => {
    if (!menuOpen && config) {
      resolvePrompt(null);
    }
  }, [menuOpen]);

  if (!snapshot) return null;

  return (
    <Overlay menuId="prompt" menuClassName="">
      <h1 className="m-0">{snapshot.title ?? "Input required"}</h1>
      <p className="m-0">{snapshot.message}</p>

      <input
        id="prompt-input"
        autoFocus
        value={value}
        placeholder={snapshot.placeholder}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") resolvePrompt(value);
          if (e.key === "Escape") resolvePrompt(null);
        }}
        type="text"
      />

      <div className="flex justify-end gap-[0.6em]">
        <button className="menu-button" onClick={() => resolvePrompt(value)}>
          <p>{snapshot.confirmText ?? "OK"}</p>
        </button>
        <button className="menu-button" onClick={() => resolvePrompt(null)}>
          <p>{snapshot.cancelText ?? "Cancel"}</p>
        </button>
      </div>
    </Overlay>
  );
}

export default PromptRoot;
