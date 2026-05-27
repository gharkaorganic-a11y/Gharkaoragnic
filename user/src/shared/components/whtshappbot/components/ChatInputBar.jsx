import React from "react";
import { Icon } from "./BotUIComponents";

const ChatInputBar = ({
  input,
  setInput,
  handleInputChange,
  handleSend,
  showPages,
  setShowPages,
  dark,
  inputPlaceholder,
  showSuggestions,
  suggestions,
  setShowSuggestions,
  askingName,
  askingPincode,
  askingOrderSearch,
  scrollDown,
}) => {
  const barBg = dark ? "bg-[#1f2c34]" : "bg-[#F0F2F5]";
  const inpBg = dark ? "bg-[#2a3942]" : "bg-white";
  const inpClr = dark ? "text-[#e9edef]" : "text-[#111B21]";
  const borderClr = dark ? "border-[#2a3942]" : "border-[#e5e7eb]";

  return (
    <div
      className={`${barBg} rounded-b-none sm:rounded-b-2xl pb-[max(0px,env(safe-area-inset-bottom))]`}>
      {showSuggestions && suggestions.length > 0 && (
        <div
          className={`${dark ? "bg-[#1f2c34] border-[#2a3942]" : "bg-white border-[#e5e7eb]"} border-t py-1`}>
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                setInput(s);
                setShowSuggestions(false);
              }}
              className={`flex items-center gap-2 w-full px-4 py-2 text-[13px] text-left transition-colors ${dark ? "text-[#e9edef] hover:bg-[#2a3942]" : "text-[#111B21] hover:bg-[#f0fbf8]"}`}>
              <Icon
                name="search"
                size={13}
                className={`shrink-0 ${dark ? "text-[#8696a0]" : "text-[#aaa]"}`}
              />
              {s}
            </button>
          ))}
        </div>
      )}

      <div
        className={`px-3 py-2.5 flex items-center gap-2 border-t relative ${borderClr}`}>
        <button
          onClick={() => setShowPages((v) => !v)}
          className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all border ${showPages ? "bg-[#008069] text-white border-[#008069]" : dark ? "bg-[#2a3942] text-[#25D366] border-[#25D366]/40 hover:bg-[#008069] hover:text-white" : "bg-white text-[#008069] border-[#008069]/40 hover:bg-[#008069] hover:text-white"}`}
          aria-label="Browse pages">
          <span
            className="inline-flex transition-transform duration-200"
            style={{ transform: showPages ? "rotate(45deg)" : "rotate(0deg)" }}>
            <Icon name="plus" size={19} />
          </span>
        </button>

        <div
          className={`flex-1 rounded-full flex items-center overflow-hidden border ${inpBg} ${dark ? "border-[#3a4a54]" : "border-[#e5e7eb]"}`}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            onFocus={scrollDown}
            placeholder={inputPlaceholder}
            className={`w-full px-4 py-2.5 text-[14px] bg-transparent outline-none placeholder-gray-400 caret-[#008069] ${inpClr}`}
          />
          {!input && !askingName && !askingPincode && !askingOrderSearch && (
            <span className="pr-3 text-gray-300">
              <Icon name="search" size={17} />
            </span>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center transition-all ${input.trim() ? "bg-[#008069] text-white hover:bg-[#006655] active:scale-95 shadow-sm" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
          <Icon name="send" size={20} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(ChatInputBar);
