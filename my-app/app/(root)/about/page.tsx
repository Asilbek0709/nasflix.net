"use client";


import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, Variants } from "framer-motion";
import RedButton from "../../ui/button";

type Align = "left" | "right";

interface ShowcaseItem {
  imgSrc: string;
  nameKey: string;
  textKey: string;
  align: Align;
}

interface ShowcaseRowProps {
  item: ShowcaseItem;
  index: number;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.65, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

const SHOWCASE: ShowcaseItem[] = [
  {
    imgSrc:
      "https://cdn.hswstatic.com/gif/play/0b7f4e9b-f59c-4024-9f06-b3dc12850ab7-1920-1080.jpg",
    nameKey: "Torayev Umidjon",
    textKey: "Zamonaviy texnologiyalar bilan qurilgan platforma sizga eng yaxshi tomosha tajribasini taqdim etadi. Tez, qulay va ishonchli.",
    align: "left",
  },
  {
    imgSrc:
      "https://cdn.hswstatic.com/gif/play/0b7f4e9b-f59c-4024-9f06-b3dc12850ab7-1920-1080.jpg",
    nameKey: "Torayev Umidjon",
    textKey: "Zamonaviy texnologiyalar bilan qurilgan platforma sizga eng yaxshi tomosha tajribasini taqdim etadi. Tez, qulay va ishonchli.",
    align: "right",
  },
  {
    imgSrc:
      "https://cdn.hswstatic.com/gif/play/0b7f4e9b-f59c-4024-9f06-b3dc12850ab7-1920-1080.jpg",
    nameKey: "Torayev Umidjon",
    textKey: "Zamonaviy texnologiyalar bilan qurilgan platforma sizga eng yaxshi tomosha tajribasini taqdim etadi. Tez, qulay va ishonchli.",
    align: "left",
  },
  {
    imgSrc:
      "https://cdn.hswstatic.com/gif/play/0b7f4e9b-f59c-4024-9f06-b3dc12850ab7-1920-1080.jpg",
    nameKey: "Torayev Umidjon",
    textKey: "Zamonaviy texnologiyalar bilan qurilgan platforma sizga eng yaxshi tomosha tajribasini taqdim etadi. Tez, qulay va ishonchli.",
    align: "right",
  },
  {
    imgSrc:
      "https://cdn.hswstatic.com/gif/play/0b7f4e9b-f59c-4024-9f06-b3dc12850ab7-1920-1080.jpg",
    nameKey: "Torayev Umidjon",
    textKey: "Zamonaviy texnologiyalar bilan qurilgan platforma sizga eng yaxshi tomosha tajribasini taqdim etadi. Tez, qulay va ishonchli.",
    align: "left",
  },
];

function ShowcaseRow({ item, index }: ShowcaseRowProps) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isLeft = item.align === "left";

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={`flex flex-col md:flex-row items-center gap-8 mb-20 ${
        !isLeft ? "md:flex-row-reverse" : ""
      }`}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, x: isLeft ? -60 : 60 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          },
        }}
        className="w-full md:w-3/5 rounded-3xl overflow-hidden shadow-2xl shadow-black/60 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-red-900/20 to-transparent z-10 pointer-events-none" />

        <Image
          src={item.imgSrc}
          alt="showcase"
          width={1200}
          height={700}
          className="w-full object-cover"
        />

        <div className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-red-900/50">
          {String(index + 1).padStart(2, "0")}
        </div>
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0, x: isLeft ? 60 : -60 },
          visible: {
            opacity: 1,
            x: 0,
            transition: {
              duration: 0.8,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        }}
        className="w-full md:w-2/5 space-y-4"
      >
        <motion.div
          className="w-12 h-1 bg-red-600 rounded-full"
          initial={{ scaleX: 0, originX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        <h2 className="text-3xl font-bold text-white">{t(item.nameKey)}</h2>
        <p className="text-gray-400 leading-relaxed">{t(item.textKey)}</p>
      </motion.div>
    </motion.section>
  );
}

export default function About() {
  const { t } = useTranslation();

  const heroRef = useRef<HTMLDivElement | null>(null);
  const heroInView = useInView(heroRef, { once: true });

  const logoRef = useRef<HTMLDivElement | null>(null);
  const logoInView = useInView(logoRef, { once: true, margin: "-40px" });

  const ctaRef = useRef<HTMLDivElement | null>(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-40px" });

  return (
    <div className="bg-black text-white overflow-x-hidden">
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center px-6 md:px-16 pt-24 pb-16 overflow-hidden"
      >
        <div className="flex flex-col md:flex-row items-center gap-16 w-full relative z-10">
          <motion.div
            className="relative w-full md:w-1/2 flex-shrink-0"
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
          >
            <motion.div
              variants={scaleIn}
              custom={0}
              className="rounded-2xl overflow-hidden shadow-2xl shadow-red-900/20"
            >
              <img
                src="/start.webp"
                alt="Main Preview"
                width={1100}
                height={600}
                className="object-cover w-full"
                priority
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="md:w-1/2 space-y-6"
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
          >
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-6xl font-extrabold leading-tight"
            >
              Bizning Streaming Tajribamizga Xush Kelibsiz
              <span className="text-red-500">.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-gray-400 text-lg leading-relaxed"
            >
              Minglab filmlar, TV seriallar va eksklyuziv kontentlarni istalgan vaqt, istalgan joydan tomosha qiling. Premium sifatli streaming va tezkor ishlash imkoniyati.
            </motion.p>

            <motion.div variants={fadeUp} custom={4}>
              <RedButton label="Tomosha Boshlash" size="lg" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <motion.div
        ref={logoRef}
        initial={{ opacity: 0, y: 30 }}
        animate={logoInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="py-10"
      >
      </motion.div>

      <section className="py-10 px-6 md:px-16">
        {SHOWCASE.map((item, i) => (
          <ShowcaseRow key={i} item={item} index={i} />
        ))}
      </section>

      <section ref={ctaRef} className="py-24 px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Bugun Boshlang
          </h2>

          <RedButton
            label="Bepul Sinab Ko'ring"
            href="/register"
            size="lg"
            sx={{ px: "48px", py: "14px" }}
          />
        </motion.div>
      </section>
    </div>
  );
}