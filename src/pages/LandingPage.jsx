import { useNavigate } from "react-router-dom";
import { MdOutlineArrowOutward } from "react-icons/md";
import LandingPageBg from "../assets/LandingPageBg.png";
import vemanaImg from "../assets/vemana.png";
import potraitImg from "../assets/potrait.png";
import avatarsImg from "../assets/avatars.png";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleStartChat = (initialQuery = null) => {
    if (initialQuery) {
      navigate("/chat", { state: { initialQuery } });
    } else {
      navigate("/chat");
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden">
      {/* Main Background Image */}
      <img
        className="absolute left-0 top-0 w-full h-full object-cover"
        src={LandingPageBg}
        alt="Landing Page Background"
      />

      {/* Main Content */}
      <div className="relative w-full h-full z-10 overflow-y-auto">
        <div className="min-h-full p-2">
          {/* Desktop Layout - Using CSS Grid */}
          <div className="hidden lg:block h-full">
            <div
              className="relative max-w-[2000px] mx-auto h-full"
              style={{ padding: "clamp(1rem, 2vw, 2rem)" }}
            >
              {/* Grid Container */}
              <div
                className="grid h-full"
                style={{
                  gridTemplateColumns: "repeat(10, minmax(0, 1fr))",
                  gridTemplateRows: "repeat(1, minmax(0, 1fr))",
                  gap: "clamp(0.75rem, 1.5vw, 2rem)",
                }}
              >
                {/* Hero Section - Left */}
                <div className="col-span-4 xl:col-span-5 row-span-7 flex flex-col justify-start py-4">
                  <h1
                    className="text-white mb-4 font-bold leading-tight font-montserrat tracking-wide"
                    style={{ fontSize: "clamp(2rem, 3.5vw, 4rem)" }}
                  >
                    Wisdom Comes to the Streets
                  </h1>

                  <div
                    className="mb-6 inline-flex items-center justify-center rounded-xl bg-[#fff83a] w-fit"
                    style={{
                      padding:
                        "clamp(0.75rem, 1.5vw, 1rem) clamp(1.5rem, 2.5vw, 2.5rem)",
                    }}
                  >
                    <span
                      className="text-black font-medium text-center whitespace-nowrap"
                      style={{ fontSize: "clamp(1rem, 1.3vw, 1.25rem)" }}
                    >
                      Vemana Jayanti • 19 January
                    </span>
                  </div>

                  <p
                    className="font-normal leading-relaxed break-words"
                    style={{ fontSize: "clamp(1rem, 1.3vw, 1.25rem)" }}
                  >
                    An interactive digital experience inspired by
                    <strong className="font-bold text-black">
                      {" "}
                      Yogi Vemana,
                    </strong>{" "}
                    <br />
                    where ancient wisdom meets today's questions.
                  </p>
                </div>

                {/* Description Card - Top Right */}
                <div
                  className="col-span-5 col-start-6 xl:col-start-6 row-span-7 rounded-3xl overflow-hidden"
                  style={{
                    background: "rgba(49, 114, 235, 0.9)",
                  }}
                >
                  <div
                    className="relative h-full overflow-y-auto"
                    style={{ padding: "clamp(1.25rem, 2.5vw, 2rem)" }}
                  >
                    <p
                      className="text-white font-medium break-words leading-relaxed font-roboto"
                      style={{ fontSize: "clamp(0.875rem, 1.1vw, 1.125rem)" }}
                    >
                      On Vemana Jayanti, this moving wisdom experience brings
                      the voice of Yogi Vemana to the streets of Kadiri.
                      <br />
                      <br />
                      Through a digital avatar and storytelling, his timeless
                      teachings on truth, humility, and simple living guide
                      modern life.
                      <br />
                      <br />
                      It allows you to converse with Vemana and receive guidance
                      rooted entirely in his original poems and moral
                      philosophy.
                      <br />
                      <br />
                      <strong
                        className="font-extrabold break-words"
                        style={{ fontSize: "clamp(1.125rem, 1.5vw, 1.5rem)" }}
                      >
                        One question at a time..
                      </strong>
                    </p>
                  </div>
                </div>

                {/* Initiative Card - Bottom Left */}
                <div className="col-span-4 row-span-6 row-start-8 rounded-3xl overflow-hidden relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${potraitImg})`,
                    }}
                  />
                  <div
                    className="absolute bottom-0 left-0 rounded-3xl w-full h-2/5"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(42, 42, 42, 0) 0%, #2a2a2a 100%)",
                    }}
                  />
                  <div
                    className="relative h-full flex flex-col justify-end text-white"
                    style={{ padding: "clamp(1rem, 2vw, 1.5rem)" }}
                  >
                    <p
                      className="mb-2 font-normal break-words"
                      style={{ fontSize: "clamp(0.75rem, 1vw, 0.875rem)" }}
                    >
                      An initiative by{" "}
                      <strong className="font-bold">
                        Kandikunta Venkata Prasad
                      </strong>
                    </p>
                    <h3
                      className="font-semibold break-words"
                      style={{ fontSize: "clamp(0.875rem, 1.1vw, 1rem)" }}
                    >
                      Serving Kadiri with heritage,
                      <br /> wisdom, and innovation
                    </h3>
                  </div>
                </div>

                {/* 300+ Stats Card */}
                <div className="col-span-3 col-start-5 row-span-3 row-start-8 rounded-3xl overflow-hidden relative">
                  <div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      background:
                        "linear-gradient(180deg, #fff83a 0%, rgba(255, 255, 255, 0) 100%)",
                    }}
                  />
                  <div
                    className="relative h-full flex flex-col justify-center"
                    style={{ padding: "clamp(0.75rem, 1.5vw, 1.5rem)" }}
                  >
                    <h2
                      className="text-white m-0 font-bold break-words font-montserrat"
                      style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)" }}
                    >
                      300+
                    </h2>
                    <p
                      className="text-white m-0 font-bold break-words"
                      style={{ fontSize: "clamp(1.125rem, 1.5vw, 1.5rem)" }}
                    >
                      Teachings & Poems
                    </p>
                  </div>
                </div>

                {/* Image Card - Right Side */}
                <div className="col-span-4 col-start-8 row-span-4 row-start-8 rounded-3xl overflow-hidden relative">
                  <img
                    className="absolute left-0 top-0 w-full h-full object-cover"
                    src={vemanaImg}
                    alt="Yogi Vemana"
                  />
                  <div
                    className="relative h-full flex items-center justify-end bg-gradient-to-l from-black/50 to-transparent"
                    style={{ paddingRight: "clamp(1rem, 2vw, 1.5rem)" }}
                  >
                    <p
                      className="text-white font-medium break-words text-right"
                      style={{
                        width: "50%",
                        fontSize: "clamp(0.75rem, 1vw, 0.875rem)",
                      }}
                    >
                      Ask questions about life, fear, pride, truth, and purpose.
                    </p>
                  </div>
                </div>

                {/* Features Card - Middle Bottom */}
                <div className="col-span-3 col-start-5 row-span-3 row-start-11 rounded-3xl overflow-hidden bg-blue-600/90">
                  <div
                    className="relative h-full flex flex-col justify-between"
                    style={{ padding: "clamp(1rem, 2vw, 1.5rem)" }}
                  >
                    <h3
                      className="text-white font-semibold break-words font-montserrat"
                      style={{ fontSize: "clamp(1rem, 1.3vw, 1.125rem)" }}
                    >
                      See Wisdom. Hear Wisdom. Live Wisdom.
                    </h3>
                    <div className="flex items-center gap-3">
                      <img
                        src={avatarsImg}
                        alt="User Avatars"
                        className="flex-shrink-0"
                        style={{ height: "clamp(1.5rem, 2.5vw, 2rem)" }}
                      />
                      <p
                        className="text-white font-medium leading-snug break-words"
                        style={{ fontSize: "clamp(0.75rem, 1vw, 0.875rem)" }}
                      >
                        No login required • Telugu & English • Voice supported
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div
                  onClick={() => handleStartChat()}
                  className="relative z-20 col-start-8 col-span-3 row-start-12 row-span-2 flex cursor-pointer transition-transform hover:scale-105 rounded-3xl overflow-hidden bg-[#fff83a] flex items-center justify-center gap-3 px-6 py-4 shadow-lg"
                >
                  <span
                    className="text-black font-semibold"
                    style={{ fontSize: "clamp(1rem, 1.3vw, 1.25rem)" }}
                  >
                    Begin the Conversation
                  </span>
                  <MdOutlineArrowOutward
                    style={{ fontSize: "clamp(1.5rem, 2vw, 2rem)" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden space-y-6 pb-8">
            {/* Hero Section */}
            <div className="text-center px-4">
              <h1
                className="text-white mb-4 font-bold leading-tight"
                style={{
                  fontFamily: "Montserrat",
                  fontSize: "clamp(28px, 8vw, 48px)",
                  letterSpacing: "1.7px",
                  textShadow: "0 16px 34px rgba(0, 0, 0, 0.12)",
                }}
              >
                Wisdom Comes to the Streets
              </h1>

              <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-[#fff83a] px-6 py-3">
                <span
                  className="text-black font-medium whitespace-nowrap"
                  style={{
                    fontSize: "clamp(14px, 4vw, 20px)",
                  }}
                >
                  Vemana Jayanti • 19 January
                </span>
              </div>

              <p
                className="font-normal leading-relaxed mx-auto"
                style={{
                  maxWidth: "600px",
                  color: "rgba(0, 0, 0, 0.85)",
                  fontSize: "clamp(14px, 3.5vw, 20px)",
                  letterSpacing: "0.48px",
                }}
              >
                An interactive digital experience inspired by
                <strong className="font-bold text-black">
                  {" "}
                  Yogi Vemana,
                </strong>{" "}
                where ancient wisdom meets today's questions.
              </p>
            </div>

            {/* Description Card */}
            <div
              className="rounded-3xl mx-4 overflow-hidden"
              style={{
                background: "rgba(49, 114, 235, 0.9)",
              }}
            >
              <div className="p-6">
                <p
                  className="text-white font-medium leading-relaxed"
                  style={{
                    fontSize: "clamp(14px, 3.5vw, 18px)",
                    letterSpacing: "0.64px",
                  }}
                >
                  On Vemana Jayanti, this moving wisdom experience brings the
                  voice of Yogi Vemana to the streets of Kadiri.
                  <br />
                  <br />
                  Through a digital avatar and storytelling, his timeless
                  teachings on truth, humility, and simple living guide modern
                  life.
                  <br />
                  <br />
                  It allows you to converse with Vemana and receive guidance
                  rooted entirely in his original poems and moral philosophy.
                  <br />
                  <br />
                  <strong
                    className="font-extrabold"
                    style={{ fontSize: "clamp(18px, 4.5vw, 26px)" }}
                  >
                    One question at a time..
                  </strong>
                </p>
              </div>
            </div>

            {/* 300+ Stats Card */}
            <div
              className="rounded-3xl mx-4 overflow-hidden"
              style={{
                background:
                  "linear-gradient(180deg, #fff83a 0%, rgba(255, 255, 255, 0) 100%)",
              }}
            >
              <div className="p-6">
                <h2
                  className="text-white m-0 font-bold"
                  style={{
                    fontFamily: "Montserrat",
                    fontSize: "clamp(32px, 10vw, 52px)",
                  }}
                >
                  300+
                </h2>
                <p
                  className="text-white m-0 font-bold"
                  style={{
                    fontSize: "clamp(20px, 5vw, 28px)",
                  }}
                >
                  Teachings & Poems
                </p>
              </div>
            </div>

            {/* Image Card */}
            <div className="rounded-3xl mx-4 overflow-hidden relative h-64">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, #4681ee 0%, rgba(41, 41, 41, 0) 100%)",
                }}
              />
              <img
                className="absolute left-0 top-0 w-full h-full object-cover"
                src="/src/assets/vemana.png"
                alt="Yogi Vemana"
              />
              <div className="absolute inset-0 flex items-center justify-end pr-6">
                <p
                  className="text-white font-medium text-right"
                  style={{
                    maxWidth: "50%",
                    fontSize: "clamp(14px, 3.5vw, 18px)",
                  }}
                >
                  Ask questions about life, fear, pride, truth, and purpose.
                </p>
              </div>
            </div>

            {/* Features Card */}
            <div
              className="rounded-3xl mx-4 overflow-hidden"
              style={{
                background: "rgba(49, 114, 235, 0.9)",
              }}
            >
              <div className="p-6">
                <h3
                  className="text-white mb-4 font-semibold"
                  style={{
                    fontFamily: "Montserrat",
                    fontSize: "clamp(18px, 5vw, 24px)",
                  }}
                >
                  See Wisdom. Hear Wisdom. Live Wisdom.
                </h3>
                <div className="flex items-center gap-3 flex-wrap">
                  <img src={avatarsImg} alt="User Avatars" className="h-10" />
                  <p
                    className="text-white font-medium leading-snug"
                    style={{
                      fontSize: "clamp(12px, 3vw, 16px)",
                    }}
                  >
                    No login required • Telugu & English • Voice supported
                  </p>
                </div>
              </div>
            </div>

            {/* Initiative Card */}
            <div className="rounded-3xl mx-4 overflow-hidden relative h-80">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${potraitImg})`,
                }}
              />
              <div
                className="absolute bottom-0 left-0 w-full h-2/5"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(42, 42, 42, 0) 0%, #2a2a2a 100%)",
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 text-white p-6">
                <p
                  className="mb-2 font-normal"
                  style={{
                    fontSize: "clamp(12px, 3vw, 14px)",
                  }}
                >
                  An initiative by{" "}
                  <strong className="font-bold">
                    Kandikunta Venkata Prasad
                  </strong>
                </p>
                <h3
                  className="font-semibold"
                  style={{
                    fontFamily: "Montserrat",
                    fontSize: "clamp(16px, 4.5vw, 24px)",
                  }}
                >
                  Serving Kadiri with heritage, wisdom, and innovation
                </h3>
              </div>
            </div>

            {/* CTA Button */}
            <div
              onClick={() => handleStartChat()}
              className="cursor-pointer transition-transform active:scale-95 rounded-3xl mx-4 overflow-hidden"
              style={{
                filter: "drop-shadow(0 16px 9px rgba(0, 0, 0, 0.11))",
              }}
            >
              <div className="bg-[#fff83a] py-6 px-6">
                <div className="flex items-center justify-center gap-3">
                  <span
                    className="text-black font-semibold"
                    style={{
                      fontSize: "clamp(20px, 5vw, 32px)",
                      lineHeight: "1.2",
                    }}
                  >
                    Begin the Conversation
                  </span>
                  <MdOutlineArrowOutward size={32} className="flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
