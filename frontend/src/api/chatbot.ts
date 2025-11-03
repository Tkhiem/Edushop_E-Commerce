// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   const { prompt } = req.body;
//   const apiKey = process.env.GEMMA_API_KEY;

//   try {
//     const response = await fetch(
//       "https://generativelanguage.googleapis.com/v1beta/models/gemma-3-12b-it:generateContent",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${apiKey}`,
//         },
//         body: JSON.stringify({
//           contents: [{ parts: [{ text: prompt }] }],
//         }),
//       }
//     );

//     const data = await response.json();
//     res.status(200).json(data);
//   } catch (error) {
//     console.error("Gemma API error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }
