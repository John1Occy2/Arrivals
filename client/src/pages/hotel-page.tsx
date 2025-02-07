import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Hotel } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Video, Star } from "lucide-react";
import { motion } from "framer-motion";

// Mapping of amenities to their representative images
const amenityImages: Record<string, string> = {
  "Wi-Fi": "https://images.unsplash.com/photo-1563986768609-322da13575f3",
  "Pool": "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7",
  "Restaurant": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
  "Spa": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874",
  "Gym": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
  "Room Service": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
  "Bar": "https://images.unsplash.com/photo-1543007630-9710e4a00a20",
  "Conference Room": "https://images.unsplash.com/photo-1517502884422-41eaead166d4",
  "Parking": "https://images.unsplash.com/photo-1506521781263-d8422e82f27a",
  "24/7 Reception": "https://images.unsplash.com/photo-1566073771259-6a8506099945",
  "Air Conditioning": "https://images.unsplash.com/photo-1551816230-ef5deaed4a26",
  "Laundry Service": "https://images.unsplash.com/photo-1545173168-9f1947eebb7f",
  "Safari Tours": "https://images.unsplash.com/photo-1516426122078-c23e76319801",
  "Beach Access": "https://images.unsplash.com/photo-1519046904884-53103b34b206",
  "Historical Tours": "https://images.unsplash.com/photo-1552863045-991883e6fb16"
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function HotelPage() {
  const [, params] = useRoute("/hotels/:id");
  const { data: hotel } = useQuery<Hotel>({
    queryKey: [`/api/hotels/${params?.id}`],
  });

  if (!hotel) return null;

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="h-[30vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${hotel.mainImage})` }}
      />

      <main className="container mx-auto px-4 py-8">
        <Link href={`/hotels/${hotel.id}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hotel
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl">{hotel.name}</CardTitle>
                <CardDescription>{hotel.location}</CardDescription>
              </div>
              {hotel.virtualTourUrl && (
                <a
                  href={hotel.virtualTourUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4"
                >
                  <Button variant="secondary" className="gap-2">
                    <Video className="h-4 w-4" />
                    Take Virtual Tour
                  </Button>
                </a>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <Star className="fill-current h-5 w-5" />
              <span className="text-lg font-semibold">{(hotel.rating ?? 0).toFixed(1)}</span>
            </div>

            <p className="text-lg">{hotel.description}</p>

            {hotel.amenities && hotel.amenities.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <h3 className="font-semibold text-xl mb-4">Amenities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hotel.amenities.map((amenity) => (
                    <motion.div
                      key={amenity}
                      variants={itemVariants}
                      className="relative group overflow-hidden rounded-lg"
                    >
                      <div 
                        className="aspect-video bg-cover bg-center"
                        style={{ 
                          backgroundImage: `url(${amenityImages[amenity] || 'https://images.unsplash.com/photo-1564501049412-61c2a3083791'})` 
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white font-semibold text-lg">
                          {amenity}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="flex justify-between items-center mt-6 pt-6 border-t">
              <div>
                <p className="text-2xl font-bold">${hotel.pricePerNight}</p>
                <p className="text-sm text-muted-foreground">per night</p>
              </div>
              <Link href={`/hotels/${hotel.id}/book`}>
                <Button size="lg">Book Now</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}