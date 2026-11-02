import { useEffect, useState } from "react";
import { subscribeToActiveTestimonials } from "../services/testimonialsService";

const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToActiveTestimonials(
      (data) => {
        setTestimonials(data);
        setError("");
        setLoading(false);
      },
      (loadError) => {
        console.error("Failed to load customer testimonials:", loadError);
        setError("Customer reviews are temporarily unavailable.");
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  return { testimonials, loading, error };
};

export default useTestimonials;
