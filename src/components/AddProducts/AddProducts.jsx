import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { productSchema } from "./productSchema";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

const AddProduct = () => {
  const [step, setStep] = useState(1);

  const methods = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
  name: "",
  category: "",
  price: 0,
  rating: 1,
  description: "",
},
  });

  const nextStep = async () => {
    const isValid = await methods.trigger();
    if (isValid) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = (data) => {
    console.log("Final Product Data:", data);
    // 🔥 Here you will insert into Supabase
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}

        <div style={{ marginTop: "20px" }}>
          {step > 1 && (
            <button type="button" onClick={prevStep}>
              Back
            </button>
          )}

          {step < 3 && (
            <button type="button" onClick={nextStep}>
              Next
            </button>
          )}

          {step === 3 && <button type="submit">Add Product</button>}
        </div>
      </form>
    </FormProvider>
  );
};

export default AddProduct;
