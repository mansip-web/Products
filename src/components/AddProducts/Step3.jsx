import { useFormContext } from "react-hook-form";

const Step3 = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const values = watch();

  return (
    <>
      <h2>Step 3: Description & Review</h2>

      <textarea
        placeholder="Product Description"
        {...register("description")}
      />
      {errors.description && <p>{errors.description.message}</p>}

      <h4>Review</h4>
      <pre>{JSON.stringify(values, null, 2)}</pre>
    </>
  );
};

export default Step3;
