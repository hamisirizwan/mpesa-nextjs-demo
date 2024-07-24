export default function STKPushQueryLoading({number}:{number:string}) {
    return (
      <div className="space-y-2 text-center text-black p-10 bg-gray-100">
        <h1 className="animate-pulse">PROCESSING PAYMENT..</h1>
        <h1>Stk push sent to {number}</h1>
        <h1>Enter Pin to confirm payment</h1>
      </div>
    );
  }