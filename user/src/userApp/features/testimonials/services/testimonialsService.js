import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../../config/firebaseDB";

export const subscribeToActiveTestimonials = (onTestimonials, onError) =>
  onSnapshot(
    collection(db, "testimonials"),
    (snapshot) => {
      const testimonials = snapshot.docs
        .map((testimonial) => ({
          id: testimonial.id,
          ...testimonial.data(),
        }))
        .filter(
          (testimonial) =>
            testimonial.isActive !== false && testimonial.isDemo !== true,
        )
        .sort((first, second) => getTimestamp(second) - getTimestamp(first));

      onTestimonials(testimonials);
    },
    onError,
  );

const getTimestamp = (testimonial) => {
  const value = testimonial.createdAt ?? testimonial.updatedAt ?? testimonial.date;
  if (typeof value?.toMillis === "function") return value.toMillis();

  const timestamp = new Date(value ?? 0).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};
