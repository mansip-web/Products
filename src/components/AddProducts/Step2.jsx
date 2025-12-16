import { useFormContext } from "react-hook-form";

const Step2 = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <h2>Step 2: Product Details</h2>

      <select {...register("category")}>
        <option value="">Select Category</option>
        <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option>Home</option>
          <option>Sports</option>
          <option>Cosmetics</option>
          <option>Toys</option>
          <option>Books</option>
      </select>
      {errors.category && <p>{errors.category.message}</p>}

      <input
        placeholder="Enter ratings (1-5)"
  type="number"
  {...register("rating", { valueAsNumber: true })}
/>

      {errors.rating && <p>{errors.rating.message}</p>}
    </>
  );
};

export default Step2;
