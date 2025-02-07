import { Link } from "wouter";
import { Hotel } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <Card className="overflow-hidden">
      <img
        src={hotel.mainImage}
        alt={hotel.name}
        className="w-full h-48 object-cover"
      />
      <CardHeader>
        <CardTitle>{hotel.name}</CardTitle>
        <CardDescription>{hotel.location}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1 text-primary">
          <Star className="fill-current h-4 w-4" />
          <span>{(hotel.rating ?? 0).toFixed(1)}</span>
        </div>
        <p className="mt-2 line-clamp-2">{hotel.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div>
          <p className="text-lg font-bold">${hotel.pricePerNight}</p>
          <p className="text-sm text-muted-foreground">per night</p>
        </div>
        <Link href={`/hotels/${hotel.id}`}>
          <Button>View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}