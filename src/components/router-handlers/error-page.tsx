const ErrorPage = () => {
  // create fancy tailwind error page
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <div className="flex flex-col space-y-4">
        <h1 className="text-9xl font-bold">404</h1>
        <p className="text-2xl font-semibold">Page not found</p>
      </div>
    </div>
  );
};
export default ErrorPage;
