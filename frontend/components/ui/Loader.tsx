export default function Loader() {
  return (
    <div className="flex justify-center items-center py-8">
      <div
        className="relative inline-block w-12 h-12"
        role="status"
        aria-label="Loading"
      >
        <span className="absolute inset-0 rounded-full border-4 border-primary-600 opacity-30"></span>
        <span className="absolute inset-0 rounded-full border-t-4 border-primary-600 animate-spin"></span>
      </div>
    </div>
  );
}