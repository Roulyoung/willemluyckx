import { CalendarDays, CheckCircle2, Clock3, HeartPulse, Target, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { localizedPath } from "@/lib/localeRoutes";
import type { Locale } from "@/lib/i18n";

type Session = {
  day: string;
  type: string;
  description: string;
};

type TrainingBlock = {
  weeks: string;
  title: string;
  focus: string;
  sessions: Session[];
};

const blocks: TrainingBlock[] = [
  {
    weeks: "Week 1 t/m 4",
    title: "Basis & techniek",
    focus: "Cadans verhogen, hartslag onder controle houden en wennen aan de trainingsbelasting.",
    sessions: [
      { day: "Dinsdag", type: "Techniek & souplesse", description: "10 min. warming-up met dynamische oefeningen · 6 × 200 m ontspannen versnellen op 80% gevoel · 10 min. cooling-down" },
      { day: "Donderdag", type: "Herstelloop / duur", description: "35–40 min. rustige duurloop in zone 2; je moet gemakkelijk kunnen praten · daarna 3 × 50 m strides" },
      { day: "Zaterdag", type: "Fartlek", description: "10 min. inlopen · 15 min. wisseltempo met 1 min. vlot en 2 min. rustig dribbelen · 10 min. uitlopen" },
    ],
  },
  {
    weeks: "Week 5 t/m 8",
    title: "Opbouw & drempel",
    focus: "De aerobe capaciteit en tempohardheid verhogen zonder onnodige verzuring.",
    sessions: [
      { day: "Dinsdag", type: "Extensieve interval", description: "10 min. warming-up en loopscholing · 5 × 800 m op 10 km-wedstrijdtempo met 2 min. herstel · 10 min. cooling-down" },
      { day: "Donderdag", type: "Duurloop met versnellingen", description: "45 min. duurloop in gemakkelijk tempo · de laatste 5 min. geleidelijk versnellen richting streeftempo" },
      { day: "Zaterdag", type: "Bloktraining", description: "10 min. inlopen · 3 × 2.000 m op vlot zone-3-tempo met 3 min. herstelwandelen · 10 min. uitlopen" },
    ],
  },
  {
    weeks: "Week 9 t/m 12",
    title: "Specifiek & tapering",
    focus: "Wedstrijdspecifieke snelheid, mentale scherpte en uitgerust aan de start verschijnen.",
    sessions: [
      { day: "Dinsdag", type: "Wedstrijdtempo & souplesse", description: "10 min. warming-up en techniek · 8 × 400 m op beoogd 10 km-tempo met 90 sec. rust · 10 min. cooling-down" },
      { day: "Donderdag", type: "Onderhoudsloop", description: "30 min. heel ontspannen lopen · daarna 4 korte versnellingen van 80 m" },
      { day: "Zondag", type: "Raceday / testloop", description: "10 km wedstrijd of een 10 km testloop op gevoel. Loop gecontroleerd en houd de souplesse vast." },
    ],
  },
];

const principles = [
  { icon: Zap, title: "Niet harken, maar zweven", text: "Train op souplesse en een efficiënte cadans in plaats van zwaar te verzuren in lange, trage duurlopen." },
  { icon: Target, title: "Kwaliteit boven kilometers", text: "Drie gerichte trainingen kunnen meer opleveren en minder blessures geven dan doelloos extra kilometers maken." },
  { icon: HeartPulse, title: "Herstel is ook training", text: "Luister naar je lichaam en pas de intensiteit aan wanneer spieren of gewrichten protesteren." },
];

export const ExampleTrainingPlanPage = ({ locale }: { locale: Locale }) => {
  const isEn = locale === "en";

  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-12 md:px-8 md:pt-20">
        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-blue-700">
            <CalendarDays className="h-4 w-4" />
            {isEn ? "Example training plan" : "Voorbeeld trainingsschema"}
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-7xl">
            {isEn ? "A personal 12-week running plan" : "Een persoonlijk hardloopschema van 12 weken"}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
            {isEn
              ? "This example shows how TopFit Running can translate an intake into a clear, progressive plan."
              : "Dit voorbeeld laat zien hoe TopFit Running een intake kan vertalen naar een helder en persoonlijk opgebouwd schema."}
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {[
            ["Cliënt", "Willem Luijckx (voorbeeld)"],
            ["Doel", "10 km in 55–60 minuten"],
            ["Looptijd", "12 weken"],
            ["Frequentie", "3 trainingen per week"],
          ].map(([label, value]) => (
            <Card key={label} className="border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-2 p-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">{label}</div>
                <div className="font-bold text-slate-900">{value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-12 md:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {principles.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="border-blue-100 bg-blue-50/70">
              <CardContent className="space-y-4 p-6">
                <Icon className="h-6 w-6 text-blue-700" />
                <h2 className="text-xl font-black text-slate-950">{title}</h2>
                <p className="leading-7 text-slate-600">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-5 pb-16 md:px-8">
        {blocks.map((block, index) => (
          <Card key={block.weeks} className="overflow-hidden border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-900 px-6 py-6 text-white md:px-8">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-blue-200">
                <span>Blok {index + 1}</span><span className="text-slate-500">·</span><span>{block.weeks}</span>
              </div>
              <h2 className="mt-3 text-3xl font-black">{block.title}</h2>
              <p className="mt-2 max-w-3xl leading-7 text-slate-300"><strong className="text-white">Focus:</strong> {block.focus}</p>
            </div>
            <CardContent className="grid gap-4 p-5 md:grid-cols-3 md:p-8">
              {block.sessions.map((session) => (
                <div key={`${block.weeks}-${session.day}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">{session.day}</span>
                    <Clock3 className="h-4 w-4 text-slate-400" />
                  </div>
                  <h3 className="mt-3 text-lg font-black text-slate-950">{session.type}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{session.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
        <Card className="border-emerald-100 bg-emerald-50">
          <CardContent className="flex flex-col gap-5 p-7 md:flex-row md:items-center md:justify-between md:p-9">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-emerald-700" />
              <div>
                <h2 className="text-2xl font-black text-slate-950">{isEn ? "The goal" : "Het doel"}</h2>
                <p className="mt-2 max-w-2xl leading-7 text-slate-700">{isEn ? "Build speed without losing ease, technique or recovery." : "Snelheid opbouwen zonder souplesse, techniek of herstel uit het oog te verliezen."}</p>
              </div>
            </div>
            <Button asChild variant="heroOutline" className="shrink-0">
              <Link to={localizedPath(locale, "contact")}>{isEn ? "Ask about your plan" : "Bespreek jouw schema"}</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};
