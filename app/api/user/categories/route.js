const mockCategories = [
  { id: 1, name: "Earthquake", description: "Ground shaking", icon: "🌏" },
  { id: 2, name: "Fire", description: "Structural or wild fire", icon: "🔥" },
  { id: 3, name: "Flood", description: "Water, road blocked", icon: "🌊" },
  { id: 4, name: "Sinkhole", description: "Ground collapse", icon: "🕳️" },
];

export async function GET() {
  return Response.json(mockCategories);
}
