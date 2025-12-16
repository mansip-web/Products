import { useFormContext } from "react-hook-form";

const Step1 = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <h2>Step 1: Basic Info</h2>

      <input
        placeholder="Product Name"
        {...register("name")}
      />
      {errors.name && <p>{errors.name.message}</p>}

      <input
      placeholder="Enter Price"
  type="number"
  {...register("price", { valueAsNumber: true })}
/>

      {errors.price && <p>{errors.price.message}</p>}
    </>
  );
};

export default Step1;
