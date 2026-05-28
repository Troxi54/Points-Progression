import { useMenu } from "@ui/hooks/useMenu";
import { useEffect, useEffectEvent, useState } from "react";
import Overlay from "../overlay";
import { resolvePrompt, usePromptState } from "./service";
import Paragraph from "@ui/components/base/Paragraph";
import Heading from "@ui/components/base/Heading";

function PromptRoot() {
  const { open, close, isOpen } = useMenu();

  const config = usePromptState();

  const menuOpen = isOpen("prompt");

  const [snapshot, setSnapshot] = useState(config);
  const [value, setValue] = useState("");

  const syncMenu = useEffectEvent(() => {
    if (config) {
      setSnapshot(config);
      setValue(config.defaultValue ?? "");
      if (!menuOpen) open("prompt");
    } else {
      if (menuOpen) close("prompt");
    }
  });

  useEffect(() => {
    syncMenu();
  }, [config]);

  const onMenuClose = useEffectEvent(() => {
    if (config) resolvePrompt(null);
  });

  useEffect(() => {
    if (!menuOpen) onMenuClose();
  }, [menuOpen]);

  if (!snapshot) return null;

  return (
    <Overlay menuId="prompt" menuClassName="">
      <Heading level={2} className="m-0">
        {snapshot.title ?? "Input required"}
      </Heading>
      <Paragraph className="m-0">{snapshot.message}</Paragraph>

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
          <Paragraph>{snapshot.confirmText ?? "OK"}</Paragraph>
        </button>
        <button className="menu-button" onClick={() => resolvePrompt(null)}>
          <Paragraph>{snapshot.cancelText ?? "Cancel"}</Paragraph>
        </button>
      </div>
    </Overlay>
  );
}

export default PromptRoot;
