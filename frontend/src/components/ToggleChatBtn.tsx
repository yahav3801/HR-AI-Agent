const ToggleChatBtn = ({
  setIsShown,
}: {
  setIsShown: (shown: boolean) => void;
}) => {
  return (
    <div>
      <div
        className="fixed bottom-8 right-8  z-50 cursor-pointer  "
        onClick={() => setIsShown(true)}
      >
        <svg
          className="w-12 h-12 p-1.5 bg-orange-500 text-white rounded-full hover:bg-neutral-900 hover:text-orange-500 transition"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
    </div>
  );
};

export default ToggleChatBtn;
