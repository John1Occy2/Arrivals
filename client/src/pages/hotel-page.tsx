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
import { ArrowLeft } from "lucide-react";

export default function HotelPage() {
  const [, params] = useRoute("/hotels/:id");
  const { data: hotel } = useQuery<Hotel>({
    queryKey: [`/api/hotels/${params?.id}`],
  });

  if (!hotel) return null;

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="h-[40vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${hotel.mainImage})` }}
      />
      
      <main className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hotels
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{hotel.name}</CardTitle>
            <CardDescription>{hotel.location}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">{hotel.description}</p>
            <div className="flex justify-between items-center">
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
