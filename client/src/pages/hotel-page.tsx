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

export default function HotelPage() {
  const [, params] = useRoute("/hotels/:id");
  const { data: hotel } = useQuery<Hotel>({
    queryKey: [`/api/hotels/${params?.id}`],
  });

  if (!hotel) return null;

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="h-[40vh] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${hotel.mainImage})` }}
      >
        {hotel.virtualTourUrl && (
          <div className="absolute top-4 right-4">
            <a
              href={hotel.virtualTourUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" className="gap-2">
                <Video className="h-4 w-4" />
                Take Virtual Tour
              </Button>
            </a>
          </div>
        )}
      </div>

      <main className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hotels
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-3xl">{hotel.name}</CardTitle>
              <div className="flex items-center gap-1 text-primary">
                <Star className="fill-current h-5 w-5" />
                <span className="text-lg">{(hotel.rating ?? 0).toFixed(1)}</span>
              </div>
            </div>
            <CardDescription>{hotel.location}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg">{hotel.description}</p>

            {hotel.amenities && hotel.amenities.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {hotel.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="text-sm bg-secondary/10 px-3 py-2 rounded-md"
                    >
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
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