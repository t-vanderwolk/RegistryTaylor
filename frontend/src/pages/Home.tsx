import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Section from "../design-system/Section";
import Card from "../design-system/Card";
import Button from "../design-system/Button";
import { H1, H2, P } from "../design-system/Typography";
import Input from "../design-system/Input";
import heroPrimary from "../assets/belly-sideview.jpeg";
import heroSecondary from "../assets/nursery-1.jpeg";
import api from "../lib/api";

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const Home: React.FC = () => {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [inviteInfo, setInviteInfo] = useState<null | Record<string, unknown>>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const message = useMemo(() => {
    if (status === "success" && inviteInfo) {
      return `Code ${inviteInfo.code} is authorized for the ${String(inviteInfo.role).toUpperCase()} circle.`;
    }
    if (status === "error") {
      return errorMessage;
    }
    return "";
  }, [status, inviteInfo, errorMessage]);

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setStatus("error");
      setErrorMessage("Please enter an invitation code to verify.");
      setInviteInfo(null);
      return;
    }

    try {
      setStatus("loading");
      setErrorMessage("");
      const response = await api.get(`/api/v1/auth/invites/${encodeURIComponent(trimmed)}`);
      const data = response.data?.data;
      if (!data) {
        throw new Error("We couldn’t locate that invitation. Please confirm with Taylor.");
      }
      setInviteInfo(data);
      setStatus("success");
    } catch (err: any) {
      const fallback =
        err?.response?.data?.error?.message ||
        err?.message ||
        "We couldn’t locate that invitation. Please confirm with Taylor.";
      setInviteInfo(null);
      setErrorMessage(fallback);
      setStatus("error");
    }
  };

  return (
    <div className="space-y-20 bg-ivory pb-24 pt-16 sm:space-y-28">
        <Section>
          <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
            <motion.div
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.9 }}
            >
              <span className="inline-flex items-center rounded-full bg-mauve/40 px-5 py-2 text-xs font-body uppercase tracking-[0.35em] text-charcoal">
                Invite-only concierge
              </span>
              <H1 className="text-charcoal">
                Pastel-elegant planning for the moments you’ll never forget
              </H1>
              <P>
                Taylor-Made Baby Co. curates registries, nursery experiences, and celebrations with a warm,
                concierge touch. We believe calm timelines, heartfelt details, and artful styling help families
                savor every milestone.
              </P>
              <Card className="bg-white/95 px-6 py-5 shadow-soft sm:px-8">
                <div className="space-y-4">
                  <form onSubmit={handleVerify} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
                    <div className="w-full sm:max-w-xs">
                      <Input
                        id="landing-invite-code"
                        label="Invitation code"
                        placeholder="e.g. CLIENT-VIP-001"
                        value={code}
                        onChange={(event) => {
                          setCode(event.target.value.toUpperCase());
                          if (status !== "idle") {
                            setStatus("idle");
                            setInviteInfo(null);
                            setErrorMessage("");
                          }
                        }}
                      />
                    </div>
                    <div className="flex w-full sm:w-auto">
                      <Button type="submit" disabled={status === "loading"} className="w-full">
                        {status === "loading" ? "Verifying…" : "Verify Code"}
                      </Button>
                    </div>
                  </form>
                  <p
                    className={[
                      "min-h-[1.25rem] font-body text-sm",
                      status === "success"
                        ? "text-charcoal/80"
                        : status === "error"
                        ? "text-rose-500"
                        : "text-charcoal/60",
                    ].join(" ")}
                    aria-live="polite"
                  >
                    {message}
                  </p>
                  {inviteInfo && (
                    <dl className="grid w-full grid-cols-2 gap-3 rounded-2xl border border-mauve/30 bg-ivory px-4 py-3 text-sm text-charcoal/80">
                      <div className="flex flex-col gap-1">
                        <dt className="text-[0.6rem] font-heading uppercase tracking-[0.3em] text-charcoal/60">
                          Role
                        </dt>
                        <dd>{String(inviteInfo.role).toUpperCase()}</dd>
                      </div>
                      {inviteInfo.assigned_email && (
                        <div className="flex flex-col gap-1">
                          <dt className="text-[0.6rem] font-heading uppercase tracking-[0.3em] text-charcoal/60">
                            Email
                          </dt>
                          <dd>{String(inviteInfo.assigned_email)}</dd>
                        </div>
                      )}
                      {inviteInfo.expires_at && (
                        <div className="flex flex-col gap-1">
                          <dt className="text-[0.6rem] font-heading uppercase tracking-[0.3em] text-charcoal/60">
                            Expires
                          </dt>
                          <dd>{new Date(String(inviteInfo.expires_at)).toLocaleDateString()}</dd>
                        </div>
                      )}
                    </dl>
                  )}
                </div>
              </Card>
            </motion.div>
            <motion.div
              className="relative overflow-hidden rounded-[3rem] border border-mauve/40 bg-white/70 shadow-[0_28px_70px_-30px_rgba(46,46,46,0.32)]"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 1, delay: 0.1 }}
            >
              <img
                src={heroPrimary}
                alt="Expecting parent in a blush-toned setting"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-mauve/30 via-transparent to-blush/40" aria-hidden="true" />
            </motion.div>
          </div>
        </Section>

        <Section
          title="Concierge touchpoints"
          description="A seamless suite of services designed to keep preparations organized, joyful, and unmistakably you."
        >
          <motion.div
            className="grid gap-6 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
          >
            {[
              {
                title: "Taylor-Made Registries",
                copy: "Thoughtful edits, etiquette guidance, and gifting timelines that feel effortless.",
              },
              {
                title: "Nursery Editorial",
                copy: "Palette studies, space planning, and styling days that calm and delight.",
              },
              {
                title: "Celebration Concierge",
                copy: "Shower production, welcome home moments, and heartfelt touches for your circle.",
              },
            ].map((item) => (
              <Card key={item.title} className="flex h-full flex-col gap-4 bg-white/95">
                <H2 className="text-charcoal text-xl">{item.title}</H2>
                <P>{item.copy}</P>
              </Card>
            ))}
          </motion.div>
        </Section>

        <Section title="Membership promises">
          <motion.div
            className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
          >
            <div className="space-y-6">
              <P>
                Membership is intentionally intimate—five families per season—so Taylor and the mentor circle can
                deliver handwritten guidance, personally vetted vendors, and the calm assurance you deserve.
              </P>
              <ul className="space-y-4 text-sm text-charcoal/80 sm:text-base">
                {[
                  "Weekly concierge check-ins tailored to your trimester.",
                  "Curated product lists and bespoke sourcing notes.",
                  "Celebration concepts and vendor introductions ready when you are.",
                  "Postpartum transition planning with nurture-focused touches.",
                ].map((detail) => (
                  <li key={detail} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-mauve" aria-hidden="true" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
              <Button as="a" href="/membership">
                View Membership Packages
              </Button>
            </div>
            <div className="relative overflow-hidden rounded-[3rem] border border-mauve/40 bg-white/80 shadow-[0_28px_70px_-30px_rgba(46,46,46,0.32)]">
              <img
                src={heroSecondary}
                alt="Softly styled nursery in blush and cream tones"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blush/25 via-transparent to-mauve/35" aria-hidden="true" />
            </div>
          </motion.div>
        </Section>

        <Section
          title="Notes from the circle"
          description="Families and mentors sharing the gentle, celebratory moments we crafted together."
        >
          <motion.div
            className="grid gap-6 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
          >
            {[
              {
                quote:
                  "“Our Scottsdale shower felt like a page out of a keepsake album. Every gift and greeting was planned, so we simply soaked it in.”",
                name: "Claire & Mateo",
              },
              {
                quote:
                  "“Taylor’s nursery styling meant the lights dimmed, the linens were steamed, and our baby’s first night home felt serene.”",
                name: "Priya & Nikhil",
              },
              {
                quote:
                  "“Weekly concierge notes kept us grounded. From registry swaps to travel prep, her team was our steady calm.”",
                name: "Jordan & Elise",
              },
            ].map((item) => (
              <Card key={item.name} className="flex h-full flex-col justify-between bg-white/95">
                <P className="text-charcoal">{item.quote}</P>
                <P className="mt-4 text-sm font-semibold text-charcoal/80">{item.name}</P>
              </Card>
            ))}
          </motion.div>
        </Section>
    </div>
  );
};

export default Home;
