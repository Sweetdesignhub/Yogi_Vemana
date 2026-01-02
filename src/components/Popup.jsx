const Popup = ({ popupState }) => {
  if (!popupState) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4">
        {popupState.type === "loading" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-700 whitespace-pre-line">
              {popupState.message}
            </p>
          </div>
        )}
        {popupState.type === "error" && (
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-gray-700 whitespace-pre-line">
              {popupState.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;
