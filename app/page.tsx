"use client";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    destination: "",
    budget: "",
    days: "",
    interest: "",
  });

  const [darkMode, setDarkMode] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const destinationImages: Record<string, string> = {
    goa: "/images/goa.jpg",
    manali: "/images/manali.jpg",
    jaipur: "/images/jaipur.jpg",
    beach: "/images/beach.jpg",
  };

  const travelTips: Record<string, string> = {
    goa: "Carry sunscreen, light clothes, and stay hydrated.",
    manali: "Carry warm clothes and check road conditions before travel.",
    jaipur: "Visit forts early morning to avoid heat and crowds.",
  };

  const weatherSuggestions: Record<string, string> = {
    goa: "Usually warm and humid. Carry cotton clothes, sunglasses, and sunscreen.",
    manali: "Weather can be cold. Carry jackets and comfortable shoes.",
    jaipur: "Mostly dry and sunny. Carry water, cap, and sunscreen.",
  };

  const attractions: Record<string, string[]> = {
    goa: ["Baga Beach", "Calangute Beach", "Fort Aguada"],
    manali: ["Solang Valley", "Hadimba Temple", "Mall Road Manali"],
    jaipur: ["Amber Fort", "Hawa Mahal", "City Palace Jaipur"],
  };

  const hotelRecommendations: Record<string, string[]> = {
    goa: ["Zostel Goa", "Bloom Hotel Calangute", "Taj Cidade de Goa"],
    manali: ["The Hosteller Manali", "Snow Valley Resorts", "Span Resort"],
    jaipur: ["Moustache Jaipur", "Umaid Bhawan", "Rambagh Palace"],
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN").format(amount);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const getHotelSuggestion = (budget: number) => {
    if (budget <= 5000) return "Budget hostel or guest house";
    if (budget <= 15000) return "Comfortable 3-star hotel";
    if (budget <= 30000) return "Premium hotel or beach resort";
    return "Luxury resort or private villa";
  };

  const getTransportSuggestion = (budget: number) => {
    if (budget <= 5000) return "Use local buses, shared taxis, or rented scooter";
    if (budget <= 15000) return "Use rented scooter/cab for short travel";
    return "Use private cab or self-drive car";
  };

  const generateLocalPlan = (
    destination: string,
    days: number,
    interest: string
  ) => {
    const plans: Record<string, string[]> = {
      beach: [
        `Relax at a popular beach in ${destination}`,
        "Try water sports and beach activities",
        "Explore nearby islands or coastal spots",
        "Enjoy local seafood and beach cafes",
        "Watch sunset and visit local markets",
      ],
      adventure: [
        `Arrive in ${destination} and explore outdoor spots`,
        "Try trekking or hiking activities",
        "Do adventure sports like rafting, zipline, or biking",
        "Visit nature parks and viewpoints",
        "Explore waterfalls, caves, or forest trails",
      ],
      food: [
        `Start with a local food tour in ${destination}`,
        "Explore famous street food places",
        "Try traditional regional meals",
        "Visit cafes and dessert spots",
        "Try a popular local restaurant",
      ],
      historical: [
        `Visit famous historical places in ${destination}`,
        "Explore forts, monuments, and old streets",
        "Visit museums and heritage buildings",
        "Attend cultural shows or local events",
        "Explore temples, churches, or traditional sites",
      ],
      romantic: [
        `Enjoy a sunset dinner in ${destination}`,
        "Visit peaceful scenic spots",
        "Go for a couple photoshoot location",
        "Try cafe hopping",
        "Enjoy a beach walk or lake view",
      ],
      family: [
        `Start with family sightseeing in ${destination}`,
        "Visit parks and safe attractions",
        "Try local family restaurants",
        "Go shopping and relax",
        "Enjoy easy evening sightseeing",
      ],
      budget: [
        `Explore free attractions in ${destination}`,
        "Use public transport",
        "Try affordable local food",
        "Visit local markets",
        "Stay in budget-friendly areas",
      ],
      luxury: [
        `Check into a premium stay in ${destination}`,
        "Enjoy a private sightseeing tour",
        "Try fine dining experience",
        "Relax with spa or resort activities",
        "Go for luxury shopping experience",
      ],
    };

    const selectedPlan = plans[interest] || [
      `Explore popular tourist places in ${destination}`,
      "Try local food",
      "Visit markets",
      "Relax and enjoy sightseeing",
    ];

    const itinerary = [];

    for (let i = 0; i < days; i++) {
      itinerary.push(`Day ${i + 1}: ${selectedPlan[i % selectedPlan.length]}`);
    }

    return itinerary;
  };

  const generateTrip = () => {
    const destination = form.destination.trim();
    const budget = Number(form.budget);
    const days = Number(form.days);
    const interest = form.interest;

    if (!destination || !budget || !days || !interest) {
      alert("Please fill all fields");
      return;
    }

    if (days < 1) {
      alert("Days must be at least 1");
      return;
    }

    if (days > 30) {
      alert("Please enter maximum 30 days only");
      return;
    }

    setIsGenerating(true);
    setResult(null);

    setTimeout(() => {
      const key = destination.toLowerCase();
      const itinerary = generateLocalPlan(destination, days, interest);

      setResult({
        destination,
        budget,
        days,
        interest,
        hotel: getHotelSuggestion(budget),
        transport: getTransportSuggestion(budget),
        itinerary,
        hotelCost: Math.floor(budget * 0.4),
        foodCost: Math.floor(budget * 0.2),
        transportCost: Math.floor(budget * 0.2),
        activityCost: Math.floor(budget * 0.1),
        remainingBudget: Math.floor(budget * 0.1),
        costPerDay: Math.floor(budget / days),
        travelTip:
          travelTips[key] || "Plan your bookings early and keep emergency cash.",
        weather:
          weatherSuggestions[key] ||
          "Check local weather before travel and pack accordingly.",
        attractions:
          attractions[key] || [
            `Top attractions in ${destination}`,
            `Local markets in ${destination}`,
            `Popular food spots in ${destination}`,
          ],
        hotels:
          hotelRecommendations[key] || [
            "Budget stay near city center",
            "Comfort hotel near tourist attractions",
            "Premium hotel with good reviews",
          ],
      });

      setRating(0);
      setIsGenerating(false);
    }, 900);
  };

  const resetForm = () => {
    setForm({
      destination: "",
      budget: "",
      days: "",
      interest: "",
    });

    setResult(null);
    setRating(0);
    setIsGenerating(false);
  };

  const getMapLink = (place: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      place
    )}`;
  };

  const createTripText = () => {
    if (!result) return "";

    return `
AI Trip Planner

Destination: ${result.destination}
Budget: ₹${formatCurrency(result.budget)}
Days: ${result.days}
Interest: ${result.interest}
Cost Per Day: ₹${formatCurrency(result.costPerDay)}

Hotel Suggestion: ${result.hotel}
Transport Suggestion: ${result.transport}

Recommended Hotels:
${result.hotels.map((hotel: string) => `- ${hotel}`).join("\n")}

Weather Suggestion:
${result.weather}

Travel Tip:
${result.travelTip}

Budget Breakdown:
Hotel: ₹${formatCurrency(result.hotelCost)}
Food: ₹${formatCurrency(result.foodCost)}
Transport: ₹${formatCurrency(result.transportCost)}
Activities: ₹${formatCurrency(result.activityCost)}
Remaining: ₹${formatCurrency(result.remainingBudget)}

Attractions:
${result.attractions.map((item: string) => `- ${item}`).join("\n")}

Itinerary:
${result.itinerary.join("\n")}

Rating: ${rating ? `${rating}/5` : "Not rated yet"}
`;
  };

  const copyTripPlan = () => {
    navigator.clipboard.writeText(createTripText());
    alert("Trip plan copied successfully!");
  };

  const downloadPDF = () => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Please allow popups to download PDF.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Trip Plan</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; line-height: 1.6; }
            h1 { text-align: center; }
            pre { white-space: pre-wrap; font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          <h1>AI Trip Planner</h1>
          <pre>${createTripText()}</pre>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  const shareTrip = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "My Trip Plan",
        text: createTripText(),
      });
    } else {
      copyTripPlan();
      alert("Sharing not supported. Trip copied instead.");
    }
  };

  const saveFavorite = () => {
    if (!result) return;

    if (!favorites.includes(result.destination)) {
      setFavorites([...favorites, result.destination]);
      alert("Destination saved to favorites!");
    } else {
      alert("Destination already saved!");
    }
  };

  const removeFavorite = (destination: string) => {
    setFavorites(favorites.filter((item) => item !== destination));
  };

  const clearAllFavorites = () => {
  setFavorites([]);
};

const askAITripPlanner = async () => {
  if (!aiQuery.trim()) {
    alert("Please enter a travel query");
    return;
  }

  setAiLoading(true);
  setAiAnswer("");

  try {
    const response = await fetch("/api/ai-trip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: aiQuery,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Something went wrong");
      return;
    }

    setAiAnswer(data.answer);
  } catch (error) {
    console.error(error);
    alert("Failed to generate AI response");
  } finally {
    setAiLoading(false);
  }
};

return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-blue-50 via-white to-green-50 text-black"
      }`}
    >
      <nav
        className={`sticky top-0 z-50 border-b backdrop-blur-md ${
          darkMode
            ? "bg-black/70 border-gray-700"
            : "bg-white/70 border-gray-200"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-r from-blue-600 to-green-500 flex items-center justify-center text-white font-bold">
              ✈️
            </div>
            <div>
              <h1 className="font-bold text-lg">AI Trip Planner</h1>
              <p className="text-xs opacity-70">Smart Local Travel Assistant</p>
            </div>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-black text-white px-4 py-2 rounded-full text-sm"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-5 py-10">

  <section
    className={`mb-8 p-6 rounded-3xl shadow-xl ${
      darkMode ? "bg-gray-900" : "bg-white"
    }`}
  >
    <h2 className="text-2xl font-bold mb-3">
      🌐 AI Internet Trip Planner
    </h2>

    <p className="text-sm opacity-70 mb-4">
      Ask anything and get a trip plan using live internet search.
    </p>

    <textarea
      value={aiQuery}
      onChange={(e) => setAiQuery(e.target.value)}
      placeholder="Example: Plan a 5 day Goa trip with nightlife and beaches"
      className="w-full border p-4 rounded-xl text-black min-h-[120px]"
    />

    <button
      onClick={askAITripPlanner}
      className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-bold"
    >
      {aiLoading ? "Searching Internet..." : "Ask AI"}
    </button>

    {aiAnswer && (
      import ReactMarkdown from "react-markdown";
    )}
  </section>

  <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="pt-4">
            <p className="text-sm font-semibold text-blue-600 mb-3">
              COLLEGE PROJECT SUBMISSION 2026
            </p>

            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
              Plan smarter trips with budget, hotels, maps and itinerary.
            </h2>

            <p className="text-base md:text-lg opacity-80 leading-8 mb-6">
              Generate a complete travel plan using destination, budget, days
              and interests. Includes budget breakdown, map links, PDF download,
              favorites and dark mode.
            </p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                "Budget Planner",
                "Google Maps Links",
                "PDF Download",
                "Hotel Suggestions",
              ].map((item) => (
                <div
                  key={item}
                  className={`p-3 rounded-xl ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } shadow-sm`}
                >
                  ✅ {item}
                </div>
              ))}
            </div>
          </div>

          <div
            className={`p-6 md:p-8 rounded-3xl shadow-xl ${
              darkMode ? "bg-gray-900" : "bg-white"
            }`}
          >
            <h3 className="text-2xl font-bold mb-5">Create Your Trip</h3>

            <div className="flex flex-col gap-4">
              <input
                name="destination"
                value={form.destination}
                placeholder="Destination"
                className="border p-3 rounded-xl text-black"
                onChange={handleChange}
              />

              <input
                name="budget"
                value={form.budget}
                type="number"
                placeholder="Budget"
                className="border p-3 rounded-xl text-black"
                onChange={handleChange}
              />

              <input
                name="days"
                value={form.days}
                type="number"
                min="1"
                max="30"
                placeholder="Number of Days (Max 30)"
                className="border p-3 rounded-xl text-black"
                onChange={handleChange}
              />

              <select
                name="interest"
                value={form.interest}
                className="border p-3 rounded-xl text-black"
                onChange={handleChange}
              >
                <option value="">Select Interest</option>
                <option value="adventure">Adventure</option>
                <option value="food">Food</option>
                <option value="beach">Beach</option>
                <option value="historical">Historical</option>
                <option value="romantic">Romantic</option>
                <option value="family">Family</option>
                <option value="budget">Budget</option>
                <option value="luxury">Luxury</option>
              </select>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={generateTrip}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl w-full font-semibold transition"
                >
                  Generate Trip
                </button>

                <button
                  onClick={resetForm}
                  className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl w-full font-semibold transition"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </section>

        {isGenerating && (
          <section
            className={`mt-8 p-6 rounded-3xl text-center shadow-lg ${
              darkMode ? "bg-gray-900" : "bg-white"
            }`}
          >
            <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-semibold">Generating your smart trip plan...</p>
          </section>
        )}

        {favorites.length > 0 && (
  <div
    className={`mt-8 p-5 rounded-3xl shadow-md ${
      darkMode ? "bg-gray-900" : "bg-white"
    }`}
  >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">Favorite Destinations</h3>
              <button
                onClick={clearAllFavorites}
                className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {favorites.map((destination, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center p-3 rounded-xl ${
                    darkMode ? "bg-gray-800" : "bg-gray-100"
                  }`}
                >
                  <span>❤️ {destination}</span>

                  <button
                    onClick={() => removeFavorite(destination)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && (
          <section
  className={`mt-8 p-5 md:p-8 rounded-3xl shadow-xl ${
    darkMode ? "bg-gray-900" : "bg-white"
  }`}
>
            <h2 className="text-3xl font-bold mb-5">Your Smart Trip Plan</h2>

            <img
              src={
                destinationImages[result.destination.toLowerCase()] ||
                destinationImages.beach
              }
              alt={result.destination}
              className="w-full h-64 object-cover rounded-3xl mb-6"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Destination" value={result.destination} />
              <Info label="Budget" value={`₹${formatCurrency(result.budget)}`} />
              <Info label="Days" value={result.days} />
              <Info label="Interest" value={result.interest} />
              <Info
                label="Cost Per Day"
                value={`₹${formatCurrency(result.costPerDay)}`}
              />
              <Info label="Transport" value={result.transport} />
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card darkMode={darkMode} title="🏨 Recommended Hotels">
                <ul className="list-disc ml-5">
                  {result.hotels.map((hotel: string, index: number) => (
                    <li key={index}>{hotel}</li>
                  ))}
                </ul>
              </Card>

              <Card darkMode={darkMode} title="💡 Travel & Weather Tips">
                <p><b>Weather:</b> {result.weather}</p>
                <p className="mt-2"><b>Tip:</b> {result.travelTip}</p>
              </Card>

              <Card darkMode={darkMode} title="💰 Budget Breakdown">
                <p>🏨 Hotel: ₹{formatCurrency(result.hotelCost)}</p>
                <p>🍜 Food: ₹{formatCurrency(result.foodCost)}</p>
                <p>🚕 Transport: ₹{formatCurrency(result.transportCost)}</p>
                <p>🎯 Activities: ₹{formatCurrency(result.activityCost)}</p>
                <p>💰 Remaining: ₹{formatCurrency(result.remainingBudget)}</p>
              </Card>

              <Card darkMode={darkMode} title="📍 Attractions with Maps">
                <ul className="list-disc ml-5">
                  {result.attractions.map((place: string, index: number) => (
                    <li key={index}>
                      <a
                        href={getMapLink(place + " " + result.destination)}
                        target="_blank"
                        className="text-blue-500 underline"
                      >
                        {place}
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <Card darkMode={darkMode} title="🗓️ Itinerary">
              <ul className="list-disc ml-5">
                {result.itinerary.map((day: string, index: number) => (
                  <li key={index}>{day}</li>
                ))}
              </ul>
            </Card>

            <div className="mt-5">
              <h3 className="font-bold mb-2">Rate this Trip Plan</h3>
              <div className="text-3xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="mr-1"
                  >
                    {star <= rating ? "⭐" : "☆"}
                  </button>
                ))}
              </div>
              <p>{rating ? `You rated this ${rating}/5` : "Not rated yet"}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <button onClick={copyTripPlan} className="bg-black text-white p-3 rounded-xl">
                Copy Trip Plan
              </button>

              <button onClick={downloadPDF} className="bg-green-600 text-white p-3 rounded-xl">
                Download PDF
              </button>

              <button onClick={shareTrip} className="bg-blue-600 text-white p-3 rounded-xl">
                Share Trip
              </button>

              <button onClick={saveFavorite} className="bg-pink-600 text-white p-3 rounded-xl">
                ❤️ Save Destination
              </button>
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card darkMode={darkMode} title="📖 About This Project">
            <p>
              AI Trip Planner is a smart travel planning application developed
              using Next.js, React, TypeScript and Tailwind CSS. It helps users
              create personalized travel plans based on destination, budget,
              duration and interests.
            </p>
          </Card>

          <Card darkMode={darkMode} title="🛠️ Technologies Used">
            <div className="grid grid-cols-2 gap-3">
              {["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel", "GitHub"].map(
                (tech) => (
                  <div
                    key={tech}
                    className={`p-3 rounded-xl text-center font-semibold ${
                      darkMode ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    {tech}
                  </div>
                )
              )}
            </div>
          </Card>
        </section>
      </main>

      <footer
        className={`mt-10 py-6 text-center text-sm ${
          darkMode ? "bg-black text-gray-300" : "bg-white text-gray-600"
        }`}
      >
        <p>
          Developed by <b>Ayush Mishra</b>
        </p>
        <p>AI Trip Planner Project | College Submission 2026</p>
      </footer>
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="p-4 rounded-2xl bg-blue-50 text-black">
      <p className="text-xs uppercase text-gray-500">{label}</p>
      <p className="font-bold mt-1">{value}</p>
    </div>
  );
}

function Card({
  title,
  children,
  darkMode,
}: {
  title: string;
  children: React.ReactNode;
  darkMode: boolean;
}) {
  return (
    <div
      className={`mt-5 p-5 rounded-3xl shadow-sm ${
        darkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <h3 className="font-bold text-lg mb-3">{title}</h3>
      <div className="leading-7 text-sm">{children}</div>
    </div>
  );
}