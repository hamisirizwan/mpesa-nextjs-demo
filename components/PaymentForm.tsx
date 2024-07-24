"use client";
import { sendStkPush } from "@/actions/stkPush";
import { stkPushQuery } from "@/actions/stkPushQuery";
import React, { useState } from "react";
import PaymentSuccess from "./Success";
import STKPushQueryLoading from "./StkQueryLoading";


interface dataFromForm {
  mpesa_phone: string;
  name: string;
  amount: number | null;
}

function PaymentForm() {
  const [dataFromForm, setDataFromForm] = useState<dataFromForm>({
    mpesa_phone: "",
    name: "",
    amount: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [stkQueryLoading, setStkQueryLoading] = useState<boolean>(false);

  //add this just before the handleSubmit Function
var reqcount = 0;
 
const stkPushQueryWithIntervals = (CheckoutRequestID: string) => {
  const timer = setInterval(async () => {
    reqcount += 1;
 
    if (reqcount === 15) {
      //handle long payment
      clearInterval(timer);
      setStkQueryLoading(false);
      setLoading(false);
      alert("You took too long to pay");
    }
 
    const { data, error } = await stkPushQuery(CheckoutRequestID);
 
    if (error) {
      if (error.response.data.errorCode !== "500.001.1001") {
        setStkQueryLoading(false);
        setLoading(false);
        alert(error?.response?.data?.errorMessage);
      }
    }
 
    if (data) {
      if (data.ResultCode === "0") {
        clearInterval(timer);
        setStkQueryLoading(false);
        setLoading(false);
        setSuccess(true);
      } else {
        clearInterval(timer);
        setStkQueryLoading(false);
        setLoading(false);
        alert(data?.ResultDesc);
      }
    }
  }, 2000);
};
 
  const handleSubmit = async () => {
    setLoading(true);

    const formData = {
      mpesa_number: dataFromForm.mpesa_phone.trim(),
      name: dataFromForm.name.trim(),
      amount: dataFromForm.amount!,
    };

    //validate as you wish - we just just validate the phone number for now to allow any mpesa number format

    const kenyanPhoneNumberRegex =
      /^(07\d{8}|01\d{8}|2547\d{8}|2541\d{8}|\+2547\d{8}|\+2541\d{8})$/;

    if (!kenyanPhoneNumberRegex.test(formData.mpesa_number)) {
      setLoading(false);
      return alert("Invalid mpesa number");
    }

    const { data: stkData, error: stkError } = await sendStkPush(formData);

    if (stkError) {
      setLoading(false);
      return alert(stkError);
    }

    const checkoutRequestId = stkData.CheckoutRequestID;

    setStkQueryLoading(true)
    stkPushQueryWithIntervals(checkoutRequestId);
  };

  return (
    <>
    {stkQueryLoading ? (
      <STKPushQueryLoading number={dataFromForm.mpesa_phone}/>
    ) : success ? (
      <PaymentSuccess />
    ) : (
        <div className="lg:pl-12">
        <div className="overflow-hidden rounded-md bg-white">
          <div className="p-6 sm:p-10">
            <p className="mt-4 text-base text-gray-600">
              Provide your name, mpesa number and amount to process donation.
            </p>
            <form action="#" method="POST" className="mt-4">
              <div className="space-y-6">
                <div>
                  <label className="text-base font-medium text-gray-900">
                    {" "}
                    Name{" "}
                  </label>
                  <div className="relative mt-2.5">
                    <input
                      type="text"
                      required
                      name="name"
                      value={dataFromForm.name}
                      onChange={(e) =>
                        setDataFromForm({
                          ...dataFromForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="John Doe"
                      className="block w-full rounded-md border border-gray-200 bg-white px-4 py-4 text-black placeholder-gray-500 caret-orange-500 transition-all duration-200 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-base font-medium text-gray-900">
                    {" "}
                    Mpesa Number{" "}
                  </label>
                  <div className="relative mt-2.5">
                    <input
                      type="text"
                      name="mpesa_number"
                      value={dataFromForm.mpesa_phone}
                      onChange={(e) =>
                        setDataFromForm({
                          ...dataFromForm,
                          mpesa_phone: e.target.value,
                        })
                      }
                      placeholder="Enter mpesa phone number"
                      className="block w-full rounded-md border border-gray-200 bg-white px-4 py-4 text-black placeholder-gray-500 caret-orange-500 transition-all duration-200 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-base font-medium text-gray-900">
                    {" "}
                    Amount{" "}
                  </label>
                  <div className="relative mt-2.5">
                    <input
                      type="number"
                      required
                      name="amount"
                      value={dataFromForm.amount!}
                      onChange={(e) =>
                        setDataFromForm({
                          ...dataFromForm,
                          amount: Number(e.target.value),
                        })
                      }
                      placeholder="Enter an active whatsapp number"
                      className="block w-full rounded-md border border-gray-200 bg-white px-4 py-4 text-black placeholder-gray-500 caret-orange-500 transition-all duration-200 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-orange-500 px-4 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-orange-600 focus:bg-orange-600 focus:outline-none"
                  >
                    {loading ? "Processing.." : "Proceed With Payment"}
                  </button>
                  ;
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
  </>

   
  );
}

export default PaymentForm;
