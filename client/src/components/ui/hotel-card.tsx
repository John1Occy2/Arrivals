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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Star, ChevronDown, ChevronUp, Video } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="overflow-hidden group">
      <div className="relative">
        <img
          src={hotel.mainImage}
          alt={hotel.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {hotel.virtualTourUrl && (
          <div className="absolute top-2 right-2 flex gap-2">
            <a
              href={hotel.virtualTourUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="secondary" className="gap-2">
                <Video className="h-4 w-4" />
                Virtual Tour
              </Button>
            </a>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle>{hotel.name}</CardTitle>
        <CardDescription>{hotel.location}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1 text-primary mb-2">
          <Star className="fill-current h-4 w-4" />
          <span>{(hotel.rating ?? 0).toFixed(1)}</span>
        </div>
        <p className="line-clamp-2 mb-4">{hotel.description}</p>

        {hotel.amenities && hotel.amenities.length > 0 && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="w-full gap-2">
                View Amenities
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 ml-auto" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-auto" />
                )}
              </Button>
            </CollapsibleTrigger>
            <AnimatePresence>
              {isOpen && (
                <CollapsibleContent forceMount>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-2"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {hotel.amenities.map((amenity) => (
                        <div
                          key={amenity}
                          className="text-sm text-muted-foreground bg-secondary/10 px-2 py-1 rounded"
                        >
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </Collapsible>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div>
          <p className="text-lg font-bold">${hotel.pricePerNight}</p>
          <p className="text-sm text-muted-foreground">per night</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/hotels/${hotel.id}`}>
            <Button variant="outline">View Details</Button>
          </Link>
          <Link href={`/hotels/${hotel.id}/book`}>
            <Button>Book Now</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}