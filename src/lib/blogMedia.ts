import hardloperImage from "@/assets/blog/hardloper.jpg";
import injuryFreeImage from "@/assets/blog/injury-free.jpg";
import muktiRunningImage from "@/assets/blog/mukti-running.jpg";
import runningTechniqueImage from "@/assets/blog/running-technique.jpg";
import trainingTheoryImage from "@/assets/blog/training-theory.jpg";

export type BlogMedia = {
  imageSrc: string;
  imageAlt: string;
};

const fallbackMedia: BlogMedia = {
  imageSrc: hardloperImage,
  imageAlt: "Hardloper in beweging",
};

const blogMediaBySlug: Record<string, BlogMedia> = {
  "voeding-voor-langeafstandslopers": {
    imageSrc: hardloperImage,
    imageAlt: "Close-up van een hardloper in beweging op asfalt",
  },
  "trainingsleer-in-de-praktijk": {
    imageSrc: trainingTheoryImage,
    imageAlt: "Hardloper op nat asfalt tijdens het blauwe uur",
  },
  "training-principles-in-practice": {
    imageSrc: trainingTheoryImage,
    imageAlt: "Runner on wet asphalt during blue hour",
  },
  "blessurevrij-opbouwen": {
    imageSrc: injuryFreeImage,
    imageAlt: "Hardloper op een bospad gezien van achteren",
  },
  "building-without-injury": {
    imageSrc: injuryFreeImage,
    imageAlt: "Runner seen from behind on a forest path",
  },
  "waarom-looptechniek-loont": {
    imageSrc: runningTechniqueImage,
    imageAlt: "Silhouet van een hardloper tegen de ondergaande zon",
  },
  "why-running-technique-pays-off": {
    imageSrc: runningTechniqueImage,
    imageAlt: "Runner silhouette against sunset light",
  },
  "mukti-running-wat-het-is-en-waarom-het-bij-topfit-past": {
    imageSrc: muktiRunningImage,
    imageAlt: "Solitaire hardloper op een groene dijk onder een open lucht",
  },
  "mukti-running-what-it-is-and-why-it-fits-topfit": {
    imageSrc: muktiRunningImage,
    imageAlt: "Solo runner on a green ridge under an open sky",
  },
};

export const getBlogMedia = (slug?: string | null): BlogMedia => {
  if (!slug) return fallbackMedia;
  return blogMediaBySlug[slug] ?? fallbackMedia;
};
