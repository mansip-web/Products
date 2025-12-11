import { useFormState, useFormStatus } from "react-dom";

// Simulated async action
async function subscribeAction(previousState, formData) {
  const email = formData.get("email");

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (!email || !email.includes("@")) {
    return { success: false, message: "Please enter a valid email." };
  }

  return { success: true, message: "Subscribed! Thank you." };
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        padding: "8px",
        backgroundColor: pending ? "#ccc" : "#7c3aed",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: pending ? "not-allowed" : "pointer",
      }}
    >
      {pending ? "Submitting..." : "Subscribe"}
    </button>
  );
}

const Newsletter = () => {
  const [state, formAction] = useFormState(subscribeAction, {
    success: false,
    message: "",
  });

  return (
    <div
      style={{
        marginTop: "40px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h3>Subscribe to our Newsletter</h3>
      <form
        action={formAction}
        style={{
          display: "flex",
          gap: "10px",
          flexDirection: "column",
          maxWidth: "300px",
        }}
      >
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <SubmitButton />
      </form>
      {state.message && (
        <p
          style={{ marginTop: "10px", color: state.success ? "green" : "red" }}
        >
          {state.message}
        </p>
      )}
    </div>
  );
};

export default Newsletter;
