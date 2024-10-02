import Features from "@/components/features-vertical";
import Section from "@/components/section";
import { Upload, Zap, Sparkles } from "lucide-react";

const data = [
  {
    id: 1,
    title: "1. Velg din bransje",
    content:
      "Velg fra vårt bibliotek av forhåndsdefinerte bransjer og kundesegmenter som passer dine behov.",
    image: "/dashboard.png",
    icon: <Upload className="w-6 h-6 text-primary" />,
  },
  {
    id: 2,
    title: "2. Tilpass og utforsk",
    content:
      "Enkelt tilpass søkekriterier og utforsk potensielle kunder med vår intuitive grensesnitt.",
    image: "/dashboard.png",
    icon: <Zap className="w-6 h-6 text-primary" />,
  },
  {
    id: 3,
    title: "3. Følg opp og voks",
    content:
      "Start kundeoppfølgingen umiddelbart, og bruk våre verktøy for å effektivt håndtere og vokse din kundebase.",
    image: "/dashboard.png",
    icon: <Sparkles className="w-6 h-6 text-primary" />,
  },
];

export default function Component() {
  return (
    <Section
      title="Hvordan Sailsdock fungerer"
      subtitle="Få nye kunder og voks din bedrift i 3 enkle trinn"
    >
      <Features data={data} />
    </Section>
  );
}