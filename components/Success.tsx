export default function PaymentSuccess() {
  return (
    <div className="space-y-2 text-center text-black p-10 bg-gray-100">
      <h1>Your Payment was processed successfully</h1>
      <h1>Thank You for your Donation</h1>
      <p className="mt-4">You can find the full implementation on GitHub:</p>
      <a
        href="https://github.com/hamisirizwan/mpesa-nextjs-demo"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        View the implementation on GitHub
      </a>
    </div>
  );
}
